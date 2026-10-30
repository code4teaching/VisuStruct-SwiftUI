---
titel: While-Schleife
bereich: Grundlagen
kurz: Schritte wiederholen, solange eine Bedingung wahr ist.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, dass die While-Schleife ihre Bedingung vor jedem Durchlauf prüft
- eine Zählvariable mit Startwert, Bedingung und Veränderung verwenden
- erkennen, wenn eine Schleife nie endet, und den Fehler beheben
- eine Schleife im Schreibtischtest Durchlauf für Durchlauf verfolgen
- eine While-Schleife in Java schreiben
:::

## Wiederholen, solange etwas gilt

Oft soll ein Programm etwas mehrmals tun. Statt denselben Kasten fünfmal hinzuschreiben, nimmst du eine **Schleife**.

Die **While-Schleife** wiederholt ihren Inhalt, **solange** ihre Bedingung wahr ist. Die Bedingung steht oben im Kopf des Kastens. Der Inhalt steht eingerückt darunter, links von einer Klammer eingefasst.

::: diagramm l10-countdown.visustruct
Ein Countdown: Solange zahl größer als 0 ist, wird zahl ausgegeben und um 1 kleiner. Danach erscheint Start!
:::

## Die Bedingung kommt zuerst

Die While-Schleife ist **kopfgesteuert**. Vor **jedem** Durchlauf wird die Bedingung geprüft:

1. Bedingung prüfen.
2. Ist sie wahr, den Inhalt einmal ausführen und wieder bei 1 anfangen.
3. Ist sie falsch, geht es unter der Schleife weiter.

::: grafik l10-kopfgesteuert.svg
Nach jedem Durchlauf geht es zurück zur Bedingung. Erst wenn sie false ist, geht es unter der Schleife weiter.
:::

Im Countdown wird die Bedingung viermal geprüft: bei 3, 2 und 1 ist sie wahr, bei 0 ist sie falsch.

> Ist die Bedingung schon beim ersten Prüfen falsch, wird der Inhalt **kein einziges Mal** ausgeführt. Starte den Countdown mit `int zahl = 0`, dann erscheint nur Start!

## Eine Zählvariable

Viele Schleifen zählen mit. Dafür brauchst du drei Dinge:

- **Startwert vor der Schleife**, z. B. `int i = 1`
- **Bedingung im Kopf**, z. B. `i <= 5`
- **Veränderung im Inhalt**, z. B. `i = i + 1` (kurz `i++`)

Fehlt einer dieser Teile, zählt die Schleife falsch oder gar nicht.

::: angeberwissen
Zählschleifen sind uralt! Im Artikel von 1973 haben Nassi und Shneiderman ihre Idee unter anderem an der **Fakultät** gezeigt: 5! = 1 · 2 · 3 · 4 · 5 = 120. Hier ist meine Ziegen-Version davon. Probier sie mit **Schritt** in der Simulation aus und schau zu, wie `fakultaet` wächst. Määäh, das geht schnell!
:::

::: diagramm l10-fakultaet.visustruct
Die Fakultät mit einer Zählvariable `i`, nachgebaut nach einem Beispiel aus dem Artikel von 1973.
:::

## Übung: Zählen bis n

::: übung l10-bis-n
titel: Zählen bis n
auftrag: Frage eine ganze Zahl `n` ab und gib alle Zahlen von 1 bis `n` aus, jede in einer eigenen Zeile.
test: 3 -> 1 | 2 | 3
test: 5 -> 1 | 2 | 3 | 4 | 5
test: 1 -> 1
braucht: whileSchleife
tipp: Du brauchst eine Zählvariable, die bei 1 beginnt und in jedem Durchlauf um 1 wächst.
tipp: Lege vor der Schleife `int i = 1` an. Die Bedingung ist `i <= n`. Im Inhalt gibst du `i` aus und erhöhst danach `i` um 1.
lösung: l10-bis-n-loesung.visustruct
:::

## Vorsicht, Endlosschleife

Wenn sich im Inhalt nichts an der Bedingung ändert, bleibt sie für immer wahr. Die Schleife hört nie auf. Das nennt man **Endlosschleife**.

