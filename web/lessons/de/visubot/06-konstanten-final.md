---
titel: Feste Werte mit final
bereich: Sensoren und Entscheidungen
kurz: Eine Konstante anlegen, damit eine wichtige Zahl nur an einer Stelle steht.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, was eine Konstante ist
- eine Konstante im Struktogramm und in Java anlegen
- eine Konstante in einer Bedingung und in einem Befehl benutzen
:::

## Eine Zahl an vielen Stellen

Ludwig hat ein Programm für den Flur geschrieben: Der mBot2 fährt bis 20 cm vor die Wand, dreht sich um und fährt bis 20 cm vor die andere Wand.

::: diagramm vb-l06k-ohne.visustruct
Hin und zurück. Die Zahl 20 steht an zwei Stellen.
:::

Jetzt soll der mBot2 schon bei 30 cm anhalten. Ludwig muss jede 20 suchen und ändern. Vergisst er eine, hält der mBot2 einmal bei 30 und einmal bei 20 cm. In langen Programmen passiert so etwas schnell.

::: angeberwissen
Profis nennen eine Zahl, die einfach so im Programm steht, eine **magische Zahl**. Magisch, weil niemand mehr weiß, was sie bedeutet. Ich mag nur magische Grashalme.
:::

## Eine Konstante anlegen

Besser ist eine **Konstante**. Das ist eine Variable, deren Wert nach dem Festlegen gleich bleibt. Du legst sie einmal ganz oben an und benutzt danach nur noch ihren Namen.

| | Struktogramm | Java |
|---|---|---|
| anlegen | `const int ABSTAND = 20` | `final int ABSTAND = 20;` |
| benutzen | `mbot.getDistance() > ABSTAND` | `mbot.getDistance() > ABSTAND` |

Im Struktogramm schreibst du `const` davor, in Java `final`. Beides heißt: Dieser Wert ändert sich nicht mehr. Namen von Konstanten schreibt man in **Großbuchstaben**, dann erkennt man sie sofort.

::: diagramm vb-l06k-mit.visustruct
Dasselbe Programm mit der Konstanten ABSTAND. Für 30 cm änderst du nur die erste Zeile.
:::

::: übung vb-konstante-wand
titel: Wand mit Konstante
auftrag: Lege die Konstante `ABSTAND` mit dem Wert 20 an. Der mBot2 fährt vor, solange der Abstand größer als `ABSTAND` ist. Danach spielt er einen Ton. Es gibt drei Welten.
welt: wand-kurz -> tone
welt: wand-mittel -> tone
welt: wand-lang -> tone
braucht: whileSchleife
tipp: Der erste Kasten ist eine Anweisung mit `const int ABSTAND = 20`. Darunter kommt eine While-Schleife.
tipp: Die Bedingung der Schleife ist `mbot.getDistance() > ABSTAND`. In der Schleife steht **fahre vor**, nach der Schleife **spiele Ton**.
lösung: vb-konstante-wand-loesung.visustruct
:::

## Jetzt in Java: Quadrat mit Konstante

Eine Konstante passt auch in einen Befehl. Mit `final int SEITE = 30;` fährt `mbot.forward(SEITE);` genau 30 cm. Soll das Quadrat größer werden, änderst du nur die eine Zeile.

::: übung vb-java-konstante-seite
titel: Quadrat mit Konstante
code: java
auftrag: Schreibe in Java: Lege die Konstante `SEITE` mit dem Wert 30 an. Fahre dann mit einer For-Schleife ein Quadrat mit der Seitenlänge `SEITE`.
fahrt: 4 x (forward 30, turnRight)
braucht: forSchleife
tipp: Die erste Zeile ist `final int SEITE = 30;`. Danach kommt `for (int i = 0; i < 4; i++) { … }`.
tipp: In der Schleife stehen `mbot.forward(SEITE);` und `mbot.turnRight();`.
lösung: vb-java-konstante-seite-loesung.visustruct
:::

::: übung vb-fehler-06-konstanten-final
titel: Warum läuft das nicht?
code: java
auftrag: Ludwig hat „Quadrat mit Konstante“ abgetippt, aber das Programm läuft nicht. „Im Editor öffnen“ zeigt den Code im Bereich Code. Klicke auf „Ausführen“ und lies die Fehlermeldung. Repariere den Fehler und klicke auf Prüfen.
start: vb-fehler-06-konstanten-final-start.visustruct
fahrt: 4 x (forward 30, turnRight)
tipp: Die Fehlermeldung nennt eine unbekannte Variable. Wie heißt die Konstante dort, wo sie angelegt wird? Konstanten schreibt man in Großbuchstaben.
tipp: Richtig heißt es `mbot.forward(SEITE)`.
lösung: vb-java-konstante-seite-loesung.visustruct
:::

## Spiel: Konstante oder Variable?

::: spiel frage
titel: Spiel: Konstante oder Variable?
intro: Ludwig sortiert Werte. Bleibt der Wert im ganzen Programm gleich, ist er eine Konstante. Ändert er sich, ist er eine Variable. Sechs Runden.
frage: Konstante oder Variable?
antworten: Konstante | Variable

runde:
frage: Die Anzahl der Ecken eines Quadrats
richtig: Konstante
> Ein Quadrat hat immer vier Ecken.

runde:
frage: Der Abstand, den der Ultraschallsensor gerade misst
richtig: Variable
> Fährt der mBot2, ändert sich der Abstand ständig.

runde:
frage: Der Mindestabstand, bei dem der mBot2 immer anhalten soll
richtig: Konstante
> Du legst ihn einmal fest, zum Beispiel `final int ABSTAND = 20;`.

runde:
frage: Die Zahl der Schritte, die der mBot2 schon gefahren ist
richtig: Variable
> Nach jedem Schritt wird sie um 1 größer.

runde:
frage: Die Tonhöhe des Warntons, immer 440 Hz
richtig: Konstante
> Der Warnton klingt immer gleich.

runde:
frage: Der Akkustand in Prozent
richtig: Variable
> Der Akku wird beim Fahren langsam leer.
:::

::: quiz
? Was ist eine Konstante?
→ Eine Konstante anlegen
- [ ] Eine Variable, die sich in jedem Durchgang ändert
- [x] Eine Variable, deren Wert nach dem Festlegen gleich bleibt
- [ ] Ein Sensor, der immer denselben Wert misst
> Eine Konstante legst du einmal fest. Danach benutzt du nur ihren Namen.
? Wie legst du in Java die Konstante `ABSTAND` mit dem Wert 20 an?
→ Eine Konstante anlegen
- [ ] `const ABSTAND = 20;`
- [x] `final int ABSTAND = 20;`
- [ ] `int final = 20;`
> In Java steht `final` vor dem Datentyp. Im Struktogramm schreibst du `const`.
? Warum ist eine Konstante besser als die Zahl 20 an vielen Stellen?
→ Eine Konstante anlegen
- [ ] Weil das Programm dann schneller fährt
- [x] Weil du den Wert nur an einer Stelle ändern musst
- [ ] Weil der Sensor dann genauer misst
:::

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann erklären, was eine Konstante ist. → Eine Konstante anlegen
- Ich kann eine Konstante im Struktogramm und in Java anlegen. → Eine Konstante anlegen
- Ich kann eine Konstante in einer Bedingung und in einem Befehl benutzen. → Jetzt in Java: Quadrat mit Konstante
:::
