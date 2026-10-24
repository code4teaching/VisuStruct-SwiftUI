---
titel: Vocabulary trainer
nach: 27
stufe: 3
---

Ludwig is learning German. His words are in a CSV file, English on the left, German on the right:

::: datei words.csv
English;German
goat;Ziege
hay;Heu
meadow;Wiese
:::

Because only the file knows the words, you can simply add new lines later without changing the program.

::: angeberwissen
Sebastian Leitner made the flashcard box with several compartments popular in 1972: cards you know move one compartment further and come up less often, wrong ones go back to the first compartment. Many vocabulary apps still work on this principle today.
:::

::: übung aufgabe-vokabeln
titel: Vocabulary trainer
code: java
auftrag: Ask for every word in the file: output **What is goat in German?** and read the answer with `scanner.next()`. If it is right, output **Right!**, otherwise for example **Wrong, it is Ziege.**
  At the end, show how many were right, for example **2 of 3 right**.
start: aufgabe-vokabeln-start.visustruct
test: Ziege, Heu, Wiese -> What is goat in German? | Right! | What is hay in German? | Right! | What is meadow in German? | Right! | 3 of 3 right
test: Kuh, Heu, Wiese -> What is goat in German? | Wrong, it is Ziege. | What is hay in German? | Right! | What is meadow in German? | Right! | 2 of 3 right
test: Ziege, hay, wiese -> What is goat in German? | Right! | What is hay in German? | Wrong, it is Heu. | What is meadow in German? | Wrong, it is Wiese. | 1 of 3 right
braucht: whileSchleife, verzweigung
tipp: Skip the header line. In the loop, split every line with `split(";")`: `parts[0]` is the English word, `parts[1]` the German one.
tipp: Compare texts with `answer.equals(parts[1])`, not with `==`. Count along with `int right = 0;` and `int count = 0;` before the loop.
lösung: aufgabe-vokabeln-loesung.visustruct
:::
