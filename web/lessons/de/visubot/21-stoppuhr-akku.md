---
titel: Stoppuhr und Akku
bereich: VisuBot
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

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann die Stoppuhr auf 0 setzen und ablesen. → Die Stoppuhr
- Ich kann eine bestimmte Zeit lang fahren. → Zwei Sekunden fahren im Struktogramm
- Ich kann den Akkustand anzeigen. → Jetzt in Java: Akku-Anzeige
:::
