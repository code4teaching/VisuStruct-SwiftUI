---
titel: Text einlesen und speichern
bereich: Dateien
kurz: Mit Scanner eine Textdatei Zeile für Zeile lesen und mit PrintWriter eine Datei speichern.
---

## Warum Dateien?

Alles, was in Variablen steht, ist weg, sobald das Programm endet. Soll sich ein Programm etwas merken, zum Beispiel einen Spielstand, eine Liste oder Noten, speichert es die Daten in einer **Datei**. Beim nächsten Start liest es die Datei wieder ein.

Zora ist frei, und Ludwig plant ein Fest. Seine Einkaufsliste liegt als Datei `einkauf.txt` bereit:

::: datei einkauf.txt
Heu
Äpfel
Karotten
Löwenzahn
:::

Eine Datei mit der Endung `.txt` enthält nur Text, Zeile für Zeile. Du kannst sie mit jedem Editor öffnen, zum Beispiel mit dem Editor von Windows oder TextEdit am Mac.

## Eine Datei lesen mit Scanner

Den `Scanner` kennst du schon: `new Scanner(System.in)` liest von der Tastatur. Gibst du ihm statt `System.in` eine Datei, liest er aus der Datei:

```java
import java.io.*;
import java.util.Scanner;

Scanner datei = new Scanner(new File("einkauf.txt"));
while (datei.hasNextLine()) {
    String zeile = datei.nextLine();
    System.out.println(zeile);
}
datei.close();
```

| Methode | Bedeutung |
|---|---|
| `new File("einkauf.txt")` | die Datei mit diesem Namen |
| `hasNextLine()` | Gibt es noch eine Zeile? `true` oder `false` |
| `nextLine()` | liefert die nächste Zeile und rückt eine Zeile weiter |
| `close()` | schließt die Datei, wenn du fertig bist |

Die Schleife läuft, solange es noch eine Zeile gibt. In jedem Durchlauf holt `nextLine()` die nächste Zeile. `File` steht im Paket `java.io`, deshalb brauchst du `import java.io.*;`.

::: diagramm dt-lesen.visustruct
So sieht das Lesen im Struktogramm aus. Probier es in der Simulation aus.
:::

::: ludwig
Stell dir den Scanner wie einen Finger vor, der auf eine Zeile zeigt. `nextLine()` liest die Zeile unter dem Finger und schiebt ihn eine Zeile weiter. Ist der Finger unter der letzten Zeile, liefert `hasNextLine()` `false`.
:::

## Was, wenn die Datei fehlt?

Gibt es die Datei nicht, kann Java sie nicht lesen und wirft eine `FileNotFoundException`. Java verlangt, dass dein Programm damit rechnet. Entweder du fängst sie mit try und catch auf, wie in Lektion 22:

```java
try {
    Scanner datei = new Scanner(new File("einkauf.txt"));
    // ... lesen ...
    datei.close();
} catch (FileNotFoundException e) {
    System.out.println("Die Datei einkauf.txt fehlt!");
}
```

Oder du schreibst hinter `main` den Zusatz `throws Exception`. Das heißt: „Diese Methode kann eine Exception werfen, ich kümmere mich nicht darum.“ Dann bricht das Programm ab, wenn die Datei fehlt.

```java
public static void main(String[] args) throws Exception {
```

> VisuStruct schreibt `throws Exception` automatisch hinter `main`, sobald dein Programm mit Dateien arbeitet. In der Simulation meldet VisuStruct eine fehlende Datei mit „Es gibt keine Datei …“.

## Übung: Einkaufsliste nummerieren

::: übung l23-java-nummern
titel: Einkaufsliste nummerieren
code: java
auftrag: Lies `einkauf.txt` Zeile für Zeile und gib jede Zeile mit ihrer Nummer aus: **1. Heu**, **2. Äpfel** und so weiter.
start: l23-java-nummern-start.visustruct
test: - -> 1. Heu | 2. Äpfel | 3. Karotten | 4. Löwenzahn
braucht: whileSchleife
tipp: Lege vor der Schleife `int nummer = 1;` an und erhöhe die Nummer am Ende jedes Durchlaufs.
tipp: Die Ausgabe ist `System.out.println(nummer + ". " + zeile);`
lösung: l23-java-nummern-loesung.visustruct
:::

## In eine Datei schreiben mit PrintWriter

Zum Schreiben gibt es den `PrintWriter`. Seine Methoden heißen wie bei `System.out`:

```java
PrintWriter aus = new PrintWriter("gruss.txt");
aus.println("Hallo Zora!");
aus.println("Bis morgen, Ludwig");
aus.close();
```

Danach steht in `gruss.txt`:

```
Hallo Zora!
Bis morgen, Ludwig
```

- `println` schreibt den Text und beginnt danach eine neue Zeile, `print` schreibt ohne neue Zeile.
- Gibt es die Datei schon, wird sie **überschrieben**. Der alte Inhalt ist dann weg.
- Nach dem Lauf zeigt VisuStruct unter der Ausgabe, was in der Datei gespeichert wurde.

::: ludwig
Vergiss `close()` nicht! Der PrintWriter sammelt den Text erst in einem Zwischenspeicher und schreibt ihn beim Schließen in die Datei. Ohne `close()` bleibt die Datei leer. Mir ist so schon eine ganze Geschichte verloren gegangen.
:::

