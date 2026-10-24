---
titel: Der mBot2
bereich: VisuBot
kurz: Lerne den Roboter kennen, den du gleich programmierst.
---

## Hallo mBot2

Der **mBot2** ist ein kleiner Roboter der Firma Makeblock. Er hat zwei Räder, Sensoren, mit denen er seine Umgebung wahrnimmt, und einen kleinen Computer, der dein Programm ausführt.

In VisuBot programmierst du ihn mit Struktogrammen. Jedes Programm kannst du zuerst im Simulator ausprobieren, auch ganz ohne echten Roboter.

::: mbot2
cyberpi: **CyberPi** – das Gehirn. Ein kleiner Computer mit Bildschirm, fünf farbigen LEDs, Lautsprecher und zwei Tasten. Er führt dein Programm aus.
motors: **Motoren und Räder** – zwei Motoren treiben die Räder an. Drehen sich beide gleich schnell, fährt der mBot2 geradeaus. Drehen sie gegeneinander, dreht er sich auf der Stelle.
ultrasonic: **Ultraschallsensor** – die „Augen“ vorn. Er schickt Schall los und misst, wie lange das Echo braucht. So weiß der mBot2, wie weit die nächste Wand weg ist.
lineSensor: **Liniensensor** – vier kleine Sensoren unten an der Nase. Sie erkennen, ob darunter eine dunkle Linie liegt.
chassis: **Gehäuse** – der blaue Rahmen aus Aluminium hält alles zusammen.
:::

## Sensoren und Aktoren

Ein Roboter hat zwei Arten von Teilen:

- **Sensoren** messen etwas: den Abstand, eine Linie, die Helligkeit oder die Lautstärke.
- **Aktoren** tun etwas: Motoren bewegen, LEDs leuchten, der Lautsprecher piept.

Dein Programm liest die Sensoren und steuert die Aktoren. Das kennst du schon als Eingabe, Verarbeitung und Ausgabe.

::: quiz
? Ordne jedes Teil seiner Aufgabe zu.
= Ultraschallsensor -> misst den Abstand
= Motoren -> bewegen die Räder
= CyberPi -> führt das Programm aus
= Liniensensor -> erkennt eine dunkle Linie
? Welche Teile sind Aktoren?
- [x] Motoren
- [ ] Ultraschallsensor
- [x] LEDs
- [ ] Liniensensor
> Aktoren tun etwas, Sensoren messen etwas.
:::

::: angeberwissen
Fledermäuse machen es genau wie der Ultraschallsensor: Sie rufen so hoch, dass wir es nicht hören, und lauschen auf das Echo. Schall ist etwa 343 Meter pro Sekunde schnell. Steht eine Wand einen Meter vor dem mBot2, ist das Echo schon nach knapp 6 Tausendstel Sekunden zurück.
:::

## Befehle für den mBot2

Unter den [Elementen](#zeige-elemente) gibt es in VisuBot eine eigene Gruppe **VisuBot**. Jeder Kasten darin ist eine Anweisung an den Roboter:

| Element | Text im Kasten | Was passiert |
|---|---|---|
| fahre vor | `mbot.forward()` | 10 cm vorwärts |
| fahre zurück | `mbot.backward()` | 10 cm rückwärts |
| drehe rechts | `mbot.turnRight()` | 90° nach rechts drehen |
| drehe links | `mbot.turnLeft()` | 90° nach links drehen |
| LEDs an | `mbot.setLed(255, 0, 0)` | die LEDs leuchten rot |

In die Klammern darfst du auch eine Zahl schreiben: `mbot.forward(30)` fährt 30 cm, `mbot.turnRight(45)` dreht nur 45°.

> Die Anweisungen sind echtes Java. `mbot` ist der Roboter, hinter dem Punkt steht, was er tun soll.

## Erste Fahrt

Starte nach dem Bauen die [Simulation](#zeige-simulation). Rechts erscheint die VisuBot-Welt mit dem mBot2. Das Gitter auf dem Boden hat Kästchen von 10 cm, also genau ein **fahre vor**.

::: übung vb-gerade
titel: Geradeaus
auftrag: Ziehe fünfmal **fahre vor** in das Struktogramm. Starte dann die Simulation und schau zu, wie der mBot2 50 cm geradeaus fährt.
fahrt: 5 x (forward)
tipp: Die Gruppe VisuBot findest du unter den normalen Elementen.
tipp: Fünf Kästen `mbot.forward()` untereinander. Jeder fährt 10 cm.
lösung: vb-gerade-loesung.visustruct
:::

::: checkliste
- Ich kenne die Teile des mBot2. → Hallo mBot2
- Ich weiß, was Sensoren und Aktoren sind. → Sensoren und Aktoren
- Ich kann den mBot2 mit Elementen aus der Gruppe VisuBot steuern. → Befehle für den mBot2
- Ich kann den mBot2 im Simulator fahren lassen. → Erste Fahrt
:::
