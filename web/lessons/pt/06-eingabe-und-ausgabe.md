---
titel: Entrada e saída
bereich: Fundamentos
kurz: Pedir valores, mostrar resultados e usar o modelo EPS.
---

## Competências que vou adquirir agora

::: kompetenzen
- explicar o modelo EPS
- escrever uma entrada com tipo de dados, nome e pergunta
- juntar texto e variáveis numa saída com +
- calcular primeiro um resultado e guardá-lo numa variável, depois mostrar essa variável, p. ex. `int soma = a + b`, depois `output: soma`
- identificar a entrada, o processamento e a saída numa tarefa
- ler números em Java com o scanner
- escrever comentários com `//` e `/* */` e usá-los para organizar e explicar o meu código
:::

## O modelo EPS

Muitos programas funcionam em três partes:

1. **Entrada:** O programa pede valores, p. ex. dois números.
2. **Processamento:** Faz contas com os valores.
3. **Saída:** Mostra o resultado.

As primeiras letras dão **EPS**. Até agora, os valores estavam fixos no estrutograma. Com uma entrada, pode ser usado um valor diferente de cada vez que o estrutograma é executado.

::: diagramm l06-eva.visustruct
Entrada em cima, processamento ao meio, saída em baixo. Inicia a simulação e experimenta números diferentes.
:::

## Entrada com input:

Uma entrada pede um valor enquanto o estrutograma é executado e guarda-o numa variável. Escreves o **tipo de dados**, o **nome** e uma **pergunta** entre aspas:

```
input: int idade "Quantos anos tens?"
input: double preco "Preço em euros?"
input: String nome "Como te chamas?"
```

No editor escolhes o tipo **Entrada** em cima, numa Instrução. A palavra `input:` já fica à frente, e só escreves `int idade "Quantos anos tens?"`.

> O tipo de dados decide o que pode ser introduzido. Com `int`, a simulação dá erro se alguém escrever 2.5 ou Olá.

## Saída com output:

Uma saída mostra texto e valores. O texto fica entre aspas, as variáveis não. Com `+` **juntas** as partes:

```
output: "Olá " + nome + "!"
output: "Tens " + idade + " anos."
```

Atenção aos espaços dentro das aspas. Sem eles fica tudo colado, e vês `OláInês!` em vez de `Olá Inês!`.

## Exercício: Cumprimento

::: übung l06-begruessung
titel: Cumprimento
auftrag: Pede um nome e cumprimenta a pessoa. Quando se escreve Ada, deve ser mostrado **Olá Ada!**.
test: Ada -> Olá Ada!
test: Rui -> Olá Rui!
braucht: anweisung
tipp: Primeiro vem uma entrada para o nome, depois uma saída que usa o nome.
tipp: O nome é texto, por isso a entrada precisa do tipo `String`. Na saída juntas `"Olá "`, a variável e `"!"` com `+`.
lösung: l06-begruessung-loesung.visustruct
:::

## Cuidado com o + numa saída

Numa saída, o `+` junta **sempre** as partes, mesmo com números. Se `a` for 3 e `b` for 4, então

```
output: a + b
```

não mostra 7, mas **34**. Por isso calcula primeiro numa variável e depois mostra a variável:

```
int soma = a + b
output: "Soma: " + soma
```

Isso também encaixa no modelo EPS: calculas na parte do processamento, não na saída.

## Da tarefa ao estrutograma

Antes de arrastares o primeiro bloco, lê a tarefa com atenção e desmonta-a. A isto chama-se **análise do problema**. Três perguntas ajudam-te:

1. **O que é dado?** Esses valores tornam-se a **entrada**. Pensa também no tipo de dados.
2. **O que procuras?** Isso torna-se a **saída**.
3. **Como chegas do que é dado ao que procuras?** Isso é o **processamento**, muitas vezes uma fórmula.

Um exemplo: *Um bilhete de cinema custa 9 euros. O programa pergunta quantos bilhetes alguém compra e mostra o preço total.*

- Dado: o número de bilhetes → `input: int quantidade "Quantos bilhetes?"`
- Procurado: o preço total → `output: "Preço total: " + total`
- Caminho: quantidade vezes 9 → `int total = quantidade * 9`

Agora só tens de pôr as três partes umas por cima das outras, pela ordem E, P, S.

