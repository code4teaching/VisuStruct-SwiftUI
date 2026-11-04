---
titel: PAP und Pseudocode
bereich: Losfahren
kurz: Den Plan für das Quadrat als Programmablaufplan und als Pseudocode aufschreiben und mit dem Struktogramm vergleichen.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- einen PAP (englisch *flowchart*) für den mBot2 lesen und selbst zusammenbauen
- einen Plan als Pseudocode lesen
- Struktogramm, PAP und Pseudocode vergleichen
:::

## Drei Arten, einen Plan aufzuschreiben

Den Plan für das Quadrat kennst du als **Struktogramm**: eine Schleife, die viermal läuft, darin eine Seite fahren und rechts drehen.

Es gibt noch zwei weitere Arten, denselben Plan aufzuschreiben. Beide wirst du im Unterricht und im Internet oft treffen:

- den **Programmablaufplan**, kurz **PAP**, auf Englisch **flowchart**, auf Deutsch auch Flussdiagramm,
- den **Pseudocode**, einen Plan aus Text in normaler Sprache.

Den mBot2 kannst du damit nicht direkt steuern. Aber mit allen drei kannst du einen Plan aufschreiben, bevor du ihn als Struktogramm oder in Java baust.

## Der PAP

Ein PAP besteht aus wenigen Symbolen, die mit **Pfeilen** verbunden sind:

- **Oval:** Start oder Ende.
- **Rechteck:** eine Anweisung, zum Beispiel *50 cm vorwärts fahren*.
- **Raute:** eine Frage mit zwei Ausgängen: **ja** und **nein**.
- **Parallelogramm:** eine Ein- oder Ausgabe, zum Beispiel ein Text auf dem Bildschirm.
- **Pfeil:** zeigt, welcher Schritt als Nächstes kommt.

Eine Schleife hat im PAP kein eigenes Symbol. Du erkennst sie an einem Pfeil, der **zurück nach oben** führt. So lange die Antwort in der Raute **nein** ist, geht es zurück, und die Schritte laufen noch einmal.

> Vorsicht: Ein Pfeil darf im PAP überallhin zeigen, auch kreuz und quer. Bei großen Plänen wird das schnell unübersichtlich. Das nennt man **Spaghetticode**. Im Struktogramm kann das nicht passieren, weil es keine Pfeile gibt.

## Übung: Das Quadrat als PAP

Der mBot2 fährt eine Seite, dreht sich rechts und zählt die Seite mit. Nach vier Seiten zeigt er auf dem Bildschirm „Quadrat fertig!“.

::: pap
titel: Übung: Das Quadrat als PAP
auftrag: Die Plätze im Plan sind leer. Lege jedes Element an seinen Platz. Die Form des Platzes hilft dir.
start: Start
anweisung: 50 cm vorwärts fahren
anweisung: rechts drehen
anweisung: Seite mitzählen
frage: 4 Seiten gefahren? | nein -> 50 cm vorwärts fahren
ausgabe: „Quadrat fertig!“ anzeigen
ende: Ende
erklärung: Solange noch keine vier Seiten gefahren sind, führt der Pfeil von der Raute zurück zu „50 cm vorwärts fahren“. Das ist die Schleife. Die Anzeige auf dem Bildschirm ist eine Ausgabe und steht deshalb im Parallelogramm.
legende: ja
:::

## Pseudocode

**Pseudocode** ist Text, der wie ein Programm aufgebaut ist, aber in normaler Sprache geschrieben wird. Feste Wörter wie WIEDERHOLE, WENN und SOLANGE zeigen die Bausteine, die **Einrückung** zeigt, was dazugehört. Das Quadrat sieht so aus:

```
WIEDERHOLE 4-mal
    50 cm vorwärts fahren
    rechts drehen
ENDE WIEDERHOLE
"Quadrat fertig!" anzeigen
```

Und so sieht derselbe Plan in Java aus:

```java
for (int i = 0; i < 4; i++) {
    mbot.forward(50);
    mbot.turnRight();
}
mbot.showText("Quadrat fertig!");
```

Pseudocode hat **keine feste Schreibweise**. Manche schreiben FÜR i VON 1 BIS 4, andere WIEDERHOLE 4-mal. Wichtig ist nur, dass jeder Mensch ihn ohne Erklärung versteht. Den Computer kannst du damit nicht steuern, dafür brauchst du Java.

### Im Vergleich

- **Struktogramm:** Kästen ineinander, die Schleife ist ein gekipptes L. Die Struktur siehst du auf einen Blick.
- **PAP:** Symbole mit Pfeilen, die Schleife ist ein Pfeil zurück nach oben. Sehr anschaulich, aber bei großen Plänen unübersichtlich.
- **Pseudocode:** Text mit Einrückung, die Schleife steht zwischen WIEDERHOLE und ENDE WIEDERHOLE. Schnell geschrieben und schon nah an Java.

