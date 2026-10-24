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

> Variablennamen beginnen mit einem **Kleinbuchstaben** und enthalten keine Leerzeichen. Gute Namen sagen, was drinsteht: `preis` ist besser als `p`.

Besteht ein Name aus mehreren Wörtern, schreibst du sie zusammen und beginnst jedes weitere Wort mit einem Großbuchstaben: `preisMitSteuer`, `anzahlSchueler`. Diese Schreibweise heißt **CamelCase**.

::: angeberwissen
CamelCase heißt so, weil die Großbuchstaben in der Mitte wie die Höcker eines Kamels aus dem Wort ragen: `preisMitSteuer` hat zwei Höcker. Ich als Geißbock habe übrigens null Höcker, dafür zwei Hörner. Leider hat noch niemand die GeißbockSchreibweise erfunden.
:::

## Die vier Datentypen

Der Datentyp legt fest, welche Art von Wert in der Variablen stehen darf.

- **int:** ganze Zahlen, z. B. `int anzahl = 3` oder `int temperatur = -5`
- **double:** Kommazahlen, z. B. `double preis = 2.5`. Statt Komma schreibst du einen **Punkt**.
- **String:** Text, z. B. `String name = "Mia"`. Text steht in Anführungszeichen.
- **boolean:** Wahrheitswerte, nur `true` (wahr) oder `false` (falsch)

::: diagramm l05-datentypen.visustruct
Drei Variablen mit verschiedenen Datentypen. Öffne das Diagramm und starte die Simulation.
:::

Wahrheitswerte begegnen dir vor allem in **Bedingungen**: `alter >= 18` ist entweder `true` oder `false`. Darum geht es in Lektion 8. Du kannst das Ergebnis einer Bedingung auch in einer Variablen speichern:

```
int alter = 15
boolean volljaehrig = alter >= 18
```

Danach steht in `volljaehrig` der Wert `false`.

::: angeberwissen
Am 4. Juni 1996 explodierte die Rakete Ariane 5 schon 37 Sekunden nach dem Start. Schuld war eine einzige Zeile: Eine Kommazahl für die Geschwindigkeit wurde in eine Ganzzahl-Variable gesteckt, die für so große Werte zu klein war. Der Datentyp ist also keine Nebensache, er kann eine halbe Milliarde Euro kosten.
:::

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
tipp: Überlege zuerst, welche Variablen du brauchst: zwei für die Maße und zwei für die Ergebnisse. Alle sind ganze Zahlen.
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
tipp: Wie viele ganze Minuten passen in 200 Sekunden, und wie viele Sekunden bleiben übrig? Rechne es erst im Kopf aus.
tipp: Eine Minute hat 60 Sekunden. Nutze `/` für die ganzen Minuten und `%` für den Rest. Beide Variablen sind vom Typ `int`.
lösung: l05-sekunden-loesung.visustruct
:::

## Übung: Einkauf

::: übung l05-einkauf
titel: Einkauf
auftrag: Du kaufst 3 Hefte zu je 2.5 Euro. Lege `anzahl` als `int` und `preis` als `double` an, berechne den Gesamtpreis in einer Variablen `gesamt` und gib `Gesamt: 7.5 Euro` aus.
test: - -> Gesamt: 7.5 Euro
braucht: anweisung
tipp: Anzahl mal Preis ergibt den Gesamtpreis. Überlege für jede Variable, ob sie eine ganze Zahl oder eine Kommazahl ist.
tipp: Der Gesamtpreis ist eine Kommazahl, also braucht `gesamt` den Typ `double`.
lösung: l05-einkauf-loesung.visustruct
:::

## Jetzt in Java

Ein Struktogramm ist ein Plan. Damit ein Computer ihn ausführt, schreibst du ihn in einer Programmiersprache auf, zum Beispiel in **Java**. Die Variablen von oben sehen in Java so aus:

```
int alter = 14;
double groesse = 1.62;
String name = "Mia";
System.out.println(name + " ist " + alter + " Jahre alt.");
System.out.println("Größe: " + groesse + " m");
```

- Eine Variable legst du in Java genauso an wie im Kasten: erst der Datentyp, dann der Name, dann der Wert.
- Am Ende jeder Anweisung steht ein **Semikolon** `;`.
- `String` schreibst du groß, `int`, `double` und `boolean` klein. Java unterscheidet Groß- und Kleinbuchstaben.
- Eine Ausgabe heißt in Java `System.out.println(…)`.

