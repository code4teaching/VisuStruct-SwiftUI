---
titel: Do-while-Schleife
bereich: Grundlagen
kurz: Erst ausführen, dann prüfen: Schleifen mit mindestens einem Durchlauf.
---

## Erst machen, dann prüfen

Die **Do-while-Schleife** ist **fußgesteuert**. Die Bedingung steht unten im Fuß des Kastens. Der Ablauf ist:

1. Den Inhalt einmal ausführen.
2. Die Bedingung prüfen.
3. Ist sie wahr, wieder bei 1 anfangen. Ist sie falsch, geht es unter der Schleife weiter.

::: grafik l11-vergleich.svg
Links prüft die While-Schleife zuerst, rechts führt die Do-while-Schleife zuerst aus.
:::

Oben im Kasten steht `do`, unten im Fuß die Bedingung. Wenn du die Schleife anklickst, steht im Objektinspektor vor dem Textfeld das Wort `while`: Die Bedingung bedeutet „wiederhole, solange …“.

> Die Bedingung sagt wie bei der While-Schleife, **wann wiederholt wird**. Solange sie wahr ist, läuft die Schleife weiter.

## Mindestens ein Durchlauf

Weil die Bedingung erst am Ende geprüft wird, läuft der Inhalt **immer mindestens einmal**. Das ist der wichtigste Unterschied zur While-Schleife.

::: diagramm l11-einmal.visustruct
i ist 10 und damit nicht kleiner als 5. Trotzdem wird 10 einmal ausgegeben, denn geprüft wird erst danach.
:::

Mit einer While-Schleife und derselben Bedingung `i < 5` würde hier gar nichts ausgegeben.

## Typisch: Eingabe wiederholen

Die Do-while-Schleife passt immer dann, wenn etwas zuerst passieren muss, bevor man es prüfen kann. Das beste Beispiel ist eine Eingabe: Erst wenn jemand etwas eingegeben hat, weißt du, ob es gültig ist.

::: diagramm l11-eingabe-pruefen.visustruct
Die Frage kommt so lange wieder, bis eine Zahl von 1 bis 10 eingegeben wurde. Probiere in der Simulation zuerst 0 und dann 12 aus.
:::

Die Bedingung beschreibt hier die **ungültige** Eingabe: `zahl < 1 || zahl > 10`. Solange die Eingabe ungültig ist, wird noch einmal gefragt.

## Übung: Gültige Note

::: übung l11-note
titel: Gültige Note
auftrag: Frage eine Note ab. Ist sie nicht zwischen 1 und 6, frage noch einmal. Ist sie gültig, gib sie aus, zum Beispiel **Deine Note: 3**.
test: 3 -> Deine Note: 3
test: 0, 7, 2 -> Deine Note: 2
test: 9, 6 -> Deine Note: 6
test: -1, 1 -> Deine Note: 1
braucht: doUntilSchleife
tipp: Die Note wird mindestens einmal abgefragt. Danach entscheidet die Bedingung, ob noch einmal gefragt wird.
tipp: Lege vor der Schleife `int note = 0` an. In die Schleife kommt die Eingabe `input: note "Note von 1 bis 6"`. Die Bedingung lautet `note < 1 || note > 6`.
lösung: l11-note-loesung.visustruct
:::

## Übung: Summe bis 0

::: übung l11-summe
titel: Summe bis 0
auftrag: Frage so lange Zahlen ab, bis eine 0 eingegeben wird. Gib danach die Summe aller eingegebenen Zahlen aus.
test: 3, 4, 0 -> 7
test: 10, 0 -> 10
test: 5, 5, 5, 0 -> 15
test: 0 -> 0
braucht: doUntilSchleife
tipp: Du brauchst eine Variable für die Summe, die vor der Schleife bei 0 beginnt. In jedem Durchlauf kommt die neue Zahl dazu.
tipp: Lege vor der Schleife `int summe = 0` und `int zahl = 0` an. In der Schleife fragst du `zahl` ab und rechnest `summe = summe + zahl`. Die 0 zu addieren schadet nicht. Die Schleife läuft weiter, solange `zahl != 0` ist.
lösung: l11-summe-loesung.visustruct
:::

## Jetzt in Java

Die Schleife, die trotzdem einmal läuft, sieht in Java so aus:

```
int i = 10;
do {
    System.out.println(i);
    i = i + 1;
} while (i < 5);
```

- Der Rumpf steht zwischen `do {` und `}`, die Bedingung kommt erst danach.
- Hinter `while (…)` steht hier ein **Semikolon**. Das ist anders als bei der While-Schleife.

