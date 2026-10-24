---
titel: Zeile für Zeile mit BufferedReader
bereich: Dateien
kurz: Mit BufferedReader und readLine lesen, bis null kommt, und mit Files eine ganze Datei auf einmal lesen.
---

## Der Kuchen ist weg!

Am Morgen nach dem Fest ist Ludwigs Kuchen verschwunden. Zum Glück führt die Burg ein Logbuch. Jede Zeile beginnt mit dem Tag und der Uhrzeit:

::: datei logbuch.txt
Mo 08:15 Ludwig füttert die Ziegen
Mo 12:30 Zora liest im Turm
Mo 18:00 Fuchs schleicht am Tor vorbei
Di 09:00 Ludwig backt einen Kuchen
Di 14:45 Hase bringt Karotten
Di 16:20 Fuchs fragt nach dem Rezept
Di 23:55 Der Kuchen ist weg
Mi 07:00 Zora findet Krümel vor dem Fuchsbau
:::

Mit dem Scanner aus Lektion 23 könntest du es schon lesen. Profis nehmen für Dateien aber oft den **BufferedReader**.

## Lesen mit BufferedReader

```java
import java.io.*;

BufferedReader leser = new BufferedReader(new FileReader("logbuch.txt"));
String zeile = leser.readLine();
while (zeile != null) {
    System.out.println(zeile);
    zeile = leser.readLine();
}
leser.close();
```

- `new FileReader("logbuch.txt")` öffnet die Datei, `new BufferedReader(…)` legt einen Puffer drumherum. Er holt die Datei in großen Stücken und ist deshalb bei langen Dateien schneller.
- `readLine()` liefert die nächste Zeile. Gibt es keine Zeile mehr, liefert es **null**.
- Die Schleife läuft deshalb, solange `zeile != null` ist. Am Ende jedes Durchlaufs liest sie die nächste Zeile.

::: diagramm dt-buffered.visustruct
Erst eine Zeile lesen, dann prüfen, dann am Ende des Durchlaufs die nächste lesen.
:::

**null** heißt „gar nichts“. Es ist nicht der leere Text `""`, sondern kein Text. Eine Variable mit `null` hat keine Methoden: `zeile.length()` bricht dann mit einer `NullPointerException` ab. Prüfe deshalb immer zuerst `zeile != null`.

| | Scanner | BufferedReader |
|---|---|---|
| Anlegen | `new Scanner(new File(…))` | `new BufferedReader(new FileReader(…))` |
| Gibt es noch eine Zeile? | `hasNextLine()` | `readLine()` liefert `null` |
| Nächste Zeile | `nextLine()` | `readLine()` |
| Stärke | kann auch Zahlen lesen (`nextInt()`) | schnell, auch bei großen Dateien |

::: ludwig
Die Schleife sieht anders aus als beim Scanner: Die erste Zeile wird **vor** der Schleife gelesen, jede weitere **am Ende** des Durchlaufs. Vergisst du das Lesen am Ende, liest das Programm immer wieder dieselbe Zeile und hört nie auf.
:::

::: angeberwissen
Wo eine Zeile endet, ist nicht überall gleich: Windows schreibt zwei unsichtbare Zeichen, „Wagenrücklauf“ und „Zeilenvorschub“, Linux und macOS nur den Zeilenvorschub. Die Namen stammen von der Schreibmaschine, bei der der Papierwagen zurückfuhr und das Papier eine Zeile weiterrückte. `readLine()` kommt mit beidem klar.
:::

## Übung: Wie oft kommt der Fuchs vor?

::: übung l24-java-fuchs
titel: Wie oft kommt der Fuchs vor?
code: java
auftrag: Lies das Logbuch mit dem BufferedReader und zähle die Zeilen, in denen **Fuchs** vorkommt. Gib am Ende **Fuchs:** und die Anzahl aus.
start: l24-java-fuchs-start.visustruct
test: - -> Fuchs: 3
braucht: whileSchleife, verzweigung
tipp: Lege vor der Schleife `int anzahl = 0;` an. In der Schleife prüfst du `zeile.contains("Fuchs")`.
tipp: Das `zeile = leser.readLine();` gehört ans Ende der Schleife, nach dem if.
lösung: l24-java-fuchs-loesung.visustruct
:::

## Automatisch schließen

Damit `close()` auch nach einer Exception nicht vergessen wird, gibt es eine Kurzform von try: Was in den runden Klammern hinter `try` angelegt wird, schließt Java am Ende von selbst.

```java
try (BufferedReader leser = new BufferedReader(new FileReader("logbuch.txt"))) {
    String zeile = leser.readLine();
    while (zeile != null) {
        System.out.println(zeile);
        zeile = leser.readLine();
    }
} catch (IOException e) {
    System.out.println("Das Logbuch fehlt.");
}
```

Das heißt **try-with-resources**. `IOException` fängt alle Fehler beim Lesen und Schreiben auf, auch eine fehlende Datei.

> Wie try und catch läuft auch try-with-resources nur mit echtem Java (Lektion 22). In der Simulation schreibst du `close()` selbst.

## Die Abkürzung: Files

Seit Java 11 geht es noch kürzer. `Files.readString` liest die ganze Datei auf einmal, das kennst du aus Lektion 17. Mit `split("\n")` zerlegst du den Text in ein Array von Zeilen:

```java
import java.nio.file.*;

String text = Files.readString(Path.of("logbuch.txt"));
String[] zeilen = text.split("\n");
for (int i = 0; i < zeilen.length; i++) {
    System.out.println(zeilen[i]);
}
```

