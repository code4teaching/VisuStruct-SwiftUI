# VisuObject – Plan

Stand: 28.10.2026 · Entwurf, noch nichts gebaut.
Konzept mit Bildern: https://claude.ai/artifact/7oKgJEb9nFyxrwXpthF3WD

VisuObject ist eine dritte Welt neben VisuStruct und VisuBot, für Objektorientierung an der FOS.
Code und UML-Diagramme sind verschiedene Blicke auf dasselbe Programm. Wer an einer Stelle etwas ändert,
sieht es sofort an den anderen. Das Struktogramm bleibt der Blick ins Innere einer Methode.

Alle Beispiele nutzen die Klassen aus dem Spickzettel Java OOP & UML 1.0: `Tier`, `Hund`, `Besitzer`, `Haustier`.

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

### 6. Welt `?visuobject`

- Weltenumschalter wie bei `?visustruct` / `?visubot` (`web/src/ui/visubotView.ts`, `worldChooserHTML`).
- Eigene Startseite `website/<lang>/visuobject.html`, eigene Farben, eigenes Logo.
- Lektionen: Klasse und Objekt, Konstruktor, Getter/Setter, Vererbung, Interface, Assoziation, UML-Diagramme lesen und zeichnen.

## Was es technisch braucht

| Schritt | Was | Hängt ab von |
|---|---|---|
| 1 | `web/src/core/javaParser.ts` erweitern: mehrere Klassen, Attribute, Methoden-Köpfe, Konstruktoren, `extends`, `implements`, `interface`. Neues Modell `classModel.ts`, Zeichnen in `ui/classDiagram.ts`. | vorhandener Parser |
| 2 | Diagramm bearbeiten → Java zurückschreiben (Muster wie `liveSource.ts` / `mergeLiveJava`). | 1 |
| 3 | `web/src/core/simulation.ts` mit Objekten: `new`, Konstruktor, `this`, Attribute, Methodenaufruf am Objekt, Vererbung und Überschreiben. Dazu `ui/objectDiagram.ts`. | Thread „Eigene Klassen im Programmieren-Bereich“, Variante B |
| 4 | Aufrufe mitschreiben (Trace) und als Sequenzdiagramm zeichnen, mit `loop` und `alt`. | 3 |
| 5 | Zeichen-Editor für Anwendungsfalldiagramme, gespeichert als eigene Datei im Workspace. | nichts (Link: 4) |
| 6 | Welt `?visuobject`, Startseite, Lektionen. | 1–5, nach Bedarf früher |

Hinweise:

- Die Simulation kennt heute nur Variablen einer Methode, keine Objekte und keine Verweise. Das ist der größte Brocken.
- „Echtes Java (mit Swing)“ (CheerpJ) hilft für die Diagramme nicht: Es führt Code aus, sieht aber nicht hinein.
- Mit Schritt 1 und 2 (und 5) gibt es schon etwas für den Unterricht, ohne Objekte in der Simulation.
- Abhängigkeiten nur mit MIT-Lizenz, wo möglich. Diagramme selbst als SVG zeichnen, wie das Struktogramm.

## Java-Umfang (Vorschlag für die FOS)

Dabei: Klassen, Attribute, Konstruktoren (auch mehrere), Getter/Setter, `this`, `extends`, `super(...)`,
Überschreiben, `abstract`, `interface` / `implements`, `ArrayList<T>`, Arrays von Objekten, `static` sichtbar
(unterstrichen) im Klassendiagramm.

Nicht dabei (vorerst): eigene Generics, innere und anonyme Klassen, Lambdas, Enums, Exceptions im Objektdiagramm.

## Offene Fragen an Holger

1. Eigene Welt `?visuobject` oder zuerst als neue Spalte in VisuStruct, die später zur Welt wird?
2. Start mit Schritt 1 + 2 (Klassendiagramm ⇄ Java), Anwendungsfalldiagramm gleich mit dazu?
3. Passt der Java-Umfang oben?
4. Dateiformat: Klassendiagramm nur aus dem Java-Code ableiten (keine eigene Datei) und Anwendungsfalldiagramm als eigene Datei, z. B. `.visuusecase`?
