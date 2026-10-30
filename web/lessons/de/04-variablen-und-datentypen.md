---
titel: Variablen und Datentypen
bereich: Grundlagen
kurz: Werte speichern, die Datentypen int, double, String und boolean kennen und rechnen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- eine Variable mit Datentyp, Namen und Wert anlegen
- die Datentypen int, double, String und boolean unterscheiden
- erklären, dass = eine Zuweisung ist und kein Vergleich
- mit + - * / % rechnen und die ganzzahlige Division anwenden
- Variablen in Java anlegen und ausgeben
:::

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

::: angeberwissen
Im September 1999 ging die Mars-Sonde Mars Climate Orbiter verloren. Ein Team rechnete die Schubkraft in amerikanischen Einheiten (Pfund), das andere erwartete metrische Einheiten (Newton). In den Daten stand nur die Zahl, nicht die Einheit. Die Sonde flog zu tief in die Mars-Atmosphäre und verglühte, Schaden rund 125 Millionen Dollar. Ein sprechender Name wie `impulsInNewtonSekunden` hätte gesagt, was drinsteht. Ich schreibe auf mein Heufach übrigens immer `heuInKilo`.
:::

Besteht ein Name aus mehreren Wörtern, schreibst du sie zusammen und beginnst jedes weitere Wort mit einem Großbuchstaben: `preisMitSteuer`, `anzahlSchueler`. Diese Schreibweise heißt **CamelCase**.

::: angeberwissen
CamelCase heißt so, weil die Großbuchstaben in der Mitte wie die Höcker eines Kamels aus dem Wort ragen: `preisMitSteuer` hat zwei Höcker. Ich als Geißbock habe übrigens null Höcker, dafür zwei Hörner. Leider hat noch niemand die GeißbockSchreibweise erfunden.
:::

::: grafik l04-camelcase.svg
Die Großbuchstaben M und S ragen heraus wie die zwei Höcker des Kamels.
:::

## Die vier Datentypen

Der Datentyp legt fest, welche Art von Wert in der Variablen stehen darf.

- **int:** ganze Zahlen, z. B. `int anzahl = 3` oder `int temperatur = -5`
- **double:** Kommazahlen, z. B. `double preis = 2.5`. Statt Komma schreibst du einen **Punkt**.
- **String:** Text, z. B. `String name = "Mia"`. Text steht in Anführungszeichen.
- **boolean:** Wahrheitswerte, nur `true` (wahr) oder `false` (falsch)

Es gibt noch mehr Datentypen. Einen wirst du bald brauchen: `char` für ein **einzelnes Zeichen**, z. B. `char note = 'C'`. Ein `char` steht in **einfachen** Anführungszeichen. Genauer lernst du ihn in Lektion 17 kennen.

::: diagramm l05-datentypen.visustruct
Drei Variablen mit verschiedenen Datentypen. Öffne das Diagramm und starte die Simulation.
:::

Wahrheitswerte begegnen dir vor allem in **Bedingungen**: `alter >= 18` ist entweder `true` oder `false`. Darum geht es in Lektion 8. Eine Variable vom Typ `boolean` bekommt einfach `true` oder `false`:

```
boolean volljaehrig = false
```

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
- `%` Rest beim Teilen (gesprochen „Modulo“), z. B. ist `17 % 5` gleich 2

**Teilen mit Rest** kennst du aus der Grundschule, als du noch keine Kommazahlen hattest: 17 : 5 = 3 Rest 2. Die 5 passt dreimal in die 17, das sind 15. Bis 17 fehlen dann noch 2, das ist der Rest. Genau so rechnet der Computer mit ganzen Zahlen: `/` liefert das Ergebnis ohne Rest, `%` nur den Rest.

| Grundschule | mit `/` | mit `%` |
|---|---|---|
| 17 : 5 = 3 Rest 2 | `17 / 5` ergibt 3 | `17 % 5` ergibt 2 |
| 20 : 5 = 4 Rest 0 | `20 / 5` ergibt 4 | `20 % 5` ergibt 0 |
| 3 : 5 = 0 Rest 3 | `3 / 5` ergibt 0 | `3 % 5` ergibt 3 |

