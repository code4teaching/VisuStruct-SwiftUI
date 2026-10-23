---
titel: Ballwurf auswerten
nach: 25
stufe: 2
---

Beim Sportfest haben alle ihre Weite beim Ballwurf in eine Tabelle eingetragen:

::: datei ballwurf.csv
Name;Weite
Ludwig;28
Zora;42
Fuchs;35
Hase;21
:::

::: übung aufgabe-ballwurf
titel: Ballwurf auswerten
code: java
auftrag: Lies die Datei ein und überspringe die Kopfzeile. Gib aus, wie viele mitgemacht haben (**Teilnehmer: 4**) und wie weit im Schnitt geworfen wurde (**Schnitt: 31.5 m**).
  Speichere den weitesten Wurf in der Datei **sieger.txt**, zum Beispiel **Sieger: Zora (42 m)**.
start: aufgabe-ballwurf-start.visustruct
test: - -> Teilnehmer: 4 | Schnitt: 31.5 m
datei: sieger.txt -> Sieger: Zora (42 m)
braucht: whileSchleife, verzweigung
tipp: Du brauchst vier Variablen vor der Schleife: die Anzahl, die Summe als `double`, die beste Weite und den besten Namen.
tipp: In der Schleife: `String[] teile = zeile.split(";");` und `int weite = Integer.parseInt(teile[1]);`. Ist `weite > besteWeite`, merkst du dir Weite und Namen. Zum Speichern: `PrintWriter aus = new PrintWriter("sieger.txt");`, `aus.println(…)` und `aus.close();`.
lösung: aufgabe-ballwurf-loesung.visustruct
:::
