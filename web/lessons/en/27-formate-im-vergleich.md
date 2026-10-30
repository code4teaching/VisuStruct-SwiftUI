---
titel: Comparing formats
bereich: Files
kurz: Compare the same data as txt, CSV and JSON, choose the right format and convert a file into another format.
---

## Skills I will gain now

::: kompetenzen
- recognise the same data as txt, CSV and JSON
- compare strengths and weaknesses of txt, CSV and JSON
- convert a CSV file into sentences
- convert a CSV file into JSON
:::

## The same animals three times

Ludwig has saved the castle's animals in three files. They all contain the same, just written down differently.

As text, the way you would write it to a person:

::: datei animals.txt
Ludwig (billy goat) is 7 years old.
Zora (goat) is 6 years old.
Fox (red fox) is 4 years old.
:::

As a table in CSV:

::: datei animals.csv
Name;Species;Age
Ludwig;billy goat;7
Zora;goat;6
Fox;red fox;4
:::

As JSON:

::: datei animals.json
[
  {"name": "Ludwig", "species": "billy goat", "age": 7},
  {"name": "Zora", "species": "goat", "age": 6},
  {"name": "Fox", "species": "red fox", "age": 4}
]
:::

## What can each format do?

| | txt | CSV | JSON |
|---|---|---|---|
| Easy for people to read | yes | so-so | so-so |
| Fixed order for programs | no | yes, columns | yes, keys |
| What does a value mean? | it's in the sentence | it's in the header | it's right in front of it |
| Nesting (a list inside an entry) | no | hard | yes |
| Opens in Excel | no | yes | no |
| Reading in Java | Scanner, BufferedReader | plus `split` | string methods or a library |
| Size | small | smallest | largest |

In short:

- **txt** for texts that people read: letters, notes, a logbook.
- **CSV** for tables: grades, measurements, a high-score list. Every line has the same columns.
- **JSON** for data with structure: game saves, settings, everything that goes back and forth between programs and on the web.

::: ludwig
When your weather app fetches the temperature, the answer almost always comes as JSON. And when a teacher exports the grades from the school software, they often get a CSV file.
:::

## Exercise: From CSV to sentences

::: übung l27-java-saetze
titel: From CSV to sentences
code: java
auftrag: Convert `animals.csv` into text. For each animal, write a sentence like **Ludwig (billy goat) is 7 years old.** into the file `sentences.txt`. At the end, print **3 sentences saved**.
start: l27-java-saetze-start.visustruct
test: - -> 3 sentences saved
datei: sentences.txt -> Ludwig (billy goat) is 7 years old. | Zora (goat) is 6 years old. | Fox (red fox) is 4 years old.
braucht: whileSchleife
tipp: The start code already skips the header. Split each line with `String[] parts = line.split(";");`.
tipp: The sentence is `parts[0] + " (" + parts[1] + ") is " + parts[2] + " years old."`. Count along with `count++` and read the next line at the end of the loop.
lösung: l27-java-saetze-loesung.visustruct
:::

## Exercise: From CSV to JSON

::: übung l27-java-json
titel: From CSV to JSON
code: java
auftrag: Convert `animals.csv` into JSON and save it in `animals-new.json`, exactly like `animals.json` above. At the end, print **3 animals saved**.
start: l27-java-json-start.visustruct
test: - -> 3 animals saved
datei: animals-new.json -> [ | {"name": "Ludwig", "species": "billy goat", "age": 7}, | {"name": "Zora", "species": "goat", "age": 6}, | {"name": "Fox", "species": "red fox", "age": 4} | ]
braucht: forSchleife, verzweigung
tipp: `lines[0]` is the header. So start the for loop at `i = 1` and split `lines[i]` with `split(";")`.
tipp: Build the entry with `\"` as in lesson 26. The age is a number and has no quotation marks. Only add a comma if `i < lines.length - 1`.
lösung: l27-java-json-loesung.visustruct
:::

## Game: Which format fits?

::: spiel frage
titel: Game: Which format fits?
intro: Ludwig wants to save data and doesn't know which format to use. Help him. Six rounds.
antworten: txt | CSV | JSON

runde:
frage: The grades of the whole class should be opened in Excel.
richtig: CSV
> Grades are a table, and Excel opens CSV files directly.

runde:
frage: Ludwig writes a letter to Zora.
richtig: txt
> A letter is text for people. It needs no columns and no keys.

runde:
frage: A game save with a name, a level and a list of all the keys collected.
richtig: JSON
> A list inside an entry can be nested in JSON. In CSV it hardly fits into one cell.

runde:
frage: A measuring device saves the time and temperature every minute, for a whole year.
richtig: CSV
> Many identical lines with the same columns: CSV is the smallest for this. JSON would repeat the keys on every line.

runde:
frage: A weather app fetches the forecast from a server on the internet.
richtig: JSON
> JSON is the standard on the web. Almost every app gets its data this way.

runde:
frage: The castle logbook, where every entry is a short sentence.
richtig: txt
> Every line is a sentence for people. It is read line by line, as in lesson 24.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can recognise the same data as txt, CSV and JSON. → The same animals three times
- I can compare strengths and weaknesses of txt, CSV and JSON. → What can each format do?
- I can convert a CSV file into sentences. → Exercise: From CSV to sentences
- I can convert a CSV file into JSON. → Exercise: From CSV to JSON
:::

## Quiz

::: quiz
? Which format does Excel open directly as a table?
→ What can each format do?
- [ ] txt
- [x] CSV
- [ ] JSON

? Why is a JSON file usually larger than a CSV file with the same data?
→ What can each format do?
- [ ] Because JSON stores more numbers.
- [x] Because the keys are repeated in every entry.
- [ ] Because JSON uses no commas.

? In which format does every value say what it means?
→ What can each format do?
- [ ] txt
- [ ] CSV
- [x] JSON
> In JSON the key comes right before the value, for example "age": 7.

? Match each purpose with a format.
→ What can each format do?
= a letter to Zora -> txt
= the class grade list -> CSV
= a game save with lists -> JSON
:::
