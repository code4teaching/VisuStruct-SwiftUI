---
titel: Pesquisar e ordenar
bereich: Fundamentos
kurz: Perceber com cartas de jogar como funcionam a pesquisa linear, a pesquisa binária e o bubble sort, e porque é que alguns métodos são muito mais rápidos.
---

## Procurar uma carta

À tua frente está uma fila de cartas de jogar viradas para baixo. Procuras o 9. O que fazes? Viras uma carta a seguir à outra até encontrares o 9 ou teres virado todas as cartas.

::: grafik ss-lineare-suche.svg
As cartas estão baralhadas. Cada carta que viras é uma comparação: é esta o 9?
:::

É exatamente assim que funciona a **pesquisa linear**: percorre o array do índice 0 até ao fim e compara cada posição com o valor procurado. Funciona sempre, mesmo que os valores estejam baralhados.

No array, as nossas cartas são números. Deixamos de fora o valete, a dama e o rei.

::: diagramm ss-lineare-suche.visustruct
O ciclo é executado até a carta ser encontrada ou já não haver posições. A variável comparacoes conta quantas vezes se comparou. Na simulação, procura o 2, o 27 e o 4.
:::

> Se a carta não estiver lá, `posicao` fica em **-1**. Não existe o índice -1, por isso aqui -1 quer dizer “não encontrado”.

## Exercício: Encontrar uma carta

::: übung ss-karte-suchen
titel: Encontrar uma carta
auftrag: Cria o array `int[] cartas = {8, 4, 11, 4, 6}` e pede uma carta. Mostra a posição da **primeira** carta que corresponde, p. ex. `Posição: 1` para o 4. Se a carta não estiver lá, mostra `Não encontrado`.
test: 4 -> Posição: 1
test: 6 -> Posição: 4
test: 8 -> Posição: 0
test: 9 -> Não encontrado
braucht: whileSchleife, verzweigung
tipp: Percorre o array da frente para trás e compara cada carta com a que procuras.
tipp: Reconstrói o exemplo de cima. Aqui não precisas da variável comparacoes. O ciclo tem de parar assim que `posicao` deixar de ser -1, senão, para o 4, encontras o segundo em vez do primeiro.
lösung: ss-karte-suchen-loesung.visustruct
:::

## Pesquisa binária: ordenado é mais rápido

Agora as cartas estão à tua frente **ordenadas**, da mais pequena para a maior. Procuras o 27. Já não viras a primeira carta da frente, mas a do **meio**:

- Se for a que procuras, terminaste.
- Se for mais pequena, a carta procurada só pode estar à direita. A metade esquerda inteira fica de fora.
- Se for maior, fica de fora a metade direita.

Fazes o mesmo outra vez com o resto. Com cada comparação, o monte fica reduzido a metade.

::: grafik ss-binaere-suche.svg
Três comparações em vez de catorze: com cada meio, metade das cartas que restam fica de fora.
:::

No estrutograma, duas variáveis guardam a parte em que ainda se procura: `esquerda` e `direita`. O meio é `(esquerda + direita) / 2`. Como é uma divisão inteira, o resultado é sempre um índice inteiro.

::: diagramm ss-binaere-suche.visustruct
O mesmo array da pesquisa linear. Na simulação, procura outra vez o 27 e compara a saída Comparações com a pesquisa linear.
:::

> A pesquisa binária **só funciona com valores ordenados**. Com cartas baralhadas, depois de olhares para o meio não sabes em que metade continuar a procurar.

::: angeberwissen
Penso num número de 1 a 100. Podes adivinhar, e eu só digo “maior” ou “menor”. Com a pesquisa binária precisas no máximo de **7** tentativas. Para um número até um milhão são no máximo 20, para mil milhões 30. Cada duplicação custa só mais uma tentativa. É assim que as bases de dados pesquisam milhões de registos numa fração de segundo. Eu, já agora, pesquiso de forma linear: como o prado da esquerda para a direita.
:::

## Quão rápido é?

A qualidade de um método mede-se pelo número de comparações de que precisa **no pior caso**. Na pesquisa linear, é o caso em que a carta está mesmo lá atrás ou não existe.

::: grafik ss-vergleiche.svg
Com 100 cartas, a pesquisa linear precisa de até 100 comparações, a pesquisa binária no máximo de 7.
:::

| Número de cartas | Pesquisa linear | Pesquisa binária |
|---|---|---|
| 10 | 10 | 4 |
| 100 | 100 | 7 |
| 1000 | 1000 | 10 |
| 1 000 000 | 1 000 000 | 20 |

