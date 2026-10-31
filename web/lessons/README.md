# Lektionen und Aufgaben

Alles in diesem Ordner erscheint im Lernbereich der Web-App. Nach einer Änderung `npm test` (prüft alle Dateien) und
`npm run build:site` ausführen.

```
lessons/
  de/01-was-ist-ein-struktogramm.md   Lektionen, die Nummer am Anfang bestimmt die Reihenfolge
  de/nachschlagen.md                  Seite „Nachschlagen“
  de/begriffe.md                      Fachbegriffe mit Erklärung (Hovern oder Antippen im Lektionstext)
  de/aufgaben/summe-bilden.md         Aufgaben
  diagramme/l1-tee.visustruct         Diagramme für Lektionen, Startdiagramme und Musterlösungen
```

Diagramme sind normale `.visustruct`-Dateien: in VisuStruct bauen, speichern und hier ablegen.

## Lektion

```markdown
---
titel: Der Editor
bereich: Erste Schritte
kurz: Elemente einfügen, Text eingeben, verschieben und löschen.
---

## Die Oberfläche

Normaler Text mit **fett**, *kursiv*, `Code`, Listen und [Links](https://…).

> Ein Zitat erscheint als hervorgehobener Hinweis.

## Nächster Schritt
…
```

Jede `## Überschrift` beginnt einen neuen Schritt (eine Seite mit „Weiter“). `bereich` gruppiert die Lektionen in der
Übersicht. Innerhalb eines Schritts gehen `###`-Zwischenüberschriften und Codeblöcke mit drei Backticks.

## Bausteine

Ein Diagramm mit Vorschau und Knopf „Im Editor öffnen“, die Zeilen bis `:::` sind die Bildunterschrift:

```
::: diagramm l2-ausgabe.visustruct
Eine Ausgabe mit Text in Anführungszeichen.
:::
```

Ein Java-Beispiel im Text mit Knopf „Im Editor öffnen“: Statt ```` ```java ```` schreibt man ```` ```java editor ````. Der Knopf
öffnet das Beispiel in einem neuen Reiter, die Spalte Code auf Java; dort kann man es ausführen und verändern.
Der Test prüft, dass jedes solche Beispiel ohne Fehler geparst wird.

Eine Übung, die VisuStruct beim Klick auf „Prüfen“ automatisch kontrolliert:

```
::: übung l2-hallo
titel: Hallo Welt
auftrag: Baue ein Struktogramm, das „Hallo Welt“ ausgibt.
  Weitere Zeilen gehören noch zum Auftrag.
start: l2-start.visustruct
test: - -> Hallo Welt
test: 3, 4 -> 7 | fertig
braucht: verzweigung, whileSchleife
tipp: Du brauchst nur einen einzigen Kasten.
tipp: Ziehe eine Anweisung auf den Platzhalter und wähle oben „Ausgabe“.
lösung: l2-hallo-loesung.visustruct
:::
```

- `test:` Eingaben durch Kommas getrennt, dann `->`, dann die erwarteten Ausgabezeilen durch `|` getrennt.
  `-` heißt „keine Eingabe“. Leerzeichen am Rand zählen nicht, `2.0` gilt wie `2`. Mehrere `test:`-Zeilen sind erlaubt.
- `start:` (optional) Diagramm, mit dem die Übung beginnt; sonst ein leeres Diagramm.
- `braucht:` (optional) Elemente, die vorkommen müssen: `anweisung`, `verzweigung`, `fallauswahl`, `forSchleife`,
  `whileSchleife`, `doUntilSchleife`, `endlosschleife`, `aussprung`, `aufruf`.
- `tipp:` gestufte Tipps, eine Zeile je Tipp, vom allgemeinen zum genauen. Jeder Klick auf **Tipp** deckt den nächsten auf. Jede Übung hat mindestens zwei.
- `lösung:` (optional) Musterlösung. Sichtbar ist sie nur im Lehrermodus (Lehrercode unten in der Lektions- oder Aufgabenliste, im Code steht nur sein SHA-256-Hash in `src/learn/teacher.ts`). Der Test prüft, dass sie alle Tests besteht.
- `unterprogramm:` (optional) Unterprogramme zur Musterlösung, durch Komma getrennt. Ihr Titel ist der Name im Aufruf. Beim Prüfen findet VisuStruct Unterprogramme in den anderen offenen Reitern.
- `datei:` (optional, nach einem `test:`) Diese Datei soll das Programm in diesem Test speichern, zum Beispiel
  `datei: einkauf-neu.txt -> Heu | Äpfel | Kuchen`. Verglichen wird Zeile für Zeile wie bei den Ausgaben.
