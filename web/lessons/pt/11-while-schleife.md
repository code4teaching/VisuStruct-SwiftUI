---
titel: Ciclo while
bereich: Fundamentos
kurz: Repetir passos enquanto uma condição for verdadeira.
---

## Competências que vou adquirir agora

::: kompetenzen
- explicar que o ciclo while verifica a sua condição antes de cada iteração
- usar uma variável contadora com valor inicial, condição e alteração
- notar quando um ciclo nunca acaba e corrigir o erro
- seguir um ciclo iteração a iteração num teste de secretária
- escrever um ciclo while em Java
:::

## Repetir enquanto algo se verificar

Muitas vezes um programa deve fazer uma coisa várias vezes. Em vez de escreveres o mesmo bloco cinco vezes, usas um **ciclo**.

O **ciclo while** repete o seu interior **enquanto** a sua condição for verdadeira. A condição fica em cima, na cabeça do bloco. O interior fica recuado por baixo, enquadrado por um parêntese à esquerda.

::: diagramm l10-countdown.visustruct
Uma contagem decrescente: enquanto numero for maior do que 0, numero é mostrado e diminui 1. Depois aparece Partida!
:::

## Primeiro a condição

O ciclo while é um **ciclo pré-teste**. Antes de **cada** iteração, a condição é verificada:

1. Verificar a condição.
2. Se for verdadeira, executar o interior uma vez e recomeçar no 1.
3. Se for falsa, o programa continua por baixo do ciclo.

::: grafik l10-kopfgesteuert.svg
Depois de cada iteração volta-se à condição. Só quando ela é falsa é que o programa continua por baixo do ciclo.
:::

Na contagem decrescente, a condição é verificada quatro vezes: com 3, 2 e 1 é verdadeira, com 0 é falsa.

> Se a condição já for falsa da primeira vez que é verificada, o interior **não é executado nem uma vez**. Começa a contagem com `int numero = 0` e só aparece Partida!

## Uma variável contadora

Muitos ciclos vão contando. Para isso precisas de três coisas:

- **Um valor inicial antes do ciclo**, p. ex. `int i = 1`
- **Uma condição na cabeça**, p. ex. `i <= 5`
- **Uma alteração no interior**, p. ex. `i = i + 1` (abreviado: `i++`)

Se faltar uma destas partes, o ciclo conta mal ou nem sequer conta.

::: angeberwissen
Os ciclos de contagem são antiquíssimos! No artigo de 1973, Nassi e Shneiderman mostraram a sua ideia, entre outras coisas, com o **fatorial**: 5! = 1 · 2 · 3 · 4 · 5 = 120. Aqui está a minha versão caprina. Experimenta-a com **Passo** na simulação e vê o `fatorial` a crescer. Mééé, isto vai depressa!
:::

::: diagramm l10-fakultaet.visustruct
O fatorial com uma variável contadora `i`, reconstruído a partir de um exemplo do artigo de 1973.
:::

## Exercício: Contar até n

::: übung l10-bis-n
titel: Contar até n
auftrag: Pede um número inteiro `n` e mostra todos os números de 1 a `n`, cada um na sua linha.
test: 3 -> 1 | 2 | 3
test: 5 -> 1 | 2 | 3 | 4 | 5
test: 1 -> 1
braucht: whileSchleife
tipp: Precisas de uma variável contadora que começa em 1 e aumenta 1 em cada iteração.
tipp: Antes do ciclo, cria `int i = 1`. A condição é `i <= n`. No interior mostras `i` e depois aumentas `i` em 1.
lösung: l10-bis-n-loesung.visustruct
:::

## Atenção: ciclo infinito

Se nada no interior do ciclo alterar a condição, ela fica verdadeira para sempre. O ciclo nunca para. A isto chama-se **ciclo infinito**.

::: diagramm l10-endlos.visustruct
Aqui falta numero = numero - 1. O ciclo mostra 3 uma e outra vez e nunca chega a Partida!
:::

Pergunta-te em cada ciclo: **O que é que no interior garante que a condição acaba por ficar falsa?** Quando um exercício é verificado, o VisuStruct para depois de um número muito grande de passos e indica um possível ciclo infinito.

## Exercício: Duplicar até 100

::: übung l10-verdoppeln
titel: Duplicar até 100
auftrag: Pede um número inteiro. Duplica-o até ele ser pelo menos 100.
  No fim, mostra **quantas vezes** o duplicaste.
test: 10 -> 4
test: 30 -> 2
test: 1 -> 7
test: 100 -> 0
braucht: whileSchleife
tipp: O ciclo é executado enquanto o número ainda for demasiado pequeno. Vai contando quantas vezes foi executado.
tipp: Precisas de uma segunda variável `int passos = 0`. A condição é `numero < 100`. No interior duplicas o número com `numero = numero * 2` e aumentas `passos` em 1. Se o número já for 100, o ciclo nem chega a ser executado.
lösung: l10-verdoppeln-loesung.visustruct
:::

## Ciclos num teste de secretária

