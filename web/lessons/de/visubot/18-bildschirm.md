---
titel: Der Bildschirm
bereich: Licht, Ton und Bildschirm
kurz: Text, Zahlen und Messwerte auf dem CyberPi anzeigen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- Text auf dem Bildschirm anzeigen
- mehrere Texte nacheinander zeigen
- Zahlen und Messwerte anzeigen
- einen Countdown in Java schreiben
:::

## Text anzeigen

::: mbot2
fokus: screen
ansicht: hinten
:::

Der farbige [Bildschirm]{teil=screen} des CyberPi ist auch ein Aktor. Mit **Text anzeigen** schreibst du etwas darauf:

```java
mbot.showText("Hallo!")
```

Der Text steht in Anführungszeichen, wie bei `System.out.println`. Ein neuer Text ersetzt den alten.

> In der Simulation erscheint der Text auf dem Bildschirm des 3D-Modells und unter der Welt hinter 📺.

## Begrüßung im Struktogramm

::: übung vb-begruessung
titel: Begrüßung
auftrag: Der mBot2 zeigt zuerst „Hallo!“, wartet 1000 Millisekunden und zeigt dann „Ich bin VisuBot“.
befehle: showText "Hallo!", pause 1000, showText "Ich bin VisuBot"
tipp: Zieh zweimal **Text anzeigen** und einmal **kurz warten** ins Struktogramm.
tipp: `mbot.showText("Hallo!")`, `mbot.pause(1000)`, `mbot.showText("Ich bin VisuBot")`.
lösung: vb-begruessung-loesung.visustruct
:::

## Zahlen und Messwerte

Statt Text kannst du auch Zahlen und Variablen anzeigen, und mit `+` setzt du alles zusammen:

```java
mbot.showText(i)
mbot.showText("Abstand: " + mbot.getDistance())
```

So zeigt der mBot2 dir, was seine Sensoren gerade messen.

## Jetzt in Java: Countdown

::: übung vb-java-countdown
titel: Countdown
code: java
auftrag: Schreibe in Java einen Countdown: Eine For-Schleife zählt `i` von 3 rückwärts bis 1. In jedem Durchgang zeigt der mBot2 `i` an und wartet 1000 Millisekunden. Danach zeigt er „Los!“.
befehle: showText "3", pause 1000, showText "2", pause 1000, showText "1", pause 1000, showText "Los!"
braucht: forSchleife
tipp: Rückwärts zählen: `for (int i = 3; i >= 1; i--) { … }`
tipp: In der Schleife: `mbot.showText(i);` und `mbot.pause(1000);`. Nach der Schleife `mbot.showText("Los!");`.
lösung: vb-java-countdown-loesung.visustruct
:::

::: übung vb-fehler-18-bildschirm
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Countdown“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-18-bildschirm-start.visustruct
befehle: showText "3", pause 1000, showText "2", pause 1000, showText "1", pause 1000, showText "Los!"
tipp: Die Fehlermeldung nennt eine unbekannte Variable. Wie heißt die Variable dort, wo sie angelegt wird? Java unterscheidet Groß- und Kleinschreibung.
tipp: Richtig heißt es `mbot.showText(i)`.
lösung: vb-java-countdown-loesung.visustruct
:::

## Spiel: Was steht auf dem Bildschirm?

::: spiel frage
titel: Spiel: Was steht auf dem Bildschirm?
intro: Lies den Code und sag vorher, was der Bildschirm am Ende zeigt. Sechs Runden.

runde:
    mbot.showText("Hallo!");
    mbot.pause(1000);
    mbot.showText("Ich bin VisuBot");
frage: Was steht am Ende auf dem Bildschirm?
- Hallo! Ich bin VisuBot
- [x] Ich bin VisuBot
- Hallo!
> Ein neuer Text ersetzt den alten.

runde:
    mbot.showText("Abstand: " + 25);
frage: Was steht auf dem Bildschirm?
- [x] Abstand: 25
- "Abstand: " + 25
- Abstand:
> Das `+` hängt die Zahl an den Text.

runde:
    int i = 3;
    mbot.showText("i");
frage: Was steht auf dem Bildschirm?
- 3
- [x] i
- "i"
> In Anführungszeichen ist `i` ein Text, keine Variable. Die Anführungszeichen selbst erscheinen nicht.

runde:
    for (int i = 3; i >= 1; i--) {
        mbot.showText(i);
        mbot.pause(1000);
    }
    mbot.showText("Start!");
frage: Welche Zahl steht direkt vor „Start!“ da?
- 0
- [x] 1
- 3
> Der Countdown zeigt 3, 2, 1. Bei 0 ist `i >= 1` falsch.

runde:
    mbot.showText("Summe: " + 2 + 3);
frage: Was steht auf dem Bildschirm?
- Summe: 5
- [x] Summe: 23
- Summe: 2 + 3
> Java rechnet von links nach rechts: Erst kommt die 2 an den Text, dann die 3.

runde:
    mbot.showText("Summe: " + (2 + 3));
frage: Was steht auf dem Bildschirm?
- [x] Summe: 5
- Summe: 23
- Summe: (2 + 3)
> Die Klammern rechnet Java zuerst aus.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann Text auf dem Bildschirm anzeigen. → Text anzeigen
- Ich kann mehrere Texte nacheinander zeigen. → Begrüßung im Struktogramm
- Ich kann Zahlen und Messwerte anzeigen. → Zahlen und Messwerte
- Ich kann einen Countdown in Java schreiben. → Jetzt in Java: Countdown
:::

## Wissenstest

::: quiz
? Was zeigt `mbot.showText("Abstand: " + 25)`?
→ Zahlen und Messwerte
- [x] Abstand: 25
- [ ] "Abstand: " + 25
- [ ] 25
> Das `+` hängt die Zahl an den Text.
? Was passiert mit dem alten Text, wenn du einen neuen anzeigst?
→ Text anzeigen
- [x] Er wird ersetzt.
- [ ] Der neue kommt darunter.
:::
