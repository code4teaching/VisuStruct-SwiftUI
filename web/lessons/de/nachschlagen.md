### Anweisung

Ein einzelner Schritt. Damit legst du Variablen an oder rechnest.

```
int zahl = 5
double preis = 2.5
String name = "Ada"
zahl = zahl + 1
```

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

### Verzweigung

Prüft eine Bedingung. Ist sie wahr, wird der linke Zweig (true) ausgeführt, sonst der rechte (false).

```
alter >= 18
zahl % 2 == 0
note < 1 || note > 6
```

### Fallauswahl

Wählt je nach Wert einer Variablen einen von mehreren Fällen. Passt kein Fall, gilt `default`. Fälle fügst du rechts mit **Weiteren Fall hinzufügen** hinzu.

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

### Aufruf

Steht für ein Unterprogramm, z. B. `berechneSumme()`.

### Aussprung

Verlässt die umgebende Schleife (`break`).

### Rechenzeichen und Vergleiche

- `+ - * /` Grundrechenarten
- `%` Rest beim Teilen (`7 % 2` ist 1)
- `==` gleich, `!=` ungleich
- `<` `<=` `>` `>=` kleiner, kleiner gleich, größer, größer gleich
- `&&` und, `||` oder

### Arrays

Mehrere Werte unter einem Namen. Gezählt wird ab 0.

```
int[] zahlen = {3, 7, 1}
output: zahlen[0]
int[] leer = new int[5]
```
