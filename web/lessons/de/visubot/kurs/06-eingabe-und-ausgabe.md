---
titel: mBot2 bei Eingabe und Ausgabe
---

## Sensoren sind Eingaben

::: mbot2
fokus: ultrasonic, screen
ansicht: vorn
:::

Beim EVA-Prinzip kommt die Eingabe bisher von der Tastatur. Ein Roboter bekommt seine Eingaben von **Sensoren**. Der [Ultraschallsensor]{teil=ultrasonic} vorn misst zum Beispiel den Abstand bis zur nächsten Wand: `mbot.getDistance()` liefert ihn in Zentimetern.

Die Ausgabe landet beim mBot2 auf seinem [Bildschirm]{teil=screen}: `mbot.showText("Hallo")` zeigt einen Text. Mit `+` setzt du ihn wie bei `output:` aus Teilen zusammen.

Den Sensor **Abstand** findest du unter den Elementen in der Gruppe **mBot2-Sensoren**, **Text anzeigen** bei den **🤖 mBot2-Befehlen**.

::: übung vb-k-abstand-anzeigen
titel: Abstand anzeigen
auftrag: Speichere den Abstand in einer Variable `abstand`. Dann zeigt der mBot2 auf dem Bildschirm zum Beispiel **Abstand: 42 cm**.
messwerte: getDistance=42 -> none, screen "Abstand: 42 cm"
messwerte: getDistance=7 -> none, screen "Abstand: 7 cm"
tipp: Erste Anweisung: `int abstand = mbot.getDistance()`. Das ist die Eingabe.
tipp: Zweite Anweisung: `mbot.showText("Abstand: " + abstand + " cm")`. Das ist die Ausgabe.
lösung: vb-k-abstand-anzeigen-loesung.visustruct
:::
