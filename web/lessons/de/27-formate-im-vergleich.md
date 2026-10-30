---
titel: Formate im Vergleich
bereich: Dateien
kurz: Dieselben Daten als txt, CSV und JSON vergleichen, das passende Format wählen und eine Datei in ein anderes Format umwandeln.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- dieselben Daten als txt, CSV und JSON erkennen
- Stärken und Schwächen von txt, CSV und JSON vergleichen
- eine CSV-Datei in Sätze umwandeln
- eine CSV-Datei in JSON umwandeln
:::

## Dreimal dieselben Tiere

Ludwig hat die Tiere der Burg in drei Dateien gespeichert. In allen steht dasselbe, nur anders aufgeschrieben.

Als Text, so wie man es einem Menschen schreiben würde:

::: datei tiere.txt
Ludwig (Geißbock) ist 7 Jahre alt.
Zora (Ziege) ist 6 Jahre alt.
Fuchs (Rotfuchs) ist 4 Jahre alt.
:::

Als Tabelle in CSV:

::: datei tiere.csv
Name;Art;Alter
Ludwig;Geißbock;7
Zora;Ziege;6
Fuchs;Rotfuchs;4
:::

Als JSON:

::: datei tiere.json
[
  {"name": "Ludwig", "art": "Geißbock", "alter": 7},
  {"name": "Zora", "art": "Ziege", "alter": 6},
  {"name": "Fuchs", "art": "Rotfuchs", "alter": 4}
]
:::

## Was kann welches Format?

| | txt | CSV | JSON |
|---|---|---|---|
| Für Menschen gut lesbar | ja | geht so | geht so |
| Feste Ordnung für Programme | nein | ja, Spalten | ja, Schlüssel |
| Was bedeutet ein Wert? | steht im Satz | steht in der Kopfzeile | steht direkt davor |
| Verschachteln (Liste in einem Eintrag) | nein | schwer | ja |
| Öffnen in Excel | nein | ja | nein |
| Lesen in Java | Scanner, BufferedReader | dazu `split` | String-Methoden oder eine Bibliothek |
| Größe | klein | am kleinsten | am größten |

Kurz gesagt:

- **txt** für Texte, die Menschen lesen: Briefe, Notizen, ein Logbuch.
- **CSV** für Tabellen: Noten, Messwerte, eine Bestenliste. Jede Zeile hat dieselben Spalten.
- **JSON** für Daten mit Struktur: Spielstände, Einstellungen, alles, was zwischen Programmen und im Web hin- und hergeht.

::: ludwig
Wenn deine Wetter-App die Temperatur holt, kommt die Antwort fast immer als JSON. Und wenn die Lehrkraft die Noten aus dem Schulprogramm exportiert, bekommt sie oft eine CSV-Datei.
:::

## Übung: Aus CSV werden Sätze

::: übung l27-java-saetze
titel: Aus CSV werden Sätze
code: java
auftrag: Wandle `tiere.csv` in Text um. Schreibe für jedes Tier einen Satz wie **Ludwig (Geißbock) ist 7 Jahre alt.** in die Datei `saetze.txt`. Gib am Ende **3 Sätze gespeichert** aus.
start: l27-java-saetze-start.visustruct
test: - -> 3 Sätze gespeichert
datei: saetze.txt -> Ludwig (Geißbock) ist 7 Jahre alt. | Zora (Ziege) ist 6 Jahre alt. | Fuchs (Rotfuchs) ist 4 Jahre alt.
braucht: whileSchleife
tipp: Die Kopfzeile ist im Startcode schon übersprungen. Zerlege jede Zeile mit `String[] teile = zeile.split(";");`.
tipp: Der Satz ist `teile[0] + " (" + teile[1] + ") ist " + teile[2] + " Jahre alt."`. Zähle mit `anzahl++` mit und lies am Ende der Schleife die nächste Zeile.
lösung: l27-java-saetze-loesung.visustruct
:::

## Übung: Aus CSV wird JSON

