---
titel: Calculadora
nach: 10
stufe: 2
---

Uma pequena calculadora: escreves dois números e um operador, e aparece o resultado.

::: übung aufgabe-rechner
titel: Calculadora
auftrag: Pede dois números inteiros e depois um operador como texto: `+`, `-` ou `*`. Mostra o resultado. Para qualquer outro sinal mostra **Operador desconhecido**.
test: 3, 4, + -> 7
test: 10, 4, - -> 6
test: 6, 7, * -> 42
test: 1, 2, x -> Operador desconhecido
braucht: fallauswahl
tipp: Lê os três valores. Depois, uma seleção sobre o operador decide o que é calculado.
tipp: Lês o operador com `input: String operador "Operador"`. A seleção verifica `operador`, os casos chamam-se `"+"`, `"-"` e `"*"`, e o último caso é `default`. Em cada caso, calcula primeiro numa variável e depois mostra-a, senão o `+` só junta os números.
lösung: aufgabe-rechner-loesung.visustruct
:::
