---
titel: Data as JSON
bereich: Files
kurz: Understand JSON files, get values out with indexOf and substring, and write JSON yourself.
---

## Skills I will gain now

::: kompetenzen
- recognise objects, keys, values and lists in JSON
- get a value out of a JSON line with indexOf and substring
- output all values of one key from a JSON file
- build and save a JSON entry with + and \"
- save data as a JSON file
- name one strength and one weakness of JSON
:::

## Data with names

The castle zoo stores its animals in a file `zoo.json`:

::: datei zoo.json
{
  "zoo": "Castle Zoo",
  "animals": [
    {"name": "Ludwig", "species": "billy goat", "age": 7},
    {"name": "Zora", "species": "goat", "age": 6},
    {"name": "Fox", "species": "red fox", "age": 4},
    {"name": "Hare", "species": "brown hare", "age": 2}
  ]
}
:::

This is **JSON**, the "JavaScript Object Notation". Almost every web app and every game sends and stores data like this. Unlike in a CSV file, each value has its **name** in front of it, the **key**.

| Character | Meaning | Example |
|---|---|---|
| `{ … }` | an **object**: pairs of key and value | `{"name": "Zora", "age": 6}` |
| `"key": value` | a pair, separated by a colon | `"age": 6` |
| `[ … ]` | a **list** of values, like an array | `"animals": [ … ]` |
| `,` | separates the pairs and the entries of a list | |
| `"…"` | a text. Numbers and `true`/`false` have no quotation marks. | `"goat"`, `6` |

Objects and lists can be **nested**: the whole zoo object contains the list `animals`, and each animal is an object again. As with arrays, the list counts from 0: `animals[1].name` is `"Zora"`.

::: angeberwissen
Douglas Crockford made JSON popular in the early 2000s. In the licence of his JSON program he wrote: “The Software shall be used for Good, not Evil.” So the company IBM asked whether it could use it anyway. He replied that IBM and its customers were allowed to use it for evil.
:::

## Getting a value out

Professionals read JSON with a library, for example **Gson**. It is not part of Java and has to be added first. For our zoo file, the string methods from lesson 17 are enough, because each animal is on its own line.

In Java you write a quotation mark inside a text as `\"`. So the text `"\"name\": \""` is `"name": "`, exactly what comes before each name.

```java
String line = "{\"name\": \"Zora\", \"species\": \"goat\", \"age\": 6},";
int start = line.indexOf("\"name\": \"") + 9;
int end = line.indexOf("\"", start);
String name = line.substring(start, end);
```

- `indexOf("\"name\": \"")` finds the start of `"name": "`. That is 9 characters, so the name begins 9 characters further on.
- `indexOf("\"", start)` searches for the next quotation mark **from** `start`. That is where the name ends.
- `substring(start, end)` cuts out the name: `Zora`.

::: diagramm dt-json.visustruct
Getting the name out of a JSON line.
:::

## Exercise: All the names in the zoo

::: übung l26-java-namen
titel: All the names in the zoo
code: java
auftrag: Read `zoo.json` line by line. In every line that contains `"name"`, print only the name.
start: l26-java-namen-start.visustruct
test: - -> Ludwig | Zora | Fox | Hare
braucht: whileSchleife, verzweigung
tipp: Check with `line.contains("\"name\"")` whether there is a name in the line. Skip the other lines.
tipp: Inside the if: `int start = line.indexOf("\"name\": \"") + 9;`, then `int end = line.indexOf("\"", start);` and `System.out.println(line.substring(start, end));`.
lösung: l26-java-namen-loesung.visustruct
:::

## Writing JSON

To write, you put the text together with `+` and write it to the file with the PrintWriter from lesson 23. Texts in JSON need quotation marks, so `\"` in the Java text, numbers don't:

```java
String name = "Zora";
int points = 15;
String entry = "{\"name\": \"" + name + "\", \"points\": " + points + "}";
// entry is {"name": "Zora", "points": 15}
```

In a list there is a comma between the entries, but **none** after the last one. You check that with an if.

::: ludwig
A single forgotten quotation mark or one comma too many, and no program can read the file any more. JSON is strict. That is why professionals also use a library for writing.
:::

