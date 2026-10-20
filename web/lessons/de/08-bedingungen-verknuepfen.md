---
titel: Bedingungen verknüpfen
bereich: Grundlagen
kurz: Mehrere Bedingungen mit und, oder und nicht verbinden und Wertebereiche prüfen.
---

## Und: &&

Manchmal reicht ein einzelner Vergleich nicht. Ein Jugendticket gibt es zum Beispiel nur, wenn jemand **mindestens 12 und jünger als 18** ist.

Mit `&&` (und) verbindest du zwei Bedingungen. Das Ergebnis ist nur dann `true`, wenn **beide** Bedingungen wahr sind.

::: diagramm l08-jugendticket.visustruct
Beide Vergleiche müssen stimmen. Probiere in der Simulation 11, 12, 17 und 18 aus.
:::

## Oder: ||

Mit `||` (oder) ist das Ergebnis `true`, wenn **mindestens eine** der Bedingungen wahr ist. Es dürfen auch beide wahr sein.

```
tag == 6 || tag == 7
```

Diese Bedingung ist wahr, wenn `tag` den Wert 6 oder den Wert 7 hat, also am Samstag oder Sonntag.

> Die beiden senkrechten Striche `|` tippst du auf vielen Tastaturen mit AltGr und der Taste `<`, am Mac mit Option und 7.

## Übung: Wochenende

::: übung l08-wochenende
titel: Wochenende
auftrag: Frage einen Wochentag als Zahl ab (1 ist Montag, 7 ist Sonntag). Gib **Wochenende** aus, wenn es Samstag oder Sonntag ist, sonst **Werktag**.
test: 6 -> Wochenende
test: 7 -> Wochenende
test: 1 -> Werktag
test: 5 -> Werktag
braucht: verzweigung
tipp: Samstag ist 6, Sonntag ist 7. Verbinde die beiden Vergleiche mit `||`.
lösung: l08-wochenende-loesung.visustruct
:::

## Wertebereiche prüfen

Schulnoten gehen von 1 bis 6. Ob eine Note **im Bereich** liegt, prüfst du mit zwei Vergleichen und `&&`:

```
note >= 1 && note <= 6
```

Umgekehrt ist eine Note **außerhalb** des Bereichs, wenn sie zu klein **oder** zu groß ist:

::: diagramm l08-note.visustruct
Eine Note kleiner als 1 oder größer als 6 gibt es nicht.
:::

> Die Schreibweise aus Mathe `1 <= note <= 6` funktioniert nicht. Du musst sie in zwei Vergleiche aufteilen und mit `&&` verbinden.

## Übung: Gültige Note

::: übung l08-note-gueltig
titel: Gültige Note
auftrag: Frage eine Note als ganze Zahl ab. Gib **gültig** aus, wenn sie zwischen 1 und 6 liegt (1 und 6 gehören dazu), sonst **ungültig**.
test: 1 -> gültig
test: 6 -> gültig
test: 3 -> gültig
test: 0 -> ungültig
test: 7 -> ungültig
braucht: verzweigung
tipp: Die Note muss größer oder gleich 1 und gleichzeitig kleiner oder gleich 6 sein.
lösung: l08-gueltig-loesung.visustruct
:::

## Nicht und Klammern

Mit `!` (nicht) drehst du eine Bedingung um: Aus `true` wird `false` und umgekehrt.

```
!(note >= 1 && note <= 6)
```

Das ist wahr, wenn die Note **nicht** im Bereich liegt, und bedeutet dasselbe wie `note < 1 || note > 6`.

Kommen `&&` und `||` zusammen vor, wird `&&` zuerst ausgewertet, so wie Punkt vor Strich. Setze lieber **Klammern**, dann ist klar, was zusammengehört:

```
(alter >= 12 && alter < 18) || schueler == 1
```

## Übung: Schaltjahr

::: übung l08-schaltjahr
titel: Schaltjahr
auftrag: Ein Jahr ist ein Schaltjahr, wenn es durch 4 teilbar ist, aber nicht durch 100. Jahre, die durch 400 teilbar sind, sind trotzdem Schaltjahre.
Frage eine Jahreszahl ab und gib **Schaltjahr** oder **kein Schaltjahr** aus.
test: 2024 -> Schaltjahr
test: 2023 -> kein Schaltjahr
test: 1900 -> kein Schaltjahr
test: 2000 -> Schaltjahr
braucht: verzweigung
tipp: Teilbar durch 4 heißt `jahr % 4 == 0`, nicht teilbar durch 100 heißt `jahr % 100 != 0`. Verbinde diese beiden mit `&&`, setze Klammern darum und hänge mit `||` den Fall für 400 an.
lösung: l08-schaltjahr-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, wann eine Verknüpfung mit && wahr ist.
- Ich weiß, wann eine Verknüpfung mit || wahr ist.
- Ich kann eine Bedingung mit ! umdrehen.
- Ich kann prüfen, ob ein Wert in einem Bereich wie 1 bis 6 liegt.
:::

## Wissenstest

::: quiz
? Wann ist `a && b` wahr?
- [ ] Wenn a oder b wahr ist
- [x] Nur wenn a und b beide wahr sind
- [ ] Wenn genau eins von beiden wahr ist
> Bei && müssen beide Teile stimmen. Ist einer falsch, ist das Ganze falsch.

? Die Variable tag hat den Wert 6. Was ergibt `tag == 6 || tag == 7`?
- [x] true
- [ ] false
> Bei || reicht es, wenn eine Seite wahr ist.

? Mit welcher Bedingung prüfst du, ob zahl zwischen 10 und 20 liegt (beide eingeschlossen)?
- [ ] 10 <= zahl <= 20
- [ ] zahl >= 10 || zahl <= 20
- [x] zahl >= 10 && zahl <= 20
> Mit || wäre jede Zahl erlaubt, denn jede Zahl ist größer als 10 oder kleiner als 20.

? Was ergibt `!(5 > 3)`?
- [ ] true
- [x] false
> 5 > 3 ist wahr, und ! dreht das um.
:::
