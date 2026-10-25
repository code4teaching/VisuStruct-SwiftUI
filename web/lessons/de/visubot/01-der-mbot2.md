---
titel: Der mBot2
bereich: VisuBot
kurz: Lerne den Roboter kennen, den du gleich programmierst.
---

## Hallo mBot2

::: mbot2
fokus:
drehen: ja
:::

Der **mBot2** ist ein kleiner Roboter der Firma Makeblock. In dieser Lektion machst du eine Tour durch alle seine Teile:

- den [CyberPi]{teil=cyberpi}, den kleinen Computer hinten oben
- das durchsichtige [Shield mit Akku]{teil=shield} in der Mitte
- zwei [Motoren]{teil=motors} mit [Rädern]{teil=wheels}
- den [Ultraschallsensor]{teil=ultrasonic} vorn, der wie zwei Augen aussieht
- den [Liniensensor]{teil=lineSensor} unten an der Nase
- das türkise [Chassis]{teil=chassis}, das alles zusammenhält

In VisuBot programmierst du ihn mit Struktogrammen. Jedes Programm kannst du zuerst im Simulator ausprobieren, auch ganz ohne echten Roboter.

> Fahr mit der Maus über ein gelb unterstrichenes Wort, dann leuchtet das Teil im Modell auf. Tippst du darauf, fährt die Kamera hin. Das Modell kannst du mit der Maus oder dem Finger drehen und mit dem Mausrad heranzoomen.

## Der CyberPi

::: mbot2
fokus: cyberpi, screen, joystick, buttons, leds, lightSensor, microphone
ansicht: hinten
:::

Der [CyberPi]{teil=cyberpi,screen,joystick,buttons,leds,lightSensor,microphone} ist das Gehirn des mBot2: ein **Mikrocontroller**, also ein kleiner Computer ohne Tastatur. Er führt dein Programm aus. Er liegt quer hinten oben auf dem Roboter und lässt sich auch abnehmen.

Auf ihm ist schon eine Menge eingebaut:

- ein farbiger [Bildschirm]{teil=screen}, auf dem Text und Bilder erscheinen
- ein [Joystick]{teil=joystick}, den du in vier Richtungen drücken kannst
- zwei [Tasten]{teil=buttons}, eine mit Dreieck und eine mit Quadrat, und an der Seite neben dem USB-Anschluss die Home-Taste
- fünf bunte [LEDs]{teil=leds} als Lichtleiste an der Rückseite
- ein [Lichtsensor]{teil=lightSensor} und ein [Mikrofon]{teil=microphone}

Dazu kommen ein Lautsprecher und ein Lagesensor, die du von außen nicht siehst. Der Lagesensor merkt, ob der CyberPi gekippt oder gedreht wird.

> Das Modell ist nach Fotos nachgebaut. Schau dir deinen eigenen mBot2 an und vergleiche.

## Bildschirm, LEDs und Lautsprecher

::: mbot2
fokus: screen, leds
ansicht: hinten
:::

Mit dem [Bildschirm]{teil=screen} und den fünf [LEDs]{teil=leds} zeigt dir der mBot2, was er gerade tut. Jede LED kann in fast jeder Farbe leuchten, weil sie Rot, Grün und Blau mischt. Darum heißen sie **RGB-LEDs**.

Später lässt du die LEDs mit `mbot.setLed(255, 0, 0)` rot leuchten. Die drei Zahlen sind Rot, Grün und Blau, jeweils von 0 bis 255.

Im [CyberPi]{teil=cyberpi} steckt außerdem ein kleiner **Lautsprecher**. Mit `mbot.playTone(440, 300)` spielt er einen Ton: 440 Schwingungen pro Sekunde (Hertz), 300 Millisekunden lang.

## Licht und Geräusche messen

::: mbot2
fokus: lightSensor, microphone
ansicht: oben
:::

Der [Lichtsensor]{teil=lightSensor} misst, wie hell es ist. Das [Mikrofon]{teil=microphone} misst, wie laut es ist. So kann der mBot2 zum Beispiel losfahren, wenn du in die Hände klatschst.

## Tasten und Joystick

::: mbot2
fokus: joystick, buttons
ansicht: oben
:::

