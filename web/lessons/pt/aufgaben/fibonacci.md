---
titel: Números de Fibonacci
nach: 13
stufe: 2
---

Nos números de Fibonacci, cada número é a soma dos dois anteriores. A sequência começa com 1 e 1:

1, 1, 2, 3, 5, 8, 13, 21, …

Encontras estes números surpreendentemente vezes na natureza, por exemplo na forma como as sementes do girassol estão dispostas.

::: übung aufgabe-fibonacci
titel: Números de Fibonacci
auftrag: Pergunta quantos números de Fibonacci devem ser mostrados. Depois mostra exatamente esses, cada um na sua linha. Podes partir do princípio de que é introduzido pelo menos 2.
test: 5 -> 1 | 1 | 2 | 3 | 5
test: 8 -> 1 | 1 | 2 | 3 | 5 | 8 | 13 | 21
test: 2 -> 1 | 1
braucht: forSchleife
tipp: Cada número novo é a soma dos dois anteriores. Por isso tens sempre de guardar os dois últimos números.
tipp: Guarda os dois últimos números em `numero1` e `numero2` e mostra os dois antes do ciclo. O ciclo começa em `int i = 2`. Lá dentro calculas `int numero3 = numero1 + numero2`, mostras e depois avanças: `numero1 = numero2` e `numero2 = numero3`.
lösung: aufgabe-fibonacci-loesung.visustruct
:::