- `code: java` (optional) Die Übung wird im Bereich Code in Java gelöst. „Im Editor öffnen“ öffnet die Spalte gleich mit und stellt sie auf Java. Geprüft wird wie sonst das Struktogramm, das beim Tippen entsteht. Eine Musterlösung ist Pflicht, der Test tippt sie als Java und prüft sie.
- `bereich: struktogramm | code | beide` (optional) Wo man die Übung löst. Die Karte zeigt es farbig an (Struktogramm grün, Code violett), und „Im Editor öffnen“ zeigt genau diese Bereiche: Lektionen bleiben offen, alles andere (Dateien, mBot2 live, bei `struktogramm` der Code, bei `code` das Struktogramm) wird geschlossen. Ohne Angabe gilt `code` bei `code: java`, sonst `struktogramm`. Für Übungen, bei denen man Code tippt und das Struktogramm liest (oder umgekehrt), `beide` nehmen.
- Die Kennung (`l2-hallo`) muss überall eindeutig sein, denn unter ihr wird der Fortschritt gespeichert.

Eine Checkliste zum Abhaken:

```
::: checkliste
- Ich kann ein Element einfügen.
- Ich kann einen Kasten löschen. → Verschieben, kopieren, löschen
:::
```

Steht hinter einem Punkt `→` und der Titel eines Schritts dieser Lektion, zeigt die Checkliste daneben **Nachlesen**. Ein Klick springt zu diesem Schritt. Ein falscher Titel fällt beim Bauen und in den Tests auf.

Die Punkte sind kompetenzorientiert formuliert („Ich kann …“). Rechts neben jedem Punkt schätzt man sich ein: ☂️ noch nicht,
⛅ teilweise, ☀️ kann ich sicher; danach folgt **Nachlesen**. Die Wahl steht wie der übrige Lernstand in `learnProgress.json` (ältere Häkchen gelten als ☀️).

Am Anfang einer Lektion stehen die Kompetenzen, die man erwirbt, als eigener erster Schritt „Diese Kompetenzen erwerbe
ich jetzt“; die Lektion selbst beginnt mit Schritt 2. Der Kasten beginnt mit „Am Ende dieser Lektion kann ich …“, die Punkte
also so formulieren, dass sie daran anschließen:

```
## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- erklären, was ein Algorithmus ist
- ein Struktogramm lesen
:::
```

Eine Quizfrage kann mit `→ Titel eines Schritts` sagen, was sie prüft. Ist der Wissenstest fertig, zeigt er darunter die
Checkliste noch einmal mit den Abweichungen: ☀️ gewählt, aber eine Frage zu diesem Schritt falsch (mit **Nachlesen**),
oder ⛅/☂️ gewählt und alle Fragen dazu richtig. Zu jedem Schritt aus `→` muss es einen Checklistenpunkt geben.

```
::: quiz
? In welcher Richtung wird ein Struktogramm gelesen?
→ So liest du ein Struktogramm
- [x] Von oben nach unten
- [ ] Von links nach rechts
:::
```

Ein oder mehrere Bilder aus `lessons/bilder/` nebeneinander, die Zeilen bis `:::` sind die Bildunterschrift (dort auch den
Bildnachweis angeben):

```
::: bild ike-nassi.jpg ben-shneiderman.jpg
Links Ike Nassi, rechts Ben Shneiderman (Fotos: …).
:::
```

Eine Erklärgrafik in voller Breite aus `lessons/bilder/`, am besten als SVG (bleibt auf jedem Bildschirm scharf). Die
Zeilen bis `:::` sind die Bildunterschrift:

```
::: grafik l14-array.svg
Fünf Fächer mit den Indizes 0 bis 4.
:::
```

Steht hinter der Grafik eine zweite Datei, ist das eine beschriftete Fassung. Ein Klick auf die Grafik blendet sie ein und
wieder aus, darunter steht ein Hinweis darauf:

```
::: grafik l03-lochkarte.svg l03-lochkarte-beschriftet.svg
So sah eine Lochkarte aus.
:::
```

Tabellen schreibst du mit senkrechten Strichen, die zweite Zeile trennt die Überschrift ab:

```
| Schritt | summe | i |
|---|---|---|
| `int summe = 0` | 0 | – |
```

