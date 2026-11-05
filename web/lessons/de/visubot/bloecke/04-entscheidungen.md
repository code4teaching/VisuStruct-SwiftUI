---
titel: Entscheidungen
bereich: Sensoren und Entscheidungen
kurz: Mit if und else entscheidet der mBot2 selbst, was er tut.
---

## Das schaffst du heute

::: kompetenzen
- mit **if** und **else** eine Entscheidung bauen
- den mBot2 auf eine Wand reagieren lassen
- den mBot2 auf eine Farbe reagieren lassen
:::

## Wenn … sonst …

Du entscheidest jeden Tag: **Wenn** es regnet, nimmst du einen Schirm mit, **sonst** nicht. Der mBot2 kann das auch.

Zieh eine **Verzweigung** unter 🏁. Oben steht **if**, das heißt „wenn“. Darunter kommt alles, was passiert, wenn die Antwort **ja** ist. Bei **else**, also „sonst“, steht, was bei **nein** passiert. Der mBot2 macht immer nur einen der beiden Teile.

::: übung vbb-wand-vorn
titel: Wand vorn?
auftrag: Wenn die Wand näher als 20 cm ist, dreht sich der mBot2 nach rechts. Sonst fährt er vor. Dein Programm wird in zwei Welten geprüft, einmal mit Wand direkt vor ihm und einmal mit viel Platz.
welt: wand-nah -> turnRight
welt: wand-frei -> forward
braucht: verzweigung
tipp: Zieh **kleiner als** aus **Operatoren** auf die Frage bei **if**. Leg **Abstand** in das linke Feld und tipp rechts **20** ein.
tipp: Unter **if** liegt **drehe rechts**, unter **else** liegt **fahre vor**.
lösung: vbb-wand-vorn-loesung.visustruct
:::

## Rot heißt Stopp

Unten am mBot2 sitzt ein Farbsensor. Der Baustein **Farbe ist rot?** liefert schon ja oder nein. Du kannst ihn darum direkt auf die Frage bei **if** ziehen, ohne **kleiner als**.

::: übung vbb-ampel
titel: Rote Ampel
auftrag: Steht der mBot2 auf Rot, hält er an. Sonst fährt er ein Stück vor.
messwerte: getColor=rot -> none
messwerte: getColor=grün -> forward
braucht: verzweigung
tipp: **Farbe ist rot?** liegt in der Gruppe **🎨 Farben** bei den Sensoren.
tipp: Unter **if** liegt **anhalten**, unter **else** liegt **fahre vor**.
lösung: vbb-ampel-loesung.visustruct
:::

Probier aus: Klick im Block auf „rot“ und tipp **grün** ein. Was macht der mBot2 jetzt?

::: ludwig
Ich entscheide auch so: Wenn Löwenzahn da ist, fresse ich. Sonst suche ich weiter.
:::

## Spiel: Wo landet der mBot2?

::: spiel fahrt
titel: Spiel: Wo landet der mBot2?
intro: Die grauen Felder sind Wände. Überleg, ob der mBot2 den if-Teil oder den else-Teil nimmt, und tipp auf das Feld, auf dem er am Ende steht. Jedes Feld ist 30 cm groß. Vier Runden.
frage: Auf welchem Feld steht der mBot2 am Ende?

runde:
    if (mbot.getDistance() < 20) {
        mbot.turnRight();
    } else {
        mbot.forward(30);
    }
karte: ..#.. | ..^.. | .....
ziel: 2,1
> Die Wand ist direkt vor ihm. Er nimmt den if-Teil, dreht sich nur und bleibt auf seinem Feld.

runde:
    if (mbot.getDistance() < 20) {
        mbot.turnRight();
    } else {
        mbot.forward(30);
    }
karte: ..#.. | ..... | ..^..
ziel: 2,1
> Die Wand ist noch weit weg. Er nimmt den else-Teil und fährt ein Feld vor.

runde:
    if (mbot.getDistance() < 20) {
        mbot.turnRight();
    }
    mbot.forward(30);
karte: ..#.. | ..^.. | .....
ziel: 3,1
> Die Wand ist nah, also dreht er sich nach rechts. Der Block unter der Verzweigung läuft immer, also fährt er danach ein Feld nach rechts.

runde:
    if (mbot.getDistance() > 50) {
        mbot.forward(60);
    } else {
        mbot.turnLeft();
        mbot.forward(30);
    }
karte: ..#.. | ..... | ..^..
ziel: 1,2
> Bis zur Wand sind es weniger als 50 cm. Also nimmt er else: links drehen und ein Feld fahren.
:::

## Das hab ich geschafft

Wie gut klappt es schon? ☂️ noch nicht, ⛅ ein bisschen, ☀️ klappt prima. Bei ☂️ und ⛅ bringt dich **Nachlesen** zum passenden Schritt.

::: checkliste
- Ich kann mit if und else eine Entscheidung bauen. → Wenn … sonst …
- Ich kann den mBot2 auf eine Wand reagieren lassen. → Wenn … sonst …
- Ich kann den mBot2 auf eine Farbe reagieren lassen. → Rot heißt Stopp
:::
