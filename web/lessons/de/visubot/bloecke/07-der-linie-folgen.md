---
titel: Der Linie folgen
bereich: Sensoren und Entscheidungen
kurz: Mit dem Liniensensor am Rand umkehren und einer schwarzen Linie folgen.
---

## Das schaffst du heute

::: kompetenzen
- mit dem Liniensensor eine schwarze Linie erkennen
- den mBot2 am Rand umkehren lassen
- den mBot2 einer Linie folgen lassen
:::

## Augen nach unten

Unter dem mBot2 sitzt vorn der **Liniensensor**. Er leuchtet auf den Boden und sieht, ob es dort hell oder dunkel ist.

::: mbot2
fokus: lineSensor
ansicht: unten
:::

Der Sensor **Linie** aus der Gruppe **➖ Linie** liefert **0**, wenn unter dem mBot2 alles hell ist. Sieht er etwas Schwarzes, ist die Zahl größer als 0.

## Am Rand umkehren

Stell dir einen Tisch vor, um den schwarzes Klebeband klebt. Der mBot2 soll vorfahren, bis er das Band sieht, und dann umkehren. So fällt er nicht herunter.

1. Zieh eine **While-Schleife** unter 🏁.
2. Zieh aus **Operatoren** den Baustein **gleich** auf die Frage hinter **solange**.
3. Leg den Sensor **Linie** in das linke Feld und tipp rechts **0** ein.
4. Leg **fahre vor** in die Schleife und **drehe rechts** mit **180** darunter.

::: übung vbb-rand
titel: Am Rand umkehren
auftrag: Der mBot2 fährt vor, solange er keine Linie sieht. Dann dreht er sich um. Es gibt zwei Welten, der Rand ist mal näher und mal weiter weg.
welt: rand-1 -> forward 20, turnRight 180
welt: rand-2 -> forward 50, turnRight 180
braucht: whileSchleife
tipp: Die Frage der Schleife heißt `mbot.getLine() == 0`.
tipp: **drehe rechts** mit 180 liegt unter der Schleife, nicht darin.
lösung: vbb-rand-loesung.visustruct
:::

## Der Linie folgen

Jetzt kommt ein Klassiker: Der mBot2 fährt eine schwarze Linie entlang, auch durch Kurven. Dafür brauchst du zwei neue Dinge:

- **Linie links?** aus der Gruppe **➖ Linie** sagt ja, wenn der linke Fühler Schwarz sieht.
- **Räder einzeln** aus der Gruppe **⚙️ Räder einzeln** lässt jedes Rad anders schnell drehen. Die erste Zahl ist das linke Rad, die zweite das rechte. Dreht das rechte schneller, fährt er eine Linkskurve.

Die Idee ist ganz einfach: **Wenn** links Schwarz ist, lenkt er nach links. **Sonst** lenkt er nach rechts. So wackelt er an der Linie entlang.

::: übung vbb-linienfolger
titel: Linienfolger
auftrag: Solange die Wand mehr als 15 cm weg ist, folgt der mBot2 der Linie. Danach hält er an. In der einen Welt biegt die Linie nach rechts ab, in der anderen nach links.
welt: linie-1, linie-2
braucht: whileSchleife, verzweigung
tipp: Außen eine While-Schleife mit `mbot.getDistance() > 15`. Darin eine Verzweigung mit **Linie links?**. Unter der Schleife liegt **anhalten**.
tipp: Unter **wenn** liegt **Räder einzeln** mit `10, 40`, unter **sonst** **Räder einzeln** mit `40, 10`.
lösung: vbb-linienfolger-loesung.visustruct
:::

Probier aus: Was passiert mit `20, 60` und `60, 20`? Wird er schneller oder fliegt er aus der Kurve?

::: ludwig
Am echten mBot2 klebst du die Linie mit schwarzem Isolierband auf einen hellen Boden. Fang langsam an, sonst schießt er in der Kurve über die Linie hinaus.
:::

## Spiel: Was passiert?

::: spiel frage
titel: Spiel: Was passiert?
intro: Schau dir die Blöcke an. Was macht der mBot2? Vier Runden.

runde:
    mbot.drive(40, 40);
frage: Wie fährt der mBot2?
- [x] geradeaus
- Linkskurve
- Rechtskurve
> Beide Räder drehen gleich schnell.

runde:
    mbot.drive(10, 40);
frage: Wie fährt der mBot2?
- geradeaus
- [x] Linkskurve
- Rechtskurve
> Das rechte Rad ist schneller, also schiebt es ihn nach links.

runde:
    if (mbot.isLineLeft()) {
        mbot.drive(10, 40);
    } else {
        mbot.drive(40, 10);
    }
frage: Nur der rechte Fühler sieht die Linie. Wie fährt er?
- Linkskurve
- [x] Rechtskurve
- Er hält an.
> Links ist kein Schwarz, also nimmt er den sonst-Teil: das linke Rad ist schneller.

runde:
    while (mbot.getLine() == 0) {
        mbot.forward();
    }
    mbot.turnRight(180);
frage: Der mBot2 steht schon auf der schwarzen Linie. Was tut er?
- Er fährt erst ein Stück vor.
- [x] Er dreht sich sofort um.
- Er fährt immer weiter.
> Die Frage der Schleife ist gleich am Anfang nein, also läuft sie gar nicht.
:::

## Das hab ich geschafft

Wie gut klappt es schon? ☂️ noch nicht, ⛅ ein bisschen, ☀️ klappt prima. Bei ☂️ und ⛅ bringt dich **Nachlesen** zum passenden Schritt.

::: checkliste
- Ich kann mit dem Liniensensor eine Linie erkennen. → Augen nach unten
- Ich kann den mBot2 am Rand umkehren lassen. → Am Rand umkehren
- Ich kann den mBot2 einer Linie folgen lassen. → Der Linie folgen
:::