> Procura palavras-sinal na tarefa: *pergunta*, *lê* ou *introduz* apontam para uma entrada. *Mostra*, *escreve* ou *indica* apontam para uma saída.

## Exercício: Calculadora

::: übung l06-rechner
titel: Soma e produto
auftrag: Pede dois números inteiros. Depois mostra a soma e o produto deles, cada um na sua linha.
Com 3 e 4 fica assim: `Soma: 7` e `Produto: 12`.
test: 3, 4 -> Soma: 7 | Produto: 12
test: 10, -2 -> Soma: 8 | Produto: -20
test: 0, 5 -> Soma: 5 | Produto: 0
braucht: anweisung
tipp: Planeia a ordem: primeiro ler os dois números, depois calcular, depois mostrar.
tipp: Precisas de duas entradas, duas instruções para calcular e duas saídas. Calcula a soma numa variável própria, senão o `+` junta os números.
lösung: l06-rechner-loesung.visustruct
:::

## Exercício: Média

::: übung l06-mittelwert
titel: Média
auftrag: Pede dois números, que também podem ser números decimais. Mostra a média deles, ou seja, para 2 e 3 é `Média: 2.5`.
test: 2, 3 -> Média: 2.5
test: 4, 6 -> Média: 5.0
test: 1.5, 2 -> Média: 1.75
braucht: anweisung
tipp: A média de dois números obtém-se somando-os e dividindo o resultado ao meio.
tipp: Para números decimais usas o tipo `double`. A média é a soma a dividir por 2. Não te esqueças dos parênteses: `(x + y) / 2`.
lösung: l06-mittelwert-loesung.visustruct
:::

## Agora em Java

O exemplo EPS do início fica assim em Java:

```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Primeiro número?");
int a = scanner.nextInt();
System.out.println("Segundo número?");
int b = scanner.nextInt();
int soma = a + b;
System.out.println("Soma: " + soma);
```

- Para entradas, o Java precisa de um **Scanner**. Escreves as duas primeiras linhas uma vez lá em cima e depois podes ler quantas vezes quiseres.
- `scanner.nextInt()` lê um número inteiro, `scanner.nextDouble()` um número decimal e `scanner.next()` uma palavra.
- A pergunta ao utilizador é uma saída normal logo antes. O VisuStruct junta as duas linhas num bloco de entrada.

::: angeberwissen
O Java foi pensado para controlar pequenos aparelhos, e ainda o faz: em muitos cartões SIM de telemóvel e cartões bancários corre uma mini versão chamada **Java Card**. É bem possível que tenhas Java no bolso neste momento.
:::

::: übung l06-java-tage
titel: Idade em dias
code: java
auftrag: Escreve um programa em Java que pergunta a idade em anos e mostra quantos dias são, mais ou menos. Conta 365 dias por ano. Para 2 anos aparece **São cerca de 730 dias.**
test: 2 -> São cerca de 730 dias.
test: 10 -> São cerca de 3650 dias.
test: 1 -> São cerca de 365 dias.
braucht: anweisung
tipp: Primeiro as duas linhas do scanner, depois a pergunta e a entrada, depois o cálculo, depois a saída.
tipp: `int anos = scanner.nextInt();` lê. `int dias = anos * 365;` calcula, e `System.out.println("São cerca de " + dias + " dias.");` mostra.
lösung: l06-java-tage-loesung.visustruct
:::

## Comentários no código

Podes escrever notas no teu código. Chamam-se **comentários** (em inglês *comments*). O Java salta-os ao executar, por isso o programa e o estrutograma ficam iguais. Há dois tipos:

- `//` transforma o resto da linha num comentário. É um **comentário de uma linha**.
- `/*` começa um **comentário de várias linhas** e `*/` termina-o. Tudo o que está entre os dois faz parte do comentário, seja quantas linhas forem. O Java não precisa dos asteriscos no início das linhas do meio, só ficam arrumados.

Em programas acabados às vezes também vês `/** … */` com dois asteriscos no início. É um **comentário Javadoc**, a partir do qual o Java consegue criar uma descrição do programa. Para ti, chegam `//` e `/* */`.

O exemplo EPS com comentários fica assim:

