---
titel: Adult?
nach: 8
stufe: 1
---

At the cinema, for a driving licence or for voting: it often matters whether someone is already 18.

::: übung aufgabe-volljaehrig
titel: Adult?
auftrag: Ask for the age. If the person is 18 or older, output **adult**, otherwise **minor**.
test: 18 -> adult
test: 35 -> adult
test: 17 -> minor
test: 6 -> minor
braucht: verzweigung
tipp: There are two possible outputs, so you need a branch.
tipp: Read in the age with `input: int age "How old are you?"`. The condition of the branch is `age >= 18`. Make sure that 18 already counts as adult.
lösung: aufgabe-volljaehrig-loesung.visustruct
:::

And now the same in Java:

::: übung aufgabe-volljaehrig-java
titel: Adult? in Java
code: java
auftrag: Now solve the task above in Java. The outputs stay exactly the same.
test: 18 -> adult
test: 35 -> adult
test: 17 -> minor
test: 6 -> minor
braucht: verzweigung
tipp: Read the age with `int age = scanner.nextInt();`.
tipp: `if (age >= 18) { … } else { … }`, with a `System.out.println(…)` in each branch.
lösung: aufgabe-volljaehrig-loesung.visustruct
:::
