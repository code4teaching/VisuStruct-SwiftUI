---
titel: Struktogramm und Code
bereich: Vom Struktogramm zum Code
kurz: Alle Elemente in Java auf einen Blick, Code erzeugen, im Bereich Programmieren Java schreiben, ausführen und Fehler suchen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- die Code-Ansicht öffnen und Java als Sprache wählen
- Ausgabe, Eingabe, Verzweigung und Schleifen in Java erkennen
- den Unterschied zwischen Snippet und Class erklären
- erklären, wie Java-Code mit Compiler, Bytecode und JVM auf jedem Betriebssystem läuft
- JDK und JRE unterscheiden
- erklären, warum man ein C++-Programm für jedes Betriebssystem neu kompilieren muss, ein Java-Programm aber nicht
- ein kurzes Java-Programm als Struktogramm nachbauen
- im Bereich Programmieren Java tippen und das entstehende Struktogramm lesen
- ein Programm mit ▶︎ ausführen und Ein- und Ausgaben in der Konsole nutzen
- Haltepunkte setzen und ein Programm im Einzelschritt verfolgen
:::

## Die Code-Ansicht

In den Lektionen 4 bis 19 hast du jedes Element schon einmal in Java geschrieben. Hier siehst du alles auf einen Blick und lernst, wie VisuStruct aus einem ganzen Struktogramm ein Java-Programm macht.

Ein Struktogramm beschreibt einen Ablauf. Damit ein Computer ihn ausführt, brauchst du ein Programm in einer Programmiersprache. VisuStruct schreibt diesen Code für dich.