Die [Tasten]{teil=buttons} A und B und der [Joystick]{teil=joystick} sind auch Sensoren: Sie merken, ob du sie drückst. Dein Programm kann zum Beispiel warten, bis du A drückst, und erst dann losfahren. Mit dem Joystick lenkst du den mBot2 wie mit einer Fernbedienung.

## Der Lagesensor

::: mbot2
fokus: cyberpi
drehen: ja
:::

Im [CyberPi]{teil=cyberpi} steckt ein Sensor, den du nicht siehst: der **Lagesensor** (ein Gyroskop mit Beschleunigungssensor). Er merkt, ob der mBot2 nach vorn, nach hinten oder zur Seite geneigt ist, wie weit er sich gedreht hat und ob ihn jemand schüttelt. Dein Handy hat so einen Sensor auch: Darum dreht sich das Bild, wenn du es quer hältst.

## Strom: das Shield mit Akku

::: mbot2
fokus: shield, powerSwitch
ansicht: seite
:::

Das große durchsichtige Gehäuse ist das [mBot2-Shield]{teil=shield}. Durch den Deckel siehst du den grauen **Akku**, der den Roboter mit Strom versorgt. Hinten am Shield stecken die Kabel der Motoren (M1 und M2) und des Ultraschallsensors.

Links an der Seite ist der [Ein-Aus-Schalter]{teil=powerSwitch} mit der Aufschrift ON/OFF. Daneben liegen zwei Buchsen S1 und S2 für kleine Servomotoren. Schalte den mBot2 aus, wenn du ihn nicht brauchst, dann hält der Akku länger. Geladen wird er über das USB-Kabel am CyberPi.

## Motoren und Räder

::: mbot2
fokus: motors, wheels
ansicht: seite
:::

Zwei [Motoren]{teil=motors} treiben die beiden [Räder]{teil=wheels} an, jeder sein eigenes. Du siehst sie von unten: silberne Motoren in hellblauen Getrieben.

- Drehen sich beide Räder gleich schnell vorwärts, fährt der mBot2 **geradeaus**.
- Dreht sich ein Rad vorwärts und das andere rückwärts, dreht er sich **auf der Stelle**.

Die Motoren sind **Encoder-Motoren**: Sie zählen mit, wie weit sich das Rad gedreht hat. Darum weiß der mBot2, wann er genau 10 cm gefahren ist oder sich genau um 90° gedreht hat.

## Der Ultraschallsensor

::: mbot2
fokus: ultrasonic
ansicht: vorn
:::

Vorn sitzt der schwarze [Ultraschallsensor]{teil=ultrasonic}. Er sieht aus wie zwei Augen, ist aber eher ein Ohr: Der eine Kreis schickt einen sehr hohen Ton los, den wir nicht hören. Der andere wartet auf das Echo. Je länger das Echo braucht, desto weiter ist die Wand weg.

So misst der mBot2 Abstände in Zentimetern. Die Ringe um die Kreise können außerdem blau leuchten.

::: angeberwissen
Fledermäuse machen es genau wie der Ultraschallsensor: Sie rufen so hoch, dass wir es nicht hören, und lauschen auf das Echo. Schall ist etwa 343 Meter pro Sekunde schnell. Steht eine Wand einen Meter vor dem mBot2, ist das Echo schon nach knapp 6 Tausendstel Sekunden zurück.
:::

## Unter dem Roboter

::: mbot2
fokus: lineSensor, caster
ansicht: unten
:::

Jetzt schaust du von unten. Ganz vorn schaut die schwarze Platine des [Liniensensors]{teil=lineSensor} heraus. Er hat **vier** kleine Fühler nebeneinander. Jeder leuchtet den Boden an und misst, wie viel Licht zurückkommt. Auf einer schwarzen Linie kommt wenig zurück, auf hellem Boden viel. So erkennt der mBot2, ob er auf einer Linie fährt.

Der Sensor heißt **Quad-RGB-Sensor**, weil er noch mehr kann: Er erkennt auch **Farben**, zum Beispiel ein rotes oder grünes Feld auf dem Boden.

Die [Kugelrolle]{teil=caster} dahinter ist das dritte Bein. Sie hat keinen Motor und rollt einfach in jede Richtung mit.

