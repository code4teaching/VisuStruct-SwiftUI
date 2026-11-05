---
titel: Immer wieder
bereich: Erste Schritte
kurz: Ein Quadrat fahren und mit „wiederhole“ Blöcke sparen.
---

## Das schaffst du heute

::: kompetenzen
- den mBot2 ein Quadrat fahren lassen
- mit dem Block „wiederhole“ Blöcke sparen
- eigene Formen ausprobieren
:::

## Ein Quadrat

Ein Quadrat hat vier gleich lange Seiten und vier Ecken. Für jede Seite fährt der mBot2 ein Stück vor und dreht sich dann nach rechts.

::: übung vbb-quadrat
titel: Das Quadrat
auftrag: Lass den mBot2 ein Quadrat mit 50 cm langen Seiten fahren. Am Ende steht er wieder am Start.
fahrt: 4 x (forward 50, turnRight 90)
tipp: Eine Seite sind zwei Blöcke: **fahre vor** mit 50 und **drehe rechts**.
tipp: Diese zwei Blöcke brauchst du viermal untereinander, zusammen also acht Blöcke.
lösung: vbb-quadrat-loesung.visustruct
:::

Acht Blöcke, und immer wieder dieselben zwei. Das geht auch kürzer!

## Wiederhole

In der Gruppe **Steuerung** liegt der Block **wiederhole 10 mal**. Er sieht aus wie ein Maul. Alles, was du hineinlegst, macht der mBot2 so oft, wie die Zahl sagt. So eine Wiederholung heißt beim Programmieren **Schleife**.

::: übung vbb-quadrat-wiederhole
titel: Quadrat mit wiederhole
auftrag: Baue das Quadrat noch einmal, aber nur mit **wiederhole** und zwei Blöcken darin.
fahrt: 4 x (forward 50, turnRight 90)
braucht: forSchleife
tipp: Zieh **wiederhole 10 mal** unter 🏁. Leg **fahre vor** und **drehe rechts** in das Maul.
tipp: Klick auf die 10 und tipp **4** ein, denn ein Quadrat hat vier Seiten.
lösung: vbb-quadrat-wiederhole-loesung.visustruct
:::

Aus acht Blöcken sind drei geworden. Starte die Simulation und schau zu, wie der mBot2 viermal dasselbe macht.

## Neue Formen

Jetzt bist du dran. Ändere nur die Zahlen in deinem Programm und schau, was passiert.

::: übung vbb-dreieck
titel: Das Dreieck
auftrag: Lass den mBot2 ein Dreieck mit 50 cm langen Seiten fahren.
fahrt: 3 x (forward 50, turnRight 120)
braucht: forSchleife
tipp: Ein Dreieck hat drei Seiten. Also **wiederhole 3 mal**.
tipp: Bei drei Ecken muss er sich jedes Mal um 120 Grad drehen. Tipp **120** in **drehe rechts**.
lösung: vbb-dreieck-loesung.visustruct
:::

Noch mehr zum Ausprobieren:

- **wiederhole 5 mal** und **drehe rechts** mit **72** ergibt ein Fünfeck.
- **wiederhole 6 mal** mit **60** ergibt ein Sechseck.
- Was passiert mit **wiederhole 36 mal**, **fahre vor** mit 10 und **drehe rechts** mit 10?

::: ludwig
Fällt dir etwas auf? Die Zahl beim Wiederholen mal die Zahl beim Drehen ergibt immer 360. Einmal ganz herum!
:::

## Spiel: Wo landet der mBot2?

::: spiel fahrt
titel: Spiel: Wo landet der mBot2?
intro: Schau dir die Blöcke an und tipp auf das Feld, auf dem der mBot2 am Ende steht. Jedes Feld ist 30 cm groß. Vier Runden.
frage: Auf welchem Feld steht der mBot2 am Ende?

runde:
    for (int i = 0; i < 2; i++) {
        mbot.forward(30);
    }
karte: ..... | ..... | ..^..
ziel: 2,0
> Zweimal ein Feld vor, das sind zwei Felder.

runde:
    for (int i = 0; i < 4; i++) {
        mbot.forward(30);
        mbot.turnRight();
    }
karte: ..... | ..... | ..^..
ziel: 2,2
> Das ist ein Quadrat. Am Ende steht er wieder am Start.

runde:
    for (int i = 0; i < 3; i++) {
        mbot.forward(30);
    }
    mbot.turnRight();
    mbot.forward(30);
karte: ..... | ..... | ..... | ..^..
ziel: 3,0
> Erst dreimal vor, dann nach rechts drehen und noch ein Feld. Der letzte Block steht nicht mehr im Maul von wiederhole.

runde:
    for (int i = 0; i < 2; i++) {
        mbot.forward(30);
        mbot.turnLeft();
    }
karte: ..... | ..... | ..^..
ziel: 1,1
> Vor, links drehen, vor, links drehen. Er steht links neben dem Feld über dem Start.
:::

## Das hab ich geschafft

Wie gut klappt es schon? ☂️ noch nicht, ⛅ ein bisschen, ☀️ klappt prima. Bei ☂️ und ⛅ bringt dich **Nachlesen** zum passenden Schritt.

::: checkliste
- Ich kann den mBot2 ein Quadrat fahren lassen. → Ein Quadrat
- Ich kann mit „wiederhole“ Blöcke sparen. → Wiederhole
- Ich kann neue Formen ausprobieren. → Neue Formen
:::