Java tippst du im Bereich [Programmieren](#zeige-codelive) rechts neben dem Struktogramm. Während du tippst, baut VisuStruct das Struktogramm mit. So siehst du sofort, welcher Kasten zu welcher Zeile gehört.

::: angeberwissen
Java hieß zuerst **Oak** (Eiche), nach dem Baum vor dem Bürofenster von James Gosling. Sein Team bei Sun Microsystems wollte ab 1991 kleine Geräte wie Fernseh-Boxen programmieren. Den Namen Oak hatte aber schon eine andere Firma. Also wurde es 1995 **Java**, wie der Kaffee von der Insel Java. Deshalb ist das Logo eine dampfende Tasse.
:::

::: übung l04-java-steckbrief
titel: Steckbrief in Java
code: java
auftrag: Schreibe einen Steckbrief für Ludwig den Geißbock. Lege drei Variablen an: den Namen **Ludwig**, das Alter **7** und die Größe **1.2**. Gib dann diese zwei Zeilen aus:
  **Ludwig ist 7 Jahre alt.** und **Größe: 1.2 m**
  „Im Editor öffnen“ öffnet rechts auch den Bereich Programmieren. Tippe dort deinen Code, das Struktogramm entsteht dabei von selbst. Klicke dann auf Prüfen.
test: - -> Ludwig ist 7 Jahre alt. | Größe: 1.2 m
braucht: anweisung
tipp: Du brauchst einen `String`, einen `int` und einen `double`. Jede Zeile endet mit einem Semikolon.
tipp: `String name = "Ludwig";`, `int alter = 7;` und `double groesse = 1.2;`. Die Ausgabe setzt du mit `+` zusammen: `System.out.println(name + " ist " + alter + " Jahre alt.");`
lösung: l04-java-steckbrief-loesung.visustruct
:::

## Lückentext: Datentypen

::: lückentext
titel: Steckbrief in Java
auftrag: Ergänze die fehlenden Wörter. Ganz außen steht der Rahmen, den jedes Java-Programm in einer eigenen Datei braucht. Darin stehen die Variablen.
```java
[[public]] class Steckbrief {
    public static [[void]] main(String[] args) {
        [[int]] alter = 14;
        [[double]] groesse = 1.62;
        [[String]] name = "Mia";
        [[boolean]] hatHaustier = true;
        System.out.[[println]](name + " ist " + alter + " Jahre alt.");
    }
}
```
erklärung: Ganze Zahlen sind `int`, Kommazahlen `double`, Texte `String` (groß geschrieben) und Wahrheitswerte `boolean`. `public class` und `public static void main` bilden den Rahmen. Im Bereich Programmieren darfst du ihn weglassen, mehr dazu in der Lektion „Java“.
:::

## Fehler finden: Sekunden

::: übung l04-java-fehler
titel: Sekunden reparieren
code: java
auftrag: Das Programm soll 200 Sekunden in Minuten und Sekunden umrechnen und **3 min 20 s** ausgeben. Es gibt aber **20 min 3 s** aus.
  „Im Editor öffnen“ zeigt den Code im Bereich Programmieren. Finde den Fehler, repariere ihn und klicke auf Prüfen.
start: l04-java-fehler-start.visustruct
test: - -> 3 min 20 s
braucht: anweisung
tipp: `/` teilt ganzzahlig, `%` liefert den Rest. Welches Zeichen brauchst du für die Minuten, welches für die übrigen Sekunden?
tipp: Die beiden Zeichen sind vertauscht: `int minuten = sekunden / 60;` und `int rest = sekunden % 60;`
lösung: l04-java-fehler-loesung.visustruct
:::

## Spiel: Welcher Datentyp?

::: spiel frage
titel: Spiel: Welcher Datentyp?
intro: Ludwig hat Werte gesammelt. Welcher Datentyp passt zu jedem Wert? Acht Runden.
antworten: int | double | String | boolean

runde:
frage: Welcher Datentyp passt zu `17`?
richtig: int
> Eine ganze Zahl ohne Komma ist ein `int`.

runde:
frage: Welcher Datentyp passt zu `3.5`?
richtig: double
> Kommazahlen sind `double`. In Java steht statt des Kommas ein Punkt.

runde:
frage: Welcher Datentyp passt zu `"Hallo"`?
richtig: String
> Text in Anführungszeichen ist ein `String`.

runde:
frage: Welcher Datentyp passt zu `true`?
richtig: boolean
> `true` und `false` sind die beiden Wahrheitswerte, Datentyp `boolean`.

runde:
frage: Welcher Datentyp passt zu `"17"`?
richtig: String
> Vorsicht, Anführungszeichen! Hier ist 17 ein Text, mit dem man nicht rechnen kann.

runde:
frage: Welcher Datentyp passt zu `-4`?
richtig: int
> Auch negative ganze Zahlen sind `int`.

runde:
frage: Welcher Datentyp passt zu `0.0`?
richtig: double
> Der Punkt macht es zur Kommazahl, auch wenn hinten nur eine 0 steht.

runde:
frage: Welcher Datentyp passt zu `"false"`?
richtig: String
> In Anführungszeichen ist auch false nur ein Text. Der Wahrheitswert steht ohne Anführungszeichen.
:::

## Checkliste

::: checkliste
- Ich kann eine Variable mit Datentyp, Namen und Wert anlegen. → Was ist eine Variable?
- Ich kenne die Datentypen int, double, String und boolean. → Die vier Datentypen
- Ich weiß, dass = eine Zuweisung ist und kein Vergleich. → Zuweisung mit =
- Ich kann mit + - * / % rechnen und kenne die ganzzahlige Division. → Rechnen
- Ich kann Variablen in Java anlegen und ausgeben. → Jetzt in Java
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

? Welche Zeile legt in Java richtig eine Kommazahl an?
- [ ] double preis = 2,5;
- [x] double preis = 2.5;
- [ ] Double preis = 2.5
> Kommazahlen schreibst du mit Punkt, und am Ende steht ein Semikolon.
:::