Ein Zeiger auf den Editor ist ein Link auf `#zeige-…`, zum Beispiel `[Elemente](#zeige-elemente)`. Beim Hovern oder Antippen
leuchtet der Bereich im Editor auf. Bekannte Bereiche: leiste, elemente, struktogramm, objektinspektor, reiter, titel, neu,
oeffnen, speichern, exportieren, rueckgaengig, textgroesse, einstellungen, lernen, code, simulation (Liste in `src/ui/termTips.ts`).

Ein Kasten „Angeberwissen mit Ludwig“, in dem unser Maskottchen Ludwig der Geißbock eine Hintergrundgeschichte erzählt.
Der Text darf Markdown und Links enthalten:

```
::: angeberwissen
Ben Shneiderman hatte die Idee 1972. [Mehr dazu](https://visustruct.org/de/angeberwissen.html)
:::
```

Ein Spiel „Wahr oder falsch?“: oben die Variablen (`name: von..bis` für ganze Zahlen, `name: boolean`), darunter mit `?` die
Bedingungen vom leichten zum schweren. Zehn Runden; Werte knapp an den Grenzen der Vergleiche kommen öfter vor:

```
::: spiel
alter: 8..20
schueler: boolean
? alter >= 18
? alter >= 12 && alter < 18 || schueler
:::
```

Rundenspiele `::: spiel zuhoerer`, `vertrag` und `layout` (Swing) sind in `src/learn/roundGame.ts` beschrieben. Dort steht
auch „Bombe entschärfen“: Code mit genau einem Fehler, man tippt vor Ablauf der Zeit auf die falsche Zeile.

In `zuhoerer` darf ein Zuhörer auch als Variable stehen (`ActionListener z = e -> …;` oder als Block bis `};`) und mit
`knopf.addActionListener(z);` an mehreren Knöpfen hängen. Im Zuhörer gehen `if`/`else` (auch verschachtelt),
`e.getActionCommand()` (Beschriftung des geklickten Knopfs) und `e.getSource() == knopf`.

`::: spiel reihenfolge` („Wer ist dran?“): Die Antworten jeder Runde stehen in der richtigen Reihenfolge da, ohne `[x]`,
mindestens drei. Das Spiel mischt sie, man tippt sie der Reihe nach an.

```
::: spiel bombe
titel: Spiel: Bombe entschärfen
intro: In jedem Programm steckt genau ein Fehler.
zeit: 25

runde:
    for (int i = 1; i <= 3; i++) {
        System.out.println(i)
    }
frage: Soll 1, 2 und 3 ausgeben.
fehler: 2
besser: System.out.println(i);
> Am Ende der Anweisung fehlt das Semikolon.
:::
```

`fehler:` ist die Nummer der falschen Zeile (ab 1), `besser:` die richtige Zeile. Der Test setzt sie ein und prüft, dass
Java dann keinen Fehler mehr meldet.

Mit `daten: csv` (vor der ersten Runde) ist der Code einer Bombe eine CSV-Datei. Der Test prüft dann, dass jede Zeile mit
`besser:` so viele Felder hat wie die Kopfzeile und die falsche Zeile nicht.

`::: spiel frage` zeigt in jeder Runde Code (er darf auch fehlen) und eine Frage mit Antworten. `\n` in einer Antwort
beginnt eine neue Zeile, solche Antworten erscheinen als kleine Datei. Mit `antworten: txt | CSV | JSON` vor der ersten
Runde gelten die Antworten für alle Runden, je Runde steht dann `richtig: CSV`:

```
::: spiel frage
titel: Spiel: Was steht in der Datei?
intro: Sag voraus, was danach in der Datei steht.
frage: Was steht danach in der Datei?

runde:
    PrintWriter aus = new PrintWriter("gruss.txt");
    aus.println("Hallo");
    aus.println("Zora");
    aus.close();
- [x] Hallo\nZora
- HalloZora
> `println` beginnt nach jedem Text eine neue Zeile.
:::
```

„Prinzessin retten“ (`::: spiel prinzessin`, beschrieben in `src/learn/rescueGame.ts`): An jeder Station kommt eine Zahl
heraus, `alphabet.charAt(zahl)` füllt damit ein Feld im Kreuzworträtsel. Die Felder bei `lösung:` ergeben das Wort, das am
Ende in den Code bei `tor:` (statt `___`) eingetippt wird. Der Test prüft, dass jeder Buchstabe ins Rätsel passt.

