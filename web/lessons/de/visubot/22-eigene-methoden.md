---
titel: Eigene Methoden
bereich: VisuBot
kurz: Eigene Befehle mit Parametern und Rückgabewert schreiben und aufrufen.
---

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

Im Bereich [Programmieren](#zeige-codelive) siehst du jede Methode in ihrem eigenen Reiter, so wie im Struktogramm.

::: quiz
? Was bedeutet `void` in `void quadrat(int seite)`?
- [ ] Die Methode hat keinen Parameter.
- [x] Die Methode liefert kein Ergebnis zurück.
- [ ] Die Methode darf nur einmal aufgerufen werden.
> `void` heißt „leer“: Es kommt kein Wert zurück. Der Parameter steht in den Klammern.
? Mit welchem Wert für `seite` läuft `quadrat(50)`?
- [ ] 30
- [x] 50
- [ ] mit keinem
> Der Wert in den Klammern des Aufrufs wird zum Parameter `seite`.
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

::: checkliste
- Ich kann ein Unterprogramm mit Parameter bauen und aufrufen. → Ein Unterprogramm für das Quadrat
- Ich weiß, wie Methoden in Java aussehen. → Methoden in Java
- Ich kann eine Methode mit Rückgabewert schreiben. → Jetzt ohne Roboter: Methode mit Rückgabe
:::
