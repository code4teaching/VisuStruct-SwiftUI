---
titel: Der Editor
bereich: Erste Schritte
kurz: Elemente einfügen, Text eingeben, verschieben und löschen.
---

## Die Oberfläche

VisuStruct hat zwei Editoren: den [Struktogramm-Editor](#zeige-editor), um den es in dieser Lektion geht, und rechts den Bereich [Programmieren](#zeige-codelive) für Java-Code (ab Lektion 4). Ist der Struktogramm-Editor eingeklappt, öffnet ihn diese Lektion von selbst. Die blauen Wörter zeigen dir die Bereiche, auch wenn sie gerade eingeklappt sind: Fährst du mit der Maus darüber, öffnet sich der Bereich neben dem Lernbereich und leuchtet auf. Klickst du darauf (oder tippst es an), bleibt er offen.

Der Struktogramm-Editor besteht aus mehreren Bereichen. Fahre mit der Maus über ein blaues Wort oder tippe es an, dann leuchtet der Bereich im Editor auf, eingeklappte Bereiche wie die Elemente öffnen sich dabei.

- **Ganz oben die [Leiste](#zeige-leiste):** Neu, Öffnen und Speichern. Ganz rechts das Zahnrad für die [Einstellungen](#zeige-einstellungen): Textgröße und Sprache.
- **Darunter die [Werkzeuge](#zeige-werkzeuge)** über den Elementen und dem Struktogramm: Rückgängig, Ausschneiden, Kopieren, Einfügen, Löschen, Exportieren, Code und Simulation. Die Knöpfe zeigen nur Symbole. Hältst du die Maus darüber, erscheint ihr Name.
- **Links die [Elemente](#zeige-elemente):** Hier liegen alle Bausteine, die du ins Struktogramm ziehen kannst. Manche nennen diesen Bereich auch Palette.
- **In der Mitte das [Struktogramm](#zeige-struktogramm):** Ein neues Diagramm enthält nur einen leeren Platzhalter, erkennbar an **ø**.
- **Unten der [Objektinspektor](#zeige-objektinspektor):** Hier bearbeitest du den Text des ausgewählten Elements.

> Diesen Lernbereich kannst du jederzeit mit dem [Seitenleisten-Symbol](#zeige-lernen) oben in diesem Bereich einklappen. Dann bleibt links nur die schmale Leiste „🎓 Lernen“, ein Klick darauf öffnet ihn wieder. Er bleibt neben dem Editor offen, damit du gleich ausprobieren kannst, was du liest. Genauso gibt es links die Spalte [📁 Dateien](#zeige-dateien) für deine gespeicherten Programme (Lektion 3) und rechts den Bereich [Programmieren](#zeige-codelive) für Java (ab Lektion 4).

## Ein Element einfügen

Ziehe ein Element aus dem Bereich **Elemente** auf das Struktogramm. Beim Ziehen zeigt eine blaue Linie, wo es landet:

- **Auf den Platzhalter ø:** Das Element ersetzt den Platzhalter.
- **Auf die obere Hälfte eines Kastens:** Das Element kommt davor.
- **Auf die untere Hälfte eines Kastens:** Das Element kommt dahinter.

::: grafik l02-einfuegen.svg
Wohin du ziehst, entscheidet, wo das neue Element landet.
:::

Es geht auch ohne Ziehen: **Klicke** auf ein Element im Bereich Elemente (oder tippe es an). Dann wird es hinter dem ausgewählten Kasten eingefügt. Ist der Platzhalter **ø** ausgewählt, ersetzt es ihn.

Mit der Tastatur springst du mit der **Tab**-Taste zu einem Element und drückst **Enter**. Das neue Element landet dann ebenfalls hinter dem ausgewählten Kasten.

::: angeberwissen
Kästen packen und herumziehen, so wie du gerade, hat einen schicken Namen: **direkte Manipulation**. Den Begriff hat 1982 Ben Shneiderman geprägt, genau, der vom Struktogramm. Der Mann war fleißiger als ich beim Grasen.
:::

## Text eingeben

Klicke einen Kasten an. Er wird blau umrandet, und im Objektinspektor unter dem Diagramm erscheint sein Text. Was du dort tippst, siehst du sofort im Diagramm.

Der Kasten aus dem Bereich Elemente heißt **Anweisung**. Oben wählst du, welche Art von Anweisung er sein soll:

- **Anweisung:** etwas berechnen oder festlegen, z. B. `int zahl = 5`. Wie das geht, lernst du in Lektion 4.
- **Eingabe:** beim Ausführen einen Wert abfragen. Das kommt in Lektion 6.
- **Ausgabe:** etwas anzeigen. Im Diagramm steht dann `output:` davor, z. B. `output: "Hallo"`.

Für den Anfang brauchst du nur die Ausgabe. Texte, die genau so angezeigt werden sollen, schreibst du in **Anführungszeichen**.

::: diagramm l2-ausgabe.visustruct
Zwei Ausgaben nacheinander. Öffne das Diagramm im Editor und starte die Simulation, um die Ausgabe zu sehen.
:::

## Verschieben, kopieren, löschen

- **Verschieben:** Einen vorhandenen Kasten mit der Maus an eine neue Stelle ziehen.
- **Kopieren und Einfügen:** Kasten auswählen, dann Strg+C und Strg+V (am Mac ⌘C und ⌘V). Die Kopie kommt hinter den ausgewählten Kasten.
- **Löschen:** Kasten auswählen und Entf drücken.
- **Rückgängig:** Strg+Z macht den letzten Schritt rückgängig, Strg+Umschalt+Z stellt ihn wieder her (am Mac ⌘Z und ⌘⇧Z).

## Übung: Hallo Welt

::: übung l2-hallo
titel: Hallo Welt
auftrag: Baue ein Struktogramm, das **Hallo Welt** ausgibt.
Ziehe eine Anweisung auf den Platzhalter, stelle sie im Objektinspektor auf **Ausgabe** und schreibe `"Hallo Welt"`.
test: - -> Hallo Welt
braucht: anweisung
tipp: Du brauchst nur einen einzigen Kasten. Der Text, der erscheinen soll, steht im Objektinspektor im Eingabefeld.
tipp: Achte auf die Anführungszeichen. Ohne sie sucht VisuStruct nach einer Variablen mit dem Namen Hallo.
lösung: l2-hallo-loesung.visustruct
:::

Klicke auf **Prüfen**, wenn du fertig bist. VisuStruct führt dein Struktogramm aus und vergleicht die Ausgabe.

## Übung: Zwei Zeilen

::: übung l2-zwei-zeilen
titel: Zwei Zeilen
auftrag: Gib zuerst **Hallo** und danach **Ich lerne Struktogramme** aus, jeweils in einer eigenen Zeile.
test: - -> Hallo | Ich lerne Struktogramme
tipp: Zwei Zeilen heißt: zwei Ausgaben. Die Kästen stehen untereinander und werden von oben nach unten ausgeführt.
tipp: Jede Ausgabe ist ein eigener Kasten. Ziehe die zweite Anweisung auf die untere Hälfte der ersten.
lösung: l2-zwei-zeilen-loesung.visustruct
:::

## Spiel: Editor-Profi

::: spiel frage
titel: Spiel: Editor-Profi
intro: Ludwig testet, ob du den Editor im Griff hast. Sieben Runden.

runde:
frage: Du ziehst eine Anweisung auf den Platzhalter **ø**. Was passiert?
- [x] Die Anweisung ersetzt den Platzhalter.
- Die Anweisung kommt hinter den Platzhalter.
- Nichts, auf ø darf man nichts ziehen.
> Der Platzhalter hält nur den Platz frei. Das neue Element nimmt ihn ein.

runde:
frage: Du ziehst ein Element auf die **obere** Hälfte eines Kastens. Wo landet es?
- [x] davor
- dahinter
- Es ersetzt den Kasten.
> Obere Hälfte heißt davor, untere Hälfte heißt dahinter. Die blaue Linie zeigt es dir beim Ziehen.

runde:
frage: Du ziehst ein Element auf die **untere** Hälfte eines Kastens. Wo landet es?
- davor
- [x] dahinter
- ganz am Ende des Struktogramms
> Untere Hälfte heißt: direkt hinter diesen Kasten.

runde:
frage: Du hast aus Versehen einen Kasten gelöscht. Was holt ihn zurück?
- Strg+C / ⌘C
- [x] Strg+Z / ⌘Z
- Strg+V / ⌘V
> Strg+Z / ⌘Z macht den letzten Schritt rückgängig. Strg+C / ⌘C kopiert, Strg+V / ⌘V fügt ein.

runde:
frage: Beim Ausführen soll genau **Hallo** erscheinen. Was steht im Kasten?
- [x] output: "Hallo"
- output: Hallo
- "Hallo"
> Text, der genau so angezeigt werden soll, steht in Anführungszeichen. Das `output:` setzt der Editor davor, wenn du die Art Ausgabe wählst.

runde:
frage: Wo änderst du den Text des ausgewählten Kastens?
- in den Elementen
- [x] im Objektinspektor
- in der Leiste ganz oben
> Der Objektinspektor unter dem Diagramm zeigt den Text des ausgewählten Kastens.

runde:
frage: Du klickst im Bereich Elemente auf ein Element, ohne zu ziehen. Wo landet es?
- [x] hinter dem ausgewählten Kasten
- ganz am Anfang
- ganz am Ende
> Ohne Ziehen (Klick oder Tab und Enter) kommt das neue Element hinter den Kasten, der gerade ausgewählt ist.
:::

## Checkliste

::: checkliste
- Ich kann ein Element aus dem Bereich Elemente einfügen und einen Platzhalter ersetzen. → Ein Element einfügen
- Ich kann den Text eines Kastens ändern und zwischen Anweisung, Eingabe und Ausgabe umschalten. → Text eingeben
- Ich kann Kästen verschieben, kopieren, löschen und Schritte rückgängig machen. → Verschieben, kopieren, löschen
:::

## Wissenstest

::: quiz
? Was bedeutet das Zeichen ø in einem Kasten?
- [ ] Der Kasten enthält einen Fehler.
- [x] Hier ist noch ein leerer Platzhalter.
- [ ] Das Programm endet hier.
> Ein Platzhalter wird ersetzt, wenn du ein Element darauf ziehst.

? Du ziehst eine Anweisung auf die untere Hälfte eines Kastens. Wo landet sie?
- [ ] Davor
- [x] Dahinter
- [ ] Der Kasten wird ersetzt.

? Wie gibst du den Text Guten Tag genau so aus?
- [ ] output: Guten Tag
- [x] output: "Guten Tag"
- [ ] input: "Guten Tag"
> Ohne Anführungszeichen wird Guten Tag als Name einer Variablen verstanden.
:::
