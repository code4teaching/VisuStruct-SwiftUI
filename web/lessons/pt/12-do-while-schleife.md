---
titel: Ciclo do-while
bereich: Fundamentos
kurz: Primeiro executar, depois verificar: ciclos com pelo menos uma iteração.
---

## Competências que vou adquirir agora

::: kompetenzen
- explicar que o ciclo do-while só verifica a sua condição depois do interior
- explicar porque é que o interior é executado pelo menos uma vez
- repetir uma entrada até ela ser válida
- escrever um ciclo do-while em Java
:::

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

::: angeberwissen
O Python não tem ciclo do-while. Quem lá quer “primeiro fazer, depois verificar” escreve `while True:` e sai do ciclo com `break`. Java, C e JavaScript, pelo contrário, têm `do … while` há décadas.
:::

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

## Agora em Java

O ciclo que corre mesmo assim uma vez fica assim em Java:

```java
int i = 10;
do {
    System.out.println(i);
    i = i + 1;
} while (i < 5);
```

- O corpo fica entre `do {` e `}`, a condição só vem depois.
- Aqui, depois de `while (…)`, há um **ponto e vírgula**. É diferente do ciclo while.

::: übung l12-java-verdoppeln
titel: Duplicar pelo menos uma vez
code: java
auftrag: Escreve um programa em Java que lê um número inicial. Um ciclo do-while duplica-o e mostra-o enquanto for menor do que 100. Um número a partir de 100 também é duplicado pelo menos uma vez: 200 passa a 400.
test: 30 -> 60 | 120
test: 200 -> 400
test: 13 -> 26 | 52 | 104
braucht: doUntilSchleife
tipp: No corpo duplicas o número e mostras. A condição fica no fim.
tipp: `do { numero = numero * 2; System.out.println(numero); } while (numero < 100);`
lösung: l12-java-verdoppeln-loesung.visustruct
:::

## Preenche os espaços: do-while

::: lückentext
titel: Triplicar
auftrag: O número é triplicado e mostrado enquanto for menor do que 100. Preenche as palavras e os sinais que faltam.
```java
int numero = 1;
[[do]] {
    numero = numero * 3;
    System.out.println(numero);
} [[while]] (numero [[<]] 100)[[;]]
```
erklärung: O corpo fica entre `do {` e `}`, a condição só vem depois. No ciclo do-while há um ponto e vírgula depois de `while (…)`. Saída: 3, 9, 27, 81 e 243.
:::

## Encontra o erro: dividir ao meio

::: übung l12-java-fehler
titel: Corrigir a divisão ao meio
code: java
auftrag: O programa lê um número inicial e, com um ciclo do-while, divide-o repetidamente por 2 (divisão inteira). Cada resultado é mostrado até chegar a **0**. Para 10 são 5, 2, 1 e 0. Mas falta o 0.
  “Abrir no editor” mostra o código na área Programação. Encontra o erro, corrige-o e carrega em Verificar.
start: l12-java-fehler-start.visustruct
test: 10 -> 5 | 2 | 1 | 0
test: 1 -> 0
test: 7 -> 3 | 1 | 0
test: 20 -> 10 | 5 | 2 | 1 | 0
braucht: doUntilSchleife
tipp: Que valor tem `numero` depois de o 1 ser mostrado? O ciclo ainda se repete mais uma vez?
tipp: O ciclo deve continuar enquanto o número for maior do que 0: `while (numero > 0);`
lösung: l12-java-fehler-loesung.visustruct
:::

## Jogo: Pelo menos uma vez?

::: spiel frage
titel: Jogo: Pelo menos uma vez?
intro: While ou do-while? O Ludwig mostra-te ciclos. Diz antes o que acontece. Seis rondas.

runde:
    int i = 10;
    do {
        System.out.println(i);
        i = i + 1;
    } while (i < 5);
frage: O que aparece?
- nada
- [x] 10
- de 10 a 4
> Primeiro fazer, depois verificar: o corpo corre uma vez, depois 11 < 5 é falso.

runde:
    int i = 10;
    while (i < 5) {
        System.out.println(i);
        i = i + 1;
    }
frage: O que aparece?
- [x] nada
- 10
- 11
> No ciclo while a condição vem primeiro. 10 < 5 é falso, por isso não corre nada.

runde:
    int numero = 200;
    do {
        numero = numero * 2;
    } while (numero < 100);
    System.out.println(numero);
frage: O que aparece?
- 200
- [x] 400
- 800
> Duplica-se uma vez de certeza. Depois 400 < 100 é falso.

runde:
    int numero = 30;
    do {
        numero = numero * 2;
        System.out.println(numero);
    } while (numero < 100);
frage: O que aparece?
- 60
- [x] 60\n120
- 60\n120\n240
> Depois de 60, 60 < 100 é verdadeiro, continua. Depois de 120 acaba.

runde:
frage: Que linha termina corretamente um ciclo do-while em Java?
- [x] `} while (i < 5);`
- `} while (i < 5)`
- `while (i < 5) {`
> Depois do `while (…)` do ciclo do-while há um ponto e vírgula.

runde:
frage: Para que se usa tipicamente um ciclo do-while?
- [x] repetir uma entrada até ser válida
- contar de 1 a 10
- trocar dois valores
> A pergunta é feita pelo menos uma vez. Só depois se sabe se a entrada era válida.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo explicar que o ciclo do-while só verifica a sua condição depois do interior. → Primeiro fazer, depois verificar
- Consigo explicar porque é que o interior é executado pelo menos uma vez. → Pelo menos uma iteração
- Consigo repetir uma entrada até ela ser válida. → Uso típico: repetir uma entrada
- Consigo escrever um ciclo do-while em Java. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? O que quer dizer ciclo pós-teste?
→ Primeiro fazer, depois verificar
- [ ] A condição é verificada antes de cada iteração.
- [x] A condição é verificada depois de cada iteração.
- [ ] O ciclo não tem condição.
> A condição fica no pé, em baixo, e é avaliada depois do interior.

? A condição de um ciclo do-while é falsa desde o início. Quantas vezes é executado o interior?
→ Pelo menos uma iteração
- [ ] Nenhuma
- [x] Exatamente uma vez
- [ ] Para sempre
> O interior é executado primeiro. Só depois o ciclo nota que deve parar.

? Queres pedir um número de 1 a 10. Que condição fica no pé?
→ Uso típico: repetir uma entrada
- [ ] `numero >= 1 && numero <= 10`
- [x] `numero < 1 || numero > 10`
- [ ] `numero == 10`
> O ciclo repete-se enquanto a entrada for inválida, ou seja, menor do que 1 ou maior do que 10.

? Quando é que um ciclo do-while é melhor do que um ciclo while?
→ Pelo menos uma iteração
- [x] Quando o interior tem de ser executado pelo menos uma vez, p. ex. numa entrada
- [ ] Quando o ciclo talvez nem precise de ser executado
- [ ] Quando queres contar exatamente até 10

? O que fica no fim de um ciclo do-while em Java?
→ Agora em Java
- [ ] } while (condicao) {
- [x] } while (condicao);
- [ ] } until (condicao);
> Depois da condição vem um ponto e vírgula.
:::
