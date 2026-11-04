---
titel: Wie geht es weiter?
bereich: Ausblick
kurz: Zurückblicken, was du mit dem mBot2 gelernt hast, und sehen, was in VisuStruct noch auf dich wartet.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- sagen, welche Grundlagen der Programmierung ich mit dem mBot2 gelernt habe
- einen Fehler in einem Roboterprogramm allein finden und reparieren
- die Themen nennen, die in VisuStruct noch auf mich warten
:::

## Das kannst du jetzt

Glückwunsch, du hast alle Roboter-Lektionen geschafft! Mit dem mBot2 hast du die **Grundlagen der strukturierten Programmierung** gelernt:

- ein **Struktogramm** lesen und bauen und es mit dem **Schreibtischtest** prüfen,
- **Sequenz**, **Verzweigung** und **Fallauswahl**, Bedingungen mit **und**, **oder** und **nicht**,
- die Schleifen **for**, **while** und **do-while**, auch ineinander verschachtelt, und den Aussprung mit **break**,
- **Variablen**, **Datentypen** und **Konstanten** mit `final`, Zählen, Summieren und den größten Wert finden,
- **Arrays** und **Zeichenketten**,
- eigene **Methoden** mit Parametern und Rückgabewert.

Das alles gilt nicht nur für Roboter. Jedes Java-Programm ist aus genau diesen Bausteinen gebaut, auch ein Spiel oder eine App.

::: angeberwissen
Määäh, weißt du, was du mit dem mBot2 eigentlich gebaut hast? Ein **eingebettetes System**: einen kleinen Computer, der in einem Gerät steckt und mit Sensoren seine Umwelt misst. Solche Systeme stecken in Waschmaschinen, Autos und Herzschrittmachern. In einem modernen Auto sind es über hundert. Und programmiert werden sie mit genau den Bausteinen, die du jetzt kennst.
:::

## Noch einmal: Warum läuft das nicht?

Zum Schluss eine letzte Fehlersuche. Diesmal ist es ein Fehler, den auch Profis oft machen.

::: übung vb-fehler-23-wie-geht-es-weiter
titel: Warum läuft das nicht?
code: java
auftrag: Das Programm soll bis kurz vor die Wand fahren, aber es läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-23-wie-geht-es-weiter-start.visustruct
welt: wand-kurz, wand-mittel, wand-lang
tipp: Lies die Fehlermeldung genau. Vergleiche den Sensor mit den anderen Befehlen: Was steht hinter `mbot.forward`?
tipp: Hinter einem Befehl stehen immer runde Klammern, auch wenn nichts darin steht. Richtig heißt es `mbot.getDistance() > 15`.
lösung: vb-bis-wand-loesung.visustruct
:::

## Was noch fehlt

Einige Themen der Programmierung haben mit dem Roboter wenig zu tun. Du findest sie in **VisuStruct**, der Welt ohne Roboter. Weil du die Grundlagen schon kennst, kommst du dort schnell voran. Die Links öffnen sich in einem neuen Fenster.

- **Andere Darstellungen:** Algorithmen als Ablaufplan mit Pfeilen oder als Text aufschreiben, in [„PAP und Pseudocode“](?visustruct&lektion=01-weitere-darstellungen).
- **Eingabe mit der Tastatur:** Werte beim Ausführen abfragen, in [„Eingabe und Ausgabe“](?visustruct&lektion=06-eingabe-und-ausgabe).
- **Tabellen im Speicher:** Arrays mit Zeilen und Spalten, zum Beispiel für einen Kinosaal, in [„Zweidimensionale Arrays“](?visustruct&lektion=16-zweidimensionale-arrays).
- **Suchen und Sortieren:** einen Wert schnell finden und eine Liste der Größe nach ordnen, in [„Suchen und Sortieren“](?visustruct&lektion=19-suchen-und-sortieren).
- **Andere Sprachen:** dasselbe Programm in Python und JavaScript, in [„Python und JavaScript“](?visustruct&lektion=21-python-und-javascript).
- **Abstürze abfangen:** was passiert, wenn jemand „abc“ statt einer Zahl eintippt, in [„Wenn das Programm abstürzt: try und catch“](?visustruct&lektion=22-try-und-catch).
- **Dateien:** Text, Tabellen und Daten lesen und speichern, ab [„Text einlesen und speichern“](?visustruct&lektion=23-text-einlesen-und-speichern) über [„Tabellen als CSV“](?visustruct&lektion=25-tabellen-als-csv) bis [„Daten als JSON“](?visustruct&lektion=26-json).
- **Fenster mit Knöpfen:** eigene Programme mit Fenster, Textfeld und Knopf, ab [„Dein erstes Fenster“](?visustruct&lektion=28-erstes-fenster) bis [„Model View Controller“](?visustruct&lektion=40-model-view-controller).

