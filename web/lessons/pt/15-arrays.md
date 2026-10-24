---
titel: Arrays
bereich: Fundamentos
kurz: Guardar muitos valores com um só nome, chegar a eles com o índice e percorrê-los com um ciclo.
---

## Muitos valores com um só nome

Imagina que queres guardar os pontos de cinco testes. Com cinco variáveis `pontos1` a `pontos5` isso fica depressa confuso. Um **array** é uma fila de posições que têm todas o mesmo nome e o mesmo tipo de dados.

Crias um array com uma instrução. Depois do tipo de dados escreves parênteses retos `[]`:

```
int[] numeros = {2, 4, 6, 8, 10}
String[] nomes = {"Ada", "Rui", "Inês"}
```

Os valores entre chavetas vão logo para as posições. Também podes criar um array vazio com um número fixo de posições:

```
int[] pontos = new int[5]
String[] nomes = new String[3]
```

Com `new int[5]`, as cinco posições têm zeros no início; com `new String[3]`, textos vazios.

## O índice começa em 0

Cada posição tem um número, o **índice**. Começa-se a contar em **0**. Portanto, com `int[] numeros = {2, 4, 6, 8, 10}`:

- `numeros[0]` é 2
- `numeros[1]` é 4
- `numeros[4]` é 10

::: grafik l14-array.svg
Cinco posições com os índices 0 a 4. O índice está por cima da posição, o valor lá dentro.
:::

**Porquê começar em 0?** Na informática, o índice não é “que posição”, mas sim a **distância ao início**. A primeira posição está logo no início, portanto a 0 passos. A segunda está a 1 passo, a terceira a 2 passos. Conheces isto do elevador: o rés-do-chão é o **0**, e o primeiro andar fica um nível acima.

Daqui sai uma regra que vale a pena decorar: com 5 posições, o **último índice é 4**, sempre um a menos do que o número de posições.

::: angeberwissen
Contar a partir de 0 já é bem antigo. A linguagem de programação C, de 1972, já funciona assim: o computador sabe o endereço da primeira posição e, para `numeros[i]`, calcula simplesmente “início mais i posições”. Com i = 0 fica no início, o que poupa uma conta. Java, Python e JavaScript copiaram isto. Já agora, eu também conto os meus chifres a partir de 0: chifre 0 à esquerda, chifre 1 à direita.
:::

Com o índice lês um valor ou escreves lá um novo:

```
output: numeros[0]
numeros[1] = 99
```

> Um array com 5 posições tem os índices 0 a 4. `numeros[5]` não existe. A simulação indica então uma expressão inválida.

## O comprimento de um array

`numeros.length` diz-te quantas posições tem um array. Com cinco valores é 5. Por isso, o **último** índice é sempre `numeros.length - 1`:

```
output: numeros.length
output: numeros[numeros.length - 1]
```

A segunda linha mostra o último valor, seja qual for o comprimento do array. O VisuStruct também percebe `numeros.length()`.

::: übung l14-erster-letzter
titel: Primeiro e último valor
auftrag: Cria o array `int[] valores = {4, 8, 15, 16, 23, 42}`. Depois mostra em três linhas: o primeiro valor, o último valor e o número de valores.
  Para o último valor, usa o comprimento e não escrevas simplesmente o índice 5.
test: - -> 4 | 42 | 6
braucht: anweisung
tipp: Começa-se a contar em 0, por isso a primeira posição tem o índice 0. E qual é o índice da última posição?
tipp: O primeiro valor é `valores[0]`. O último é `valores[valores.length - 1]`. O número de valores é `valores.length`.
lösung: l14-erster-letzter-loesung.visustruct
:::

## Percorrer um array com um ciclo

Um array mostra a sua força junto com um **ciclo for**. A variável contadora `i` vai de 0 até ao último índice e é usada como índice:

```
int i = 0
i < numeros.length
i++
```

Na primeira iteração `i` é 0, na última é 4. Como a condição é `i < numeros.length`, o ciclo serve para qualquer comprimento.

::: diagramm l14-array-durchlaufen.visustruct
O ciclo for mostra os cinco valores um a seguir ao outro. Em Variáveis, na simulação, vê o i a contar de 0 a 4.
:::

É também assim que enches um array vazio com entradas. Como destino da entrada escreves a posição `nomes[i]`:

::: diagramm l14-namen-eingeben.visustruct
São pedidos três nomes, que são escritos nas posições 0, 1 e 2.
:::

