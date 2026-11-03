---
titel: Schritt für Schritt testen
bereich: Losfahren
kurz: Mit der Simulation und dem Schreibtischtest herausfinden, was dein Programm wirklich tut.
---

## Diese Kompetenzen erwerbe ich jetzt

::: kompetenzen
- die Simulation mit Start, Schritt und Stopp steuern
- in der Simulation die Variablen beobachten
- einen Schreibtischtest mit einer Tabelle machen
- mit der Simulation einen Fehler finden und reparieren
:::

## Die Simulation steuern

Mit dem Knopf [▶︎ Simulation starten](#zeige-simulation) rechts bei den Werkzeugen führt VisuStruct dein Struktogramm aus. In der VisuBot-Welt fährt der mBot2 dabei mit. Rechts erscheint die **Steuerung**:

- **Start** führt das Programm automatisch Schritt für Schritt aus. Wie schnell, stellst du bei **Pause pro Schritt** ein.
- **Pause** hält an. Danach geht es mit Start oder Schritt weiter.
- **Schritt** führt genau einen Kasten aus. So kannst du in Ruhe zuschauen.
- **Stopp** bricht ab und stellt den mBot2 zurück an den Start.

Während der Simulation ist ein Kasten farbig markiert. Unter **Letzter Schritt** steht, was gerade passiert ist, unter **Variablen** stehen alle Variablen mit ihren Werten.

::: diagramm vb-l03-wachsend-loesung.visustruct
Jede Seite wird 10 cm länger. Öffne das Diagramm im Editor und gehe es mit **Schritt** durch. Beobachte dabei `seite` und `i`.
:::

## Der Schreibtischtest

Beim **Schreibtischtest** spielst du selbst den Computer. Du gehst das Struktogramm mit Stift und Papier durch und schreibst nach jedem Schritt die Werte der Variablen auf. Für das Diagramm oben sieht die Tabelle so aus:

| Schritt | `i` | `seite` | Der mBot2 … |
|---|---|---|---|
| `int seite = 20` | – | 20 | |
| `mbot.forward(seite)` | 0 | 20 | fährt 20 cm |
| `mbot.turnRight()` | 0 | 20 | dreht rechts |
| `seite = seite + 10` | 0 | 30 | |
| `mbot.forward(seite)` | 1 | 30 | fährt 30 cm |
| … | … | … | … |

Vergleiche deine Tabelle danach mit der Simulation. Stimmen die Werte unter **Variablen** nach jedem Schritt?

::: angeberwissen
Früher war „Computer“ ein Beruf: Menschen, die mit Stift und Papier rechneten. Eine der besten war Katherine Johnson bei der NASA. 1962 wollte der Astronaut John Glenn erst losfliegen, als sie die Flugbahn des neuen IBM-Rechners von Hand nachgerechnet hatte: „Wenn sie sagt, die Zahlen stimmen, fliege ich.“
:::

## Fehler finden mit der Simulation

Ludwig wollte die Spirale von oben bauen: 20 cm, 30 cm, 40 cm. Sein mBot2 fährt aber 30, 40 und 50 cm. Das Programm läuft ohne Fehlermeldung, es tut nur das Falsche. So einen Fehler nennt man **logischen Fehler**. Ihn findest du am besten mit **Schritt** und den Variablen.

::: übung vb-spirale-falsch
titel: Die Spirale reparieren
auftrag: „Im Editor öffnen“ lädt Ludwigs Struktogramm. Gehe es mit **Schritt** durch und beobachte `seite`. Finde heraus, warum die erste Seite 30 cm lang ist, und repariere es. Der mBot2 soll 20, 30 und 40 cm fahren und nach jeder Seite rechts drehen.
start: vb-spirale-falsch-start.visustruct
fahrt: forward 20, turnRight, forward 30, turnRight, forward 40, turnRight
braucht: forSchleife
tipp: Achte darauf, welchen Wert `seite` hat, wenn `mbot.forward(seite)` drankommt. Ist die Reihenfolge in der Schleife richtig?
tipp: `seite = seite + 10` muss **nach** `mbot.forward(seite)` und `mbot.turnRight()` stehen. Zieh den Kasten ans Ende der Schleife.
lösung: vb-spirale-falsch-loesung.visustruct
:::

> 📘 **Mehr dazu ohne Roboter:** In VisuStruct gibt es die Lektion [„Simulation und Schreibtischtest“](?visustruct&lektion=07-simulation-und-schreibtischtest). Sie öffnet sich in einem neuen Fenster.

::: quiz
? Welcher Knopf führt genau einen Kasten aus?
→ Die Simulation steuern
- [ ] Start
- [x] Schritt
- [ ] Stopp
> Mit Schritt geht es Kasten für Kasten. Start läuft von allein weiter.
? Wie lang fährt der mBot2 im zweiten Durchgang von „Wachsende Seiten“?
→ Der Schreibtischtest
- [ ] 20 cm
- [x] 30 cm
- [ ] 40 cm
> Nach dem ersten Durchgang ist `seite` um 10 gewachsen, also 30.
? Das Programm läuft ohne Meldung, der mBot2 fährt aber falsch. Was für ein Fehler ist das?
→ Fehler finden mit der Simulation
- [ ] ein Tippfehler
- [x] ein logischer Fehler
- [ ] ein Fehler im Roboter
> Das Programm tut genau, was dasteht, nur nicht das, was gemeint war.
:::

Schätze dich bei jedem Punkt ehrlich ein: ☂️ noch nicht, ⛅ teilweise, ☀️ kann ich sicher. Bei ⛅ und ☂️ hilft dir **Nachlesen**. Danach kommt der Wissenstest. Er zeigt dir, ob deine Einschätzung stimmt.

::: checkliste
- Ich kann die Simulation mit Start, Schritt und Stopp steuern. → Die Simulation steuern
- Ich kann in der Simulation die Variablen beobachten. → Die Simulation steuern
- Ich kann einen Schreibtischtest mit einer Tabelle machen. → Der Schreibtischtest
- Ich kann mit der Simulation einen Fehler finden und reparieren. → Fehler finden mit der Simulation
:::
