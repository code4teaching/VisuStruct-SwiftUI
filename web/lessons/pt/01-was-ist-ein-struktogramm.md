---
titel: O que é um estrutograma?
bereich: Primeiros passos
kurz: Mostrar e ler algoritmos como uma série de passos claros.
---

## Competências que vou adquirir agora

::: kompetenzen
- explicar o que é um algoritmo
- ler um estrutograma
- reconhecer os três blocos básicos: sequência, decisão e ciclo
- ler um fluxograma (em inglês *flowchart*) e construir um sozinho
- explicar porque é que os saltos num fluxograma levam a erros
- ler um algoritmo simples em pseudocódigo
:::

## Um algoritmo é uma instrução exata

Um **algoritmo** descreve passo a passo como resolver uma tarefa. Cada passo tem de ser tão claro que qualquer um o consiga executar sem perguntar, tanto uma pessoa como um computador.

Conheces algoritmos do dia a dia: uma receita, o caminho para um sítio ou as instruções para montar um roupeiro.

::: diagramm l1-tee.visustruct
Fazer chá como estrutograma: cada bloco é um passo.
:::

::: angeberwissen
Méééé, quem escreveu o primeiro programa? Uma mulher, já em 1843, muito antes do primeiro computador! **Ada Lovelace** descreveu passo a passo como a *Analytical Engine* (Máquina Analítica) de Charles Babbage devia calcular os chamados números de Bernoulli. Era um verdadeiro algoritmo para uma máquina. As instruções deviam ficar guardadas em cartões perfurados (mais sobre isto na lição 3). Mas a máquina nunca chegou a ser construída.

A Ada teve ainda outra ideia genial: uma máquina destas consegue fazer mais do que contas. Também podia trabalhar com letras, símbolos ou até música. É exatamente isso que os computadores fazem hoje. Em sua honra, há uma linguagem de programação chamada **Ada**.
:::

::: bild ada-lovelace.jpg
Ada Lovelace (1815–1852), matemática (imagem: aguarela de Alfred Edward Chalon, por volta de 1840, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ada_Lovelace_portrait.jpg), domínio público).
:::

## Como se lê um estrutograma

Um estrutograma lê-se **de cima para baixo**. Cada bloco é um passo. Só quando um passo termina é que começa o seguinte.

Esta forma de desenhar foi inventada por **Isaac Nassi e Ben Shneiderman** (1973). Por isso também se chama diagrama de Nassi-Shneiderman. Na Alemanha está normalizado como DIN 66261.

