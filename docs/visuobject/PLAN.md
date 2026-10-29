# VisuObject – Plan

Stand: 29.10.2026 · Entwurf, noch nichts gebaut.
Konzept mit Bildern: https://claude.ai/artifact/7oKgJEb9nFyxrwXpthF3WD

VisuObject ist eine dritte Welt neben VisuStruct und VisuBot, für Objektorientierung an der FOS.
Code und UML-Diagramme sind verschiedene Blicke auf dasselbe Programm. Wer an einer Stelle etwas ändert,
sieht es sofort an den anderen. Das Struktogramm bleibt der Blick ins Innere einer Methode.

Alle Beispiele nutzen die Klassen aus dem Spickzettel Java OOP & UML 1.0: `Tier`, `Hund`, `Besitzer`, `Haustier`.

## Entscheidungen (Holger, 29.10.2026)

- **Eigene Welt `?visuobject`.** Klasse 11 arbeitet in VisuStruct, in Klasse 12 wechselt man in VisuObject.
- **Schrittweise:** Wir bauen Baustein für Baustein, testen jeden im Unterricht und gehen erst dann weiter.

## Abgleich mit dem Lehrplan (FOS, Themenfeld 12.1 Objektorientierte Softwareentwicklung)

| Lehrplan | Art | VisuObject |
|---|---|---|
| Anforderungsanalyse als UML-Anwendungsfalldiagramm, auch Text, Pflichtenheft, User Stories | Pflicht | Baustein 5; Anwendungsfall mit Textfeld für Beschreibung bzw. User Story |
| Softwareentwicklung mit Objekt- und Klassendiagramm | Pflicht | Bausteine 1–3 |
| Klassen mit Attributen und Methoden, Kapselung | Pflicht | Klassendiagramm ⇄ Java (`-`/`+`, Getter/Setter) |
| Schnittstellen (Interfaces) | Pflicht | `«interface»`, `implements` |
| Einfache Assoziationen | Pflicht | Attribut vom Typ einer Klasse → Linie mit Pfeil |
| Komplexe Assoziationen, abstrakte Datentypen mit Arrays und generischen Listen | Pflicht | `Hund[]`, `ArrayList<Hund>` → `0..*`; Objektdiagramm zeigt Array/Liste mit Verweisen |
| Interner Aufbau von statischen und dynamischen Arrays und generischen Listen, selbst implementieren | Pflicht | Eigene Klasse `Liste<T>` mit Knoten: Objektdiagramm zeigt die Kette der Knoten beim Einfügen |
| Überladen, Überschreiben, Kapselung | Pflicht | Klassendiagramm zeigt überladene Methoden einzeln; Überschreiben mit Vererbung. Java kennt kein Überschreiben von Operatoren: Ersatz `equals`, `toString`, `compareTo` |
| Objektorientiertes Testen (Testdaten, Testfälle), Testdurchführung, Qualität | Pflicht | Neuer Baustein 6: Testfälle als Tabelle (Objekt, Aufruf, erwartet, tatsächlich) |
| Darstellung von Abläufen als Sequenzdiagramm | fakultativ | Baustein 4, kommt zuletzt |
| Einfache Vererbung, Polymorphie | fakultativ | Vererbungspfeil, Objektdiagramm zeigt den echten Typ (`rex : Hund` in `Tier t`) |
| Sortierverfahren, Textdateien | fakultativ | vorhanden in VisuStruct (Lektionen Suchen/Sortieren, Dateien) |

Folge für die Reihenfolge: Sequenzdiagramm ist im Lehrplan nur fakultativ, Anwendungsfall-, Klassen- und
Objektdiagramm sind Pflicht. Das Sequenzdiagramm rückt deshalb ans Ende.

## Bausteine

### 1. Klassendiagramm aus Java (Code → Diagramm)

