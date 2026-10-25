---
titel: mBot2 in der For-Schleife
---

## Das Quadrat mit Schleife

Erinnerst du dich an das Quadrat aus Lektion 5? Achtmal Kästen, dabei wiederholt sich immer dasselbe Paar: **fahre vor** und **drehe rechts**. Genau dafür ist die For-Schleife da.

::: übung vb-k-quadrat-schleife
titel: Quadrat mit Schleife
auftrag: Lass den mBot2 wieder ein Quadrat mit 50 cm Seitenlänge fahren. Diesmal stehen nur zwei mBot2-Kästen im Struktogramm, in einer For-Schleife.
fahrt: 4 x (forward 50, turnRight)
braucht: forSchleife
tipp: Die Schleife läuft viermal, einmal für jede Seite.
tipp: Start `int seite = 0`, Bedingung `seite < 4`, Schritt `seite++`. Im Inhalt stehen `mbot.forward(50)` und `mbot.turnRight()`.
lösung: vb-k-quadrat-schleife-loesung.visustruct
:::

## Ein Sechseck

In die Klammer von **drehe rechts** kannst du schreiben, wie weit er sich drehen soll: `mbot.turnRight(45)` dreht nur 45°. Bei jedem Vieleck dreht sich der mBot2 insgesamt einmal ganz herum, also um 360°.

::: übung vb-k-sechseck
titel: Das Sechseck
auftrag: Lass den mBot2 ein Sechseck mit 30 cm langen Seiten fahren. Benutze eine For-Schleife.
fahrt: 6 x (forward 30, turnRight 60)
braucht: forSchleife
tipp: Sechs Ecken teilen sich die 360° einer ganzen Runde. Wie viel ist das pro Ecke?
tipp: Die Schleife läuft sechsmal. Im Inhalt: `mbot.forward(30)` und `mbot.turnRight(60)`.
lösung: vb-k-sechseck-loesung.visustruct
:::

Unter **Aufgaben** warten noch mehr Figuren auf den mBot2: Treppe, Dreieck, Spirale und Slalom.