Com um ciclo, o **teste de secretária** é especialmente valioso. Vês exatamente quantas vezes o ciclo é executado e com que valor para. Cada verificação da condição tem uma linha própria.

::: diagramm l16-schreibtisch.visustruct
Um ciclo while soma os números 1, 2 e 3.
:::

| Passo | soma | i | Saída |
|---|---|---|---|
| `int soma = 0` | 0 | – | |
| `int i = 1` | 0 | 1 | |
| `i <= 3` → true | 0 | 1 | |
| `soma = soma + i` | 1 | 1 | |
| `i = i + 1` | 1 | 2 | |
| `i <= 3` → true | 1 | 2 | |
| `soma = soma + i` | 3 | 2 | |
| `i = i + 1` | 3 | 3 | |
| `i <= 3` → true | 3 | 3 | |
| `soma = soma + i` | 6 | 3 | |
| `i = i + 1` | 6 | 4 | |
| `i <= 3` → false | 6 | 4 | |
| `output: soma` | 6 | 4 | 6 |

Erros frequentes em ciclos são:

- O ciclo é executado **uma vez a mais ou uma vez a menos**, p. ex. `<` em vez de `<=`.
- Uma variável **não é alterada** no ciclo, ou é alterada no sentido errado. Então o ciclo nunca acaba.
- Uma variável recebe o seu valor inicial **dentro** do ciclo em vez de antes dele e é reposta em cada iteração.

## Exercício: Corrigir a contagem decrescente

::: übung l16-countdown
titel: Corrigir a contagem decrescente
auftrag: A contagem decrescente deve contar para trás a partir do valor inicial e mostrar **Já!** no fim. Ou seja, com 3: 3, 2, 1, Já!
  O diagrama inicial tem dois erros. Encontra e corrige os dois.
start: l16-countdown-start.visustruct
test: 3 -> 3 | 2 | 1 | Já!
test: 1 -> 1 | Já!
test: 0 -> Já!
tipp: Há dois erros. Um tem a ver com a contagem, o outro com a saída no fim.
tipp: Inicia a simulação com o valor inicial 3 e observa i em Variáveis. O i diminui? Compara também com atenção a última saída com a tarefa.
lösung: l16-countdown-loesung.visustruct
:::

## Agora em Java

A contagem decrescente do início desta lição fica assim em Java:

```java editor
int numero = 3;
while (numero > 0) {
    System.out.println(numero);
    numero = numero - 1;
}
System.out.println("Partida!");
```

- Depois de `while`, a condição fica entre parênteses curvos, como em `if`.
- Tudo o que se repete fica entre chavetas. É o corpo do ciclo.
- O corpo está recuado. Assim vês, como no estrutograma, o que pertence ao ciclo.

::: übung l11-java-gerade
titel: Números pares em Java
code: java
auftrag: Escreve um programa em Java que lê um número inteiro `n` e, com um ciclo while, mostra todos os números pares de 2 até no máximo `n`. Para 7, são 2, 4 e 6.
test: 7 -> 2 | 4 | 6
test: 8 -> 2 | 4 | 6 | 8
test: 2 -> 2
braucht: whileSchleife
tipp: Precisas de uma variável contadora que começa em 2. O ciclo corre enquanto ela não for maior do que `n`.
tipp: `int numero = 2;` antes do ciclo, depois `while (numero <= n) { … }`. No corpo mostras `numero` e aumentas com `numero = numero + 2;`.
lösung: l11-java-gerade-loesung.visustruct
:::

## Preenche os espaços: while

::: lückentext
titel: Soma de 1 a 10
auftrag: O programa deve somar os números de 1 a 10. Preenche as palavras e os sinais que faltam.
```java
int soma = 0;
int numero = 1;
[[while]] (numero [[<=]] 10) [[{]]
    soma = soma + [[numero]];
    [[numero]] = numero + 1;
}
System.out.println("Soma: " + soma);
```
erklärung: O ciclo repete-se enquanto `numero` for no máximo 10. Em cada volta, `numero` é somado à soma e depois `numero` aumenta 1. Sem essa linha seria um ciclo infinito. Saída: **Soma: 55**
:::

## Encontra o erro: poupar

::: übung l11-java-fehler
titel: Corrigir o plano de poupança
code: java
auftrag: O Ludwig poupa 5 euros por semana. O programa pergunta o objetivo e deve mostrar ao fim de quantas semanas ele o atinge. Para 50 euros são 10 semanas, mas o programa diz **Semanas: 11**.
  Percorre o código com Passo a passo e observa `dinheiro` e `semanas`. Corrige o erro e carrega em Verificar.
start: l11-java-fehler-start.visustruct
test: 50 -> Semanas: 10
test: 12 -> Semanas: 3
test: 5 -> Semanas: 1
test: 1 -> Semanas: 1
braucht: whileSchleife
tipp: Quanto dinheiro tem o Ludwig quando o ciclo se repete pela última vez? Precisa mesmo de poupar mais uma semana?
tipp: Só se poupa enquanto o objetivo **ainda não foi atingido**: `while (dinheiro < objetivo)`.
lösung: l11-java-fehler-loesung.visustruct
:::

