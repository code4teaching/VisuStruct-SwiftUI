---
titel: Nah, mittel oder weit?
bereich: Sensoren und Entscheidungen
kurz: Eine Verzweigung mit drei Fällen bauen und in Java mit else if schreiben.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- eine Verzweigung mit drei Fällen bauen
- `else if` in Java lesen und schreiben
- die Bedingungen in der richtigen Reihenfolge prüfen
:::

## Drei Fälle statt zwei

Viele Autos haben eine **Einparkhilfe**. Ist die Wand weit weg, ist alles frei. Kommt sie näher, heißt es: langsam. Ist sie ganz nah: Stopp!

Eine Verzweigung hat nur zwei Zweige, Ja und Nein. Für drei Fälle setzt du eine zweite Verzweigung in den Nein-Zweig der ersten:

1. Ist der Abstand kleiner als 10? Dann **Stopp**.
2. Sonst: Ist der Abstand kleiner als 30? Dann **Langsam**.
3. Sonst: **Frei**.

::: diagramm vb-l06n-einparkhilfe.visustruct
Die Einparkhilfe. Die zweite Frage wird nur gestellt, wenn die Antwort auf die erste Nein war.
:::

Probiere es in der [Simulation](#zeige-simulation) aus: Öffne das Diagramm im Editor und stelle den Abstand auf 5, 20 und 50 cm.

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektion [„Verzweigung“](?visustruct&lektion=08-verzweigung). Sie öffnet sich in einem neuen Fenster.

## Tempo nach Abstand im Struktogramm

::: übung vb-tempo-abstand
titel: Tempo nach Abstand
auftrag: Baue ein Struktogramm mit drei Fällen: Ist der Abstand kleiner als 10, fährt der mBot2 5 cm zurück. Sonst: Ist der Abstand kleiner als 30, fährt er 5 cm vor. Sonst fährt er 20 cm vor.
messwerte: getDistance=5 -> backward 5
messwerte: getDistance=20 -> forward 5
messwerte: getDistance=50 -> forward 20
braucht: verzweigung
tipp: Baue es wie die Einparkhilfe: eine Verzweigung mit `mbot.getDistance() < 10` und im Nein-Zweig eine zweite mit `mbot.getDistance() < 30`.
tipp: Die Befehle sind `mbot.backward(5)`, `mbot.forward(5)` und `mbot.forward(20)`. Der letzte steht im Nein-Zweig der zweiten Verzweigung.
lösung: vb-tempo-abstand-loesung.visustruct
:::

> Beim Prüfen setzt VisuStruct den Abstand nacheinander auf 5, 20 und 50 cm.

## Jetzt in Java: else if

Schau in den Bereich [Code](#zeige-codelive). Die Verzweigung im Nein-Zweig sieht so aus:

```java
if (mbot.getDistance() < 10) {
    mbot.showText("Stopp");
} else {
    if (mbot.getDistance() < 30) {
        mbot.showText("Langsam");
    } else {
        mbot.showText("Frei");
    }
}
```

In Java darfst du das kürzer schreiben. Das `if` rutscht direkt hinter das `else`:

```java
if (mbot.getDistance() < 10) {
    mbot.showText("Stopp");
} else if (mbot.getDistance() < 30) {
    mbot.showText("Langsam");
} else {
    mbot.showText("Frei");
}
```

Beides bedeutet genau dasselbe. Mit `else if` ist es aber besser zu lesen. Die geschweiften Klammern `{ }` schreibst du trotzdem immer.

::: übung vb-java-tageszeit
titel: Tag oder Nacht?
code: java
auftrag: Schreibe in Java mit `else if`: Ist die Helligkeit kleiner als 20, zeigt der mBot2 **Nacht**. Sonst: Ist sie kleiner als 60, zeigt er **Dämmerung**. Sonst zeigt er **Tag**.
messwerte: getBrightness=10 -> none, screen "Nacht"
messwerte: getBrightness=40 -> none, screen "Dämmerung"
messwerte: getBrightness=80 -> none, screen "Tag"
braucht: verzweigung
tipp: Die Helligkeit liest du mit `mbot.getBrightness()`. Die erste Bedingung ist `mbot.getBrightness() < 20`.
tipp: `if (…) { mbot.showText("Nacht"); } else if (mbot.getBrightness() < 60) { mbot.showText("Dämmerung"); } else { mbot.showText("Tag"); }`
lösung: vb-java-tageszeit-loesung.visustruct
:::

::: übung vb-fehler-06-nah-mittel-weit
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Tag oder Nacht?“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-06-nah-mittel-weit-start.visustruct
messwerte: getBrightness=10 -> none, screen "Nacht"
messwerte: getBrightness=40 -> none, screen "Dämmerung"
messwerte: getBrightness=80 -> none, screen "Tag"
tipp: Ein Text gehört in Anführungszeichen. Ohne sie sucht Java eine Variable mit diesem Namen.
tipp: Richtig heißt es `mbot.showText("Nacht")`.
lösung: vb-java-tageszeit-loesung.visustruct
:::

## Auf die Reihenfolge kommt es an

Ludwig hat die Einparkhilfe umgebaut und die Fragen getauscht:

```java
if (mbot.getDistance() < 30) {
    mbot.showText("Langsam");
} else if (mbot.getDistance() < 10) {
    mbot.showText("Stopp");
}
```

Bei 5 cm zeigt sein mBot2 **Langsam** statt **Stopp**. Denn 5 ist auch kleiner als 30. Die erste Bedingung ist schon wahr, die zweite wird gar nicht mehr geprüft. **Stopp** erscheint nie.

> Merke: Bei `<` prüfst du zuerst den kleinsten Wert, dann den nächstgrößeren.

::: spiel frage
titel: Spiel: Was zeigt die Einparkhilfe?
intro: Ludwigs Einparkhilfe von oben: unter 10 cm **Stopp**, unter 30 cm **Langsam**, sonst **Frei**. Was zeigt sie? Sechs Runden.
frage: Was zeigt die Einparkhilfe?
antworten: Stopp | Langsam | Frei

runde:
frage: Der Abstand ist **5 cm**.
richtig: Stopp
> 5 ist kleiner als 10. Schon die erste Frage ist wahr.

runde:
frage: Der Abstand ist **25 cm**.
richtig: Langsam
> 25 ist nicht kleiner als 10, aber kleiner als 30.

runde:
frage: Der Abstand ist **80 cm**.
richtig: Frei
> Beide Fragen sind falsch, also bleibt der letzte Nein-Zweig.

runde:
frage: Der Abstand ist genau **10 cm**.
richtig: Langsam
> 10 ist nicht kleiner als 10. Die erste Frage ist falsch, die zweite wahr.

runde:
frage: Der Abstand ist genau **30 cm**.
richtig: Frei
> 30 ist nicht kleiner als 30. Beide Fragen sind falsch.

runde:
frage: Der Abstand ist **9 cm**.
richtig: Stopp
> 9 ist kleiner als 10.
:::

::: quiz
? Wie viele Verzweigungen brauchst du im Struktogramm für drei Fälle?
→ Drei Fälle statt zwei
- [ ] Eine
- [x] Zwei, die zweite im Nein-Zweig der ersten
- [ ] Drei nebeneinander
> Jede Verzweigung teilt in zwei Zweige. Die zweite teilt den Nein-Zweig noch einmal.
? Was bedeutet `else if` in Java?
→ Jetzt in Java: else if
- [x] Sonst prüfe noch eine Bedingung
- [ ] Wiederhole die Bedingung
- [ ] Prüfe beide Bedingungen gleichzeitig
> `else if` ist die kurze Schreibweise für ein `if` im `else`-Zweig.
? Ludwig prüft zuerst `< 30` und danach `< 10`. Was passiert bei 5 cm?
→ Auf die Reihenfolge kommt es an
- [ ] Es erscheint Stopp.
- [x] Es erscheint Langsam.
- [ ] Es erscheint gar nichts.
> 5 ist auch kleiner als 30. Die zweite Bedingung wird nicht mehr geprüft.
:::

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann eine Verzweigung mit drei Fällen bauen. → Drei Fälle statt zwei
- Ich kann `else if` in Java lesen und schreiben. → Jetzt in Java: else if
- Ich kann die Bedingungen in der richtigen Reihenfolge prüfen. → Auf die Reihenfolge kommt es an
:::
