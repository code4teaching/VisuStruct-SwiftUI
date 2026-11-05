---
titel: Die Farb-Ampel
bereich: Sensoren und Entscheidungen
kurz: Mit „wähle je nach“ hat der mBot2 für jede Farbe einen eigenen Weg.
---

## Das schaffst du heute

::: kompetenzen
- mit „wähle je nach“ mehrere Fälle unterscheiden
- für jede Farbe eine eigene Antwort bauen
:::

## Viele Farben, viele Wege

Mit **wenn … sonst** hat der mBot2 zwei Wege. Bei einer Ampel gibt es aber drei Farben: rot, gelb und grün. Dafür gibt es den Block **wähle je nach**. Er schaut einmal auf den Boden und nimmt dann das passende Maul: **falls rot**, **falls gelb**, **falls grün**. Passt keine Farbe, nimmt er **sonst**.

::: bloecke
    switch (mbot.getColor()) {
        case "rot":
            mbot.setLed(255, 0, 0);
            break;
        case "gelb":
            mbot.setLed(255, 255, 0);
            break;
        case "grün":
            mbot.setLed(0, 255, 0);
            mbot.forward(30);
            break;
        default:
            mbot.ledOff();
    }
> Rot: rotes Licht. Gelb: gelbes Licht. Grün: grünes Licht und losfahren. Sonst: Licht aus.
:::

::: übung vbb-ampel-farben
titel: Die Farb-Ampel
auftrag: Die Ampel ist schon vorbereitet. Leg in jedes Maul die passenden Blöcke wie im Bild. Es wird mit Rot, Gelb, Grün und Blau geprüft.
start: vbb-ampel-farben-start.visustruct
messwerte: getColor=rot -> none, ledOn
messwerte: getColor=gelb -> none, ledOn
messwerte: getColor=grün -> forward 30, ledOn
messwerte: getColor=blau -> none, ledOff
braucht: fallauswahl
tipp: Unter **falls rot** liegt **LEDs an** mit 255, 0, 0. Unter **falls gelb** mit 255, 255, 0.
tipp: Unter **falls grün** liegen **LEDs an** mit 0, 255, 0 und **fahre vor** mit 30. Unter **sonst** liegt **LEDs aus**.
lösung: vbb-ampel-farben-loesung.visustruct
:::

## Farben-Tanz

Jetzt du: Jede Farbe bekommt eine eigene Bewegung.

::: übung vbb-farben-tanz
titel: Farben-Tanz
auftrag: Auf Rot dreht sich der mBot2 nach rechts, auf Grün nach links, auf Gelb fährt er 30 cm zurück. Bei jeder anderen Farbe fährt er 30 cm vor.
start: vbb-ampel-farben-start.visustruct
messwerte: getColor=rot -> turnRight 90
messwerte: getColor=grün -> turnLeft 90
messwerte: getColor=gelb -> backward 30
messwerte: getColor=blau -> forward 30
braucht: fallauswahl
tipp: Leg in jedes Maul genau einen Block. Achte auf die Farbe hinter **falls**.
tipp: **falls rot**: **drehe rechts**, **falls gelb**: **fahre zurück** 30, **falls grün**: **drehe links**, **sonst**: **fahre vor** 30.
lösung: vbb-farben-tanz-loesung.visustruct
:::

## Spiel: Was passiert?

::: spiel frage
titel: Spiel: Was passiert?
intro: Der mBot2 steht auf einem **gelben** Feld. Was macht er?

runde:
    switch (mbot.getColor()) {
        case "rot":
            mbot.turnRight();
            break;
        case "gelb":
            mbot.turnLeft();
            break;
        default:
            mbot.forward(30);
    }
frage: Was macht der mBot2?
- er dreht sich nach rechts
- [x] er dreht sich nach links
- er fährt vor
> Der Boden ist gelb: **falls gelb**, also links drehen.

runde:
    switch (mbot.getColor()) {
        case "rot":
            mbot.playTone(300, 300);
            break;
        case "grün":
            mbot.playTone(800, 300);
            break;
        default:
            mbot.ledOff();
    }
frage: Was macht der mBot2?
- er piept tief
- er piept hoch
- [x] er macht das Licht aus
> Für Gelb gibt es kein eigenes Maul. Dann gilt **sonst**.
:::

## Das hab ich geschafft

Wie gut klappt es schon? ☂️ noch nicht, ⛅ ein bisschen, ☀️ klappt prima. Bei ☂️ und ⛅ bringt dich **Nachlesen** zum passenden Schritt.

::: checkliste
- Ich kann mit „wähle je nach“ mehrere Fälle unterscheiden. → Viele Farben, viele Wege
- Ich kann für jede Farbe eine eigene Antwort bauen. → Farben-Tanz
:::
