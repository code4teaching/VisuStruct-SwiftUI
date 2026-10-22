---
titel: Sequência de Collatz
nach: 11
stufe: 2
---

A sequência de Collatz é um enigma famoso da matemática. Começas com um número e aplicas sempre a mesma regra:

- Se o número for **par**, divides por 2.
- Se for **ímpar**, multiplicas por 3 e somas 1.

Até agora, para todos os números iniciais que alguém experimentou, a sequência acaba por chegar a 1. Se isto é verdade para todos os números, ninguém sabe até hoje.

::: übung aufgabe-collatz
titel: Sequência de Collatz
auftrag: Pede um número inicial. Aplica a regra até o número ser 1 e mostra o novo número depois de cada passo. Vai contando os passos e mostra no fim **Passos:** e o número de passos.
  Com o número inicial 6, a sequência é 3, 10, 5, 16, 8, 4, 2, 1. São 8 passos.
test: 6 -> 3 | 10 | 5 | 16 | 8 | 4 | 2 | 1 | Passos: 8
test: 3 -> 10 | 5 | 16 | 8 | 4 | 2 | 1 | Passos: 7
test: 1 -> Passos: 0
braucht: whileSchleife, verzweigung
tipp: Não sabes quantos passos vão ser. Por isso um ciclo while serve melhor do que um ciclo for.
tipp: O ciclo while é executado enquanto `numero != 1`. Verificas se um número é par com `numero % 2 == 0`. A saída e `passos++` vêm depois da decisão, mas ainda dentro do ciclo.
lösung: aufgabe-collatz-loesung.visustruct
:::

::: angeberwissen
Esta tarefa pode tornar-te rico! O matemático Paul Erdős ofereceu 500 dólares por uma demonstração. Em 2021, a empresa japonesa Bakuage juntou bastante mais: 120 milhões de ienes, na altura cerca de um milhão de dólares, por uma demonstração ou um contraexemplo. Ainda ninguém foi buscar o dinheiro. Já agora, o enigma foi inventado pelo matemático alemão Lothar Collatz em 1937. Vou já começar a fazer contas; com tanto dinheiro compra-se muito feno.
:::