Jetzt stehen alle Zeilen im Array. Du kannst sie in beliebiger Reihenfolge ansehen, zum Beispiel rückwärts oder nur jede zweite.

| Weg | Gut für |
|---|---|
| `Scanner` | kleine Dateien, Zahlen und Wörter lesen |
| `BufferedReader` | große Dateien, Zeile für Zeile |
| `Files.readString` | kleine Dateien, die ganz ins Programm passen |

::: ludwig
Eine Datei mit einer Million Zeilen liest du besser mit dem BufferedReader Zeile für Zeile. Mit `Files.readString` müsste die ganze Datei auf einmal in den Speicher.
:::

## Übung: Der längste Eintrag

::: übung l24-java-laengster
titel: Der längste Eintrag
code: java
auftrag: Im Startcode stehen die Zeilen des Logbuchs schon im Array `zeilen`. Finde die längste Zeile und gib sie so aus: **Längster Eintrag:** und dann die Zeile.
start: l24-java-laengster-start.visustruct
test: - -> Längster Eintrag: Mi 07:00 Zora findet Krümel vor dem Fuchsbau
braucht: forSchleife, verzweigung
tipp: Merke dir die bisher längste Zeile in `String laengster = zeilen[0];` und gehe die anderen Zeilen mit einer for-Schleife durch.
tipp: Ist `zeilen[i].length() > laengster.length()`, wird `zeilen[i]` der neue Längste.
lösung: l24-java-laengster-loesung.visustruct
:::

## Spiel: Datei-Detektiv

::: spiel frage
titel: Spiel: Datei-Detektiv
intro: Wer hat den Kuchen genommen? Jedes Programm durchsucht das **Logbuch** von oben. Sag voraus, was es ausgibt, und sammle so die Hinweise. Fünf Runden.
frage: Was gibt das Programm aus?

runde:
    String zeile = leser.readLine();
    zeile = leser.readLine();
    System.out.println(zeile.substring(9));
- Ludwig füttert die Ziegen
- [x] Zora liest im Turm
- Mo 12:30 Zora liest im Turm
> Das zweite `readLine()` liefert die zweite Zeile. Ab Index 9 beginnt der Text nach der Uhrzeit.

runde:
    int n = 0;
    String zeile = leser.readLine();
    while (zeile != null) {
        if (zeile.startsWith("Di")) n++;
        zeile = leser.readLine();
    }
    System.out.println(n);
- 3
- [x] 4
- 8
> Vier Einträge stammen vom Dienstag.

runde:
    String zeile = leser.readLine();
    while (zeile != null) {
        if (zeile.contains("Kuchen")) {
            System.out.println(zeile.substring(3, 8));
        }
        zeile = leser.readLine();
    }
- [x] 09:00\n23:55
- 09:00
- Di\nDi
> Zwei Zeilen enthalten „Kuchen“. `substring(3, 8)` schneidet die Uhrzeit heraus.

runde:
    String zeile = leser.readLine();
    String letzte = "";
    while (zeile != null) {
        if (zeile.contains("Fuchs")) letzte = zeile;
        zeile = leser.readLine();
    }
    System.out.println(letzte);
- Di 16:20 Fuchs fragt nach dem Rezept
- [x] Mi 07:00 Zora findet Krümel vor dem Fuchsbau
- Mo 18:00 Fuchs schleicht am Tor vorbei
> `letzte` wird bei jedem Treffer überschrieben. Am Ende steht der letzte Treffer darin. „Fuchsbau“ enthält auch „Fuchs“.

runde:
    String zeile = leser.readLine();
    while (zeile != null) {
        if (zeile.contains("Krümel")) {
            int bei = zeile.indexOf("vor dem ");
            System.out.println(zeile.substring(bei + 8));
        }
        zeile = leser.readLine();
    }
- [x] Fuchsbau
- vor dem Fuchsbau
- Krümel
> Die Krümel liegen vor dem Fuchsbau. Der Fuchs hat nach dem Rezept gefragt, und um 23:55 war der Kuchen weg. Fall gelöst!
:::

## Checkliste

::: checkliste
- Ich kann eine Datei mit BufferedReader und readLine lesen. → Lesen mit BufferedReader
- Ich weiß, dass readLine am Ende null liefert, und prüfe zeile != null. → Lesen mit BufferedReader
- Ich habe gezählt, wie oft der Fuchs im Logbuch vorkommt. → Übung: Wie oft kommt der Fuchs vor?
- Ich kann eine ganze Datei mit Files.readString lesen und mit split in Zeilen zerlegen. → Die Abkürzung: Files
- Ich habe den längsten Eintrag gefunden. → Übung: Der längste Eintrag
:::

## Wissenstest

::: quiz
? Was liefert readLine(), wenn die Datei zu Ende ist?
- [ ] ""
- [x] null
- [ ] -1
> null heißt: Es gibt keinen Text mehr.

? Warum steht in der Schleife am Ende noch einmal zeile = leser.readLine()?
- [ ] Damit die Datei geschlossen wird.
- [x] Sonst bleibt zeile immer gleich, und die Schleife hört nie auf.
- [ ] Damit die erste Zeile doppelt ausgegeben wird.

? Was macht try-with-resources?
- [ ] Es liest die Datei schneller.
- [x] Es schließt die Datei am Ende von selbst.
- [ ] Es verhindert jede Exception.

? Ordne jedem Weg zu, wofür er gut ist.
= BufferedReader -> große Dateien, Zeile für Zeile
= Files.readString -> kleine Dateien auf einmal
= Scanner -> Zahlen und Wörter lesen
:::
