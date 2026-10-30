---
titel: Arrays bidimensionais
bereich: Fundamentos
kurz: Guardar valores em linhas e colunas, como os lugares de um cinema, e percorrê-los com dois ciclos encaixados.
---

## Competências que vou adquirir agora

::: kompetenzen
- criar um array 2D e explicar o que significam os dois números
- ler e escrever uma posição com fila e lugar
- distinguir `lugares.length` de `lugares[0].length`
- explicar por que ordem dois ciclos encaixados visitam as posições
- criar e percorrer um array bidimensional em Java
:::

## Um cinema como tabela

Um cinema tem várias **filas**, e cada fila tem vários **lugares**. Para cada lugar queremos saber se o bilhete já foi vendido. É uma pergunta de sim ou não, por isso serve o tipo de dados `boolean`: `true` quer dizer vendido, `false` quer dizer livre.

Um array normal é uma só fila de posições. Para o cinema precisamos de uma **tabela** com linhas e colunas. Isso é um **array bidimensional**, abreviado array 2D. Para isso escreves dois pares de parênteses retos:

```
boolean[][] lugares = new boolean[3][5]
```

Isto dá 3 filas com 5 lugares cada, ou seja, 15 posições. No início, todas as posições têm `false`: todos os lugares estão livres.

::: grafik kino-saal.svg
O primeiro índice é a fila, o segundo é o lugar. Os dois contam-se a partir de 0.
:::

## Chegar a uma posição

Para uma posição precisas agora de **dois** índices: primeiro a fila, depois o lugar.

```
lugares[1][2] = true
```

Agora o lugar 2 da fila 1 está vendido. Ler funciona da mesma maneira: `lugares[1][2]` é agora `true`.

Também podes perguntar o tamanho:

- `lugares.length` é o número de **filas**, aqui 3.
- `lugares[0].length` é o número de **lugares** da fila 0, aqui 5.

::: diagramm kino-verkaufen.visustruct
São vendidos três bilhetes. Depois, o diagrama mostra o tamanho do cinema e se a fila 1, lugar 2, está vendido. Repara em Variáveis, na simulação: lugares é mostrado fila a fila.
:::

> Tal como num array normal, não existe a posição `lugares[3][0]`, porque as filas se chamam 0, 1 e 2. A simulação indica então uma expressão inválida.

## Dois ciclos um dentro do outro

Para olhar para **todos** os lugares, precisas de dois ciclos for, um dentro do outro:

- O **ciclo exterior** conta a fila: `fila` vai de 0 a 2.
- O **ciclo interior** conta o lugar: `lugar` vai de 0 a 4.

::: grafik kino-schleifen.svg
Azul é o ciclo exterior, laranja o interior. Os números mostram a ordem pela qual os lugares aparecem.
:::

Para cada fila, o ciclo interior é executado **do princípio ao fim** uma vez. Só quando `lugar` passou pelos cinco lugares é que o ciclo exterior avança `fila` em um. Depois, `lugar` recomeça em 0. Assim, todos os 3 · 5 = 15 lugares aparecem exatamente uma vez.

As condições são `fila < lugares.length` e `lugar < lugares[fila].length`. Assim os ciclos servem para um cinema de qualquer tamanho.

::: diagramm kino-saalplan.visustruct
A planta da sala: para cada fila é montada e mostrada uma linha de X (vendido) e O (livre). Percorre-a com Passo e vê como lugar recomeça sempre do início, enquanto fila só vai contando devagar.
:::

::: angeberwissen
Cada foto do telemóvel é um array 2D! Uma foto com 4000 · 3000 píxeis tem 3000 linhas com 4000 posições cada, ou seja, 12 milhões de píxeis. Cada posição guarda a cor de um ponto. Quando pões uma foto mais clara, o telemóvel percorre todos os píxeis com dois ciclos encaixados. A minha foto de perfil, já agora, só tem uma posição: castanho.
:::

## Exercício: Contar lugares livres

::: übung kino-frei
titel: Contar lugares livres
auftrag: No diagrama inicial já foram vendidos três bilhetes. Usa dois ciclos encaixados para contar quantos lugares ainda estão **livres** e mostra p. ex. `Livres: 12`.
start: kino-frei-start.visustruct
test: - -> Livres: 12
braucht: forSchleife, verzweigung
tipp: Tal como na planta da sala, percorres todos os lugares com dois ciclos. Em vez de mostrares alguma coisa, contas.
tipp: Antes dos ciclos, cria `int livres = 0`. Um lugar está livre se `lugares[fila][lugar]` for false. A condição para isso é `!lugares[fila][lugar]`.
lösung: kino-frei-loesung.visustruct
:::

