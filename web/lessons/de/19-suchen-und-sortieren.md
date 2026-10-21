---
titel: Suchen und Sortieren
bereich: Grundlagen
kurz: Mit Spielkarten verstehen, wie lineare und binäre Suche und Bubblesort arbeiten und warum manche Verfahren viel schneller sind.
---

## Eine Karte suchen

Du hast einen Stapel Spielkarten verdeckt in einer Reihe vor dir liegen. Gesucht ist die 9. Was machst du? Du drehst eine Karte nach der anderen um, bis du die 9 findest oder alle Karten umgedreht hast.

::: grafik ss-lineare-suche.svg
Die Karten liegen durcheinander. Jede umgedrehte Karte ist ein Vergleich: Ist das die 9?
:::

Genau so arbeitet die **lineare Suche**: Sie geht das Array vom Index 0 bis zum Ende durch und vergleicht jedes Fach mit dem gesuchten Wert. Sie funktioniert immer, auch wenn die Werte durcheinander liegen.

Im Array stehen unsere Karten als Zahlen. Bube, Dame und König lassen wir weg.

::: diagramm ss-lineare-suche.visustruct
Die Schleife läuft, bis die Karte gefunden ist oder kein Fach mehr übrig ist. Die Variable vergleiche zählt mit, wie oft verglichen wurde. Suche in der Simulation die 2, die 27 und die 4.
:::

> Ist die Karte nicht dabei, bleibt `position` bei **-1**. Einen Index -1 gibt es nicht, darum bedeutet -1 hier „nicht gefunden“.

## Übung: Karte suchen

::: übung ss-karte-suchen
titel: Karte suchen
auftrag: Lege das Array `int[] karten = {8, 4, 11, 4, 6}` an und frage nach einer Karte. Gib die Position der **ersten** passenden Karte aus, z. B. `Position: 1` bei der 4. Ist die Karte nicht dabei, gib `Nicht gefunden` aus.
test: 4 -> Position: 1
test: 6 -> Position: 4
test: 8 -> Position: 0
test: 9 -> Nicht gefunden
braucht: whileSchleife, verzweigung
tipp: Gehe das Array von vorn nach hinten durch und vergleiche jede Karte mit der gesuchten.
tipp: Baue das Beispiel oben nach. Die Variable vergleiche brauchst du hier nicht. Die Schleife muss aufhören, sobald `position` nicht mehr -1 ist, sonst findest du bei der 4 die zweite statt der ersten.
lösung: ss-karte-suchen-loesung.visustruct
:::

## Binäre Suche: sortiert geht es schneller

Jetzt liegen die Karten **sortiert** vor dir, von klein nach groß. Gesucht ist die 27. Du drehst nicht mehr vorne die erste Karte um, sondern die **mittlere**:

- Ist sie die gesuchte, bist du fertig.
- Ist sie kleiner, kann die gesuchte Karte nur noch rechts liegen. Die ganze linke Hälfte fällt weg.
- Ist sie größer, fällt die rechte Hälfte weg.

Mit dem Rest machst du dasselbe noch einmal. Bei jedem Vergleich halbiert sich der Stapel.

::: grafik ss-binaere-suche.svg
Drei Vergleiche statt vierzehn: Mit jeder Mitte fällt die Hälfte der übrigen Karten weg.
:::

Im Struktogramm merken sich zwei Variablen den Bereich, in dem noch gesucht wird: `links` und `rechts`. Die Mitte ist `(links + rechts) / 2`. Weil das eine Ganzzahldivision ist, kommt immer ein ganzer Index heraus.

::: diagramm ss-binaere-suche.visustruct
Dasselbe Array wie bei der linearen Suche. Suche in der Simulation wieder die 27 und vergleiche die Ausgabe Vergleiche mit der linearen Suche.
:::

> Die binäre Suche funktioniert **nur bei sortierten Werten**. Bei durcheinander liegenden Karten weißt du nach dem Blick auf die Mitte nicht, in welcher Hälfte du weitersuchen musst.

::: angeberwissen
Ich denke mir eine Zahl von 1 bis 100, du darfst raten und ich sage nur „größer“ oder „kleiner“. Mit der binären Suche brauchst du höchstens **7** Versuche. Bei einer Zahl bis eine Million sind es höchstens 20, bei einer Milliarde 30. Jede Verdopplung kostet nur einen einzigen Versuch mehr. So suchen auch Datenbanken in Millionen von Einträgen in Sekundenbruchteilen. Ich suche übrigens linear: Ich fresse die Wiese von links nach rechts ab.
:::

## Wie schnell ist das?

Wie gut ein Verfahren ist, misst man an der Zahl der Vergleiche, die es **im schlimmsten Fall** braucht. Bei der linearen Suche ist das der Fall, dass die Karte ganz hinten liegt oder fehlt.

::: grafik ss-vergleiche.svg
Bei 100 Karten braucht die lineare Suche bis zu 100 Vergleiche, die binäre höchstens 7.
:::

| Anzahl Karten | Lineare Suche | Binäre Suche |
|---|---|---|
| 10 | 10 | 4 |
| 100 | 100 | 7 |
| 1 000 | 1 000 | 10 |
| 1 000 000 | 1 000 000 | 20 |

