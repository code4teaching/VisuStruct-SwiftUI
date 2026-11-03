---
titel: Eigene Methoden
bereich: VisuBot
kurz: Eigene Befehle mit Parametern und Rückgabewert schreiben und aufrufen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- ein Unterprogramm mit Parameter bauen und aufrufen
- Methoden in Java erkennen
- eine überladene Methode erkennen und aufrufen
- eine Methode mit Rückgabewert schreiben
:::

## Ein Unterprogramm für das Quadrat

Ein Quadrat fahren kann der mBot2 schon. Jetzt soll er zwei verschieden große Quadrate fahren. Statt die Schleife zweimal zu bauen, schreibst du ein **Unterprogramm**. In Java heißt es **Methode**. Es ist ein eigener Befehl, den du so oft aufrufen kannst, wie du willst.

Die Kopfzeile `void quadrat(int seite)` sagt:

- `void`: Die Methode liefert kein Ergebnis zurück, sie **tut** nur etwas.
- `quadrat`: So heißt dein neuer Befehl.
- `int seite`: Beim Aufruf gibst du eine Zahl mit, den **Parameter**.

::: übung vb-quadrat-methode
titel: Zwei Quadrate
auftrag: Baue ein Unterprogramm `void quadrat(int seite)`, das ein Quadrat mit der Seitenlänge `seite` fährt. Das Hauptprogramm ruft es zweimal auf: erst mit 30, dann mit 50.
fahrt: 4 x (forward 30, turnRight), 4 x (forward 50, turnRight)
braucht: aufruf
tipp: Lege mit **+** einen neuen Reiter an und gib ihm den Titel `void quadrat(int seite)`. Darin steht eine For-Schleife, die viermal `mbot.forward(seite)` und `mbot.turnRight()` ausführt.
tipp: Im Hauptprogramm stehen zwei Aufruf-Kästen: `quadrat(30)` und `quadrat(50)`.
lösung: vb-quadrat-methode-loesung.visustruct
unterprogramm: vb-quadrat-unterprogramm-loesung.visustruct
:::

## Methoden in Java

In Java steht jede Methode in einer Klasse. Das Programm beginnt immer in der Methode `main`. Von dort wird `quadrat` aufgerufen:

```java
public class Quadrate {
  public static void main(String[] args) {
    quadrat(30);
    quadrat(50);
  }

  static void quadrat(int seite) {
    for (int i = 0; i < 4; i++) {
      mbot.forward(seite);
      mbot.turnRight();
    }
  }
}
```