::: übung l14-rueckwaerts
titel: Mostrar ao contrário
auftrag: Cria um array para 4 números inteiros e lê os 4 números com um ciclo. Depois mostra-os pela ordem **inversa**, cada um na sua linha.
test: 1, 2, 3, 4 -> 4 | 3 | 2 | 1
test: 7, 0, 5, 9 -> 9 | 5 | 0 | 7
braucht: forSchleife
tipp: Precisas de dois ciclos: um para ler da frente para trás e outro para mostrar de trás para a frente.
tipp: Crias o array com `int[] numeros = new int[4]`. A entrada é `input: numeros[i] "Introduz um número"`. No segundo ciclo começas em `int i = numeros.length - 1`, verificas `i >= 0` e contas para trás com `i--`.
lösung: l14-rueckwaerts-loesung.visustruct
:::

## Soma e máximo

Há duas tarefas que aparecem sempre com arrays:

- **Soma:** Começas com `soma = 0` e somas cada valor no ciclo.
- **Máximo:** Primeiro guardas o valor da posição 0 como o maior até agora. No ciclo verificas cada valor. Se for maior, passa a ser o novo máximo.

::: diagramm l14-summe-maximum.visustruct
Soma e máximo numa única passagem. O máximo começa com pontos[0] e não com 0, para também estar certo com números negativos.
:::

::: übung l14-summe-max
titel: Soma e máximo
auftrag: Lê 5 números inteiros para um array. Depois mostra **Soma: …** e na linha seguinte **Máximo: …**.
test: 3, 9, 2, 9, 1 -> Soma: 24 | Máximo: 9
test: 10, 20, 30, 40, 50 -> Soma: 150 | Máximo: 50
test: -5, -2, -9, -1, -3 -> Soma: -20 | Máximo: -1
braucht: forSchleife, verzweigung
tipp: Percorre o array com um ciclo. Soma cada valor à soma e guarda o maior valor visto até agora.
tipp: Calcula a soma e o máximo em variáveis próprias e só os mostra no fim, p. ex. com `output: "Soma: " + soma`. Se o teu máximo começar em 0, o terceiro teste falha.
lösung: l14-summe-max-loesung.visustruct
:::

## Agora em Java

Percorrer um array fica assim em Java:

```
int[] numeros = {2, 4, 6, 8, 10};
for (int i = 0; i < numeros.length; i++) {
    System.out.println(numeros[i]);
}
```

- `int[]` quer dizer “array de números inteiros”. Os valores ficam entre chavetas.
- Um array vazio com 5 posições cria-se com `new int[5]`.
- `numeros[i]` é a posição com o índice `i`, `numeros.length` é o comprimento.

::: übung l15-java-noten
titel: Soma das notas em Java
code: java
auftrag: Cria em Java o array `notas` com os valores 2, 3, 1 e 4. Soma todas as notas com um ciclo for e mostra **Soma: 10**.
test: - -> Soma: 10
braucht: forSchleife
tipp: Cria `int soma = 0;` antes do ciclo. O ciclo vai de 0 até `notas.length - 1`.
tipp: `int[] notas = {2, 3, 1, 4};`, depois `for (int i = 0; i < notas.length; i++) { soma = soma + notas[i]; }` e no fim `System.out.println("Soma: " + soma);`.
lösung: l15-java-noten-loesung.visustruct
:::

## Preenche os espaços: arrays

::: lückentext
titel: Procurar o máximo
auftrag: O programa procura o maior valor do array. Preenche as palavras e os sinais que faltam.
```java
[[int]][] valores = {3, 7, 1, 9, 4};
int max = valores[0];
[[for]] (int i = 1; i < valores.[[length]]; i++) {
    if (valores[i] [[>]] max) {
        max = valores[i];
    }
}
System.out.println("Máximo: " + max);
```
erklärung: `int[]` é um array de números inteiros, `valores.length` é o seu comprimento. `max` começa com o primeiro valor e o ciclo compara todos os outros com ele. Saída: **Máximo: 9**
:::

## Encontra o erro: temperaturas

::: übung l15-java-fehler
titel: Corrigir a temperatura mais alta
code: java
auftrag: Em janeiro mediram-se as temperaturas -5, -2, -8 e -3 graus. O programa deve mostrar a mais alta, ou seja, **Temperatura mais alta: -2**. Mas diz 0 graus, embora nunca tenha estado tão quente.
  “Abrir no editor” mostra o código na área Programação. Encontra o erro, corrige-o e carrega em Verificar.
start: l15-java-fehler-start.visustruct
test: - -> Temperatura mais alta: -2
braucht: forSchleife, verzweigung
tipp: Com que valor começa `max`? Alguma das temperaturas é maior do que esse valor inicial?
tipp: `max` tem de começar com um valor do array: `int max = temperaturas[0];`
lösung: l15-java-fehler-loesung.visustruct
:::

