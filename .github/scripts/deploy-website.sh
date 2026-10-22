#!/usr/bin/env bash
# Lädt den Ordner website/ per FTPS (oder SFTP) zu All-Inkl hoch.
#
# Auf dem Server wird nur gelöscht, was ein früherer Lauf dieses Skripts selbst
# hochgeladen hat (Liste in .visustruct-deploy-manifest.txt im Zielordner), und
# veraltete Build-Dateien in app/assets/.
# Fremde Dateien im Zielordner und alles außerhalb davon bleiben unangetastet.
#
# Umgebung:
#   DEPLOY_HOST, DEPLOY_USER, LFTP_PASSWORD   Pflicht
#   DEPLOY_PROTOCOL  auto (Standard: erst SFTP, dann FTPS), sftp oder ftps
#   DEPLOY_DIR       Zielordner relativ zum Login; ohne Angabe visustruct.org
#                    oder der Startordner, je nachdem, wo die Webseite liegt
#   SOURCE_DIR       Standard website
#   DRY_RUN=1        nur anzeigen, nichts hochladen oder löschen
set -euo pipefail

# Beim Einfügen ins Secret-Feld rutscht leicht ein Zeilenumbruch mit hinein
DEPLOY_USER="$(printf '%s' "${DEPLOY_USER:-}" | tr -d '\r\n' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
LFTP_PASSWORD="$(printf '%s' "${LFTP_PASSWORD:-}" | tr -d '\r\n')"
: "${DEPLOY_HOST:?DEPLOY_HOST fehlt}"
: "${DEPLOY_USER:?DEPLOY_USER fehlt}"
: "${LFTP_PASSWORD:?LFTP_PASSWORD fehlt}"
export LFTP_PASSWORD

PROTOCOL="${DEPLOY_PROTOCOL:-auto}"
REMOTE_DIR="${DEPLOY_DIR:-}"
SOURCE_DIR="${SOURCE_DIR:-website}"
DRY_RUN="${DRY_RUN:-0}"
MANIFEST=".visustruct-deploy-manifest.txt"

case "$REMOTE_DIR" in
  "/"|"~"|*..*|*'"'*) echo "Ungültiger Zielordner: '$REMOTE_DIR'" >&2; exit 1 ;;
esac
[ -f "$SOURCE_DIR/index.html" ] || { echo "$SOURCE_DIR/index.html fehlt" >&2; exit 1; }

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

connect_for() {
  local url settings
  case "$1" in
    sftp) url="sftp://$DEPLOY_HOST"
          settings="set sftp:auto-confirm yes" ;;
    ftps) url="ftp://$DEPLOY_HOST"
          settings="set ftp:ssl-force true; set ftp:ssl-protect-data true; set ssl:verify-certificate ${DEPLOY_VERIFY_CERT:-yes}" ;;
    *) echo "DEPLOY_PROTOCOL muss auto, sftp oder ftps sein" >&2; exit 1 ;;
  esac
  printf '%s' "$settings; set net:max-retries 3; set net:timeout 30; set cmd:fail-exit yes
open --env-password -u \"$DEPLOY_USER\" $url"
}

# auto: SFTP versuchen, bei All-Inkl geht das nur mit SSH-Zugang; sonst FTPS
if [ "$PROTOCOL" = "auto" ]; then
  for p in sftp ftps; do
    if lftp -c "$(connect_for $p); cls -1 >/dev/null" 2> "$work/probe-$p"; then
      PROTOCOL=$p; break
    fi
    echo "$p: $(grep -v '^$' "$work/probe-$p" | tail -n 1)" >&2
  done
  if [ "$PROTOCOL" = "auto" ]; then
    echo "::error::Anmeldung fehlgeschlagen. SFTP: $(grep -v '^$' "$work/probe-sftp" | tail -n 1) FTPS: $(grep -v '^$' "$work/probe-ftps" | tail -n 1)"
    exit 1
  fi
fi
echo "Verbindung über $PROTOCOL"

