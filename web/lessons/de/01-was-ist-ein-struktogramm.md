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

> Ein Struktogramm hat immer genau einen Anfang (oben) und ein Ende (unten). Es gibt keine Pfeile und keine Sprünge kreuz und quer. Programme, die kreuz und quer springen, nennt man **Spaghetticode**, weil sich ihr Ablauf verheddert wie Nudeln auf dem Teller. Mehr dazu in Schritt 8.

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
- Die Schritte, die wiederholt werden, stehen **eingerückt** darunter. Links bildet der Kasten eine **Klammer** um sie.
- Vor jedem Durchlauf wird die Bedingung geprüft. Solange sie **true** ist, werden die Schritte in der Klammer noch einmal ausgeführt. Ist sie **false**, geht es unter der Schleife weiter.

::: diagramm l1-wiederholung.visustruct
Solange der Teller nicht leer ist, wird ein Bissen gegessen. Danach wird der Teller abgeräumt.
:::

> Es gibt noch weitere Arten von Schleifen. Du lernst sie in späteren Lektionen kennen.

## Alle drei zusammen

Richtig nützlich werden die Bausteine, wenn man sie kombiniert. Das Diagramm enthält alle drei: eine Sequenz von oben nach unten, eine [Verzweigung]{.blau} und eine [Schleife]{.rosa}. Gelb sind die einfachen [Anweisungen]{.gelb}. Auch die Anweisungen in einer Verzweigung oder Schleife sind gelb. Genau genommen ist das ganze Diagramm eine Sequenz, denn auch Verzweigung und Schleife stehen in der Reihe von oben nach unten.

::: diagramm l1-grundbausteine.visustruct
Die Verzweigung erkennst du am Dreieck, die Schleife an der Klammer links. Alles zusammen steht in einer Sequenz.
:::

Die Kästen können auch **ineinander geschachtelt** werden: In einer Schleife oder einem Zweig können wieder Sequenzen, Verzweigungen und Schleifen stehen.

::: angeberwissen
Trostpflaster für alle mit einer verpatzten Arbeit: Die berühmte Fachzeitschrift *Communications of the ACM* hat den Struktogramm-Artikel abgelehnt. Laut Nassi meinte der Gutachter sogar, sie sollten alle Exemplare einsammeln und verbrennen. Autsch! Er erschien 1973 dann in einem kleineren Heft und wird heute tausendfach zitiert. Ätsch!
:::

## Andere Darstellungen: PAP und Pseudocode

Ein Struktogramm ist nicht die einzige Art, einen Algorithmus aufzuschreiben. Zwei weitere wirst du im Unterricht treffen. Hier siehst du das Tee-Beispiel aus „Alle drei zusammen“ in allen drei Formen.

### Struktogramm

::: diagramm l1-grundbausteine.visustruct
Das Tee-Beispiel als Struktogramm: erst die Tasse, dann die Verzweigung für den Zucker, dann die Schleife.
:::

### Programmablaufplan (PAP)

Der **Programmablaufplan**, kurz **PAP**, besteht aus Symbolen, die mit **Pfeilen** verbunden sind. Er ist nach DIN 66001 genormt. Eine Raute ist eine Verzweigung mit den Ausgängen ja und nein. Eine Schleife erkennst du daran, dass ein Pfeil **zurück nach oben** führt.

::: grafik l01-pap.svg
Das Tee-Beispiel als Programmablaufplan. Der Pfeil von „1 Minute warten“ zurück nach oben bildet die Schleife.
:::

### Pseudocode

**Pseudocode** ist Text, der wie ein Programm aussieht, aber in normaler Sprache geschrieben ist. Feste Wörter wie WENN und SOLANGE zeigen die Bausteine, die **Einrückung** zeigt, was dazugehört.

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

- **Struktogramm:** Kästen ineinander, die Schleife ist eine Klammer links. Die Struktur siehst du auf einen Blick, wilde Sprünge sind unmöglich.
- **PAP:** Symbole mit Pfeilen, die Schleife ist ein Pfeil zurück nach oben. Sehr anschaulich, aber bei großen Plänen schnell unübersichtlich.
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

::: angeberwissen
Programme, die kreuz und quer springen, heißen **Spaghetticode**: Wer einem Faden folgen will, verheddert sich wie in einem Teller Spaghetti. Schuld war früher der Befehl GOTO, also „springe zu Zeile …“. 1968 schrieb der Informatiker Edsger Dijkstra deshalb einen berühmten Brief: „Go To Statement Considered Harmful“, auf Deutsch „GOTO gilt als schädlich“. Seitdem baut man Programme nur noch aus Sequenz, Verzweigung und Wiederholung. In Java ist `goto` bis heute ein reserviertes Wort, benutzen darf man es aber nicht. Mäh, Spaghetti esse ich lieber, als sie zu programmieren.
:::

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
- Ich kann einen einfachen Algorithmus auch als PAP und als Pseudocode lesen. → Andere Darstellungen: PAP und Pseudocode
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
- [ ] An einer Klammer auf der linken Seite
- [x] An einem Dreieck mit der Bedingung und zwei Spalten darunter
- [ ] An mehreren Rechtecken untereinander
> Die Klammer gehört zur Schleife, Rechtecke untereinander sind eine Sequenz.

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
- [ ] An einer Klammer auf der linken Seite
- [x] An einem Pfeil, der zurück nach oben führt
- [ ] Am Wort SOLANGE
> Die Klammer gehört zum Struktogramm, SOLANGE zum Pseudocode.

? Ordne jedem Symbol im PAP seine Bedeutung zu.
= Oval -> Start oder Ende
= Rechteck -> Anweisung
= Raute -> Verzweigung
= Parallelogramm -> Ein- oder Ausgabe
> Die Raute hat zwei Ausgänge: ja und nein.

? Was zeigt im Pseudocode, welche Zeilen zu einer Schleife gehören?
- [ ] Die Farbe
- [x] Die Einrückung und das ENDE SOLANGE
- [ ] Ein Pfeil
> Alles zwischen SOLANGE und ENDE SOLANGE ist eingerückt und wird wiederholt.
:::