## Das Chassis

::: mbot2
fokus: chassis
:::

Das [Chassis]{teil=chassis} ist der türkise Rahmen aus Aluminium. Er hält alle Teile zusammen. Vorn hat er zwei runde „Ohren“, hinten ein großes **M** für Makeblock. Die vielen Löcher sind kein Zufall: Dort kannst du weitere Teile anschrauben.

## Sensoren und Aktoren

Ein Roboter hat zwei Arten von Teilen:

- **Sensoren** messen etwas: den Abstand, eine Linie, eine Farbe, die Helligkeit, die Lautstärke, die Neigung oder ob eine Taste gedrückt ist.
- **Aktoren** tun etwas: Die Motoren bewegen die Räder, die LEDs leuchten, der Bildschirm zeigt etwas an, der Lautsprecher piept.

Das Wort kommt vom lateinischen *agere*, „handeln“: Aktoren handeln, Sensoren (von *sentire*, „fühlen“) fühlen.

Dein Programm liest die Sensoren und steuert die Aktoren. Das kennst du schon als Eingabe, Verarbeitung und Ausgabe.

::: quiz
? Ordne jedes Teil seiner Aufgabe zu.
= Ultraschallsensor -> misst den Abstand
= Motoren -> bewegen die Räder
= CyberPi -> führt das Programm aus
= Liniensensor -> erkennt eine dunkle Linie
? Welche Teile sind Aktoren?
- [x] Motoren
- [ ] Ultraschallsensor
- [x] LEDs
- [ ] Liniensensor
> Aktoren tun etwas, Sensoren messen etwas.
:::

::: spiel frage
titel: Spiel: Sensor oder Aktor?
intro: Misst das Bauteil etwas, oder tut es etwas? Zehn Runden.
antworten: Sensor | Aktor

runde:
frage: Der Ultraschallsensor misst, wie weit die Wand weg ist.
richtig: Sensor
> Er misst etwas: den Abstand.

runde:
frage: Die Motoren drehen die Räder.
richtig: Aktor
> Sie tun etwas: Sie bewegen den mBot2.

runde:
frage: Die LEDs leuchten rot.
richtig: Aktor
> Leuchten ist etwas tun, nicht messen.

runde:
frage: Der Liniensensor erkennt das schwarze Klebeband.
richtig: Sensor
> Er misst, wie viel Licht vom Boden zurückkommt.

runde:
frage: Der Lautsprecher piept.
richtig: Aktor
> Er gibt einen Ton aus.

runde:
frage: Das Mikrofon hört dein Klatschen.
richtig: Sensor
> Es misst die Lautstärke.

runde:
frage: Der Bildschirm zeigt „Hallo VisuBot!“.
richtig: Aktor
> Anzeigen ist eine Ausgabe.

runde:
frage: Taste A merkt, dass du drückst.
richtig: Sensor
> Tasten sind Sensoren: Sie melden, ob sie gedrückt sind.

runde:
frage: Der Lagesensor merkt, dass der mBot2 schief steht.
richtig: Sensor
> Er misst die Neigung.

runde:
frage: Die Ringe am Ultraschallsensor leuchten blau.
richtig: Aktor
> Gemein! Das Bauteil ist ein Sensor, aber das Leuchten der Ringe ist eine Ausgabe.
:::

## Finde die Bauteile

Jetzt bist du dran: Klicke im Modell auf das gesuchte Teil. Liegst du richtig, kommt die nächste Frage.

::: mbot2quiz
- ultrasonic: Womit misst der mBot2, wie weit die Wand weg ist?
- screen: Wo erscheint Text, den dein Programm ausgibt?
- wheels: Was bewegt den mBot2 vorwärts?
- lineSensor: Was erkennt eine schwarze Linie auf dem Boden? (Tipp: Dreh das Modell.)
- powerSwitch: Wo schaltest du den mBot2 ein und aus?
- leds: Was leuchtet bei `mbot.setLed(255, 0, 0)` rot?
fertig: Super, du kennst dich am mBot2 aus!
:::

## Befehle für den mBot2

