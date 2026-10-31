---
titel: Sequência
bereich: Fundamentos
kurz: Executar passos um a seguir ao outro, prestar atenção à ordem e trocar valores.
---

## Competências que vou adquirir agora

::: kompetenzen
- explicar que uma sequência é executada de cima para baixo
- explicar porque é que a ordem dos passos conta
- trocar dois valores com uma variável auxiliar
- escrever uma sequência em Java
:::

## Passo a passo

Uma **sequência** é uma série de passos que são executados exatamente uma vez e exatamente por esta ordem. No estrutograma, os blocos ficam simplesmente uns por cima dos outros.

Cada bloco só começa quando o bloco de cima terminou. Nada é saltado e nada é repetido.

::: diagramm l05-sequenz.visustruct
Uma sequência de quatro blocos: primeiro `comprimento` e `largura` recebem os seus valores, depois a área é calculada e, no fim, é apresentada. Cada bloco é executado exatamente uma vez, de cima para baixo. Saída: 15.
:::

> A sequência é o mais simples dos três blocos básicos. Quase todos os estrutogramas são feitos sobretudo de sequências.

## A ordem conta

Quando fazes chá, notas logo se a ordem estiver errada. Com contas é igual, só que é mais difícil de ver.

::: diagramm l04-rechnen.visustruct
Primeiro duplicar, depois somar 1: o resultado é 7. Se trocares os dois blocos do meio, dá 8.
:::

A instrução `numero = numero * 2` quer dizer: pega no valor de `numero`, multiplica-o por 2 e volta a guardar o resultado em `numero`. Por isso, o que está em `numero` depende do que aconteceu antes.

::: angeberwissen
Os estrutogramas não são só coisa da escola. Segundo Shneiderman, empresas como a IBM e a Siemens também planeavam os seus programas com eles. Ou seja, aqui estás a aprender coisas de profissionais. Mééé-ravilha!
:::

## Exercício: Pôr por ordem

::: übung l04-reihenfolge
titel: Pôr por ordem
auftrag: O diagrama inicial tem os blocos certos, mas pela ordem errada. Move-os de modo que no fim seja mostrado **20**.
start: l04-reihenfolge-start.visustruct
test: - -> 20
braucht: anweisung
tipp: Lê cada bloco e pergunta-te: de que variável precisa, e onde é que essa variável recebe o seu valor?
tipp: Uma variável tem de ser criada antes de fazeres contas com ela. A saída vem mesmo no fim. Confirma de cabeça: (2 + 3) · 4 = 20.
lösung: l04-reihenfolge-loesung.visustruct
:::

## Trocar dois valores

Imagina dois copos: um com sumo, outro com água. Se quiseres trocar o que está lá dentro, precisas de um terceiro copo, vazio.

Com variáveis é exatamente igual. Se escreveres simplesmente `a = b` e depois `b = a`, o valor antigo de `a` já se perdeu. No fim, as duas variáveis têm o mesmo valor.

A solução é uma **variável auxiliar** que guarda o valor antigo durante pouco tempo:

::: grafik l05-tauschen.svg
Três passos com um copo vazio: primeiro o sumo para aux, depois a água para a esquerda, depois o sumo de aux para a direita.
:::

::: diagramm l04-tauschen.visustruct
Primeiro guarda-se a em aux. Depois a recebe o valor de b, e b recebe o valor guardado em aux.
:::

## Exercício: Trocar copos

::: übung l04-glaeser-tauschen
titel: Trocar copos
auftrag: O copo da esquerda tem sumo, o da direita tem água. Troca o conteúdo das variáveis `esquerda` e `direita` antes de serem mostradas.
Não alteres os dois primeiros blocos. Insere novas instruções entre eles.
start: l04-tauschen-start.visustruct
test: - -> Esquerda: água | Direita: sumo
braucht: anweisung
tipp: Como trocas dois copos cheios na vida real? Precisas de um terceiro copo, vazio.
tipp: Cria uma variável auxiliar com `String aux = esquerda`. Depois disso precisas de mais duas atribuições.
lösung: l04-tauschen-loesung.visustruct
:::

## Agora em Java

Tal como na lição 4, também podes escrever uma sequência diretamente em Java. A troca de cima fica assim:

```java editor
int a = 5;
int b = 9;
int aux = a;
a = b;
b = aux;
System.out.println("a = " + a);
System.out.println("b = " + b);
```

- Cada bloco passa a ser uma linha. As linhas correm de cima para baixo, tal como os blocos.
- No fim de cada instrução há um **ponto e vírgula** `;`.
- Uma saída chama-se `System.out.println(…)` em Java. Atenção ao S maiúsculo de `System`: o Java distingue maiúsculas de minúsculas.