::: diagramm l10-endlos.visustruct
Hier fehlt zahl = zahl - 1. Die Schleife gibt immer wieder 3 aus und erreicht Start! nie.
:::

Frage dich bei jeder Schleife: **Was im Inhalt sorgt dafür, dass die Bedingung irgendwann falsch wird?** Beim Prüfen einer Übung bricht VisuStruct nach sehr vielen Schritten ab und meldet eine mögliche Endlosschleife.

## Übung: Verdoppeln bis 100

::: übung l10-verdoppeln
titel: Verdoppeln bis 100
auftrag: Frage eine ganze Zahl ab. Verdopple sie so lange, bis sie mindestens 100 ist.
  Gib am Ende aus, **wie oft** du verdoppelt hast.
test: 10 -> 4
test: 30 -> 2
test: 1 -> 7
test: 100 -> 0
braucht: whileSchleife
tipp: Die Schleife läuft, solange die Zahl noch zu klein ist. Zähle nebenbei mit, wie oft sie gelaufen ist.
tipp: Du brauchst eine zweite Variable `int schritte = 0`. Die Bedingung lautet `zahl < 100`. Im Inhalt verdoppelst du die Zahl mit `zahl = zahl * 2` und erhöhst `schritte` um 1. Ist die Zahl schon 100, läuft die Schleife gar nicht.
lösung: l10-verdoppeln-loesung.visustruct
:::

## Schleifen im Schreibtischtest

Bei einer Schleife wird der **Schreibtischtest** besonders wertvoll. Du siehst genau, wie oft die Schleife läuft und mit welchem Wert sie aufhört. Jede Prüfung der Bedingung bekommt eine eigene Zeile.

::: diagramm l16-schreibtisch.visustruct
Eine While-Schleife zählt die Zahlen 1, 2 und 3 zusammen.
:::

| Schritt | summe | i | Ausgabe |
|---|---|---|---|
| `int summe = 0` | 0 | – | |
| `int i = 1` | 0 | 1 | |
| `i <= 3` → wahr | 0 | 1 | |
| `summe = summe + i` | 1 | 1 | |
| `i = i + 1` | 1 | 2 | |
| `i <= 3` → wahr | 1 | 2 | |
| `summe = summe + i` | 3 | 2 | |
| `i = i + 1` | 3 | 3 | |
| `i <= 3` → wahr | 3 | 3 | |
| `summe = summe + i` | 6 | 3 | |
| `i = i + 1` | 6 | 4 | |
| `i <= 3` → falsch | 6 | 4 | |
| `output: summe` | 6 | 4 | 6 |

Häufige Fehler in Schleifen sind:

- Die Schleife läuft **einmal zu oft oder zu wenig**, z. B. `<` statt `<=`.
- Eine Variable wird in der Schleife **nicht verändert** oder in die falsche Richtung. Dann endet die Schleife nie.
- Eine Variable bekommt ihren Startwert **in** der Schleife statt davor und wird bei jedem Durchlauf zurückgesetzt.

## Übung: Countdown reparieren

::: übung l16-countdown
titel: Countdown reparieren
auftrag: Der Countdown soll vom Startwert herunterzählen und am Ende **Los!** ausgeben. Bei 3 also 3, 2, 1, Los!
  Im Startdiagramm stecken zwei Fehler. Finde und behebe beide.
start: l16-countdown-start.visustruct
test: 3 -> 3 | 2 | 1 | Los!
test: 1 -> 1 | Los!
test: 0 -> Los!
tipp: Es gibt zwei Fehler. Einer betrifft das Zählen, der andere die Ausgabe am Ende.
tipp: Starte die Simulation mit Startwert 3 und beobachte i unter Variablen. Wird i kleiner? Vergleiche außerdem die letzte Ausgabe genau mit dem Auftrag.
lösung: l16-countdown-loesung.visustruct
:::

## Jetzt in Java

Der Countdown vom Anfang dieser Lektion sieht in Java so aus:

```java
int zahl = 3;
while (zahl > 0) {
    System.out.println(zahl);
    zahl = zahl - 1;
}
System.out.println("Start!");
```

