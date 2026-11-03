---
titel: Und, oder, nicht
bereich: Sensoren und Entscheidungen
kurz: Zwei Sensoren in einer Bedingung prüfen: und, oder, nicht.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- zwei Bedingungen mit `&&` (und) verknüpfen
- zwei Bedingungen mit `||` (oder) verknüpfen
- eine Bedingung mit `!` (nicht) umdrehen
- eine verknüpfte Bedingung in einer Java-Schleife schreiben
:::

## Wand und Linie: und

Der mBot2 soll nur vorfahren, wenn vorn frei ist **und** unter ihm keine Linie ist. Zwei Sensoren, eine Bedingung. In Java heißt **und** `&&`:

```java
mbot.getDistance() > 15 && mbot.getLine() == 0
```

Die ganze Bedingung ist nur wahr, wenn **beide** Teile wahr sind:

| vorn frei? | keine Linie? | frei `&&` keine Linie |
|---|---|---|
| wahr | wahr | **wahr** |
| wahr | falsch | falsch |
| falsch | wahr | falsch |
| falsch | falsch | falsch |

So eine Tabelle heißt **Wahrheitstabelle** (englisch *truth table*).

::: übung vb-und
titel: Frei und keine Linie
auftrag: Baue ein Struktogramm mit einer Verzweigung: Ist der Abstand größer als 15 **und** `mbot.getLine() == 0`, fährt der mBot2 vor. Sonst tut er nichts.
messwerte: getDistance=50, getLine=0 -> forward
messwerte: getDistance=10, getLine=0 -> none
messwerte: getDistance=50, getLine=6 -> none
braucht: verzweigung
tipp: Zieh den Sensor **Abstand** auf die Verzweigung und schreib `> 15` dahinter. Dann tippst du ` && ` und den zweiten Teil `mbot.getLine() == 0`.
tipp: Im Ja-Zweig steht **fahre vor**, der Nein-Zweig bleibt leer.
lösung: vb-und-loesung.visustruct
:::

> Beim Prüfen setzt VisuStruct den Abstand und die Linie auf verschiedene Werte. Nur wenn beides passt, darf der mBot2 fahren.

## Taste A oder Taste B: oder

Jetzt soll der mBot2 piepen, wenn du Taste A **oder** Taste B drückst. Es reicht, wenn eine der beiden gedrückt ist. In Java heißt **oder** `||`. Die beiden Striche findest du auf der Tastatur meist mit **Alt Gr** und **<** (Windows) oder **Option** und **7** (Mac).

| Taste A? | Taste B? | A oder B |
|---|---|---|
| wahr | wahr | **wahr** |
| wahr | falsch | **wahr** |
| falsch | wahr | **wahr** |
| falsch | falsch | falsch |

::: übung vb-oder
titel: Taste A oder B
auftrag: Baue ein Struktogramm: Ist Taste A **oder** Taste B gedrückt, spielt der mBot2 einen Ton. Sonst tut er nichts.
messwerte: isButtonA=true, isButtonB=false -> tone
messwerte: isButtonA=false, isButtonB=true -> tone
messwerte: isButtonA=false, isButtonB=false -> noTone
braucht: verzweigung
tipp: Die Bedingung der Verzweigung ist `mbot.isButtonA() || mbot.isButtonB()`.
tipp: Im Ja-Zweig steht `mbot.playTone(440, 300)`, der Nein-Zweig bleibt leer.
lösung: vb-oder-loesung.visustruct
:::

## Nicht: das Gegenteil

Manchmal willst du das Gegenteil einer Bedingung. Dafür gibt es `!`, gesprochen **nicht**. `mbot.isButtonA()` ist wahr, wenn Taste A gedrückt ist. `!mbot.isButtonA()` ist wahr, wenn sie **nicht** gedrückt ist.

```java
while (!mbot.isButtonA()) {
    mbot.pause(100);
}
mbot.forward(30);
```

