---
titel: Ciclo for
bereich: Fundamentos
kurz: Contar um número fixo de iterações com Início, Condição e Passo.
---

## Contar com um plano fixo

No ciclo while já foste contando: um valor inicial antes do ciclo, uma condição na cabeça, uma alteração no interior. O **ciclo for** junta estas três partes na cabeça. Assim vês num relance como ele conta.

Quando clicas num ciclo for, ele tem três campos à direita:

- **Início:** `int i = 1` cria a variável contadora.
- **Condição:** `i <= 5` diz até quando se conta.
- **Passo:** `i++` aumenta `i` em 1 depois de cada iteração.

::: diagramm l12-eins-bis-fuenf.visustruct
Um ciclo for que mostra os números de 1 a 5.
:::

## Por que ordem?

As três partes são executadas em momentos diferentes:

1. O **Início** é executado exatamente uma vez, logo no começo.
2. A **Condição** é verificada antes de cada iteração. Se for falsa, o ciclo termina.
3. Depois do interior vem o **Passo**, depois outra vez a condição.

::: grafik l12-for-ablauf.svg
O Início só é executado uma vez. Depois, a condição, o interior e o passo repetem-se.
:::

Portanto, o ciclo for é um ciclo pré-teste, como o ciclo while. Percorre o exemplo na simulação com **Passo** e observa como `i` muda.

> Usa o ciclo for quando sabes de antemão quantas vezes uma coisa deve acontecer. Se o fim depender de algo que só acontece durante o ciclo, por exemplo uma entrada, é melhor o ciclo while ou do-while.

## Exemplo: soma de 1 a n

Um ciclo for é bom para somar números. Antes do ciclo está `int soma = 0`. Em cada iteração soma-se o número atual `i`.

::: diagramm l12-summe.visustruct
Com n = 4, o ciclo calcula 0 + 1 + 2 + 3 + 4. No fim é mostrado 10.
:::

## Outros passos

O passo nem sempre tem de ser `i++`:

- `i--` conta para trás, por exemplo com Início `int i = 10` e Condição `i >= 1`.
- `i = i + 2` salta de dois em dois, por exemplo 0, 2, 4, 6.

Garante que o Início, a Condição e o Passo combinam. Com Início `int i = 1`, Condição `i >= 1` e Passo `i++`, a condição nunca fica falsa.

::: übung l12-countdown
titel: Contagem decrescente
auftrag: Pede um número inteiro `n`. Usa um ciclo for para contar para trás de `n` até 1 e mostra cada número. Depois mostra **Já!**.
test: 3 -> 3 | 2 | 1 | Já!
test: 5 -> 5 | 4 | 3 | 2 | 1 | Já!
test: 1 -> 1 | Já!
braucht: forSchleife
tipp: Desta vez o ciclo for conta para trás. Pensa onde começa, quando para e como conta.
tipp: O Início é `int i = n`, a condição `i >= 1` e o passo `i--`. A saída Já! fica por baixo do ciclo, não dentro dele.
lösung: l12-countdown-loesung.visustruct
:::

## Exercício: Tabuada

::: übung l12-einmaleins
titel: Tabuada
auftrag: Pede um número e mostra a sua tabuada de 1 a 10. Cada linha fica assim: **3 x 1 = 3**, **3 x 2 = 6** e assim por diante.
test: 3 -> 3 x 1 = 3 | 3 x 2 = 6 | 3 x 3 = 9 | 3 x 4 = 12 | 3 x 5 = 15 | 3 x 6 = 18 | 3 x 7 = 21 | 3 x 8 = 24 | 3 x 9 = 27 | 3 x 10 = 30
test: 7 -> 7 x 1 = 7 | 7 x 2 = 14 | 7 x 3 = 21 | 7 x 4 = 28 | 7 x 5 = 35 | 7 x 6 = 42 | 7 x 7 = 49 | 7 x 8 = 56 | 7 x 9 = 63 | 7 x 10 = 70
braucht: forSchleife
tipp: O ciclo conta de 1 a 10. Em cada iteração mostras uma linha da tabuada.
tipp: No interior, calcula primeiro `int produto = numero * i`. Depois mostra `numero + " x " + i + " = " + produto`. Não te esqueças dos espaços dentro das aspas.
lösung: l12-einmaleins-loesung.visustruct
:::

## Exercício: Corrigir a soma

::: übung l16-summe
titel: Corrigir a soma
auftrag: O estrutograma deve somar todos os números de 1 a n. Ou seja, com n = 4 o resultado deve ser 1 + 2 + 3 + 4 = **10**. Mas mostra 6.
  Faz um teste de secretária ou usa **Passo** e corrige o erro.
start: l16-summe-start.visustruct
test: 4 -> 10
test: 1 -> 1
test: 5 -> 15
braucht: forSchleife
tipp: Percorre o ciclo com n = 4 de cabeça ou com **Passo**. Que números são realmente somados?
tipp: Olha para o último valor de i com que o ciclo é executado. Com n = 4, também tem de ser somado i = 4.
lösung: l16-summe-loesung.visustruct
:::

## Lista de verificação

::: checkliste
- Conheço as três partes Início, Condição e Passo do ciclo for. → Contar com um plano fixo
- Sei por que ordem são executadas as três partes. → Por que ordem?
- Sei contar para a frente, para trás e em passos maiores com um ciclo for. → Outros passos
:::

## Teste de conhecimentos

::: quiz
? Quantas vezes é executado o Início de um ciclo for?
- [x] Exatamente uma vez
- [ ] Antes de cada iteração
- [ ] Depois de cada iteração
> O Início cria a variável contadora uma vez, no começo.

? Início `int i = 0`, Condição `i < 3`, Passo `i++`. Que valores tem i dentro do ciclo?
- [ ] 1, 2, 3
- [x] 0, 1, 2
- [ ] 0, 1, 2, 3
> Com i = 3 a condição é falsa, por isso o interior já não é executado.

? Início `int i = 2`, Condição `i <= 10`, Passo `i = i + 2`. Quantas vezes é executado o interior?
- [ ] 4 vezes
- [x] 5 vezes
- [ ] 10 vezes
> i toma os valores 2, 4, 6, 8 e 10.

? Quando é que um ciclo for serve melhor?
- [x] Quando sabes de antemão quantas vezes repetir
- [ ] Quando perguntas até uma entrada ser válida
- [ ] Quando só é verificado um único valor
:::
