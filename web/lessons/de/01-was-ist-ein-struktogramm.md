---
titel: Was ist ein Struktogramm?
bereich: Erste Schritte
kurz: Algorithmen als Folge klarer Schritte darstellen und lesen.
---

## Ein Algorithmus ist eine genaue Anleitung

Ein **Algorithmus** beschreibt Schritt für Schritt, wie man eine Aufgabe löst. Jeder Schritt muss so eindeutig sein, dass ihn jemand ohne Nachfragen ausführen kann, ein Mensch genauso wie ein Computer.

Du kennst Algorithmen aus dem Alltag: ein Kochrezept, eine Wegbeschreibung oder die Anleitung für einen Schrank.

::: diagramm l1-tee.visustruct
Tee kochen als Struktogramm: Jeder Kasten ist ein Schritt.
:::

## So liest du ein Struktogramm

Ein Struktogramm wird **von oben nach unten** gelesen. Jeder Kasten ist ein Schritt. Erst wenn ein Schritt fertig ist, kommt der nächste dran.

Die Darstellung stammt von **Isaac Nassi und Ben Shneiderman** (1973). Deshalb heißt sie auch Nassi-Shneiderman-Diagramm. In Deutschland ist sie als DIN 66261 genormt.

::: bild ike-nassi.jpg ben-shneiderman.jpg
Links Isaac „Ike“ Nassi (Foto: [Ed Schipul](https://commons.wikimedia.org/wiki/File:Me_with_Ike_Nassi!!!!!_%286893328729%29.jpg), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/deed.de), zugeschnitten), rechts Ben Shneiderman (Foto: [Robert Kosara](https://commons.wikimedia.org/wiki/File:Ben_Shneiderman_at_UNCC_%283x4_cropped%29.jpg), CC0).
:::

> Ein Struktogramm hat immer genau einen Anfang (oben) und ein Ende (unten). Es gibt keine Pfeile und keine Sprünge kreuz und quer. Programme, die kreuz und quer springen, nennt man **Spaghetticode**, weil sich ihr Ablauf verheddert wie Nudeln auf dem Teller. Mehr dazu in Schritt 9.

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

## Andere Darstellungen: Der PAP

Es gibt noch zwei weitere Arten, Algorithmen darzustellen: den **Programmablaufplan**, kurz **PAP**, und den **Pseudocode**. Beide wirst du im Unterricht treffen. Auf Englisch heißt der PAP **flowchart**, auf Deutsch auch Flussdiagramm. Das englische Wort begegnet dir oft, zum Beispiel in Programmen und im Internet.

Hier siehst du noch einmal unser Struktogramm zum Teetrinken aus „Alle drei zusammen“. Als Nächstes schauen wir uns den PAP an, und zwar mit demselben Beispiel.

::: diagramm l1-grundbausteine.visustruct
Das Tee-Beispiel als Struktogramm: erst die Tasse, dann die Verzweigung für den Zucker, dann die Schleife.
:::

### Derselbe Algorithmus als PAP

::: grafik l01-pap.svg
Das Tee-Beispiel als Programmablaufplan. Der Pfeil von „1 Minute warten“ zurück nach oben bildet die Schleife.
:::

### Die Elemente

Ein PAP besteht aus wenigen Symbolen, die mit **Pfeilen** verbunden sind. Er ist nach DIN 66001 genormt.

- **Oval:** Start oder Ende. Jeder PAP hat genau einen Start und ein Ende.
- **Rechteck:** eine Anweisung, zum Beispiel *Tasse auf den Tisch stellen*.
- **Raute:** eine Verzweigung. In der Raute steht eine Frage, heraus führen zwei Pfeile: **ja** und **nein**.
- **Parallelogramm:** eine Ein- oder Ausgabe. Im Tee-Beispiel kommt sie nicht vor.
- **Pfeil:** zeigt, welcher Schritt als Nächstes kommt.

Eine Schleife hat im PAP kein eigenes Symbol. Du erkennst sie daran, dass ein Pfeil **zurück nach oben** führt.

### Die Vorteile

- **Sehr gut lesbar**, auch für Leute, die noch nie einen PAP gesehen haben. Man folgt einfach den Pfeilen mit dem Finger.
- Flussdiagramme benutzt man nicht nur beim Programmieren, sondern überall, wo ein Ablauf erklärt wird: in Bedienungsanleitungen, bei der Fehlersuche („Leuchtet die Lampe? Nein: Steckt der Stecker?“) oder in Firmen für Arbeitsabläufe.

## Übung: Kuchen backen als PAP

Jetzt baust du selbst einen PAP. Ludwig backt einen Kuchen und geht so vor:

Er gibt die Zutaten in die Schüssel und rührt den Teig. Ist der Teig noch nicht glatt, rührt er weiter. Ist er glatt, füllt er den Teig in die Form und backt den Kuchen 30 Minuten. Dann prüft er mit einem Holzstäbchen: Klebt noch Teig daran, backt er 5 Minuten weiter und prüft noch einmal. Ist das Stäbchen sauber, nimmt er den Kuchen heraus und ruft: „Der Kuchen ist fertig!“

::: pap
titel: Übung: Kuchen backen als PAP
auftrag: Die Plätze im Plan sind leer. Lege jedes Element an seinen Platz. Die Form des Platzes hilft dir.
start: Start
anweisung: Zutaten in die Schüssel geben
anweisung: Teig rühren
frage: Teig glatt? | nein -> Teig rühren
anweisung: Teig in die Form füllen
anweisung: Kuchen 30 Minuten backen
frage: Stäbchen sauber? | nein: 5 Minuten weiterbacken
anweisung: Kuchen herausnehmen
ausgabe: „Der Kuchen ist fertig!“
ende: Ende
erklärung: Zwei Schleifen, zwei Pfeile zurück nach oben: Beim Rühren führt der Pfeil zurück zu „Teig rühren“, beim Backen von „5 Minuten weiterbacken“ zurück zur Frage. Die Ausgabe steht im Parallelogramm.
:::

## Nachteile des PAP: Sprünge

Ein Pfeil im PAP darf von jedem Symbol zu jedem anderen führen. Das klingt praktisch, ist aber gefährlich.

Früher hat man Programme genau so geschrieben. Jede Zeile hatte eine **Nummer**, und der Befehl **GOTO**, auf Deutsch „gehe zu“, sprang zu einer Zeilennummer. Jedes GEHE ZU ist ein Pfeil aus dem PAP. Unser Tee-Beispiel sähe so aus:

```
10 Tasse auf den Tisch stellen
20 WENN kein Zucker gewünscht, GEHE ZU 40
30 Zucker hineingeben
40 WENN Tee nicht zu heiß, GEHE ZU 70
50 1 Minute warten
60 GEHE ZU 40
70 Tee trinken
```

### Eine Zeile mehr, und schon springt es falsch

Jetzt verbesserst du den Algorithmus: Nach dem Zucker soll der Teebeutel heraus. Du fügst die neue Zeile 40 ein, und alle Zeilen darunter rutschen eine Nummer weiter. Die Sprünge zeigen aber noch auf die alten Nummern:

```
10 Tasse auf den Tisch stellen
20 WENN kein Zucker gewünscht, GEHE ZU 40
30 Zucker hineingeben
40 Teebeutel herausnehmen
50 WENN Tee nicht zu heiß, GEHE ZU 70
60 1 Minute warten
70 GEHE ZU 40
80 Tee trinken
```

Spiel es durch: Zeile 70 schickt dich nicht mehr zur Prüfung in Zeile 50, sondern zum Teebeutel. Und wenn der Tee kühl genug ist, springt Zeile 50 zu Zeile 70 und nicht mehr zu *Tee trinken*. Du nimmst also immer wieder den Teebeutel heraus und trinkst nie. Bei jeder Änderung musst du jedes GEHE ZU prüfen. In einem großen Programm mit Hunderten Sprüngen geht dabei leicht etwas schief.

### Kreuz und quer: Spaghetticode

Mit Pfeilen kann man auch mitten aus einer Schleife herausspringen oder von außen mitten in eine Schleife hinein. Solche **Aussprünge** und Einsprünge machen den Plan schnell unübersichtlich. Bei vielen Sprüngen kreuzen sich die Pfeile, bis der Plan aussieht wie ein Teller Spaghetti. Deshalb nennt man das **Spaghetticode**. Den Ablauf kann man kaum noch verfolgen, und Fehler verstecken sich gut.

Im Struktogramm gibt es keine Pfeile. Fügst du einen Kasten ein, rutscht alles darunter einfach mit, und kein Sprung kann auf die falsche Stelle zeigen. Für das vorzeitige Verlassen einer Schleife gibt es dort einen eigenen, ordentlichen Kasten, den Aussprung. Den lernst du in Lektion 18 kennen.

::: angeberwissen
1968 schrieb der Informatiker Edsger Dijkstra einen berühmten Brief: „Go To Statement Considered Harmful“, auf Deutsch „GOTO gilt als schädlich“. Seitdem baut man Programme nur noch aus Sequenz, Verzweigung und Wiederholung. In Java ist `goto` bis heute ein reserviertes Wort, benutzen darf man es aber nicht. Mäh, Spaghetti esse ich lieber, als sie zu programmieren.
:::

## Pseudocode und Vergleich

**Pseudocode** ist Text, der wie ein Programm aussieht, aber in normaler Sprache geschrieben ist. Feste Wörter wie WENN und SOLANGE zeigen die Bausteine, die **Einrückung** zeigt, was dazugehört. Sprünge gibt es auch hier nicht. Das ist unser Tee-Beispiel:

```
Tasse auf den Tisch stellen
WENN Zucker gewünscht DANN
    Zucker hineingeben
ENDE WENN
SOLANGE Tee noch zu heiß
    1 Minute warten
ENDE SOLANGE
Tee trinken
```

### Im Vergleich

- **Struktogramm:** Kästen ineinander, die Schleife ist ein gekipptes L. Die Struktur siehst du auf einen Blick, wilde Sprünge sind unmöglich.
- **PAP:** Symbole mit Pfeilen, die Schleife ist ein Pfeil zurück nach oben. Sehr anschaulich, aber bei großen Plänen schnell unübersichtlich, und Sprünge kreuz und quer sind möglich.
- **Pseudocode:** Text mit Einrückung, die Schleife steht zwischen SOLANGE und ENDE SOLANGE. Schnell geschrieben und schon nah am Programmcode.

> Alle drei beschreiben denselben Algorithmus. Wenn du eine Form lesen kannst, lernst du die anderen schnell.

::: angeberwissen
Nassi und Shneiderman wollten den Pfeilen an den Kragen! Ihr Artikel von 1973 hieß „Flowchart Techniques for Structured Programming“. Flowchart ist das englische Wort für Ablaufplan. Mit Pfeilen kann man nämlich kreuz und quer springen, bis der Plan aussieht wie ein Teller Spaghetti. Im Struktogramm geht das gar nicht. Mäh, so mag ich das: ordentlich, wie mein Stall.
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

::: checkliste
- Ich kann erklären, was ein Algorithmus ist. → Ein Algorithmus ist eine genaue Anleitung
- Ich weiß, dass ein Struktogramm von oben nach unten gelesen wird. → So liest du ein Struktogramm
- Ich kenne die drei Grundbausteine Sequenz, Verzweigung und Wiederholung. → Baustein 1: Die Sequenz
- Ich erkenne jeden Baustein im Struktogramm an seiner Form. → Alle drei zusammen
- Ich kenne die Elemente eines PAP und kann einen einfachen PAP lesen. → Andere Darstellungen: Der PAP
- Ich kann einen einfachen Algorithmus selbst als PAP zusammenbauen. → Übung: Kuchen backen als PAP
- Ich kann erklären, warum Sprünge mit GOTO zu Fehlern und Spaghetticode führen. → Nachteile des PAP: Sprünge
- Ich kann einen einfachen Algorithmus auch als Pseudocode lesen. → Pseudocode und Vergleich
:::

## Wissenstest

::: quiz
? In welcher Richtung wird ein Struktogramm gelesen?
- [ ] Von links nach rechts
- [x] Von oben nach unten
- [ ] Von unten nach oben
> Jeder Kasten ist ein Schritt, und die Schritte folgen von oben nach unten aufeinander.

? Welcher Baustein gehört NICHT zu den drei Grundbausteinen?
- [ ] Sequenz
- [ ] Verzweigung
- [x] Sprung
- [ ] Wiederholung
> Sprünge gibt es im Struktogramm nicht. Sequenz, Verzweigung und Wiederholung reichen für jeden Algorithmus.

? Woran erkennst du im Struktogramm eine Verzweigung?
- [ ] An einem gekippten L
- [x] An einem Dreieck mit der Bedingung und zwei Spalten darunter
- [ ] An mehreren Rechtecken untereinander
> Das gekippte L gehört zur Schleife, Rechtecke untereinander sind eine Sequenz.

? Wann wird der Inhalt einer Schleife noch einmal ausgeführt?
- [x] Solange die Bedingung true ist
- [ ] Nur, wenn die Bedingung false ist
- [ ] Immer genau zweimal
> Vor jedem Durchlauf wird die Bedingung geprüft. Ist sie false, geht es unter der Schleife weiter.

? Was ist ein Algorithmus?
- [x] Eine eindeutige Schritt-für-Schritt-Anleitung zum Lösen einer Aufgabe
- [ ] Ein bestimmtes Programm in Java
- [ ] Ein Bild, das ein Programm erklärt
> Ein Algorithmus ist unabhängig von der Programmiersprache. Ein Struktogramm ist eine Möglichkeit, ihn aufzuschreiben.

? Woran erkennst du in einem Programmablaufplan (PAP) eine Schleife?
- [ ] An einem gekippten L
- [x] An einem Pfeil, der zurück nach oben führt
- [ ] Am Wort SOLANGE
> Das gekippte L gehört zum Struktogramm, SOLANGE zum Pseudocode.

? Ordne jedem Symbol im PAP seine Bedeutung zu.
= Oval -> Start oder Ende
= Rechteck -> Anweisung
= Raute -> Verzweigung
= Parallelogramm -> Ein- oder Ausgabe
> Die Raute hat zwei Ausgänge: ja und nein.

? Wie heißt der Programmablaufplan auf Englisch?
- [x] Flowchart
- [ ] Structure chart
- [ ] Pseudocode
> Auf Deutsch sagt man auch Flussdiagramm. Structure chart ist das Struktogramm.

? Du fügst in ein Programm mit GOTO eine neue Zeile ein. Was kann passieren?
- [x] Die Sprünge zeigen auf die falschen Zeilen, weil sich die Nummern verschoben haben
- [ ] Nichts, die Sprünge passen sich von selbst an
- [ ] Das Programm wird automatisch schneller
> Jedes GEHE ZU zeigt auf eine feste Zeilennummer. Rutschen die Zeilen weiter, springt das Programm an die falsche Stelle.

? Was zeigt im Pseudocode, welche Zeilen zu einer Schleife gehören?
- [ ] Die Farbe
- [x] Die Einrückung und das ENDE SOLANGE
- [ ] Ein Pfeil
> Alles zwischen SOLANGE und ENDE SOLANGE ist eingerückt und wird wiederholt.
:::
