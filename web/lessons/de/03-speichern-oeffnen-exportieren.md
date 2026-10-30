---
titel: Speichern, Öffnen, Exportieren
bereich: Erste Schritte
kurz: Dateien sichern, deinen Workspace nutzen, mehrere Diagramme öffnen und als Bild oder PDF weitergeben.
---

## Die Datei .visustruct

Struktogramme werden als **.visustruct**-Datei gespeichert. Dasselbe Format nutzen alle VisuStruct-Versionen: im Browser, auf Mac, iPad und iPhone und die Java-App am Rechner. Du kannst also in der Schule im Browser anfangen und zu Hause in der App weitermachen.

::: angeberwissen
Zu Nassis Studienzeit gab es keine Dateien zum Speichern, sondern Lochkarten. Nassi erzählt, dass ein Date am Samstagabend so aussah: seine spätere Frau saß mit ihm im Rechenzentrum und stanzte seine Lochkarten. Romantik, Informatik-Style!
:::

::: grafik l03-lochkarte.svg l03-lochkarte-beschriftet.svg
So sah eine Lochkarte aus. Eine Karte war eine Zeile Programm, hier `PRINT *, 'HALLO WELT'` in der Sprache Fortran. Jede Spalte ist ein Zeichen, die Löcher darin sind sein Code. Ein ganzes Programm war ein Stapel solcher Karten. Fiel er herunter, musste man alles wieder sortieren.
:::

## Speichern und Öffnen

