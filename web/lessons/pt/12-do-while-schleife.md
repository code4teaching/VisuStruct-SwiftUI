---
titel: Ciclo do-while
bereich: Fundamentos
kurz: Primeiro executar, depois verificar: ciclos com pelo menos uma iteração.
---

## Primeiro fazer, depois verificar

O **ciclo do-while** é um **ciclo pós-teste**. A condição fica em baixo, no pé do bloco. É executado assim:

1. Executar o interior uma vez.
2. Verificar a condição.
3. Se for verdadeira, recomeçar no 1. Se for falsa, o programa continua por baixo do ciclo.

::: grafik l11-vergleich.svg
À esquerda, o ciclo while verifica primeiro; à direita, o ciclo do-while executa primeiro.
:::

Em cima, no bloco, está `do`, e a condição fica no pé. Quando clicas no ciclo, a palavra `while` está à frente do campo de texto no Inspetor de objetos: a condição quer dizer “repete enquanto …”.

> Tal como no ciclo while, a condição diz **quando é que o ciclo se repete**. Enquanto for verdadeira, o ciclo continua.

## Pelo menos uma iteração

Como a condição só é verificada no fim, o interior **é sempre executado pelo menos uma vez**. Essa é a diferença mais importante em relação ao ciclo while.

::: diagramm l11-einmal.visustruct
i vale 10 e, portanto, não é menor do que 5. Mesmo assim, 10 é mostrado uma vez, porque a verificação só vem depois.
:::

Com um ciclo while e a mesma condição `i < 5`, aqui não seria mostrado nada.

## Uso típico: repetir uma entrada

O ciclo do-while serve sempre que alguma coisa tem de acontecer primeiro para a poderes verificar. O melhor exemplo é uma entrada: só depois de alguém ter escrito alguma coisa é que sabes se é válida.

::: diagramm l11-eingabe-pruefen.visustruct
A pergunta repete-se até ser introduzido um número de 1 a 10. Na simulação, experimenta primeiro 0 e depois 12.
:::

Aqui a condição descreve a entrada **inválida**: `numero < 1 || numero > 10`. Enquanto a entrada for inválida, a pergunta é feita outra vez.

## Exercício: Nota válida

::: übung l11-note
titel: Nota válida
auftrag: Pede uma nota. Se não estiver entre 1 e 5, pergunta outra vez. Se for válida, mostra-a, por exemplo **A tua nota: 3**.
test: 3 -> A tua nota: 3
test: 0, 6, 2 -> A tua nota: 2
test: 9, 5 -> A tua nota: 5
test: -1, 1 -> A tua nota: 1
braucht: doUntilSchleife
tipp: A nota é pedida pelo menos uma vez. Depois, a condição decide se se pergunta outra vez.
tipp: Antes do ciclo, cria `int nota = 0`. A entrada `input: nota "Nota de 1 a 5"` fica dentro do ciclo. A condição é `nota < 1 || nota > 5`.
lösung: l11-note-loesung.visustruct
:::

## Exercício: Somar até 0

::: übung l11-summe
titel: Somar até 0
auftrag: Pede números até ser introduzido um 0. Depois mostra a soma de todos os números introduzidos.
test: 3, 4, 0 -> 7
test: 10, 0 -> 10
test: 5, 5, 5, 0 -> 15
test: 0 -> 0
braucht: doUntilSchleife
tipp: Precisas de uma variável para a soma que começa em 0 antes do ciclo. Em cada iteração, o novo número é somado.
tipp: Antes do ciclo, cria `int soma = 0` e `int numero = 0`. No ciclo pedes `numero` e calculas `soma = soma + numero`. Somar o 0 não faz mal. O ciclo continua enquanto `numero != 0`.
lösung: l11-summe-loesung.visustruct
:::

## Lista de verificação

::: checkliste
- Sei que o ciclo do-while só verifica a sua condição depois do interior. → Primeiro fazer, depois verificar
- Sei que o interior é executado pelo menos uma vez. → Pelo menos uma iteração
- Sei repetir uma entrada até ela ser válida. → Uso típico: repetir uma entrada
:::

## Teste de conhecimentos

::: quiz
? O que quer dizer ciclo pós-teste?
- [ ] A condição é verificada antes de cada iteração.
- [x] A condição é verificada depois de cada iteração.
- [ ] O ciclo não tem condição.
> A condição fica no pé, em baixo, e é avaliada depois do interior.

? A condição de um ciclo do-while é falsa desde o início. Quantas vezes é executado o interior?
- [ ] Nenhuma
- [x] Exatamente uma vez
- [ ] Para sempre
> O interior é executado primeiro. Só depois o ciclo nota que deve parar.

? Queres pedir um número de 1 a 10. Que condição fica no pé?
- [ ] `numero >= 1 && numero <= 10`
- [x] `numero < 1 || numero > 10`
- [ ] `numero == 10`
> O ciclo repete-se enquanto a entrada for inválida, ou seja, menor do que 1 ou maior do que 10.

? Quando é que um ciclo do-while é melhor do que um ciclo while?
- [x] Quando o interior tem de ser executado pelo menos uma vez, p. ex. numa entrada
- [ ] Quando o ciclo talvez nem precise de ser executado
- [ ] Quando queres contar exatamente até 10
:::
