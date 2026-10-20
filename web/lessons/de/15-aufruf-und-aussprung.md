---
titel: Aufruf und Aussprung
bereich: Grundlagen
kurz: Große Aufgaben in Unterprogramme zerlegen und Schleifen vorzeitig verlassen.
---

## Große Aufgaben zerlegen

Lange Struktogramme werden schnell unübersichtlich. Deshalb zerlegst du eine große Aufgabe in **Teilprobleme**. Jedes Teilproblem bekommt einen eigenen Namen und ein eigenes Struktogramm, ein **Unterprogramm**.

Ein Quiz besteht zum Beispiel aus drei Teilen: begrüßen, Fragen stellen, Ergebnis zeigen. Das Hauptprogramm nennt nur noch diese drei Teile:

::: diagramm l15-hauptprogramm.visustruct
Das Hauptprogramm besteht nur aus drei Aufrufen. Was in jedem Teil passiert, steht in einem eigenen Struktogramm.
:::

So siehst du auf einen Blick, wie das Programm aufgebaut ist. Die Einzelheiten stehen woanders.

## Der Aufruf

Ein **Aufruf** ist ein Kasten mit doppelten senkrechten Linien links und rechts. Er bedeutet: Führe hier das Unterprogramm mit diesem Namen aus und mache danach weiter.

- Du ziehst **Aufruf** aus dem Bereich Elemente und schreibst den Namen hinein, z. B. `zeigeBegruessung()`.
- Die runden Klammern am Ende zeigen, dass es ein Unterprogramm ist. So schreibt man es auch in Java, Python und JavaScript.
- Das Unterprogramm selbst baust du als eigenes Struktogramm in einem neuen Reiter. Als Titel trägst du denselben Namen ein.

::: diagramm l15-unterprogramm.visustruct
Das Unterprogramm zeigeBegruessung() als eigenes Struktogramm.
:::

> **In der Simulation:** Erreicht die Simulation einen Aufruf, sucht sie unter den offenen Reitern das Struktogramm mit diesem Titel und führt es aus. Danach macht sie im Hauptprogramm weiter. Solange das Unterprogramm läuft, bleibt der Aufruf-Kasten markiert. Hauptprogramm und Unterprogramme teilen sich dieselben Variablen. Gibt es keinen passenden Reiter, überspringt die Simulation den Aufruf und zeigt einen Hinweis.

## Übung: Aufruf einbauen

::: übung l15-titel
titel: Begrüßung mit Aufruf
auftrag: Stell dir vor, das Unterprogramm `zeigeTitel()` gibt es schon. Baue das Hauptprogramm: Es ruft zuerst `zeigeTitel()` auf. Danach fragt es nach dem Namen und gibt **Hallo** und den Namen aus.
  Bei der Eingabe Ada erscheint also **Hallo Ada**.
test: Ada -> Hallo Ada
test: Ben -> Hallo Ben
braucht: aufruf
tipp: Ziehe einen Aufruf aus dem Bereich Elemente ganz nach oben und schreibe `zeigeTitel()` hinein. Darunter kommen die Eingabe `input: String name "Wie heißt du?"` und die Ausgabe.
lösung: l15-titel-loesung.visustruct
:::

## Der Aussprung

Manchmal soll eine Schleife **vorzeitig** enden, mitten im Rumpf. Dafür gibt es den **Aussprung**. Er verlässt sofort die Schleife, in der er steht. Das Programm macht mit dem ersten Kasten nach der Schleife weiter. In Java, Python und JavaScript heißt das `break`.

Den Aussprung erkennst du an der Spitze am linken Rand. In den Kasten kannst du einen kurzen Kommentar schreiben, z. B. `Schleife verlassen`. Er erscheint im Code als Kommentar hinter `break`.

Ein Aussprung steht fast immer in einer **Verzweigung**: Nur wenn eine Bedingung zutrifft, wird die Schleife verlassen.

Typisch ist die **Endlosschleife mit Aussprung**. Die Schleife selbst hat keine Bedingung. Sie läuft so lange, bis der Aussprung erreicht wird:

::: diagramm l15-endlos-aussprung.visustruct
Die Schleife fragt immer wieder nach einer Zahl. Bei 0 springt sie heraus, sonst zählt sie die Zahl zur Summe.
:::

Ohne Aussprung würde eine Endlosschleife wirklich nie enden.

## Aussprung in der Simulation

Die Simulation führt den Aussprung aus wie `break`: Sie verlässt die innerste Schleife und macht nach ihr weiter. Steht ein Aussprung außerhalb jeder Schleife, endet das Unterprogramm, im Hauptprogramm das ganze Programm.

Oft geht es auch ganz ohne Aussprung: Du schreibst die Abbruchbedingung direkt in die Schleife. Das ist meist sogar übersichtlicher.

## Übung: Summe bis 0

::: übung l15-bis-null
titel: Summe bis 0
auftrag: Baue das Programm „Summe bis 0“ **ohne** Aussprung nach. Es fragt so lange nach ganzen Zahlen, bis jemand 0 eingibt. Danach gibt es **Summe:** und die Summe aller eingegebenen Zahlen aus.
test: 3, 4, 0 -> Summe: 7
test: 0 -> Summe: 0
test: 10, -2, 5, 0 -> Summe: 13
tipp: Frage die erste Zahl schon vor der Schleife ab. Die While-Schleife läuft mit der Bedingung `zahl != 0`. Im Rumpf zählst du die Zahl zur Summe und fragst danach die nächste Zahl ab. Bei der zweiten Eingabe schreibst du nur `input: zahl "…"`, weil es `zahl` schon gibt.
lösung: l15-bis-null-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann eine große Aufgabe in Teilprobleme zerlegen. → Große Aufgaben zerlegen
- Ich kann einen Aufruf einfügen und ein Unterprogramm in einem eigenen Reiter bauen. → Der Aufruf
- Ich weiß, was ein Aussprung macht und warum er in einer Verzweigung steht. → Der Aussprung
- Ich kann eine Schleife mit einem Aussprung oder über ihre Bedingung beenden. → Aussprung in der Simulation
:::

## Wissenstest

::: quiz
? Was bedeutet ein Aufruf-Kasten mit dem Text `zeigeErgebnis()`?
- [ ] Das Programm endet hier.
- [x] Hier wird das Unterprogramm zeigeErgebnis() ausgeführt, danach geht es weiter.
- [ ] Hier wird das Wort zeigeErgebnis() ausgegeben.

? Wo geht es nach einem Aussprung weiter?
- [ ] Am Anfang der Schleife
- [x] Beim ersten Kasten nach der Schleife
- [ ] Ganz am Anfang des Programms
> Der Aussprung verlässt die Schleife, in der er steht. In Java, Python und JavaScript heißt er break.

? Warum steht ein Aussprung meistens in einer Verzweigung?
- [x] Damit die Schleife nur verlassen wird, wenn eine Bedingung zutrifft
- [ ] Weil ein Aussprung sonst nicht gespeichert werden kann
- [ ] Weil eine Verzweigung selbst eine Schleife ist
> Ohne Verzweigung würde die Schleife schon im ersten Durchlauf verlassen.

? Wo findet die Simulation das Unterprogramm zu einem Aufruf `zeigeErgebnis()`?
- [ ] Es muss im selben Struktogramm stehen.
- [x] In einem offenen Reiter mit dem Titel zeigeErgebnis()
- [ ] Die Simulation kann keine Unterprogramme ausführen.
> Baue jedes Unterprogramm in einem eigenen Reiter und gib ihm als Titel den Namen aus dem Aufruf.
:::
