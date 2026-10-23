---
titel: O que é um estrutograma?
bereich: Primeiros passos
kurz: Mostrar e ler algoritmos como uma série de passos claros.
---

## Um algoritmo é uma instrução exata

Um **algoritmo** descreve passo a passo como resolver uma tarefa. Cada passo tem de ser tão claro que qualquer um o consiga executar sem perguntar, tanto uma pessoa como um computador.

Conheces algoritmos do dia a dia: uma receita, o caminho para um sítio ou as instruções para montar um roupeiro.

::: diagramm l1-tee.visustruct
Fazer chá como estrutograma: cada bloco é um passo.
:::

## Como se lê um estrutograma

Um estrutograma lê-se **de cima para baixo**. Cada bloco é um passo. Só quando um passo termina é que começa o seguinte.

Esta forma de desenhar foi inventada por **Isaac Nassi e Ben Shneiderman** (1973). Por isso também se chama diagrama de Nassi-Shneiderman. Na Alemanha está normalizado como DIN 66261.

::: bild ike-nassi.jpg ben-shneiderman.jpg
À esquerda: Isaac “Ike” Nassi (foto: [Ed Schipul](https://commons.wikimedia.org/wiki/File:Me_with_Ike_Nassi!!!!!_%286893328729%29.jpg), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), recortada), à direita: Ben Shneiderman (foto: [Robert Kosara](https://commons.wikimedia.org/wiki/File:Ben_Shneiderman_at_UNCC_%283x4_cropped%29.jpg), CC0).
:::

> Um estrutograma tem sempre exatamente um início (em cima) e um fim (em baixo). Não há setas nem saltos para todo o lado.

::: angeberwissen
Méééé, ouve bem! Em 1972, Nassi e Shneiderman ainda eram doutorandos na Universidade de Stony Brook, perto de Nova Iorque. Shneiderman tinha uns 25 anos e Nassi uns 23. Ou seja, dois estudantes que escreveram história da informática nas horas vagas.
:::

## Bloco básico 1: a sequência

Qualquer algoritmo pode ser construído com apenas **três blocos básicos**: **sequência**, **decisão** e **ciclo**. Neste passo e nos dois seguintes vais conhecê-los um a um.

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
- Os passos que se repetem ficam **recuados** por baixo dela. À esquerda, o bloco forma um **parêntese** à volta deles.
- Antes de cada iteração, a condição é verificada. Enquanto for **true**, os passos dentro do parêntese são executados mais uma vez. Se for **false**, o programa continua por baixo do ciclo.

::: diagramm l1-wiederholung.visustruct
Enquanto o prato não estiver vazio, dás uma garfada. Depois, o prato é levantado.
:::

> Há mais tipos de ciclos. Vais conhecê-los nas próximas lições.

## Os três juntos

Os blocos básicos tornam-se realmente úteis quando os combinas. Este diagrama contém os três: uma sequência de cima para baixo, uma decisão e um ciclo.

::: diagramm l1-grundbausteine.visustruct
Reconheces a decisão pelo triângulo e o ciclo pelo parêntese à esquerda. Tudo junto forma uma sequência.
:::

Os blocos também podem ser **encaixados** uns dentro dos outros: um ciclo ou um ramo pode voltar a conter sequências, decisões e ciclos.

::: angeberwissen
Consolo para quem correu mal um teste: a famosa revista *Communications of the ACM* rejeitou o artigo sobre estrutogramas. Segundo Nassi, o revisor até disse que deviam juntar todas as cópias e queimá-las. Ai! O artigo saiu em 1973 numa revista mais pequena e hoje é citado milhares de vezes. Ha! [Mais curiosidades](https://visustruct.org/pt/angeberwissen.html)
:::

## Outras formas de desenhar: fluxograma e pseudocódigo

Um estrutograma não é a única forma de escrever um algoritmo. Nas aulas vais conhecer mais duas. Aqui vês o mesmo exemplo do chá nas três formas.

### Fluxograma

Um **fluxograma** é feito de símbolos ligados por **setas**. Está normalizado como DIN 66001 (ISO 5807). Um losango é uma decisão com as saídas sim e não. Reconheces um ciclo por uma seta que volta **para cima**.

::: grafik l01-pap.svg
O exemplo do chá como fluxograma. A seta de “Esperar 1 minuto” para cima forma o ciclo.
:::

### Pseudocódigo

**Pseudocódigo** é texto que parece um programa, mas está escrito em linguagem corrente. Palavras fixas como SE e ENQUANTO mostram os blocos, e a **indentação** mostra o que pertence a eles.

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

### Comparação

- **Estrutograma:** blocos dentro de blocos, o ciclo é um parêntese à esquerda. Vês a estrutura num relance, e saltos malucos são impossíveis.
- **Fluxograma:** símbolos com setas, o ciclo é uma seta que volta para cima. Muito fácil de imaginar, mas os fluxogramas grandes ficam depressa confusos.
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

::: angeberwissen
Programas que saltam para todo o lado chamam-se **código esparguete**: se tentares seguir um fio, ficas todo enrolado, como num prato de esparguete. Antigamente, o culpado era o comando GOTO, que quer dizer “salta para a linha …”. Por isso, em 1968, o informático Edsger Dijkstra escreveu uma carta famosa: “Go To Statement Considered Harmful”. Desde então, os programas são construídos só com sequência, decisão e ciclo. Em Java, `goto` ainda hoje é uma palavra reservada, mas não a podes usar. Mééé, prefiro comer esparguete a programá-lo.
:::

## Lista de verificação

::: checkliste
- Sei explicar o que é um algoritmo. → Um algoritmo é uma instrução exata
- Sei que um estrutograma se lê de cima para baixo. → Como se lê um estrutograma
- Conheço os três blocos básicos: sequência, decisão e ciclo. → Bloco básico 1: a sequência
- Reconheço cada bloco básico num estrutograma pela sua forma. → Os três juntos
- Também consigo ler um algoritmo simples como fluxograma e como pseudocódigo. → Outras formas de desenhar: fluxograma e pseudocódigo
:::

## Teste de conhecimentos

::: quiz
? Em que direção se lê um estrutograma?
- [ ] Da esquerda para a direita
- [x] De cima para baixo
- [ ] De baixo para cima
> Cada bloco é um passo, e os passos seguem-se de cima para baixo.

? Qual destes NÃO é um dos três blocos básicos?
- [ ] Sequência
- [ ] Decisão
- [x] Salto
- [ ] Ciclo
> Num estrutograma não há saltos. Sequência, decisão e ciclo chegam para qualquer algoritmo.

? Como reconheces uma decisão num estrutograma?
- [ ] Por um parêntese do lado esquerdo
- [x] Por um triângulo com a condição e duas colunas por baixo
- [ ] Por vários retângulos uns por cima dos outros
> O parêntese pertence ao ciclo, e retângulos uns por cima dos outros são uma sequência.

? Quando é que o interior de um ciclo é executado mais uma vez?
- [x] Enquanto a condição for verdadeira
- [ ] Só se a condição for falsa
- [ ] Sempre exatamente duas vezes
> A condição é verificada antes de cada iteração. Se for falsa, o programa continua por baixo do ciclo.

? O que é um algoritmo?
- [x] Instruções claras, passo a passo, para resolver uma tarefa
- [ ] Um determinado programa em Java
- [ ] Uma imagem que explica um programa
> Um algoritmo não depende de nenhuma linguagem de programação. Um estrutograma é uma forma de o escrever.

? Como reconheces um ciclo num fluxograma?
- [ ] Por um parêntese do lado esquerdo
- [x] Por uma seta que volta para cima
- [ ] Pela palavra ENQUANTO
> O parêntese pertence ao estrutograma, e ENQUANTO ao pseudocódigo.

? Associa cada símbolo do fluxograma ao seu significado.
= Oval -> Início ou fim
= Retângulo -> Instrução
= Losango -> Decisão
= Paralelogramo -> Entrada ou saída
> O losango tem duas saídas: sim e não.

? No pseudocódigo, o que mostra que linhas pertencem a um ciclo?
- [ ] A cor
- [x] A indentação e o FIM ENQUANTO
- [ ] Uma seta
> Tudo o que está entre ENQUANTO e FIM ENQUANTO está recuado e é repetido.
:::
