---
titel: mBot2 in der Sequenz
---

## Der mBot2 fährt mit

::: mbot2
fokus:
drehen: ja
:::

Das ist der **mBot2**, ein kleiner Roboter. Unter den Elementen findest du jetzt die Gruppe **🤖 mBot2-Befehle**: fahre vor, fahre zurück, drehe rechts, drehe links und mehr. Das sind ganz normale Anweisungen, sie stehen untereinander wie jede Sequenz.

In die Klammer schreibst du, wie weit er fahren soll: `mbot.forward(50)` fährt 50 cm. `mbot.turnRight()` dreht ihn um 90° nach rechts.

> Du brauchst keinen echten Roboter. Starte die [Simulation](#zeige-simulation): Dann fährt der mBot2 in einer 3D-Welt.

::: übung vb-k-quadrat
titel: Ein Quadrat fahren
auftrag: Lass den mBot2 ein Quadrat mit 50 cm Seitenlänge fahren: 50 cm vor, nach rechts drehen. Und das viermal.
fahrt: 4 x (forward 50, turnRight)
tipp: Eine Seite besteht aus zwei Kästen: **fahre vor** mit `50` in der Klammer und danach **drehe rechts**.
tipp: Insgesamt sind es acht Kästen untereinander: `mbot.forward(50)`, `mbot.turnRight()`, `mbot.forward(50)`, `mbot.turnRight()` …
lösung: vb-k-quadrat-loesung.visustruct
:::

## Um die Ecken zum Ziel

In dieser Welt stehen zwei Wände im Weg. Das Ziel ist das schwarze Feld mit der grünen Fahne. Ein Feld ist 30 cm groß.

Hier merkst du, warum die Reihenfolge zählt: Vertauschst du zwei Kästen, fährt der mBot2 gegen eine Wand.

::: übung vb-k-ecke
titel: Um die Ecken
auftrag: Bring den mBot2 mit einer Sequenz ins Ziel, ohne anzustoßen. Er schaut am Anfang nach oben.
welt: ecke
tipp: Fahre zuerst zwei Felder (60 cm) nach oben. Dann ist links und rechts frei.
tipp: Nach rechts bis zur Lücke sind es drei Felder (90 cm). Danach zwei Felder nach oben und drei nach links.
lösung: vb-k-ecke-loesung.visustruct
:::
