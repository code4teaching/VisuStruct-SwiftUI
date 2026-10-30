---
titel: Wenn das Programm abstürzt: try und catch
bereich: Fehler abfangen
kurz: Mit echtem Java Fehlermeldungen lesen und Abstürze mit try und catch abfangen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- echtes Java im Bereich Programmieren einschalten
- aus einer Fehlermeldung die Exception und die Zeile ablesen
- eine Exception mit try und catch auffangen
- Text mit Integer.parseInt in eine Zahl umwandeln und die NumberFormatException abfangen
- ein Programm schreiben, das sicher teilt, auch durch 0
:::

## Abgestürzt!

Dieses Programm soll drei Noten ausgeben. Tippe es im Bereich [Programmieren](#zeige-codelive) ab und klicke auf [▶︎ Ausführen](#zeige-ausfuehren):

```java
int[] noten = {2, 3, 1};
System.out.println("Erste Note: " + noten[0]);
System.out.println("Vierte Note: " + noten[3]);
System.out.println("Fertig!");
```

Die erste Note erscheint, dann ist Schluss. VisuStruct meldet „Ungültiger Ausdruck: noten[3]“, und „Fertig!“ kommt nie an. Das Array hat nur die Fächer 0, 1 und 2, ein Fach 3 gibt es nicht.

::: ludwig
Ist dir das auch schon passiert? Ein kleiner Fehler, und das ganze Programm ist weg. Mir ist das so oft passiert, dass ich vor dem Bildschirm geweint habe. Aber es gibt eine Lösung, und die heißt **try** und **catch**.
:::

::: angeberwissen
1947 fand das Team von Grace Hopper im Rechner Mark II an der Universität Harvard eine Motte, die einen Fehler verursacht hatte. Sie klebten sie ins Logbuch und schrieben dazu: „First actual case of bug being found“. Seitdem heißen Programmfehler **Bugs** (englisch für Käfer).
:::

## Echtes Java einschalten

Der Bereich Programmieren rechnet normalerweise mit derselben Simulation wie das Struktogramm. Die hält bei einem Fehler einfach an. Um zu sehen, was echtes Java macht, schaltest du echtes Java ein:

1. Klicke oben rechts auf das [Zahnrad](#zeige-einstellungen) und wähle als **Programmiersprache** Java.
2. Setze im Abschnitt Java den Haken bei **Echtes Java (mit Swing)**.

Beim ersten Ausführen lädt VisuStruct einmalig etwa 40 MB. Danach wird dein Code wie in einer richtigen Java-Entwicklungsumgebung übersetzt und ausgeführt.

> Mit echtem Java funktionieren Eingaben über die Konsole (`Scanner`) noch nicht. Unsere Beispiele kommen deshalb ohne Eingabe aus.

Schreib das Programm jetzt als ganze Klasse, damit die Zeilennummern stimmen, und führe es aus:

```java
public class Noten {
    public static void main(String[] args) {
        int[] noten = {2, 3, 1};
        System.out.println("Erste Note: " + noten[0]);
        System.out.println("Vierte Note: " + noten[3]);
        System.out.println("Fertig!");
    }
}
```

In der [Konsole](#zeige-konsole) steht jetzt:

```
Erste Note: 2
java.lang.ArrayIndexOutOfBoundsException: 3
	at Noten.main(Noten.java:5)
```

## Die Fehlermeldung lesen

So eine Meldung sieht erst einmal erschreckend aus. Sie verrät dir aber genau, was los ist:

| Teil | Bedeutung |
|---|---|
| `ArrayIndexOutOfBoundsException` | Die Art des Fehlers: Der Index liegt außerhalb des Arrays. |
| `3` | Der falsche Index. |
| `Noten.java:5` | Die Zeile, in der es passiert ist: Zeile 5. |

So einen Fehler zur Laufzeit nennt Java eine **Exception** (englisch für Ausnahme). Man sagt: Java *wirft* eine Exception. Fängt sie niemand auf, bricht das Programm ab. Deshalb erscheint „Fertig!“ nicht.

::: ludwig
Lies Fehlermeldungen immer von oben: Erst der Name der Exception, dann die Zeilennummer. Die Zeilennummern stehen im Bereich Programmieren links neben dem Code.
:::

## try und catch

Mit **try** und **catch** fängst du die Exception auf. Ändere die Zeile mit `noten[3]` so:

```java
try {
    System.out.println("Vierte Note: " + noten[3]);
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Diese Note gibt es nicht.");
}
System.out.println("Fertig!");
```

- `try` heißt „versuche“. Java führt den Block in den geschweiften Klammern ganz normal aus.
- Wirft eine Zeile darin eine Exception, springt Java sofort in den `catch`-Block. Der Rest des `try`-Blocks wird übersprungen.
- In der Klammer hinter `catch` steht, welche Exception aufgefangen wird, und ein Name dafür, meistens `e`.
- Danach geht das Programm normal weiter. Jetzt erscheint auch „Fertig!“.

Läuft im `try`-Block alles gut, wird der `catch`-Block einfach übersprungen.

::: ludwig
try und catch sind wie das Netz unter dem Trapez im Zirkus: Solange alles klappt, merkst du nichts davon. Fällt jemand, fängt das Netz ihn auf, und die Vorstellung geht weiter.
:::

> Im Struktogramm gibt es keinen Kasten für try und catch. VisuStruct zeigt den ganzen Block deshalb als eine Anweisung. Ausführen kannst du ihn nur mit echtem Java.

## Text in eine Zahl umwandeln

Oft steht eine Zahl zuerst als Text da, zum Beispiel später in einem Textfeld im Fenster. `Integer.parseInt` wandelt Text in eine ganze Zahl um:

```java
String eingabe = "zwölf";
try {
    int zahl = Integer.parseInt(eingabe);
    System.out.println("Doppelt: " + zahl * 2);
} catch (NumberFormatException e) {
    System.out.println("Das ist keine Zahl: " + eingabe);
}
```

„zwölf“ kann Java nicht umwandeln und wirft eine `NumberFormatException`. Das Programm gibt „Das ist keine Zahl: zwölf“ aus. Ändere die erste Zeile in `String eingabe = "12";` und führe es noch einmal aus: Jetzt erscheint „Doppelt: 24“.

## Profiwissen: Exceptions sind Objekte

Das steht nicht im Lehrplan, ist aber praktisch zu wissen.

::: angeberwissen
Jede Exception ist ein Objekt einer eigenen Klasse, zum Beispiel `ArithmeticException` für das Teilen durch 0. `e.getMessage()` liefert ihre Meldung, etwa `/ by zero`.

Hinter einem `try` dürfen mehrere `catch`-Blöcke stehen, für jede Art von Fehler einer. `catch (Exception e)` fängt alle Exceptions auf, verrät dir dann aber weniger darüber, was passiert ist. Und ein Block `finally { … }` am Ende läuft immer, egal ob es einen Fehler gab oder nicht.
:::

## Spiel: Fängt das Netz?

::: spiel frage
titel: Spiel: Fängt das Netz?
intro: Ludwig turnt am Trapez. Fängt try und catch ihn auf, oder stürzt das Programm ab? Sieben Runden.

runde:
    int[] noten = {2, 3, 1};
    System.out.println(noten[3]);
    System.out.println("Fertig!");
frage: Was passiert mit echtem Java?
- Es erscheint 1 und Fertig!
- Es erscheint nur Fertig!
- [x] Das Programm stürzt mit einer ArrayIndexOutOfBoundsException ab.
> Ein Fach 3 gibt es nicht. Niemand fängt die Exception auf, also kommt Fertig! nie an.

runde:
    int[] noten = {2, 3, 1};
    try {
        System.out.println(noten[3]);
    } catch (ArrayIndexOutOfBoundsException e) {
        System.out.println("Diese Note gibt es nicht.");
    }
    System.out.println("Fertig!");
frage: Was wird ausgegeben?
- Fertig!
- [x] Diese Note gibt es nicht.\nFertig!
- Diese Note gibt es nicht.
> Der catch-Block fängt die Exception auf, danach geht das Programm normal weiter.

runde:
    try {
        System.out.println("A");
        System.out.println(10 / 0);
        System.out.println("B");
    } catch (ArithmeticException e) {
        System.out.println("C");
    }
frage: Was wird ausgegeben?
- A\nB\nC
- [x] A\nC
- C
> Bei 10 / 0 springt Java sofort in den catch-Block. Der Rest des try-Blocks, also B, wird übersprungen.

runde:
    String eingabe = "12";
    try {
        int zahl = Integer.parseInt(eingabe);
        System.out.println("Doppelt: " + zahl * 2);
    } catch (NumberFormatException e) {
        System.out.println("Das ist keine Zahl: " + eingabe);
    }
frage: Was wird ausgegeben?
- [x] Doppelt: 24
- Das ist keine Zahl: 12
- Doppelt: 1212
> „12“ lässt sich umwandeln. Läuft im try-Block alles gut, wird catch übersprungen.

runde:
frage: Welche Exception wirft `Integer.parseInt("2.5")`?
- ArithmeticException
- [x] NumberFormatException
- keine, das Ergebnis ist 2
> parseInt wandelt nur ganze Zahlen um. Mit Komma oder Punkt ist es kein gültiges Format.

runde:
frage: Welche Exception wirft `12 / 0` mit `int`?
- [x] ArithmeticException
- NumberFormatException
- ArrayIndexOutOfBoundsException
> Durch 0 teilen geht mit ganzen Zahlen nicht. Die Meldung lautet `/ by zero`.

runde:
    try {
        int stuecke = 12 / 0;
    } catch (NumberFormatException e) {
        System.out.println("Fehler!");
    }
    System.out.println("Fertig!");
frage: Was passiert?
- Es erscheint Fehler! und Fertig!
- Es erscheint nur Fertig!
- [x] Das Programm stürzt ab.
> catch fängt nur die Exception, die in der Klammer steht. Eine ArithmeticException fällt durch das Netz.
:::

## Aufgabe: Sicher teilen

Dieses Programm stürzt ab:

```java
int kuchen = 12;
int personen = 0;
System.out.println("Jeder bekommt " + kuchen / personen + " Stücke.");
System.out.println("Guten Appetit!");
```

1. Führe es mit echtem Java aus und lies die Fehlermeldung. Welche Exception ist es?
2. Fange sie mit try und catch ab. Statt des Absturzes soll „Ohne Personen kann man nicht teilen.“ erscheinen, und „Guten Appetit!“ soll trotzdem kommen.
3. Setze `personen` auf 4 und prüfe, dass dann „Jeder bekommt 3 Stücke.“ erscheint.

::: ludwig
Die Exception heißt `ArithmeticException`. Schreib in den `try`-Block nur die Zeile, die abstürzen kann.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann echtes Java im Bereich Programmieren einschalten. → Echtes Java einschalten
- Ich kann aus einer Fehlermeldung die Exception und die Zeile ablesen. → Die Fehlermeldung lesen
- Ich kann eine Exception mit try und catch auffangen. → try und catch
- Ich kann Text mit Integer.parseInt in eine Zahl umwandeln und die NumberFormatException abfangen. → Text in eine Zahl umwandeln
- Ich kann ein Programm schreiben, das sicher teilt, auch durch 0. → Aufgabe: Sicher teilen
:::

## Wissenstest

::: quiz
? Was passiert, wenn eine Exception nicht aufgefangen wird?
→ Die Fehlermeldung lesen
- [ ] Java überspringt die Zeile und macht weiter.
- [x] Das Programm bricht ab.
- [ ] Der Computer startet neu.
> Deshalb erscheint im ersten Beispiel „Fertig!“ nicht.

? Was passiert im try-Block nach der Zeile, die eine Exception wirft?
→ try und catch
- [ ] Die restlichen Zeilen laufen trotzdem.
- [x] Der Rest wird übersprungen, Java springt in den catch-Block.
- [ ] Java beginnt den try-Block von vorne.

? Welche Exception wirft Integer.parseInt("zwölf")?
→ Text in eine Zahl umwandeln
- [ ] ArithmeticException
- [ ] ArrayIndexOutOfBoundsException
- [x] NumberFormatException
> „zwölf“ hat kein Zahlenformat, das Java versteht.

? Ordne jeder Exception ihre Ursache zu.
→ Die Fehlermeldung lesen
= ArrayIndexOutOfBoundsException -> Index außerhalb des Arrays
= ArithmeticException -> Teilen durch 0
= NumberFormatException -> Text ist keine Zahl
:::