Der mBot2 wartet, solange Taste A nicht gedrückt ist. Danach fährt er los.

## Jetzt in Java: Sicher fahren

Jetzt kommt alles zusammen. Der mBot2 fährt, solange vorn frei ist **und** keine Linie kommt. Egal, was zuerst kommt, die Wand oder der Rand: Er hält an und piept.

::: übung vb-java-sicher-fahren
titel: Sicher fahren
code: java
auftrag: Schreibe in Java: Der mBot2 fährt vor, solange der Abstand größer als 15 ist **und** `mbot.getLine() == 0` ist. Danach spielt er einen Ton. In zwei Welten wartet eine Wand, in zwei Welten ein schwarzer Rand.
welt: wand-kurz -> tone
welt: wand-mittel -> tone
welt: rand-1 -> forward 20, tone
welt: rand-2 -> forward 50, tone
braucht: whileSchleife
tipp: `while (mbot.getDistance() > 15 && mbot.getLine() == 0) { … }`
tipp: In der Schleife steht `mbot.forward();`, nach der Schleife `mbot.playTone(440, 300);`.
lösung: vb-java-sicher-fahren-loesung.visustruct
:::

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektion [„Bedingungen verknüpfen“](?visustruct&lektion=09-bedingungen-verknuepfen). Sie öffnet sich in einem neuen Fenster.

::: übung vb-fehler-07-und-oder
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Sicher fahren“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-07-und-oder-start.visustruct
welt: wand-kurz -> tone
welt: wand-mittel -> tone
welt: rand-1 -> forward 20, tone
welt: rand-2 -> forward 50, tone
tipp: Lies die Fehlermeldung genau. In welchem Kasten bleibt die Simulation stehen? Java unterscheidet Groß- und Kleinschreibung.
tipp: Richtig heißt es `mbot.playTone(440, 300)`.
lösung: vb-java-sicher-fahren-loesung.visustruct
:::

## Spiel: Wahr oder falsch?

::: spiel frage
titel: Spiel: Wahr oder falsch?
intro: Ludwig stellt den mBot2 in eine Lage. Ist die Bedingung wahr oder falsch? Acht Runden.
antworten: wahr | falsch

runde:
    mbot.getDistance() > 15 && mbot.getLine() == 0
frage: Die Wand ist 50 cm weg, unter ihm ist keine Linie.
richtig: wahr
> Beide Teile sind wahr, also ist auch das Ganze wahr.

runde:
    mbot.getDistance() > 15 && mbot.getLine() == 0
frage: Die Wand ist 10 cm weg, unter ihm ist keine Linie.
richtig: falsch
> Bei `&&` müssen beide Teile wahr sein. Der Abstand stimmt nicht.

runde:
    mbot.isButtonA() || mbot.isButtonB()
frage: Nur Taste B ist gedrückt.
richtig: wahr
> Bei `||` reicht ein wahrer Teil.

runde:
    mbot.isButtonA() || mbot.isButtonB()
frage: Keine Taste ist gedrückt.
richtig: falsch
> Beide Teile sind falsch, dann ist auch `||` falsch.

runde:
    !mbot.isButtonA()
frage: Taste A ist gedrückt.
richtig: falsch
> `mbot.isButtonA()` ist wahr, das `!` macht daraus falsch.

runde:
    mbot.getDistance() > 15 || mbot.getLine() == 0
frage: Die Wand ist 10 cm weg, und er steht auf einer Linie.
richtig: falsch
> Kein Teil ist wahr, also ist auch `||` falsch.

runde:
    mbot.getDistance() > 15 || mbot.getLine() == 0
frage: Die Wand ist 50 cm weg, und er steht auf einer Linie.
richtig: wahr
> Der erste Teil ist wahr, das reicht bei `||`.

runde:
    !mbot.isButtonA() && mbot.getDistance() > 15
frage: Niemand drückt eine Taste, die Wand ist 30 cm weg.
richtig: wahr
> A ist nicht gedrückt, also ist `!mbot.isButtonA()` wahr. Der Abstand stimmt auch.
:::