::: bild ike-nassi.jpg ben-shneiderman.jpg
À esquerda: Isaac “Ike” Nassi (foto: [Ed Schipul](https://commons.wikimedia.org/wiki/File:Me_with_Ike_Nassi!!!!!_%286893328729%29.jpg), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), recortada), à direita: Ben Shneiderman (foto: [Robert Kosara](https://commons.wikimedia.org/wiki/File:Ben_Shneiderman_at_UNCC_%283x4_cropped%29.jpg), CC0).
:::

> Um estrutograma tem sempre exatamente um início (em cima) e um fim (em baixo). Não há setas nem saltos para todo o lado. Programas que saltam para todo o lado chamam-se **código esparguete**, porque o seu fluxo se enrola como massa no prato. Mais sobre isto no passo 10.

::: angeberwissen
Méééé, ouve bem! Em 1972, Nassi e Shneiderman ainda eram doutorandos na Universidade de Stony Brook, perto de Nova Iorque. Shneiderman tinha uns 25 anos e Nassi uns 23. Ou seja, dois estudantes que escreveram história da informática nas horas vagas.
:::

## Bloco básico 1: a sequência

Qualquer algoritmo pode ser construído com apenas **três blocos básicos**: **sequência**, [**decisão**]{.blau} e [**ciclo**]{.rosa}. As cores ajudam-te a associá-los: as [instruções]{.gelb} são amarelas, as decisões azuis, os ciclos cor-de-rosa. A sequência não tem cor própria, é simplesmente a fila de instruções umas por baixo das outras. Vês as mesmas cores no editor e mais tarde no código. Podes desligá-las nas definições em “Blocos coloridos”. Neste passo e nos dois seguintes vais conhecê-los um a um.

A **sequência** é o bloco mais simples: várias instruções são executadas **uma a seguir à outra**, cada uma exatamente uma vez.

É assim que se parece:

- Cada instrução é um **retângulo simples**.
- Os retângulos ficam **uns por cima dos outros**, sem espaço entre eles.
- São executados de cima para baixo, uma instrução depois da outra.

::: diagramm l1-sequenz.visustruct
Quatro instruções em sequência. Primeiro levantas-te, depois lavas os dentes, e assim por diante.
:::

> O exemplo do chá lá em cima também é uma sequência.

::: angeberwissen
15 minutos! Foi o tempo de que Shneiderman precisou para o primeiro esboço com sequência, decisão e ciclo. Eu preciso de mais tempo do que isso para escolher entre feno e trevo.
:::

## Bloco básico 2: a decisão

Muitas vezes o passo seguinte depende de uma **condição**. Uma condição é uma pergunta a que só se pode responder com **sim ou não**, por exemplo *Está a chover?* No VisuStruct, sim é **true** e não é **false**.

Para decisões destas existe a **decisão**. É assim que se parece:

- Em cima, a condição fica dentro de um **triângulo**.
- Por baixo, o bloco divide-se em **duas colunas**: à esquerda o ramo para **true**, à direita o ramo para **false**.
- Só é executado **um** dos dois ramos. Depois, os dois ramos continuam juntos por baixo da decisão.

::: diagramm l1-verzweigung.visustruct
Se estiver a chover, é executado o ramo da esquerda, senão o da direita. Depois, os dois casos continuam com “Sair”.
:::

> Se num dos casos não deve acontecer nada, esse ramo fica vazio. O sinal **ø** indica isso.

::: angeberwissen
Alerta de ortografia! Escreve-se Shneiderman, sem c. Quem escrever “Schneiderman” leva um empurrãozinho dos meus chifres. Ele próprio conta que as pessoas estão sempre a meter um c no nome dele.
:::

## Bloco básico 3: o ciclo

Se uma coisa deve acontecer **várias vezes**, não a escreves várias vezes. Em vez disso usas um **ciclo**, também chamado repetição.

É assim que se parece:

- Em cima está a condição, por exemplo *Prato não vazio*.
- Os passos que se repetem ficam **recuados** por baixo dela. Em cima e à esquerda, o bloco forma um **L invertido** à volta deles.
- Antes de cada iteração, a condição é verificada. Enquanto for **true**, os passos dentro do L invertido são executados mais uma vez. Se for **false**, o programa continua por baixo do ciclo.

::: diagramm l1-wiederholung.visustruct
Enquanto o prato não estiver vazio, dás uma garfada. Depois, o prato é levantado.
:::

> Há mais tipos de ciclos. Vais conhecê-los nas próximas lições.

## Os três juntos

Os blocos básicos tornam-se realmente úteis quando os combinas. Este diagrama contém os três: uma sequência de cima para baixo, uma [decisão]{.blau} e um [ciclo]{.rosa}. As caixas amarelas são [instruções]{.gelb} simples. As instruções dentro de uma decisão ou de um ciclo também são amarelas. Em rigor, o diagrama todo é uma sequência, porque a decisão e o ciclo também estão na fila de cima para baixo.

::: diagramm l1-grundbausteine.visustruct
Reconheces a decisão pelo triângulo e o ciclo pelo L invertido. Tudo junto forma uma sequência.
:::

Os blocos também podem ser **encaixados** uns dentro dos outros: um ciclo ou um ramo pode voltar a conter sequências, decisões e ciclos.

::: angeberwissen
Consolo para quem correu mal um teste: a famosa revista *Communications of the ACM* rejeitou o artigo sobre estrutogramas. Segundo Nassi, o revisor até disse que deviam juntar todas as cópias e queimá-las. Ai! O artigo saiu em 1973 numa revista mais pequena e hoje é citado milhares de vezes. Ha!
:::

## Outras formas de desenhar: o fluxograma

Há mais duas formas de representar um algoritmo: o **fluxograma** e o **pseudocódigo**. Vais conhecer as duas nas aulas. Em inglês, o fluxograma chama-se **flowchart**. Esta palavra aparece muitas vezes, por exemplo em programas e na internet.

Aqui vês outra vez o nosso estrutograma para beber chá de “Os três juntos”. A seguir vamos ver o fluxograma, com o mesmo exemplo.

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

## Primeiro a estrutura, depois o código

Quando programas, acontecem duas coisas ao mesmo tempo: tens de pensar nos passos e prestar atenção à forma como a linguagem de programação se escreve. Um estrutograma permite-te separar as duas coisas.

1. Primeiro pensas na **lógica**: que passos, que condições, que repetições?
2. Depois traduzes a estrutura pronta para **Java, Python ou JavaScript**. O VisuStruct até consegue gerar o código por ti.

Com a **simulação** também podes executar o teu estrutograma passo a passo e verificar se ele faz mesmo o que deve.

## Jogo: Que bloco básico?

::: spiel frage
titel: Jogo: Que bloco básico?
intro: O Ludwig descreve coisas do seu dia a dia. Que bloco básico se esconde em cada uma? Oito rondas.
antworten: sequência | decisão | ciclo

runde:
frage: "Pasta na escova, lavar os dentes, bochechar."
richtig: sequência
> Três passos, cada um exatamente uma vez e sempre por esta ordem.

runde:
frage: "Se chover, levo o guarda-chuva, senão os óculos de sol."
richtig: decisão
> Uma condição decide qual dos dois caminhos é seguido.

runde:
frage: "Mexer até a massa ficar lisa."
richtig: ciclo
> Mexe-se repetidamente enquanto a massa ainda não estiver lisa.

runde:
frage: "Correr dez voltas ao campo de desporto."
richtig: ciclo
> A mesma volta é corrida dez vezes.

runde:
frage: "Calçar os sapatos, vestir o casaco, abrir a porta, e lá vamos."
richtig: sequência
> Um passo a seguir ao outro, nada é saltado nem repetido.

runde:
frage: "Se o semáforo estiver verde, atravessas a rua."
richtig: decisão
> Mesmo sem "senão" é uma decisão. O ramo senão fica simplesmente vazio.

runde:
frage: "Lançar o dado até sair um seis."
richtig: ciclo
> Não se sabe antes quantas vezes. Lança-se até a condição se cumprir.

runde:
frage: "Se alguém disser 'Entra', entras. Senão, esperas à porta."
richtig: decisão
> A resposta decide entre dois caminhos: entrar ou esperar.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo explicar o que é um algoritmo. → Um algoritmo é uma instrução exata
- Consigo ler um estrutograma de cima para baixo. → Como se lê um estrutograma
- Consigo nomear os três blocos básicos: sequência, decisão e ciclo. → Bloco básico 1: a sequência
- Consigo reconhecer cada bloco básico num estrutograma pela sua forma. → Os três juntos
- Consigo nomear os símbolos de um fluxograma e ler um fluxograma simples. → Outras formas de desenhar: o fluxograma
- Consigo construir sozinho um algoritmo simples como fluxograma. → Exercício: Fazer um bolo como fluxograma
- Consigo explicar porque é que os saltos com GOTO levam a erros e a código esparguete. → Desvantagens do fluxograma: saltos
- Consigo ler um algoritmo simples em pseudocódigo. → Pseudocódigo e comparação
:::

## Teste de conhecimentos

::: quiz
? Em que direção se lê um estrutograma?
→ Como se lê um estrutograma
- [ ] Da esquerda para a direita
- [x] De cima para baixo
- [ ] De baixo para cima
> Cada bloco é um passo, e os passos seguem-se de cima para baixo.

? Qual destes NÃO é um dos três blocos básicos?
→ Bloco básico 1: a sequência
- [ ] Sequência
- [ ] Decisão
- [x] Salto
- [ ] Ciclo
> Num estrutograma não há saltos. Sequência, decisão e ciclo chegam para qualquer algoritmo.

? Como reconheces uma decisão num estrutograma?
→ Os três juntos
- [ ] Por um L invertido
- [x] Por um triângulo com a condição e duas colunas por baixo
- [ ] Por vários retângulos uns por cima dos outros
> O L invertido pertence ao ciclo, e retângulos uns por cima dos outros são uma sequência.

? Quando é que o interior de um ciclo é executado mais uma vez?
→ Os três juntos
- [x] Enquanto a condição for verdadeira
- [ ] Só se a condição for falsa
- [ ] Sempre exatamente duas vezes
> A condição é verificada antes de cada iteração. Se for falsa, o programa continua por baixo do ciclo.

? O que é um algoritmo?
→ Um algoritmo é uma instrução exata
- [x] Instruções claras, passo a passo, para resolver uma tarefa
- [ ] Um determinado programa em Java
- [ ] Uma imagem que explica um programa
> Um algoritmo não depende de nenhuma linguagem de programação. Um estrutograma é uma forma de o escrever.

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
