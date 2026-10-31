---
titel: Ciclo for
bereich: Fundamentos
kurz: Contar um número fixo de iterações com Início, Condição e Passo.
---

## Competências que vou adquirir agora

::: kompetenzen
- nomear as três partes Início, Condição e Passo do ciclo for
- explicar por que ordem são executadas as três partes
- contar para a frente, para trás e em passos maiores com um ciclo for
- escrever um ciclo for em Java e explicar os seus três campos
:::

## Contar com um plano fixo

No ciclo while já foste contando: um valor inicial antes do ciclo, uma condição na cabeça, uma alteração no interior. O **ciclo for** junta estas três partes na cabeça. Assim vês num relance como ele conta.

Quando clicas num ciclo for, ele tem três campos à direita:

- **Início:** `int i = 1` cria a variável contadora.
- **Condição:** `i <= 5` diz até quando se conta.
- **Passo:** `i++` aumenta `i` em 1 depois de cada iteração.

::: diagramm l12-eins-bis-fuenf.visustruct
Um ciclo for que mostra os números de 1 a 5.
:::

::: angeberwissen
Porque é que a variável de contagem se chama quase sempre `i`? Na matemática, `i` representa há muito tempo um índice. E em FORTRAN, uma das primeiras linguagens de programação, de 1957, todas as variáveis começadas por I a N eram automaticamente números inteiros. Os programadores ainda não perderam o hábito.
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

## Agora em Java

A soma de 1 até n fica assim em Java:

```java editor
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Até que número?");
int n = scanner.nextInt();
int soma = 0;
for (int i = 1; i <= n; i++) {
    soma = soma + i;
}
System.out.println(soma);
```

Nos parênteses curvos depois de `for` estão os três campos do ciclo for, separados por ponto e vírgula:

| Campo | Em Java | Significado |
|---|---|---|
| Início | `int i = 1` | `i` começa em 1. |
| Condição | `i <= n` | O ciclo corre enquanto isto for verdade. |
| Passo | `i++` | Depois de cada iteração, `i` aumenta 1. |

`i++` é a forma curta de `i = i + 1`. Para contar para trás usas `i--`.

::: übung l13-java-quadrate
titel: Quadrados em Java
code: java
auftrag: Escreve um programa em Java que lê um número inteiro `n` e, com um ciclo for, mostra os quadrados de 1 até `n`, cada um na sua linha. Para 3, são 1, 4 e 9.
test: 3 -> 1 | 4 | 9
test: 5 -> 1 | 4 | 9 | 16 | 25
test: 1 -> 1
braucht: forSchleife
tipp: O ciclo conta `i` de 1 até `n`. O quadrado de `i` é `i * i`.
tipp: `for (int i = 1; i <= n; i++) { … }` e no corpo `System.out.println(i * i);`.
lösung: l13-java-quadrate-loesung.visustruct
:::

## Preenche os espaços: for

::: lückentext
titel: Contar para cima e para baixo
auftrag: O primeiro ciclo soma os números de 1 a 5, o segundo conta de 10 até 0 para trás. Preenche as palavras e os sinais que faltam.
```java
int soma = 0;
[[for]] ([[int]] i = 1; i [[<=]] 5; [[i++ | i += 1 | i = i + 1]]) {
    soma = soma + i;
}
System.out.println("Soma: " + soma);
for (int i = 10; i [[>=]] 0; [[i-- | i -= 1 | i = i - 1]]) {
    System.out.println(i);
}
```
erklärung: Entre os parênteses ficam o valor inicial, a condição e o passo, separados por ponto e vírgula. `i++` conta para cima, `i--` conta para baixo. Ao contar para trás até 0, a condição é `i >= 0`.
:::

## Encontra o erro: tabuada

::: übung l13-java-fehler
titel: Corrigir a tabuada
code: java
auftrag: O programa pergunta que tabuada queres e deve mostrá-la de 1 vez até 10 vezes, para o 7 são 7, 14, … até 70. Mas falta o 70.
  “Abrir no editor” mostra o código na área Código. Encontra o erro, corrige-o e carrega em Verificar.
start: l13-java-fehler-start.visustruct
test: 7 -> 7 | 14 | 21 | 28 | 35 | 42 | 49 | 56 | 63 | 70
test: 3 -> 3 | 6 | 9 | 12 | 15 | 18 | 21 | 24 | 27 | 30
braucht: forSchleife
tipp: Quantas vezes se repete o ciclo? Conta os valores que `i` toma.
tipp: `i` também deve tomar o valor 10: `i <= 10` em vez de `i < 10`.
lösung: l13-java-fehler-loesung.visustruct
:::

## Porque é que não corre?

::: übung l13-java-laeuft-nicht
titel: Corrigir a escada
code: java
auftrag: O Ludwig sobe 5 degraus, cada um com 20 cm. O programa deve mostrar **Altura: 100 cm**. Mas não corre.
  “Abrir no editor” mostra o código na área Código. Clica em “Executar” e lê a mensagem de erro. Corrige o erro e carrega em Verificar.
