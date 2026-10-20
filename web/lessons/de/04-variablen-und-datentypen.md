---
titel: Variablen und Datentypen
bereich: Grundlagen
kurz: Werte speichern, die Datentypen int, double, String und boolean kennen und rechnen.
---

## Was ist eine Variable?

Eine **Variable** ist wie eine beschriftete Kiste. Sie hat einen **Namen**, einen **Datentyp** und einen **Wert**.

```
int alter = 14
```

Hier heißt die Variable `alter`, ihr Datentyp ist `int` (ganze Zahl), und ihr Wert ist 14. Über den Namen kannst du den Wert später wieder benutzen.

::: grafik l04-variable.svg
Die Variable als Kiste: Name auf dem Etikett, Datentyp als Aufkleber, Wert darin.
:::

> Variablennamen beginnen mit einem Buchstaben und enthalten keine Leerzeichen. Gute Namen sagen, was drinsteht: `preis` ist besser als `p`.

## Die vier Datentypen

Der Datentyp legt fest, welche Art von Wert in der Variablen stehen darf.

- **int:** ganze Zahlen, z. B. `int anzahl = 3` oder `int temperatur = -5`
- **double:** Kommazahlen, z. B. `double preis = 2.5`. Statt Komma schreibst du einen **Punkt**.
- **String:** Text, z. B. `String name = "Mia"`. Text steht in Anführungszeichen.
- **boolean:** Wahrheitswerte, nur `true` (wahr) oder `false` (falsch)

::: diagramm l05-datentypen.visustruct
Drei Variablen mit verschiedenen Datentypen. Öffne das Diagramm und starte die Simulation.
:::

Wahrheitswerte begegnen dir vor allem in **Bedingungen**: `alter >= 18` ist entweder `true` oder `false`. Darum geht es in Lektion 7. Du kannst das Ergebnis einer Bedingung auch in einer Variablen speichern:

```
int alter = 15
boolean volljaehrig = alter >= 18
```

Danach steht in `volljaehrig` der Wert `false`.

## Zuweisung mit =

Das Zeichen `=` heißt **Zuweisung**. Es bedeutet nicht „ist gleich“ wie in Mathe, sondern: Berechne die rechte Seite und speichere das Ergebnis in der Variablen links.

```
int punkte = 10
punkte = punkte + 5
```

In Mathe wäre die zweite Zeile falsch, denn keine Zahl ist gleich sich selbst plus 5. Beim Programmieren liest du sie so: Nimm den alten Wert 10, rechne plus 5 und speichere 15 in `punkte`. Den Datentyp schreibst du nur beim ersten Mal, wenn die Variable angelegt wird.

::: grafik l04-zuweisung.svg
Erst wird rechts gerechnet, dann landet das Ergebnis in der Variablen links.
:::

## Rechnen

Mit Zahlen kannst du rechnen:

- `+` plus, `-` minus, `*` mal, `/` geteilt
- `%` Rest beim Teilen, z. B. ist `17 % 5` gleich 2

Es gilt **Punkt vor Strich**, und Klammern werden zuerst ausgerechnet: `2 * (3 + 4)` ist 14.

## Übung: Rechteck

::: übung l05-rechteck
titel: Rechteck berechnen
auftrag: Ein Rechteck ist 7 lang und 4 breit. Lege die Variablen `laenge` und `breite` an. Berechne die Fläche und den Umfang in eigenen Variablen und gib beide aus, so wie hier:
`Fläche: 28` und in der nächsten Zeile `Umfang: 22`.
test: - -> Fläche: 28 | Umfang: 22
braucht: anweisung
tipp: Die Fläche ist Länge mal Breite, der Umfang ist 2 mal (Länge plus Breite). Für die Ausgabe schreibst du z. B. `output: "Fläche: " + flaeche`. Das `+` hängt dabei den Text und den Wert der Variablen aneinander.
lösung: l05-rechteck-loesung.visustruct
:::

## Ganzzahlige Division

Teilst du zwei ganze Zahlen und speicherst das Ergebnis in einer `int`-Variablen, fällt alles nach dem Komma weg. Es wird **nicht gerundet**.

```
int x = 7 / 2      ergibt 3
int r = 7 % 2      ergibt 1 (der Rest)
double d = 7.0 / 2 ergibt 3.5
```

Mit `/` und `%` zusammen kannst du gut umrechnen, zum Beispiel Minuten in Stunden und Minuten:

::: diagramm l05-division.visustruct
135 Minuten sind 2 Stunden (135 / 60) und 15 Minuten Rest (135 % 60).
:::

## Übung: Sekunden umrechnen

::: übung l05-sekunden
titel: Sekunden umrechnen
auftrag: 200 Sekunden sollen als Minuten und Sekunden ausgegeben werden. Die erste und die letzte Anweisung sind schon da. Füge dazwischen Anweisungen ein, die `minuten` und `rest` berechnen.
start: l05-sekunden-start.visustruct
test: - -> 3 Minuten und 20 Sekunden
braucht: anweisung
tipp: Eine Minute hat 60 Sekunden. Nutze `/` für die ganzen Minuten und `%` für den Rest. Beide Variablen sind vom Typ `int`.
lösung: l05-sekunden-loesung.visustruct
:::

## Übung: Einkauf

::: übung l05-einkauf
titel: Einkauf
auftrag: Du kaufst 3 Hefte zu je 2.5 Euro. Lege `anzahl` als `int` und `preis` als `double` an, berechne den Gesamtpreis in einer Variablen `gesamt` und gib `Gesamt: 7.5 Euro` aus.
test: - -> Gesamt: 7.5 Euro
braucht: anweisung
tipp: Der Gesamtpreis ist eine Kommazahl, also braucht `gesamt` den Typ `double`.
lösung: l05-einkauf-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann eine Variable mit Datentyp, Namen und Wert anlegen. → Was ist eine Variable?
- Ich kenne die Datentypen int, double, String und boolean. → Die vier Datentypen
- Ich weiß, dass = eine Zuweisung ist und kein Vergleich. → Zuweisung mit =
- Ich kann mit + - * / % rechnen und kenne die ganzzahlige Division. → Rechnen
:::

## Wissenstest

::: quiz
? Welcher Datentyp passt zu dem Wert 3.75?
- [ ] int
- [x] double
- [ ] String
- [ ] boolean
> Kommazahlen haben den Typ double. In VisuStruct schreibst du sie mit Punkt.

? Welchen Wert hat x nach `int x = 17 / 5`?
- [ ] 3.4
- [x] 3
- [ ] 4
> Bei ganzen Zahlen fällt alles nach dem Komma weg. Es wird nicht gerundet.

? Was ergibt `17 % 5`?
- [x] 2
- [ ] 3
- [ ] 3.4
> 17 geteilt durch 5 ist 3, Rest 2. Der Operator % liefert den Rest.

? Am Anfang ist `int punkte = 10`. Was steht nach `punkte = punkte * 2` in punkte?
- [ ] 10
- [ ] 12
- [x] 20
> Rechts wird mit dem alten Wert 10 gerechnet, das Ergebnis 20 wird in punkte gespeichert.
:::