## Spiel: Bombe entschärfen

::: spiel bombe
titel: Spiel: Bombe entschärfen
intro: In jedem Programm steckt **genau ein Fehler**, und die Bombe tickt. Tippe auf die falsche Zeile, bevor die Zeit abläuft. Vier Runden, je 30 Sekunden.
zeit: 30

runde:
    while (mbot.getDistance() > 15 || mbot.getLine() == 0) {
        mbot.forward();
    }
    mbot.playTone(440, 300);
frage: Soll fahren, solange vorn frei ist **und** keine Linie kommt.
fehler: 1
besser: while (mbot.getDistance() > 15 && mbot.getLine() == 0) {
> Mit `||` fährt er weiter, wenn nur einer der Teile stimmt, zum Beispiel über den Rand.

runde:
    if (mbot.isButtonA() && mbot.isButtonB()) {
        mbot.playTone(440, 300);
    }
frage: Soll piepen, wenn Taste A **oder** Taste B gedrückt ist.
fehler: 1
besser: if (mbot.isButtonA() || mbot.isButtonB()) {
> „Oder“ heißt in Java `||`. Mit `&&` piept er nur, wenn beide gedrückt sind.

runde:
    while (mbot.isButtonA()) {
        mbot.pause(100);
    }
    mbot.forward(30);
frage: Soll warten, bis Taste A gedrückt wird, und dann losfahren.
fehler: 1
besser: while (!mbot.isButtonA()) {
> Warten heißt: Schleife, solange A **nicht** gedrückt ist. Das `!` fehlt.

runde:
    if (mbot.getDistance() > 15 & mbot.getLine() == 0) {
        mbot.forward();
    }
frage: Soll vorfahren, wenn vorn frei ist und keine Linie da ist.
fehler: 1
besser: if (mbot.getDistance() > 15 && mbot.getLine() == 0) {
> „Und“ schreibt man mit zwei Zeichen: `&&`.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann zwei Bedingungen mit `&&` (und) verknüpfen. → Wand und Linie: und
- Ich kann zwei Bedingungen mit `||` (oder) verknüpfen. → Taste A oder Taste B: oder
- Ich kann eine Bedingung mit `!` (nicht) umdrehen. → Nicht: das Gegenteil
- Ich kann eine verknüpfte Bedingung in einer Java-Schleife schreiben. → Jetzt in Java: Sicher fahren
:::

## Wissenstest

::: quiz
? Der Abstand ist 50 und `mbot.getLine()` liefert 6. Fährt der mBot2 bei „Frei und keine Linie“?
→ Wand und Linie: und
- [ ] Ja, vorn ist ja frei.
- [x] Nein, denn bei `&&` müssen beide Teile wahr sein.
- [ ] Nur halb so weit.
> Er steht auf einer Linie. Damit ist ein Teil falsch, also die ganze Bedingung.
? Nur Taste B ist gedrückt. Ist `mbot.isButtonA() || mbot.isButtonB()` wahr?
→ Taste A oder Taste B: oder
- [x] Ja
- [ ] Nein
> Bei `||` reicht es, wenn ein Teil wahr ist.
? Taste A ist gedrückt. Was ist `!mbot.isButtonA()`?
→ Nicht: das Gegenteil
- [ ] wahr
- [x] falsch
> `!` dreht den Wert um: aus wahr wird falsch.
? Welche Bedingung hält den mBot2 an der Wand **und** am Rand an?
→ Jetzt in Java: Sicher fahren
- [x] `while (mbot.getDistance() > 15 && mbot.getLine() == 0)`
- [ ] `while (mbot.getDistance() > 15 || mbot.getLine() == 0)`
- [ ] `while (mbot.getDistance() > 15)`
> Mit `||` würde er weiterfahren, solange nur einer der Teile stimmt, also zum Beispiel über den Rand hinaus.
:::
