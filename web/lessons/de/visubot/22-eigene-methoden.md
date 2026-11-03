---
titel: Eigene Methoden
bereich: Motoren und Methoden
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
Stimmen die 20,4 cm bei **deinem** mBot2 wirklich? Profis glauben keiner Zahl, die sie nicht nachgemessen haben. Miss den Raddurchmesser und lass `mbot.forward(5, "Umdrehungen")` fahren: Soll sind 102,1 cm. So testet man Softwaresysteme: Jeder **Testfall** hat ein erwartetes Ergebnis (**Soll**) und ein gemessenes (**Ist**). Man testet mehrmals und schreibt alles in ein **Protokoll**. Hier ist dein [Messprotokoll zum Ausdrucken (PDF)](https://visubot.visucode.de/messprotokoll-radumdrehung.pdf). Gib es deiner Lehrkraft, dann sieht sie, ob alle Roboter gleich weit fahren.
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

::: übung vb-java-rechteck-umdrehungen
titel: Rechteck mit Umdrehungen
code: java
auftrag: Schreibe in Java: Der mBot2 fährt ein Rechteck. Die langen Seiten sind **zwei** Radumdrehungen lang, die kurzen **eine**. Benutze `mbot.forward(2, "Umdrehungen")` und `mbot.forward(1, "Umdrehungen")`.
fahrt: 2 x (forward 40.84, turnRight, forward 20.42, turnRight)
braucht: forSchleife
tipp: Eine For-Schleife, die zweimal läuft: `for (int i = 0; i < 2; i++) { … }`.
tipp: In der Schleife: `mbot.forward(2, "Umdrehungen");`, `mbot.turnRight();`, `mbot.forward(1, "Umdrehungen");`, `mbot.turnRight();`
lösung: vb-java-rechteck-umdrehungen-loesung.visustruct
:::

::: quiz
? Welche Methode ruft `mbot.forward(3, "Umdrehungen")` auf?
→ Gleicher Name, andere Parameter: Überladung
- [ ] `forward()`
- [ ] `forward(int cm)`
- [x] `forward(int wert, String einheit)`
> Java wählt die Variante, deren Parameter passen: zwei Parameter, eine Zahl und ein Text.
:::

## Methode mit Rückgabe

Eine Methode kann auch etwas **ausrechnen** und das Ergebnis zurückgeben. Statt `void` steht dann der Datentyp des Ergebnisses in der Kopfzeile, und `return` gibt den Wert zurück:

```java
static int zentimeter(int umdrehungen) {
  return umdrehungen * 20;
}
```

Eine Radumdrehung sind rund 20 cm. Der Aufruf `int strecke = zentimeter(3);` legt also 60 in `strecke`.

::: übung vb-zentimeter
titel: Umdrehungen in Zentimeter
auftrag: Baue ein Unterprogramm `int zentimeter(int umdrehungen)`, das `umdrehungen * 20` zurückgibt. Das Hauptprogramm ruft es mit 3 auf, fährt die Strecke und zeigt **Strecke: 60 cm** auf dem Bildschirm.
fahrt: forward 60
befehle: showText "Strecke: 60 cm"
braucht: aufruf
tipp: Neuer Reiter mit dem Titel `int zentimeter(int umdrehungen)`. Darin reicht eine Anweisung: `return umdrehungen * 20`.
tipp: Im Hauptprogramm: Aufruf `int strecke = zentimeter(3)`, danach `mbot.forward(strecke)` und `mbot.showText("Strecke: " + strecke + " cm")`.
lösung: vb-zentimeter-loesung.visustruct
unterprogramm: vb-zentimeter-unterprogramm-loesung.visustruct
:::

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektion [„Aufruf und Aussprung“](?visustruct&lektion=18-aufruf-und-aussprung). Sie öffnet sich in einem neuen Fenster.

::: übung vb-fehler-22-eigene-methoden
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Rechteck mit Umdrehungen“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-22-eigene-methoden-start.visustruct
fahrt: 2 x (forward 40.84, turnRight, forward 20.42, turnRight)
tipp: Ein Text gehört in Anführungszeichen. Ohne sie sucht Java eine Variable mit diesem Namen.
tipp: Richtig heißt es `mbot.forward(1, "Umdrehungen")`.
lösung: vb-java-rechteck-umdrehungen-loesung.visustruct
:::

## Spiel: Welche Methode?

::: spiel frage
titel: Spiel: Welche Methode?
intro: Gleicher Name, andere Parameter: Welche Methode ruft Java auf, und was kommt heraus? Sechs Runden.

runde:
    mbot.forward(30, "cm");
frage: Welche `forward`-Methode läuft?
- `forward()`
- `forward(int cm)`
- [x] `forward(int wert, String einheit)`
> Zwei Parameter, eine Zahl und ein Text: Das passt nur zur dritten.

runde:
    mbot.forward();
frage: Wie weit fährt der mBot2?
- [x] 10 cm
- gar nicht, die Zahl fehlt
- eine Radumdrehung
> Ohne Parameter fährt `forward` 10 cm. Das ist die Variante ohne Parameter.

runde:
    mbot.forward(2, "Umdrehungen");
frage: Wie weit fährt der mBot2 ungefähr?
- 2 cm
- 20 cm
- [x] 41 cm
> Eine Radumdrehung sind etwa 20,4 cm, zwei also etwa 40,8 cm.

runde:
    static int zentimeter(int umdrehungen) {
        return umdrehungen * 20;
    }
frage: Was liefert `zentimeter(4)`?
- 4
- 24
- [x] 80
> Der Parameter `umdrehungen` ist 4, und `return` gibt 4 · 20 zurück.

runde:
    public static void main(String[] args) {
        quadrat(30);
        quadrat(50);
    }
frage: Wie viele Quadrate fährt der mBot2, und wie groß ist das zweite?
- eins mit 80 cm
- [x] zwei, das zweite mit 50 cm Seitenlänge
- zwei, beide mit 30 cm Seitenlänge
> Jeder Aufruf fährt ein Quadrat. Der Wert in den Klammern wird zu `seite`.

runde:
frage: Welche Kopfzeile passt zu einer Methode, die eine Zahl zurückgibt?
- `void zentimeter(int umdrehungen)`
- [x] `int zentimeter(int umdrehungen)`
- `zentimeter(int umdrehungen)`
> Vor dem Namen steht der Datentyp des Ergebnisses. `void` heißt: kein Ergebnis.
:::

## Spiel: Bombe entschärfen

::: spiel bombe
titel: Spiel: Bombe entschärfen
intro: In jedem Programm steckt **genau ein Fehler**, und die Bombe tickt. Tippe auf die falsche Zeile, bevor die Zeit abläuft. Vier Runden, je 30 Sekunden.
zeit: 30

runde:
    static void quadrat(int seite) {
        for (int i = 0; i < 4; i++) {
            mbot.forward(30);
            mbot.turnRight();
        }
    }
frage: Soll ein Quadrat mit der Seitenlänge `seite` fahren.
fehler: 3
besser: mbot.forward(seite);
> Mit `30` ist jedes Quadrat gleich groß, egal was man übergibt.

runde:
    static void zentimeter(int umdrehungen) {
        return umdrehungen * 20;
    }
frage: Soll die Strecke in cm zurückgeben.
fehler: 1
besser: static int zentimeter(int umdrehungen) {
> Wer etwas zurückgibt, braucht den Datentyp des Ergebnisses statt `void`.

runde:
    static int zentimeter(int umdrehungen) {
        int cm = umdrehungen * 20;
    }
frage: Soll die Strecke in cm zurückgeben.
fehler: 2
besser: return umdrehungen * 20;
> Die Methode rechnet, gibt aber nichts zurück. Es fehlt `return`.

runde:
    mbot.forward(2, Umdrehungen);
frage: Soll zwei Radumdrehungen weit fahren.
fehler: 1
besser: mbot.forward(2, "Umdrehungen");
> Die Einheit ist ein Text und braucht Anführungszeichen.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann ein Unterprogramm mit Parameter bauen und aufrufen. → Ein Unterprogramm für das Quadrat
- Ich kann Methoden in Java erkennen. → Methoden in Java
- Ich kann eine überladene Methode erkennen und aufrufen. → Gleicher Name, andere Parameter: Überladung
- Ich kann eine Methode mit Rückgabewert schreiben. → Methode mit Rückgabe
:::
