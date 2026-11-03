---
titel: Variablen und Ausgabe
bereich: Losfahren
kurz: Werte in Variablen speichern, den mBot2 damit fahren lassen und Ergebnisse auf dem Bildschirm zeigen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- eine Variable anlegen und benutzen
- die Datentypen `int`, `double`, `String` und `boolean` unterscheiden
- mit zwei Variablen ein Rechteck in Java fahren
- mit `mbot.showText` ein Ergebnis auf dem Bildschirm zeigen
:::

## Eine Variable für die Seite

Mit `mbot.forward(30)` fährt der mBot2 30 cm am Stück. Fährst du damit ein Quadrat ohne Schleife, steht die 30 aber viermal im Programm. Soll das Quadrat größer werden, musst du sie an vier Stellen ändern. Besser ist es, die Seitenlänge **einmal** zu speichern und dann überall zu benutzen.

Dafür gibt es **Variablen**. Eine Variable ist ein Kästchen mit einem Namen, in dem ein Wert liegt:

```java
int seite = 30;
mbot.forward(seite);
```

- `int` ist der **Datentyp**: eine ganze Zahl.
- `seite` ist der **Name**. Du darfst ihn selbst wählen.
- `30` ist der **Wert**. Das `=` legt ihn in das Kästchen.

Wo danach `seite` steht, setzt der Computer den Wert ein. `mbot.forward(seite)` fährt also 30 cm.

::: übung vb-variable-seite
titel: Quadrat mit Variable
auftrag: Lege in einer Anweisung die Variable `int seite = 30` an. Danach fährt der mBot2 ein Quadrat: viermal `seite` Zentimeter vor und nach rechts drehen.
fahrt: 4 x (forward 30, turnRight)
braucht: forSchleife
tipp: Die erste Anweisung ist `int seite = 30`. Darunter kommt eine For-Schleife, die viermal läuft.
tipp: In der Schleife stehen `mbot.forward(seite)` und `mbot.turnRight()`.
lösung: vb-variable-seite-loesung.visustruct
:::

> Ändere jetzt nur die 30 in eine 60 und starte die Simulation. Das ganze Quadrat wird doppelt so groß.

## Welche Datentypen gibt es?

Jede Variable hat einen Datentyp. Er legt fest, welche Werte hineinpassen:

| Datentyp | Was passt hinein? | Beispiel |
|---|---|---|
| `int` | ganze Zahlen | `int seite = 30;` |
| `double` | Kommazahlen, mit Punkt geschrieben | `double radumfang = 20.4;` |
| `String` | Text in Anführungszeichen | `String name = "Ludwig";` |
| `boolean` | wahr oder falsch | `boolean wandNah = mbot.getDistance() < 20;` |

Ein Rad des mBot2 kommt mit einer Umdrehung etwa 20.4 cm weit, das ist eine Kommazahl. In `wandNah` steht `true`, wenn die Wand näher als 20 cm ist. Den Abstandssensor lernst du in Lektion 4 kennen.

Mit Variablen kannst du auch rechnen: `int strecke = 4 * seite;` rechnet die ganze Strecke des Quadrats aus.

## Jetzt in Java: Rechteck

Ein Rechteck hat zwei verschiedene Seiten. Also brauchst du zwei Variablen.

::: übung vb-java-rechteck
titel: Rechteck mit Variablen
code: java
auftrag: Schreibe in Java: Lege `int laenge = 60` und `int breite = 30` an. Der mBot2 fährt ein Rechteck: Länge, rechts drehen, Breite, rechts drehen, und das zweimal.
fahrt: 2 x (forward 60, turnRight, forward 30, turnRight)
braucht: forSchleife
tipp: Zwei Variablen oben: `int laenge = 60;` und `int breite = 30;`. Darunter eine For-Schleife, die zweimal läuft.
tipp: In der Schleife: `mbot.forward(laenge);`, `mbot.turnRight();`, `mbot.forward(breite);`, `mbot.turnRight();`
lösung: vb-java-rechteck-loesung.visustruct
:::

## Ergebnis auf dem Bildschirm

Der mBot2 kann nicht nur fahren, er kann dir auch etwas zeigen. Mit `mbot.showText(…)` steht ein Text auf dem [Bildschirm]{teil=screen} des CyberPi. Mit `+` hängst du Text und Werte aneinander:

```java
int seite = 30;
int strecke = 4 * seite;
mbot.showText("Strecke: " + strecke + " cm");
```

Der Bildschirm zeigt dann **Strecke: 120 cm**. Den Bildschirm lernst du in Lektion 18 noch genauer kennen.