Klicke bei den Werkzeugen auf [Code](#zeige-code) (Symbol mit spitzen Klammern). Rechts erscheint der **Code-Generator**:

- Oben wählst du die Sprache: **Java**, **Python** oder **JavaScript**.
- Bei Java wählst du zusätzlich **Snippet** (nur die Anweisungen) oder **Class** (eine vollständige Java-Datei).
- **Diagramm-Text als Kommentare** schreibt den Text jedes Kastens als Kommentar über den Code.
- **Kopieren** legt den Code in die Zwischenablage, **Java speichern …** speichert eine `.java`-Datei.

Der Code ändert sich sofort mit, wenn du am Struktogramm etwas änderst.

::: angeberwissen
Nassi hat später an der Programmiersprache Ada mitgearbeitet und war bei Apple für Software zuständig. Wer Struktogramme erfindet, landet also nicht im Ziegenstall, sondern bei Apple.
:::

::: diagramm l17-beispiel.visustruct
Ein kleines Programm mit Eingabe, For-Schleife und Verzweigung. Öffne es und schau dir den Java-Code dazu an.
:::

## So sieht das Beispiel in Java aus

Für das Diagramm oben erzeugt VisuStruct als **Snippet** diesen Code:

```
// import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Welche Reihe?");
int zahl = scanner.nextInt();
for (int i = 1; i <= 3; i++) {
    int ergebnis = zahl * i;
    System.out.println(i + " mal " + zahl + " = " + ergebnis);
}
if (zahl > 10) {
    System.out.println("Das war schwer!");
} else {
    System.out.println("Das war leicht.");
}
```

Jede Anweisung endet in Java mit einem **Semikolon** `;`. Was in einem Kasten steht, steht in Java in **geschweiften Klammern** `{ }`. Die Einrückung zeigt dir, was zusammengehört.

## Die Elemente in Java

| Element | Java | Lektion |
|---|---|---|
| Anweisung | `int summe = 0;` | 4, 5 |
| Ausgabe | `System.out.println(summe);` | 6 |
| Eingabe | `int zahl = scanner.nextInt();` | 6 |
| Verzweigung | `if (bedingung) { … } else { … }` | 8, 9 |
| Fallauswahl | `switch (wert) { case 1 -> { … } default -> { … } }` | 10 |
| While-Schleife | `while (bedingung) { … }` | 11 |
| Do-while-Schleife | `do { … } while (bedingung);` | 12 |
| For-Schleife | `for (int i = 0; i < 5; i++) { … }` | 13 |
| Endlosschleife | `while (true) { … }` | 11, 18 |
| Aussprung | `break;` | 18 |
| Aufruf | `berechne();` | 18 |
| Array | `int[] zahlen = new int[5];` | 15, 16 |
| Text (String) | `String name = scanner.next();` | 17 |

Für Eingaben steht ganz oben einmal `import java.util.Scanner;` und `Scanner scanner = new Scanner(System.in);`. Vor jeder Eingabe gibt VisuStruct die Frage mit `System.out.println(…)` aus.

Ist der Nein-Zweig einer Verzweigung leer, erzeugt VisuStruct trotzdem einen `else`-Teil, in dem nur der Kommentar `// empty element` steht. Wenn du **Leeren else-Zweig im Code ausgeben** ausschaltest, fällt der leere `else`-Teil weg.

## Snippet oder Class

Ein **Snippet** kannst du in ein vorhandenes Java-Programm in die `main`-Methode einfügen. Mit **Class** bekommst du eine vollständige Datei, die du sofort übersetzen und starten kannst:

```
import java.util.Scanner;

public class Einmaleins {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Welche Reihe?");
        int zahl = scanner.nextInt();
        ...
    } // Ende main
} // Ende Klasse
```

Die Kommentare `// Ende main` und `// Ende Klasse` hinter den letzten beiden Klammern sind nicht nötig, aber sehr hilfreich: So siehst du sofort, welche Klammer was schließt, und vergisst keine.

Der Name der Klasse kommt aus dem **Titel** des Diagramms. Die Datei muss genauso heißen, hier also `Einmaleins.java`. Das erledigt **Java speichern …** für dich.

> Der erzeugte Code ist ein guter Anfang, aber prüfe ihn. Legst du eine Variable zuerst an und liest sie später mit einer Eingabe neu ein, schreibt VisuStruct trotzdem `int pin = scanner.nextInt();`. Java meldet dann, dass es `pin` schon gibt. Lösche in dieser Zeile einfach das `int`.

## Wie Java auf jedem Computer läuft

Deine Datei `Einmaleins.java` ist **Quellcode**: Text für Menschen. Der Prozessor deines Computers versteht ihn nicht direkt. Deshalb läuft Java in zwei Schritten:

1. Der **Compiler** `javac` übersetzt den Quellcode in **Bytecode**. Heraus kommt die Datei `Einmaleins.class`.
2. Die **JVM** (Java Virtual Machine) liest den Bytecode und übersetzt ihn beim Ausführen in **Maschinencode**, also in Befehle für den Prozessor deines Computers.

::: grafik l20-jvm.svg
Einmal kompilieren: Derselbe Bytecode läuft auf jeder JVM.
:::

Den Bytecode gibt es nur einmal. Die JVM gibt es dagegen für Windows, macOS, Linux und viele andere Systeme. Deshalb läuft dieselbe `.class`-Datei auf jedem Computer, auf dem eine JVM installiert ist. Das nennt man **plattformunabhängig**. Der Werbespruch dazu heißt **„Write once, run anywhere“**: einmal schreiben, überall ausführen.

Zum Vergleich **C++**: Dort übersetzt der Compiler den Quellcode direkt in Maschinencode für genau einen Prozessor und ein Betriebssystem. Das fertige Programm läuft nur dort. Für Windows, macOS und Linux musst du es jeweils neu kompilieren.

::: grafik l20-cpp.svg
C++ wird für jedes System einzeln zu Maschinencode kompiliert.
:::

| | C++ | Java |
|---|---|---|
| Der Compiler erzeugt | Maschinencode | Bytecode |
| Wie oft kompilieren? | für jedes System neu | einmal |
| Was braucht der Computer zum Ausführen? | nichts weiter | eine JVM |

Ist Java dadurch langsamer? Kaum. Programmteile, die oft laufen, zum Beispiel Schleifen, übersetzt der **JIT-Compiler** der JVM („just in time“, gerade rechtzeitig) einmal komplett in Maschinencode. Danach laufen sie fast so schnell wie C++.

> Stell dir die JVM wie einen kleinen Computer aus Software vor, fast wie ein eigenes Betriebssystem nur für Java-Programme. Genau genommen ist sie aber kein Betriebssystem, sondern eine **virtuelle Maschine**: ein Programm, das selbst auf Windows, macOS oder Linux läuft und darin einen gedachten Computer nachspielt.

Beim Installieren begegnen dir zwei Abkürzungen:

| Abkürzung | Was steckt drin? | Wofür? |
|---|---|---|
| **JRE** (Java Runtime Environment) | die JVM und fertige Bausteine wie `Scanner` | Java-Programme ausführen |
| **JDK** (Java Development Kit) | die JRE und dazu den Compiler `javac` und weitere Werkzeuge | Java-Programme schreiben und übersetzen |

Zum Programmieren brauchst du also das JDK. Heute lädt man meist nur noch das JDK herunter, die JRE steckt darin. Für VisuStruct im Browser musst du nichts davon installieren.

::: angeberwissen
Mit einem JDK kannst du alles auch selbst in der Konsole machen, also im Terminal oder in der Eingabeaufforderung:

```
java -version
javac Einmaleins.java
java Einmaleins
```

- `java -version` zeigt, welche Java-Version installiert ist. Kommt eine Fehlermeldung, fehlt Java noch.
- `javac Einmaleins.java` startet den Compiler. Danach liegt `Einmaleins.class` im selben Ordner.
- `java Einmaleins` startet die JVM mit deinem Bytecode. Den Klassennamen schreibst du hier ohne `.class`.

Klappt `java -version`, aber `javac -version` nicht, ist nur eine JRE installiert. Dann fehlt dir das JDK.
:::

::: angeberwissen
Jede übersetzte Java-Datei (`.class`) beginnt mit denselben vier Bytes, in Hexadezimal geschrieben: `CA FE BA BE`. Daran erkennt der Computer, dass es Java ist. Das „Kaffee-Baby“ hat sich James Gosling ausgedacht, passend zum Kaffee im Namen.
:::

## Der Java-Sprachmodus

Unter dem [Zahnrad](#zeige-einstellungen) oben rechts kannst du **Code-Keywords** einschalten. Dann heißen die Bausteine im Bereich Elemente so wie die Befehle in Java: `if`, `switch`, `for`, `while`, `do`, `while(true)`, `break` und `call`. Die übrige Oberfläche bleibt in deiner Sprache.

Das hilft dir, die Kästen und die Java-Befehle einander zuzuordnen. Dein Diagramm selbst bleibt dabei unverändert.

## Java direkt schreiben

Bisher hast du zuerst das Struktogramm gezeichnet und dann den Code angesehen. Im Bereich [Programmieren](#zeige-codelive) geht es auch andersherum. Klicke rechts auf die schmale Leiste **Programmieren**. Neben dem Struktogramm erscheint eine Spalte, in die du Java selbst tippst.

- **Struktogramm zu Code:** Änderst du etwas im Struktogramm, ändert sich der Java-Code sofort mit.
- **Code zu Struktogramm:** Tippst du Java, baut VisuStruct beim Tippen das Struktogramm dazu. Fehlt noch etwas, zum Beispiel eine schließende Klammer `}`, steht unter dem Code ein Hinweis.
- **Vorschläge:** Beim Tippen schlägt VisuStruct Vorlagen vor, etwa für `if`, `for` oder `while`. Mit der Eingabetaste übernimmst du eine Vorlage. Grau geschriebene Platzhalter ersetzt du einfach durch deinen Text.
- **Einrücken:** Ist dein Code durcheinandergeraten, klicke oben im Bereich Programmieren auf den Knopf **Einrücken**. Jede Ebene steht dann vier Leerzeichen tiefer, wie in Eclipse oder IntelliJ. Hast du Zeilen markiert, rückt VisuStruct nur diese ein.

So kannst du beide Wege ausprobieren. Erst das Struktogramm zeichnen ist gut, um einen Ablauf zu planen. Direkt Code schreiben ist schneller, wenn du schon weißt, was du willst. Das Struktogramm hilft dir dann, deinen Code zu kontrollieren.

## Das Programm ausführen

Oben im Bereich Programmieren startet [▶︎ Ausführen](#zeige-ausfuehren) dein Programm, **■ Stopp** bricht es ab, zum Beispiel bei einer Endlosschleife. Was dein Programm ausgibt, erscheint unten in der [Konsole](#zeige-konsole). Fragt es nach einer Eingabe, tippst du sie dort ein und drückst die Eingabetaste.

Die Grenze zwischen Code und Konsole kannst du mit der Maus nach oben oder unten ziehen.

> Der Bereich Programmieren versteht die Java-Befehle, die es auch als Kasten im Struktogramm gibt. Eigene Klassen und Objekte kennt es noch nicht. Fenster mit Swing gehen trotzdem: Schalte dafür im Zahnrad **Echtes Java (mit Swing)** ein (Lektion „Dein erstes Fenster“).

::: angeberwissen
Profis nennen ein Programm, in dem man Code schreibt, ausführt und Fehler sucht, eine **IDE** (Integrated Development Environment). Mit dem Bereich Programmieren ist VisuStruct eine kleine IDE mit eingebautem Struktogramm.
:::

## Fehler suchen mit dem Debugger

Manchmal läuft ein Programm, rechnet aber falsch. Dann hilft der **Debugger**: Er führt dein Programm langsam aus, und du schaust ihm dabei zu.

- **Haltepunkt:** Klicke links auf eine Zeilennummer. Ein roter Punkt erscheint. [▶︎ Ausführen](#zeige-ausfuehren) hält vor dieser Zeile an. Ein zweiter Klick nimmt den Punkt wieder weg.
- **Gelbe Zeile:** Sie wird als Nächstes ausgeführt. Im Struktogramm ist der passende Kasten markiert.
- **Variablen:** Unter dem Code steht, welchen Wert jede Variable gerade hat. Was sich seit dem letzten Anhalten geändert hat, leuchtet kurz gelb.
- **Einzelschritt:** Der Knopf [Einzelschritt](#zeige-einzelschritt) neben ▶︎ führt genau eine Zeile aus und hält wieder an. Ohne Haltepunkt startet er das Programm und hält vor der ersten Zeile.
- **Weiter:** ▶︎ läuft bis zum nächsten Haltepunkt oder bis zum Ende. **■ Stopp** bricht ab.

Probier es mit diesem Programm aus. Setze einen Haltepunkt in Zeile 3 und drücke mehrmals ▶︎. Wie wachsen `i` und `summe`?

```
int summe = 0;
for (int i = 1; i <= 4; i++) {
    summe = summe + i;
}
System.out.println("Summe: " + summe);
```

::: ludwig
Das ist ein Schreibtischtest, nur dass der Computer für dich mitschreibt. Überleg dir vor jedem Schritt, welchen Wert die Variable gleich haben müsste. Stimmt die Tabelle nicht mit deiner Vermutung überein, hast du die Stelle mit dem Fehler gefunden.
:::

## Übung: Erst Code, dann Struktogramm

Diesmal zeichnest du nicht. Öffne den Bereich Programmieren und tippe diesen Java-Code ab:

```
System.out.println("Startzahl?");
int zahl = scanner.nextInt();
while (zahl > 0) {
    System.out.println(zahl);
    zahl = zahl - 1;
}
System.out.println("Start!");
```

::: übung l20-countdown
titel: Countdown
auftrag: Tippe den Java-Code oben im Bereich Programmieren ab. Führe ihn mit ▶︎ aus und gib in der Konsole eine Startzahl ein.
  Sieh dir dann das Struktogramm an, das dabei entstanden ist, und klicke auf Prüfen.
test: 3 -> 3 | 2 | 1 | Start!
test: 1 -> 1 | Start!
test: 0 -> Start!
braucht: whileSchleife
tipp: Öffne den Bereich Programmieren mit der schmalen Leiste ganz rechts und tippe einfach los.
tipp: Achte auf das Semikolon am Ende jeder Anweisung und auf die geschweiften Klammern der While-Schleife. Unter dem Code steht ein Hinweis, wenn noch etwas fehlt.
lösung: l20-countdown-loesung.visustruct
:::

## Übung: Java als Struktogramm

Jetzt andersherum: Hier ist ein Stück Java-Code. Baue es als Struktogramm nach.

```
System.out.println("Zahl eingeben");
int n = scanner.nextInt();
int fakultaet = 1;
for (int i = 1; i <= n; i++) {
    fakultaet = fakultaet * i;
}
System.out.println(fakultaet);
```

::: übung l17-fakultaet
titel: Fakultät aus Java
auftrag: Baue den Java-Code oben als Struktogramm nach. Das Programm liest eine Zahl n ein und gibt das Produkt 1 · 2 · … · n aus.
  Kontrolliere am Ende in der Code-Ansicht, ob dein Java-Code genauso aussieht.
test: 3 -> 6
test: 5 -> 120
test: 1 -> 1
braucht: forSchleife
tipp: Lies den Java-Code Zeile für Zeile und überlege, welcher Kasten zu jeder Zeile passt.
tipp: Die beiden ersten Java-Zeilen sind zusammen eine einzige Eingabe: `input: int n "Zahl eingeben"`. Die For-Schleife hat die drei Felder `int i = 1`, `i <= n` und `i++`.
lösung: l17-fakultaet-loesung.visustruct
:::

## Übung: else if

In Java schreibt man mehrere Fälle oft als `else if`:

```
if (alter < 6) {
    System.out.println("Eintritt frei");
} else if (alter < 18) {
    System.out.println("Kinderticket: 4 Euro");
} else {
    System.out.println("Erwachsenenticket: 8 Euro");
}
```

Im Struktogramm gibt es kein `else if`. Dort steckt eine zweite Verzweigung im Nein-Zweig der ersten. Steht im Nein-Zweig nur diese eine Verzweigung, macht VisuStruct beim Erzeugen des Codes daraus wieder `else if`, in Python `elif`.

::: übung l17-ticket
titel: Ticketpreis
auftrag: Frage nach dem Alter als ganze Zahl und baue den Java-Code oben als Struktogramm nach.
test: 5 -> Eintritt frei
test: 6 -> Kinderticket: 4 Euro
test: 17 -> Kinderticket: 4 Euro
test: 18 -> Erwachsenenticket: 8 Euro
braucht: verzweigung
tipp: Im Java-Code steckt in einem `else` ein weiteres `if`. Im Struktogramm ist das eine Verzweigung in einem Zweig.
tipp: Ziehe in den false-Zweig der ersten Verzweigung eine zweite Verzweigung mit der Bedingung `alter < 18`.
lösung: l17-ticket-loesung.visustruct
:::

## Spiel: Welcher Kasten?

::: spiel frage
titel: Spiel: Welcher Kasten?
intro: Ludwig zeigt dir Java. Welcher Kasten aus dem Struktogramm steckt dahinter? Acht Runden.
frage: Welcher Kasten ist das?

runde:
    do {
        zahl = zahl * 2;
    } while (zahl < 100);
- While-Schleife
- [x] Do-while-Schleife
- For-Schleife
> Die Bedingung steht unten. Der Rumpf läuft also mindestens einmal.

runde:
    switch (wahl) {
        case 1 -> { System.out.println("Wasser"); }
        default -> { System.out.println("Gibt es nicht."); }
    }
- Verzweigung
- [x] Fallauswahl
- Aufruf
> Eine Variable wird mit festen Werten verglichen: Das ist die Fallauswahl.

runde:
    break;
- Aufruf
- Endlosschleife
- [x] Aussprung
> `break` verlässt sofort die Schleife, in der es steht.

runde:
    berechne();
- [x] Aufruf
- Ausgabe
- Anweisung
> Name mit runden Klammern: Hier wird ein Unterprogramm aufgerufen.

runde:
    int zahl = scanner.nextInt();
- Ausgabe
- [x] Eingabe
- Aufruf
> Der Scanner liest einen Wert ein. Das ist eine Eingabe.

runde:
    while (true) {
        System.out.println("Hallo");
    }
- While-Schleife mit Bedingung
- [x] Endlosschleife
- Do-while-Schleife
> `while (true)` hat keine echte Bedingung. Nur ein break könnte sie beenden.

runde:
frage: Du willst eine vollständige Java-Datei, die du sofort übersetzen und starten kannst. Was wählst du in der Code-Ansicht?
- Snippet
- [x] Class
> Ein Snippet sind nur die Anweisungen für die `main`-Methode. Class erzeugt die ganze Datei.

runde:
frage: Im Debugger ist eine Zeile gelb. Was bedeutet das?
- Sie hat einen Fehler.
- [x] Sie wird als Nächstes ausgeführt.
- Dort steht ein Haltepunkt.
> Gelb ist die nächste Zeile. Ein Haltepunkt ist ein roter Punkt an der Zeilennummer.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann die Code-Ansicht öffnen und Java als Sprache wählen. → Die Code-Ansicht
- Ich kann Ausgabe, Eingabe, Verzweigung und Schleifen in Java erkennen. → Die Elemente in Java
- Ich kann den Unterschied zwischen Snippet und Class erklären. → Snippet oder Class
- Ich kann erklären, wie Java-Code mit Compiler, Bytecode und JVM auf jedem Betriebssystem läuft. → Wie Java auf jedem Computer läuft
- Ich kann JDK und JRE unterscheiden. → Wie Java auf jedem Computer läuft
- Ich kann erklären, warum man ein C++-Programm für jedes Betriebssystem neu kompilieren muss, ein Java-Programm aber nicht. → Wie Java auf jedem Computer läuft
- Ich kann ein kurzes Java-Programm als Struktogramm nachbauen. → Übung: Java als Struktogramm
- Ich kann im Bereich Programmieren Java tippen und das entstehende Struktogramm lesen. → Java direkt schreiben
- Ich kann ein Programm mit ▶︎ ausführen und Ein- und Ausgaben in der Konsole nutzen. → Das Programm ausführen
- Ich kann Haltepunkte setzen und ein Programm im Einzelschritt verfolgen. → Fehler suchen mit dem Debugger
:::

## Wissenstest

::: quiz
? Wie sieht `output: "Hallo"` in Java aus?
→ Die Elemente in Java
- [ ] print("Hallo")
- [x] System.out.println("Hallo");
- [ ] console.log("Hallo");
> print ist Python, console.log ist JavaScript.

? Woher kommt der Klassenname bei Class?
→ Snippet oder Class
- [ ] Er heißt immer Main.
- [x] Aus dem Titel des Diagramms
- [ ] Aus dem ersten Kasten
> Ohne Titel heißt die Klasse Main.

? Welcher Java-Code gehört zu einer Do-while-Schleife?
→ Die Elemente in Java
- [ ] while (bedingung) { … }
- [x] do { … } while (bedingung);
- [ ] for (;;) { … }
> Bei do-while steht die Bedingung am Ende, deshalb läuft der Rumpf mindestens einmal.

? Was wird aus einem Aussprung im Java-Code?
→ Die Elemente in Java
- [x] break;
- [ ] return;
- [ ] exit();

? Was passiert an einem roten Punkt vor der Zeilennummer?
→ Fehler suchen mit dem Debugger
- [ ] Die Zeile wird übersprungen.
- [x] Das Programm hält vor dieser Zeile an.
- [ ] Die Zeile enthält einen Fehler.
> Das ist ein Haltepunkt. Danach geht es mit ▶︎ oder dem Einzelschritt weiter.

? Warum läuft dieselbe `.class`-Datei auf Windows, macOS und Linux?
→ Wie Java auf jedem Computer läuft
- [ ] Der Compiler erzeugt für jedes Betriebssystem eine eigene Datei.
- [x] Auf jedem Betriebssystem führt eine JVM denselben Bytecode aus.
- [ ] Java-Programme brauchen kein Betriebssystem.
> Der Bytecode bleibt gleich. Nur die JVM gibt es für jedes System extra.

? Was brauchst du, um Java-Programme zu schreiben und zu übersetzen?
→ Wie Java auf jedem Computer läuft
- [ ] nur die JRE
- [x] das JDK
- [ ] nur die JVM
> Die JRE reicht zum Ausführen. Den Compiler `javac` gibt es nur im JDK.

? Du willst dein Programm auf Windows und auf dem Mac nutzen. Was stimmt?
→ Wie Java auf jedem Computer läuft
- [ ] Java musst du für jedes System neu kompilieren, C++ nicht.
- [x] C++ musst du für jedes System neu kompilieren, Java nicht.
- [ ] Beide musst du nur einmal kompilieren.
> C++ wird direkt zu Maschinencode für ein System. Java wird zu Bytecode, und den führt auf jedem System die JVM aus.
:::