## Exercício: Vender um bilhete

::: übung kino-karte
titel: Vender um bilhete
auftrag: O diagrama inicial pede uma fila e um lugar. Se o lugar já estiver vendido, mostra `Já vendido`. Caso contrário, marca-o como vendido e mostra p. ex. `Vendido: fila 0, lugar 4`.
start: kino-karte-start.visustruct
test: 1, 2 -> Já vendido
test: 0, 4 -> Vendido: fila 0, lugar 4
test: 2, 0 -> Vendido: fila 2, lugar 0
braucht: verzweigung
tipp: Verifica primeiro se o lugar está vendido. Consoante a resposta, acontece uma coisa diferente.
tipp: Aqui não precisas de ciclo. Basta uma decisão com a condição `lugares[fila][lugar]`. No ramo false pões a posição a `true`.
lösung: kino-karte-loesung.visustruct
:::

## Exercício: Tabela da tabuada

::: übung kino-einmaleins
titel: Tabela da tabuada
auftrag: Cria `int[][] tabela = new int[10][10]` e enche-a com a tabuada até 10 usando dois ciclos. Depois pede dois números de 1 a 10 e lê o resultado da tabela, p. ex. `3 · 4 = 12`.
test: 3, 4 -> 3 · 4 = 12
test: 7, 8 -> 7 · 8 = 56
test: 10, 10 -> 10 · 10 = 100
braucht: forSchleife
tipp: Primeiro, dois ciclos encaixados enchem a tabela; depois lês só uma única posição.
tipp: Os índices vão de 0 a 9, mas os números de 1 a 10. Por isso, a posição `tabela[i][j]` tem o valor `(i + 1) * (j + 1)`, e para 3 · 4 lês `tabela[a - 1][b - 1]`.
lösung: kino-einmaleins-loesung.visustruct
:::

## Agora em Java

A sala de cinema fica assim em Java:

```java
boolean[][] lugares = new boolean[3][5];
lugares[0][2] = true;
lugares[1][1] = true;
lugares[1][2] = true;
System.out.println("Filas: " + lugares.length);
System.out.println("Lugares por fila: " + lugares[0].length);
System.out.println("Fila 1, lugar 2 vendido? " + lugares[1][2]);
```

- Dois pares de parênteses retos `[][]` representam uma tabela: primeiro a fila, depois o lugar.
- `lugares.length` é o número de filas, `lugares[0].length` o número de lugares numa fila.
- Com valores fixos, escreves cada fila nas suas próprias chavetas: `int[][] t = {{1, 2}, {3, 4}};`

::: übung l16-java-punkte
titel: Somar os pontos
code: java
auftrag: Três jogadores jogaram duas rondas cada um. Cria em Java a tabela `pontos` com as filas {3, 5}, {4, 1} e {2, 2}. Soma todos os pontos com dois ciclos for encaixados e mostra **Soma: 17**.
test: - -> Soma: 17
braucht: forSchleife
tipp: O ciclo exterior percorre as filas, o interior os lugares de uma fila.
tipp: `int[][] pontos = {{3, 5}, {4, 1}, {2, 2}};` e no ciclo interior `soma = soma + pontos[i][j];`. O ciclo interior vai até `pontos[i].length`.
lösung: l16-java-punkte-loesung.visustruct
:::

## Preenche os espaços: tabelas

::: lückentext
titel: Somar todos os campos
auftrag: O programa soma todos os números da tabela. Preenche as palavras e os sinais que faltam.
```java
[[int]][][] campo = {{1, 2, 3}, {4, 5, 6}};
int soma = 0;
for (int l = 0; l < campo.[[length]]; l++) {
    for (int c = 0; c < campo[l].[[length]]; c++) {
        soma = soma [[+]] campo[l][c];
    }
}
System.out.println("Soma: " + soma);
```
erklärung: `int[][]` é uma tabela. `campo.length` é o número de linhas (2), `campo[l].length` o número de campos na linha `l` (3). Saída: **Soma: 21**
:::

## Encontra o erro: pontos

::: übung l16-java-fehler
titel: Corrigir o jogador 2
code: java
auftrag: Na tabela `pontos`, cada linha corresponde a um jogador. O programa deve somar os pontos do jogador 2 (linha 1), ou seja, **Jogador 2: 11**. Em vez disso, dá um erro.
  “Abrir no editor” mostra o código na área Código. Encontra o erro, corrige-o e carrega em Verificar.