Unter den [Elementen](#zeige-elemente) gibt es in VisuBot eine eigene Gruppe **mBot2-Befehle**. Jeder Kasten darin ist eine Anweisung an den Roboter:

| Element | Text im Kasten | Was passiert |
|---|---|---|
| fahre vor | `mbot.forward()` | 10 cm vorwärts |
| fahre zurück | `mbot.backward()` | 10 cm rückwärts |
| drehe rechts | `mbot.turnRight()` | 90° nach rechts drehen |
| drehe links | `mbot.turnLeft()` | 90° nach links drehen |
| LEDs an | `mbot.setLed(255, 0, 0)` | die LEDs leuchten rot |

In die Klammern darfst du auch eine Zahl schreiben: `mbot.forward(30)` fährt 30 cm, `mbot.turnRight(45)` dreht nur 45°.

> Die Anweisungen sind echtes Java. `mbot` ist der Roboter, hinter dem Punkt steht, was er tun soll.

## Erste Fahrt

Starte nach dem Bauen die [Simulation](#zeige-simulation). Rechts erscheint die VisuBot-Welt mit dem mBot2. Das Gitter auf dem Boden hat Kästchen von 10 cm, also genau ein **fahre vor**.

::: übung vb-gerade
titel: Geradeaus
auftrag: Ziehe fünfmal **fahre vor** in das Struktogramm. Starte dann die Simulation und schau zu, wie der mBot2 50 cm geradeaus fährt.
fahrt: 5 x (forward)
tipp: Die Gruppe mBot2-Befehle findest du unter den normalen Elementen.
tipp: Fünf Kästen `mbot.forward()` untereinander. Jeder fährt 10 cm.
lösung: vb-gerade-loesung.visustruct
:::

## Den echten mBot2 verbinden

::: mbot2
fokus: cyberpi, powerSwitch, joystick, buttons
ansicht: seite
:::

Alles, was du im Simulator baust, kann auch der echte mBot2 fahren. So verbindest du ihn:

1. Steck ein **USB-C-Kabel** in deinen Computer (zum Beispiel ein MacBook) und das andere Ende in den USB-C-Anschluss rechts am [CyberPi]{teil=cyberpi}, neben der Home-Taste.
2. Schieb den [Schiebeschalter ON/OFF]{teil=powerSwitch} links am Shield auf ON. Der Bildschirm des CyberPi leuchtet.
3. Auf dem Bildschirm erscheint ein Menü, in dem **neu starten** markiert ist. Drück den [Joystick]{teil=joystick} wie eine Taste nach unten, um das zu bestätigen.
4. Nach dem Neustart steht dort „Press B to start“. Drück **Taste B**, das ist die [Taste mit dem Dreieck]{teil=buttons}.
5. Öffne VisuStruct in **Chrome** oder **Edge**. Safari und das iPad können keine USB-Geräte ansprechen.
6. Sobald der CyberPi hochgefahren ist, klick oben auf **🔌 mBot2** (oder im Zahnrad auf „Mit mBot2 verbinden“) und wähle im Fenster den Eintrag mit **USB** im Namen.
7. Der CyberPi startet kurz neu (⏳). Dann steht „Hallo VisuBot!“ auf seinem Bildschirm und der Knopf zeigt 🟢.

Jetzt fährt der mBot2 bei jedem Schritt der Simulation mit. Stell ihn auf den Boden und lass ihm Platz!

> Fertig? Klick noch einmal auf **🟢 mBot2**. Dann hält er an, zeigt „Bis bald!“ und gibt den Anschluss frei. Erst danach das Kabel ziehen.

::: checkliste
- Ich kenne die Teile des mBot2. → Hallo mBot2
- Ich weiß, wie der mBot2 Abstände misst. → Der Ultraschallsensor
- Ich weiß, wie der mBot2 eine Linie erkennt. → Unter dem Roboter
- Ich weiß, was Sensoren und Aktoren sind. → Sensoren und Aktoren
- Ich kann den mBot2 mit Elementen aus der Gruppe mBot2-Befehle steuern. → Befehle für den mBot2
- Ich kann den mBot2 im Simulator fahren lassen. → Erste Fahrt
- Ich kann den echten mBot2 per USB-C verbinden und wieder trennen. → Den echten mBot2 verbinden
:::
