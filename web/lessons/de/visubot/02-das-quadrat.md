---
titel: Das Quadrat
bereich: VisuBot
kurz: Vom langen Struktogramm zur dreifach verschachtelten Schleife.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- einen Ablauf erst ohne Schleife bauen
- Wiederholungen erkennen und durch eine For-Schleife ersetzen
- zwei Schleifen ineinander schachteln
- drei Schleifen ineinander schachteln
- mein Programm auf den mBot2 übertragen und ohne Kabel mit Taste A starten
:::

## Ein Quadrat fahren

Der mBot2 soll ein Quadrat mit 50 cm Seitenlänge fahren. Eine Seite kennst du schon: fünfmal **fahre vor**. Danach dreht er sich nach rechts, und die nächste Seite beginnt.

::: übung vb-quadrat
titel: Das Quadrat
auftrag: Baue ein Struktogramm, mit dem der mBot2 ein Quadrat fährt: fünfmal **fahre vor**, dann **drehe rechts**. Und das viermal.
fahrt: 4 x (5 x (forward), turnRight)
tipp: Eine Seite besteht aus fünfmal fahre vor und einmal drehe rechts.
tipp: Insgesamt sind es 24 Kästen: viermal fünf `mbot.forward()` und danach jeweils `mbot.turnRight()`.
lösung: vb-quadrat-loesung.visustruct
:::

Ganz schön viele Kästen, oder? Wenn du dich beim Zählen vertust, fährt der mBot2 kein Quadrat mehr.

## Immer das Gleiche

Schau dein Struktogramm genau an: Fünfmal **fahre vor** steht viermal da. Wenn sich etwas wiederholt, nimmt man eine **Schleife**. Wir wissen genau, wie oft gefahren wird, nämlich fünfmal. Dafür passt die For-Schleife.

Ziehe eine For-Schleife ins Struktogramm und gib ihr diese drei Teile:

- Start: `int i = 0`
- Bedingung: `i < 5`
- Schritt: `i++`

In den Inhalt der Schleife kommt ein einziges **fahre vor**. Die Schleife zählt `i` von 0 bis 4, das sind fünf Durchläufe.

::: übung vb-quadrat-schleife
titel: Seiten mit Schleife
auftrag: Ersetze in deinem Quadrat jede Reihe aus fünf **fahre vor** durch eine For-Schleife, die fünfmal fährt. Der mBot2 fährt danach genau dasselbe Quadrat.
fahrt: 4 x (5 x (forward), turnRight)
braucht: forSchleife
tipp: Start `int i = 0`, Bedingung `i < 5`, Schritt `i++`. Im Inhalt steht nur `mbot.forward()`.
tipp: Viermal untereinander: die For-Schleife und danach `mbot.turnRight()`.
lösung: vb-quadrat-schleife-loesung.visustruct
:::

## Schleife in der Schleife

Jetzt steht viermal dasselbe Paar da: eine For-Schleife und **drehe rechts**. Auch das ist eine Wiederholung! Packe beides in eine zweite For-Schleife, die viermal läuft. Eine Schleife in einer Schleife heißt **verschachtelte Schleife**.

Jede Schleife braucht ihre eigene Zählvariable, sonst kommen sich die beiden in die Quere. Üblich ist: Die äußere Schleife zählt mit `i`, die innere mit `j`. Benenne deine innere Schleife also in `j` um.

::: übung vb-quadrat-verschachtelt
titel: Quadrat verschachtelt
auftrag: Baue das Quadrat mit zwei ineinander geschachtelten For-Schleifen. Die äußere läuft viermal, einmal für jede Seite. Die innere läuft fünfmal, einmal für jeden Schritt.
fahrt: 4 x (5 x (forward), turnRight)
schleifentiefe: 2
tipp: Außen: Start `int i = 0`, Bedingung `i < 4`, Schritt `i++`. Innen: `int j = 0`, `j < 5`, `j++`.
tipp: In die äußere Schleife kommen die innere Schleife mit `mbot.forward()` und darunter `mbot.turnRight()`.
lösung: vb-quadrat-verschachtelt-loesung.visustruct
:::

