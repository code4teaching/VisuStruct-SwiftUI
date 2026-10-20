---
titel: Java
bereich: Vom Struktogramm zum Code
kurz: Java-Code aus dem Struktogramm erzeugen, lesen und umgekehrt Java-Code als Struktogramm nachbauen.
---

## Die Code-Ansicht

Ein Struktogramm beschreibt einen Ablauf. Damit ein Computer ihn ausführt, brauchst du ein Programm in einer Programmiersprache. VisuStruct schreibt diesen Code für dich.

Klicke in der Leiste auf **{ } Code**. Rechts erscheint der **Code-Generator**:

- Oben wählst du die Sprache: **Java**, **Python** oder **JavaScript**.
- Bei Java wählst du zusätzlich **Snippet** (nur die Anweisungen) oder **Class** (eine vollständige Java-Datei).
- **Diagramm-Text als Kommentare** schreibt den Text jedes Kastens als Kommentar über den Code.
- **Kopieren** legt den Code in die Zwischenablage, **Java speichern …** speichert eine `.java`-Datei.

Der Code ändert sich sofort mit, wenn du am Struktogramm etwas änderst.

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

- **Anweisung:** `int summe = 0` wird zu `int summe = 0;`
- **Ausgabe:** `output: summe` wird zu `System.out.println(summe);`
- **Eingabe:** `input: int zahl "Zahl?"` wird zu zwei Zeilen: `System.out.println("Zahl?");` und `int zahl = scanner.nextInt();`. Für den `Scanner` steht oben einmal `Scanner scanner = new Scanner(System.in);`.
- **Verzweigung:** `if (bedingung) { … } else { … }`
- **Fallauswahl:** `switch (wert) { case 1 -> { … } default -> { … } }`
- **While-Schleife:** `while (bedingung) { … }`
- **Do-while-Schleife:** `do { … } while (bedingung);`
- **For-Schleife:** `for (int i = 0; i < 5; i++) { … }`, die drei Felder stehen mit Semikolon nacheinander in der Klammer.
- **Endlosschleife:** `while (true) { … }`
- **Aussprung:** `break;`
- **Aufruf:** `berechne();`

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
    }
}
```

Der Name der Klasse kommt aus dem **Titel** des Diagramms. Die Datei muss genauso heißen, hier also `Einmaleins.java`. Das erledigt **Java speichern …** für dich.

> Der erzeugte Code ist ein guter Anfang, aber prüfe ihn. Legst du eine Variable zuerst an und liest sie später mit einer Eingabe neu ein, schreibt VisuStruct trotzdem `int pin = scanner.nextInt();`. Java meldet dann, dass es `pin` schon gibt. Lösche in dieser Zeile einfach das `int`.

## Der Java-Sprachmodus

In der Leiste kannst du die Sprache der Oberfläche umstellen. Neben Deutsch, Englisch und vielen weiteren gibt es **Java (Keywords)**. Dann heißen die Elemente in der Palette so wie die Befehle in Java: `if`, `switch`, `for`, `while`, `do`, `while(true)`, `break` und `call`. Die Oberfläche ist dann auf Englisch.

Das hilft dir, die Kästen und die Java-Befehle einander zuzuordnen. Dein Diagramm selbst bleibt dabei unverändert.

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

Im Struktogramm gibt es kein `else if`. Dort steckt eine zweite Verzweigung im Nein-Zweig der ersten.

::: übung l17-ticket
titel: Ticketpreis
auftrag: Frage nach dem Alter als ganze Zahl und baue den Java-Code oben als Struktogramm nach.
test: 5 -> Eintritt frei
test: 6 -> Kinderticket: 4 Euro
test: 17 -> Kinderticket: 4 Euro
test: 18 -> Erwachsenenticket: 8 Euro
braucht: verzweigung
tipp: Ziehe in den false-Zweig der ersten Verzweigung eine zweite Verzweigung mit der Bedingung `alter < 18`.
lösung: l17-ticket-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann die Code-Ansicht öffnen und Java als Sprache wählen. → Die Code-Ansicht
- Ich weiß, wie Ausgabe, Eingabe, Verzweigung und Schleifen in Java aussehen. → Die Elemente in Java
- Ich kenne den Unterschied zwischen Snippet und Class. → Snippet oder Class
- Ich kann ein kurzes Java-Programm als Struktogramm nachbauen. → Übung: Java als Struktogramm
:::

## Wissenstest

::: quiz
? Wie sieht `output: "Hallo"` in Java aus?
- [ ] print("Hallo")
- [x] System.out.println("Hallo");
- [ ] console.log("Hallo");
> print ist Python, console.log ist JavaScript.

? Woher kommt der Klassenname bei Class?
- [ ] Er heißt immer Main.
- [x] Aus dem Titel des Diagramms
- [ ] Aus dem ersten Kasten
> Ohne Titel heißt die Klasse Main.

? Welcher Java-Code gehört zu einer Do-while-Schleife?
- [ ] while (bedingung) { … }
- [x] do { … } while (bedingung);
- [ ] for (;;) { … }
> Bei do-while steht die Bedingung am Ende, deshalb läuft der Rumpf mindestens einmal.

? Was wird aus einem Aussprung im Java-Code?
- [x] break;
- [ ] return;
- [ ] exit();
:::
