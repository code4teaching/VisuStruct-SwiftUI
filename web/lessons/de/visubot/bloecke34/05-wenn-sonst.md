---
titel: Wenn … sonst
bereich: Der mBot2 entscheidet
kurz: Mit „wenn“ und „sonst“ entscheidet der mBot2 selbst.
---

## Das schaffst du heute

::: kompetenzen
- den mBot2 mit „wenn“ und „sonst“ entscheiden lassen
- die Taste A als Frage benutzen
:::

## Wenn die Taste gedrückt ist

Der mBot2 kann Fragen beantworten, zum Beispiel: **Ist Taste A gedrückt?** Die Antwort ist **ja** oder **nein**.

Der Block **wenn … sonst** hat zwei Mäuler. Ist die Antwort **ja**, macht der mBot2, was unter **wenn** liegt. Ist sie **nein**, macht er, was unter **sonst** liegt.

::: bloecke
    if (mbot.isButtonA()) {
        mbot.forward(30);
    } else {
        mbot.turnRight();
    }
> Taste A gedrückt: vor. Sonst: rechts drehen.
:::

::: übung vbk-taste
titel: Die Taste A
auftrag: Bau das Programm vom Bild nach. Es wird zweimal geprüft: einmal mit und einmal ohne gedrückte Taste.
messwerte: isButtonA=true -> forward 30
messwerte: isButtonA=false -> turnRight 90
braucht: verzweigung
tipp: **Verzweigung** liegt ganz oben bei **Elemente**. **Taste A gedrückt?** liegt bei den Sensoren in **🕹️ Tasten**. Zieh sie auf die Frage bei **wenn**.
tipp: Unter **wenn** liegt **fahre vor** mit 30, unter **sonst** liegt **drehe rechts**.
lösung: vbk-taste-loesung.visustruct
:::

In der Simulation kannst du die Taste A anklicken.

## Links oder rechts?

Jetzt du! Der mBot2 hat auch eine Taste B.

::: übung vbk-taste-b
titel: Taste B
auftrag: Ist Taste B gedrückt, dreht sich der mBot2 nach links. Sonst dreht er sich nach rechts.
messwerte: isButtonB=true -> turnLeft 90
messwerte: isButtonB=false -> turnRight 90
braucht: verzweigung
tipp: Nimm **Taste B gedrückt?** als Frage bei **wenn**.
tipp: Unter **wenn** liegt **drehe links**, unter **sonst** liegt **drehe rechts**.
lösung: vbk-taste-b-loesung.visustruct
:::

## Spiel: Was passiert?

::: spiel frage
titel: Spiel: Was passiert?
intro: Die Taste A ist gedrückt. Was macht der mBot2?

runde:
    if (mbot.isButtonA()) {
        mbot.setLed(0, 255, 0);
    } else {
        mbot.setLed(255, 0, 0);
    }
frage: Welche Farbe leuchtet?
- rot
- [x] grün
> Taste A ist gedrückt, also gilt der wenn-Teil: grün.

runde:
    if (mbot.isButtonB()) {
        mbot.forward(30);
    } else {
        mbot.backward(30);
    }
frage: Was macht der mBot2?
- er fährt vor
- [x] er fährt zurück
> Gefragt wird nach Taste **B**. Die ist nicht gedrückt, also gilt der sonst-Teil.

runde:
    if (mbot.isButtonA()) {
        mbot.playTone(800, 300);
    } else {
        mbot.playTone(300, 300);
    }
frage: Wie klingt der Ton?
- [x] hoch
- tief
> Taste A ist gedrückt: Der Ton 800 ist hoch.
:::

## Das hab ich geschafft

Wie gut klappt es? ☂️ noch nicht, ⛅ ein bisschen, ☀️ prima.

::: checkliste
- Ich kann mit „wenn“ und „sonst“ eine Entscheidung bauen. → Wenn die Taste gedrückt ist
- Ich kann eine Taste als Frage benutzen. → Links oder rechts?
:::