```java editor
/*
 * Tarefa: O programa pede dois números
 * e mostra a sua soma.
 */
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

// Entrada
System.out.println("Primeiro número?");
int a = scanner.nextInt();
System.out.println("Segundo número?");
int b = scanner.nextInt();

// Processamento
int soma = a + b;      // somar os dois números

// Saída
System.out.println("Soma: " + soma);      // com 3 e 4 espero: Soma: 7

// Da próxima vez: permitir também números decimais
```

Para que servem os comentários:

- **A tarefa:** o comentário de várias linhas lá em cima diz o que o programa deve fazer.
- **Organização:** `// Entrada`, `// Processamento` e `// Saída` dividem o código segundo o modelo EPS.
- **Explicação:** um comentário depois de uma linha diz o que o teu algoritmo faz ali.
- **Expectativa:** escreve que saída esperas. Ao testar, comparas.
- **Associar chavetas:** mais tarde vais ter blocos entre chavetas `{ }`. Aí, p. ex. `} // fim do for` mostra que chaveta fecha o quê.
- **Guardar ideias:** de que te tens de lembrar quando continuares da próxima vez?

Clica em **Abrir no editor**, muda um comentário ou acrescenta um novo. O estrutograma fica igual e o VisuStruct guarda os teus comentários.

> Não escrevas um comentário depois de cada linha. Explica o que o teu algoritmo faz e porquê, não cada carácter.

::: angeberwissen
Os dois tipos são muito mais antigos do que o Java: `/* … */` vem da linguagem PL/I, de 1964, e `//` da BCPL, de 1967. O Java herdou-os através do C e do C++.
:::

## Preenche os espaços: comentários

::: lückentext
titel: Completar os comentários
auftrag: Completa os caracteres para que lá em cima fique um comentário de várias linhas com a tarefa e as outras duas notas sejam comentários de uma linha.
```java
[[/*]]
 * Tarefa: O programa converte euros em cêntimos.
 [[*/]]
int euros = 3;
[[//]] Processamento
int centimos = euros * 100;
[[//]] Saída, esperado: 300
System.out.println(centimos);
```
erklärung: `/*` abre o comentário de várias linhas e `*/` fecha-o. `//` só vale até ao fim da linha, por isso cada nota precisa do seu próprio `//`.
:::

## Preenche os espaços: entrada

::: lückentext
titel: Ler um nome e uma idade
auftrag: Preenche as palavras que faltam para que o programa leia um nome e uma idade.
```java
import java.util.[[Scanner]];
Scanner scanner = [[new]] Scanner(System.[[in]]);

System.out.println("Como te chamas?");
[[String]] nome = scanner.[[next]]();
System.out.println("Que idade tens?");
int idade = scanner.[[nextInt]]();
System.out.println("Olá " + nome + ", para o ano vais ter " + [[(idade + 1)]] + " anos.");
```
erklärung: `scanner.next()` lê uma palavra, `scanner.nextInt()` um número inteiro. Os parênteses à volta de `idade + 1` são importantes: sem eles, o Java junta primeiro `idade` e depois `1` ao texto, e 14 passaria a **141**.
:::

## Encontra o erro: soma

::: übung l06-java-fehler
titel: Corrigir a soma
code: java
auftrag: O programa lê dois números e deve mostrar a soma. Mas com 3 e 4 aparece **Soma: 34** em vez de **Soma: 7**.
  “Abrir no editor” mostra o código na área Código. Encontra o erro, corrige-o e carrega em Verificar.
start: l06-java-fehler-start.visustruct
test: 3, 4 -> Soma: 7
test: 10, 5 -> Soma: 15
test: 0, 9 -> Soma: 9
braucht: anweisung
tipp: Lê a saída da esquerda para a direita: o que dá `"Soma: " + a`? E o que acontece quando ainda vem `+ b` a seguir?
tipp: Põe parênteses para o Java calcular primeiro: `System.out.println("Soma: " + (a + b));`
lösung: l06-java-fehler-loesung.visustruct
:::

## Jogo: O que aparece?

::: spiel frage
titel: Jogo: O que aparece?
intro: O Ludwig construiu entradas e saídas. Diz antes o que acontece. Sete rondas.

runde:
    int a = 3
    int b = 4
    output: a + b
frage: O que aparece?
- 7
- [x] 34
- a + b
> Numa saída, o `+` junta sempre as partes, mesmo números.

runde:
    int a = 3
    int b = 4
    int soma = a + b
    output: "Soma: " + soma
