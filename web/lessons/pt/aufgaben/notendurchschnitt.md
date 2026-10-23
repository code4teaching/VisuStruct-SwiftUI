---
titel: Média das notas
nach: 13
stufe: 2
---

Como te correu ultimamente? A média é a soma de todas as notas a dividir pelo número de notas.

::: übung aufgabe-durchschnitt
titel: Média das notas
auftrag: Pergunta primeiro quantas notas vão ser introduzidas. Depois lê exatamente essas notas e mostra a média, só o número.
  Para as notas 4 e 5, a média é **4.5**.
test: 2, 4, 5 -> 4.5
test: 3, 3, 4, 5 -> 4
test: 4, 3, 3, 4, 5 -> 3.75
braucht: forSchleife
tipp: Precisas da soma de todas as notas e de quantas são. A média é a soma a dividir pela quantidade.
tipp: O ciclo for vai de `int i = 0` enquanto `i < quantidade`. Lá dentro lês uma nota e somas à soma. Guardas a média como número decimal: `double media = soma * 1.0 / quantidade`. O `* 1.0` garante que também o Java não faz uma divisão inteira.
lösung: aufgabe-durchschnitt-loesung.visustruct
:::