::: übung vb-strecke-anzeigen
titel: Wie weit fährt er?
code: java
auftrag: Lege `int laenge = 60` und `int breite = 30` an und fahre das Rechteck wie eben. Berechne danach in einer Variablen `strecke`, wie weit der mBot2 einmal ganz herum gefahren ist, und zeige **Strecke: 180 cm** auf dem Bildschirm.
fahrt: 2 x (forward 60, turnRight, forward 30, turnRight)
befehle: showText "Strecke: 180 cm"
braucht: forSchleife
tipp: Einmal herum sind zweimal die Länge und zweimal die Breite: `int strecke = 2 * laenge + 2 * breite;`
tipp: Nach der Schleife: `mbot.showText("Strecke: " + strecke + " cm");`
lösung: vb-strecke-anzeigen-loesung.visustruct
:::

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektion [„Eingabe und Ausgabe“](?visustruct&lektion=06-eingabe-und-ausgabe). Sie öffnet sich in einem neuen Fenster. Dort gibst du Ergebnisse mit `System.out.println` in der Konsole aus.

## Spiel: Welcher Datentyp?

::: spiel frage
titel: Spiel: Welcher Datentyp?
intro: Ludwig hat die Datentypen weggewischt. Welcher passt in die Lücke? Sieben Runden.
antworten: int | double | String | boolean

runde:
    ___ seite = 30;
frage: Welcher Datentyp passt?
richtig: int
> 30 ist eine ganze Zahl.

runde:
    ___ radumfang = 20.4;
frage: Welcher Datentyp passt?
richtig: double
> 20.4 ist eine Kommazahl, in Java mit Punkt geschrieben.

runde:
    ___ name = "Ludwig";
frage: Welcher Datentyp passt?
richtig: String
> Text in Anführungszeichen ist ein `String`.

runde:
    ___ wandNah = mbot.getDistance() < 20;
frage: Welcher Datentyp passt?
richtig: boolean
> Ein Vergleich ist wahr oder falsch, also `boolean`.

runde:
    ___ abstand = mbot.getDistance();
frage: Welcher Datentyp passt?
richtig: int
> Der Abstandssensor liefert ganze Zentimeter, zum Beispiel 38.

runde:
    ___ gruss = "Hallo " + "Klasse";
frage: Welcher Datentyp passt?
richtig: String
> Zwei Texte mit `+` ergeben wieder einen Text.

runde:
    ___ mittelwert = 120 / 5.0;
frage: Welcher Datentyp passt?
richtig: double
> Mit `5.0` rechnet Java mit Kommazahlen. Das Ergebnis ist 24.0.
:::

## Spiel: Wo landet der mBot2?

::: spiel fahrt
titel: Spiel: Wo landet der mBot2?
intro: Lies das Programm und tippe auf das Feld, auf dem der mBot2 am Ende steht. Achte auf die Werte in den Variablen. Jedes Feld ist 30 cm groß. Vier Runden.
frage: Auf welchem Feld steht der mBot2 am Ende?

runde:
    int seite = 60;
    mbot.forward(seite);
    mbot.turnRight();
    mbot.forward(seite);
karte: ... | ... | ^..
ziel: 2,0
> `seite` ist 60, also zwei Felder hoch und zwei nach rechts.

runde:
    int a = 30;
    int b = a * 3;
    mbot.forward(b);
karte: ... | ... | ... | ^..
ziel: 0,0
> `b` ist 3 · 30 = 90 cm, also drei Felder.

runde:
    int strecke = 30 * 2;
    mbot.backward(strecke);
karte: ..^.. | ..... | .....
ziel: 2,2
> `backward` fährt rückwärts: Er schaut nach oben, fährt aber 60 cm nach unten.

runde:
    int seite = 30;
    for (int i = 0; i < 2; i++) {
        mbot.forward(seite);
        mbot.turnRight();
        seite = seite + 30;
    }
karte: .... | .... | .... | ^...
ziel: 2,2
> Erst 30 cm hoch, dann wächst `seite` auf 60: zwei Felder nach rechts.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann eine Variable anlegen und benutzen. → Eine Variable für die Seite
- Ich kann die Datentypen `int`, `double`, `String` und `boolean` unterscheiden. → Welche Datentypen gibt es?
- Ich kann mit zwei Variablen ein Rechteck in Java fahren. → Jetzt in Java: Rechteck
- Ich kann mit `mbot.showText` ein Ergebnis auf dem Bildschirm zeigen. → Ergebnis auf dem Bildschirm
:::

## Wissenstest

::: quiz
? Was fährt `mbot.forward(seite)`, wenn vorher `int seite = 40;` steht?
→ Eine Variable für die Seite
- [ ] 4 cm
- [x] 40 cm
- [ ] gar nichts, `seite` ist kein Befehl
> Wo `seite` steht, setzt Java den Wert 40 ein.
? Welcher Datentyp passt zu `"Ludwig"`?
→ Welche Datentypen gibt es?
- [ ] `int`
- [ ] `double`
- [x] `String`
> Text in Anführungszeichen ist ein `String`.
? Was zeigt `mbot.showText("Seite: " + 30);` auf dem Bildschirm?
→ Ergebnis auf dem Bildschirm
- [x] Seite: 30
- [ ] "Seite: " + 30
- [ ] 30
> Das `+` hängt den Text und die Zahl aneinander.
:::
