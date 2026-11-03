---
titel: Sensoren abfragen
bereich: Sensoren und Entscheidungen
kurz: Der mBot2 misst etwas, und dein Programm entscheidet.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- den Unterschied zwischen Befehl und Sensor erklären
- einen Sensor in eine Bedingung einbauen
:::

## Befehle und Sensoren

Bisher hast du dem mBot2 nur **Befehle** gegeben: fahre vor, drehe rechts. Er hat sie ausgeführt, ohne auf seine Umgebung zu achten.

Jetzt kommen die **Sensoren** dazu. Unter den [Elementen](#zeige-elemente) gibt es dafür die Gruppe **mBot2-Sensoren**:

| Sensor | Text | Was du bekommst |
|---|---|---|
| Abstand | `mbot.getDistance()` | Abstand bis zur nächsten Wand in cm, z. B. `38` |
| Linie | `mbot.getLine()` | `0`, wenn unter dem Liniensensor alles hell ist, sonst eine Zahl größer als 0 |

Der mBot2 hat noch mehr Sensoren: Farben, Tasten und Joystick, Licht, Lautstärke und Neigung. Jeden lernst du in den Lektionen 6 bis 13 einzeln kennen, die Motoren in Lektion 20 und Stoppuhr und Akku in Lektion 21.

Ein Sensor ist **kein eigener Kasten**. Er liefert eine Zahl, und mit der baust du eine **Bedingung**:

```java
mbot.getDistance() < 20
```

Das heißt: „Ist die Wand näher als 20 cm?“ Die Antwort ist wahr oder falsch.

> So baust du es: Zieh zuerst eine **Verzweigung** ins Struktogramm. Dann ziehst du den Sensor **Abstand** auf die Verzweigung. In der Bedingung steht jetzt `mbot.getDistance()`. Den Vergleich `< 20` schreibst du selbst dazu.

## Wand vorn?

Der mBot2 soll selbst entscheiden: Ist vorn eine Wand, dreht er sich nach rechts. Ist frei, fährt er ein Stück vor.

Diese Übung hat **zwei Welten**: In der einen steht die Wand direkt vor ihm, in der anderen ist viel Platz. Dein Programm muss in beiden das Richtige tun.

::: übung vb-wand-vorn
titel: Wand vorn?
auftrag: Baue eine Verzweigung mit der Bedingung `mbot.getDistance() < 20`. Bei **true** dreht sich der mBot2 nach rechts, bei **false** fährt er vor.
welt: wand-nah -> turnRight
welt: wand-frei -> forward
braucht: verzweigung
tipp: Zieh eine Verzweigung ins Struktogramm und dann den Sensor **Abstand** auf die Verzweigung. Schreib dahinter `< 20`.
tipp: Im true-Zweig steht `mbot.turnRight()`, im false-Zweig `mbot.forward()`.
lösung: vb-wand-vorn-loesung.visustruct
:::

## Was liefert der Sensor?

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektion [„Verzweigung“](?visustruct&lektion=08-verzweigung). Sie öffnet sich in einem neuen Fenster.

::: übung vb-fehler-04-sensoren
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Wand vorn?“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-04-sensoren-start.visustruct
welt: wand-nah -> turnRight
welt: wand-frei -> forward
tipp: Lies die Fehlermeldung genau. In welchem Kasten bleibt die Simulation stehen? Java unterscheidet Groß- und Kleinschreibung.
tipp: Richtig heißt es `mbot.turnRight()`.
lösung: vb-wand-vorn-loesung.visustruct
:::

## Spiel: Befehl oder Sensor?

::: spiel frage
titel: Spiel: Befehl oder Sensor?
intro: Tut die Zeile etwas, oder liefert sie einen Wert? Acht Runden.
antworten: Befehl | Sensor

runde:
    mbot.forward(30)
frage: Befehl oder Sensor?
richtig: Befehl
> Er fährt 30 cm. Das ist etwas tun.

runde:
    mbot.getDistance()
frage: Befehl oder Sensor?
richtig: Sensor
> Er liefert den Abstand in cm, zum Beispiel 38.

runde:
    mbot.turnRight()
frage: Befehl oder Sensor?
richtig: Befehl
> Drehen ist etwas tun.

runde:
    mbot.getLine()
frage: Befehl oder Sensor?
richtig: Sensor
> Er liefert 0 oder eine Zahl größer als 0.

runde:
    mbot.playTone(440, 300)
frage: Befehl oder Sensor?
richtig: Befehl
> Ein Ton ist eine Ausgabe.

runde:
    mbot.isButtonA()
frage: Befehl oder Sensor?
richtig: Sensor
> Er liefert wahr oder falsch: Wird Taste A gedrückt?

runde:
    mbot.showText("Hallo")
frage: Befehl oder Sensor?
richtig: Befehl
> Etwas anzeigen ist etwas tun.

runde:
    mbot.getBrightness()
frage: Befehl oder Sensor?
richtig: Sensor
> Er misst, wie hell es ist, von 0 bis 100.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann den Unterschied zwischen Befehl und Sensor erklären. → Befehle und Sensoren
- Ich kann einen Sensor in eine Bedingung einbauen. → Wand vorn?
:::

## Wissenstest

::: quiz
? Die Wand ist 12 cm entfernt. Ist `mbot.getDistance() < 20` wahr oder falsch?
→ Wand vorn?
- [x] wahr
- [ ] falsch
> 12 ist kleiner als 20, also ist die Bedingung wahr.
? Der mBot2 steht auf hellem Boden. Was liefert `mbot.getLine()`?
→ Befehle und Sensoren
- [x] 0
- [ ] 15
- [ ] den Abstand in cm
> 0 heißt: Keiner der vier Fühler sieht etwas Dunkles.
? Warum ist der Sensor kein eigener Kasten im Struktogramm?
→ Wand vorn?
- [x] Er tut nichts, er liefert nur einen Wert. Den braucht man in einer Bedingung.
- [ ] Weil der mBot2 sonst zu langsam wird.
- [ ] Weil Sensoren nur in Java gehen.
> Befehle sind Anweisungen. Sensoren sind Werte, so wie eine Variable.
:::
