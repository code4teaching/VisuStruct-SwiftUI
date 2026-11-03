---
titel: Struktogramm und Editor
bereich: Losfahren
kurz: Was ein Struktogramm ist, wie du den Editor bedienst und deine Programme speicherst.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, was ein Algorithmus und ein Struktogramm ist
- die drei Grundbausteine Sequenz, Verzweigung und Wiederholung erkennen
- im Editor Elemente einfügen, verschieben und löschen
- ein Struktogramm speichern und wieder öffnen
:::

## Ein Plan für den Roboter

Ein Roboter denkt nicht mit. Er tut genau das, was in seinem Programm steht, nicht mehr und nicht weniger. Bevor du ihn programmierst, brauchst du deshalb einen genauen Plan. So eine genaue Schritt-für-Schritt-Anleitung heißt **Algorithmus**.

Ein **Struktogramm** zeichnet den Plan als Kästen. Du liest es von oben nach unten. Jeder Kasten ist ein Schritt. Erfunden haben es 1973 Isaac Nassi und Ben Shneiderman, deshalb heißt es auch **Nassi-Shneiderman-Diagramm**.

::: diagramm vb-l00-sequenz-loesung.visustruct
Fahre vor, drehe nach rechts, fahre vor: drei Kästen, von oben nach unten.
:::

::: angeberwissen
Das erste Programm für eine Maschine schrieb Ada Lovelace schon 1843, für eine Rechenmaschine, die nie fertig gebaut wurde. Sie ahnte damals schon, dass solche Maschinen einmal mehr können als rechnen, zum Beispiel Musik machen. Dein mBot2 kann beides.
:::

## Drei Bausteine

Jedes Programm, auch das für einen Roboter, besteht aus nur drei Bausteinen:

| Baustein | Was er tut | Beispiel mit dem mBot2 |
|---|---|---|
| **Sequenz** | Schritte nacheinander | vorfahren, drehen, vorfahren |
| **Verzweigung** | je nach Bedingung das eine oder das andere | Ist die Wand nah? Dann drehen, sonst vorfahren. |
| **Wiederholung** | Schritte mehrmals | viermal das Gleiche tun |

Im Struktogramm sieht man die Bausteine sofort: Die Verzweigung hat oben ein Dreieck mit **Ja** und **Nein**. Die Wiederholung (Schleife) umschließt ihre Kästen wie ein gekipptes L.

::: diagramm vb-l00-bausteine-loesung.visustruct
Alle drei Bausteine: erst ein Kasten, dann eine Schleife, darin eine Verzweigung.
:::

## Der Editor

