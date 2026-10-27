---
titel: Variablen und Ausgabe
bereich: VisuBot
kurz: Werte in Variablen speichern, den mBot2 damit fahren lassen und Ergebnisse ausgeben.
---

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
| `double` | Kommazahlen, mit Punkt geschrieben | `double tempo = 1.5;` |
| `String` | Text in Anführungszeichen | `String name = "Visu";` |
| `boolean` | wahr oder falsch | `boolean fertig = false;` |

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

## Jetzt ohne Roboter: Ausgabe

Nicht jedes Ergebnis muss der Roboter fahren. Mit `System.out.println(…)` gibt ein Java-Programm Text in der [Konsole](#zeige-konsole) aus. Mit `+` hängst du Text und Werte aneinander:

```java
int seite = 30;
int strecke = 4 * seite;
System.out.println("Strecke: " + strecke + " cm");
```

Die Konsole zeigt dann **Strecke: 120 cm**.

::: übung vb-ohne-strecke
titel: Wie weit fährt er?
code: java
auftrag: Ein Rechteck ist 60 cm lang und 30 cm breit. Lege `laenge` und `breite` als Variablen an. Berechne in einer Variablen `strecke`, wie weit der mBot2 einmal ganz herum fährt, und gib **Strecke: 180 cm** aus. Ganz ohne `mbot`!
test: - -> Strecke: 180 cm
braucht: anweisung
tipp: Einmal herum sind zweimal die Länge und zweimal die Breite.
tipp: `int strecke = 2 * laenge + 2 * breite;` und dann `System.out.println("Strecke: " + strecke + " cm");`
lösung: vb-ohne-strecke-loesung.visustruct
:::

::: quiz
? Was fährt `mbot.forward(seite)`, wenn vorher `int seite = 40;` steht?
- [ ] 4 cm
- [x] 40 cm
- [ ] gar nichts, `seite` ist kein Befehl
> Wo `seite` steht, setzt Java den Wert 40 ein.
? Welcher Datentyp passt zu `"Visu"`?
- [ ] `int`
- [ ] `double`
- [x] `String`
> Text in Anführungszeichen ist ein `String`.
? Was gibt `System.out.println("Seite: " + 30);` aus?
- [x] Seite: 30
- [ ] "Seite: " + 30
- [ ] 30
> Das `+` hängt den Text und die Zahl aneinander.
:::

::: checkliste
- Ich kann eine Variable anlegen und benutzen. → Eine Variable für die Seite
- Ich kenne die Datentypen `int`, `double`, `String` und `boolean`. → Welche Datentypen gibt es?
- Ich kann mit zwei Variablen ein Rechteck in Java fahren. → Jetzt in Java: Rechteck
- Ich kann mit `System.out.println` etwas ausgeben. → Jetzt ohne Roboter: Ausgabe
:::
