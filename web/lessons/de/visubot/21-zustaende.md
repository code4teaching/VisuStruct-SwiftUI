---
titel: Zustände: Was mache ich gerade?
bereich: Motoren und Methoden
kurz: Mit einer Zustandsvariablen und einer Fallauswahl eine Robo-Ampel weiterschalten.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, was ein Zustand ist
- mit einer Fallauswahl je nach Zustand handeln und in den nächsten Zustand wechseln
- Zustände in Java mit Namen und `.equals` unterscheiden
:::

## Was ist ein Zustand?

Eine Ampel ist immer in genau einem **Zustand**: rot, grün oder gelb. In jedem Zustand weiß sie zwei Dinge: Was zeige ich? Und was kommt danach?

Unsere Robo-Ampel hat drei Zustände. Jeder bekommt eine Nummer:

| Zustand | LEDs | danach |
|---|---|---|
| 0 | rot | 1 |
| 1 | grün | 2 |
| 2 | gelb | 0 |

Den aktuellen Zustand speicherst du in einer Variablen: `int zustand = 0`. So eine Variable heißt **Zustandsvariable**. Ein Programm, das so von Zustand zu Zustand springt, heißt **Zustandsautomat**.

> Eine echte Ampel in Deutschland hat vier Zustände: rot, rot-gelb, grün, gelb. Unsere Robo-Ampel lässt rot-gelb weg.

::: angeberwissen
Auch ein Saugroboter ist ein Zustandsautomat: saugen, ausweichen, zur Ladestation fahren. Ich habe nur zwei Zustände: fressen und schlafen.
:::

## Die Robo-Ampel im Struktogramm

Die Fallauswahl passt perfekt: Für jeden Zustand gibt es einen Fall. In jedem Fall stehen zwei Kästen: Was tue ich? Und welcher Zustand kommt als Nächstes?

::: übung vb-ampel-zustand
titel: Robo-Ampel
auftrag: Baue ein Struktogramm: Lege `int zustand = 0` an. Eine For-Schleife läuft sechsmal. In ihr steht eine Fallauswahl über `zustand`. Fall 0: LEDs rot, `zustand = 1`. Fall 1: LEDs grün, `zustand = 2`. Sonst: LEDs gelb, `zustand = 0`. Nach der Fallauswahl wartet der mBot2 eine Sekunde.
befehle: 2 x (setLed 255 0 0, pause 1000, setLed 0 255 0, pause 1000, setLed 255 200 0, pause 1000)
braucht: forSchleife, fallauswahl
tipp: Die Fallauswahl findest du bei den Elementen. Schreib `zustand` hinein. Die Fälle heißen 0, 1 und sonst (default).
tipp: Die Farben sind `mbot.setLed(255, 0, 0)` für rot, `mbot.setLed(0, 255, 0)` für grün und `mbot.setLed(255, 200, 0)` für gelb. Unter der Fallauswahl, noch in der Schleife, steht `mbot.pause(1000)`.
lösung: vb-ampel-zustand-loesung.visustruct
:::

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektion [„Fallauswahl“](?visustruct&lektion=10-fallauswahl). Sie öffnet sich in einem neuen Fenster.

## Jetzt in Java: Zustände mit Namen

Nummern sind schnell vergessen. Was war noch mal Zustand 2? Lesbarer sind Namen. Dann ist der Zustand ein Text:

```java
String zustand = "rot";
...
if (zustand.equals("rot")) {
    mbot.setLed(255, 0, 0);
    zustand = "grün";
} else if (zustand.equals("grün")) {
    ...
```

Texte vergleichst du in Java mit `.equals("…")`, nicht mit `==`.

