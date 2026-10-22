---
titel: Batalha naval
nach: 16
stufe: 2
---

No jogo da batalha naval, o mar é uma grelha. As colunas chamam-se A a E, as filas 1 a 5. No diagrama inicial, o mar é o array 2D `mar`: `true` quer dizer que há parte de um navio nesse quadrado.

::: grafik schiffe-versenken.svg
Cinzento quer dizer `true`: aqui há um navio. Os pequenos números cinzentos são os índices no array; começam em 0. No jogo, pelo contrário, os quadrados chamam-se A a E e 1 a 5.
:::

::: übung aufgabe-schiffe
titel: Batalha naval
auftrag: Mostra todos os quadrados que têm um navio, cada quadrado na sua linha, p. ex. **B1**. Percorre o mar fila a fila com dois ciclos encaixados.
  Para o diagrama inicial aparecem **B1**, **C1**, **D1**, **E3**, **E4** e **A5**.
start: aufgabe-schiffe-start.visustruct
test: - -> B1 | C1 | D1 | E3 | E4 | A5
braucht: forSchleife, verzweigung
tipp: Percorre o mar com dois ciclos encaixados, tal como no cinema. Só mostras os quadrados que têm `true`.
tipp: O ciclo exterior conta `fila`, o interior `coluna`, os dois a partir de 0. Se houver um navio em `mar[fila][coluna]`, mostras a letra de `colunas[coluna]` e o número da fila: `output: colunas[coluna] + (fila + 1)`. Precisas do `+ 1` porque o jogo começa a contar em 1.
lösung: aufgabe-schiffe-loesung.visustruct
:::