start: l13-java-laeuft-nicht-start.visustruct
test: - -> Altura: 100 cm
braucht: forSchleife
tipp: A variável `altura` é usada num cálculo, mas onde é criada? E com que altura começa o Ludwig?
tipp: Cria `altura` antes do ciclo: `int altura = 0;`
lösung: l13-java-laeuft-nicht-loesung.visustruct
:::

## Jogo: Desativar a bomba

::: spiel bombe
titel: Jogo: Desativar a bomba
intro: Cada programa esconde **exatamente um erro**, e a bomba está a fazer tiquetaque. Lê o que o programa deve fazer e toca na linha errada antes de o tempo acabar. Oito rondas, 25 segundos cada.
zeit: 25

runde:
    for (int i = 1; i <= 3; i++) {
        System.out.println(i)
    }
frage: Deve mostrar 1, 2 e 3.
fehler: 2
besser: System.out.println(i);
> Falta o ponto e vírgula no fim da instrução.

runde:
    for (int i = 1, i <= 5, i++) {
        System.out.println(i);
    }
frage: Deve mostrar de 1 a 5.
fehler: 1
besser: for (int i = 1; i <= 5; i++) {
> Os três campos do ciclo for separam-se com ponto e vírgula, não com vírgulas.

runde:
    for (int i = 10; i >= 1; i++) {
        System.out.println(i);
    }
frage: Deve contar para trás de 10 até 1.
fehler: 1
besser: for (int i = 10; i >= 1; i--) {
> Com `i++`, `i` fica sempre maior e a condição `i >= 1` continua verdadeira: um ciclo infinito. Para contar para trás usas `i--`.

runde:
    int soma = 0;
    for (int i = 1; i <= 4; i++) {
        soma = i;
    }
    System.out.println(soma);
frage: Deve mostrar a soma 1 + 2 + 3 + 4 = 10.
fehler: 3
besser: soma = soma + i;
> `soma = i` substitui a soma em cada iteração. No fim fica lá só 4.

runde:
    for (int i = 0; i <= 5; i++) {
        System.out.println("Mééé");
    }
frage: Deve mostrar Mééé exatamente cinco vezes.
fehler: 1
besser: for (int i = 0; i < 5; i++) {
> De 0 até 5, inclusive, são seis iterações. Quem começa em 0 usa `<`.

runde:
    for (int i = 1; i <= 3; i++) {
        system.out.println(i);
    }
frage: Deve mostrar 1, 2 e 3.
fehler: 2
besser: System.out.println(i);
> O Java distingue maiúsculas de minúsculas: `System` escreve-se com S maiúsculo.

runde:
    int numero = 7;
    for (int i = 1; i <= 10; i++) {
        System.out.println(numero + " x " + i + " = " + numero * numero);
    }
frage: Deve mostrar a tabuada do 7: 7 x 1 = 7, 7 x 2 = 14 e assim por diante.
fehler: 3
besser: System.out.println(numero + " x " + i + " = " + numero * i);
> `numero * numero` dá sempre 49. Tem de ser `numero * i`.

runde:
    for (int i = 2; i <= 10; i + 2) {
        System.out.println(i);
    }
frage: Deve mostrar os números pares 2, 4, 6, 8 e 10.
fehler: 1
besser: for (int i = 2; i <= 10; i = i + 2) {
> `i + 2` só calcula e não guarda nada. Para `i` crescer mesmo, é preciso `i = i + 2`.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo nomear as três partes Início, Condição e Passo do ciclo for. → Contar com um plano fixo
- Consigo explicar por que ordem são executadas as três partes. → Por que ordem?
- Consigo contar para a frente, para trás e em passos maiores com um ciclo for. → Outros passos
- Consigo escrever um ciclo for em Java e explicar os seus três campos. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? Quantas vezes é executado o Início de um ciclo for?
→ Por que ordem?
- [x] Exatamente uma vez
- [ ] Antes de cada iteração
- [ ] Depois de cada iteração
> O Início cria a variável contadora uma vez, no começo.

? Início `int i = 0`, Condição `i < 3`, Passo `i++`. Que valores tem i dentro do ciclo?
→ Contar com um plano fixo
- [ ] 1, 2, 3
- [x] 0, 1, 2
- [ ] 0, 1, 2, 3
> Com i = 3 a condição é falsa, por isso o interior já não é executado.

? Início `int i = 2`, Condição `i <= 10`, Passo `i = i + 2`. Quantas vezes é executado o interior?
→ Outros passos
- [ ] 4 vezes
- [x] 5 vezes
- [ ] 10 vezes
> i toma os valores 2, 4, 6, 8 e 10.

? Quando é que um ciclo for serve melhor?
→ Contar com um plano fixo
- [x] Quando sabes de antemão quantas vezes repetir
- [ ] Quando perguntas até uma entrada ser válida
- [ ] Quando só é verificado um único valor

? O que significa `i++` num ciclo for?
→ Contar com um plano fixo
- [ ] i é duplicado.
- [x] i aumenta 1.
- [ ] i é mostrado.
> `i++` é a forma curta de `i = i + 1`.
:::