```
::: spiel prinzessin
titel: Spiel: Prinzessin retten
intro: …

station: Am Burggraben
    int zahl = "   Zora   ".trim().length();
frage: Welche Zahl steht in `zahl`?
zahl: 4
feld: 5 1
tipp: `trim()` schneidet die Leerzeichen ab.
> Übrig bleibt "Zora" mit 4 Zeichen.

kreuzwort: Fülle die Felder mit Fachbegriffen aus Java.
- → 4 1 STRING: Datentyp für Text
- ↓ 2 1 ELSE: Der „sonst“-Teil einer Verzweigung
lösung: 4 1, 2 1

tor: Trag das geheime Wort ein.
    String wort = "___";
ende: Zora ist frei!
:::
```

`feld:` und die Wörter haben Zeile und Spalte ab 1, `→` ist waagrecht, `↓` senkrecht.

Ein Kasten „Ludwigs Tipp“: Ludwig gibt einen Hinweis zum Vorgehen, z. B. eine Brücke zu einer früheren Lektion:

```
::: ludwig
Wie beim Tauschen gilt: Überschreibe keinen Wert, den du noch brauchst.
:::
```

Eine digitale Caesar-Scheibe zum Drehen: außen der Klartext, innen der Geheimtext, darunter ein Eingabefeld, das live ver- oder
entschlüsselt. Hinter `caesar` steht der Startschlüssel (0 bis 25), die Zeile darin ist der Starttext:

```
::: caesar 3
LUDWIG
:::
```

In der Simulation rechnet ein `char` wie in Java mit seinem Zeichencode: `(int) wort.charAt(i)` liefert z. B. 65 für A,
`'A'` zählt in einer Rechnung als 65 und `(char) 68` ergibt `'D'`.

Eine Textdatei zum Einlesen. Der Inhalt bleibt Zeile für Zeile so, wie er dasteht. Java liest ihn mit
`Files.readString(Path.of("brief.txt"))`, `new Scanner(new File(…))` oder `new BufferedReader(new FileReader(…))`, in der
Simulation, im Python- und JavaScript-Export und im echten Java. Was ein Programm mit `PrintWriter` speichert, zeigt
VisuStruct nach dem Lauf unter der Ausgabe:

```
::: datei brief.txt
Lieber Ludwig,
der Fuchs hat mich in seinen Turm gesperrt.
:::
```

Der Name endet auf `.txt`, `.csv` oder `.json` und gilt für alle Lektionen einer Sprache. Verschiedene Dateien brauchen deshalb verschiedene Namen.

Ein Lückentext: fertiger Java-Code, in dem einzelne Wörter fehlen. Jede Lücke `[[…]]` wird ein Eingabefeld, „Prüfen“
färbt richtige Lücken grün und falsche rot, nach einem Fehlversuch zeigt „Lösung zeigen“ die Antworten. Weitere richtige
Antworten stehen mit ` | ` (Leerzeichen davor und danach) in derselben Lücke. Leerzeichen zählen beim Vergleich nicht,
Groß- und Kleinschreibung schon. `erklärung:` erscheint, wenn alles stimmt. Ein Test prüft, dass der Code mit jeder
richtigen Antwort fehlerfreies Java ist:

````
::: lückentext
titel: Summe von 1 bis 10
auftrag: Ergänze die fehlenden Wörter.
```java
int summe = 0;
for ([[int]] i = 1; i [[<=]] 10; [[i++ | i += 1 | i = i + 1]]) {
    summe = summe + i;
}
```
erklärung: Ausgabe: Summe: 55
:::
````

