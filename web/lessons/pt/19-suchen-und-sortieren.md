---
titel: Pesquisar e ordenar
bereich: Fundamentos
kurz: Perceber com cartas de jogar como funcionam a pesquisa linear, a pesquisa binária e o bubble sort, e porque é que alguns métodos são muito mais rápidos.
---

## Competências que vou adquirir agora

::: kompetenzen
- explicar como a pesquisa linear percorre um array
- construir uma pesquisa linear como estrutograma
- explicar porque é que a pesquisa binária só funciona com valores ordenados
- explicar porque é que a pesquisa binária é muito mais rápida com muitos valores
- mostrar uma ronda de bubble sort com cartas de jogar
- percorrer um array em Java e contar resultados
:::

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

## Agora em Java

A pesquisa linear do exercício fica assim em Java:

```java editor
int[] cartas = {8, 4, 11, 4, 6};
int procurada = 4;
int posicao = -1;
int i = 0;
while (posicao == -1 && i < cartas.length) {
    if (cartas[i] == procurada) {
        posicao = i;
    }
    i = i + 1;
}
System.out.println("Posição: " + posicao);
```

- `&&` significa “e”: o ciclo só corre enquanto não se encontrou nada **e** ainda há cartas.
- Se o ramo false estiver vazio, deixas simplesmente de fora `else`.
- A troca no bubble sort também precisa de uma variável auxiliar em Java: `int aux = cartas[i];`

::: übung l19-java-zaehlen
titel: Contar cartas
code: java
auftrag: As cartas {8, 4, 11, 4, 6} estão num array. Escreve em Java um programa que pergunta por uma carta e conta quantas vezes aparece. Mostra **Quantidade:** e o número.
  Com 4 aparece **Quantidade: 2**.
test: 4 -> Quantidade: 2
test: 8 -> Quantidade: 1
test: 9 -> Quantidade: 0
braucht: forSchleife, verzweigung
tipp: Ao contrário da pesquisa, não paras no primeiro resultado. Um ciclo for percorre todas as cartas.
tipp: `for (int i = 0; i < cartas.length; i++)` e lá dentro `if (cartas[i] == procurada) { quantidade = quantidade + 1; }`. `quantidade` começa em 0 antes do ciclo.
lösung: l19-java-zaehlen-loesung.visustruct
:::

## Preenche os espaços: bubble sort

::: lückentext
titel: Ordenar cartas
auftrag: O programa ordena as cartas por ordem crescente com o bubble sort. Preenche as palavras e os sinais que faltam.
```java
int[] cartas = {5, 2, 8, 1};
for (int ronda = 0; ronda < cartas.[[length]] - 1; ronda++) {
    for (int i = 0; i < cartas.length - 1; i++) {
        if (cartas[i] [[>]] cartas[i + 1]) {
            [[int]] aux = cartas[i];
            cartas[i] = cartas[i + 1];
            cartas[i + 1] = [[aux]];
        }
    }
}
for (int i = 0; i < cartas.length; i++) {
    System.out.println(cartas[i]);
}
```
erklärung: Se uma carta for maior do que a vizinha da direita, as duas trocam de lugar, com uma variável auxiliar como ao trocar os copos. Depois de `length - 1` rondas está tudo ordenado: 1, 2, 5, 8.
:::

## Encontra o erro: pesquisa

::: übung l19-java-fehler
titel: Corrigir a pesquisa linear
code: java
auftrag: As cartas {8, 4, 11, 4, 6} estão num array. O programa deve mostrar a **primeira** posição da carta procurada, para o 4 é **Posição: 1**. Mas mostra **Posição: 3**.
  “Abrir no editor” mostra o código na área Código. Encontra o erro, corrige-o e carrega em Verificar.
start: l19-java-fehler-start.visustruct
test: 4 -> Posição: 1
test: 6 -> Posição: 4
test: 9 -> Posição: -1
test: 8 -> Posição: 0
braucht: whileSchleife, verzweigung
tipp: O ciclo vai sempre até à última carta. O que acontece quando o 4 aparece uma segunda vez?
tipp: O ciclo deve parar assim que encontrar algo: `while (posicao == -1 && i < cartas.length)`.
lösung: l19-java-fehler-loesung.visustruct
:::

## Porque é que não corre?

::: übung l19-java-laeuft-nicht
titel: Procurar uma carta
code: java
auftrag: As cartas {8, 4, 11, 4, 6} estão num array. O programa procura o 11 e deve mostrar **Posição: 2**. Mas não corre.
  “Abrir no editor” mostra o código na área Código. Clica em “Executar” e lê a mensagem de erro. Corrige o erro e carrega em Verificar.
start: l19-java-laeuft-nicht-start.visustruct
test: - -> Posição: 2
braucht: forSchleife, verzweigung
tipp: Compara os nomes na condição com os nomes criados em cima.
tipp: A carta procurada está em `procurada` com p minúsculo: `if (cartas[i] == procurada) {`
lösung: l19-java-laeuft-nicht-loesung.visustruct
:::

## Jogo: Profissional da pesquisa