Aus 24 Kästen sind vier geworden. Gehe das Programm in der Simulation mit **Schritt** durch und beobachte die Variablen `i` und `j`.

::: quiz
? Wie oft führt der mBot2 im verschachtelten Quadrat `mbot.forward()` aus?
- [ ] 9-mal
- [x] 20-mal
- [ ] 5-mal
> Die innere Schleife läuft fünfmal, und das in jedem der vier Durchläufe der äußeren Schleife: 4 · 5 = 20.
:::

## Vier Quadrate

Jetzt wird es richtig schön: Der mBot2 soll vier Quadrate fahren. Nach jedem Quadrat dreht er sich einmal nach rechts. So entsteht ein großes Fenster mit Fensterkreuz.

Du könntest dein Quadrat viermal untereinander kopieren und nach jedem Quadrat ein **drehe rechts** einfügen. Probier es ruhig aus! Merkst du es? Schon wieder steht dasselbe viermal da.

::: ludwig
Immer wenn du Kästen kopierst, frag dich: Wiederholt sich hier etwas? Dann passt eine Schleife.
:::

::: übung vb-vier-quadrate
titel: Vier Quadrate
auftrag: Lass den mBot2 vier Quadrate fahren. Nach jedem Quadrat dreht er sich einmal nach rechts. Benutze drei ineinander geschachtelte Schleifen.
fahrt: 4 x (4 x (5 x (forward), turnRight), turnRight)
schleifentiefe: 3
tipp: Lege um dein verschachteltes Quadrat noch eine dritte For-Schleife, die viermal läuft.
tipp: Ganz außen zählt jetzt `i` (`int i = 0`, `i < 4`, `i++`). Die Schleifen darin heißen dann `j` und `k`. In die äußere Schleife kommen dein Quadrat und danach `mbot.turnRight()`.
lösung: vb-vier-quadrate-loesung.visustruct
:::

::: quiz
? Wie oft fährt der mBot2 bei den vier Quadraten 10 cm vor?
→ Vier Quadrate
- [ ] 20-mal
- [ ] 60-mal
- [x] 80-mal
> 4 Quadrate · 4 Seiten · 5 Schritte = 80. Ohne Schleifen wären das 80 Kästen.
:::

## Ohne Kabel fahren

::: mbot2
fokus: cyberpi, buttons
ansicht: oben
:::

Bisher hängt der mBot2 am Kabel, solange er fährt. Du kannst dein Programm aber auch **auf den mBot2 übertragen**. Dann merkt er es sich und fährt ganz allein, zum Beispiel durch ein Labyrinth auf dem Boden.

1. Schließ den mBot2 mit dem USB-Kabel an und schalte ihn ein, wie in Lektion 1. Das geht nur in **Chrome** oder **Edge**.
2. Öffne dein Programm, zum Beispiel die vier Quadrate.
3. Klick oben auf **⬆ Übertragen** und dann auf **Jetzt übertragen**. Wähle wieder **USB Serial**.
4. Warte, bis „Fertig!“ dasteht. Der mBot2 startet neu und zeigt **A = Start**.
5. Zieh das Kabel ab und setz den mBot2 an den Start.
6. Drück **Taste A**, das ist die [Taste mit dem Quadrat]{teil=buttons}. Jetzt fährt dein Programm los.

Das Programm bleibt gespeichert, auch wenn du den mBot2 aus- und wieder einschaltest. Erst das nächste Übertragen ersetzt es.

> Fährt er los, bevor du bereit bist? Keine Sorge: Er wartet immer auf Taste A. Drückst du A noch einmal, während er fährt, passiert nichts. Ist er fertig, startet A das Programm von vorn.

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann einen Ablauf erst ohne Schleife bauen. → Ein Quadrat fahren
- Ich kann Wiederholungen erkennen und durch eine For-Schleife ersetzen. → Immer das Gleiche
- Ich kann zwei Schleifen ineinander schachteln. → Schleife in der Schleife
- Ich kann drei Schleifen ineinander schachteln. → Vier Quadrate
- Ich kann mein Programm auf den mBot2 übertragen und ohne Kabel mit Taste A starten. → Ohne Kabel fahren
:::