> Den mBot2 brauchst du dafür nicht. Du kannst aber jederzeit zurückkommen und ihm neue Kunststücke beibringen.

## Spiel: Welche Welt?

::: spiel frage
titel: Spiel: Welche Welt?
intro: Ludwig hat Ideen für neue Programme. Lernst du das mit dem mBot2 in VisuBot oder ohne Roboter in VisuStruct? Acht Runden.
antworten: VisuBot | VisuStruct

runde:
frage: „Fahre bis zur Wand und piepe dann.“
richtig: VisuBot
> Abstandssensor, Motoren und Lautsprecher: Das ist ein Fall für den mBot2.

runde:
frage: „Ein Fenster mit einem Knopf, der bis 10 zählt.“
richtig: VisuStruct
> Fenster mit Knöpfen baust du mit Swing in VisuStruct.

runde:
frage: „Spiele eine Melodie, die in einem Array steht.“
richtig: VisuBot
> Arrays und Melodien hast du mit dem Lautsprecher des mBot2 gelernt.

runde:
frage: „Lies die Noten der Klasse aus einer CSV-Datei.“
richtig: VisuStruct
> Dateien lesen und speichern lernst du in VisuStruct.

runde:
frage: „Tippt jemand ‚abc‘ statt einer Zahl ein, soll das Programm nicht abstürzen.“
richtig: VisuStruct
> Abstürze fängst du mit try und catch ab. Das steht in VisuStruct.

runde:
frage: „Folge mit dem Liniensensor einer schwarzen Linie.“
richtig: VisuBot
> Der Liniensensor sitzt unter dem mBot2.

runde:
frage: „Sortiere zehn Zahlen der Größe nach.“
richtig: VisuStruct
> Suchen und Sortieren steht in VisuStruct. Den größten Wert finden kannst du aber schon.

runde:
frage: „Zeichne den Ablauf als Plan mit Pfeilen.“
richtig: VisuStruct
> Das ist ein PAP. Ihn lernst du in VisuStruct in „PAP und Pseudocode“.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann sagen, welche Grundlagen der Programmierung ich mit dem mBot2 gelernt habe. → Das kannst du jetzt
- Ich kann einen Fehler in einem Roboterprogramm allein finden und reparieren. → Noch einmal: Warum läuft das nicht?
- Ich kann die Themen nennen, die in VisuStruct noch auf mich warten. → Was noch fehlt
:::

## Wissenstest

::: quiz
? Gelten die Bausteine aus den Roboter-Lektionen auch für Programme ohne Roboter?
→ Das kannst du jetzt
- [x] Ja, jedes Java-Programm ist aus Sequenz, Verzweigung, Schleife, Variablen und Methoden gebaut
- [ ] Nein, ohne Roboter braucht man ganz andere Befehle
- [ ] Nur die Schleifen
> Nur die `mbot.`-Befehle gehören zum Roboter. Alles andere ist ganz normales Java.

? Warum läuft `mbot.getDistance > 15` nicht?
→ Noch einmal: Warum läuft das nicht?
- [ ] Weil 15 zu klein ist
- [x] Weil hinter dem Befehl die runden Klammern fehlen
- [ ] Weil man `<` schreiben muss
> Ohne Klammern sucht Java eine Variable `getDistance` und findet keine.

? Wo lernst du, wie ein Programm Abstürze mit try und catch abfängt?
→ Was noch fehlt
- [ ] In VisuBot
- [x] In VisuStruct
> Dort steht die Lektion „Wenn das Programm abstürzt: try und catch“.

? Welche Themen findest du in VisuStruct? Wähle die passende Liste.
→ Was noch fehlt
- [x] PAP, Sortieren, Dateien und Fenster mit Knöpfen
- [ ] Liniensensor, LEDs und Motoren
- [ ] Nur die for-Schleife
> Liniensensor, LEDs und Motoren gehören zum mBot2, die for-Schleife kennst du schon.
:::
