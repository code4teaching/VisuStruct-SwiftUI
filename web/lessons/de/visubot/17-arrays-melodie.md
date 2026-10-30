---
titel: Arrays und Melodien
bereich: VisuBot
kurz: Viele Werte in einem Array speichern und mit einer Schleife abarbeiten.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- ein Array anlegen und mit einer Schleife abspielen
- ein Array mit Texten in Java benutzen
- alle Werte eines Arrays zusammenzählen
:::

## Eine Melodie als Array

Eine Melodie ist eine Reihe von Tönen. Statt fünf Variablen `ton1`, `ton2`, … nimmst du ein **Array**. Ein Array ist eine Reihe von Fächern unter **einem** Namen:

```java
int[] toene = {262, 294, 330, 349, 392};
```

- `int[]` heißt: ein Array aus ganzen Zahlen.
- Die Fächer sind von **0** an nummeriert. `toene[0]` ist 262, `toene[4]` ist 392.
- `toene.length` sagt, wie viele Fächer es gibt, hier 5.

Eine For-Schleife mit `i` von 0 bis `toene.length - 1` kommt so an jedes Fach.

::: übung vb-melodie
titel: Melodie
auftrag: Lege ein Array `toene` mit den Tonhöhen 262, 294, 330, 349 und 392 an. Eine For-Schleife spielt sie nacheinander, jeden 300 Millisekunden lang.
befehle: playTone 262 300, playTone 294 300, playTone 330 300, playTone 349 300, playTone 392 300
braucht: forSchleife
tipp: `int[] toene = {262, 294, 330, 349, 392}` legt das Array an.
tipp: Die Schleife läuft von `i = 0` bis `i < toene.length`. Darin steht `mbot.playTone(toene[i], 300)`.
lösung: vb-melodie-loesung.visustruct
:::

> Willst du eine andere Melodie, änderst du nur das Array. Die Schleife bleibt gleich.

## Jetzt in Java: Regenbogen

Die fünf LEDs haben die Nummern 0 bis 4, genau wie die Fächer eines Arrays mit fünf Werten. Ein Array kann auch Texte enthalten: `String[] farben = {"rot", "gelb"};`. LED `i` bekommt dann die Farbe aus Fach `i`: `mbot.led(i).setColor(farben[i])`.

::: übung vb-farben
titel: Regenbogen
code: java
auftrag: Schreibe in Java: Lege ein Array `farben` mit den Texten `"rot"`, `"gelb"`, `"grün"`, `"blau"` und `"lila"` an. Eine For-Schleife gibt jeder LED `i` die Farbe aus `farben[i]`.
befehle: ledColor 0 "rot", ledColor 1 "gelb", ledColor 2 "grün", ledColor 3 "blau", ledColor 4 "lila"
braucht: forSchleife
tipp: `String[] farben = {"rot", "gelb", "grün", "blau", "lila"};` legt das Array an.
tipp: `for (int i = 0; i < farben.length; i++) { mbot.led(i).setColor(farben[i]); }`
lösung: vb-farben-loesung.visustruct
:::

## Jetzt ohne Roboter: Summe der Noten

Mit einer Schleife kannst du auch alle Werte eines Arrays zusammenzählen. Dafür brauchst du eine Variable, die mit 0 anfängt und in jedem Durchgang wächst:

```java
int summe = 0;
for (int i = 0; i < noten.length; i++) {
  summe = summe + noten[i];
}
```

::: übung vb-ohne-summe
titel: Summe der Noten
code: java
auftrag: Lege `int[] noten = {2, 1, 3, 2}` an. Zähle in einer Schleife alle Noten zusammen und gib danach **Summe: 8** und in einer zweiten Zeile **Anzahl: 4** aus. Die Anzahl liefert `noten.length`. Ganz ohne `mbot`!
test: - -> Summe: 8 | Anzahl: 4
braucht: forSchleife
tipp: Vor der Schleife `int summe = 0;`, in der Schleife `summe = summe + noten[i];`.
tipp: Nach der Schleife `System.out.println("Summe: " + summe);` und `System.out.println("Anzahl: " + noten.length);`.
lösung: vb-ohne-summe-loesung.visustruct
:::

::: quiz
? Was ist `toene[1]`, wenn `int[] toene = {262, 294, 330};`?
→ Eine Melodie als Array
- [ ] 262
- [x] 294
- [ ] 1
> Die Fächer zählen ab 0. Fach 1 ist also das zweite.
? Wie viele Fächer hat `{262, 294, 330}`, also was ist `toene.length`?
→ Eine Melodie als Array
- [ ] 2
- [x] 3
- [ ] 330
> `length` zählt die Fächer, hier drei. Das letzte Fach hat deshalb die Nummer 2.
:::

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann ein Array anlegen und mit einer Schleife abspielen. → Eine Melodie als Array
- Ich kann ein Array mit Texten in Java benutzen. → Jetzt in Java: Regenbogen
- Ich kann alle Werte eines Arrays zusammenzählen. → Jetzt ohne Roboter: Summe der Noten
:::
