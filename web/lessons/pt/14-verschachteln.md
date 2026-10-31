---
titel: Encaixar
bereich: Fundamentos
kurz: Combinar decisões dentro de ciclos e ciclos dentro de ciclos.
---

## Competências que vou adquirir agora

::: kompetenzen
- pôr uma decisão dentro de um ciclo
- pôr um ciclo dentro de outro ciclo
- explicar que o ciclo interior é executado do princípio ao fim em cada iteração do exterior
- escrever ciclos e decisões encaixados em Java
:::

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
Foi exatamente para isto que o estrutograma foi inventado. Shneiderman perguntou-se: se devemos passar sem GOTO, porque não passar também sem as setas do fluxograma? O resultado: nada de esparguete de setas, e cada bloco fica bem arrumado no seu cercado.
:::

## Agora em Java

Contar os números pares fica assim em Java:

```java editor
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Até que número?");
int n = scanner.nextInt();
int quantidade = 0;
for (int i = 1; i <= n; i++) {
    if (i % 2 == 0) {
        quantidade++;
    } // fim do if
} // fim do for
System.out.println(quantidade);
```

O que no estrutograma está encaixado, em Java está encaixado entre chavetas. Cada nível fica quatro espaços mais para dentro. Se o teu código ficar desarrumado, ajuda o botão **Indentar** em cima na área Código.

Com muitas chavetas de fecho `}` é fácil perder a noção: que chaveta pertence a que bloco? Um comentário a seguir diz-te, p. ex. `} // fim do if` e `} // fim do for`. Isto também ajuda quando continuares mais tarde.

`quantidade++` é a forma curta de `quantidade = quantidade + 1`.

::: übung l14-java-treppe
titel: Escada de estrelas
code: java
auftrag: Escreve um programa em Java que lê o número de degraus e mostra uma escada de asteriscos. Para 3 degraus são `*`, `**` e `***`, cada degrau na sua linha.
test: 3 -> * | ** | ***
test: 1 -> *
test: 4 -> * | ** | *** | ****
braucht: forSchleife
tipp: Um ciclo exterior conta os degraus. Em cada degrau, um ciclo interior junta um texto de asteriscos.
tipp: No ciclo exterior: `String linha = "";`, depois `for (int j = 1; j <= i; j++) { linha = linha + "*"; }` e a seguir `System.out.println(linha);`.
lösung: l14-java-treppe-loesung.visustruct
:::

## Preenche os espaços: encaixar

::: lückentext
titel: Retângulo de estrelas
auftrag: O programa mostra um retângulo de 3 linhas com 4 estrelas cada. Preenche as palavras e os sinais que faltam.
```java
for (int linha = 1; linha <= 3; linha++) {
    String texto = [[""]];
    [[for]] (int coluna = 1; coluna [[<=]] 4; [[coluna++ | coluna += 1 | coluna = coluna + 1]]) {
        texto = texto [[+]] "*";
    }
    System.out.[[println]](texto);
[[}]]
```
erklärung: O ciclo de dentro constrói uma linha de 4 estrelas, o de fora repete isso três vezes. Cada linha começa com um texto vazio `""`. A última chaveta fecha o ciclo de fora.
:::

## Encontra o erro: divisíveis por 3

::: übung l14-java-fehler
titel: Corrigir a contagem
code: java
auftrag: O programa deve contar quantos números de 1 a `n` são divisíveis por 3 e mostrar o resultado **uma vez**. Para 10 é só **Quantidade: 3**. Mas mostra linhas a mais.
  “Abrir no editor” mostra o código na área Código. Encontra o erro, corrige-o e carrega em Verificar.
start: l14-java-fehler-start.visustruct
test: 10 -> Quantidade: 3
test: 3 -> Quantidade: 1
test: 2 -> Quantidade: 0
braucht: forSchleife, verzweigung
tipp: Repara nas chavetas: a saída está dentro do ciclo ou depois dele?
tipp: Passa a linha `System.out.println("Quantidade: " + quantidade);` para depois da chaveta que fecha o ciclo.
lösung: l14-java-fehler-loesung.visustruct
:::

## Porque é que não corre?

::: übung l14-java-laeuft-nicht
titel: Corrigir os números pares
code: java
auftrag: O programa deve mostrar os números pares de 1 a 10: **2**, **4**, **6**, **8**, **10**. Mas não corre.
  “Abrir no editor” mostra o código na área Código. Clica em “Executar” e lê a mensagem de erro. Corrige o erro e carrega em Verificar.