- Beim Tippen wächst das Klassendiagramm mit: Klassenname, Attribute (`- name: String`), Methoden-Köpfe (`+ lautGeben(): void`).
- Sichtbarkeit: `private` → `-`, `public` → `+`, `protected` → `#`.
- `extends` → Vererbungspfeil (hohle Spitze), `implements` → gestrichelter Pfeil mit hohler Spitze, Interface mit `«interface»`.
- Attribut vom Typ einer eigenen Klasse → Assoziation; `ArrayList<Hund>` oder `Hund[]` → Multiplizität `0..*`.
- Klick auf eine Methode öffnet ihr Struktogramm (Brücke zu VisuStruct).

### 2. Java aus dem Klassendiagramm (Diagramm → Code)

- Klasse, Attribut oder Methode im Diagramm anlegen oder umbenennen schreibt Java zurück.
- Wie heute bei Struktogramm → Java: nur die Zeilen des geänderten Teils neu schreiben, Methodenrümpfe und Kommentare bleiben.
- Neue Methode bekommt einen Rumpf mit Platzhalter (`// Dein Code`).

### 3. Objektdiagramm beim Ablauf

- Jedes `new` erscheint als Objektkasten (`rex : Hund`) mit den aktuellen Attributwerten.
- Variablen in `main` zeigen mit Linien auf ihre Objekte. Zwei Variablen auf ein Objekt (`Tier t = bello;`) → zwei Pfeile auf einen Kasten.
- Geänderte Werte leuchten auf, wie in der Variablentabelle des Debuggers.
- Funktioniert mit Haltepunkten und Einzelschritt.

### 4. Sequenzdiagramm aus einem Ablauf

- Ein Sequenzdiagramm entsteht **nicht aus einer einzelnen Methode**: Wie viele Objekte es gibt und welche
  überschriebene Methode läuft (`Tier.lautGeben` oder `Hund.lautGeben`), steht erst zur Laufzeit fest.
- Deshalb: Startpunkt wählen (`main` oder ein Methodenaufruf), laufen lassen, jeden Aufruf zwischen Objekten mitschreiben.
- Schleife → `loop`-Rahmen, Verzweigung → `alt`-Rahmen, Rückgabe → gestrichelter Pfeil.
- Läuft synchron mit Code, Struktogramm und Objektdiagramm.
- Optional später: Vorschau aus dem Code ohne Ablauf (nur als Skizze gekennzeichnet).

### 5. Anwendungsfalldiagramm (ohne Code)

- Reiner Zeichen-Editor: Akteure, Anwendungsfälle, Systemgrenze, Assoziation, `«include»`, `«extend»`, Generalisierung.
- Keine Kopplung an Java: aus dem Diagramm entsteht kein Code und umgekehrt.
- Optionale Brücke: Ein Anwendungsfall verlinkt auf eine Methode oder einen Ablauf
  (z. B. „Gassi gehen“ → `gassiGehen()`); Klick öffnet das Sequenzdiagramm.

### 6. Testfälle

- Tabelle je Klasse: Testobjekt anlegen, Methode aufrufen, erwartetes Ergebnis eintragen.
- ▶ führt alle Testfälle aus und färbt sie grün oder rot; ein roter Fall öffnet den Ablauf im Objektdiagramm.
- Später als Export nach JUnit, damit der Schritt zum echten Werkzeug klein bleibt.

### 8. mBot2 objektorientiert (Zukunft)

- Wunsch von Holger (29.10.2026): In VisuObject auch den mBot2 programmieren, aber objektorientiert.
- Idee: Die mBot-Befehle aus VisuBot stecken in Klassen, die man im Klassendiagramm sieht und nutzt,
  z. B. `MBot` mit `Motor links`, `Motor rechts`, `Ultraschallsensor`, `Farbsensor`, `LEDs` als Attribute (Assoziationen).
- Eigene Klassen darauf aufbauen: `Linienfolger`, `Hindernisvermeider` oder eine Klasse `Fahrt` mit Methoden wie `quadratFahren()`.
  Vererbung und Interfaces passen gut dazu, etwa ein Interface `Sensor` mit `messen()`.
- Läuft im Simulator und auf dem echten mBot2 wie in VisuBot. Das Objektdiagramm zeigt dabei die Sensorwerte als Attribute.
- Kommt nach Stufe 5 (Objekte in der Simulation) und baut auf `web/src/core/mbot.ts` und dem Übertragen aus VisuBot auf.