## Exercise: Saving points as JSON

::: übung l26-java-schreiben
titel: Saving points as JSON
code: java
auftrag: Save the points from the quiz tournament as a list in `points.json`. Each line contains an object with **name** and **points**, and there is a comma between the objects. At the end, print **3 entries saved**.
start: l26-java-schreiben-start.visustruct
test: - -> 3 entries saved
datei: points.json -> [ | {"name": "Ludwig", "points": 12}, | {"name": "Zora", "points": 15}, | {"name": "Fox", "points": 9} | ]
braucht: forSchleife, verzweigung
tipp: Go through the arrays with `for (int i = 0; i < names.length; i++)`. Build the entry with `"  {\"name\": \"" + names[i] + "\", \"points\": " + points[i] + "}"`.
tipp: If `i < names.length - 1`, add `","`. After the loop, write `"]"` and close the file.
lösung: l26-java-schreiben-loesung.visustruct
:::

## Strengths and weaknesses of JSON

| Good | Tricky |
|---|---|
| Every value has a name. You can see at once what `6` means. | The file is longer than a CSV file, because the keys appear on every line. |
| Data can be nested, for example a list inside an object. | Java can't read JSON on its own. You need a library such as Gson. |
| JSON is the standard on the web. Almost every programming language knows it. | One character too many or too few makes the whole file unreadable. |

## Game: Which key?

::: spiel frage
titel: Game: Which key?
intro: Ludwig is looking for values in JSON files. Read the file and say which value is meant. Five rounds.

runde:
    {"name": "Zora", "species": "goat", "age": 6}
frage: What is the value of **age**?
- "age"
- [x] 6
- "goat"
> The key comes before the colon, the value after it. Numbers have no quotation marks.

runde:
    {
      "animals": [
        {"name": "Ludwig", "age": 7},
        {"name": "Zora", "age": 6},
        {"name": "Fox", "age": 4}
      ]
    }
frage: What is **animals[1].name**?
- Ludwig
- [x] Zora
- Fox
> The list counts from 0, like an array. `animals[1]` is the second animal.

runde:
    {
      "zoo": "Castle Zoo",
      "boss": {"name": "Ludwig", "species": "billy goat"}
    }
frage: How do you get to **billy goat**?
- [x] boss.species
- species
- zoo.boss.species
> `species` is inside the object `boss`. So the way goes through `boss`.

runde:
    {
      "name": "Hare",
      "favouriteFood": ["carrots", "clover", "dandelions"]
    }
frage: What is **favouriteFood[2]**?
- clover
- carrots
- [x] dandelions
> Index 0 is carrots, 1 is clover, 2 is dandelions. Something like this hardly fits into one cell in CSV.

runde:
    {"name": "Fox", "age": 4, "hungry": true}
frage: Which key has a truth value?
- name
- age
- [x] hungry
> `true` and `false` have no quotation marks, like numbers. In Java this would be a `boolean`.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can recognise objects, keys, values and lists in JSON. → Data with names
- I can get a value out of a JSON line with indexOf and substring. → Getting a value out
- I can output all values of one key from a JSON file. → Exercise: All the names in the zoo
- I can build and save a JSON entry with + and \". → Writing JSON
- I can save data as a JSON file. → Exercise: Saving points as JSON
- I can name one strength and one weakness of JSON. → Strengths and weaknesses of JSON
:::

## Quiz

::: quiz
? What comes before each value in JSON?
→ Data with names
- [ ] its line number
- [x] its key, for example "name"
- [ ] a semicolon
> Key and value are separated by a colon.

? How do you write a quotation mark inside a Java text?
→ Writing JSON
- [ ] ""
- [x] \"
- [ ] '"'

? In {"animals": [{"name": "Ludwig"}, {"name": "Zora"}]}, what is the value of animals[0].name?
→ Data with names
- [x] Ludwig
- [ ] Zora
- [ ] animals
> The list counts from 0.

? Match.
→ Strengths and weaknesses of JSON
= { } -> an object with keys and values
= [ ] -> a list
= : -> separates key and value
:::
