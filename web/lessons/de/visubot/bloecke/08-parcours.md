---
titel: Parcours
bereich: Sensoren und Entscheidungen
kurz: Alles zusammen: der Linie bis Rot folgen, Klötzen ausweichen und einen eigenen Parcours bauen.
---

## Das schaffst du heute

::: kompetenzen
- den mBot2 einer Linie bis zum roten Feld folgen lassen
- den mBot2 vor einem Klotz warnen und ausweichen lassen
- einen eigenen Parcours planen und Stück für Stück bauen
:::

## Station 1: Bis zum roten Feld

Ein Parcours besteht aus Stationen. Bei der ersten folgt der mBot2 einer schwarzen Linie. Am Ende der Linie liegt ein rotes Feld, dort soll er anhalten.

Du kennst schon alles dafür. Den Linienfolger hast du in der letzten Lektion gebaut. Neu ist nur die Frage hinter **solange**: Er fährt, solange er **nicht** auf Rot steht.

1. Zieh eine **While-Schleife** unter 🏁.
2. Zieh **nicht** aus **Operatoren** auf die Frage und leg **Farbe ist rot?** hinein.
3. Leg in die Schleife eine **Verzweigung** mit **Linie links?**.
4. Unter **wenn** kommt **Räder einzeln** mit `10, 40`, unter **sonst** mit `40, 10`.
5. Unter die Schleife legst du **anhalten**.

::: übung vbb-linie-bis-rot
titel: Bis zum roten Feld
auftrag: Der mBot2 folgt der Linie, solange er nicht auf Rot steht. Dann hält er an. In der zweiten Welt schlängelt sich die Linie.
welt: linie-rot-1, linie-rot-2
braucht: whileSchleife, verzweigung
tipp: Die Frage der Schleife heißt `!mbot.getColor().equals("rot")`. Im Block steht dort **nicht Farbe ist rot?**.
tipp: In der Schleife liegt dieselbe Verzweigung wie beim Linienfolger aus Lektion 7.
lösung: vbb-linie-bis-rot-loesung.visustruct
:::

## Station 2: Achtung, Klotz!

Bei der zweiten Station stehen Klötze im Weg. Der mBot2 fährt in kleinen Schritten vor. Ist ein Klotz näher als 20 cm, warnt er mit oranger Lampe und Piepton und fährt außen herum. Danach geht die Lampe aus.

Außen herum heißt: **drehe rechts**, **fahre vor** mit 30, **drehe links**. Dann steht er neben dem Klotz und schaut wieder nach vorn.

::: übung vbb-klotz
titel: Achtung, Klotz!
auftrag: Solange der mBot2 nicht auf Rot steht: Ist ein Klotz näher als 20 cm, leuchtet er orange, piept und weicht aus. Sonst fährt er ein Stück vor. Es gibt zwei Welten, in der zweiten stehen zwei Klötze.
welt: hindernis-1 -> tone
welt: hindernis-2 -> tone
braucht: whileSchleife, verzweigung
tipp: Außen dieselbe Schleife wie bei Station 1. Darin eine Verzweigung mit **Abstand** **kleiner als** 20. Unter **sonst** liegt **fahre vor**.
tipp: Unter **wenn**: **LEDs an** mit `255, 128, 0`, **Ton spielen** mit `880, 200`, **drehe rechts**, **fahre vor** mit 30, **drehe links**, **LEDs aus**.
lösung: vbb-klotz-loesung.visustruct
:::

## Dein eigener Parcours

Jetzt bist du dran! Bau mit Klebeband und Kartons einen Parcours auf dem Boden. Plane erst, dann programmier Station für Station:

- **Start:** Der mBot2 wartet, bis du Taste A drückst.
- **Linie:** Er folgt einer schwarzen Linie bis zu einem roten Blatt Papier.
- **Klotz:** Danach weicht er einem Karton aus.
- **Ziel:** Am Ende blinkt er grün und spielt eine Melodie.

Probier jede Station erst allein aus. Klappt sie, hängst du die nächste unten an. So findest du Fehler viel schneller.

::: ludwig
Profis machen das genauso: Sie testen jedes kleine Stück, bevor sie alles zusammenstecken. Bei Robotik-Wettbewerben gewinnt oft nicht der schnellste Roboter, sondern der, der zuverlässig ins Ziel kommt.
:::

## Spiel: Wo landet der mBot2?

::: spiel fahrt
titel: Spiel: Wo landet der mBot2?
intro: Die grauen Felder sind Wände. Schau dir die Blöcke an und tipp auf das Feld, auf dem der mBot2 am Ende steht. Jedes Feld ist 30 cm groß. Drei Runden.
frage: Auf welchem Feld steht der mBot2 am Ende?

runde:
    while (mbot.getDistance() > 15) {
        mbot.forward(30);
    }
    mbot.turnRight();
    while (mbot.getDistance() > 15) {
        mbot.forward(30);
    }
karte: #.... | ..... | ^...#
ziel: 4,1
> Er fährt bis vor die Wand, dreht sich nach rechts und fährt wieder, bis der Rand kommt.

runde:
    for (int i = 0; i < 3; i++) {
        if (mbot.getDistance() < 20) {
            mbot.turnRight();
        } else {
            mbot.forward(30);
        }
    }
karte: ..#.. | ..... | ..^..
ziel: 3,1
> Erst ist frei, er fährt ein Feld. Dann ist die Wand direkt vor ihm, er dreht sich. Beim dritten Mal ist wieder frei, er fährt nach rechts.

runde:
    while (mbot.getDistance() > 15) {
        mbot.forward(30);
    }
    mbot.turnLeft();
    mbot.forward(30);
    mbot.turnRight();
    while (mbot.getDistance() > 15) {
        mbot.forward(30);
    }
karte: ..... | ..#.. | ..... | ..^..
ziel: 1,0
> Er fährt bis vor den Klotz, weicht nach links aus und fährt dann geradeaus weiter bis zum Rand.
:::

## Das hab ich geschafft

Wie gut klappt es schon? ☂️ noch nicht, ⛅ ein bisschen, ☀️ klappt prima. Bei ☂️ und ⛅ bringt dich **Nachlesen** zum passenden Schritt.

::: checkliste
- Ich kann den mBot2 einer Linie bis zum roten Feld folgen lassen. → Station 1: Bis zum roten Feld
- Ich kann den mBot2 vor einem Klotz warnen und ausweichen lassen. → Station 2: Achtung, Klotz!
- Ich kann einen eigenen Parcours Station für Station bauen. → Dein eigener Parcours
:::
