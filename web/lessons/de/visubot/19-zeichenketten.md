---
titel: Zeichenketten
bereich: Licht, Ton und Bildschirm
kurz: Mit Texten rechnen, Buchstaben herausholen und auf dem Bildschirm zeigen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- mit `length()` und `substring(…)` arbeiten
- Texte und Zahlen mit `+` verbinden
- mit `charAt(…)` einzelne Zeichen holen
:::

## Buchstabe für Buchstabe

Ein Text heißt in Java **Zeichenkette** oder `String`. Er besteht aus einzelnen Zeichen, die wie bei einem Array ab **0** nummeriert sind:

| Zeichen | V | i | s | u | B | o | t |
|---|---|---|---|---|---|---|---|
| Nummer | 0 | 1 | 2 | 3 | 4 | 5 | 6 |

- `wort.length()` liefert die Anzahl der Zeichen, hier 7.
- `wort.substring(0, 3)` liefert die ersten 3 Zeichen: `"Vis"`.

Der mBot2 soll seinen Namen auf dem [Bildschirm]{teil=screen} aufbauen: erst **V**, dann **Vi**, dann **Vis** und so weiter bis **VisuBot**.

::: übung vb-buchstaben
titel: Name aufbauen
auftrag: Lege `String wort = "VisuBot"` an. Eine For-Schleife zählt `i` von 1 bis `wort.length()`. Darin zeigt der mBot2 `wort.substring(0, i)` und wartet 300 Millisekunden.
befehle: showText "V", pause 300, showText "Vi", pause 300, showText "Vis", pause 300, showText "Visu", pause 300, showText "VisuB", pause 300, showText "VisuBo", pause 300, showText "VisuBot", pause 300
braucht: forSchleife
tipp: Die Schleife beginnt bei `int i = 1` und läuft, solange `i <= wort.length()`.
tipp: In der Schleife: `mbot.showText(wort.substring(0, i))` und `mbot.pause(300)`.
lösung: vb-buchstaben-loesung.visustruct
:::

## Jetzt in Java: Text und Länge

Mit `+` hängst du Texte und Zahlen aneinander. So zeigt der mBot2 einen Text und dahinter seine Länge.

::: übung vb-java-textlaenge
titel: Wie lang ist der Text?
code: java
auftrag: Schreibe in Java: Lege `String text = "Hallo Klasse"` an. Der mBot2 zeigt den Text und in Klammern seine Länge, also **Hallo Klasse (12)**.
befehle: showText "Hallo Klasse (12)"
tipp: Die Länge liefert `text.length()`. Auch das Leerzeichen zählt mit.
tipp: `mbot.showText(text + " (" + text.length() + ")");`
lösung: vb-java-textlaenge-loesung.visustruct
:::

## Jetzt in Java: Laufschrift

`wort.charAt(i)` liefert das Zeichen mit der Nummer `i`. Zeigst du die Zeichen nacheinander mit einer Pause, läuft das Wort Buchstabe für Buchstabe über den Bildschirm:

```java
String wort = "Ludwig";
for (int i = 0; i < wort.length(); i++) {
    mbot.showText(wort.charAt(i));
    mbot.pause(500);
}
```

| Durchgang | `i` | Bildschirm |
|---|---|---|
| 1 | 0 | L |
| 2 | 1 | u |
| 3 | 2 | d |

::: übung vb-laufschrift
titel: Ludwig rückwärts
code: java
auftrag: Lege `String wort = "Ludwig"` an. Zeige das Wort **rückwärts** Buchstabe für Buchstabe auf dem Bildschirm, also g, i, w, d, u, L, mit 500 ms Pause nach jedem Buchstaben.
befehle: showText "g", pause 500, showText "i", pause 500, showText "w", pause 500, showText "d", pause 500, showText "u", pause 500, showText "L", pause 500
braucht: forSchleife
tipp: Das letzte Zeichen hat die Nummer `wort.length() - 1`. Die Schleife zählt rückwärts: `for (int i = wort.length() - 1; i >= 0; i--)`.
tipp: In der Schleife: `mbot.showText(wort.charAt(i));` und `mbot.pause(500);`.
lösung: vb-laufschrift-loesung.visustruct
:::

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektion [„Zeichenketten“](?visustruct&lektion=17-zeichenketten). Sie öffnet sich in einem neuen Fenster.

::: übung vb-fehler-19-zeichenketten
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Wie lang ist der Text?“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-19-zeichenketten-start.visustruct
befehle: showText "Hallo Klasse (12)"
tipp: Die Fehlermeldung nennt eine unbekannte Variable. Wie heißt die Variable dort, wo sie angelegt wird? Java unterscheidet Groß- und Kleinschreibung.
tipp: Richtig heißt es `mbot.showText(text +`.
lösung: vb-java-textlaenge-loesung.visustruct
:::

