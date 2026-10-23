---
titel: Sortear quem limpa o quadro
nach: 15
stufe: 2
---

Quem é que limpa o quadro esta semana? Cinco nomes vão para um array, depois é sorteado um número.

::: übung aufgabe-tafeldienst
titel: Sortear quem limpa o quadro
auftrag: Lê cinco nomes para um array de Strings. Depois pede um número sorteado de 1 a 5 e mostra **Limpa o quadro:** e o nome correspondente.
  O número 1 corresponde ao primeiro nome, o 5 ao último.
test: Ada, Rui, Inês, Duarte, Eva, 3 -> Limpa o quadro: Inês
test: Ada, Rui, Inês, Duarte, Eva, 1 -> Limpa o quadro: Ada
test: Lara, Mário, Nuno, Olga, Pedro, 5 -> Limpa o quadro: Pedro
braucht: forSchleife
tipp: Primeiro, um ciclo lê os cinco nomes. Depois já não precisas de ciclo, só de olhar para uma posição.
tipp: Crias o array com `String[] nomes = new String[5]`. Atenção: o número sorteado começa em 1, o índice em 0. Por isso o nome está em `nomes[sorteado - 1]`.
lösung: aufgabe-tafeldienst-loesung.visustruct
:::

> Com `int sorteado = (int) (Math.random() * 5) + 1` também podes deixar o acaso sortear o número. Mas para a verificação automática precisamos de uma entrada fixa.
