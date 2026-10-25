---
titel: Der Bildschirm
bereich: VisuBot
kurz: Text, Zahlen und Messwerte auf dem CyberPi anzeigen.
---

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

::: quiz
? Was zeigt `mbot.showText("Abstand: " + 25)`?
- [x] Abstand: 25
- [ ] "Abstand: " + 25
- [ ] 25
> Das `+` hängt die Zahl an den Text.
? Was passiert mit dem alten Text, wenn du einen neuen anzeigst?
- [x] Er wird ersetzt.
- [ ] Der neue kommt darunter.
:::

::: checkliste
- Ich kann Text auf dem Bildschirm anzeigen. → Text anzeigen
- Ich kann mehrere Texte nacheinander zeigen. → Begrüßung im Struktogramm
- Ich kann Zahlen und Messwerte anzeigen. → Zahlen und Messwerte
- Ich kann einen Countdown in Java schreiben. → Jetzt in Java: Countdown
:::