A pesquisa linear cresce ao mesmo ritmo que o número de cartas. Na pesquisa binária, o dobro das cartas acrescenta só **uma** comparação.

## Ordenar com bubble sort

Para a pesquisa binária, os valores têm de estar ordenados. Uma das formas mais simples de ordenar é o **bubble sort**. Percorres a fila da esquerda para a direita e comparas sempre **dois vizinhos**. Se a carta maior estiver à esquerda, trocas as duas.

::: grafik ss-bubblesort.svg
Depois de uma ronda, a carta maior está na ponta da direita.
:::

Depois da primeira ronda, a carta maior está na ponta da direita, como uma bolha de ar que sobe. Daí vem o nome (*bubble* quer dizer bolha). Depois repetes a ronda para as cartas que restam. Com 5 cartas precisas de 4 rondas.

O estrutograma tem dois ciclos for, um dentro do outro. O exterior conta as rondas, o interior compara os vizinhos `cartas[i]` e `cartas[i + 1]`. Já sabes como trocar: precisas de uma **variável auxiliar**.

::: diagramm ss-bubblesort.visustruct
O ciclo interior fica mais curto em cada ronda, porque as cartas maiores à direita já estão no sítio certo. Percorre-o na simulação com Passo e observa o array em Variáveis.
:::

O bubble sort é fácil de perceber, mas lento. Com n cartas precisa de até n · (n − 1) / 2 comparações: com 10 cartas 45, com 100 cartas já 4950 e com 1000 cartas quase meio milhão. Mais tarde talvez conheças métodos mais rápidos, como o quicksort.

## Exercício: Ordenar por ordem decrescente

::: übung ss-absteigend
titel: Ordenar por ordem decrescente
auftrag: O diagrama inicial lê 5 cartas e ordena-as com bubble sort por ordem **crescente**, ou seja, da mais pequena para a maior. Altera-o de modo que as cartas sejam mostradas por ordem **decrescente**, a maior primeiro.
start: ss-absteigend-start.visustruct
test: 3, 1, 4, 1, 5 -> 5 | 4 | 3 | 1 | 1
test: 10, 20, 30, 40, 50 -> 50 | 40 | 30 | 20 | 10
test: 2, 9, 2, 7, 6 -> 9 | 7 | 6 | 2 | 2
braucht: forSchleife, verzweigung
tipp: Olha para a condição na decisão. É ela que decide quando dois vizinhos são trocados.
tipp: Só precisas de alterar um único caractere. Quando devem ser trocados dois vizinhos, se a carta maior deve ir para a esquerda?
lösung: ss-absteigend-loesung.visustruct
:::

## Lista de verificação

::: checkliste
- Sei explicar como a pesquisa linear percorre um array. → Procurar uma carta
- Sei construir uma pesquisa linear como estrutograma. → Exercício: Encontrar uma carta
- Sei porque é que a pesquisa binária só funciona com valores ordenados. → Pesquisa binária: ordenado é mais rápido
- Sei explicar porque é que a pesquisa binária é muito mais rápida com muitos valores. → Quão rápido é?
- Sei mostrar uma ronda de bubble sort com cartas de jogar. → Ordenar com bubble sort
:::

## Teste de conhecimentos

::: quiz
? De que precisa a pesquisa binária?
- [ ] O array tem de ter exatamente 100 posições.
- [x] Os valores têm de estar ordenados.
- [ ] O valor procurado tem de existir.
> Só com valores ordenados é que sabes, depois de olhares para o meio, em que metade continuar a procurar.

? Um array ordenado tem 1000 valores. De quantas comparações precisa a pesquisa binária no máximo?
- [ ] 500
- [ ] 100
- [x] 10
> 1000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1: depois de cerca de 10 divisões a meio, resta um valor.

? O que compara o bubble sort em cada passo?
- [ ] A primeira e a última carta
- [x] Duas cartas vizinhas
- [ ] Cada carta com a do meio
> Se a carta maior estiver à esquerda, os vizinhos são trocados.

? Onde está a carta maior depois da primeira ronda do bubble sort?
- [ ] Na ponta da esquerda
- [ ] No meio
- [x] Na ponta da direita
> Vai sendo trocada em cada comparação e sobe para a direita como uma bolha.

? O que quer dizer `posicao = -1` na pesquisa linear?
- [x] A carta (ainda) não foi encontrada.
- [ ] A carta está mesmo lá atrás.
- [ ] O array está vazio.

? Associa cada método à descrição certa.
= Pesquisa linear -> olhar para uma carta a seguir à outra
= Pesquisa binária -> olhar para o meio e pôr de lado uma metade
= Bubble sort -> comparar vizinhos e trocá-los
:::
