---
titel: Age in a subprogram
nach: 18
stufe: 2
---

The age check from “Adult?” now becomes a subprogram of its own. The main program only calls it.

::: übung aufgabe-alter-unterprogramm
titel: Age in a subprogram
auftrag: Build two diagrams. The main program outputs **Welcome**, then calls `checkAge()` and finally outputs **Goodbye**.
  The subprogram `checkAge` is in a tab of its own: it asks for the age and outputs **adult** or **minor**.
test: 20 -> Welcome | adult | Goodbye
test: 18 -> Welcome | adult | Goodbye
test: 12 -> Welcome | minor | Goodbye
braucht: aufruf
tipp: The main program has three boxes. The subprogram does the real work.
tipp: Open the exercise in the editor and build the main program there with the call `checkAge()`. Then open a new tab with **+** and give it the title `checkAge`. Build the input and the branch in it. Check finds the subprogram by the title of the tab.
lösung: aufgabe-alter-haupt-loesung.visustruct
unterprogramm: aufgabe-alter-unterprogramm-loesung.visustruct
:::