start: l16-java-fehler-start.visustruct
test: - -> Jogador 2: 11
braucht: forSchleife
tipp: Em `pontos[a][b]`, `a` é a linha e `b` o lugar na linha. Que número corresponde à linha do jogador 2?
tipp: Os índices estão trocados: `pontos[1][j]` em vez de `pontos[j][1]`.
lösung: l16-java-fehler-loesung.visustruct
:::

## Jogo: Que lugar?

::: spiel frage
titel: Jogo: Que lugar?
intro: O Ludwig vende bilhetes de cinema. Primeiro a fila, depois o lugar, ambos a partir de 0. Sete rondas.

runde:
    boolean[][] lugares = new boolean[3][5];
    System.out.println(lugares.length);
frage: O que aparece?
- [x] 3
- 5
- 15
> `lugares.length` é o número de filas.

runde:
    boolean[][] lugares = new boolean[3][5];
    System.out.println(lugares[0].length);
frage: O que aparece?
- 3
- [x] 5
- 15
> `lugares[0]` é a fila 0. O seu comprimento é o número de lugares nessa fila.

runde:
    int[][] tabela = new int[4][6];
frage: Quantas posições tem a tabela?
- 10
- [x] 24
- 35
> 4 filas com 6 lugares cada: 4 · 6 = 24.

runde:
    int[][] t = {{1, 2}, {3, 4}};
    System.out.println(t[1][0]);
frage: O que aparece?
- 2
- [x] 3
- 4
> A fila 1 é `{3, 4}`, e o lugar 0 dela é o 3.

runde:
    boolean[][] lugares = new boolean[3][5];
    lugares[3][0] = true;
frage: O que acontece?
- O primeiro lugar da fila 3 fica vendido.
- O primeiro lugar da última fila fica vendido.
- [x] Há um erro, porque as filas são 0, 1 e 2.
> Tal como num array normal, o último índice é um a menos do que o comprimento.

runde:
    int[][] t = {{1, 2, 3}, {4, 5, 6}};
    int soma = 0;
    for (int fila = 0; fila < t.length; fila++) {
        for (int lugar = 0; lugar < t[fila].length; lugar++) {
            soma = soma + t[fila][lugar];
        }
    }
    System.out.println(soma);
frage: O que aparece?
- 6
- 15
- [x] 21
> Os dois ciclos passam pelas seis posições: 1 + 2 + 3 + 4 + 5 + 6 = 21.

runde:
frage: Dois ciclos percorrem a sala `new boolean[3][5]`. Que posição vem logo a seguir a `lugares[0][4]`?
- `lugares[0][5]`
- [x] `lugares[1][0]`
- `lugares[1][4]`
> A fila 0 terminou. O ciclo exterior avança, e o lugar recomeça em 0.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo criar um array 2D e explicar o que significam os dois números. → Um cinema como tabela
- Consigo ler e escrever uma posição com fila e lugar. → Chegar a uma posição
- Consigo distinguir `lugares.length` de `lugares[0].length`. → Chegar a uma posição
- Consigo explicar por que ordem dois ciclos encaixados visitam as posições. → Dois ciclos um dentro do outro
- Consigo criar e percorrer um array bidimensional em Java. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? Quantas posições tem `boolean[][] lugares = new boolean[4][6]`?
→ Um cinema como tabela
- [ ] 10
- [x] 24
- [ ] 46
> 4 filas com 6 lugares cada: 4 · 6 = 24.

? O que está em todas as posições depois de `new boolean[3][5]`?
→ Um cinema como tabela
- [ ] true
- [x] false
- [ ] Nada, as posições estão vazias
> Um array boolean novo é enchido com false. No cinema isso quer dizer: todos os lugares estão livres.

? Dois ciclos encaixados percorrem 3 filas com 5 lugares. Quantas vezes é executado o interior do ciclo **interior**?
→ Dois ciclos um dentro do outro
- [ ] 3 vezes
- [ ] 8 vezes
- [x] 15 vezes
> Para cada uma das 3 filas, o ciclo interior é executado 5 vezes: 3 · 5 = 15.

? Associa o que cada expressão significa no cinema.
→ Chegar a uma posição
= lugares.length -> Número de filas
= lugares[0].length -> Número de lugares da fila 0
= lugares[2][4] -> Fila 2, lugar 4
= lugares[1][0] = true -> O lugar 0 da fila 1 está vendido

? O que dá `lugares.length` para `new boolean[3][5]`?
→ Chegar a uma posição
- [x] 3, o número de filas
- [ ] 5, o número de lugares
- [ ] 15, todos os lugares juntos
:::
