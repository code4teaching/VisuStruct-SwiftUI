---
titel: Der Ultraschallsensor
bereich: VisuBot
kurz: Abstand messen, Abstand halten und das Ganze in Java.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, was `mbot.getDistance()` misst
- zwei Verzweigungen ineinander bauen
- eine While-Schleife mit dem Abstand in Java schreiben
:::

## Wie misst der mBot2 den Abstand?

::: mbot2
fokus: ultrasonic
ansicht: vorn
:::

Der [Ultraschallsensor]{teil=ultrasonic} schickt einen sehr hohen Ton los und wartet auf das Echo. Je länger das Echo braucht, desto weiter ist die Wand weg. `mbot.getDistance()` liefert den Abstand in **Zentimetern**, von etwa 3 bis 300.

| Sensor | Text | Wert |
|---|---|---|
| Abstand | `mbot.getDistance()` | ganze Zahl in cm, z. B. `38` |

> In der [Simulation](#zeige-simulation) steht unter der Welt immer der aktuelle Abstand. Mit einem echten mBot2 kannst du die Hand vor den Sensor halten und zusehen, wie sich die Zahl ändert.

## Abstand halten im Struktogramm

Der mBot2 soll wie ein Hund an der Leine sein: Ist deine Hand zu nah (unter 10 cm), weicht er zurück. Ist sie zu weit weg (über 20 cm), kommt er näher. Dazwischen bleibt er stehen.

Dafür brauchst du zwei Verzweigungen ineinander. Die äußere prüft „zu nah?“, die innere im Nein-Zweig prüft „zu weit?“.

::: übung vb-abstand-halten
titel: Abstand halten
auftrag: Baue ein Struktogramm: Ist der Abstand kleiner als 10, fährt der mBot2 zurück. Sonst: Ist der Abstand größer als 20, fährt er vor. Sonst tut er nichts.
messwerte: getDistance=5 -> backward
messwerte: getDistance=35 -> forward
messwerte: getDistance=15 -> none
braucht: verzweigung
tipp: Zieh eine Verzweigung ins Struktogramm und den Sensor **Abstand** darauf. Schreib `< 10` dahinter. Im Ja-Zweig steht **fahre zurück**.
tipp: In den Nein-Zweig kommt eine zweite Verzweigung mit `mbot.getDistance() > 20` und **fahre vor** im Ja-Zweig. Ihr Nein-Zweig bleibt leer.
lösung: vb-abstand-halten-loesung.visustruct
:::

> Beim Prüfen setzt VisuStruct den Abstand nacheinander auf 5, 35 und 15 cm und schaut, was dein mBot2 tut.

## Jetzt in Java

Im Bereich [Code](#zeige-codelive) siehst du dein Struktogramm schon als Java-Code. Eine Verzweigung heißt dort `if`, der Nein-Zweig `else`:

```java
if (mbot.getDistance() < 10) {
    mbot.backward();
} else {
    ...
}
```

Den Sensor tippst du wie einen Befehl: `mbot.` und dann `getDistance()`. Nach dem Punkt schlägt dir der Editor alle Befehle und Sensoren vor.

::: übung vb-java-wand-piep
titel: Bis zur Wand und piepen
code: java
auftrag: Schreibe in Java: Der mBot2 fährt vor, solange die Wand mehr als 15 cm entfernt ist. Danach spielt er einen Ton. Es gibt drei Welten.
welt: wand-kurz -> tone
welt: wand-mittel -> tone
welt: wand-lang -> tone
braucht: whileSchleife
tipp: Eine While-Schleife heißt in Java `while (Bedingung) { … }`. Die Bedingung ist `mbot.getDistance() > 15`.
tipp: In der Schleife steht `mbot.forward();`, nach der Schleife `mbot.playTone(440, 300);`.
lösung: vb-java-wand-piep-loesung.visustruct
:::

::: quiz
? `mbot.getDistance()` liefert `8`. Was tut das Programm aus „Abstand halten“?
→ Abstand halten im Struktogramm
- [x] Es fährt zurück.
- [ ] Es fährt vor.
- [ ] Es bleibt stehen.
> 8 ist kleiner als 10, also ist schon die erste Bedingung wahr.
? Wie heißt der Nein-Zweig einer Verzweigung in Java?
→ Jetzt in Java
- [ ] `then`
- [x] `else`
- [ ] `otherwise`
> `if` ist der Anfang, `else` der Nein-Zweig.
:::

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann erklären, was `mbot.getDistance()` misst. → Wie misst der mBot2 den Abstand?
- Ich kann zwei Verzweigungen ineinander bauen. → Abstand halten im Struktogramm
- Ich kann eine While-Schleife mit dem Abstand in Java schreiben. → Jetzt in Java
:::