Escreves Java na área [Código](#zeige-codelive), à direita do estrutograma. Enquanto escreves, o VisuStruct constrói o estrutograma ao mesmo tempo. Assim vês logo que bloco pertence a que linha.

::: übung l05-java-kino
titel: Bilhetes de cinema em Java
code: java
auftrag: Um bilhete de cinema custa 9 euros. Escreve um programa em Java que calcula o preço de 3 bilhetes e mostra **Total: 27**.
  “Abrir no editor” abre também a área Código à direita. Escreve lá o teu código; o estrutograma constrói-se sozinho. Depois clica em Verificar.
test: - -> Total: 27
braucht: anweisung
tipp: Precisas de três variáveis: o preço, a quantidade e o resultado. Cada linha termina com ponto e vírgula.
tipp: `int preco = 9;` e `int quantidade = 3;` criam as variáveis. `int total = preco * quantidade;` calcula, e `System.out.println("Total: " + total);` mostra o resultado.
lösung: l05-java-kino-loesung.visustruct
:::

## Preenche os espaços: trocar os copos

::: lückentext
titel: Trocar dois valores
auftrag: Os valores de `a` e `b` devem ser trocados. Preenche as palavras que faltam.
```java
int a = 3;
int b = 8;
[[int]] aux = [[a]];
a = [[b]];
b = [[aux]];
System.out.println("a = " + a + ", b = " + b);
```
erklärung: Primeiro guardas `a` na variável auxiliar, depois `a` recebe o valor de `b` e, por fim, `b` recebe o valor guardado. Saída: **a = 8, b = 3**
:::

## Encontra o erro: saldo

::: übung l05-java-fehler
titel: Corrigir o saldo
code: java
auftrag: O cartão da cantina tem 20 euros. Uma refeição custa 7 euros. O programa deve mostrar o saldo **depois** de pagar, ou seja, **Resta: 13**. Mas mostra **Resta: 20**.
  “Abrir no editor” mostra o código na área Código. Encontra o erro, corrige-o e carrega em Verificar.
start: l05-java-fehler-start.visustruct
test: - -> Resta: 13
braucht: anweisung
tipp: Todas as linhas estão certas, só a ordem não. Quando é mostrado o saldo e quando se paga?
tipp: Troca as duas últimas linhas: primeiro `saldo = saldo - preco;`, depois a saída.
lösung: l05-java-fehler-loesung.visustruct
:::

## Porque é que não corre?

::: übung l05-java-laeuft-nicht
titel: Dividir uma piza
code: java
auftrag: Uma piza tem 8 fatias e 4 amigos dividem-na. O programa deve mostrar **Cada um recebe 2 fatias.** Mas não corre.
  “Abrir no editor” mostra o código na área Código. Clica em “Executar” e lê a mensagem de erro. Corrige o erro e carrega em Verificar.
start: l05-java-laeuft-nicht-start.visustruct
test: - -> Cada um recebe 2 fatias.
braucht: anweisung
tipp: Compara o nome na saída, letra a letra, com o nome criado na terceira linha.
tipp: A variável chama-se `porPessoa` com P maiúsculo (camelCase). Escreve-a exatamente assim na saída.
lösung: l05-java-laeuft-nicht-loesung.visustruct
:::

## Jogo: Ordenar os blocos

::: spiel reihenfolge
titel: Jogo: Ordenar os blocos
intro: O Ludwig baralhou os blocos. Põe-nos pela ordem certa. Quatro rondas.

runde:
frage: No fim deve aparecer **7**.
- `int numero = 3`
- `numero = numero * 2`
- `numero = numero + 1`
- `output: numero`
> Primeiro duplicar, depois somar 1: 3 · 2 + 1 = 7. Ao contrário dava (3 + 1) · 2 = 8.

runde:
frage: No fim deve aparecer **8**.
- `int numero = 3`
- `numero = numero + 1`
- `numero = numero * 2`
- `output: numero`
> Os mesmos blocos, outra ordem, outro resultado: (3 + 1) · 2 = 8.

runde:
    int a = 3
    int b = 5
frage: a e b devem trocar os seus valores.
- `int aux = a`
- `a = b`
- `b = aux`
- `output: a + " " + b`
> Primeiro guarda-se a em aux. Senão o valor antigo perde-se assim que a recebe o valor de b.

runde:
frage: O Ludwig faz chá.
- Encher a chaleira com água
- Ligar a chaleira
- Esperar até a água ferver
- Deitar a água sobre o saquinho de chá
- Deixar o chá em infusão
> Cada passo precisa do anterior. Tal como num estrutograma.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo explicar que uma sequência é executada de cima para baixo. → Passo a passo
- Consigo explicar porque é que a ordem dos passos conta. → A ordem conta
- Consigo trocar dois valores com uma variável auxiliar. → Trocar dois valores
- Consigo escrever uma sequência em Java. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? Quantas vezes é executado cada bloco de uma sequência?
→ Passo a passo
- [ ] Até uma condição ser falsa
- [x] Exatamente uma vez
- [ ] Nenhuma, se estiver vazio
> Numa sequência nada é repetido e nada é saltado. Para repetir existem os ciclos.

? No início a = 5 e b = 9. Depois é executado `a = b` e a seguir `b = a`. O que está nas variáveis no fim?
→ Trocar dois valores
- [ ] a = 9 e b = 5
- [x] a = 9 e b = 9
- [ ] a = 5 e b = 5
> Depois de `a = b`, o valor antigo 5 perdeu-se. `b = a` só copia o 9 de volta.

? Porque precisas de uma variável auxiliar para trocar valores?
→ Trocar dois valores
- [x] Para um valor não ser escrito por cima antes de ser preciso
- [ ] Para o estrutograma ficar mais comprido
- [ ] Porque senão não se podem mostrar variáveis

? O que mostra a sequência `int x = 4`, `x = x + 1`, `x = x * 3`, `output: x`?
→ A ordem conta
- [ ] 13
- [x] 15
- [ ] 4
> Primeiro x passa a 5, depois a 15.

? Com que termina cada instrução em Java?
→ Agora em Java
- [ ] Com um ponto .
- [x] Com um ponto e vírgula ;
- [ ] Com dois pontos :
> Se faltar o ponto e vírgula, o VisuStruct mostra uma indicação por baixo do código.
:::
