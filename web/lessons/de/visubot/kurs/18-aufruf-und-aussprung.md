---
titel: mBot2 mit Unterprogrammen
---

## Ein Unterprogramm für das Quadrat

Ein Quadrat fahren kann der mBot2 schon. Jetzt soll er zwei verschieden große Quadrate fahren. Statt die Schleife zweimal zu bauen, schreibst du ein Unterprogramm `void quadrat(int seite)`. Die Seitenlänge ist der Parameter.

::: übung vb-k-quadrat-methode
titel: Zwei Quadrate
auftrag: Baue ein Unterprogramm `void quadrat(int seite)`, das ein Quadrat mit der Seitenlänge `seite` fährt. Das Hauptprogramm ruft es zweimal auf: erst mit 30, dann mit 50.
fahrt: 4 x (forward 30, turnRight), 4 x (forward 50, turnRight)
braucht: aufruf
tipp: Lege mit **+** einen neuen Reiter an und gib ihm den Titel `void quadrat(int seite)`. Darin steht eine For-Schleife, die viermal `mbot.forward(seite)` und `mbot.turnRight()` ausführt.
tipp: Im Hauptprogramm stehen zwei Aufruf-Kästen: `quadrat(30)` und `quadrat(50)`.
lösung: vb-k-quadrat-methode-loesung.visustruct
unterprogramm: vb-k-quadrat-unterprogramm-loesung.visustruct
:::
