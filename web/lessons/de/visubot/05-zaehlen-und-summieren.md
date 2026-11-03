---
titel: Zählen und Summieren
bereich: Sensoren und Entscheidungen
kurz: Mit einer Variablen mitzählen und Werte zusammenzählen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- eine Zählvariable anlegen und in einer Schleife hochzählen
- in einer Schleife eine Summe bilden
- das Ergebnis nach der Schleife auf dem Bildschirm zeigen
:::

## Mitzählen

Wie viele Schritte fährt der mBot2 bis zur Wand? Das weißt du vorher nicht, die Welt ist jedes Mal anders. Der mBot2 soll deshalb **mitzählen**. Dafür brauchst du drei Kästen:

1. **Vor** der Schleife: `int schritte = 0`. Am Anfang ist noch nichts gezählt.
2. **In** der Schleife: `schritte = schritte + 1`. Nach jedem Schritt eins mehr.
3. **Nach** der Schleife: das Ergebnis zeigen, zum Beispiel mit `mbot.showText("Schritte: " + schritte)`.

Lies `schritte = schritte + 1` von rechts nach links: Nimm den alten Wert von `schritte`, zähle 1 dazu und speichere das Ergebnis wieder in `schritte`. So eine Variable heißt **Zählvariable** oder kurz Zähler.

> Achtung: Steht `int schritte = 0` **in** der Schleife, fängt der Zähler bei jedem Durchgang wieder bei 0 an. Am Ende steht dann immer 1 da.

::: angeberwissen
Dein Handy zählt deine Schritte genau so: Bei jedem Schritt rechnet es `schritte = schritte + 1`. Ich zähle lieber meine Grashalme. Ich bin bei 4 Millionen.
:::

::: übung vb-schritte-welt
titel: Schritte bis zur Wand
auftrag: Baue ein Struktogramm: Der mBot2 fährt vor, solange der Abstand größer als 15 ist. Dabei zählt er seine Schritte mit. Danach zeigt er zum Beispiel **Schritte: 3** auf dem Bildschirm. Es gibt drei Welten.
welt: wand-kurz -> screen "Schritte: 3"
welt: wand-mittel -> screen "Schritte: 7"
welt: wand-lang -> screen "Schritte: 12"
braucht: whileSchleife
tipp: Der erste Kasten ist `int schritte = 0`. Danach kommt die While-Schleife mit `mbot.getDistance() > 15`.
tipp: In der Schleife stehen **fahre vor** und `schritte = schritte + 1`. Nach der Schleife steht `mbot.showText("Schritte: " + schritte)`.
lösung: vb-schritte-welt-loesung.visustruct
:::

## Zusammenzählen

Ein Zähler wächst immer um 1. Eine **Summe** wächst um verschiedene Werte. Der mBot2 fährt eine Spirale: erst 10 cm, dann 20, dann 30, dann 40. Wie weit ist er insgesamt gefahren?

| Durchgang | `seite` | `gesamt` danach |
|---|---|---|
| vorher | 10 | 0 |
| 1 | 10 | 0 + 10 = 10 |
| 2 | 20 | 10 + 20 = 30 |
| 3 | 30 | 30 + 30 = 60 |
| 4 | 40 | 60 + 40 = 100 |

Das Muster ist dasselbe wie beim Zählen. Nur steht statt der 1 jetzt der Wert, der dazukommt: `gesamt = gesamt + seite`.

## Jetzt in Java: Spirale mit Strecke

::: übung vb-java-spirale-strecke
titel: Spirale mit Strecke
code: java
auftrag: Schreibe in Java: Lege `int seite = 10` und `int gesamt = 0` an. Fahre viermal: `seite` cm vor, rechts drehen, `seite` zu `gesamt` dazuzählen, `seite` um 10 größer machen. Zeige danach **Strecke: 100 cm** auf dem Bildschirm.
fahrt: forward 10, turnRight, forward 20, turnRight, forward 30, turnRight, forward 40, turnRight
befehle: showText "Strecke: 100 cm"
braucht: forSchleife
tipp: In der For-Schleife stehen vier Zeilen: `mbot.forward(seite);`, `mbot.turnRight();`, `gesamt = gesamt + seite;` und `seite = seite + 10;`.
tipp: Nach der Schleife steht `mbot.showText("Strecke: " + gesamt + " cm");`.
lösung: vb-java-spirale-strecke-loesung.visustruct
:::

::: übung vb-fehler-05-zaehlen-und-summieren
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Spirale mit Strecke“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-05-zaehlen-und-summieren-start.visustruct
fahrt: forward 10, turnRight, forward 20, turnRight, forward 30, turnRight, forward 40, turnRight
befehle: showText "Strecke: 100 cm"
tipp: Die Fehlermeldung nennt eine unbekannte Variable. Wie heißt die Variable dort, wo sie angelegt wird? Java unterscheidet Groß- und Kleinschreibung.
tipp: Richtig heißt es `gesamt = gesamt + seite`.
lösung: vb-java-spirale-strecke-loesung.visustruct
:::

## Spiel: Was steht am Ende in der Variablen?

::: spiel frage
titel: Spiel: Was steht am Ende in der Variablen?
intro: Ludwig hat kleine Programme geschrieben. Rechne im Kopf mit. Fünf Runden.

runde:
frage: `int z = 0`, dann dreimal `z = z + 1`. Was ist `z`?
- 1
- [x] 3
- 0
> Jeder Durchgang zählt 1 dazu: 1, 2, 3.

runde:
frage: `int summe = 0`, dann `summe = summe + 5` und `summe = summe + 7`. Was ist `summe`?
- 7
- [x] 12
- 5
> 0 + 5 = 5, dann 5 + 7 = 12.

runde:
frage: Eine Schleife läuft viermal. In ihr stehen `int z = 0` und `z = z + 1`. Was ist `z` am Ende?
- 4
- [x] 1
- 0
> Der Zähler wird in jedem Durchgang wieder auf 0 gesetzt. Er gehört vor die Schleife.

runde:
frage: `int gesamt = 0`. Der mBot2 fährt 20, 20 und 30 cm und zählt jedes Mal dazu. Was ist `gesamt`?
- 30
- 20
- [x] 70
> 20 + 20 + 30 = 70.

runde:
frage: `int schritte = 10`, dann zweimal `schritte = schritte + 1`. Was ist `schritte`?
- 2
- [x] 12
- 11
> Der Zähler fängt hier bei 10 an, nicht bei 0.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann eine Zählvariable anlegen und in einer Schleife hochzählen. → Mitzählen
- Ich kann in einer Schleife eine Summe bilden. → Zusammenzählen
- Ich kann das Ergebnis nach der Schleife auf dem Bildschirm zeigen. → Jetzt in Java: Spirale mit Strecke
:::

## Wissenstest

::: quiz
? Wo legst du die Zählvariable `int schritte = 0` an?
→ Mitzählen
- [x] Vor der Schleife
- [ ] In der Schleife
- [ ] Nach der Schleife
> In der Schleife würde sie bei jedem Durchgang wieder 0.
? Was macht `schritte = schritte + 1`?
→ Mitzählen
- [ ] Es vergleicht schritte mit schritte + 1.
- [x] Es nimmt den alten Wert, zählt 1 dazu und speichert das Ergebnis.
- [ ] Es setzt schritte auf 1.
? Wie zählst du die Seitenlänge `seite` zur Summe `gesamt` dazu?
→ Zusammenzählen
- [ ] `gesamt = seite`
- [ ] `seite = gesamt + seite`
- [x] `gesamt = gesamt + seite`
:::