Der [Struktogramm-Editor](#zeige-editor) besteht aus mehreren Bereichen. Fahre mit der Maus über ein blaues Wort oder tippe es an, dann leuchtet der Bereich auf:

- **Links die [Elemente](#zeige-elemente):** alle Bausteine zum Hineinziehen. In der Gruppe **mBot2-Befehle** liegen die Befehle für den mBot2 wie **fahre vor** und **drehe rechts**.
- **In der Mitte das [Struktogramm](#zeige-struktogramm):** Ein neues Diagramm enthält nur einen leeren Platzhalter, erkennbar an **ø**.
- **Unten der [Objektinspektor](#zeige-objektinspektor):** Hier änderst du den Text des ausgewählten Kastens, zum Beispiel `mbot.forward(30)` statt `mbot.forward()`.
- **Darüber die [Werkzeuge](#zeige-werkzeuge):** Rückgängig, Kopieren, Löschen, Exportieren und rechts die **Simulation**.

So baust du:

- **Einfügen:** Zieh ein Element aus den Elementen auf das Struktogramm. Auf den Platzhalter **ø** ersetzt es ihn. Auf die obere Hälfte eines Kastens kommt es davor, auf die untere Hälfte dahinter. Eine blaue Linie zeigt dir, wo es landet.
- **Verschieben:** einen Kasten an eine andere Stelle ziehen.
- **Löschen:** Kasten anklicken und Entf drücken oder auf den [Mülleimer](#zeige-loeschen) klicken.
- **Rückgängig:** Strg+Z, am Mac ⌘Z.

::: übung vb-erster-plan
titel: Um die Ecke
auftrag: Baue ein Struktogramm: Der mBot2 fährt vor, dreht nach rechts, fährt vor, dreht nach links und fährt noch einmal vor. Starte danach die Simulation und schau zu.
fahrt: forward, turnRight, forward, turnLeft, forward
braucht: anweisung
tipp: Zieh **fahre vor** auf den Platzhalter ø. Die nächsten Befehle ziehst du jeweils auf die untere Hälfte des letzten Kastens.
tipp: Von oben nach unten: **fahre vor**, **drehe rechts**, **fahre vor**, **drehe links**, **fahre vor**.
lösung: vb-erster-plan-loesung.visustruct
:::

## Speichern und Öffnen

- **[Speichern](#zeige-speichern)** (Strg+S, am Mac ⌘S): Das Struktogramm wird als Datei mit der Endung `.visustruct` gespeichert. Den Dateinamen schlägt der [Titel](#zeige-titel) über dem Struktogramm vor.
- **[Öffnen](#zeige-oeffnen)** (Strg+O, am Mac ⌘O): eine gespeicherte Datei wieder laden.

In der Spalte [📁 Dateien](#zeige-dateien) richtest du einmal einen Ordner ein, deinen **Workspace**. Dort landen alle deine Programme und auch dein Lernstand. Den Ordner kannst du mitnehmen und zu Hause weitermachen.

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektionen [„Was ist ein Struktogramm?“](?visustruct&lektion=01-was-ist-ein-struktogramm), [„Der Editor“](?visustruct&lektion=02-der-editor) und [„Speichern, Öffnen, Exportieren“](?visustruct&lektion=03-speichern-oeffnen-exportieren). Sie öffnen sich in einem neuen Fenster.

## Spiel: Welcher Baustein?

::: spiel frage
titel: Spiel: Welcher Baustein?
intro: Ludwig beschreibt, was sein mBot2 tun soll. Ist das eine Sequenz, eine Verzweigung oder eine Wiederholung? Sechs Runden.
antworten: Sequenz | Verzweigung | Wiederholung

runde:
frage: Der mBot2 fährt vor, dreht sich nach rechts und fährt wieder vor.
richtig: Sequenz
> Drei Schritte nacheinander, jeder genau einmal.

runde:
frage: Ist die Wand nah, dreht er sich. Sonst fährt er vor.
richtig: Verzweigung
> Je nach Bedingung passiert das eine oder das andere.

runde:
frage: Er fährt viermal 10 cm vor.
richtig: Wiederholung
> Derselbe Schritt kommt mehrmals dran.

runde:
frage: Solange keine Linie kommt, fährt er weiter.
richtig: Wiederholung
> „Solange“ heißt: immer wieder, bis die Bedingung nicht mehr stimmt.

runde:
frage: Steht er auf Rot, piept er.
richtig: Verzweigung
> Nur wenn die Bedingung stimmt, piept er.

runde:
frage: Er zeigt „Hallo“ auf dem Bildschirm und spielt danach einen Ton.
richtig: Sequenz
> Zwei Schritte nacheinander, ohne Bedingung und ohne Wiederholung.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann erklären, was ein Algorithmus und ein Struktogramm ist. → Ein Plan für den Roboter
- Ich kann die drei Grundbausteine Sequenz, Verzweigung und Wiederholung erkennen. → Drei Bausteine
- Ich kann im Editor Elemente einfügen, verschieben und löschen. → Der Editor
- Ich kann ein Struktogramm speichern und wieder öffnen. → Speichern und Öffnen
:::

## Wissenstest

::: quiz
? Was ist ein Algorithmus?
→ Ein Plan für den Roboter
- [ ] ein Bauteil des mBot2
- [x] eine genaue Schritt-für-Schritt-Anleitung
- [ ] eine Programmiersprache
> Ein Algorithmus sagt genau, was in welcher Reihenfolge passiert. Das Struktogramm zeichnet ihn.
? Welcher Baustein entscheidet je nach Bedingung?
→ Drei Bausteine
- [ ] die Sequenz
- [x] die Verzweigung
- [ ] die Wiederholung
> Die Verzweigung hat oben ein Dreieck mit Ja und Nein.
? Du ziehst **fahre vor** auf die untere Hälfte eines Kastens. Wo landet es?
→ Der Editor
- [ ] davor
- [x] dahinter
- [ ] es ersetzt den Kasten
> Obere Hälfte heißt davor, untere Hälfte dahinter.
? Welche Endung hat eine gespeicherte Struktogramm-Datei?
→ Speichern und Öffnen
- [ ] `.java`
- [x] `.visustruct`
- [ ] `.png`
> `.png` ist ein Bild zum Weitergeben. Weiterbearbeiten kannst du nur die `.visustruct`-Datei.
:::