- Nach `while` steht die Bedingung in runden Klammern, wie bei `if`.
- Alles, was wiederholt wird, steht in geschweiften Klammern. Das ist der Rumpf der Schleife.
- Der Rumpf ist eingerückt. So erkennst du wie im Struktogramm, was zur Schleife gehört.

::: übung l11-java-gerade
titel: Gerade Zahlen in Java
code: java
auftrag: Schreibe ein Java-Programm, das eine ganze Zahl `n` einliest und mit einer While-Schleife alle geraden Zahlen von 2 bis höchstens `n` ausgibt. Bei 7 also 2, 4 und 6.
test: 7 -> 2 | 4 | 6
test: 8 -> 2 | 4 | 6 | 8
test: 2 -> 2
braucht: whileSchleife
tipp: Du brauchst eine Zählvariable, die bei 2 beginnt. Die Schleife läuft, solange sie nicht größer als `n` ist.
tipp: `int zahl = 2;` vor der Schleife, dann `while (zahl <= n) { … }`. Im Rumpf gibst du `zahl` aus und erhöhst sie mit `zahl = zahl + 2;`.
lösung: l11-java-gerade-loesung.visustruct
:::

## Lückentext: while

::: lückentext
titel: Summe von 1 bis 10
auftrag: Das Programm soll die Zahlen von 1 bis 10 zusammenzählen. Ergänze die fehlenden Wörter und Zeichen.
```java
int summe = 0;
int zahl = 1;
[[while]] (zahl [[<=]] 10) [[{]]
    summe = summe + [[zahl]];
    [[zahl]] = zahl + 1;
}
System.out.println("Summe: " + summe);
```
erklärung: Die Schleife läuft, solange `zahl` höchstens 10 ist. In jedem Durchlauf kommt `zahl` zur Summe dazu, danach wird `zahl` um 1 größer. Ohne diese Zeile wäre es eine Endlosschleife. Ausgabe: **Summe: 55**
:::

## Fehler finden: Sparen

::: übung l11-java-fehler
titel: Sparplan reparieren
code: java
auftrag: Ludwig spart jede Woche 5 Euro. Das Programm fragt nach dem Sparziel und soll ausgeben, nach wie vielen Wochen er es erreicht hat. Bei 50 Euro sind das 10 Wochen, das Programm sagt aber **Wochen: 11**.
  Gehe den Code mit dem Einzelschritt durch und beobachte `geld` und `wochen`. Repariere den Fehler und klicke auf Prüfen.
start: l11-java-fehler-start.visustruct
test: 50 -> Wochen: 10
test: 12 -> Wochen: 3
test: 5 -> Wochen: 1
test: 1 -> Wochen: 1
braucht: whileSchleife
tipp: Wie viel Geld hat Ludwig, wenn die Schleife zum letzten Mal läuft? Muss er dann wirklich noch eine Woche sparen?
tipp: Gespart wird nur, solange das Ziel noch **nicht erreicht** ist: `while (geld < ziel)`.
lösung: l11-java-fehler-loesung.visustruct
:::

## Spiel: Wie oft?

::: spiel frage
titel: Spiel: Wie oft?
intro: Ludwig hat While-Schleifen geschrieben. Mach im Kopf den Schreibtischtest. Sechs Runden.

runde:
    int zahl = 3;
    while (zahl > 0) {
        System.out.println(zahl);
        zahl = zahl - 1;
    }
    System.out.println("Start!");
frage: Was wird ausgegeben?
- [x] 3\n2\n1\nStart!
- 3\n2\n1\n0\nStart!
- Start!
> Bei zahl gleich 0 ist `zahl > 0` falsch, die 0 wird also nicht mehr ausgegeben.

runde:
    int i = 10;
    while (i < 5) {
        System.out.println(i);
        i = i + 1;
    }
frage: Was wird ausgegeben?
- [x] nichts
- 10
- 10 bis 4
> Die Bedingung wird zuerst geprüft. 10 < 5 ist falsch, der Rumpf läuft kein einziges Mal.

