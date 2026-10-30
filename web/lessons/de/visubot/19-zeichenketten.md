---
titel: Zeichenketten
bereich: VisuBot
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

## Jetzt ohne Roboter: rückwärts lesen

`wort.charAt(i)` liefert das Zeichen mit der Nummer `i`. Hängst du jedes Zeichen **vorne** an einen neuen Text, steht das Wort am Ende rückwärts da:

| Durchgang | Zeichen | neuer Text |
|---|---|---|
| 1 | L | L |
| 2 | u | uL |
| 3 | d | duL |

::: übung vb-ohne-rueckwaerts
titel: Ludwig rückwärts
code: java
auftrag: Lege `String wort = "Ludwig"` und `String rueckwaerts = ""` an. Eine Schleife hängt jedes Zeichen von `wort` vorne an `rueckwaerts`. Zum Schluss gibst du **giwduL** aus. Ganz ohne `mbot`!
test: - -> giwduL
braucht: forSchleife
tipp: Die Schleife läuft von `i = 0` bis `i < wort.length()`.
tipp: In der Schleife: `rueckwaerts = wort.charAt(i) + rueckwaerts;`. Nach der Schleife: `System.out.println(rueckwaerts);`.
lösung: vb-ohne-rueckwaerts-loesung.visustruct
:::

::: quiz
? Was liefert `"VisuBot".substring(0, 4)`?
→ Buchstabe für Buchstabe
- [ ] `"VisuB"`
- [x] `"Visu"`
- [ ] `"uBot"`
> `substring(0, 4)` nimmt die Zeichen 0, 1, 2 und 3, also vier Stück.
? Was liefert `"Ludwig".charAt(0)`?
→ Jetzt ohne Roboter: rückwärts lesen
- [x] `L`
- [ ] `u`
- [ ] `g`
> Die Zeichen werden ab 0 gezählt. Zeichen 0 ist das erste.
:::

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann mit `length()` und `substring(…)` arbeiten. → Buchstabe für Buchstabe
- Ich kann Texte und Zahlen mit `+` verbinden. → Jetzt in Java: Text und Länge
- Ich kann mit `charAt(…)` einzelne Zeichen holen. → Jetzt ohne Roboter: rückwärts lesen
:::
