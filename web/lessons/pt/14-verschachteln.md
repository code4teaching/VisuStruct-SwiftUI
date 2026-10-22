---
titel: Encaixar
bereich: Fundamentos
kurz: Combinar decisões dentro de ciclos e ciclos dentro de ciclos.
---

## Blocos uns dentro dos outros

Já conheces todos os blocos importantes: sequência, decisão, seleção e três tipos de ciclos. Só juntos é que eles se tornam realmente poderosos.

Cada ramo e cada corpo do ciclo é, ele próprio, uma sequência. Podes pôr lá qualquer elemento, incluindo mais decisões e ciclos. A isto chama-se **encaixar**.

> Para isso, basta arrastares um elemento para o marcador ø dentro de um ciclo ou de um ramo.

## Uma decisão dentro de um ciclo

O ciclo percorre todos os números, e a decisão decide para cada número se acontece alguma coisa. Assim podes contar, por exemplo, quantos números pares há de 1 a n.

::: diagramm l13-gerade-zaehlen.visustruct
Em cada iteração, a decisão verifica com i % 2 == 0 se i é par. Só nesse caso quantidade aumenta 1. O ramo false fica vazio.
:::

Com n = 7 são os números 2, 4 e 6, portanto é mostrado 3.

## Exercício: Contar entradas pares

::: übung l13-gerade-eingaben
titel: Contar entradas pares
auftrag: Pede exatamente **cinco** números inteiros, um a seguir ao outro. Depois mostra quantos deles eram pares.
test: 1, 2, 3, 4, 5 -> 2
test: 2, 4, 6, 8, 10 -> 5
test: 1, 3, 5, 7, 9 -> 0
test: 10, 11, 0, 7, 8 -> 3
braucht: forSchleife, verzweigung
tipp: Fazer a mesma coisa cinco vezes significa: ciclo. Em cada iteração é lido e verificado um número.
tipp: Um ciclo for de 1 a 5. No interior vem primeiro a entrada `input: int numero "Introduz um número"`, por baixo uma decisão com `numero % 2 == 0`. No ramo true aumentas `quantidade` em 1.
lösung: l13-gerade-eingaben-loesung.visustruct
:::

## Um ciclo dentro de um ciclo

Se um ciclo estiver dentro de outro, o **ciclo interior é executado do princípio ao fim em cada iteração do exterior**. Com isto podes construir padrões de linhas e colunas.

::: diagramm l13-dreieck.visustruct
O ciclo exterior conta as linhas. O interior acrescenta ao texto tantas estrelas quantas o número da linha indica. Com n = 3 obténs um triângulo de 1, 2 e 3 estrelas.
:::

Com `String texto = ""` cada linha começa vazia. `texto = texto + "*"` acrescenta uma estrela. Só quando a linha está pronta é que é mostrada.

## Exercício: Retângulo

::: übung l13-rechteck
titel: Retângulo
auftrag: Pede uma largura e uma altura. Mostra um retângulo feito de `#`: tantas linhas como a altura, e em cada linha tantos `#` como a largura.
test: 3, 2 -> ### | ###
test: 1, 3 -> # | # | #
test: 4, 1 -> ####
test: 2, 2 -> ## | ##
braucht: forSchleife
tipp: Precisas de dois ciclos, um dentro do outro: um para as linhas e, lá dentro, um para os caracteres de uma linha.
tipp: Constrói-o como o triângulo. A diferença: o ciclo interior conta sempre até `largura`, não até ao número da linha. O ciclo exterior conta até `altura`.
lösung: l13-rechteck-loesung.visustruct
:::

## Não perder o fio

Nos diagramas encaixados, o desenho ajuda-te: o que está mais para dentro fica recuado e rodeado pelo seu ciclo ou ramo.

- Lê de fora para dentro: o que se repete? O que é decidido em cada iteração?
- Dá nomes com significado às variáveis contadoras, como `linha` e `coluna`. Dois ciclos não podem alterar a mesma variável contadora.
- Percorre um exemplo na simulação com **Passo** e observa as variáveis.

::: angeberwissen
Foi exatamente para isto que o estrutograma foi inventado. Shneiderman perguntou-se: se devemos passar sem GOTO, porque não passar também sem as setas do fluxograma? O resultado: nada de esparguete de setas, e cada bloco fica bem arrumado no seu cercado. [A história toda](https://visustruct.org/pt/angeberwissen.html)
:::

## Lista de verificação

::: checkliste
- Sei pôr uma decisão dentro de um ciclo. → Uma decisão dentro de um ciclo
- Sei pôr um ciclo dentro de outro ciclo. → Um ciclo dentro de um ciclo
- Sei que o ciclo interior é executado do princípio ao fim em cada iteração do exterior. → Um ciclo dentro de um ciclo
:::

## Teste de conhecimentos

::: quiz
? O ciclo exterior é executado 3 vezes, o interior 4 vezes. Quantas vezes é executado ao todo o interior do ciclo interior?
- [ ] 7 vezes
- [x] 12 vezes
- [ ] 4 vezes
> Em cada uma das 3 iterações exteriores, o ciclo interior é executado 4 vezes, portanto 3 · 4 = 12.

? Como sabes se um número é par?
- [ ] `numero / 2 == 0`
- [x] `numero % 2 == 0`
- [ ] `numero == 2`
> O % dá o resto de uma divisão. Nos números pares, o resto da divisão por 2 é zero.

? Há uma decisão dentro de um ciclo for. Quantas vezes é verificada a condição da decisão?
- [ ] Uma vez
- [x] Uma vez por iteração do ciclo
- [ ] Só se for verdadeira
> A decisão faz parte do interior e é executada em cada iteração.
:::