::: angeberwissen
Määäh, wer hat die Ablaufpläne erfunden? Eine Frau und ihr Mann: **Lillian und Frank Gilbreth** stellten 1921 ihre „Process Charts“ vor, lange vor dem ersten Computer. Damit zeichneten sie Arbeitsabläufe in Fabriken auf, um sie einfacher zu machen. Lillian Gilbreth hatte einen Doktortitel in Psychologie und wurde 1965 als erste Frau in die amerikanische Akademie der Ingenieure gewählt. Programmierer haben die Idee später für ihre Pläne übernommen.
:::

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektion [„PAP und Pseudocode“](?visustruct&lektion=01-weitere-darstellungen) mit Kuchenbacken als PAP und dem Befehl GOTO. Sie öffnet sich in einem neuen Fenster.

## Spiel: Welche Darstellung?

::: spiel frage
titel: Spiel: Welche Darstellung?
intro: Ludwig beschreibt einen Plan für den mBot2, ohne zu sagen, wie er aufgeschrieben ist. Ist es das Struktogramm, der PAP oder der Pseudocode? Sechs Runden.
antworten: Struktogramm | PAP | Pseudocode

runde:
frage: „Ein Pfeil führt von der Raute zurück zu ‚50 cm vorwärts fahren‘.“
richtig: PAP
> Eine Schleife im PAP erkennst du am Pfeil zurück nach oben.

runde:
frage: „Die Schleife sieht aus wie ein gekipptes L, darin stehen fahre vor und drehe rechts.“
richtig: Struktogramm
> Das gekippte L ist die Schleife im Struktogramm.

runde:
frage: „WIEDERHOLE 4-mal, darunter eingerückt zwei Zeilen.“
richtig: Pseudocode
> Feste Wörter und Einrückung: Das ist Pseudocode.

runde:
frage: „‚Quadrat fertig!‘ steht in einem schrägen Kasten.“
richtig: PAP
> Der schräge Kasten ist das Parallelogramm für Ein- und Ausgabe.

runde:
frage: „Es gibt keine Pfeile. Fügst du einen Kasten ein, rutscht alles darunter einfach mit.“
richtig: Struktogramm
> Ohne Pfeile kann im Struktogramm kein Sprung auf die falsche Stelle zeigen.

runde:
frage: „Manche schreiben FÜR i VON 1 BIS 4, andere WIEDERHOLE 4-mal. Beides ist richtig.“
richtig: Pseudocode
> Pseudocode hat keine feste Schreibweise.
:::

## Checkliste

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann die Elemente eines PAP benennen. → Der PAP
- Ich kann das Quadrat selbst als PAP zusammenbauen. → Übung: Das Quadrat als PAP
- Ich kann einen Plan als Pseudocode lesen. → Pseudocode
- Ich kann Struktogramm, PAP und Pseudocode vergleichen. → Drei Arten, einen Plan aufzuschreiben
:::

## Wissenstest

::: quiz
? Woran erkennst du im PAP eine Schleife?
→ Der PAP
- [ ] An einem gekippten L
- [x] An einem Pfeil, der zurück nach oben führt
- [ ] Am Wort WIEDERHOLE
> Das gekippte L gehört zum Struktogramm, WIEDERHOLE zum Pseudocode.

? Ordne jedem Symbol im PAP seine Bedeutung zu.
→ Der PAP
= Oval -> Start oder Ende
= Rechteck -> Anweisung
= Raute -> Frage mit ja und nein
= Parallelogramm -> Ein- oder Ausgabe
> „50 cm vorwärts fahren“ ist eine Anweisung, „Quadrat fertig!“ anzeigen eine Ausgabe.

? Im Quadrat-PAP steht „4 Seiten gefahren?“ in der Raute. Wohin führt der Pfeil bei **nein**?
→ Übung: Das Quadrat als PAP
- [x] Zurück zu „50 cm vorwärts fahren“
- [ ] Zum Ende
- [ ] Zu „Quadrat fertig!“ anzeigen
> Bei nein ist das Quadrat noch nicht fertig, also fährt der mBot2 die nächste Seite.

? Was zeigt im Pseudocode, welche Zeilen zur Schleife gehören?
→ Pseudocode
- [ ] Ein Pfeil
- [x] Die Einrückung und das ENDE WIEDERHOLE
- [ ] Die Farbe
> Alles zwischen WIEDERHOLE und ENDE WIEDERHOLE ist eingerückt und wird wiederholt.

? Kann der mBot2 Pseudocode direkt ausführen?
→ Drei Arten, einen Plan aufzuschreiben
- [ ] Ja, wie Java
- [x] Nein, Pseudocode ist nur ein Plan für Menschen
> Ausführen kann der mBot2 das Struktogramm oder Java. Pseudocode hilft beim Planen.
:::
