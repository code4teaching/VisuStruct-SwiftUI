---
titel: Fluxograma e pseudocódigo
bereich: Primeiros passos
kurz: Representar algoritmos como fluxograma e como pseudocódigo e compará-los com o estrutograma.
---

## Competências que vou adquirir agora

::: kompetenzen
- ler um fluxograma (em inglês *flowchart*) e construir um sozinho
- explicar porque é que os saltos num fluxograma levam a erros
- ler um algoritmo simples em pseudocódigo
:::

## Outras formas de desenhar: o fluxograma

Há mais duas formas de representar um algoritmo: o **fluxograma** e o **pseudocódigo**. Vais conhecer as duas nas aulas. Em inglês, o fluxograma chama-se **flowchart**. Esta palavra aparece muitas vezes, por exemplo em programas e na internet.

Aqui vês outra vez o nosso estrutograma para beber chá da última lição. A seguir vamos ver o fluxograma, com o mesmo exemplo.

::: diagramm l1-grundbausteine.visustruct
O exemplo do chá como estrutograma: primeiro a chávena, depois a decisão para o açúcar e depois o ciclo.
:::

### O mesmo algoritmo como fluxograma

::: grafik l01-pap.svg
O exemplo do chá como fluxograma. A seta de “Esperar 1 minuto” para cima forma o ciclo.
:::

### Os símbolos

Um fluxograma é feito de poucos símbolos ligados por **setas**. Está normalizado como DIN 66001 (ISO 5807).

- **Oval:** início ou fim. Cada fluxograma tem exatamente um início e um fim.
- **Retângulo:** uma instrução, por exemplo *Pôr uma chávena na mesa*.
- **Losango:** uma decisão. No losango está uma pergunta, e dele saem duas setas: **sim** e **não**.
- **Paralelogramo:** uma entrada ou saída. No exemplo do chá não aparece.
- **Seta:** mostra qual é o passo seguinte.

Um ciclo não tem símbolo próprio no fluxograma. Reconheces um ciclo por uma seta que volta **para cima**.

### As vantagens

- **Muito fácil de ler**, mesmo para quem nunca viu um fluxograma. Basta seguir as setas com o dedo.
- Os fluxogramas não se usam só na programação, mas em todo o lado onde se explica um processo: em manuais de instruções, na procura de avarias (“A lâmpada acende? Não: a ficha está ligada?”) ou nas empresas para os processos de trabalho.

## Exercício: Fazer um bolo como fluxograma

Agora és tu que constróis um fluxograma. O Ludwig faz um bolo assim:

Põe os ingredientes na tigela e mexe a massa. Se a massa ainda não estiver lisa, continua a mexer. Quando está lisa, deita a massa na forma e coze o bolo durante 30 minutos. Depois testa com um palito: se ainda tiver massa agarrada, coze mais 5 minutos e testa outra vez. Quando o palito sai limpo, tira o bolo e diz: “O bolo está pronto!”

::: pap
titel: Exercício: Fazer um bolo como fluxograma
auftrag: Os lugares no fluxograma estão vazios. Põe cada elemento no seu lugar. A forma do lugar ajuda-te.
start: Início
anweisung: Pôr os ingredientes na tigela
anweisung: Mexer a massa
frage: Massa lisa? | nein -> Mexer a massa
anweisung: Deitar a massa na forma
anweisung: Cozer 30 minutos
frage: Palito limpo? | nein: Cozer mais 5 minutos
anweisung: Tirar o bolo do forno
ausgabe: “O bolo está pronto!”
ende: Fim
erklärung: Dois ciclos, duas setas para cima: ao mexer, a seta volta a “Mexer a massa”; ao cozer, vai de “Cozer mais 5 minutos” de volta à pergunta. A saída fica no paralelogramo.
legende: ja
:::

