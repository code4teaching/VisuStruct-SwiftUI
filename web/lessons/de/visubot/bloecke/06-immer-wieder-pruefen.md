---
titel: Immer wieder prüfen
bereich: Sensoren und Entscheidungen
kurz: Auf Taste A warten, immer wieder prüfen und Hindernissen ausweichen.
---

## Das schaffst du heute

::: kompetenzen
- den mBot2 auf Taste A warten lassen
- eine Schleife mit „wiederhole immer“ bauen und wieder verlassen
- den mBot2 Hindernissen ausweichen lassen
:::

## Start mit Taste A

Oben auf dem mBot2 sitzt die Taste **A**, das ist die [Taste mit dem Quadrat]{teil=buttons}. Der mBot2 soll erst losfahren, wenn du sie drückst. Bis dahin wartet er.

Warten heißt: **solange** die Taste **nicht** gedrückt ist, kurz warten. So baust du das:

1. Zieh eine **While-Schleife** unter 🏁.
2. Zieh aus **Operatoren** den Baustein **nicht** auf die Frage hinter **solange**.
3. Zieh den Sensor **Taste A gedrückt?** in den Baustein **nicht**.
4. Leg **kurz warten** in die Schleife und **fahre vor** darunter.

::: übung vbb-start-a
titel: Start mit Taste A
auftrag: Der mBot2 wartet, bis Taste A gedrückt ist. Dann fährt er 30 cm vor.
messwerte: isButtonA=false/true -> forward 30
messwerte: isButtonA=true -> forward 30
braucht: whileSchleife
tipp: Im Kopf der Schleife steht **solange nicht** und dann `mbot.isButtonA()`.
tipp: In der Schleife liegt **kurz warten**, unter der Schleife **fahre vor** mit 30.
lösung: vbb-start-a-loesung.visustruct
:::

> Beim Prüfen drückt VisuBot die Taste für dich: erst eine Weile nicht, dann schon. Fährt dein mBot2 zu früh los, fällt das auf.

## Wiederhole immer

Manche Programme sollen nie aufhören: Der mBot2 fährt, schaut, fährt, schaut … Dafür gibt es die **Endlosschleife**. Im Block steht **wiederhole immer**.

Damit du ihn trotzdem anhalten kannst, baust du eine **Notbremse** ein: **Wenn** Taste A gedrückt ist, **verlasse die Schleife**. Den Block dafür findest du unter **Elemente**, er heißt **Aussprung**. Danach macht das Programm unter der Schleife weiter.

::: übung vbb-notbremse
titel: Notbremse
auftrag: Der mBot2 fährt immer weiter vor. Wird Taste A gedrückt, verlässt er die Schleife und zeigt **Gestoppt** auf dem Bildschirm.
messwerte: isButtonA=true -> none, screen "Gestoppt"
messwerte: isButtonA=false/true -> drives, screen "Gestoppt"
braucht: endlosschleife, aussprung
tipp: In **wiederhole immer** liegt zuerst eine Verzweigung mit **Taste A gedrückt?**. Unter **wenn** kommt der **Aussprung**, **sonst** bleibt leer.
tipp: Unter der Verzweigung, noch in der Schleife, liegt **fahre vor**. Unter der Schleife liegt **Text anzeigen** mit „Gestoppt“.
lösung: vbb-notbremse-loesung.visustruct
:::

## Ausweichen

Jetzt wird es spannend! Der mBot2 soll durch einen Raum fahren, ohne irgendwo anzustoßen. Baue dafür:

- **wiederhole immer**
- darin: **wenn** der Abstand kleiner als 20 ist, **drehe rechts**, **sonst** **fahre vor**

Starte die Simulation und schau zu, wie er sich seinen Weg sucht. Mit **Simulation beenden** hältst du ihn an.

Probier aus:

- Was passiert, wenn du statt **drehe rechts** mal **drehe links** nimmst?
- Was passiert bei **drehe rechts** mit **45**?
- Kannst du ihn bei jeder Drehung piepen lassen?

::: ludwig
So einen Roboter gibt es wirklich: Viele Staubsauger-Roboter fahren genau so durch die Wohnung. Wand vorn? Drehen! Frei? Weiter!
:::

## Spiel: Was passiert?

::: spiel frage
titel: Spiel: Was passiert?
intro: Schau dir die Blöcke an. Was macht der mBot2? Vier Runden.

runde:
    while (!mbot.isButtonA()) {
        mbot.pause(100);
    }
    mbot.forward(50);
frage: Niemand drückt eine Taste. Was tut der mBot2?
- Er fährt 50 cm.
- [x] Er wartet und wartet.
- Er fährt immer weiter.
> Solange Taste A nicht gedrückt ist, wartet er in der Schleife.

runde:
    while (!mbot.isButtonA()) {
        mbot.pause(100);
    }
    mbot.forward(50);
frage: Du drückst Taste A. Was tut der mBot2?
- [x] Er fährt 50 cm und hört dann auf.
- Er fährt immer weiter.
- Er wartet weiter.
> Jetzt ist die Schleife zu Ende, und der Block darunter läuft einmal.

runde:
    while (true) {
        mbot.playTone(440, 300);
    }
frage: Wie oft piept der mBot2?
- einmal
- zehnmal
- [x] immer weiter, ohne Ende
> **wiederhole immer** hört nie von selbst auf.

runde:
    while (true) {
        if (mbot.isButtonA()) {
            break;
        }
        mbot.forward();
    }
    mbot.setLed(255, 0, 0);
frage: Wann leuchten die LEDs rot?
- sofort
- [x] wenn jemand Taste A drückt
- nie
> Erst die Notbremse verlässt die Schleife. Dann geht es unter der Schleife weiter.
:::

## Das hab ich geschafft

Wie gut klappt es schon? ☂️ noch nicht, ⛅ ein bisschen, ☀️ klappt prima. Bei ☂️ und ⛅ bringt dich **Nachlesen** zum passenden Schritt.

::: checkliste
- Ich kann den mBot2 auf Taste A warten lassen. → Start mit Taste A
- Ich kann eine Schleife mit „wiederhole immer“ bauen und wieder verlassen. → Wiederhole immer
- Ich kann den mBot2 Hindernissen ausweichen lassen. → Ausweichen
:::
