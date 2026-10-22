#!/usr/bin/env bash
# Lädt den Ordner website/ per SFTP (oder FTPS) zu All-Inkl hoch.
#
# Auf dem Server wird nur gelöscht, was ein früherer Lauf dieses Skripts selbst
# hochgeladen hat (Liste in .visustruct-deploy-manifest.txt im Zielordner), und
# veraltete Build-Dateien in app/assets/.
# Fremde Dateien im Zielordner und alles außerhalb davon bleiben unangetastet.
#
# Umgebung:
#   DEPLOY_HOST, DEPLOY_USER, LFTP_PASSWORD   Pflicht
#   DEPLOY_PROTOCOL  sftp (Standard) oder ftps
#   DEPLOY_DIR       Zielordner relativ zum Login, Standard visustruct.org
#   SOURCE_DIR       Standard website
#   DRY_RUN=1        nur anzeigen, nichts hochladen oder löschen
set -euo pipefail

: "${DEPLOY_HOST:?DEPLOY_HOST fehlt}"
: "${DEPLOY_USER:?DEPLOY_USER fehlt}"
: "${LFTP_PASSWORD:?LFTP_PASSWORD fehlt}"
export LFTP_PASSWORD

PROTOCOL="${DEPLOY_PROTOCOL:-sftp}"
REMOTE_DIR="${DEPLOY_DIR:-visustruct.org}"
SOURCE_DIR="${SOURCE_DIR:-website}"
DRY_RUN="${DRY_RUN:-0}"
MANIFEST=".visustruct-deploy-manifest.txt"

case "$REMOTE_DIR" in
  ""|"/"|"."|"./"|"~"|*..*|*'"'*) echo "Ungültiger Zielordner: '$REMOTE_DIR'" >&2; exit 1 ;;
esac
[ -f "$SOURCE_DIR/index.html" ] || { echo "$SOURCE_DIR/index.html fehlt" >&2; exit 1; }

case "$PROTOCOL" in
  sftp) URL="sftp://$DEPLOY_HOST"
        SETTINGS="set sftp:auto-confirm yes" ;;
  ftps) URL="ftp://$DEPLOY_HOST"
        SETTINGS="set ftp:ssl-force true; set ftp:ssl-protect-data true; set ssl:verify-certificate ${DEPLOY_VERIFY_CERT:-yes}" ;;
  *) echo "DEPLOY_PROTOCOL muss sftp oder ftps sein" >&2; exit 1 ;;
esac

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

connect="$SETTINGS; set net:max-retries 3; set net:timeout 30; set cmd:fail-exit yes
open --env-password -u \"$DEPLOY_USER\" $URL
cd \"$REMOTE_DIR\""

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
  lftp -c "$connect; mirror -R --dry-run --no-perms --exclude-glob .DS_Store \"$SOURCE_DIR\" ."
  echo "Trockenlauf: nichts geändert."
  exit 0
fi

# Erst alles außer HTML (Skripte, Bilder, CSS), dann die Seiten selbst,
# damit keine Seite live ist, deren Assets noch fehlen.
lftp <<LFTP
$connect
mirror -R --no-perms --parallel=4 --exclude-glob .DS_Store --exclude-glob *.html "$SOURCE_DIR" .
mirror -R --no-perms --parallel=4 --exclude-glob .DS_Store "$SOURCE_DIR" .
source "$work/rm.lftp"
put "$work/new" -o $MANIFEST
LFTP
echo "Fertig."