::: spiel frage
titel: Jogo: Profissional da pesquisa
intro: O Ludwig procura e ordena cartas. Quão rápido é, e o que sai? Sete rondas.

runde:
    int[] cartas = {8, 4, 11, 4, 6};
    int procurada = 4;
    int posicao = -1;
    int i = 0;
    while (posicao == -1 && i < cartas.length) {
        if (cartas[i] == procurada) {
            posicao = i;
        }
        i = i + 1;
    }
    System.out.println("Posição: " + posicao);
frage: O que aparece?
- [x] Posição: 1
- Posição: 3
- Posição: 2
> A pesquisa para no primeiro 4. Está na posição 1, contando a partir de 0.

runde:
    int[] cartas = {8, 4, 11, 4, 6};
    int procurada = 7;
frage: Com a mesma pesquisa linear: o que fica em posicao?
- 0
- 5
- [x] -1
> O 7 não está lá. posicao fica em -1, que quer dizer "não encontrado".

runde:
frage: Com que cartas funciona a pesquisa binária?
- com todas
- [x] só com cartas ordenadas
- só com menos de 100
> Só com as cartas ordenadas é que, depois de olhares para o meio, sabes em que metade continuar a procurar.

runde:
frage: De quantas comparações precisa no máximo a pesquisa binária com 100 cartas?
- 50
- [x] 7
- 100
> Cada comparação corta o monte a meio. Cortar 7 vezes chega para até 128 cartas, portanto também para 100.

runde:
frage: Em vez de 1000 cartas agora são 2000. Quantas comparações a mais precisa no máximo a pesquisa binária?
- [x] uma
- o dobro
- 1000
> A primeira comparação reduz 2000 a 1000. Depois continua como antes.

runde:
    int[] cartas = {5, 3, 8, 1};
frage: Uma passagem do bubble sort compara sempre dois vizinhos, da esquerda para a direita. Como ficam as cartas depois?
- 1, 3, 5, 8
- [x] 3, 5, 1, 8
- 3, 5, 8, 1
> 5 e 3 trocam, 5 e 8 ficam, 8 e 1 trocam. A carta maior fica na ponta da direita.

runde:
frage: O bubble sort troca `cartas[i]` e `cartas[i + 1]`. De que precisa para isso?
- [x] de uma variável auxiliar
- de um segundo array
- de uma pesquisa binária
> Tal como ao trocar duas variáveis: `int aux = cartas[i];`, senão perde-se um valor.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo explicar como a pesquisa linear percorre um array. → Procurar uma carta
- Consigo construir uma pesquisa linear como estrutograma. → Exercício: Encontrar uma carta
- Consigo explicar porque é que a pesquisa binária só funciona com valores ordenados. → Pesquisa binária: ordenado é mais rápido
- Consigo explicar porque é que a pesquisa binária é muito mais rápida com muitos valores. → Quão rápido é?
- Consigo mostrar uma ronda de bubble sort com cartas de jogar. → Ordenar com bubble sort
- Consigo percorrer um array em Java e contar resultados. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? De que precisa a pesquisa binária?
→ Pesquisa binária: ordenado é mais rápido
- [ ] O array tem de ter exatamente 100 posições.
- [x] Os valores têm de estar ordenados.
- [ ] O valor procurado tem de existir.
> Só com valores ordenados é que sabes, depois de olhares para o meio, em que metade continuar a procurar.

? Um array ordenado tem 1000 valores. De quantas comparações precisa a pesquisa binária no máximo?
→ Quão rápido é?
- [ ] 500
- [ ] 100
- [x] 10
> 1000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1: depois de cerca de 10 divisões a meio, resta um valor.

? O que compara o bubble sort em cada passo?
→ Ordenar com bubble sort
- [ ] A primeira e a última carta
- [x] Duas cartas vizinhas
- [ ] Cada carta com a do meio
> Se a carta maior estiver à esquerda, os vizinhos são trocados.

? Onde está a carta maior depois da primeira ronda do bubble sort?
→ Ordenar com bubble sort
- [ ] Na ponta da esquerda
- [ ] No meio
- [x] Na ponta da direita
> Vai sendo trocada em cada comparação e sobe para a direita como uma bolha.

? O que quer dizer `posicao = -1` na pesquisa linear?
→ Procurar uma carta
- [x] A carta (ainda) não foi encontrada.
- [ ] A carta está mesmo lá atrás.
- [ ] O array está vazio.

? Associa cada método à descrição certa.
→ Procurar uma carta
= Pesquisa linear -> olhar para uma carta a seguir à outra
= Pesquisa binária -> olhar para o meio e pôr de lado uma metade
= Bubble sort -> comparar vizinhos e trocá-los

? Porque usas um ciclo for para contar e não uma pesquisa que para no primeiro resultado?
→ Agora em Java
- [ ] Um ciclo for é sempre mais rápido.
- [x] Tens de ver todas as cartas, senão faltam resultados mais à frente.
- [ ] Um ciclo while não consegue percorrer arrays.
> A carta pode aparecer várias vezes. Por isso percorres todas as cartas até ao fim.
:::