Im Bereich [Code](#zeige-codelive) siehst du jede Methode in ihrem eigenen Reiter, so wie im Struktogramm.

::: quiz
? Was bedeutet `void` in `void quadrat(int seite)`?
→ Methoden in Java
- [ ] Die Methode hat keinen Parameter.
- [x] Die Methode liefert kein Ergebnis zurück.
- [ ] Die Methode darf nur einmal aufgerufen werden.
> `void` heißt „leer“: Es kommt kein Wert zurück. Der Parameter steht in den Klammern.
? Mit welchem Wert für `seite` läuft `quadrat(50)`?
→ Ein Unterprogramm für das Quadrat
- [ ] 30
- [x] 50
- [ ] mit keinem
> Der Wert in den Klammern des Aufrufs wird zum Parameter `seite`.
:::

## Gleicher Name, andere Parameter: Überladung

Du kennst `mbot.forward()` und `mbot.forward(30)`. Das sind **zwei verschiedene Methoden mit demselben Namen**. Java erkennt am Aufruf, welche gemeint ist: an der **Anzahl** und am **Typ** der Parameter. Das nennt man **Überladung** (englisch *overloading*).

Es gibt noch eine dritte `forward`-Methode. Sie hat zwei Parameter: eine Zahl und eine **Einheit** als Text.

```java
mbot.forward();                   // 10 cm (Standardwert)
mbot.forward(30);                 // 30 cm
mbot.forward(30, "cm");           // 30 cm, Einheit ausdrücklich
mbot.forward(2, "Umdrehungen");   // die Räder drehen sich zweimal
```

Eine Radumdrehung ist so weit wie der Umfang des Rads: π · 6,5 cm ≈ 20,4 cm. Zwei Umdrehungen sind also etwa 40,8 cm. Für `mbot.backward` gibt es dieselben drei Varianten.

So sehen die drei Kopfzeilen aus. Der Methodenname ist gleich, die Parameterlisten sind verschieden:

```java
void forward()
void forward(int cm)
void forward(int wert, String einheit)
```

Überladung kennst du schon: `System.out.println` gibt es für `int`, für `double`, für `String` und noch mehr. Deshalb kannst du jeden dieser Werte einfach in die Klammern schreiben.

::: angeberwissen
Stimmen die 20,4 cm bei **deinem** mBot2 wirklich? Profis glauben keiner Zahl, die sie nicht nachgemessen haben. Miss den Raddurchmesser und lass `mbot.forward(5, "Umdrehungen")` fahren: Soll sind 102,1 cm. So testet man Softwaresysteme: Jeder **Testfall** hat ein erwartetes Ergebnis (**Soll**) und ein gemessenes (**Ist**). Man testet mehrmals und schreibt alles in ein **Protokoll**. Hier ist dein [Messprotokoll zum Ausdrucken (PDF)](https://visustruct.org/visubot/messprotokoll-radumdrehung.pdf). Gib es deiner Lehrkraft, dann sieht sie, ob alle Roboter gleich weit fahren.
:::

::: übung vb-ueberladung-umdrehung
titel: Quadrat mit Umdrehungen
auftrag: Fahre ein Quadrat, bei dem jede Seite genau **eine Radumdrehung** lang ist. Nimm dafür die überladene Methode `mbot.forward(1, "Umdrehungen")`.
fahrt: 4 x (forward 20.42, turnRight)
braucht: forSchleife
tipp: Eine For-Schleife mit `int i = 0`, `i < 4`, `i++`.
tipp: Im Inhalt stehen `mbot.forward(1, "Umdrehungen")` und `mbot.turnRight()`.
lösung: vb-ueberladung-umdrehung-loesung.visustruct
:::

::: quiz
? Welche Methode ruft `mbot.forward(3, "Umdrehungen")` auf?
→ Gleicher Name, andere Parameter: Überladung
- [ ] `forward()`
- [ ] `forward(int cm)`
- [x] `forward(int wert, String einheit)`
> Java wählt die Variante, deren Parameter passen: zwei Parameter, eine Zahl und ein Text.
:::

## Jetzt ohne Roboter: Methode mit Rückgabe

Eine Methode kann auch etwas **ausrechnen** und das Ergebnis zurückgeben. Statt `void` steht dann der Datentyp des Ergebnisses in der Kopfzeile, und `return` gibt den Wert zurück:

```java
static int doppelt(int x) {
  return 2 * x;
}
```

Der Aufruf `int d = doppelt(4);` legt dann 8 in `d`.

::: übung vb-ohne-quadratzahl
titel: Quadratzahlen
auftrag: Baue ein Unterprogramm `int quadratzahl(int x)`, das `x * x` zurückgibt. Das Hauptprogramm ruft es mit 3 und mit 5 auf und gibt beide Ergebnisse aus: erst **9**, dann **25**. Ganz ohne `mbot`!
test: - -> 9 | 25
braucht: aufruf
tipp: Neuer Reiter mit dem Titel `int quadratzahl(int x)`. Darin reicht eine Anweisung: `return x * x`.
tipp: Im Hauptprogramm: Aufruf `int a = quadratzahl(3)`, Aufruf `int b = quadratzahl(5)`, danach die Ausgaben `a` und `b`.
lösung: vb-ohne-quadratzahl-loesung.visustruct
unterprogramm: vb-ohne-quadratzahl-unterprogramm-loesung.visustruct
:::

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann ein Unterprogramm mit Parameter bauen und aufrufen. → Ein Unterprogramm für das Quadrat
- Ich kann Methoden in Java erkennen. → Methoden in Java
- Ich kann eine überladene Methode erkennen und aufrufen. → Gleicher Name, andere Parameter: Überladung
- Ich kann eine Methode mit Rückgabewert schreiben. → Jetzt ohne Roboter: Methode mit Rückgabe
:::
