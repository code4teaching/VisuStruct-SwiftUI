## Grundbausteine

### Anweisung

Ein einzelner Schritt. Damit legst du Variablen an oder rechnest.

```
int zahl = 5
double preis = 2.5
String name = "Ada"
zahl = zahl + 1
```

### Datentypen

Der Datentyp steht vor dem Namen der Variablen.

| Datentyp | Bedeutung | Beispiel |
|---|---|---|
| `int` | ganze Zahl | `int anzahl = 3` |
| `double` | Kommazahl (mit Punkt) | `double preis = 2.5` |
| `String` | Text in doppelten Anführungszeichen | `String name = "Ada"` |
| `boolean` | Wahrheitswert | `boolean fertig = false` |
| `char` | ein einzelnes Zeichen in einfachen Anführungszeichen | `char note = 'C'` |

`'C'` ist ein `char`, `"C"` ein String. Ein Zeichen aus einem Text holst du mit `charAt`: `char erster = name.charAt(0)`. Jedes Zeichen hat einen Zeichencode: `(int) 'A'` ist 65, `(char) 66` ist `'B'`.

### Eingabe

Fragt beim Ausführen einen Wert ab und speichert ihn in einer Variablen. Der Text in Anführungszeichen ist die Frage.

```
input: int alter "Wie alt bist du?"
input: double preis "Preis eingeben"
input: String name "Wie heißt du?"
```

### Ausgabe

Zeigt einen Text oder einen Wert an. Texte stehen in Anführungszeichen, mit `+` verbindest du Text und Variablen.

```
output: "Hallo"
output: summe
output: "Du bist " + alter + " Jahre alt."
```

> In der Ausgabe hängt `+` die Teile immer aneinander: `output: a + b` zeigt bei 3 und 4 also 34. Rechne deshalb vorher in einer Variablen, z. B. `int summe = a + b`, und gib dann `summe` aus.

## Verzweigungen

### Verzweigung

Prüft eine Bedingung. Ist sie wahr, wird der linke Zweig (true) ausgeführt, sonst der rechte (false).

```
alter >= 18
zahl % 2 == 0
note < 1 || note > 6
```

### Fallauswahl

Wählt je nach Wert einer Variablen einen von mehreren Fällen. Passt kein Fall, gilt `default`. Fälle fügst du rechts mit **Weiteren Fall hinzufügen** hinzu.

## Schleifen

### While-Schleife

Wiederholt den Inhalt, **solange** die Bedingung wahr ist. Die Bedingung wird vor jedem Durchlauf geprüft.

```
zahl != 1
i < 10
```

### Do-while-Schleife

Führt den Inhalt **mindestens einmal** aus und prüft die Bedingung erst danach.

### For-Schleife

Zählt eine Variable von einem Startwert bis zu einer Grenze. Die drei Felder sind Start, Bedingung und Schritt.

```
int i = 0
i < 5
i++
```

### Endlosschleife

Wiederholt den Inhalt ohne Bedingung. Mit einem **Aussprung** im Inneren verlässt du sie.

### Aussprung

Verlässt die umgebende Schleife (`break`).

## Unterprogramme

### Aufruf

Steht für ein Unterprogramm, z. B. `berechneSumme()`. Mit Parametern und Rückgabewert hat das Unterprogramm eine Kopfzeile als Titel:

```
int quadrat(int x)      Kopfzeile des Unterprogramms
return x * x            gibt das Ergebnis zurück
int q = quadrat(5)      Aufruf, q bekommt 25
zeigeSumme(3, 4)        Aufruf eines void-Unterprogramms
```

## Rechnen und Vergleichen

### Rechenzeichen und Vergleiche

- `+ - * /` Grundrechenarten
- `%` Rest beim Teilen (`7 % 2` ist 1)
- `==` gleich, `!=` ungleich
- `<` `<=` `>` `>=` kleiner, kleiner gleich, größer, größer gleich
- `&&` und, `||` oder

## Arrays

### Arrays

Mehrere Werte unter einem Namen. Gezählt wird ab 0.

```
int[] zahlen = {3, 7, 1}
output: zahlen[0]
int[] leer = new int[5]
```

Ein **2D-Array** ist eine Tabelle mit Zeilen und Spalten:

```
boolean[][] sitze = new boolean[3][5]
sitze[1][4] = true
output: sitze.length + " Reihen, " + sitze[0].length + " Plätze"
```

## Java

### Vom Code zum Programm

Der Compiler `javac` übersetzt `Datei.java` in Bytecode (`Datei.class`). Die JVM übersetzt den Bytecode beim Ausführen in Maschinencode, auf Windows, macOS und Linux gleich. C++ wird dagegen direkt zu Maschinencode und muss für jedes System neu kompiliert werden.

| | enthält | wofür |
|---|---|---|
| JRE | JVM und Bibliotheken | ausführen |
| JDK | JRE, Compiler `javac`, Werkzeuge | programmieren |

### Kommentare

Notizen im Code. Java überspringt sie, das Struktogramm bleibt gleich.

```java
/*
 * Aufgabe: die Zahlen von 1 bis 10 addieren
 * (mehrzeiliger Kommentar)
 */
// Verarbeitung (einzeiliger Kommentar)
int summe = 0;
for (int i = 1; i <= 10; i++) {
    summe = summe + i;      // Kommentar hinter dem Code
} // Ende for
```

Gut für: die Aufgabenstellung, die Einteilung in Eingabe, Verarbeitung und Ausgabe, eine Erklärung, das Ende eines Blocks hinter `}`, die erwartete Ausgabe und Notizen fürs nächste Mal.
