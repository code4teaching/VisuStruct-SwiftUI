---
titel: PAP und Pseudocode
bereich: Erste Schritte
kurz: Algorithmen als Programmablaufplan und als Pseudocode darstellen und mit dem Struktogramm vergleichen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- einen PAP (englisch *flowchart*) lesen und selbst zusammenbauen
- erklären, warum Sprünge im PAP zu Fehlern führen
- einen einfachen Algorithmus als Pseudocode lesen
:::

## Andere Darstellungen: Der PAP

Es gibt noch zwei weitere Arten, Algorithmen darzustellen: den **Programmablaufplan**, kurz **PAP**, und den **Pseudocode**. Beide wirst du im Unterricht treffen. Auf Englisch heißt der PAP **flowchart**, auf Deutsch auch Flussdiagramm. Das englische Wort begegnet dir oft, zum Beispiel in Programmen und im Internet.

Hier siehst du noch einmal unser Struktogramm zum Teetrinken aus der letzten Lektion. Als Nächstes schauen wir uns den PAP an, und zwar mit demselben Beispiel.

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
legende: ja
:::

**Eigene PAPs zeichnen:** Mit **VisuFlow** zeichnest du deinen PAP ganz leicht selbst. Die Symbole liegen fertig in einer Leiste: Antippen hängt das nächste Symbol an und verbindet es gleich mit einem Pfeil. Zum Start kannst du das Tee-Beispiel laden. Deinen PAP speicherst du als Datei und exportierst ihn als Bild oder PDF, zum Beispiel für dein Heft oder eine Präsentation. [VisuFlow öffnen](https://visustruct.visucode.de/app/?visuflow)

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

Pseudocode hat **keine feste Schreibweise**. Manche schreiben FALLS statt WENN, andere setzen einen Pfeil für die Zuweisung (`zahl ← 5`) oder schreiben ganz ohne ENDE-Zeilen. Das ist alles erlaubt. Wichtig ist nur, dass jeder Mensch ihn ohne Erklärung versteht. Pseudocode ist also keine weitere Programmiersprache, die man lernen muss.

::: angeberwissen
Kommt dir Pseudocode bekannt vor? Die Programmiersprache Python sieht ihm sehr ähnlich, und das ist Absicht: Ihr Erfinder Guido van Rossum wollte, dass sich Programme fast wie normaler Text lesen. Auch Python zeigt mit der Einrückung, was zusammengehört. Aber Vorsicht: Python ist eine echte Programmiersprache mit festen Regeln. Ein Leerzeichen zu viel, und der Computer meckert. Pseudocode ist da großzügiger, so wie ich beim Frühstück.
:::

### Im Vergleich

- **Struktogramm:** Kästen ineinander, die Schleife ist ein gekipptes L. Die Struktur siehst du auf einen Blick, wilde Sprünge sind unmöglich.
- **PAP:** Symbole mit Pfeilen, die Schleife ist ein Pfeil zurück nach oben. Sehr anschaulich, aber bei großen Plänen schnell unübersichtlich, und Sprünge kreuz und quer sind möglich.
- **Pseudocode:** Text mit Einrückung, die Schleife steht zwischen SOLANGE und ENDE SOLANGE. Schnell geschrieben und schon nah am Programmcode.

> Alle drei beschreiben denselben Algorithmus. Wenn du eine Form lesen kannst, lernst du die anderen schnell.

::: angeberwissen
Nassi und Shneiderman wollten den Pfeilen an den Kragen! Ihr Artikel von 1973 hieß „Flowchart Techniques for Structured Programming“. Flowchart ist das englische Wort für Ablaufplan. Mit Pfeilen kann man nämlich kreuz und quer springen, bis der Plan aussieht wie ein Teller Spaghetti. Im Struktogramm geht das gar nicht. Mäh, so mag ich das: ordentlich, wie mein Stall.
:::

## Spiel: Welche Darstellung?

::: spiel frage
titel: Spiel: Welche Darstellung?
intro: Ludwig beschreibt eine Darstellung, ohne ihren Namen zu verraten. Ist es das Struktogramm, der PAP oder der Pseudocode? Acht Runden.
antworten: Struktogramm | PAP | Pseudocode

runde:
frage: „Bei mir zeigt ein Pfeil zurück nach oben, wenn etwas wiederholt wird.“
richtig: PAP
> Im PAP hat die Schleife kein eigenes Symbol. Ein Pfeil führt zurück nach oben.

runde:
frage: „Meine Schleife sieht aus wie ein gekipptes L.“
richtig: Struktogramm
> Oben und links umschließt der Kasten die Schritte, die wiederholt werden.

runde:
frage: „Ich bestehe aus Wörtern wie WENN und SOLANGE, und die Einrückung zeigt, was dazugehört.“
richtig: Pseudocode
> Pseudocode ist Text in normaler Sprache, der wie ein Programm aufgebaut ist.

runde:
frage: „Meine Verzweigung ist eine Raute mit den Ausgängen ja und nein.“
richtig: PAP
> Im Struktogramm steht die Bedingung dagegen in einem Dreieck.

runde:
frage: „Bei mir können sich die Pfeile kreuz und quer verheddern wie Spaghetti.“
richtig: PAP
> Weil Pfeile überallhin führen dürfen, ist im PAP Spaghetticode möglich.

runde:
frage: „Ich habe keine feste Schreibweise. FALLS statt WENN ist bei mir auch erlaubt.“
richtig: Pseudocode
> Wichtig ist nur, dass jeder Mensch ihn ohne Erklärung versteht.

runde:
frage: „Die Bedingung steht oben in einem Dreieck, darunter teile ich mich in zwei Spalten.“
richtig: Struktogramm
> So sieht die Verzweigung im Struktogramm aus: links true, rechts false.

runde:
frage: „Fügst du einen Kasten ein, rutscht alles darunter einfach mit. Kein Sprung kann danebengehen.“
richtig: Struktogramm
> Im Struktogramm gibt es keine Pfeile und keine Sprünge, deshalb kann nichts auf die falsche Stelle zeigen.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann die Elemente eines PAP benennen und einen einfachen PAP lesen. → Andere Darstellungen: Der PAP
- Ich kann einen einfachen Algorithmus selbst als PAP zusammenbauen. → Übung: Kuchen backen als PAP
- Ich kann erklären, warum Sprünge mit GOTO zu Fehlern und Spaghetticode führen. → Nachteile des PAP: Sprünge
- Ich kann einen einfachen Algorithmus als Pseudocode lesen. → Pseudocode und Vergleich
:::

## Wissenstest

::: quiz
? Woran erkennst du in einem Programmablaufplan (PAP) eine Schleife?
→ Andere Darstellungen: Der PAP
- [ ] An einem gekippten L
- [x] An einem Pfeil, der zurück nach oben führt
- [ ] Am Wort SOLANGE
> Das gekippte L gehört zum Struktogramm, SOLANGE zum Pseudocode.

? Ordne jedem Symbol im PAP seine Bedeutung zu.
→ Andere Darstellungen: Der PAP
= Oval -> Start oder Ende
= Rechteck -> Anweisung
= Raute -> Verzweigung
= Parallelogramm -> Ein- oder Ausgabe
> Die Raute hat zwei Ausgänge: ja und nein.

? Wie heißt der Programmablaufplan auf Englisch?
→ Andere Darstellungen: Der PAP
- [x] Flowchart
- [ ] Structure chart
- [ ] Pseudocode
> Auf Deutsch sagt man auch Flussdiagramm. Structure chart ist das Struktogramm.

? Du fügst in ein Programm mit GOTO eine neue Zeile ein. Was kann passieren?
→ Nachteile des PAP: Sprünge
- [x] Die Sprünge zeigen auf die falschen Zeilen, weil sich die Nummern verschoben haben
- [ ] Nichts, die Sprünge passen sich von selbst an
- [ ] Das Programm wird automatisch schneller
> Jedes GEHE ZU zeigt auf eine feste Zeilennummer. Rutschen die Zeilen weiter, springt das Programm an die falsche Stelle.

? Was zeigt im Pseudocode, welche Zeilen zu einer Schleife gehören?
→ Pseudocode und Vergleich
- [ ] Die Farbe
- [x] Die Einrückung und das ENDE SOLANGE
- [ ] Ein Pfeil
> Alles zwischen SOLANGE und ENDE SOLANGE ist eingerückt und wird wiederholt.
:::
