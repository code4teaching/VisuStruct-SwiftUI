---
titel: Números de Fibonacci
nach: 13
stufe: 2
---

Nos números de Fibonacci, cada número é a soma dos dois anteriores. A sequência começa com 1 e 1:

1, 1, 2, 3, 5, 8, 13, 21, …

Encontras estes números surpreendentemente vezes na natureza, por exemplo na forma como as sementes do girassol estão dispostas.

::: ludwig
Lembras-te da **troca** da lição 5? Aí precisavas de uma variável auxiliar, porque `a = b` substitui o valor antigo de `a`. Aqui é igual: antes de `numero2` receber o número novo, o seu valor antigo tem de estar guardado em `numero1`. Atenção à **ordem**: primeiro `numero1 = numero2`, depois `numero2 = numero3`. Vais precisar outra vez de avançar e trocar valores mais tarde, por exemplo ao ordenar na lição 19.
:::

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

E agora o mesmo em Java:

::: übung aufgabe-fibonacci-java
titel: Números de Fibonacci em Java
code: java
auftrag: Resolve agora em Java a tarefa de cima. As saídas ficam exatamente iguais.
test: 5 -> 1 | 1 | 2 | 3 | 5
test: 8 -> 1 | 1 | 2 | 3 | 5 | 8 | 13 | 21
test: 2 -> 1 | 1
braucht: forSchleife
tipp: Os dois primeiros números mostras antes do ciclo. O ciclo `for` começa então em `int i = 2`.
tipp: No corpo: `int numero3 = numero1 + numero2;`, mostrar, depois `numero1 = numero2;` e `numero2 = numero3;`.
lösung: aufgabe-fibonacci-loesung.visustruct
:::

::: quiz
? Porque é que no ciclo `numero1 = numero2` tem de vir antes de `numero2 = numero3`?
- [ ] Porque senão o Java não permite as atribuições
- [x] Porque senão o valor antigo de numero2 é substituído antes de numero1 o receber
- [ ] A ordem não importa
> Ao contrário, numero1 e numero2 ficariam depois com o mesmo valor. Tal como na troca: primeiro guardar, depois substituir.
:::
