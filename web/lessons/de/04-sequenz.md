---
titel: Sequenz
bereich: Grundlagen
kurz: Schritte nacheinander ausführen, auf die Reihenfolge achten und Werte tauschen.
---

## Schritt für Schritt

Eine **Sequenz** ist eine Folge von Schritten, die genau einmal und genau in dieser Reihenfolge ausgeführt werden. Im Struktogramm stehen die Kästen einfach untereinander.

Jeder Kasten wird erst begonnen, wenn der Kasten darüber fertig ist. Es wird nichts übersprungen und nichts wiederholt.

> Die Sequenz ist der einfachste der drei Grundbausteine. Fast jedes Struktogramm besteht zum größten Teil aus Sequenzen.

## Die Reihenfolge zählt

Beim Tee kochen merkst du sofort, wenn die Reihenfolge falsch ist. Bei Rechnungen ist es genauso, nur fällt es weniger auf.

::: diagramm l04-rechnen.visustruct
Erst verdoppeln, dann 1 addieren: Das Ergebnis ist 7. Tauschst du die beiden mittleren Kästen, kommt 8 heraus.
:::

Die Anweisung `zahl = zahl * 2` bedeutet: Nimm den Wert von `zahl`, rechne mal 2 und speichere das Ergebnis wieder in `zahl`. Was in `zahl` steht, hängt also davon ab, was vorher passiert ist.

::: angeberwissen
Struktogramme sind kein reiner Schulkram. Laut Shneiderman haben auch Firmen wie IBM und Siemens damit ihre Programme geplant. Du lernst hier also Profi-Zeug. Määäh-ga!
:::

## Übung: Reihenfolge ordnen

::: übung l04-reihenfolge
titel: Reihenfolge ordnen
auftrag: Im Startdiagramm stehen die richtigen Kästen, aber in der falschen Reihenfolge. Verschiebe sie so, dass am Ende **20** ausgegeben wird.
start: l04-reihenfolge-start.visustruct
test: - -> 20
braucht: anweisung
tipp: Eine Variable muss zuerst angelegt werden, bevor du mit ihr rechnest. Die Ausgabe kommt ganz zum Schluss. Rechne im Kopf nach: (2 + 3) · 4 = 20.
lösung: l04-reihenfolge-loesung.visustruct
:::

## Zwei Werte tauschen

Stell dir zwei Gläser vor: eins mit Saft, eins mit Wasser. Willst du die Inhalte tauschen, brauchst du ein drittes, leeres Glas.

Mit Variablen ist es genauso. Schreibst du einfach `a = b` und danach `b = a`, ist der alte Wert von `a` schon verloren. Am Ende haben beide Variablen denselben Wert.

Die Lösung ist eine **Hilfsvariable**, die den alten Wert kurz aufbewahrt:

::: diagramm l04-tauschen.visustruct
Zuerst wird a in hilf gemerkt. Dann bekommt a den Wert von b, und b bekommt den gemerkten Wert aus hilf.
:::

## Übung: Gläser tauschen

::: übung l04-glaeser-tauschen
titel: Gläser tauschen
auftrag: Im linken Glas ist Saft, im rechten Wasser. Tausche die Inhalte der Variablen `links` und `rechts`, bevor sie ausgegeben werden.
Ändere dazu nicht die ersten beiden Kästen, sondern füge dazwischen neue Anweisungen ein.
start: l04-tauschen-start.visustruct
test: - -> Links: Wasser | Rechts: Saft
braucht: anweisung
tipp: Lege mit `String hilf = links` eine Hilfsvariable an. Danach brauchst du noch zwei Zuweisungen.
lösung: l04-tauschen-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, dass eine Sequenz von oben nach unten ausgeführt wird. → Schritt für Schritt
- Ich kann erklären, warum die Reihenfolge der Schritte wichtig ist. → Die Reihenfolge zählt
- Ich kann zwei Werte mit einer Hilfsvariablen tauschen. → Zwei Werte tauschen
:::

## Wissenstest

::: quiz
? Wie oft wird jeder Kasten einer Sequenz ausgeführt?
- [ ] So oft, bis eine Bedingung falsch ist
- [x] Genau einmal
- [ ] Gar nicht, wenn er leer ist
> In einer Sequenz wird nichts wiederholt und nichts übersprungen. Für Wiederholungen gibt es Schleifen.

? Am Anfang ist a = 5 und b = 9. Danach wird `a = b` und dann `b = a` ausgeführt. Was steht am Ende in den Variablen?
- [ ] a = 9 und b = 5
- [x] a = 9 und b = 9
- [ ] a = 5 und b = 5
> Nach `a = b` ist der alte Wert 5 verloren. `b = a` kopiert dann nur die 9 zurück.

? Wozu brauchst du beim Tauschen eine Hilfsvariable?
- [x] Damit ein Wert nicht überschrieben wird, bevor er gebraucht wird
- [ ] Damit das Struktogramm länger wird
- [ ] Weil man Variablen sonst nicht ausgeben kann

? Was gibt die Sequenz `int x = 4`, `x = x + 1`, `x = x * 3`, `output: x` aus?
- [ ] 13
- [x] 15
- [ ] 4
> Erst wird x zu 5, dann zu 15.
:::