**Desenhar os teus próprios fluxogramas:** Com o **VisuFlow** desenhas o teu fluxograma com toda a facilidade. Os símbolos estão prontos numa barra: tocar num acrescenta o símbolo seguinte e liga-o logo com uma seta. Para começar, podes carregar o exemplo do chá. Guardas o teu fluxograma como ficheiro e exportas como imagem ou PDF, por exemplo para o teu caderno ou uma apresentação. [Abrir o VisuFlow](https://visustruct.visucode.de/app/?visuflow)

## Desvantagens do fluxograma: saltos

Uma seta num fluxograma pode ir de qualquer símbolo para qualquer outro. Parece prático, mas é perigoso.

Antigamente, os programas escreviam-se exatamente assim. Cada linha tinha um **número**, e o comando **GOTO**, em português “ir para”, saltava para um número de linha. Cada IR PARA é uma seta do fluxograma. O nosso exemplo do chá ficava assim:

```
10 Pôr uma chávena na mesa
20 SE não quer açúcar, IR PARA 40
30 Juntar açúcar
40 SE chá não demasiado quente, IR PARA 70
50 Esperar 1 minuto
60 IR PARA 40
70 Beber o chá
```

### Mais uma linha, e os saltos ficam errados

Agora melhoras o algoritmo: depois do açúcar, o saquinho de chá deve sair. Acrescentas a nova linha 40, e todas as linhas abaixo avançam um número. Mas os saltos continuam a apontar para os números antigos:

```
10 Pôr uma chávena na mesa
20 SE não quer açúcar, IR PARA 40
30 Juntar açúcar
40 Tirar o saquinho de chá
50 SE chá não demasiado quente, IR PARA 70
60 Esperar 1 minuto
70 IR PARA 40
80 Beber o chá
```

Experimenta: a linha 70 já não te manda para a verificação da linha 50, mas para o saquinho. E quando o chá já está frio o suficiente, a linha 50 salta para a linha 70 em vez de *Beber o chá*. Ou seja, tiras o saquinho vezes sem conta e nunca bebes. A cada alteração tens de verificar todos os IR PARA. Num programa grande, com centenas de saltos, é fácil algo correr mal.

### Para todo o lado: código esparguete

Com setas também se pode saltar do meio de um ciclo para fora, ou de fora para o meio de um ciclo. Estes saltos tornam o fluxograma confuso muito depressa. Com muitos saltos, as setas cruzam-se até o fluxograma parecer um prato de esparguete. Por isso chama-se **código esparguete**. Mal se consegue seguir o fluxo, e os erros escondem-se bem.

Um estrutograma não tem setas. Se acrescentares um bloco, tudo o que está abaixo desce com ele, e nenhum salto pode apontar para o sítio errado. Para sair de um ciclo mais cedo existe lá um bloco próprio e arrumado, a interrupção. Vais conhecê-la na lição 18.

::: angeberwissen
Em 1968, o informático Edsger Dijkstra escreveu uma carta famosa: “Go To Statement Considered Harmful”, ou seja, “o GOTO é considerado prejudicial”. Desde então, os programas são construídos só com sequência, decisão e ciclo. Em Java, `goto` ainda hoje é uma palavra reservada, mas não a podes usar. Mééé, prefiro comer esparguete a programá-lo.
:::

## Pseudocódigo e comparação

**Pseudocódigo** é texto que parece um programa, mas está escrito em linguagem corrente. Palavras fixas como SE e ENQUANTO mostram os blocos, e a **indentação** mostra o que pertence a eles. Aqui também não há saltos. Este é o nosso exemplo do chá:

```
Pôr uma chávena na mesa
SE quer açúcar ENTÃO
    Juntar açúcar
FIM SE
ENQUANTO chá ainda demasiado quente
    Esperar 1 minuto
FIM ENQUANTO
Beber o chá
```

O pseudocódigo **não tem uma forma fixa**. Há quem escreva CASO em vez de SE, quem use uma seta para a atribuição (`numero ← 5`) ou quem não escreva as linhas FIM. Tudo isso é permitido. O importante é que qualquer pessoa o perceba sem explicação. Por isso, o pseudocódigo não é mais uma linguagem de programação que tens de aprender.

::: angeberwissen
O pseudocódigo parece-te familiar? A linguagem de programação Python é muito parecida, e isso é de propósito: o seu criador, Guido van Rossum, queria que os programas se lessem quase como texto normal. O Python também usa a indentação para mostrar o que pertence junto. Mas atenção: o Python é uma linguagem de programação a sério, com regras fixas. Um espaço a mais e o computador reclama. O pseudocódigo é mais descontraído, tal como eu ao pequeno-almoço.
:::

### Comparação

- **Estrutograma:** blocos dentro de blocos, o ciclo é um L invertido. Vês a estrutura num relance, e saltos malucos são impossíveis.
- **Fluxograma:** símbolos com setas, o ciclo é uma seta que volta para cima. Muito fácil de imaginar, mas os fluxogramas grandes ficam depressa confusos, e são possíveis saltos para todo o lado.
- **Pseudocódigo:** texto com indentação, o ciclo fica entre ENQUANTO e FIM ENQUANTO. Rápido de escrever e já perto do código de um programa.

> Os três descrevem o mesmo algoritmo. Quando sabes ler uma das formas, aprendes as outras depressa.

::: angeberwissen
Nassi e Shneiderman estavam em guerra com as setas! O artigo deles de 1973 chamava-se “Flowchart Techniques for Structured Programming”. Com setas pode-se saltar para todo o lado até o fluxograma parecer um prato de esparguete. Num estrutograma isso é simplesmente impossível. Mééé, é assim que eu gosto: arrumado, como o meu estábulo.
:::

## Jogo: Que representação?

::: spiel frage
titel: Jogo: Que representação?
intro: O Ludwig descreve uma forma de representar um algoritmo sem dizer o nome. É o estrutograma, o fluxograma ou o pseudocódigo? Oito rondas.
antworten: estrutograma | fluxograma | pseudocódigo

runde:
frage: “Quando algo se repete, uma das minhas setas aponta de volta para cima.”
richtig: fluxograma
> No fluxograma, o ciclo não tem símbolo próprio. Uma seta volta para cima.

runde:
frage: “O meu ciclo parece um L invertido.”
richtig: estrutograma
> A caixa envolve os passos repetidos em cima e à esquerda.

runde:
frage: “Sou feito de palavras como SE e ENQUANTO, e a indentação mostra o que pertence a quê.”
richtig: pseudocódigo
> O pseudocódigo é texto em linguagem normal, organizado como um programa.

runde:
frage: “A minha decisão é um losango com as saídas sim e não.”
richtig: fluxograma
> No estrutograma, a condição fica num triângulo.

runde:
frage: “As minhas setas podem enrolar-se para todo o lado como esparguete.”
richtig: fluxograma
> Como as setas podem ir para qualquer lado, no fluxograma é possível haver código esparguete.

runde:
frage: “Não tenho uma forma fixa de escrever. Também podes escrever CASO em vez de SE.”
richtig: pseudocódigo
> O importante é que qualquer pessoa o perceba sem explicação.

runde:
frage: “A condição fica em cima num triângulo, e por baixo divido-me em duas colunas.”
richtig: estrutograma
> É assim que a decisão aparece no estrutograma: true à esquerda, false à direita.

runde:
frage: “Se inserires uma caixa, tudo o que está por baixo desce também. Nenhum salto pode falhar.”
richtig: estrutograma
> O estrutograma não tem setas nem saltos, por isso nada pode apontar para o sítio errado.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo nomear os símbolos de um fluxograma e ler um fluxograma simples. → Outras formas de desenhar: o fluxograma
- Consigo construir sozinho um algoritmo simples como fluxograma. → Exercício: Fazer um bolo como fluxograma
- Consigo explicar porque é que os saltos com GOTO levam a erros e a código esparguete. → Desvantagens do fluxograma: saltos
- Consigo ler um algoritmo simples em pseudocódigo. → Pseudocódigo e comparação
:::

## Teste de conhecimentos

::: quiz
? Como reconheces um ciclo num fluxograma?
→ Outras formas de desenhar: o fluxograma
- [ ] Por um L invertido
- [x] Por uma seta que volta para cima
- [ ] Pela palavra ENQUANTO
> O L invertido pertence ao estrutograma, e ENQUANTO ao pseudocódigo.

? Associa cada símbolo do fluxograma ao seu significado.
→ Outras formas de desenhar: o fluxograma
= Oval -> Início ou fim
= Retângulo -> Instrução
= Losango -> Decisão
= Paralelogramo -> Entrada ou saída
> O losango tem duas saídas: sim e não.

? Como se diz fluxograma em inglês?
→ Outras formas de desenhar: o fluxograma
- [x] Flowchart
- [ ] Structure chart
- [ ] Pseudocode
> Structure chart é o estrutograma.

? Acrescentas uma nova linha a um programa com GOTO. O que pode acontecer?
→ Desvantagens do fluxograma: saltos
- [x] Os saltos apontam para as linhas erradas, porque os números mudaram
- [ ] Nada, os saltos ajustam-se sozinhos
- [ ] O programa fica automaticamente mais rápido
> Cada IR PARA aponta para um número de linha fixo. Se as linhas descem, o programa salta para o sítio errado.

? No pseudocódigo, o que mostra que linhas pertencem a um ciclo?
→ Pseudocódigo e comparação
- [ ] A cor
- [x] A indentação e o FIM ENQUANTO
- [ ] Uma seta
> Tudo o que está entre ENQUANTO e FIM ENQUANTO está recuado e é repetido.
:::