- **[Speichern](#zeige-speichern)** (Strg+S, am Mac ⌘S): Das Diagramm wird als Datei gespeichert. Ist die Spalte **Dateien** eingerichtet (siehe unten), landet es dort. Sonst fragt der Browser nach dem Ort oder legt die Datei in den Download-Ordner.
- **[Öffnen](#zeige-oeffnen)** (Strg+O, am Mac ⌘O): Eine gespeicherte Datei wieder laden. Du kannst eine Datei auch einfach ins Browserfenster ziehen.

> Deine Übungen merkt sich der Browser automatisch. Das klappt aber nur in diesem Browser auf diesem Gerät. Wichtige Arbeiten solltest du deshalb immer zusätzlich als Datei speichern.

## Die Spalte Dateien

Links neben dem Lernbereich findest du die Spalte [📁 Dateien](#zeige-dateien). Dort sammelst du alle deine Programme an einem Ort, deinem **Workspace** (Arbeitsbereich).

**Jetzt du:** Richte deinen Workspace jetzt gleich ein, bevor du weiterliest. Ab heute speicherst du alle deine Programme dort.

1. Lege einen Workspace an: Öffne die Spalte und klicke auf **Ordner wählen**. Gehe im Fenster zu deinen **Dokumenten**, lege dort mit **Neuer Ordner** einen Ordner namens `VisuStruct-Dateien` an und wähle ihn aus. Erlaube VisuStruct, den Ordner zu benutzen. Das geht in Chrome und Edge. Auf dem iPad und in anderen Browsern klickst du stattdessen auf **Im Browser speichern**.
2. Speichere wie gewohnt. VisuStruct legt in deinem Workspace automatisch einen Ordner mit dem heutigen Datum an, zum Beispiel `2026-10-23`, und speichert das Programm darin. Der Dateiname kommt aus dem Titel.

So sieht dein Workspace danach aus:

```text
VisuStruct-Dateien          ← Workspace
└── 2026-10-23              ← Tag
    └── Fakultaet.visustruct
```

Ein Klick auf ein Programm in der Spalte öffnet es wieder. So findest du später jede Stunde schnell wieder.

Auch dein **Lernstand** landet im Workspace: in der Datei `learnProgress.json` stehen deine erledigten Lektionen und Übungen. Öffnest du den Workspace in einem anderen Browser, ist dein Lernstand wieder da.

> Warum ein echter Ordner? Dein Lernstand und deine Programme liegen dann als Dateien darin. Den Ordner kannst du mitnehmen, zum Beispiel auf einem USB-Stick oder in deinem Cloud-Ordner wie OneDrive. So machst du zu Hause an einem anderen Rechner genau da weiter, wo du aufgehört hast. Speicherst du nur im Browser, bleibt alles in diesem einen Browser auf diesem Gerät. Löscht jemand die Browserdaten, ist auch dein Lernstand weg.

## Mehrere Diagramme in Reitern

Über dem Struktogramm siehst du die [Reiter](#zeige-reiter). Mit **+** oder [Neu](#zeige-neu) öffnest du ein weiteres, leeres Diagramm. Ein Punkt • vor dem Namen zeigt, dass es ungespeicherte Änderungen gibt.

Den [Titel](#zeige-titel) eines Diagramms trägst du in das Feld über dem Struktogramm ein. Er erscheint auch beim Exportieren und wird als Dateiname vorgeschlagen.

## Weitergeben: Bild, PDF oder Datei

Über [Exportieren](#zeige-exportieren) bei den Werkzeugen (Symbol mit Pfeil nach oben) gibst du dein Struktogramm weiter:

- **Bild (PNG):** zum Einfügen in ein Arbeitsblatt oder eine Präsentation
- **Vektorgrafik (SVG):** bleibt in jeder Größe scharf
- **PDF (A4):** eine Seite zum Abgeben oder Ausdrucken
- **VisuStruct-Datei (.visustruct):** zum Weitergeben an jemanden, der dein Struktogramm in VisuStruct öffnen und weiterbearbeiten soll, zum Beispiel per Mail oder über die Lernplattform
- **Drucken** (Strg+P, am Mac ⌘P): direkt auf den Drucker

Unter dem [Zahnrad](#zeige-textgroesse) oben rechts stellst du bei Textgröße die Schriftgröße ein. Ein größerer Text wirkt auch beim Exportieren als Bild.

## Spiel: Wie gibst du es weiter?

::: spiel frage
titel: Spiel: Wie gibst du es weiter?
intro: Ludwig will sein Struktogramm weitergeben. Welches Format passt am besten? Sechs Runden.
frage: Welches Format passt?
antworten: .visustruct | PNG | SVG | PDF

runde:
frage: Du willst morgen an deinem Struktogramm weiterarbeiten.
richtig: .visustruct
> Nur die .visustruct-Datei kann VisuStruct wieder öffnen und bearbeiten.

runde:
frage: Das Struktogramm soll als Bild in eine Präsentation.
richtig: PNG
> Ein PNG-Bild lässt sich in jede Präsentation und jedes Arbeitsblatt einfügen.

runde:
frage: Die Lehrkraft will deine Abgabe als eine A4-Seite ausdrucken.
richtig: PDF
> Das PDF ist genau eine A4-Seite zum Abgeben oder Ausdrucken.

runde:
frage: Das Struktogramm kommt auf ein Plakat und soll auch riesig noch scharf sein.
richtig: SVG
> Eine Vektorgrafik bleibt in jeder Größe scharf. Ein PNG wird beim Vergrößern pixelig.

runde:
frage: Deine Freundin soll das Struktogramm in ihrer VisuStruct-App auf dem iPad ändern.
richtig: .visustruct
> Alle VisuStruct-Versionen öffnen dieselbe .visustruct-Datei: im Browser, auf Mac, iPad und iPhone.

runde:
frage: Du willst ein Bild schnell in einen Chat schicken.
richtig: PNG
> Ein PNG kann jeder sofort ansehen, ohne VisuStruct.
:::

## Ausprobieren

Öffne eine deiner Übungen aus Lektion 2 und probiere Folgendes aus:

::: checkliste
- Ich habe dem Diagramm einen Titel gegeben. → Ausprobieren
- Ich habe das Diagramm als .visustruct-Datei gespeichert und wieder geöffnet. → Speichern und Öffnen
- Ich habe das Diagramm als Bild (PNG) oder PDF exportiert. → Weitergeben: Bild, PDF oder Datei
- Ich habe ein zweites Diagramm in einem neuen Reiter geöffnet. → Mehrere Diagramme in Reitern
- Ich habe meinen Workspace `VisuStruct-Dateien` angelegt. → Die Spalte Dateien
- Ich habe ein Programm in meinem Workspace gespeichert. → Die Spalte Dateien
:::

## Wissenstest

::: quiz
? Welche Datei kannst du in der Mac-App und in der Java-App wieder öffnen?
- [x] Die .visustruct-Datei
- [ ] Das exportierte PNG-Bild
- [ ] Das exportierte PDF
> Bilder und PDFs sind nur zum Ansehen. Weiterbearbeiten kannst du nur die .visustruct-Datei.

? Deine Übungen werden im Browser gemerkt. Warum solltest du trotzdem speichern?
- [ ] Weil die Übungen sonst nicht geprüft werden
- [x] Weil der Browser die Daten nur auf diesem Gerät behält und sie verloren gehen können
- [ ] Weil man ohne Speichern nicht exportieren kann

? Du speicherst heute ein Programm in deinem Workspace. Wo landet es?
- [ ] Im Download-Ordner
- [x] Im Workspace in einem Ordner mit dem heutigen Datum
- [ ] Direkt im Workspace ohne Unterordner
> VisuStruct legt für jeden Tag automatisch einen Datumsordner an. So bleiben die Programme nach Stunden sortiert.
:::
