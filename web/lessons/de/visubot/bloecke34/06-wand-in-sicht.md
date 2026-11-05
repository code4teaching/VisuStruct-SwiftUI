---
titel: Wand in Sicht
bereich: Der mBot2 entscheidet
kurz: Der mBot2 sieht die Wand und weicht aus.
---

## Das schaffst du heute

::: kompetenzen
- den mBot2 fragen, ob eine Wand nah ist
- den mBot2 immer wieder schauen lassen
:::

## Augen für den mBot2

Vorn hat der mBot2 zwei runde **Augen**. Damit sieht er, wie weit die nächste Wand weg ist. Er schickt einen Ton los, den du nicht hören kannst, und wartet auf das Echo. So machen es auch Fledermäuse.

Bei den Sensoren liegt die Frage **Wand näher als 20 cm?**. Die Zahl kannst du im Block ändern.

::: bloecke
    if (mbot.getDistance() < 20) {
        mbot.turnRight();
    } else {
        mbot.forward(30);
    }
> Wand nah: rechts drehen. Sonst: vorfahren.
:::

::: übung vbk-wand
titel: Wand vorn?
auftrag: Bau das Programm vom Bild nach. Es wird in zwei Welten geprüft: einmal steht die Wand direkt vor dem mBot2, einmal ist viel Platz.
welt: wand-nah -> turnRight
welt: wand-frei -> forward 30
braucht: verzweigung
tipp: Zieh **Wand näher als 20 cm?** aus **📏 Abstand** auf die Frage bei **wenn**.
tipp: Unter **wenn** liegt **drehe rechts**, unter **sonst** liegt **fahre vor** mit 30.
lösung: vbk-wand-loesung.visustruct
:::

## Immer wieder schauen

Eben hat der mBot2 nur **einmal** geschaut. Legst du **wenn … sonst** in **wiederhole**, schaut er nach jedem kleinen Stück neu.

::: bloecke
    for (int i = 0; i < 10; i++) {
        if (mbot.getDistance() < 20) {
            mbot.turnRight();
        } else {
            mbot.forward(10);
        }
    }
> Zehnmal schauen: Wand nah, dann drehen. Sonst ein kleines Stück vor.
:::

::: übung vbk-ausweichen
titel: Um die Wand herum
auftrag: Bau das Programm vom Bild nach. Der mBot2 fährt bis zur Wand, dreht sich und kommt zum Ziel 🏁.
welt: kids-wand
braucht: verzweigung, forSchleife
tipp: **wenn … sonst** liegt im Maul von **wiederhole 10 mal**.
tipp: Bei **fahre vor** steht nur **10**. So schaut der mBot2 oft genug.
lösung: vbk-ausweichen-loesung.visustruct
:::

## Spiel: Wo landet der mBot2?

::: spiel fahrt
titel: Spiel: Wo landet der mBot2?
intro: Die grauen Felder sind Wände. Nimmt der mBot2 den wenn-Teil oder den sonst-Teil? Tipp auf das Feld, auf dem er am Ende steht.
frage: Wo steht der mBot2 am Ende?

runde:
    if (mbot.getDistance() < 20) {
        mbot.turnRight();
    } else {
        mbot.forward(30);
    }
karte: ..#.. | ..^.. | .....
ziel: 2,1
> Die Wand ist direkt vor ihm. Er dreht sich nur und bleibt stehen.

runde:
    if (mbot.getDistance() < 20) {
        mbot.turnRight();
    } else {
        mbot.forward(30);
    }
karte: ..#.. | ..... | ..^..
ziel: 2,1
> Die Wand ist noch weit weg. Er fährt ein Feld vor.

runde:
    if (mbot.getDistance() < 20) {
        mbot.turnRight();
        mbot.forward(30);
    } else {
        mbot.forward(30);
    }
karte: ..... | ..#.. | ..^..
ziel: 3,2
> Wand vorn: Er dreht sich nach rechts und fährt ein Feld zur Seite.
:::

## Das hab ich geschafft

Wie gut klappt es? ☂️ noch nicht, ⛅ ein bisschen, ☀️ prima.

::: checkliste
- Ich kann fragen, ob eine Wand nah ist. → Augen für den mBot2
- Ich kann den mBot2 immer wieder schauen lassen. → Immer wieder schauen
:::
