---
titel: Der mBot2 misst
bereich: Sensoren und Entscheidungen
kurz: Den Abstand zur Wand messen und rechtzeitig anhalten.
---

## Das schaffst du heute

::: kompetenzen
- den Abstand messen und auf dem Bildschirm zeigen
- fahren lassen, solange vorn frei ist
:::

## Die Augen vorn

Vorn am mBot2 sitzen zwei runde „Augen“. Das ist der **Ultraschallsensor**. Er schickt ein Geräusch los, das du nicht hören kannst, und wartet auf das Echo. So weiß er, wie weit die nächste Wand weg ist, in Zentimetern.

::: mbot2
fokus: ultrasonic
ansicht: vorn
:::

Links unter **Elemente** findest du weiter unten die **mBot2-Sensoren**. Ein Sensor ist kein eigener Block. Er ist ein runder Baustein, den du in ein weißes Feld legst.

::: übung vbb-abstand-zeigen
titel: Abstand anzeigen
auftrag: Der mBot2 soll den Abstand zur Wand auf seinem Bildschirm zeigen. Nimm dafür den Block **Text anzeigen** und leg den Sensor **Abstand** in sein weißes Feld.
messwerte: getDistance=35 -> screen "35"
messwerte: getDistance=12 -> screen "12"
tipp: **Text anzeigen** liegt in der Gruppe **🖥️ Bildschirm**, **Abstand** in der Gruppe **📏 Abstand**.
tipp: Zieh **Abstand** genau auf das weiße Feld mit „Hallo“. Dann steht im Block `mbot.showText(mbot.getDistance())`.
lösung: vbb-abstand-zeigen-loesung.visustruct
:::

## Fahren, solange frei ist

Der mBot2 soll auf eine Wand zufahren und kurz davor anhalten. Wie weit die Wand weg ist, weiß er vorher nicht. Er muss also immer wieder messen.

Dafür gibt es die **While-Schleife**. *While* heißt „solange“. Sie wiederholt ihren Inhalt, solange die Frage oben drin mit **ja** beantwortet wird. So baust du die Frage „Ist mehr als 15 cm frei?“:

1. Zieh eine **While-Schleife** unter 🏁.
2. Zieh aus **Operatoren** den Baustein **größer als** auf die Frage der Schleife.
3. Leg den Sensor **Abstand** in das linke Feld und tipp rechts **15** ein.
4. Leg **fahre vor** in die Schleife.

::: übung vbb-bis-wand
titel: Bis zur Wand
auftrag: Der mBot2 fährt vor, solange mehr als 15 cm frei sind. Dein Programm muss in drei Welten klappen, die Wand steht jedes Mal woanders. Über der Simulation kannst du die Welt wechseln.
welt: wand-kurz, wand-mittel, wand-lang
braucht: whileSchleife
tipp: Die Frage der Schleife heißt `mbot.getDistance() > 15`.
tipp: In der Schleife liegt nur **fahre vor** mit leerem Feld. So fährt er immer 10 cm und misst dann neu.
lösung: vbb-bis-wand-loesung.visustruct
:::

Probier aus: Was passiert, wenn du statt 15 eine **5** eintippst? Und was bei **100**?

::: ludwig
Mit fünfmal **fahre vor** klappt es nur in einer Welt. Mit dem Sensor findet der mBot2 die Wand überall.
:::

## Spiel: Wo landet der mBot2?

::: spiel fahrt
titel: Spiel: Wo landet der mBot2?
intro: Die grauen Felder sind Wände. Schau dir die Blöcke an und tipp auf das Feld, auf dem der mBot2 am Ende steht. Jedes Feld ist 30 cm groß. Vier Runden.
frage: Auf welchem Feld steht der mBot2 am Ende?

runde:
    while (mbot.getDistance() > 15) {
        mbot.forward(30);
    }
karte: ..#.. | ..... | ..... | ..^..
ziel: 2,1
> Er fährt, solange mehr als 15 cm frei sind. Direkt vor der Wand bleibt er stehen.

runde:
    while (mbot.getDistance() > 40) {
        mbot.forward(30);
    }
karte: ..#.. | ..... | ..... | ..... | ..^..
ziel: 2,2
> Zwei Felder vor der Wand sind schon weniger als 40 cm frei. Dort hält er an.

runde:
    mbot.turnRight();
    while (mbot.getDistance() > 15) {
        mbot.forward(30);
    }
karte: ..... | ..^.# | .....
ziel: 3,1
> Erst dreht er sich zur Wand, dann fährt er bis kurz davor.

runde:
    while (mbot.getDistance() > 15) {
        mbot.forward(30);
    }
    mbot.turnLeft();
    mbot.forward(60);
karte: ..#.. | ..... | ..... | ..^..
ziel: 0,1
> Bis vor die Wand, dann nach links drehen und zwei Felder weiter.
:::

## Das hab ich geschafft

Wie gut klappt es schon? ☂️ noch nicht, ⛅ ein bisschen, ☀️ klappt prima. Bei ☂️ und ⛅ bringt dich **Nachlesen** zum passenden Schritt.

::: checkliste
- Ich kann den Abstand auf dem Bildschirm zeigen. → Die Augen vorn
- Ich kann den mBot2 fahren lassen, solange vorn frei ist. → Fahren, solange frei ist
:::