## Spiel: Bombe entschärfen

::: spiel bombe
titel: Spiel: Bombe entschärfen
intro: In jedem Programm steckt **genau ein Fehler**, und die Bombe tickt. Lies, was der mBot2 zeigen soll, und tippe auf die falsche Zeile, bevor die Zeit abläuft. Fünf Runden, je 30 Sekunden.
zeit: 30

runde:
    String wort = "VisuBot";
    for (int i = 1; i <= wort.length(); i++) {
        mbot.showText(wort.substring(1, i));
        mbot.pause(300);
    }
frage: Soll V, Vi, Vis und so weiter bis VisuBot zeigen.
fehler: 3
besser: mbot.showText(wort.substring(0, i));
> Das erste Zeichen hat die Nummer 0. Mit `substring(1, i)` fehlt das V.

runde:
    String text = "Hallo Klasse";
    mbot.showText(text + " (" + text.length + ")");
frage: Soll **Hallo Klasse (12)** zeigen.
fehler: 2
besser: mbot.showText(text + " (" + text.length() + ")");
> Bei einem String ist `length()` eine Methode und braucht Klammern. Nur bei Arrays steht `length` ohne Klammern.

runde:
    String wort = "Ludwig";
    for (int i = 0; i <= wort.length(); i++) {
        mbot.showText(wort.charAt(i));
        mbot.pause(500);
    }
frage: Soll L, u, d, w, i, g zeigen.
fehler: 2
besser: for (int i = 0; i < wort.length(); i++) {
> Das letzte Zeichen hat die Nummer 5. Bei `i = 6` gibt es kein Zeichen mehr.

runde:
    String wort = "Ludwig";
    for (int i = wort.length(); i >= 0; i--) {
        mbot.showText(wort.charAt(i));
        mbot.pause(500);
    }
frage: Soll das Wort rückwärts zeigen: g, i, w, d, u, L.
fehler: 2
besser: for (int i = wort.length() - 1; i >= 0; i--) {
> Rückwärts beginnt man beim letzten Zeichen, und das hat die Nummer `wort.length() - 1`.

runde:
    String name = 'Ludwig';
    mbot.showText("Hallo " + name);
frage: Soll **Hallo Ludwig** zeigen.
fehler: 1
besser: String name = "Ludwig";
> Texte stehen in doppelten Anführungszeichen. Einfache gibt es nur für ein einzelnes Zeichen (`char`).
:::

## Spiel: Begriffe-Rätsel

::: spiel kreuzwort
titel: Spiel: Begriffe-Rätsel
intro: Fülle das Rätsel mit den Fachbegriffen aus diesem Teil. Klick auf einen Hinweis, um zum Wort zu springen. Die gelben Felder ergeben das Lösungswort.
- → 6 1 LAUFSCHRIFT: ein Wort Buchstabe für Buchstabe über den Bildschirm
- ↓ 4 1 BILDSCHIRM: zeigt mit mbot.showText einen Text
- ↓ 6 7 HERTZ: Einheit der Tonhöhe: Schwingungen pro Sekunde
- ↓ 4 11 AKTOR: Bauteil, das etwas tut, z. B. leuchten
- ↓ 4 3 LAUTSPRECHER: spielt mit mbot.playTone einen Ton
- ↓ 4 9 ZEICHENKETTE: anderes Wort für String
- ↓ 1 5 MILLISEKUNDE: ein Tausendstel einer Sekunde
- → 15 1 ARRAY: Reihe von Fächern unter einem Namen
lösung: 6 2, 8 5, 9 7, 7 11, 10 3
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann mit `length()` und `substring(…)` arbeiten. → Buchstabe für Buchstabe
- Ich kann Texte und Zahlen mit `+` verbinden. → Jetzt in Java: Text und Länge
- Ich kann mit `charAt(…)` einzelne Zeichen holen. → Jetzt in Java: Laufschrift
:::

## Wissenstest

::: quiz
? Was liefert `"VisuBot".substring(0, 4)`?
→ Buchstabe für Buchstabe
- [ ] `"VisuB"`
- [x] `"Visu"`
- [ ] `"uBot"`
> `substring(0, 4)` nimmt die Zeichen 0, 1, 2 und 3, also vier Stück.
? Was liefert `"Ludwig".charAt(0)`?
→ Jetzt in Java: Laufschrift
- [x] `L`
- [ ] `u`
- [ ] `g`
> Die Zeichen werden ab 0 gezählt. Zeichen 0 ist das erste.
:::