start: l14-java-laeuft-nicht-start.visustruct
test: - -> 2 | 4 | 6 | 8 | 10
braucht: forSchleife, verzweigung
tipp: O erro está lá dentro, na saída. Como se chama a variável contadora do ciclo?
tipp: A variável contadora é `i` com i minúsculo: `System.out.println(i);`
lösung: l14-java-laeuft-nicht-loesung.visustruct
:::

## Jogo: Dentro e fora

::: spiel frage
titel: Jogo: Dentro e fora
intro: O Ludwig encaixou blocos uns nos outros. Lê de fora para dentro e diz antes o que acontece. Seis rondas.

runde:
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 2; j++) {
            System.out.println("*");
        }
    }
frage: Quantas estrelas aparecem?
- 3
- 5
- [x] 6
> O ciclo interior corre por completo em cada uma das 3 voltas do ciclo exterior: 3 · 2 = 6.

runde:
    for (int i = 1; i <= 2; i++) {
        for (int j = 1; j <= 3; j++) {
            System.out.println(i + " " + j);
        }
    }
frage: Que linha aparece em quarto lugar?
- 1 4
- [x] 2 1
- 2 2
> Primeiro j percorre tudo com i = 1: 1 1, 1 2, 1 3. Depois j recomeça em 1, agora com i = 2.

runde:
    int contagem = 0;
    for (int i = 1; i <= 10; i++) {
        if (i % 3 == 0) {
            contagem++;
        }
    }
    System.out.println(contagem);
frage: O que aparece?
- [x] 3
- 10
- 4
> A decisão só conta o 3, o 6 e o 9.

runde:
    for (int i = 1; i <= 4; i++) {
        if (i % 2 == 0) {
            System.out.println("par");
        } else {
            System.out.println(i);
        }
    }
frage: O que aparece?
- 1\n2\n3\n4
- [x] 1\npar\n3\npar
- par\npar
> Em cada número a decisão volta a decidir: os ímpares aparecem como número, os pares como palavra.

runde:
    for (int i = 1; i <= 3; i++) {
        String linha = "";
        for (int j = 1; j <= i; j++) {
            linha = linha + "*";
        }
        System.out.println(linha);
    }
frage: O que aparece?
- ***\n***\n***
- [x] *\n**\n***
- ***\n**\n*
> O ciclo interior vai até i. Por isso cada linha fica com mais uma estrela.

runde:
    for (int i = 1; i <= 3; i++) {
        for (int i = 1; i <= 3; i++) {
            System.out.println(i);
        }
    }
frage: O que acontece?
- Aparece 1 a 3 três vezes.
- Aparece 1 a 3 uma vez.
- [x] O Java indica um erro.
> Dois ciclos um dentro do outro precisam de duas variáveis de contagem diferentes, por exemplo `linha` e `coluna`.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo pôr uma decisão dentro de um ciclo. → Uma decisão dentro de um ciclo
- Consigo pôr um ciclo dentro de outro ciclo. → Um ciclo dentro de um ciclo
- Consigo explicar que o ciclo interior é executado do princípio ao fim em cada iteração do exterior. → Um ciclo dentro de um ciclo
- Consigo escrever ciclos e decisões encaixados em Java. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? O ciclo exterior é executado 3 vezes, o interior 4 vezes. Quantas vezes é executado ao todo o interior do ciclo interior?
→ Um ciclo dentro de um ciclo
- [ ] 7 vezes
- [x] 12 vezes
- [ ] 4 vezes
> Em cada uma das 3 iterações exteriores, o ciclo interior é executado 4 vezes, portanto 3 · 4 = 12.

? Como sabes se um número é par?
→ Uma decisão dentro de um ciclo
- [ ] `numero / 2 == 0`
- [x] `numero % 2 == 0`
- [ ] `numero == 2`
> O % dá o resto de uma divisão. Nos números pares, o resto da divisão por 2 é zero.

? Há uma decisão dentro de um ciclo for. Quantas vezes é verificada a condição da decisão?
→ Uma decisão dentro de um ciclo
- [ ] Uma vez
- [x] Uma vez por iteração do ciclo
- [ ] Só se for verdadeira
> A decisão faz parte do interior e é executada em cada iteração.

? Como reconheces em Java o que pertence a um ciclo?
→ Agora em Java
- [ ] Pela cor
- [x] Pelas chavetas e pela indentação
- [ ] Pelos pontos e vírgulas
:::
