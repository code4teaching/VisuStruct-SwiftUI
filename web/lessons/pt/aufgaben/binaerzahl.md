---
titel: Número binário
nach: 11
stufe: 3
---

Os computadores fazem contas só com dois algarismos: 0 e 1. É assim que se converte um número para o **sistema binário**:

1. Divide o número por 2 e guarda o resto (0 ou 1).
2. Continua com o resultado sem o resto.
3. Repete isto até o número ser 0.

Os restos lidos **de baixo para cima** dão o número binário. Para 6, os restos são 0, 1, 1, portanto o número binário é 110.

::: übung aufgabe-binaer
titel: Número binário
auftrag: Pede um número inteiro maior do que 0 e mostra-o como número binário. Para 6 a saída é **110**, para 13 **1101**.
test: 6 -> 110
test: 13 -> 1101
test: 1 -> 1
test: 8 -> 1000
braucht: whileSchleife
tipp: Vai dividindo o número por 2 e guarda cada resto. Os restos lidos ao contrário dão o número binário.
tipp: Junta os algarismos num texto: `String binario = ""`. No ciclo calculas `int resto = numero % 2` e acrescentas o resto à **frente**: `binario = resto + binario`. Depois, `numero = numero / 2`. Como numero é um número inteiro, o resto desaparece.
lösung: aufgabe-binaer-loesung.visustruct
:::