::: übung l12-java-verdoppeln
titel: Mindestens einmal verdoppeln
code: java
auftrag: Schreibe ein Java-Programm, das eine Startzahl einliest. Mit einer Do-while-Schleife wird sie verdoppelt und ausgegeben, solange sie kleiner als 100 ist. Auch eine Zahl ab 100 wird mindestens einmal verdoppelt: Aus 200 wird 400.
test: 30 -> 60 | 120
test: 200 -> 400
test: 13 -> 26 | 52 | 104
braucht: doUntilSchleife
tipp: Im Rumpf verdoppelst du die Zahl und gibst sie aus. Die Bedingung steht am Ende.
tipp: `do { zahl = zahl * 2; System.out.println(zahl); } while (zahl < 100);`
lösung: l12-java-verdoppeln-loesung.visustruct
:::

## Spiel: Mindestens einmal?

::: spiel frage
titel: Spiel: Mindestens einmal?
intro: While oder do-while? Ludwig zeigt dir Schleifen. Sag vorher, was passiert. Sechs Runden.

runde:
    int i = 10;
    do {
        System.out.println(i);
        i = i + 1;
    } while (i < 5);
frage: Was wird ausgegeben?
- nichts
- [x] 10
- 10 bis 4
> Erst machen, dann prüfen: Der Rumpf läuft einmal, danach ist 11 < 5 falsch.

runde:
    int i = 10;
    while (i < 5) {
        System.out.println(i);
        i = i + 1;
    }
frage: Was wird ausgegeben?
- [x] nichts
- 10
- 11
> Bei der While-Schleife kommt die Bedingung zuerst. 10 < 5 ist falsch, also läuft gar nichts.

runde:
    int zahl = 200;
    do {
        zahl = zahl * 2;
    } while (zahl < 100);
    System.out.println(zahl);
frage: Was wird ausgegeben?
- 200
- [x] 400
- 800
> Einmal wird auf jeden Fall verdoppelt. Danach ist 400 < 100 falsch.

runde:
    int zahl = 30;
    do {
        zahl = zahl * 2;
        System.out.println(zahl);
    } while (zahl < 100);
frage: Was wird ausgegeben?
- 60
- [x] 60\n120
- 60\n120\n240
> Nach 60 ist 60 < 100 wahr, es geht weiter. Nach 120 ist Schluss.

runde:
frage: Welche Zeile beendet eine Do-while-Schleife in Java richtig?
- [x] `} while (i < 5);`
- `} while (i < 5)`
- `while (i < 5) {`
> Hinter dem `while (…)` der Do-while-Schleife steht ein Semikolon.

runde:
frage: Wofür nimmt man typischerweise eine Do-while-Schleife?
- [x] eine Eingabe wiederholen, bis sie gültig ist
- von 1 bis 10 zählen
- zwei Werte tauschen
> Gefragt wird mindestens einmal. Erst danach weiß man, ob die Eingabe gültig war.
:::

## Checkliste

::: checkliste
- Ich weiß, dass die Do-while-Schleife ihre Bedingung erst nach dem Inhalt prüft. → Erst machen, dann prüfen
- Ich weiß, dass der Inhalt mindestens einmal ausgeführt wird. → Mindestens ein Durchlauf
- Ich kann eine Eingabe so lange wiederholen lassen, bis sie gültig ist. → Typisch: Eingabe wiederholen
- Ich kann eine Do-while-Schleife in Java schreiben. → Jetzt in Java
:::

## Wissenstest

::: quiz
? Was bedeutet fußgesteuert?
- [ ] Die Bedingung wird vor jedem Durchlauf geprüft.
- [x] Die Bedingung wird nach jedem Durchlauf geprüft.
- [ ] Die Schleife hat keine Bedingung.
> Die Bedingung steht im Fuß, also unten, und wird nach dem Inhalt ausgewertet.

? Die Bedingung einer Do-while-Schleife ist von Anfang an falsch. Wie oft läuft der Inhalt?
- [ ] Keinmal
- [x] Genau einmal
- [ ] Endlos
> Der Inhalt läuft zuerst. Erst danach merkt die Schleife, dass sie aufhören soll.

? Du willst eine Zahl von 1 bis 10 abfragen. Welche Bedingung gehört in den Fuß?
- [ ] `zahl >= 1 && zahl <= 10`
- [x] `zahl < 1 || zahl > 10`
- [ ] `zahl == 10`
> Wiederholt wird, solange die Eingabe ungültig ist, also kleiner als 1 oder größer als 10.

? Wann ist eine Do-while-Schleife besser als eine While-Schleife?
- [x] Wenn der Inhalt auf jeden Fall einmal laufen muss, z. B. bei einer Eingabe
- [ ] Wenn die Schleife vielleicht gar nicht laufen soll
- [ ] Wenn man genau bis 10 zählen will

? Was steht in Java am Ende einer Do-while-Schleife?
- [ ] } while (bedingung) {
- [x] } while (bedingung);
- [ ] } until (bedingung);
> Nach der Bedingung kommt ein Semikolon.
:::