Ist der Rest 0, geht die Teilung auf. So prüfst du später, ob eine Zahl gerade ist: Bei geraden Zahlen ist `zahl % 2` gleich 0.

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
auftrag: Du kaufst 3 Hefte zu je 2.5 Euro. Lege `anzahl` als `int` und `preis` als `double` an, berechne den Gesamtpreis in einer Variablen `gesamtPreis` und gib `Gesamt: 7.5 Euro` aus.
test: - -> Gesamt: 7.5 Euro
braucht: anweisung
tipp: Anzahl mal Preis ergibt den Gesamtpreis. Überlege für jede Variable, ob sie eine ganze Zahl oder eine Kommazahl ist.
tipp: Der Gesamtpreis ist eine Kommazahl, also braucht `gesamtPreis` den Typ `double`.
lösung: l05-einkauf-loesung.visustruct
:::

## Jetzt in Java

Ein Struktogramm ist ein Plan. In **Java** wird daraus ein Programm, das der Computer ausführt. Dein Einkauf aus der Übung sieht so aus:

```java
int anzahl = 3;
double preis = 2.5;
double gesamtPreis = anzahl * preis;
System.out.println("Gesamt: " + gesamtPreis + " Euro");
```

- Erst der Datentyp, dann der Name, dann der Wert, genau wie im Kasten.
- Jede Anweisung endet mit einem **Semikolon** `;`.
- Eine Ausgabe heißt in Java `System.out.println(…)`.

::: angeberwissen
Java hieß zuerst **Oak** (Eiche), nach dem Baum vor dem Bürofenster von James Gosling. Sein Team bei Sun Microsystems wollte ab 1991 kleine Geräte wie Fernseh-Boxen programmieren. Den Namen Oak hatte aber schon eine andere Firma. Also wurde es 1995 **Java**, wie der Kaffee von der Insel Java. Deshalb ist das Logo eine dampfende Tasse.
:::

## Text in Java

Variablen speichern nicht nur Zahlen. Für Text gibt es den Datentyp `String`:

```java editor
String name = "Mia";
int alter = 14;
double groesse = 1.62;
System.out.println(name + " ist " + alter + " Jahre alt.");
System.out.println("Größe: " + groesse + " m");
```

- Text steht in Anführungszeichen.
- `String` schreibst du groß, `int`, `double` und `boolean` klein. Java unterscheidet das.
- Mit `+` hängst du Text und Zahlen aneinander.

Java tippst du im Bereich [Programmieren](#zeige-codelive). Das Struktogramm entsteht dabei von selbst. „Im Editor öffnen“ holt das Beispiel in den Bereich Programmieren. Klicke dort auf „Ausführen“, ändere dann Name, Alter oder Größe und probiere es noch einmal.

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

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann eine Variable mit Datentyp, Namen und Wert anlegen. → Was ist eine Variable?
- Ich kann die Datentypen int, double, String und boolean unterscheiden. → Die vier Datentypen
- Ich kann erklären, dass = eine Zuweisung ist und kein Vergleich. → Zuweisung mit =
- Ich kann mit + - * / % rechnen und die ganzzahlige Division anwenden. → Rechnen
- Ich kann Variablen in Java anlegen und ausgeben. → Jetzt in Java
:::

## Wissenstest

::: quiz
? Welcher Datentyp passt zu dem Wert 3.75?
→ Die vier Datentypen
- [ ] int
- [x] double
- [ ] String
- [ ] boolean
> Kommazahlen haben den Typ double. In VisuStruct schreibst du sie mit Punkt.

? Welchen Wert hat x nach `int x = 17 / 5`?
→ Rechnen
- [ ] 3.4
- [x] 3
- [ ] 4
> Bei ganzen Zahlen fällt alles nach dem Komma weg. Es wird nicht gerundet.

? Was ergibt `17 % 5`?
→ Rechnen
- [x] 2
- [ ] 3
- [ ] 3.4
> 17 geteilt durch 5 ist 3, Rest 2. Der Operator % liefert den Rest.

? Am Anfang ist `int punkte = 10`. Was steht nach `punkte = punkte * 2` in punkte?
→ Zuweisung mit =
- [ ] 10
- [ ] 12
- [x] 20
> Rechts wird mit dem alten Wert 10 gerechnet, das Ergebnis 20 wird in punkte gespeichert.

? Welche Zeile legt in Java richtig eine Kommazahl an?
→ Jetzt in Java
- [ ] double preis = 2,5;
- [x] double preis = 2.5;
- [ ] Double preis = 2.5
> Kommazahlen schreibst du mit Punkt, und am Ende steht ein Semikolon.
:::