## Übung: Einkaufsliste ergänzen

::: übung l23-java-ergaenzen
titel: Einkaufsliste ergänzen
code: java
auftrag: Ludwig braucht noch Kuchen. Lies `einkauf.txt` und schreibe jede Zeile in die neue Datei `einkauf-neu.txt`. Schreibe danach **Kuchen** als letzte Zeile dazu. Gib am Ende aus, wie viele Zeilen gespeichert wurden: **5 Zeilen gespeichert**.
start: l23-java-ergaenzen-start.visustruct
test: - -> 5 Zeilen gespeichert
datei: einkauf-neu.txt -> Heu | Äpfel | Karotten | Löwenzahn | Kuchen
braucht: whileSchleife
tipp: In der Schleife liest du eine Zeile mit `datei.nextLine()` und schreibst sie mit `aus.println(zeile)` gleich wieder hinaus.
tipp: Nach der Schleife kommt `aus.println("Kuchen");`. Schließe beide Dateien mit `close()`, sonst bleibt `einkauf-neu.txt` leer.
lösung: l23-java-ergaenzen-loesung.visustruct
:::

## Spiel: Was steht in der Datei?

::: spiel frage
titel: Spiel: Was steht in der Datei?
intro: Ludwig schreibt Dateien mit dem PrintWriter. Lies den Code und sag voraus, was danach in der Datei steht. Sechs Runden.
frage: Was steht danach in der Datei?

runde:
    PrintWriter aus = new PrintWriter("gruss.txt");
    aus.println("Hallo");
    aus.println("Zora");
    aus.close();
- [x] Hallo\nZora
- HalloZora
- Zora
> `println` beginnt nach jedem Text eine neue Zeile.

runde:
    PrintWriter aus = new PrintWriter("wort.txt");
    aus.print("Ha");
    aus.print("llo");
    aus.println("!");
    aus.close();
- Ha\nllo\n!
- [x] Hallo!
- Ha llo !
> `print` schreibt ohne neue Zeile weiter, die Teile hängen direkt aneinander.

runde:
    PrintWriter aus = new PrintWriter("geheim.txt");
    aus.println("Der Schatz liegt im Turm");
- Der Schatz liegt im Turm
- [x] Nichts, die Datei bleibt leer.
- Java meldet einen Fehler.
> Ohne `close()` landet der Text nie in der Datei. Er bleibt im Zwischenspeicher.

runde:
    // In notiz.txt steht vorher: Alt
    PrintWriter aus = new PrintWriter("notiz.txt");
    aus.println("Neu");
    aus.close();
- Alt\nNeu
- [x] Neu
- Neu\nAlt
> Ein neuer PrintWriter überschreibt die Datei. Der alte Inhalt ist weg.

runde:
    PrintWriter aus = new PrintWriter("zahlen.txt");
    for (int i = 1; i <= 3; i++) {
        aus.println(i * 2);
    }
    aus.close();
- 1\n2\n3
- 246
- [x] 2\n4\n6
> Die Schleife schreibt 2, 4 und 6, jede Zahl in eine eigene Zeile.

runde:
    // In einkauf.txt steht: Heu, Äpfel (je eine Zeile)
    Scanner datei = new Scanner(new File("einkauf.txt"));
    PrintWriter aus = new PrintWriter("gross.txt");
    while (datei.hasNextLine()) {
        aus.println(datei.nextLine().toUpperCase());
    }
    datei.close();
    aus.close();
- Heu\nÄpfel
- [x] HEU\nÄPFEL
- HEUÄPFEL
> Jede Zeile wird gelesen, in Großbuchstaben verwandelt und in eine eigene Zeile geschrieben.
:::

## Checkliste

::: checkliste
- Ich weiß, warum Programme Daten in Dateien speichern. → Warum Dateien?
- Ich kann eine Textdatei mit Scanner, hasNextLine und nextLine Zeile für Zeile lesen. → Eine Datei lesen mit Scanner
- Ich weiß, warum Java bei Dateien try und catch oder throws verlangt. → Was, wenn die Datei fehlt?
- Ich kann mit PrintWriter eine Datei schreiben und vergesse close() nicht. → In eine Datei schreiben mit PrintWriter
- Meine Einkaufsliste ist nummeriert und ergänzt. → Übung: Einkaufsliste ergänzen
:::

## Wissenstest

::: quiz
? Was liefert hasNextLine()?
- [ ] die nächste Zeile
- [x] true, wenn es noch eine Zeile gibt, sonst false
- [ ] die Anzahl der Zeilen
> Mit hasNextLine() prüft die Schleife, ob es weitergeht.

? Was passiert, wenn du new PrintWriter("liste.txt") für eine Datei aufrufst, die es schon gibt?
- [ ] Der neue Text wird hinten angehängt.
- [x] Die Datei wird überschrieben.
- [ ] Java meldet einen Fehler.

? Warum bleibt eine Datei leer, obwohl println aufgerufen wurde?
- [ ] Weil println nur in die Konsole schreibt.
- [x] Weil close() fehlt.
- [ ] Weil der Dateiname auf .txt endet.
> Erst close() schreibt den Zwischenspeicher in die Datei.

? Ordne jeder Methode ihre Aufgabe zu.
= nextLine() -> liest die nächste Zeile
= println(text) -> schreibt eine Zeile
= close() -> schließt die Datei
:::