::: übung l27-java-json
titel: Aus CSV wird JSON
code: java
auftrag: Wandle `tiere.csv` in JSON um und speichere es in `tiere-neu.json`, genau wie `tiere.json` oben. Gib am Ende **3 Tiere gespeichert** aus.
start: l27-java-json-start.visustruct
test: - -> 3 Tiere gespeichert
datei: tiere-neu.json -> [ | {"name": "Ludwig", "art": "Geißbock", "alter": 7}, | {"name": "Zora", "art": "Ziege", "alter": 6}, | {"name": "Fuchs", "art": "Rotfuchs", "alter": 4} | ]
braucht: forSchleife, verzweigung
tipp: `zeilen[0]` ist die Kopfzeile. Beginne die for-Schleife deshalb bei `i = 1` und zerlege `zeilen[i]` mit `split(";")`.
tipp: Baue den Eintrag wie in Lektion 26 mit `\"`. Das Alter ist eine Zahl und steht ohne Anführungszeichen. Ein Komma hängst du nur an, wenn `i < zeilen.length - 1` ist.
lösung: l27-java-json-loesung.visustruct
:::

## Spiel: Welches Format passt?

::: spiel frage
titel: Spiel: Welches Format passt?
intro: Ludwig will Daten speichern und weiß nicht, welches Format er nehmen soll. Hilf ihm. Sechs Runden.
antworten: txt | CSV | JSON

runde:
frage: Die Noten der ganzen Klasse sollen in Excel geöffnet werden.
richtig: CSV
> Noten sind eine Tabelle, und Excel öffnet CSV-Dateien direkt.

runde:
frage: Ludwig schreibt Zora einen Brief.
richtig: txt
> Ein Brief ist Text für Menschen. Er braucht keine Spalten und keine Schlüssel.

runde:
frage: Ein Spielstand mit Name, Level und einer Liste aller gesammelten Schlüssel.
richtig: JSON
> Eine Liste in einem Eintrag lässt sich in JSON verschachteln. In CSV passt sie nur schwer in eine Zelle.

runde:
frage: Ein Messgerät speichert jede Minute Uhrzeit und Temperatur, ein ganzes Jahr lang.
richtig: CSV
> Viele gleiche Zeilen mit denselben Spalten: CSV ist dafür am kleinsten. JSON würde die Schlüssel in jeder Zeile wiederholen.

runde:
frage: Eine Wetter-App holt die Vorhersage von einem Server im Internet.
richtig: JSON
> JSON ist der Standard im Web. Fast jede App bekommt ihre Daten so.

runde:
frage: Das Logbuch der Burg, in dem jeder Eintrag ein kurzer Satz ist.
richtig: txt
> Jede Zeile ist ein Satz für Menschen. Gelesen wird sie Zeile für Zeile, wie in Lektion 24.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann dieselben Daten als txt, CSV und JSON erkennen. → Dreimal dieselben Tiere
- Ich kann Stärken und Schwächen von txt, CSV und JSON vergleichen. → Was kann welches Format?
- Ich kann eine CSV-Datei in Sätze umwandeln. → Übung: Aus CSV werden Sätze
- Ich kann eine CSV-Datei in JSON umwandeln. → Übung: Aus CSV wird JSON
:::

## Wissenstest

::: quiz
? Welches Format öffnet Excel direkt als Tabelle?
→ Was kann welches Format?
- [ ] txt
- [x] CSV
- [ ] JSON

? Warum ist eine JSON-Datei meist größer als eine CSV-Datei mit denselben Daten?
→ Was kann welches Format?
- [ ] Weil JSON mehr Zahlen speichert.
- [x] Weil die Schlüssel in jedem Eintrag wiederholt werden.
- [ ] Weil JSON keine Kommas benutzt.

? In welchem Format sagt jeder Wert selbst, was er bedeutet?
→ Was kann welches Format?
- [ ] txt
- [ ] CSV
- [x] JSON
> In JSON steht der Schlüssel direkt vor dem Wert, zum Beispiel "alter": 7.

? Ordne jedem Zweck ein Format zu.
→ Was kann welches Format?
= ein Brief an Zora -> txt
= die Notenliste der Klasse -> CSV
= ein Spielstand mit Listen -> JSON
:::