runde:
    int i = 1;
    while (i <= 3) {
        System.out.println(i);
    }
frage: Was passiert?
- 1, 2 und 3 werden ausgegeben.
- [x] Die Schleife hört nie auf.
- Es wird nichts ausgegeben.
> i wird im Rumpf nie größer. Die Bedingung bleibt immer wahr: eine Endlosschleife.

runde:
    int zahl = 1;
    while (zahl < 100) {
        zahl = zahl * 2;
    }
    System.out.println(zahl);
frage: Was wird ausgegeben?
- 64
- 100
- [x] 128
> 1, 2, 4, 8, 16, 32, 64, 128. Erst bei 128 ist `zahl < 100` falsch.

runde:
    int i = 0;
    while (i < 5) {
        i = i + 2;
    }
    System.out.println(i);
frage: Was wird ausgegeben?
- 4
- 5
- [x] 6
> i läuft 0, 2, 4, 6. Bei 6 ist `i < 5` falsch. Die 5 wird übersprungen.

runde:
    int i = 1;
    while (i <= 10) {
        i = i + 3;
    }
frage: Wie oft läuft der Rumpf?
- 3-mal
- [x] 4-mal
- 10-mal
> Der Rumpf läuft bei i = 1, 4, 7 und 10. Danach ist i 13.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann erklären, dass die While-Schleife ihre Bedingung vor jedem Durchlauf prüft. → Die Bedingung kommt zuerst
- Ich kann eine Zählvariable mit Startwert, Bedingung und Veränderung verwenden. → Eine Zählvariable
- Ich kann erkennen, wenn eine Schleife nie endet, und den Fehler beheben. → Vorsicht, Endlosschleife
- Ich kann eine Schleife im Schreibtischtest Durchlauf für Durchlauf verfolgen. → Schleifen im Schreibtischtest
- Ich kann eine While-Schleife in Java schreiben. → Jetzt in Java
:::

## Wissenstest

::: quiz
? Was bedeutet kopfgesteuert?
→ Die Bedingung kommt zuerst
- [x] Die Bedingung wird vor jedem Durchlauf geprüft.
- [ ] Die Bedingung wird nach jedem Durchlauf geprüft.
- [ ] Die Schleife läuft immer genau einmal.
> Der Kopf mit der Bedingung steht oben und wird zuerst ausgewertet.

? `int i = 5`, danach eine While-Schleife mit der Bedingung `i < 3`. Wie oft läuft der Inhalt?
→ Die Bedingung kommt zuerst
- [x] Keinmal
- [ ] Einmal
- [ ] Dreimal
> Schon beim ersten Prüfen ist 5 < 3 falsch.

? Warum endet eine Schleife mit der Bedingung `zahl > 0` nie, wenn im Inhalt nur `output: zahl` steht?
→ Vorsicht, Endlosschleife
- [ ] Weil output die Zahl vergrößert
- [x] Weil sich zahl nie ändert und die Bedingung wahr bleibt
- [ ] Weil die Bedingung falsch geschrieben ist
> Im Inhalt muss etwas passieren, das die Bedingung irgendwann falsch macht.

? Wie nennt man Schleifen in Schulbüchern auch?
→ Die Bedingung kommt zuerst
- [x] Wiederholungsstrukturen
- [ ] Verzweigungen
- [ ] Unterprogramme
> Eine Schleife wiederholt Anweisungen. Darum heißt sie auch Wiederholungsstruktur.

? Eine Schleife soll von 1 bis 5 zählen, läuft aber nur bis 4. Was ist der wahrscheinliche Fehler?
→ Eine Zählvariable
- [x] In der Bedingung steht i < 5 statt i <= 5.
- [ ] Die Schleife ist eine While-Schleife.
- [ ] Die Variable i heißt falsch.

? Welche Zeile startet in Java eine While-Schleife richtig?
→ Jetzt in Java
- [ ] while zahl > 0 {
- [x] while (zahl > 0) {
- [ ] while (zahl > 0);
> Die Bedingung steht in runden Klammern, danach öffnet `{` den Rumpf.
:::