Mehrere ```java-Blöcke stehen untereinander, z. B. eine Methode und das Hauptprogramm wie in eigenen Reitern; jeder wird
für sich geprüft.

Für „Fehler finden“ eignet sich eine normale Übung mit `code: java`, deren `start:`-Diagramm einen Fehler enthält.

„PAP bauen“: Ein Programmablaufplan mit leeren Plätzen, darunter liegen die fertigen Elemente gemischt. Man tippt ein
Element und dann seinen Platz an oder zieht es hin. `start:`/`ende:` sind Ovale, `anweisung:` Rechtecke, `eingabe:`/
`ausgabe:` Parallelogramme, `frage:` Rauten. Die Zeilen stehen von oben nach unten. Eine Frage braucht nach ` | ` ihren
zweiten Ausgang: `nein -> Text` ist ein Pfeil zurück nach oben zum Element mit diesem Text, `nein: Text` eine Anweisung
rechts daneben, von der ein Pfeil zurück zur Raute führt. Statt `nein` geht auch `ja`. `legende: ja` zeigt unter dem Plan die vier Symbole mit
ihrer Bedeutung. Die Schlüsselwörter bleiben auch in
en/pt deutsch, die Beschriftung ja/nein kommt aus der Oberflächensprache.

```
::: pap
titel: Übung: Kuchen backen als PAP
auftrag: Lege jedes Element an seinen Platz.
start: Start
anweisung: Teig rühren
frage: Teig glatt? | nein -> Teig rühren
frage: Stäbchen sauber? | nein: 5 Minuten weiterbacken
ausgabe: „Der Kuchen ist fertig!“
ende: Ende
erklärung: Wird gezeigt, wenn alles stimmt.
:::
```

Ein Quiz, `[x]` markiert richtige Antworten, `>` ist die Erklärung nach dem Antworten:

```
::: quiz
? Was bedeutet ø?
- [x] Ein leerer Platzhalter
- [ ] Eine Ausgabe
> Den Platzhalter ersetzt du durch ein Element.
:::
```

Eine Quizfrage kann statt Antworten auch eine Zuordnung sein: jede Zeile `= links -> rechts`. Neben jedem linken Begriff
erscheint eine Auswahl mit allen rechten Begriffen (alphabetisch). Die rechten Seiten müssen verschieden sein.

```
::: quiz
? Ordne jedem Begriff den anderen Namen zu.
= Fallauswahl -> Mehrfachauswahl
= Schleife -> Wiederholungsstruktur
:::
```

## Aufgabe

Wie eine Lektion, aber ohne Schritte. `nach` ist die Nummer der Lektion, die man vorher kennen sollte, `stufe` die
Schwierigkeit von 1 bis 3 (Sterne).

```markdown
---
titel: Summe bilden
nach: 2
stufe: 1
---

Kurze Einleitung.

::: übung aufgabe-summe
…
:::
```

## Hinweis zur Ausgabe

In einer Ausgabe hängt `+` Texte aneinander, auch bei Zahlen: `zahl1 + zahl2` gibt bei 3 und 4 „34“ aus. Für eine
Summe zuerst rechnen (`int summe = zahl1 + zahl2`) und dann `summe` ausgeben.

## Fachbegriffe

In `de/begriffe.md` steht jeder Begriff als `### Begriff`, darunter optional `auch: Form, Form` und die Erklärung in ein bis
zwei Sätzen. In den Lektionen und Aufgaben wird jeder Begriff einmal pro Schritt markiert und zeigt beim Hovern oder
Antippen seine Erklärung. Steht der Begriff im Schritt **fett**, wird er dort gerade erklärt und bleibt unmarkiert. Code,
Überschriften und Links werden nie markiert. Unter „Nachschlagen“ erscheinen alle Begriffe als Liste.

## Englisch

Die englische Fassung liegt unter gleichen Dateinamen in `en/` (Lektionen, `begriffe.md`, `nachschlagen.md`,
`aufgaben/`). Diagramme mit englischen Variablen und Texten liegen in `diagramme/en/`, Grafiken in `bilder/en/`.
Deutsch zeigt `de/`, Portugiesisch (pt-PT) zeigt `pt/`, alle anderen Oberflächensprachen zeigen `en/`. Fehlt eine Datei in einer Sprache, gilt die englische (Rückfall ist immer Englisch).
Kennungen von Übungen und die Blöcke (`::: übung`, `titel:`, `tipp:` …) bleiben gleich, nur der Inhalt wird übersetzt.
In `begriffe.md` darf statt `auch:` auch `also:` stehen. Die Lektionen verwenden die englischen Wörter der Oberfläche
(Elements, Object Inspector, Statement, Branch, Switch …). Wer eine deutsche Lektion ändert, sollte die englische
mitziehen; die Tests prüfen, dass es jede Datei in allen Sprachen gibt und jede Musterlösung ihre Tests besteht.

## Portugiesisch (Portugal)

Die pt-PT-Fassung liegt in `pt/`, `diagramme/pt/` und `bilder/pt/` (Diagramme, die mit `en/` identisch wären, fehlen dort
und kommen per Rückfall aus `en/`). Die Lektionen verwenden die Wörter aus `pt-PT.lproj/Localizable.strings`
(Elementos, Inspetor de objetos, Instrução, Decisão, Seleção, Ciclo while …) und sprechen mit „tu“ an.
Lokal angepasst: Noten auf der portugiesischen Skala 1–5 (5 ist die beste), IVA 23 %, Wahlalter 18.