# Zielordner: ohne DEPLOY_DIR erst visustruct.org, dann der Startordner des
# Logins (FTP-Benutzer, die direkt in visustruct.org landen). Hochgeladen wird
# nur in einen Ordner, in dem schon VisuStruct liegt (index.html nennt
# VisuStruct oder ein früherer Lauf hat seine Dateiliste hinterlassen).
looks_like_site() {
  lftp -c "$(connect_for "$PROTOCOL"); set cmd:fail-exit no; cd \"$1\" || exit 1; cat index.html" 2>/dev/null | grep -q VisuStruct \
    || lftp -c "$(connect_for "$PROTOCOL"); cd \"$1\"; cls -1 $MANIFEST" >/dev/null 2>&1
}
if [ -z "$REMOTE_DIR" ]; then
  for d in visustruct.org .; do
    if looks_like_site "$d"; then REMOTE_DIR="$d"; break; fi
  done
  if [ -z "$REMOTE_DIR" ]; then
    echo "::error::Kein Zielordner gefunden: weder visustruct.org noch der Startordner des Logins enthalten die VisuStruct-Webseite. Bitte die Variable DEPLOY_DIR setzen."
    exit 1
  fi
elif ! looks_like_site "$REMOTE_DIR"; then
  echo "::error::Im Zielordner '$REMOTE_DIR' liegt keine VisuStruct-Webseite (index.html), es wird nichts hochgeladen."
  exit 1
fi
echo "Zielordner: $REMOTE_DIR"
connect="$(connect_for "$PROTOCOL")
cd \"$REMOTE_DIR\""

# Fehlermeldungen von lftp zusätzlich als Annotation ausgeben (in der Übersicht
# des Laufs sichtbar, ohne das Log zu öffnen)
fail() {
  local msg
  msg="$(grep -v '^$' "$work/err" | tail -n 3 | tr '\n' ' ')"
  echo "::error::Upload fehlgeschlagen: ${msg:-unbekannter Fehler}"
  exit 1
}

# Neue Dateiliste
(cd "$SOURCE_DIR" && find . -type f ! -name .DS_Store ! -name "$MANIFEST" | sed 's|^\./||' | LC_ALL=C sort) > "$work/new"

# Alte Dateiliste vom Server (fehlt beim ersten Lauf)
if ! lftp -c "$connect; get $MANIFEST -o \"$work/old\"" 2>/dev/null; then
  echo "Keine frühere Dateiliste auf dem Server gefunden, es wird nichts gelöscht."
  : > "$work/old"
fi

# app/assets/ wird von Vite bei jedem Build komplett neu erzeugt (Dateinamen mit
# Hash). Was dort auf dem Server liegt und nicht mehr zum Build gehört, ist veraltet,
# auch wenn es noch von Hand hochgeladen wurde.
lftp -c "$connect; cls -1 app/assets/" 2>/dev/null | sed 's|^.*/||; s|^|app/assets/|' | grep -v '/$' >> "$work/old" || true

# Dateien, die früher hochgeladen wurden und jetzt nicht mehr dazugehören
LC_ALL=C sort -u "$work/old" | LC_ALL=C comm -23 - "$work/new" > "$work/stale"
: > "$work/rm.lftp"
while IFS= read -r f; do
  case "$f" in
    ""|/*|*..*|*'"'*|*'\'*) echo "Überspringe verdächtigen Eintrag: '$f'" >&2; continue ;;
  esac
  echo "rm -f \"$f\"" >> "$work/rm.lftp"
done < "$work/stale"

echo "Dateien: $(wc -l < "$work/new") hochladen, $(wc -l < "$work/rm.lftp") veraltete löschen (Ziel: $REMOTE_DIR)"
sed 's/^rm -f /  löschen: /' "$work/rm.lftp"

if [ "$DRY_RUN" = "1" ]; then
  lftp -c "$connect; mirror -R --dry-run --no-perms --exclude-glob .DS_Store \"$SOURCE_DIR\" ." 2> >(tee "$work/err" >&2) || fail
  echo "Trockenlauf: nichts geändert."
  exit 0
fi

# Erst alles außer HTML (Skripte, Bilder, CSS), dann die Seiten selbst,
# damit keine Seite live ist, deren Assets noch fehlen.
lftp 2> >(tee "$work/err" >&2) <<LFTP || fail
$connect
mirror -R --no-perms --parallel=4 --exclude-glob .DS_Store --exclude-glob *.html "$SOURCE_DIR" .
mirror -R --no-perms --parallel=4 --exclude-glob .DS_Store "$SOURCE_DIR" .
source "$work/rm.lftp"
put "$work/new" -o $MANIFEST
LFTP
echo "Fertig."