## Porque é que não corre?

::: übung l11-java-laeuft-nicht
titel: Corrigir a contagem
code: java
auftrag: A contagem decrescente deve mostrar **3**, **2**, **1** e depois **Partida!** Mas não corre.
  “Abrir no editor” mostra o código na área Código. Clica em “Executar” e lê a mensagem de erro. Corrige o erro e carrega em Verificar.
start: l11-java-laeuft-nicht-start.visustruct
test: - -> 3 | 2 | 1 | Partida!
braucht: whileSchleife
tipp: O erro está dentro do ciclo. Que variável deve ser mostrada e como se chama de facto?
tipp: Mostra `numero` com n minúsculo: `System.out.println(numero);`
lösung: l11-java-laeuft-nicht-loesung.visustruct
:::

## Jogo: Quantas vezes?

::: spiel frage
titel: Jogo: Quantas vezes?
intro: O Ludwig escreveu ciclos while. Faz o teste de secretária de cabeça. Seis rondas.

runde:
    int numero = 3;
    while (numero > 0) {
        System.out.println(numero);
        numero = numero - 1;
    }
    System.out.println("Já!");
frage: O que aparece?
- [x] 3\n2\n1\nJá!
- 3\n2\n1\n0\nJá!
- Já!
> Quando numero é 0, `numero > 0` é falso, por isso o 0 já não aparece.

runde:
    int i = 10;
    while (i < 5) {
        System.out.println(i);
        i = i + 1;
    }
frage: O que aparece?
- [x] nada
- 10
- de 10 a 4
> A condição é verificada primeiro. 10 < 5 é falso, o corpo não corre nem uma vez.

runde:
    int i = 1;
    while (i <= 3) {
        System.out.println(i);
    }
frage: O que acontece?
- Aparecem 1, 2 e 3.
- [x] O ciclo nunca para.
- Não aparece nada.
> i nunca aumenta no corpo. A condição fica sempre verdadeira: um ciclo infinito.

runde:
    int numero = 1;
    while (numero < 100) {
        numero = numero * 2;
    }
    System.out.println(numero);
frage: O que aparece?
- 64
- 100
- [x] 128
> 1, 2, 4, 8, 16, 32, 64, 128. Só com 128 é que `numero < 100` é falso.

runde:
    int i = 0;
    while (i < 5) {
        i = i + 2;
    }
    System.out.println(i);
frage: O que aparece?
- 4
- 5
- [x] 6
> i passa por 0, 2, 4, 6. Com 6, `i < 5` é falso. O 5 é saltado.

runde:
    int i = 1;
    while (i <= 10) {
        i = i + 3;
    }
frage: Quantas vezes corre o corpo?
- 3 vezes
- [x] 4 vezes
- 10 vezes
> O corpo corre com i = 1, 4, 7 e 10. Depois i fica 13.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo explicar que o ciclo while verifica a sua condição antes de cada iteração. → Primeiro a condição
- Consigo usar uma variável contadora com valor inicial, condição e alteração. → Uma variável contadora
- Consigo notar quando um ciclo nunca acaba e corrigir o erro. → Atenção: ciclo infinito
- Consigo seguir um ciclo iteração a iteração num teste de secretária. → Ciclos num teste de secretária
- Consigo escrever um ciclo while em Java. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? O que quer dizer ciclo pré-teste?
→ Primeiro a condição
- [x] A condição é verificada antes de cada iteração.
- [ ] A condição é verificada depois de cada iteração.
- [ ] O ciclo é sempre executado exatamente uma vez.
> A cabeça com a condição está em cima e é avaliada primeiro.

? `int i = 5`, depois um ciclo while com a condição `i < 3`. Quantas vezes é executado o interior?
→ Primeiro a condição
- [x] Nenhuma
- [ ] Uma vez
- [ ] Três vezes
> Logo da primeira vez que é verificado, 5 < 3 é falso.

? Porque é que um ciclo com a condição `numero > 0` nunca acaba se o interior só tiver `output: numero`?
→ Atenção: ciclo infinito
- [ ] Porque a saída aumenta o número
- [x] Porque numero nunca muda e a condição fica sempre verdadeira
- [ ] Porque a condição está mal escrita
> No interior tem de acontecer algo que acabe por tornar a condição falsa.

? Que outros nomes têm os ciclos nos manuais?
→ Primeiro a condição
- [x] Iteração ou repetição
- [ ] Decisões
- [ ] Subprogramas
> Um ciclo repete instruções. Por isso também se chama iteração ou estrutura de repetição.

? Um ciclo deve contar de 1 a 5, mas só vai até 4. Qual é o erro provável?
→ Uma variável contadora
- [x] A condição diz i < 5 em vez de i <= 5.
- [ ] O ciclo é um ciclo while.
- [ ] A variável i tem o nome errado.

? Que linha começa corretamente um ciclo while em Java?
→ Agora em Java
- [ ] while numero > 0 {
- [x] while (numero > 0) {
- [ ] while (numero > 0);
> A condição fica entre parênteses curvos, depois `{` abre o corpo.
:::
