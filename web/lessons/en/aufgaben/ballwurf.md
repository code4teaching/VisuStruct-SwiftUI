---
titel: Ball throw results
nach: 25
stufe: 2
---

At sports day everyone wrote their ball throw distance into a table:

::: datei throw.csv
Name;Distance
Ludwig;28
Zora;42
Fox;35
Hare;21
:::

::: übung aufgabe-ballwurf
titel: Ball throw results
code: java
auftrag: Read the file and skip the header line. Output how many took part (**Participants: 4**) and how far they threw on average (**Average: 31.5 m**).
  Save the longest throw in the file **winner.txt**, for example **Winner: Zora (42 m)**.
start: aufgabe-ballwurf-start.visustruct
test: - -> Participants: 4 | Average: 31.5 m
datei: winner.txt -> Winner: Zora (42 m)
braucht: whileSchleife, verzweigung
tipp: You need four variables before the loop: the count, the sum as a `double`, the best distance and the best name.
tipp: In the loop: `String[] parts = line.split(";");` and `int distance = Integer.parseInt(parts[1]);`. If `distance > bestDistance`, remember the distance and the name. To save: `PrintWriter out = new PrintWriter("winner.txt");`, `out.println(…)` and `out.close();`.
lösung: aufgabe-ballwurf-loesung.visustruct
:::
