---
titel: Die Spirale
nach: 2
stufe: 2
---

Der mBot2 soll eine eckige Spirale fahren: Die erste Seite ist 10 cm lang, die zweite 20 cm, die dritte 30 cm und so weiter. Nach jeder Seite dreht er sich nach rechts.

Die Zählvariable einer For-Schleife kannst du auch in der Schleife benutzen, zum Beispiel in der Klammer von **fahre vor**. Dort darf auch eine Rechnung stehen, etwa `mbot.forward(i * 5)`.

::: übung vb-spirale
titel: Die Spirale
auftrag: Lass den mBot2 eine Spirale mit 8 Seiten fahren: 10 cm, 20 cm, 30 cm … bis 80 cm. Nach jeder Seite dreht er sich nach rechts.
fahrt: forward 10, turnRight, forward 20, turnRight, forward 30, turnRight, forward 40, turnRight, forward 50, turnRight, forward 60, turnRight, forward 70, turnRight, forward 80, turnRight
braucht: forSchleife
tipp: Lass die Zählvariable von 1 bis 8 laufen. Wie lang ist dann die Seite in jedem Durchlauf?
tipp: In der Klammer von **fahre vor** steht eine Rechnung mit der Zählvariable.
lösung: vb-spirale-loesung.visustruct
:::
