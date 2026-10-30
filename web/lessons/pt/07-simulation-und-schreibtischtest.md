---
titel: Simulação e teste de secretária
bereich: Fundamentos
kurz: Executar um estrutograma passo a passo, segui-lo à mão e encontrar erros.
---

## Competências que vou adquirir agora

::: kompetenzen
- iniciar a simulação, fazer pausa, executar passos individuais e pará-la
- ler as variáveis, a saída e o último passo durante a simulação
- fazer um teste de secretária à mão, em forma de tabela
- encontrar um erro comparando os valores com o que espero
- acompanhar código Java com Passo a passo e pontos de paragem
:::

## Iniciar a simulação

Antes de chegarem as decisões e os ciclos, vais conhecer a tua ferramenta mais importante. A partir de agora podes usar a simulação para verificar sozinho cada exercício.

Com o botão [▶︎ Iniciar simulação](#zeige-simulation) à direita nas ferramentas, o VisuStruct executa o teu estrutograma. Enquanto a simulação está a correr, não podes editar o diagrama. O mesmo botão chama-se então **■ Terminar simulação** e leva-te de volta à edição.

À direita aparecem os **Controlos**:

- **Reproduzir** executa o diagrama automaticamente, passo a passo. Quanto tempo espera entre dois passos defines em **Pausa por passo**.
- **Pausa** para por um momento. Depois continuas com Reproduzir ou Passo.
- **Passo** executa exatamente um passo. Assim podes observar com calma.
- **Parar** cancela e põe tudo de volta ao início.

Abre o diagrama seguinte no editor e percorre-o com **Passo**:

::: diagramm sim-tausch.visustruct
Os valores de a e b são trocados. A variável aux guarda um dos valores entretanto.
:::

## O que a simulação mostra

- **Destaque:** Um bloco do diagrama fica colorido. Com **Último passo** é o bloco que acabou de ser executado. Com **Próximo passo** é o bloco que vem a seguir.
- **Entrada:** Se o diagrama pedir um valor, escreves aqui e confirmas com **OK**.
- **Último passo:** Aqui vês o que acabou de acontecer, p. ex. `a = 5 -> 5` depois do bloco `a = b`. À esquerda, as variáveis já foram substituídas pelos seus valores; à direita da seta está o resultado.
- **Variáveis:** Todas as variáveis com os seus valores atuais.
- **Saída:** Tudo o que foi mostrado com `output:`.

Se a área [Código](#zeige-codelive) estiver aberta à direita, a [consola](#zeige-konsole) também acompanha lá. É limpa no início e depois mostra as saídas e entradas tal como apareceriam no programa real.

No fim aparece **Simulação terminada.** Se algo correr mal, a simulação para no bloco com erro e mostra uma mensagem, p. ex. **Variável desconhecida: total**.

## O teste de secretária

Num **teste de secretária** és tu o computador. Percorres o estrutograma com papel e caneta e anotas os valores das variáveis depois de cada passo. O melhor é fazer uma tabela: uma coluna para o passo, uma para cada variável e uma para a saída.

Para o diagrama de cima, a tabela fica assim:

| Passo | a | b | aux | Saída |
|---|---|---|---|---|
| `int a = 3` | 3 | – | – | |
| `int b = 5` | 3 | 5 | – | |
| `int aux = a` | 3 | 5 | 3 | |
| `a = b` | 5 | 5 | 3 | |
| `b = aux` | 5 | 3 | 3 | |
| `output: "a = " + a` | 5 | 3 | 3 | a = 5 |
| `output: "b = " + b` | 5 | 3 | 3 | b = 3 |

Depois compara a tua tabela com a simulação. Os valores em **Variáveis** coincidem com a tua linha depois de cada passo?

> Um teste de secretária é especialmente útil nos testes escritos. Aí não tens computador, mas mesmo assim podes mostrar o que o teu estrutograma faz.

## Encontrar erros

Se um estrutograma mostrar algo errado, faz assim:

1. **Escreve o que esperas:** O que deve sair para uma determinada entrada?
2. **Executa passo a passo:** Inicia a simulação com **Passo** e observa as variáveis.
3. **Encontra o sítio:** Onde é que um valor fica pela primeira vez diferente do que esperavas? É exatamente aí que está o erro.

Erros frequentes numa sequência são:

- A **ordem** está errada: uma variável é usada antes de ter um valor.
- Um valor é **escrito por cima** antes de ser preciso.
- Faltam **parênteses**: `a + b / 2` não é o mesmo que `(a + b) / 2`.
- São divididos dois números inteiros: `7 / 2` dá `3`, porque com `int` tudo o que vem depois da vírgula desaparece.

> Mais tarde chegam as decisões e os ciclos. Aí a simulação também te mostra que ramo é seguido e quantas vezes um ciclo é executado.

::: angeberwissen
A 9 de setembro de 1947, a equipa de Grace Hopper encontrou uma traça verdadeira presa entre dois contactos do computador Harvard Mark II. Colaram-na no diário de bordo e escreveram: “Primeiro caso real de um bug encontrado.” Hoje a traça está num museu em Washington.
:::

## Exercício: Corrigir a troca

::: übung sim-tausch
titel: Corrigir a troca
auftrag: O estrutograma deve ler dois números e mostrá-los trocados. Ou seja, com 3 e 5 deve aparecer primeiro **5** e depois **3**. Mas mostra 5 duas vezes.
  Faz um teste de secretária ou usa **Passo** e corrige o erro.
start: sim-tausch-start.visustruct
test: 3, 5 -> 5 | 3
test: 1, 2 -> 2 | 1
test: 7, 7 -> 7 | 7
braucht: anweisung
tipp: Percorre o diagrama com **Passo** e anota os valores de a e b depois de cada passo. Onde é que o 3 desaparece?
tipp: Olha para a depois do passo `a = b`. Para onde foi o valor antigo de a? Guarda-o primeiro numa variável auxiliar, como no exemplo de cima.
lösung: sim-tausch-loesung.visustruct
:::

## Exercício: Corrigir os bilhetes de cinema

::: übung sim-kino
titel: Corrigir os bilhetes de cinema
auftrag: Um bilhete de cinema custa 8.50 euros. O estrutograma deve pedir o número de bilhetes e mostrar o preço total, ou seja, para 2 bilhetes `Total: 17.0`.
  Inicia a simulação. Ela para com uma mensagem de erro. Descobre porquê e corrige o estrutograma.
start: sim-kino-start.visustruct
test: 2 -> Total: 17.0
test: 3 -> Total: 25.5
test: 0 -> Total: 0.0
braucht: anweisung
tipp: Lê com atenção a mensagem de erro da simulação. Que variável é que ela ainda não conhece?
tipp: A simulação executa os blocos de cima para baixo. O total já tem um valor quando chega a saída? Podes mover os blocos com o rato.
lösung: sim-kino-loesung.visustruct
:::

> Se uma simulação nunca mais acabar, clica em **Parar**. Quando **Verificas** um exercício, o VisuStruct para sozinho depois de um número muito grande de passos.

## Agora em Java

Também podes executar código Java passo a passo. Na área [Código](#zeige-codelive), a ferramenta para isso chama-se **depurador** (debugger):

- Clica num número de linha à esquerda. Aparece um ponto vermelho: é um **ponto de paragem**. [▶︎ Executar](#zeige-ausfuehren) para antes dessa linha.
- O botão [Passo a passo](#zeige-einzelschritt) executa exatamente uma linha, como **Passo** na simulação.
- Por baixo do código vês o valor atual de cada variável. É o teu teste de secretária, só que é o computador que escreve.

::: übung l07-java-pizza
titel: Corrigir a encomenda de pizzas
code: java
auftrag: Uma pizza custa 8 euros, o queijo extra 2 euros. Para 3 pizzas com queijo extra, o programa deve mostrar **Total: 30**. Mas mostra 14.
  Percorre o código Java com Passo a passo e observa `total`. Encontra o erro e corrige-o no código.
start: l07-java-pizza-start.visustruct
test: - -> Total: 30
braucht: anweisung
tipp: Que valor está em `total` depois da quarta linha? Faz as contas de cabeça: o que é que o Java calcula primeiro?
tipp: Como na matemática, a multiplicação vem antes da soma: `preco + queijo * quantidade` é `8 + 6`. Põe parênteses: `(preco + queijo) * quantidade`.
lösung: l07-java-pizza-loesung.visustruct
:::

## Preenche os espaços: teste de secretária

::: lückentext
titel: O que está nas variáveis?
auftrag: Faz um teste de secretária de cabeça. Escreve depois de cada linha o valor que a variável tem a seguir e, na última linha, o que é mostrado.
```java
int a = 5;
int b = 2;
a = a + b;      // a vale agora [[7]]
b = a * 2;      // b vale agora [[14]]
a = b - a;      // a vale agora [[7]]
System.out.println(a + b);      // saída: [[21]]
```
erklärung: Cada linha calcula com os valores que estão nesse momento nas variáveis: a = 5 + 2 = 7, b = 7 · 2 = 14, a = 14 − 7 = 7, saída 7 + 14 = 21. Podes confirmar com Passo a passo na área Código.
:::

## Encontra o erro: pontuação

::: übung l07-java-fehler
titel: Corrigir a pontuação
code: java
auftrag: Num jogo, o Ludwig ganha primeiro 10 pontos, depois 5 pontos e depois perde 3 pontos. No fim deve aparecer **Pontos: 12**. Mas aparece **Pontos: 3**.
  Percorre o código com Passo a passo e observa `pontos`. Corrige a linha errada e carrega em Verificar.
start: l07-java-fehler-start.visustruct
test: - -> Pontos: 12
braucht: anweisung
tipp: Depois de que linha é que `pontos` passa de repente a valer 3? O que devia acontecer nessa linha?
tipp: O Ludwig perde 3 pontos, por isso tira-se 3 ao valor antigo: `pontos = pontos - 3;`
lösung: l07-java-fehler-loesung.visustruct
:::

## Jogo: Desativar a bomba

::: spiel bombe
titel: Jogo: Desativar a bomba
intro: Cada programa tem **exatamente um erro**, e a bomba está a fazer tique-taque. Faz o teste de secretária de cabeça e toca na linha errada antes de o tempo acabar. Os programas estão em Java, mas cada linha é um bloco como no estrutograma. Seis rondas, 30 segundos cada.
zeit: 30

runde:
    int a = 3;
    int b = 5;
    int aux = a;
    a = b;
    b = a;
frage: Deve trocar os valores de a e b.
fehler: 5
besser: b = aux;
> a já tem o valor de b. O valor antigo de a está em aux.

runde:
    int a = 4;
    int b = 6;
    double media = a + b / 2;
    System.out.println(media);
frage: Deve mostrar a média 5.0.
fehler: 3
besser: double media = (a + b) / 2.0;
> Sem parênteses, a divisão vem primeiro: 4 + 6 / 2 = 7.

runde:
    int bilhetes = 3;
    double preco = 8.5;
    double total = bilhetes + preco;
    System.out.println("Total: " + total);
frage: Deve mostrar o preço de 3 bilhetes de cinema a 8,50 € cada.
fehler: 3
besser: double total = bilhetes * preco;
> Para o preço total multiplica-se, não se soma.

runde:
    int minutos = 135;
    int horas = minutos / 60;
    int resto = minutos / 60;
    System.out.println(horas + " h " + resto + " min");
frage: Deve mostrar 2 h 15 min.
fehler: 3
besser: int resto = minutos % 60;
> `%` dá o resto de uma divisão. Com `/`, resto também ficava com 2.

runde:
    String nome = "Ada";
    System.out.println("Olá " + "nome" + "!");
frage: Deve mostrar "Olá Ada!".
fehler: 2
besser: System.out.println("Olá " + nome + "!");
> Entre aspas, nome é só um texto. A variável não tem aspas.

runde:
    double preco = 100;
    preco = preco * 0.1;
    System.out.println(preco);
frage: Deve aumentar o preço em 10 %, ou seja, mostrar 110.0.
fehler: 2
besser: preco = preco + preco * 0.1;
> Vezes 0.1 dá só os 10 %, ou seja, 10.0. Isso ainda tem de ser somado ao preço antigo.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo iniciar a simulação, fazer pausa, executar passos individuais e pará-la. → Iniciar a simulação
- Consigo ler as variáveis, a saída e o último passo durante a simulação. → O que a simulação mostra
- Consigo fazer um teste de secretária à mão, em forma de tabela. → O teste de secretária
- Consigo encontrar um erro comparando os valores com o que espero. → Encontrar erros
- Consigo acompanhar código Java com Passo a passo e pontos de paragem. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? Que botão executa exatamente um passo?
→ Iniciar a simulação
- [ ] Reproduzir
- [x] Passo
- [ ] Parar
> Reproduzir continua automaticamente, Passo executa só um passo.

? O que anotas depois de cada passo num teste de secretária?
→ O teste de secretária
- [ ] Só a saída no fim
- [x] Os valores atuais de todas as variáveis
- [ ] O código Java gerado
> Assim vês exatamente onde um valor é diferente do que esperavas.

? Primeiro `int a = 3`, depois `int b = 5`, depois `a = b`. Que valores têm a e b a seguir?
→ O teste de secretária
- [ ] a = 5 e b = 3
- [x] a = 5 e b = 5
- [ ] a = 3 e b = 5
> O valor antigo de a foi escrito por cima. É por isso que precisas de uma variável auxiliar para trocar valores.

? O campo Último passo mostra `preco = 4 * 2.5 -> 10.0`. O que quer isso dizer?
→ O que a simulação mostra
- [ ] A variável preco tem agora o valor 4.
- [x] Foi calculado 4 * 2.5 e o resultado 10.0 foi guardado em preco.
- [ ] A simulação encontrou um erro.

? A simulação indica **Variável desconhecida: soma**. Qual é uma razão provável?
→ Encontrar erros
- [x] soma é usada antes de lhe ter sido dado um valor.
- [ ] soma é demasiado grande.
- [ ] O estrutograma tem demasiados blocos.

? O que faz um ponto vermelho antes de um número de linha na área Código?
→ Agora em Java
- [ ] Marca um erro.
- [x] O programa para antes dessa linha.
- [ ] A linha é saltada.
> É um ponto de paragem. Continuas com ▶︎ ou com Passo a passo.
:::
