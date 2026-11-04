---
titel: Was ist ein Struktogramm?
bereich: Erste Schritte
kurz: Algorithmen als Folge klarer Schritte darstellen und lesen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, was ein Algorithmus ist
- ein Struktogramm lesen
- die drei Grundbausteine Sequenz, Verzweigung und Wiederholung erkennen
:::

## Ein Algorithmus ist eine genaue Anleitung

Ein **Algorithmus** beschreibt Schritt für Schritt, wie man eine Aufgabe löst. Jeder Schritt muss so eindeutig sein, dass ihn jemand ohne Nachfragen ausführen kann, ein Mensch genauso wie ein Computer.

Du kennst Algorithmen aus dem Alltag: ein Kochrezept, eine Wegbeschreibung oder die Anleitung für einen Schrank.

::: diagramm l1-tee.visustruct
Tee kochen als Struktogramm: Jeder Kasten ist ein Schritt.
:::

::: angeberwissen
Määäh, wer hat das erste Programm geschrieben? Eine Frau, und zwar schon 1843, lange vor dem ersten Computer! **Ada Lovelace** beschrieb Schritt für Schritt, wie die *Analytical Engine* (Analytische Maschine) von Charles Babbage die sogenannten Bernoulli-Zahlen ausrechnen sollte. Das war ein echter Algorithmus für eine Maschine. Die Befehle sollten auf Lochkarten stehen (mehr dazu in Lektion 3). Gebaut wurde die Maschine allerdings nie.

Ada hatte noch eine geniale Idee: Eine solche Maschine kann mehr als rechnen. Sie könnte auch mit Buchstaben, Zeichen oder sogar Musik arbeiten. Genau das machen Computer heute. Ihr zu Ehren heißt eine Programmiersprache **Ada**.
:::

::: bild ada-lovelace.jpg
Ada Lovelace (1815–1852), Mathematikerin (Bild: Aquarell von Alfred Edward Chalon, um 1840, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ada_Lovelace_portrait.jpg), gemeinfrei).
:::

## So liest du ein Struktogramm

Ein Struktogramm wird **von oben nach unten** gelesen. Jeder Kasten ist ein Schritt. Erst wenn ein Schritt fertig ist, kommt der nächste dran.

Die Darstellung stammt von **Isaac Nassi und Ben Shneiderman** (1973). Deshalb heißt sie auch Nassi-Shneiderman-Diagramm. In Deutschland ist sie als DIN 66261 genormt.