Die lineare Suche wächst im gleichen Maß wie die Kartenzahl. Bei der binären Suche kommt bei doppelt so vielen Karten nur **ein** Vergleich dazu.

## Sortieren mit Bubblesort

Für die binäre Suche müssen die Werte sortiert sein. Eines der einfachsten Sortierverfahren ist **Bubblesort**. Du gehst die Reihe von links nach rechts durch und vergleichst immer **zwei Nachbarn**. Steht die größere Karte links, tauschst du die beiden.

::: grafik ss-bubblesort.svg
Nach einem Durchgang steht die größte Karte ganz rechts.
:::

Nach dem ersten Durchgang steht die größte Karte ganz rechts, wie eine Luftblase, die nach oben steigt. Daher kommt der Name. Danach wiederholst du den Durchgang für die übrigen Karten. Bei 5 Karten brauchst du 4 Durchgänge.

Im Struktogramm stecken zwei For-Schleifen ineinander. Die äußere zählt die Durchgänge, die innere vergleicht die Nachbarn `karten[i]` und `karten[i + 1]`. Das Tauschen kennst du schon: Es braucht eine **Hilfsvariable**.

::: diagramm ss-bubblesort.visustruct
Die innere Schleife wird mit jedem Durchgang kürzer, weil rechts schon die größten Karten richtig stehen. Gehe es in der Simulation mit Schritt durch und beobachte das Array unter Variablen.
:::

Bubblesort ist leicht zu verstehen, aber langsam. Bei n Karten braucht es bis zu n · (n − 1) / 2 Vergleiche: bei 10 Karten 45, bei 100 Karten schon 4 950 und bei 1 000 Karten fast eine halbe Million. Schnellere Verfahren wie Quicksort lernst du vielleicht später kennen.

## Übung: Absteigend sortieren

::: übung ss-absteigend
titel: Absteigend sortieren
auftrag: Das Startdiagramm liest 5 Karten ein und sortiert sie mit Bubblesort **aufsteigend**, also von klein nach groß. Ändere es so, dass die Karten **absteigend** ausgegeben werden, die größte zuerst.
start: ss-absteigend-start.visustruct
test: 3, 1, 4, 1, 5 -> 5 | 4 | 3 | 1 | 1
test: 10, 20, 30, 40, 50 -> 50 | 40 | 30 | 20 | 10
test: 2, 9, 2, 7, 6 -> 9 | 7 | 6 | 2 | 2
braucht: forSchleife, verzweigung
tipp: Schau dir die Bedingung in der Verzweigung an. Sie entscheidet, wann zwei Nachbarn getauscht werden.
tipp: Du musst nur ein einziges Zeichen ändern. Wann sollen zwei Nachbarn getauscht werden, wenn die größere Karte nach links soll?
lösung: ss-absteigend-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann erklären, wie die lineare Suche ein Array durchsucht. → Eine Karte suchen
- Ich kann eine lineare Suche als Struktogramm bauen. → Übung: Karte suchen
- Ich weiß, warum die binäre Suche nur bei sortierten Werten funktioniert. → Binäre Suche: sortiert geht es schneller
- Ich kann begründen, warum die binäre Suche bei vielen Werten viel schneller ist. → Wie schnell ist das?
- Ich kann einen Durchgang von Bubblesort mit Spielkarten vormachen. → Sortieren mit Bubblesort
:::

## Wissenstest

::: quiz
? Welche Voraussetzung braucht die binäre Suche?
- [ ] Das Array muss genau 100 Fächer haben.
- [x] Die Werte müssen sortiert sein.
- [ ] Der gesuchte Wert muss vorkommen.
> Nur bei sortierten Werten weißt du nach dem Blick auf die Mitte, in welcher Hälfte du weitersuchst.

? Ein sortiertes Array hat 1 000 Werte. Wie viele Vergleiche braucht die binäre Suche höchstens?
- [ ] 500
- [ ] 100
- [x] 10
> 1 000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1: Nach etwa 10 Halbierungen bleibt ein Wert übrig.

? Was vergleicht Bubblesort in jedem Schritt?
- [ ] Die erste und die letzte Karte
- [x] Zwei benachbarte Karten
- [ ] Jede Karte mit der Mitte
> Steht die größere Karte links, werden die Nachbarn getauscht.

? Wo steht nach dem ersten Durchgang von Bubblesort die größte Karte?
- [ ] Ganz links
- [ ] In der Mitte
- [x] Ganz rechts
> Sie wird bei jedem Vergleich weitergetauscht und steigt wie eine Blase nach rechts.

? Was bedeutet `position = -1` in der linearen Suche?
- [x] Die Karte wurde (noch) nicht gefunden.
- [ ] Die Karte liegt ganz hinten.
- [ ] Das Array ist leer.

? Ordne jedem Verfahren die passende Beschreibung zu.
= Lineare Suche -> eine Karte nach der anderen ansehen
= Binäre Suche -> die Mitte ansehen und eine Hälfte weglassen
= Bubblesort -> Nachbarn vergleichen und tauschen
:::
