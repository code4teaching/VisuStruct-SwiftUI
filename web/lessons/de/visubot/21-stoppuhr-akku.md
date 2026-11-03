---
titel: Stoppuhr und Akku
bereich: Motoren und Methoden
kurz: Zeit messen und den Akku im Blick behalten.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- die Stoppuhr auf 0 setzen und ablesen
- eine bestimmte Zeit lang fahren
- den Akkustand anzeigen
:::

## Die Stoppuhr

::: mbot2
fokus: cyberpi
ansicht: oben
:::

Im [CyberPi]{teil=cyberpi} läuft eine Stoppuhr. Sie zählt die Sekunden, seit das Programm läuft. Mit **Stoppuhr auf 0** (`mbot.resetTimer()`) fängt sie wieder bei 0 an.

| Sensor oder Befehl | Text | Wert |
|---|---|---|
| Stoppuhr auf 0 | `mbot.resetTimer()` | |
| Stoppuhr | `mbot.getTimer()` | Sekunden mit Nachkommastelle, z. B. `1.5` |

So fährst du eine bestimmte Zeit lang: Stoppuhr auf 0, Gas geben, warten, solange die Stoppuhr noch nicht weit genug ist, anhalten.

## Zwei Sekunden fahren im Struktogramm

::: übung vb-zwei-sekunden
titel: Zwei Sekunden
auftrag: Der mBot2 setzt die Stoppuhr auf 0 und gibt mit 50 % Gas. Solange die Stoppuhr unter 2 Sekunden ist, wartet er kurz. Danach hält er an. Mit 50 % schafft er 10 cm pro Sekunde, er muss also 20 cm weiter stehen bleiben.
welt: zeit-1
braucht: whileSchleife
tipp: Oben stehen **Stoppuhr auf 0** und `mbot.drive(50, 50)`. Darunter eine While-Schleife mit `mbot.getTimer() < 2`.
tipp: In der Schleife steht **kurz warten**, nach der Schleife **anhalten**.
lösung: vb-zwei-sekunden-loesung.visustruct
:::

## Der Akku

::: mbot2
fokus: shield
ansicht: oben
:::

Unter dem durchsichtigen [Shield]{teil=shield} siehst du den Akku. Wie voll er ist, liefert `mbot.getBattery()` in Prozent: `100` ist ganz voll. Ist er fast leer, fahren die Motoren schwächer. Dann wird es Zeit zum Laden.

::: angeberwissen
Auch dein Handy misst seinen Akku nicht direkt in Prozent. Es misst die Spannung: Ein voller Lithium-Akku hat etwas über 4 Volt, ein leerer gut 3. Daraus rechnet es die Prozente aus, genau wie der CyberPi.
:::

## Jetzt in Java: Akku-Anzeige

::: übung vb-java-akku
titel: Akku-Anzeige
code: java
auftrag: Schreibe in Java: Der mBot2 zeigt auf dem Bildschirm zum Beispiel **Akku: 80 %**. Ist der Akku unter 20 %, leuchten zusätzlich die LEDs rot.
messwerte: getBattery=80 -> none, ledOff, screen "Akku: 80 %"
messwerte: getBattery=15 -> none, ledOn, screen "Akku: 15 %"
braucht: verzweigung
tipp: `mbot.showText("Akku: " + mbot.getBattery() + " %");` setzt den Text aus drei Teilen zusammen.
tipp: Danach: `if (mbot.getBattery() < 20) { mbot.setLed(255, 0, 0); }`
lösung: vb-java-akku-loesung.visustruct
:::

::: übung vb-fehler-21-stoppuhr-akku
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Akku-Anzeige“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-21-stoppuhr-akku-start.visustruct
messwerte: getBattery=80 -> none, ledOff, screen "Akku: 80 %"
messwerte: getBattery=15 -> none, ledOn, screen "Akku: 15 %"
tipp: Zähle die Zahlen in der Klammer. Wie viele braucht der Befehl? Das steht unter **Nachschlagen**.
tipp: Richtig heißt es `mbot.setLed(255, 0, 0)`.
lösung: vb-java-akku-loesung.visustruct
:::

## Spiel: Stoppuhr und Akku

::: spiel frage
titel: Spiel: Stoppuhr und Akku
intro: Lies den Code und sag vorher, was passiert. Fünf Runden.

runde:
    mbot.resetTimer();
    mbot.drive(50, 50);
    while (mbot.getTimer() < 2) {
        mbot.pause(100);
    }
    mbot.stop();
frage: Wie lange fährt der mBot2?
- 0,1 Sekunden
- [x] 2 Sekunden
- bis zur Wand
> Er wartet, bis die Stoppuhr 2 Sekunden zeigt, dann hält er an.

runde:
    mbot.resetTimer();
    mbot.drive(50, 50);
    while (mbot.getTimer() < 2) {
        mbot.pause(100);
    }
    mbot.stop();
frage: Mit 50 % schafft er 10 cm pro Sekunde. Wie weit fährt er?
- 10 cm
- [x] 20 cm
- 50 cm
> 2 Sekunden mal 10 cm pro Sekunde sind 20 cm.

runde:
    mbot.pause(3000);
    mbot.resetTimer();
    mbot.pause(1000);
    mbot.showText(mbot.getTimer());
frage: Welche Zahl zeigt der Bildschirm ungefähr?
- 0
- [x] 1
- 4
> Die Stoppuhr fängt nach `mbot.resetTimer()` wieder bei 0 an. Danach vergeht nur noch 1 Sekunde.

runde:
    if (mbot.getBattery() < 20) {
        mbot.setLed(255, 0, 0);
    }
    mbot.showText("Akku: " + mbot.getBattery() + " %");
frage: Der Akku hat noch 15 %. Was passiert?
- Nur der Bildschirm zeigt **Akku: 15 %**.
- Nur die LEDs leuchten rot.
- [x] Der Bildschirm zeigt **Akku: 15 %**, und die LEDs leuchten rot.
> 15 ist kleiner als 20. Die Anzeige steht unter der Verzweigung und kommt immer.

runde:
    if (mbot.getBattery() < 20) {
        mbot.setLed(255, 0, 0);
    }
    mbot.showText("Akku: " + mbot.getBattery() + " %");
frage: Der Akku hat 80 %. Was passiert?
- [x] Nur der Bildschirm zeigt **Akku: 80 %**.
- Nur die LEDs leuchten rot.
- Gar nichts.
> 80 ist nicht kleiner als 20, die LEDs bleiben aus.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann die Stoppuhr auf 0 setzen und ablesen. → Die Stoppuhr
- Ich kann eine bestimmte Zeit lang fahren. → Zwei Sekunden fahren im Struktogramm
- Ich kann den Akkustand anzeigen. → Jetzt in Java: Akku-Anzeige
:::

## Wissenstest

::: quiz
? Was liefert `mbot.getTimer()` direkt nach `mbot.resetTimer()`?
→ Die Stoppuhr
- [x] 0
- [ ] 100
- [ ] Die Uhrzeit
> Die Stoppuhr fängt wieder bei 0 an.
? Warum wartet der mBot2 in der Schleife nur **kurz** und hält nicht an?
→ Zwei Sekunden fahren im Struktogramm
- [ ] Weil die Schleife sonst nicht startet.
- [x] Weil er weiterfahren soll, bis die Zeit um ist.
- [ ] Weil die Stoppuhr sonst stehen bleibt.
> Gas geben gilt weiter, auch während er wartet.
:::