::: bild ike-nassi.jpg ben-shneiderman.jpg
Links Isaac „Ike“ Nassi (Foto: [Ed Schipul](https://commons.wikimedia.org/wiki/File:Me_with_Ike_Nassi!!!!!_%286893328729%29.jpg), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/deed.de), zugeschnitten), rechts Ben Shneiderman (Foto: [Robert Kosara](https://commons.wikimedia.org/wiki/File:Ben_Shneiderman_at_UNCC_%283x4_cropped%29.jpg), CC0).
:::

> Ein Struktogramm hat immer genau einen Anfang (oben) und ein Ende (unten). Es gibt keine Pfeile und keine Sprünge kreuz und quer. Programme, die kreuz und quer springen, nennt man **Spaghetticode**, weil sich ihr Ablauf verheddert wie Nudeln auf dem Teller. Mehr dazu in der nächsten Lektion.

::: angeberwissen
Määäh, aufgepasst! 1972 waren Nassi und Shneiderman noch Doktoranden an der Stony Brook University bei New York, Shneiderman etwa 25 und Nassi etwa 23. Also quasi zwei Studis, die nebenbei Informatikgeschichte geschrieben haben.
:::

## Baustein 1: Die Sequenz

Jeder Algorithmus lässt sich aus nur **drei Grundbausteinen** zusammensetzen: **Sequenz**, [**Verzweigung**]{.blau} und [**Wiederholung**]{.rosa}. Die Farben helfen dir beim Zuordnen: [Anweisungen]{.gelb} sind gelb, Verzweigungen blau, Schleifen rosa. Die Sequenz hat keine eigene Farbe, sie ist einfach die Reihe von Anweisungen untereinander. Dieselben Farben siehst du im Editor und später im Code. Du kannst sie in den Einstellungen unter „Blöcke farbig“ ausschalten. In diesem und den nächsten beiden Schritten lernst du sie einzeln kennen.

Die **Sequenz** ist der einfachste Baustein: Mehrere Anweisungen werden **nacheinander** ausgeführt, jede genau einmal.

So sieht sie aus:

- Jede Anweisung ist ein **einfaches Rechteck**.
- Die Rechtecke stehen ohne Lücke **untereinander**.
- Ausgeführt wird von oben nach unten, eine Anweisung nach der anderen.

::: diagramm l1-sequenz.visustruct
Vier Anweisungen als Sequenz. Erst wird aufgestanden, dann Zähne geputzt und so weiter.
:::

> Auch das Tee-Beispiel von oben ist eine Sequenz.

::: angeberwissen
15 Minuten! So lange hat Shneiderman für die erste Skizze mit Sequenz, Verzweigung und Schleife gebraucht. Ich brauche länger, um mich zwischen Heu und Klee zu entscheiden.
:::

## Baustein 2: Die Verzweigung

Oft hängt der nächste Schritt von einer **Bedingung** ab. Eine Bedingung ist eine Frage, die man nur mit **ja oder nein** beantworten kann, zum Beispiel *Regnet es?* In VisuStruct heißt ja **true** (wahr) und nein **false** (falsch).

Für solche Entscheidungen gibt es die **Verzweigung**. So sieht sie aus:

- Oben steht die Bedingung in einem **Dreieck**.
- Darunter teilt sich der Kasten in **zwei Spalten**: links der Weg für **true**, rechts der Weg für **false**.
- Es wird **immer nur einer** der beiden Wege ausgeführt. Danach geht es unter der Verzweigung für beide gemeinsam weiter.

::: diagramm l1-verzweigung.visustruct
Regnet es, wird der linke Weg ausgeführt, sonst der rechte. Danach geht es in beiden Fällen mit „Losgehen“ weiter.
:::

> Soll in einem Fall nichts passieren, bleibt dieser Weg leer. Das zeigt das Zeichen **ø**.

::: angeberwissen
Rechtschreib-Alarm! Es heißt Shneiderman, ohne c. Wer „Schneiderman“ schreibt, bekommt von mir einen sanften Hornstupser. Er selbst weist übrigens darauf hin, dass ihm ständig ein c untergeschmuggelt wird.
:::

## Baustein 3: Die Wiederholung

Soll etwas **mehrmals** passieren, schreibt man es nicht mehrmals hin. Stattdessen benutzt man eine **Wiederholung**, auch **Schleife** genannt.

So sieht sie aus:

- Oben steht die Bedingung, zum Beispiel *Teller nicht leer*.
- Die Schritte, die wiederholt werden, stehen **eingerückt** darunter. Oben und links bildet der Kasten ein **gekipptes L** um sie.
- Vor jedem Durchlauf wird die Bedingung geprüft. Solange sie **true** ist, werden die Schritte im gekippten L noch einmal ausgeführt. Ist sie **false**, geht es unter der Schleife weiter.

::: diagramm l1-wiederholung.visustruct
Solange der Teller nicht leer ist, wird ein Bissen gegessen. Danach wird der Teller abgeräumt.
:::

> Es gibt noch weitere Arten von Schleifen. Du lernst sie in späteren Lektionen kennen.

## Alle drei zusammen

Richtig nützlich werden die Bausteine, wenn man sie kombiniert. Das Diagramm enthält alle drei: eine Sequenz von oben nach unten, eine [Verzweigung]{.blau} und eine [Schleife]{.rosa}. Gelb sind die einfachen [Anweisungen]{.gelb}. Auch die Anweisungen in einer Verzweigung oder Schleife sind gelb. Genau genommen ist das ganze Diagramm eine Sequenz, denn auch Verzweigung und Schleife stehen in der Reihe von oben nach unten.

::: diagramm l1-grundbausteine.visustruct
Die Verzweigung erkennst du am Dreieck, die Schleife am gekippten L. Alles zusammen steht in einer Sequenz.
:::

Die Kästen können auch **ineinander geschachtelt** werden: In einer Schleife oder einem Zweig können wieder Sequenzen, Verzweigungen und Schleifen stehen.

::: angeberwissen
Trostpflaster für alle mit einer verpatzten Arbeit: Die berühmte Fachzeitschrift *Communications of the ACM* hat den Struktogramm-Artikel abgelehnt. Laut Nassi meinte der Gutachter sogar, sie sollten alle Exemplare einsammeln und verbrennen. Autsch! Er erschien 1973 dann in einem kleineren Heft und wird heute tausendfach zitiert. Ätsch!
:::

## Erst die Struktur, dann der Code

Beim Programmieren passieren zwei Dinge gleichzeitig: Du musst dir den Ablauf überlegen und die Schreibweise der Programmiersprache beachten. Mit einem Struktogramm trennst du beides.

1. Du denkst zuerst über die **Logik** nach: Welche Schritte, welche Bedingungen, welche Wiederholungen?
2. Danach übersetzt du die fertige Struktur in **Java, Python oder JavaScript**. VisuStruct kann dir den Code sogar erzeugen.

Mit der **Simulation** kannst du dein Struktogramm außerdem Schritt für Schritt ausführen und prüfen, ob es wirklich tut, was es soll.

## Spiel: Welcher Baustein?

::: spiel frage
titel: Spiel: Welcher Baustein?
intro: Ludwig beschreibt Dinge aus seinem Alltag. Welcher der drei Bausteine steckt darin? Acht Runden.
antworten: Sequenz | Verzweigung | Wiederholung

runde:
frage: „Zahnpasta auf die Bürste, Zähne putzen, Mund ausspülen.“
richtig: Sequenz
> Drei Schritte, jeder genau einmal und immer in dieser Reihenfolge.

runde:
frage: „Wenn es regnet, nimm den Schirm mit, sonst die Sonnenbrille.“
richtig: Verzweigung
> Eine Bedingung entscheidet, welcher der zwei Wege genommen wird.

runde:
frage: „Rühre, bis der Teig glatt ist.“
richtig: Wiederholung
> Das Rühren wird wiederholt, solange der Teig noch nicht glatt ist.

runde:
frage: „Laufe zehn Runden um den Sportplatz.“
richtig: Wiederholung
> Dieselbe Runde wird zehnmal gelaufen.

runde:
frage: „Schuhe an, Jacke an, Tür auf, losgehen.“
richtig: Sequenz
> Ein Schritt nach dem anderen, nichts wird übersprungen oder wiederholt.

runde:
frage: „Ist die Ampel grün, gehst du über die Straße.“
richtig: Verzweigung
> Auch ohne „sonst“ ist es eine Verzweigung. Der Sonst-Zweig ist einfach leer.

runde:
frage: „Würfle so lange, bis du eine Sechs hast.“
richtig: Wiederholung
> Du weißt vorher nicht, wie oft. Gewürfelt wird, bis die Bedingung erfüllt ist.

runde:
frage: „Sagt jemand ‚Herein‘, gehst du hinein. Sonst wartest du vor der Tür.“
richtig: Verzweigung
> Die Antwort entscheidet zwischen zwei Wegen: hineingehen oder warten.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann erklären, was ein Algorithmus ist. → Ein Algorithmus ist eine genaue Anleitung
- Ich kann ein Struktogramm von oben nach unten lesen. → So liest du ein Struktogramm
- Ich kann die drei Grundbausteine Sequenz, Verzweigung und Wiederholung nennen. → Baustein 1: Die Sequenz
- Ich kann jeden Baustein im Struktogramm an seiner Form erkennen. → Alle drei zusammen
:::

## Wissenstest

::: quiz
? In welcher Richtung wird ein Struktogramm gelesen?
→ So liest du ein Struktogramm
- [ ] Von links nach rechts
- [x] Von oben nach unten
- [ ] Von unten nach oben
> Jeder Kasten ist ein Schritt, und die Schritte folgen von oben nach unten aufeinander.

? Welcher Baustein gehört NICHT zu den drei Grundbausteinen?
→ Baustein 1: Die Sequenz
- [ ] Sequenz
- [ ] Verzweigung
- [x] Sprung
- [ ] Wiederholung
> Sprünge gibt es im Struktogramm nicht. Sequenz, Verzweigung und Wiederholung reichen für jeden Algorithmus.

? Woran erkennst du im Struktogramm eine Verzweigung?
→ Alle drei zusammen
- [ ] An einem gekippten L
- [x] An einem Dreieck mit der Bedingung und zwei Spalten darunter
- [ ] An mehreren Rechtecken untereinander
> Das gekippte L gehört zur Schleife, Rechtecke untereinander sind eine Sequenz.

? Wann wird der Inhalt einer Schleife noch einmal ausgeführt?
→ Alle drei zusammen
- [x] Solange die Bedingung true ist
- [ ] Nur, wenn die Bedingung false ist
- [ ] Immer genau zweimal
> Vor jedem Durchlauf wird die Bedingung geprüft. Ist sie false, geht es unter der Schleife weiter.

? Was ist ein Algorithmus?
→ Ein Algorithmus ist eine genaue Anleitung
- [x] Eine eindeutige Schritt-für-Schritt-Anleitung zum Lösen einer Aufgabe
- [ ] Ein bestimmtes Programm in Java
- [ ] Ein Bild, das ein Programm erklärt
> Ein Algorithmus ist unabhängig von der Programmiersprache. Ein Struktogramm ist eine Möglichkeit, ihn aufzuschreiben.
:::
