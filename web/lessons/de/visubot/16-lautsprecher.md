---
titel: Der Lautsprecher
bereich: Licht, Ton und Bildschirm
kurz: Töne, eine Tonleiter und eine Sirene.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, was die beiden Zahlen bei `playTone` bedeuten
- eine Tonfolge bauen
- in Java mit der Zählvariable rechnen
- den mBot2 ein Gefühl zeigen lassen
:::

## Wie hoch, wie lang?

::: mbot2
fokus: cyberpi
ansicht: oben
:::

Im [CyberPi]{teil=cyberpi} steckt ein kleiner Lautsprecher. `mbot.playTone(440, 300)` spielt einen Ton:

- Die erste Zahl ist die **Tonhöhe** in Hertz (Schwingungen pro Sekunde). Je größer, desto höher.
- Die zweite Zahl ist die **Länge** in Millisekunden.

| Ton | c | d | e | f | g | a | h | c' |
|---|---|---|---|---|---|---|---|---|
| Hertz | 262 | 294 | 330 | 349 | 392 | 440 | 494 | 523 |

> In der Simulation hörst du die Töne über die Lautsprecher deines Computers. Dreh ruhig etwas leiser.

## Tonleiter im Struktogramm

::: übung vb-tonleiter
titel: Tonleiter
auftrag: Der mBot2 spielt die Töne c, d, e, f, g nacheinander, jeden 300 Millisekunden lang. Die Hertz-Zahlen stehen in der Tabelle.
befehle: playTone 262 300, playTone 294 300, playTone 330 300, playTone 349 300, playTone 392 300
tipp: Zieh fünfmal **Ton spielen** ins Struktogramm.
tipp: Die Kästen heißen `mbot.playTone(262, 300)`, `mbot.playTone(294, 300)` und so weiter.
lösung: vb-tonleiter-loesung.visustruct
:::

::: angeberwissen
Der Ton a mit 440 Hertz heißt **Kammerton**. Nach ihm stimmen Orchester ihre Instrumente. Eine Oktave höher hat genau doppelt so viele Schwingungen: 880 Hertz.
:::

## Jetzt in Java: immer höher

In einer For-Schleife kannst du mit der Zählvariable rechnen. So wird jeder Ton höher als der letzte:

```java
mbot.playTone(i * 200, 200);
```

::: übung vb-java-hoeher
titel: Immer höher
code: java
auftrag: Schreibe in Java eine For-Schleife, in der `i` von 1 bis 5 zählt. In jedem Durchgang spielt der mBot2 einen Ton mit `i * 200` Hertz, 200 Millisekunden lang.
befehle: playTone 200 200, playTone 400 200, playTone 600 200, playTone 800 200, playTone 1000 200
braucht: forSchleife
tipp: `for (int i = 1; i <= 5; i++) { … }`
tipp: In der Schleife steht nur `mbot.playTone(i * 200, 200);`.
lösung: vb-java-hoeher-loesung.visustruct
:::

## Gefühle zeigen

Der mBot2 kann auch fröhlich, traurig oder müde sein. Mit **Gefühl zeigen** (`mbot.emotion("smile")`) spielt er eine kleine Vorführung: Die LEDs leuchten, er macht ein Geräusch und wackelt ein bisschen.

| Text | Gefühl |
|---|---|
| `mbot.emotion("smile")` | lacht |
| `mbot.emotion("hello")` | grüßt |
| `mbot.emotion("sad")` | ist traurig |
| `mbot.emotion("angry")` | ist wütend |
| `mbot.emotion("dizzy")` | ist schwindelig |
| `mbot.emotion("zzz")` | schläft |

> Probier es mit dem echten mBot2 aus. Im Simulator siehst du davon nichts, er zeigt nur den Befehl an. Weitere Gefühle stehen unter **Nachschlagen**.

::: übung vb-fehler-16-lautsprecher
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Immer höher“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-16-lautsprecher-start.visustruct
befehle: playTone 200 200, playTone 400 200, playTone 600 200, playTone 800 200, playTone 1000 200
tipp: Zähle die Zahlen in der Klammer. Wie viele braucht der Befehl? Das steht unter **Nachschlagen**.
tipp: Richtig heißt es `mbot.playTone(i * 200, 200)`.
lösung: vb-java-hoeher-loesung.visustruct
:::

## Spiel: Von tief nach hoch

::: spiel reihenfolge
titel: Spiel: Von tief nach hoch
intro: Tippe die Antworten in der richtigen Reihenfolge an. Ein falscher Tipp beendet die Runde. Fünf Runden.

runde:
frage: Tippe die Töne von tief nach hoch an.
- `mbot.playTone(262, 300)`
- `mbot.playTone(330, 300)`
- `mbot.playTone(440, 300)`
- `mbot.playTone(880, 300)`
> Je mehr Hertz, desto höher der Ton.

runde:
frage: Tippe die Töne von kurz nach lang an.
- `mbot.playTone(440, 100)`
- `mbot.playTone(440, 300)`
- `mbot.playTone(440, 1000)`
- `mbot.playTone(440, 2000)`
> Die zweite Zahl ist die Länge in Millisekunden.

runde:
    for (int i = 3; i >= 1; i--) {
        mbot.playTone(i * 200, 200);
    }
frage: Tippe die Töne in der Reihenfolge an, in der sie klingen.
- 600 Hertz
- 400 Hertz
- 200 Hertz
> `i` zählt rückwärts: 3, 2, 1. Die Töne werden immer tiefer.

runde:
frage: Tippe die Töne von tief nach hoch an.
- c mit 262 Hertz
- der Kammerton a
- a eine Oktave höher
> Der Kammerton a hat 440 Hertz, eine Oktave höher sind es doppelt so viele: 880 Hertz.

runde:
frage: Tippe die Zeiten von kurz nach lang an.
- 300 Millisekunden
- 1 Sekunde
- 1500 Millisekunden
- 2 Sekunden
> 1 Sekunde sind 1000 Millisekunden, 2 Sekunden sind 2000.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann erklären, was die beiden Zahlen bei `playTone` bedeuten. → Wie hoch, wie lang?
- Ich kann eine Tonfolge bauen. → Tonleiter im Struktogramm
- Ich kann in Java mit der Zählvariable rechnen. → Jetzt in Java: immer höher
- Ich kann den mBot2 ein Gefühl zeigen lassen. → Gefühle zeigen
:::

## Wissenstest

::: quiz
? Welcher Ton ist höher?
→ Wie hoch, wie lang?
- [x] `mbot.playTone(880, 300)`
- [ ] `mbot.playTone(440, 300)`
> Mehr Hertz heißt höher.
? Wie lange klingt `mbot.playTone(440, 1000)`?
→ Wie hoch, wie lang?
- [ ] 440 Sekunden
- [x] 1 Sekunde
- [ ] 1000 Sekunden
> 1000 Millisekunden sind eine Sekunde.
:::