### 7. Welt `?visuobject`

- Weltenumschalter wie bei `?visustruct` / `?visubot` (`web/src/ui/visubotView.ts`, `worldChooserHTML`).
- Eigene Startseite `website/<lang>/visuobject.html`, eigene Farben, eigenes Logo.
- Lektionen: Klasse und Objekt, Konstruktor, Getter/Setter, Vererbung, Interface, Assoziation, UML-Diagramme lesen und zeichnen.

## Was es technisch braucht (Reihenfolge nach Lehrplan)

Jede Stufe wird gebaut, im Unterricht getestet und erst dann die nächste begonnen.

| Stufe | Was | Hängt ab von |
|---|---|---|
| 1 | Welt `?visuobject` als leere Hülle: Umschalter, Kopfzeile, Farben (Muster `visubotView.ts`, `worldChooserHTML`). | nichts |
| 2 | Klassendiagramm aus Java: `web/src/core/javaParser.ts` erweitern um mehrere Klassen, Attribute, Methoden-Köpfe, Konstruktoren, `extends`, `implements`, `interface`. Neues Modell `classModel.ts`, Zeichnen in `ui/classDiagram.ts`. | 1 |
| 3 | Klassendiagramm bearbeiten → Java zurückschreiben (Muster wie `liveSource.ts` / `mergeLiveJava`). | 2 |
| 4 | Anwendungsfalldiagramm als Zeichen-Editor mit Beschreibungstext je Anwendungsfall. | 1 |
| 5 | Objekte in der Simulation (`web/src/core/simulation.ts`): `new`, Konstruktor, `this`, Attribute, Methodenaufruf am Objekt, Arrays und `ArrayList` von Objekten. Dazu `ui/objectDiagram.ts`. | 2; Thread „Eigene Klassen im Programmieren-Bereich“, Variante B |
| 6 | Testfälle-Tabelle. | 5 |
| 7 | Vererbung und Polymorphie in der Simulation (fakultativ im Lehrplan). | 5 |
| 8 | Sequenzdiagramm aus dem Mitschnitt, mit `loop` und `alt` (fakultativ im Lehrplan). | 5 |
| 9 | Startseite `website/<lang>/visuobject.html` und Lektionen für Klasse 12. | wächst mit jeder Stufe |
| 10 | mBot2 objektorientiert: mBot-Klassen im Klassendiagramm, eigene Klassen darauf, Simulator und echter mBot2. | 5, VisuBot |

Hinweise:

- Die Simulation kennt heute nur Variablen einer Methode, keine Objekte und keine Verweise. Das ist der größte Brocken (Stufe 5).
- „Echtes Java (mit Swing)“ (CheerpJ) hilft für die Diagramme nicht: Es führt Code aus, sieht aber nicht hinein.
- Stufen 1–4 brauchen keine Objekte in der Simulation und sind schon im Unterricht nutzbar.
- Abhängigkeiten nur mit MIT-Lizenz, wo möglich. Diagramme selbst als SVG zeichnen, wie das Struktogramm.

## Java-Umfang (Vorschlag für Klasse 12)

Dabei: Klassen, Attribute, Konstruktoren (auch mehrere), Getter/Setter, `this`, Überladen, `interface` /
`implements`, Arrays von Objekten, `ArrayList<T>`, eine eigene einfache generische Klasse wie `Liste<T>`
mit `Knoten<T>` (Lehrplan: Listen selbst implementieren), `equals`, `toString`, `compareTo`,
`static` (unterstrichen im Klassendiagramm). Fakultativ: `extends`, `super(...)`, Überschreiben, `abstract`.

Nicht dabei (vorerst): Generics mit Grenzen (`<T extends …>`), innere und anonyme Klassen, Lambdas, Enums,
Exceptions im Objektdiagramm.

## Offene Fragen an Holger

1. Passt der Java-Umfang oben?
2. Dateiformat: Klassendiagramm nur aus dem Java-Code ableiten (keine eigene Datei) und Anwendungsfalldiagramm als eigene Datei, z. B. `.visuusecase`?
3. Stufe 1 und 2 als erster PR, oder Stufe 1 bis 3 zusammen?
