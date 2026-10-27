---
titel: Sensoren abfragen
bereich: VisuBot
kurz: Der mBot2 misst etwas, und dein Programm entscheidet.
---

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
auftrag: Baue eine Verzweigung mit der Bedingung `mbot.getDistance() < 20`. Bei **wahr** dreht sich der mBot2 nach rechts, bei **falsch** fährt er vor.
welt: wand-nah -> turnRight
welt: wand-frei -> forward
braucht: verzweigung
tipp: Zieh eine Verzweigung ins Struktogramm und dann den Sensor **Abstand** auf die Verzweigung. Schreib dahinter `< 20`.
tipp: Im Ja-Zweig steht `mbot.turnRight()`, im Nein-Zweig `mbot.forward()`.
lösung: vb-wand-vorn-loesung.visustruct
:::

## Was liefert der Sensor?

::: quiz
? Die Wand ist 12 cm entfernt. Ist `mbot.getDistance() < 20` wahr oder falsch?
- [x] wahr
- [ ] falsch
> 12 ist kleiner als 20, also ist die Bedingung wahr.
? Der mBot2 steht auf hellem Boden. Was liefert `mbot.getLine()`?
- [x] 0
- [ ] 15
- [ ] den Abstand in cm
> 0 heißt: Keiner der vier Fühler sieht etwas Dunkles.
? Warum ist der Sensor kein eigener Kasten im Struktogramm?
- [x] Er tut nichts, er liefert nur einen Wert. Den braucht man in einer Bedingung.
- [ ] Weil der mBot2 sonst zu langsam wird.
- [ ] Weil Sensoren nur in Java gehen.
> Befehle sind Anweisungen. Sensoren sind Werte, so wie eine Variable.
:::

::: checkliste
- Ich kenne den Unterschied zwischen Befehl und Sensor. → Befehle und Sensoren
- Ich kann einen Sensor in eine Bedingung einbauen. → Wand vorn?
:::