## Jogo: Desativar a bomba

::: spiel bombe
titel: Jogo: Desativar a bomba
intro: Cada programa tem **exatamente um erro** com arrays, e a bomba está a fazer tique-taque. Toca na linha errada antes de o tempo acabar. Seis rondas, 30 segundos cada.
zeit: 30

runde:
    int[] numeros = {2, 4, 6, 8, 10};
    for (int i = 0; i <= numeros.length; i++) {
        System.out.println(numeros[i]);
    }
frage: Deve mostrar os cinco valores.
fehler: 2
besser: for (int i = 0; i < numeros.length; i++) {
> Com `<=`, i vai até 5. A posição `numeros[5]` não existe.

runde:
    String[] nomes = {"Ada", "Ben", "Cem"};
    System.out.println(nomes[1]);
frage: Deve mostrar o primeiro nome, ou seja, Ada.
fehler: 2
besser: System.out.println(nomes[0]);
> Conta-se a partir de 0. `nomes[1]` já é o Ben.

runde:
    int[] numeros = {2, 4, 6, 8, 10};
    System.out.println(numeros[numeros.length]);
frage: Deve mostrar o último valor, ou seja, 10.
fehler: 2
besser: System.out.println(numeros[numeros.length - 1]);
> O último índice é sempre um a menos do que o comprimento.

runde:
    int[] pontos = {3, 9, 2};
    int soma = 0;
    for (int i = 0; i < pontos.length; i++) {
        soma = pontos[i];
    }
    System.out.println(soma);
frage: Deve mostrar a soma 14.
fehler: 4
besser: soma = soma + pontos[i];
> Assim cada valor apaga o anterior, e no fim soma só tem 2.

runde:
    int[] pontos = {-5, -2, -9};
    int max = 0;
    for (int i = 0; i < pontos.length; i++) {
        if (pontos[i] > max) {
            max = pontos[i];
        }
    }
    System.out.println(max);
frage: Deve mostrar o máximo -2.
fehler: 2
besser: int max = pontos[0];
> Nenhum dos números é maior do que 0, por isso max ficaria em 0. É por isso que o máximo começa com a primeira posição.

runde:
    int[] numeros = {2, 4, 6, 8, 10};
    for (int i = numeros.length; i >= 0; i--) {
        System.out.println(numeros[i]);
    }
frage: Deve mostrar os valores de trás para a frente, de 10 a 2.
fehler: 2
besser: for (int i = numeros.length - 1; i >= 0; i--) {
> De trás para a frente começa-se no último índice, que é `numeros.length - 1`.
:::

## Lista de verificação

::: checkliste
- Sei criar um array com valores ou com `new int[5]`. → Muitos valores com um só nome
- Sei que o índice começa em 0 e que o último índice é `length - 1`. → O índice começa em 0
- Sei percorrer e encher um array com um ciclo for. → Percorrer um array com um ciclo
- Sei calcular a soma e o máximo de um array. → Soma e máximo
- Sei criar um array em Java e percorrê-lo com um ciclo. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? O que mostra `output: numeros[2]` com `int[] numeros = {5, 10, 15, 20}`?
- [ ] 10
- [x] 15
- [ ] 20
> Começa-se a contar em 0: numeros[0] é 5, numeros[1] é 10, numeros[2] é 15.

? Um array tem 8 posições. Qual é o último índice?
- [ ] 8
- [x] 7
- [ ] 9
> O último índice é sempre length - 1.

? Que condição serve para um ciclo for que percorre todos os valores de `numeros` e começa em `int i = 0`?
- [x] i < numeros.length
- [ ] i <= numeros.length
- [ ] i > numeros.length
> Com <= o ciclo também leria numeros[length], e essa posição não existe.

? Com que valor deve começar o máximo antes de o ciclo começar?
- [ ] Sempre com 0
- [x] Com o primeiro valor do array
- [ ] Com o comprimento do array
> Se começar com 0, então só com números negativos o resultado seria 0, embora o 0 nem esteja no array.

? O que mostra `output: numeros.length` com `int[] numeros = {5, 10, 15, 20}`?
- [ ] 3
- [x] 4
- [ ] 20
> length é o número de posições, não o último índice nem o último valor.

? Que linha cria em Java um array com três números?
- [x] int[] numeros = {1, 2, 3};
- [ ] int numeros = [1, 2, 3];
- [ ] array numeros = (1, 2, 3);
:::
