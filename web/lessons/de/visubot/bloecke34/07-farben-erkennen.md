---
titel: Farben erkennen
bereich: Der mBot2 entscheidet
kurz: Der mBot2 sieht Farben auf dem Boden.
---

## Das schaffst du heute

::: kompetenzen
- den mBot2 nach einer Farbe fragen
- den mBot2 auf Rot anhalten lassen
:::

## Welche Farbe ist unten?

Unter seiner Nase hat der mBot2 einen **Farbsensor**. Er schaut auf den Boden und erkennt Farben.

Bei den Sensoren liegt die Frage **Farbe ist rot?**.

::: bloecke
    if (mbot.getColor().equals("rot")) {
        mbot.playTone(440, 300);
    } else {
        mbot.forward(30);
    }
> Rot: piepen. Sonst: vorfahren.
:::

::: übung vbk-rot-piep
titel: Piep bei Rot
auftrag: Bau das Programm vom Bild nach. Es wird zweimal geprüft: auf Rot und auf Grün.
messwerte: getColor=rot -> none, tone
messwerte: getColor=grün -> forward 30, noTone
braucht: verzweigung
tipp: **Farbe ist rot?** liegt bei den Sensoren in **🎨 Farben**.
tipp: Unter **wenn** liegt **Ton spielen**, unter **sonst** liegt **fahre vor** mit 30.
lösung: vbk-rot-piep-loesung.visustruct
:::

## Halt an der roten Linie

Vor dem mBot2 liegt ein rotes Feld. Er soll hinfahren und dort piepen. Mit **wiederhole** schaut er nach jedem kleinen Stück, ob er schon auf Rot steht.

::: bloecke
    for (int i = 0; i < 10; i++) {
        if (mbot.getColor().equals("rot")) {
            mbot.playTone(440, 300);
        } else {
            mbot.forward(10);
        }
    }
> Noch nicht rot: ein Stück vor. Rot: piepen und stehen bleiben.
:::

::: übung vbk-bis-rot
titel: Bis Rot
auftrag: Bau das Programm nach. Es wird in zwei Welten geprüft: Das rote Feld ist mal nah und mal weiter weg.
welt: farbe-1 -> forward 20, tone
welt: farbe-2 -> forward 50, tone
braucht: verzweigung, forSchleife
tipp: **wenn … sonst** liegt im Maul von **wiederhole 10 mal**.
tipp: Bei **fahre vor** steht **10**.
lösung: vbk-bis-rot-loesung.visustruct
:::

::: ludwig
Probier aus: Statt zu piepen kann der mBot2 auch rot leuchten. Nimm dafür **LEDs an**.
:::

## Spiel: Was passiert?

::: spiel frage
titel: Spiel: Was passiert?
intro: Der mBot2 steht auf einem **grünen** Feld. Was macht er?

runde:
    if (mbot.getColor().equals("rot")) {
        mbot.playTone(440, 300);
    } else {
        mbot.forward(30);
    }
frage: Was macht der mBot2?
- er piept
- [x] er fährt vor
> Grün ist nicht rot. Also gilt der sonst-Teil.

runde:
    if (mbot.getColor().equals("rot")) {
        mbot.setLed(255, 0, 0);
    } else {
        mbot.setLed(0, 255, 0);
    }
frage: Welche Farbe leuchtet?
- rot
- [x] grün
> Der Boden ist grün, nicht rot: sonst-Teil, grünes Licht.
:::

## Das hab ich geschafft

Wie gut klappt es? ☂️ noch nicht, ⛅ ein bisschen, ☀️ prima.

::: checkliste
- Ich kann den mBot2 nach einer Farbe fragen. → Welche Farbe ist unten?
- Ich kann den mBot2 auf Rot anhalten lassen. → Halt an der roten Linie
:::
