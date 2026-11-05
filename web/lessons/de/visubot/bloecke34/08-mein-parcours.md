---
titel: Mein Parcours
bereich: Alles zusammen
kurz: Ein Parcours mit Stationen, alles zusammen.
---

## Das schaffst du heute

::: kompetenzen
- einen Weg durch einen Parcours bauen
- Fahren, Licht und Entscheidungen zusammen benutzen
:::

## Station 1: Durchs Tor

Der mBot2 muss durch einen engen Gang zum Ziel 🏁. Die grauen Felder sind Wände. Ein Feld ist 30 cm groß.

::: bloecke
    mbot.forward(60);
    mbot.turnRight();
    mbot.forward(60);
> Zwei Felder hoch, rechts herum, zwei Felder zum Ziel.
:::

::: übung vbk-tor
titel: Durchs Tor
auftrag: Bring den mBot2 ins Ziel, ohne eine Wand zu berühren.
welt: kids-tor
tipp: Zähl die Felder: Wie weit geht es hoch, wie weit nach rechts?
tipp: Zwei Felder sind 60 cm. **fahre vor** 60, **drehe rechts**, **fahre vor** 60.
lösung: vbk-tor-loesung.visustruct
:::

## Station 2: Achtung, Wand!

Jetzt weiß der mBot2 nicht, wo die Wand kommt. Er soll selbst schauen. Sieht er die Wand, leuchtet er rot und dreht sich.

::: bloecke
    for (int i = 0; i < 10; i++) {
        if (mbot.getDistance() < 20) {
            mbot.setLed(255, 0, 0);
            mbot.turnRight();
        } else {
            mbot.forward(10);
        }
    }
> Unter **wenn** liegen zwei Blöcke: erst Licht, dann drehen.
:::

::: übung vbk-achtung
titel: Achtung, Wand!
auftrag: Bau das Programm nach. Der mBot2 fährt bis zur Wand, leuchtet rot, dreht sich und kommt ins Ziel 🏁.
welt: kids-wand
welt: kids-wand -> forward 50, turnRight 90, forward 40, ledOn
braucht: verzweigung, forSchleife
tipp: Nimm dein Programm aus der Lektion **Wand in Sicht** und leg **LEDs an** über **drehe rechts**.
tipp: Im Block **LEDs an** stehen **255**, **0**, **0**.
lösung: vbk-achtung-loesung.visustruct
:::

## Station 3: Deine Idee

Jetzt bist du dran! Bau deinen eigenen Parcours auf dem Tisch oder auf dem Boden. Leg Bücher als Wände hin oder klebe Klebeband als Weg.

- Lass den mBot2 am Ende eine Melodie spielen.
- Lass ihn blinken, wenn er im Ziel ist.
- Fahr ein Quadrat um eine Tasse herum.

::: ludwig
Teste dein Programm erst in der Simulation. Dann weißt du schon vorher, ob der echte mBot2 richtig fährt.
:::

## Spiel: Wo landet der mBot2?

::: spiel fahrt
titel: Spiel: Wo landet der mBot2?
intro: Alles zusammen! Tipp auf das Feld, auf dem der mBot2 am Ende steht. Ein Feld ist 30 cm groß.
frage: Wo steht der mBot2 am Ende?

runde:
    mbot.forward(60);
    mbot.turnLeft();
    mbot.forward(30);
karte: ..... | ..... | ..^..
ziel: 1,0
> Zwei Felder hoch, links herum, ein Feld.

runde:
    for (int i = 0; i < 3; i++) {
        mbot.forward(30);
    }
    mbot.turnRight();
    mbot.forward(30);
karte: ..... | ..... | ..... | ..^..
ziel: 3,0
> Dreimal vor, dann rechts herum und noch ein Feld.

runde:
    for (int i = 0; i < 4; i++) {
        if (mbot.getDistance() < 20) {
            mbot.turnRight();
        } else {
            mbot.forward(30);
        }
    }
karte: ..#.. | ..... | ..^..
ziel: 4,1
> Erst ist Platz: ein Feld vor. Dann ist die Wand nah: drehen. Danach ist wieder Platz: noch zwei Felder nach rechts.
:::

## Das hab ich geschafft

Wie gut klappt es? ☂️ noch nicht, ⛅ ein bisschen, ☀️ prima.

::: checkliste
- Ich kann einen Weg durch einen Parcours bauen. → Station 1: Durchs Tor
- Ich kann Fahren, Licht und Entscheidungen zusammen benutzen. → Station 2: Achtung, Wand!
:::
