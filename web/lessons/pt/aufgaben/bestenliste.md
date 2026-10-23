---
titel: Classificação
nach: 19
stufe: 2
---

Cinco cabras fizeram a corrida de obstáculos. Agora a classificação vai para a porta do estábulo: mais pontos em cima, menos pontos em baixo.

::: übung aufgabe-bestenliste
titel: Classificação
auftrag: Lê 5 pontuações para um array. Ordena o array com o bubble sort por ordem **decrescente**, ou seja, o maior número primeiro. Depois mostra a lista com o lugar, por exemplo **1. 9**, na linha seguinte **2. 9** e assim por diante.
test: 3, 9, 2, 9, 1 -> 1. 9 | 2. 9 | 3. 3 | 4. 2 | 5. 1
test: 10, 20, 30, 40, 50 -> 1. 50 | 2. 40 | 3. 30 | 4. 20 | 5. 10
test: 5, 4, 3, 2, 1 -> 1. 5 | 2. 4 | 3. 3 | 4. 2 | 5. 1
braucht: forSchleife, verzweigung
tipp: O bubble sort da lição 19 ordena por ordem crescente. Para decrescente basta inverter a comparação dos vizinhos.
tipp: Troca-se quando `pontos[i] < pontos[i + 1]`, com uma variável auxiliar. Para a saída, calcula primeiro `int lugar = i + 1` e depois mostra `lugar + ". " + pontos[i]`.
lösung: aufgabe-bestenliste-loesung.visustruct
:::
