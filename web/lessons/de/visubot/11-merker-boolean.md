---
titel: Ein Merker mit boolean
bereich: Sensoren und Entscheidungen
kurz: Mit einer Variablen vom Typ boolean festhalten, ob etwas passiert ist.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- eine Variable vom Typ `boolean` anlegen
- mit einem Merker festhalten, ob etwas passiert ist
- einen Merker nach der Schleife in einer Bedingung abfragen
:::

## Wahr oder falsch

Eine Variable vom Typ `boolean` kennt nur zwei Werte: `true` (wahr) und `false` (falsch). Du kennst das schon von den Sensoren: `mbot.isButtonA()` liefert `true` oder `false`. Auch ein Vergleich wie `mbot.getDistance() < 10` ist am Ende `true` oder `false`.

| Anlegen | Bedeutung |
|---|---|
| `boolean dunkel = false` | Es war noch nicht dunkel. |
| `dunkel = true` | Jetzt war es dunkel. |
| `if (dunkel)` | Ist `dunkel` wahr? |

Bei `if (dunkel)` brauchst du kein `== true`. Die Variable ist ja selbst schon wahr oder falsch.

## Der Merker

Der mBot2 soll drei Sekunden lang Wache halten. Er misst immer wieder die Helligkeit. Danach soll er sagen, ob es **irgendwann** dunkel war.

Dafür nimmst du einen **Merker**: eine `boolean`-Variable, die mit `false` anfängt. Wird es dunkel, setzt du sie auf `true`. Danach setzt sie niemand mehr zurück. Nach der Schleife weißt du also: War es auch nur ein einziges Mal dunkel?

::: übung vb-wurde-es-dunkel
titel: Wurde es dunkel?
auftrag: Baue ein Struktogramm: Lege `boolean dunkel = false` an. Prüfe in einer For-Schleife 30-mal: Ist die Helligkeit kleiner als 20, wird `dunkel` wahr. Warte in jedem Durchgang 100 ms. Zeige danach **Es war dunkel** oder **Immer hell**.
messwerte: getBrightness=80/10/80 -> none, screen "Es war dunkel"
messwerte: getBrightness=80 -> none, screen "Immer hell"
braucht: forSchleife, verzweigung
tipp: In der Schleife steht eine Verzweigung mit `mbot.getBrightness() < 20`. Im Ja-Zweig steht `dunkel = true`, der Nein-Zweig bleibt leer. Danach kommt `mbot.pause(100)`.
tipp: Nach der Schleife kommt eine zweite Verzweigung mit der Bedingung `dunkel`. Ja: `mbot.showText("Es war dunkel")`, Nein: `mbot.showText("Immer hell")`.
lösung: vb-wurde-es-dunkel-loesung.visustruct
:::

> Beim Prüfen wird es in der Mitte der Wache kurz dunkel und dann wieder hell. Zeigt dein mBot2 trotzdem **Es war dunkel**?

## Jetzt in Java: Wurde geklatscht?

In Java sieht der Merker so aus:

```java
boolean laut = false;
for (int i = 0; i < 30; i++) {
    if (mbot.getLoudness() > 60) {
        laut = true;
    }
    mbot.pause(100);
}
```

`true` und `false` schreibst du in Java immer klein.

::: übung vb-java-klatsch-merker
titel: Wurde geklatscht?
code: java
auftrag: Schreibe in Java: Der mBot2 hört drei Sekunden lang zu (30-mal mit 100 ms Pause). Ist die Lautstärke einmal größer als 60, merkt er sich das in `boolean laut`. Danach zeigt er **Geklatscht!** oder **Alles still**.
messwerte: getLoudness=0/90/0 -> none, screen "Geklatscht!"
messwerte: getLoudness=0 -> none, screen "Alles still"
braucht: forSchleife, verzweigung
tipp: Nimm den Code oben und schreibe danach `if (laut) { … } else { … }`.
tipp: In die Zweige kommen `mbot.showText("Geklatscht!");` und `mbot.showText("Alles still");`.
lösung: vb-java-klatsch-merker-loesung.visustruct
:::

::: übung vb-fehler-11-merker-boolean
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Wurde geklatscht?“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-11-merker-boolean-start.visustruct
messwerte: getLoudness=0/90/0 -> none, screen "Geklatscht!"
messwerte: getLoudness=0 -> none, screen "Alles still"
tipp: Die Fehlermeldung nennt eine unbekannte Variable. Wie schreibt man wahr und falsch in Java? Java unterscheidet Groß- und Kleinschreibung.
tipp: Richtig heißt es `laut = true`.
lösung: vb-java-klatsch-merker-loesung.visustruct
:::

## Spiel: true oder false?

::: spiel frage
titel: Spiel: true oder false?
intro: Ludwig fragt, was in der Bedingung herauskommt. Sechs Runden.
frage: Ist es true oder false?
antworten: true | false

runde:
frage: `mbot.getDistance() < 10`, der Abstand ist 25 cm.
richtig: false
> 25 ist nicht kleiner als 10.

runde:
frage: `mbot.isButtonA()`, und du drückst gerade Taste A.
richtig: true
> Der Sensor meldet: gedrückt.

runde:
frage: `boolean dunkel = false`. In der Schleife wird es nie dunkel. Was ist `dunkel` danach?
richtig: false
> Niemand hat den Merker auf `true` gesetzt.

runde:
frage: `boolean dunkel = false`. In der Schleife wird es einmal dunkel, danach wieder hell. Was ist `dunkel` danach?
richtig: true
> Ein Merker bleibt `true`, wenn er einmal gesetzt wurde.

runde:
frage: `mbot.getBrightness() > 50`, die Helligkeit ist 50.
richtig: false
> 50 ist nicht größer als 50.

runde:
frage: `!mbot.isButtonA()`, und du drückst Taste A nicht.
richtig: true
> Taste A ist nicht gedrückt, also `false`. Das `!` dreht es um: `true`.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann eine Variable vom Typ `boolean` anlegen. → Wahr oder falsch
- Ich kann mit einem Merker festhalten, ob etwas passiert ist. → Der Merker
- Ich kann einen Merker nach der Schleife in einer Bedingung abfragen. → Jetzt in Java: Wurde geklatscht?
:::

## Wissenstest

::: quiz
? Welche Werte kann eine Variable vom Typ `boolean` haben?
→ Wahr oder falsch
- [ ] Jede ganze Zahl
- [x] Nur `true` und `false`
- [ ] Nur 0 und 1
? Womit fängt ein Merker an?
→ Der Merker
- [x] Mit `false`, weil noch nichts passiert ist
- [ ] Mit `true`
- [ ] Mit dem ersten Messwert
> Erst wenn das Ereignis passiert, wird er `true`.
? Wie fragst du in Java ab, ob der Merker `laut` wahr ist?
→ Jetzt in Java: Wurde geklatscht?
- [x] `if (laut)`
- [ ] `if (laut = true)`
- [ ] `if laut`
> `laut` ist selbst schon wahr oder falsch. Ein einzelnes `=` wäre eine Zuweisung.
:::