::: übung vb-java-ampel-text
titel: Ampel mit Namen
code: java
auftrag: Schreibe die Robo-Ampel in Java mit `String zustand = "rot";`. Prüfe mit `if` und `else if`, in welchem Zustand die Ampel ist: rot, dann grün, dann gelb, dann wieder rot. Die Schleife läuft sechsmal, nach jedem Durchgang 1 Sekunde Pause.
befehle: 2 x (setLed 255 0 0, pause 1000, setLed 0 255 0, pause 1000, setLed 255 200 0, pause 1000)
braucht: forSchleife, verzweigung
tipp: In der Schleife: `if (zustand.equals("rot")) { … } else if (zustand.equals("grün")) { … } else { … }` und danach `mbot.pause(1000);`.
tipp: Im Fall rot stehen `mbot.setLed(255, 0, 0);` und `zustand = "grün";`. Grün schaltet auf `"gelb"`, gelb wieder auf `"rot"`.
lösung: vb-java-ampel-text-loesung.visustruct
:::

::: übung vb-fehler-21-zustaende
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Ampel mit Namen“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-21-zustaende-start.visustruct
befehle: 2 x (setLed 255 0 0, pause 1000, setLed 0 255 0, pause 1000, setLed 255 200 0, pause 1000)
tipp: Ein Text gehört in Anführungszeichen. Ohne sie sucht Java eine Variable mit diesem Namen.
tipp: Richtig heißt es `zustand = "grün"`.
lösung: vb-java-ampel-text-loesung.visustruct
:::

## Zustände beim Fahren

Mit Zuständen kann der mBot2 auch fahren. Im Zustand **fahren** fährt er vor. Sieht er eine Wand, wechselt er in den Zustand **drehen**. Dort dreht er sich einmal und wechselt zurück zu **fahren**.

::: diagramm vb-l21z-ausweichen.visustruct
Fahren und Ausweichen mit zwei Zuständen. Öffne das Diagramm im Editor und probiere es in einer Welt aus.
:::

## Spiel: Welcher Zustand kommt jetzt?

::: spiel frage
titel: Spiel: Welcher Zustand kommt jetzt?
intro: Die Robo-Ampel schaltet: 0 rot → 1 grün → 2 gelb → 0 rot. Welcher Zustand kommt als Nächstes? Fünf Runden.
frage: Welcher Zustand kommt danach?
antworten: 0 | 1 | 2

runde:
frage: Die Ampel ist gerade in Zustand **0** (rot).
richtig: 1
> Nach rot kommt grün.

runde:
frage: Die Ampel ist gerade in Zustand **2** (gelb).
richtig: 0
> Nach gelb geht es wieder von vorn los.

runde:
frage: Die Ampel ist gerade in Zustand **1** (grün).
richtig: 2
> Nach grün kommt gelb.

runde:
frage: Die Ampel startet in Zustand 0 und schaltet **zweimal** weiter.
richtig: 2
> 0 → 1 → 2.

runde:
frage: Die Ampel startet in Zustand 0 und schaltet **dreimal** weiter.
richtig: 0
> 0 → 1 → 2 → 0. Nach drei Schritten ist sie wieder am Anfang.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann erklären, was ein Zustand ist. → Was ist ein Zustand?
- Ich kann mit einer Fallauswahl je nach Zustand handeln und in den nächsten Zustand wechseln. → Die Robo-Ampel im Struktogramm
- Ich kann Zustände in Java mit Namen und `.equals` unterscheiden. → Jetzt in Java: Zustände mit Namen
:::

## Wissenstest

::: quiz
? Was speichert eine Zustandsvariable?
→ Was ist ein Zustand?
- [ ] Wie oft die Schleife gelaufen ist
- [x] Was das Programm gerade macht, zum Beispiel rot oder grün
- [ ] Den größten Messwert
? Was steht in jedem Fall der Fallauswahl?
→ Die Robo-Ampel im Struktogramm
- [x] Was zu tun ist und welcher Zustand als Nächstes kommt
- [ ] Nur eine Pause
- [ ] Eine neue Schleife
? Wie prüfst du in Java, ob `zustand` den Text `"rot"` enthält?
→ Jetzt in Java: Zustände mit Namen
- [ ] `zustand == rot`
- [x] `zustand.equals("rot")`
- [ ] `zustand = "rot"`
> Texte vergleichst du mit `.equals`. Ein einzelnes `=` würde `"rot"` zuweisen.
:::