frage: O que aparece?
- [x] Soma: 7
- Soma: 34
- Soma: soma
> O cálculo acontece antes, numa variável. A saída só junta o texto e o resultado.

runde:
    input: String nome "Como te chamas?"
    output: "Olá" + nome + "!"
frage: Escreves Mia. O que aparece?
- Olá Mia!
- [x] OláMia!
- Olá nome!
> O texto `"Olá"` não tem espaço no fim. Por isso fica tudo colado.

runde:
    input: int idade "Quantos anos tens?"
frage: Escreves 2.5. O que acontece?
- idade fica 2.
- idade fica 2.5.
- [x] A simulação mostra um erro.
> O tipo de dados `int` só aceita números inteiros.

runde:
    input: double preco "Preço em euros?"
frage: A que parte do modelo EPS pertence este bloco?
- [x] Entrada
- Processamento
- Saída
> `input:` pede um valor. Isso é a entrada.

runde:
    double media = (a + b) / 2.0
frage: A que parte do modelo EPS pertence este bloco?
- Entrada
- [x] Processamento
- Saída
> Aqui calcula-se alguma coisa. Isso é o processamento.

runde:
    output: "Média: " + media
frage: A que parte do modelo EPS pertence este bloco?
- Entrada
- Processamento
- [x] Saída
> `output:` mostra o resultado. Isso é a saída.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo explicar o modelo EPS. → O modelo EPS
- Consigo escrever uma entrada com tipo de dados, nome e pergunta. → Entrada com input:
- Consigo juntar texto e variáveis numa saída com +. → Cuidado com o + numa saída
- Consigo calcular primeiro um resultado e guardá-lo numa variável, depois mostrar essa variável, p. ex. `int soma = a + b`, depois `output: soma`. → Cuidado com o + numa saída
- Consigo identificar a entrada, o processamento e a saída numa tarefa. → Da tarefa ao estrutograma
- Consigo ler números em Java com o scanner. → Agora em Java
- Consigo escrever comentários com `//` e `/* */` e usá-los para organizar e explicar o meu código. → Comentários no código
:::

## Teste de conhecimentos

::: quiz
? O que quer dizer EPS?
→ O modelo EPS
- [x] Entrada, processamento, saída
- [ ] Entrada, programa, sequência
- [ ] Editar, partilhar, sair
> Muitos programas pedem primeiro valores, processam-nos e depois mostram o resultado.

? As variáveis a e b têm os valores 3 e 4. O que mostra `output: a + b`?
→ Cuidado com o + numa saída
- [ ] 7
- [x] 34
- [ ] a + b
> Numa saída, o + junta as partes. Calcula primeiro a soma numa variável.

? Que entrada serve se for introduzido um preço como 4.99?
→ Entrada com input:
- [ ] input: int preco "Preço?"
- [x] input: double preco "Preço?"
- [ ] input: String "Preço?"
> 4.99 é um número decimal, portanto double. Além disso, cada entrada precisa de um nome de variável.

? O que mostra `output: "Idade: " + idade` se idade tiver o valor 12?
→ Cuidado com o + numa saída
- [x] Idade: 12
- [ ] "Idade: " + 12
- [ ] Idade: idade

? Tarefa: *O programa pede o raio de um círculo e mostra o seu perímetro.* Associa cada parte do texto ao seu lugar no modelo EPS.
→ Da tarefa ao estrutograma
= pede o raio -> Entrada
= perímetro = 2 * 3.14 * raio -> Processamento
= mostra o seu perímetro -> Saída
> O raio é dado, o perímetro é o que procuras. A fórmula liga os dois.

? O que lê `scanner.nextInt()`?
→ Agora em Java
- [x] Um número inteiro
- [ ] Um número decimal
- [ ] Uma frase inteira
> Para números decimais há `scanner.nextDouble()`, para uma palavra `scanner.next()`.

? O que faz o Java com um comentário?
→ Comentários no código
- [ ] Mostra-o como texto.
- [x] Salta-o.
- [ ] Indica um erro.
> Os comentários são notas para pessoas. O programa corre exatamente igual com ou sem eles.

? Onde termina um comentário que começa com `/*`?
→ Comentários no código
- [x] Em `*/`
- [ ] No fim da linha
- [ ] Na próxima linha vazia
> Por isso um comentário com `/*` pode ocupar várias linhas. Já um comentário com `//` termina no fim da linha.
:::
