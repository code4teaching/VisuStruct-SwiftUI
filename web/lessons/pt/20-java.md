---
titel: Estrutograma e código
bereich: Do estrutograma ao código
kurz: Todos os elementos em Java num relance, gerar código, escrever Java na área Código, executá-lo e procurar erros.
---

## Competências que vou adquirir agora

::: kompetenzen
- abrir a vista de código e escolher Java como linguagem
- reconhecer em Java a saída, a entrada, as decisões e os ciclos
- explicar a diferença entre Excerto e Classe
- explicar como o código Java corre em qualquer sistema operativo com o compilador, o bytecode e a JVM
- distinguir o JDK do JRE
- explicar porque é que um programa em C++ tem de ser compilado de novo para cada sistema operativo e um programa Java não
- reconstruir um programa Java curto como estrutograma
- escrever Java na área Código e ler o estrutograma que é construído
- executar um programa com ▶︎ e usar entradas e saídas na consola
- encontrar um erro de sintaxe ou de execução pelo número de linha vermelho
- pôr pontos de paragem e seguir um programa passo a passo
:::

## A vista de código

Nas lições 4 a 19 já escreveste cada elemento em Java. Aqui vês tudo num relance e aprendes como o VisuStruct transforma um estrutograma inteiro num programa Java.

Um estrutograma descreve um processo. Para um computador o executar, precisas de um programa numa linguagem de programação. O VisuStruct escreve esse código por ti.

Clica em [Código](#zeige-code) nas ferramentas (ícone com parênteses angulares). À direita aparece o **Gerador de código**:

- Em cima escolhes a linguagem: **Java**, **Python** ou **JavaScript**.
- Para Java escolhes ainda em **Saída Java** entre **Excerto** (só as instruções) e **Classe** (um ficheiro Java completo).
- **Texto do diagrama como comentários** escreve o texto de cada bloco como comentário por cima do código.
- **Copiar** põe o código na área de transferência, **Guardar Java…** guarda um ficheiro `.java`.

O código muda logo sempre que alteras alguma coisa no estrutograma.

::: angeberwissen
Mais tarde, Nassi trabalhou na linguagem de programação Ada e foi responsável pelo software na Apple. Portanto, quem inventa estrutogramas não acaba num curral de cabras, acaba na Apple.
:::

::: diagramm l17-beispiel.visustruct
Um pequeno programa com uma entrada, um ciclo for e uma decisão. Abre-o e olha para o código Java correspondente.
:::

## O exemplo em Java

Para o diagrama de cima, o VisuStruct gera este código como **Excerto**:

```
// import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Que tabuada?");
int numero = scanner.nextInt();
for (int i = 1; i <= 3; i++) {
    int resultado = numero * i;
    System.out.println(i + " vezes " + numero + " = " + resultado);
}
if (numero > 10) {
    System.out.println("Esta foi difícil!");
} else {
    System.out.println("Esta foi fácil.");
}
```

Em Java, cada instrução termina com um **ponto e vírgula** `;`. O que está dentro de um bloco fica entre **chavetas** `{ }` em Java. A indentação mostra-te o que pertence ao quê.

## Os elementos em Java

| Elemento | Java | Lição |
|---|---|---|
| Instrução | `int soma = 0;` | 4, 5 |
| Saída | `System.out.println(soma);` | 6 |
| Entrada | `int numero = scanner.nextInt();` | 6 |
| Decisão | `if (condição) { … } else { … }` | 8, 9 |
| Seleção | `switch (valor) { case 1 -> { … } default -> { … } }` | 10 |
| Ciclo while | `while (condição) { … }` | 11 |
| Ciclo do-while | `do { … } while (condição);` | 12 |
| Ciclo for | `for (int i = 0; i < 5; i++) { … }` | 13 |
| Ciclo infinito | `while (true) { … }` | 11, 18 |
| Interrupção | `break;` | 18 |
| Chamada | `calcular();` | 18 |
| Array | `int[] numeros = new int[5];` | 15, 16 |
| Texto (String) | `String nome = scanner.next();` | 17 |

Para entradas, `import java.util.Scanner;` e `Scanner scanner = new Scanner(System.in);` são escritos uma vez lá em cima. Antes de cada entrada, o VisuStruct mostra a pergunta com `System.out.println(…)`.

Se o ramo false de uma decisão estiver vazio, o VisuStruct gera mesmo assim uma parte `else` que só contém o comentário `// empty element`. Se desligares **Gerar ramo else vazio no código**, a parte `else` vazia desaparece.

## Excerto ou Classe

Podes colar um **Excerto** no método `main` de um programa Java que já exista. Com **Classe** obténs um ficheiro completo que podes compilar e executar logo:

```
import java.util.Scanner;

public class Tabuada {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Que tabuada?");
        int numero = scanner.nextInt();
        ...
    } // fim do main
} // fim da classe
```

Os comentários `// fim do main` e `// fim da classe` depois das duas últimas chavetas não são necessários, mas ajudam muito: vês logo que chaveta fecha o quê e não te esqueces de nenhuma.

O nome da classe vem do **título** do diagrama. O ficheiro tem de ter exatamente o mesmo nome, aqui `Tabuada.java`. O **Guardar Java…** trata disso por ti.

> O código gerado é um bom começo, mas confirma-o. Se primeiro criares uma variável e mais tarde a voltares a ler com uma entrada, o VisuStruct escreve mesmo assim `int pin = scanner.nextInt();`. O Java indica então que `pin` já existe. Basta apagares o `int` nessa linha.

## Como o Java corre em qualquer computador

O teu ficheiro `Tabuada.java` é **código-fonte**: texto para pessoas. O processador do teu computador não o entende diretamente. Por isso, o Java corre em dois passos:

1. O **compilador** `javac` traduz o código-fonte em **bytecode**. O resultado é o ficheiro `Tabuada.class`.
2. A **JVM** (Java Virtual Machine, máquina virtual Java) lê o bytecode e, ao executá-lo, traduz-o em **código máquina**: instruções para o processador do teu computador.

::: grafik l20-jvm.svg
Compilar uma vez: o mesmo bytecode corre em qualquer JVM.
:::

O bytecode existe só uma vez. Já a JVM existe para Windows, macOS, Linux e muitos outros sistemas. Por isso, o mesmo ficheiro `.class` corre em qualquer computador que tenha uma JVM instalada. A isto chama-se **independente da plataforma**. O lema é **“Write once, run anywhere”**: escrever uma vez, executar em qualquer lado.

::: angeberwissen
Um dos primeiros compiladores foi construído em 1952 por **Grace Hopper**, que já conheces da lição 7. Na altura, muitos diziam-lhe que os computadores só sabiam fazer contas e não traduzir programas. Ela fê-lo na mesma.
:::

Compara com o **C++**: aí o compilador traduz o código-fonte diretamente em código máquina para um só processador e um só sistema operativo. O programa pronto só corre aí. Para Windows, macOS e Linux tens de o compilar de novo de cada vez.

::: grafik l20-cpp.svg
O C++ é compilado para código máquina em separado para cada sistema.
:::

| | C++ | Java |
|---|---|---|
| O compilador gera | código máquina | bytecode |
| Quantas vezes compilar? | de novo para cada sistema | uma vez |
| De que precisa o computador para o executar? | de mais nada | de uma JVM |

Isto torna o Java mais lento? Quase nada. As partes do programa que correm muitas vezes, por exemplo ciclos, são traduzidas de uma vez para código máquina pelo **compilador JIT** da JVM (“just in time”, mesmo a tempo). Depois correm quase tão depressa como em C++.

> Imagina a JVM como um pequeno computador feito de software, quase como um sistema operativo só para programas Java. Mas, rigorosamente, não é um sistema operativo, é uma **máquina virtual**: um programa que corre ele próprio no Windows, no macOS ou no Linux e que, lá dentro, faz de conta que é um computador.

Ao instalar o Java, encontras duas siglas:

| Sigla | O que tem lá dentro? | Para quê? |
|---|---|---|
| **JRE** (Java Runtime Environment) | a JVM e blocos prontos como o `Scanner` | executar programas Java |
| **JDK** (Java Development Kit) | o JRE e ainda o compilador `javac` e outras ferramentas | escrever e compilar programas Java |

Para programar precisas, portanto, do JDK. Hoje em dia normalmente só se descarrega o JDK, o JRE vem lá dentro. Para usar o VisuStruct no browser não precisas de instalar nada disto.

::: angeberwissen
Com um JDK podes fazer tudo isto tu próprio na consola, ou seja, no terminal ou na linha de comandos:

```
java -version
javac Tabuada.java
java Tabuada
```

- `java -version` mostra que versão do Java está instalada. Se aparecer uma mensagem de erro, ainda falta o Java.
- `javac Tabuada.java` inicia o compilador. Depois tens dois ficheiros na pasta: o `Tabuada.java` com o teu código-fonte e o novo `Tabuada.class` com o bytecode.
- `java Tabuada` inicia a JVM com o teu bytecode. Aqui escreves o nome da classe sem `.class`.

Se `java -version` funcionar mas `javac -version` não, só tens um JRE instalado. Nesse caso falta-te o JDK.
:::

::: angeberwissen
Todos os ficheiros Java compilados (`.class`) começam com os mesmos quatro bytes, escritos em hexadecimal: `CA FE BA BE`. É assim que o computador reconhece que é Java. Foi James Gosling que inventou este “cafe babe”, a condizer com o café do nome.
:::

## O modo de linguagem Java

Na [roda dentada](#zeige-einstellungen) em cima à direita podes ativar as **Palavras-chave do código**. Então os blocos da área Elementos têm os mesmos nomes que os comandos em Java: `if`, `switch`, `for`, `while`, `do`, `while(true)`, `break` e `call`. O resto da interface fica no teu idioma.

Isto ajuda-te a associar os blocos aos comandos Java. O teu diagrama em si fica igual.

## Escrever Java diretamente

Até agora desenhaste primeiro o estrutograma e depois viste o código. Na área [Código](#zeige-codelive) também funciona ao contrário. Clica na barra estreita **Código** à direita. Ao lado do estrutograma aparece uma coluna onde escreves tu mesmo o Java.

- **Do estrutograma para o código:** Quando alteras alguma coisa no estrutograma, o código Java muda logo.
- **Do código para o estrutograma:** Quando escreves Java, o VisuStruct constrói o estrutograma enquanto escreves. Se ainda faltar alguma coisa, por exemplo uma chaveta de fecho `}`, aparece uma indicação por baixo do código.
- **Sugestões:** Enquanto escreves, o VisuStruct sugere modelos, por exemplo para `if`, `for` ou `while`. Com Enter aceitas um modelo. Substitui simplesmente os marcadores cinzentos pelo teu texto.
- **Indentar:** Se o teu código ficou desarrumado, clica no botão **Indentar** em cima na área Código. Cada nível fica então quatro espaços mais para dentro, como no Eclipse ou no IntelliJ. Se tiveres linhas selecionadas, o VisuStruct só indenta essas.

Assim podes experimentar os dois caminhos. Desenhar primeiro o estrutograma é bom para planear um processo. Escrever o código diretamente é mais rápido quando já sabes o que queres. O estrutograma ajuda-te depois a verificar o teu código.

## Executar o programa

Em cima, na área Código, [▶︎ Executar](#zeige-ausfuehren) inicia o teu programa e **■ Parar** termina-o, por exemplo num ciclo infinito. O que o teu programa mostra aparece em baixo na [consola](#zeige-konsole). Se pedir uma entrada, escreve-a lá e carrega em Enter.

Podes arrastar com o rato a fronteira entre o código e a consola para cima ou para baixo.

Se algo correr mal, o número da linha fica vermelho. Num erro de sintaxe, o sítio também fica sublinhado a vermelho e por baixo lês, por exemplo, **Linha 2: Ainda falta aqui: ;**. Aí o ▶︎ nem sequer arranca o programa. Se o programa parar enquanto corre, é um erro de execução e a consola diz a linha, por exemplo **Linha 3: Divisão por zero.** Os três tipos de erros já os conheces da lição “Simulação e teste de secretária”.

Se o VisuStruct souber exatamente o que falta, aparece um 💡 no fim da linha. Passa o rato por cima para veres a sugestão, por exemplo **Sugestão: inserir import java.util.Scanner;**. Um clique aplica-a. Mesmo assim, lê o que foi inserido, para saberes fazê-lo sozinho da próxima vez.

> A área Código entende os comandos Java que também existem como blocos no estrutograma. Ainda não conhece classes próprias nem objetos. Janelas com Swing funcionam na mesma: liga o **Java verdadeiro (com Swing)** na roda dentada (lição “A tua primeira janela”).

::: angeberwissen
Os profissionais chamam **IDE** (Integrated Development Environment) a um programa onde se escreve código, se executa e se procuram erros. Com a área Código, o VisuStruct é um pequeno IDE com estrutograma incluído.
:::

## Encontrar erros com o depurador

Às vezes um programa corre, mas calcula mal. É um erro de lógica. Aí ajuda o **depurador** (debugger): executa o teu programa devagar e tu vês o que acontece.

- **Ponto de paragem:** Clica num número de linha à esquerda. Aparece um ponto vermelho. [▶︎ Executar](#zeige-ausfuehren) para antes dessa linha. Outro clique tira o ponto.
- **Linha amarela:** É a próxima a ser executada. No estrutograma, o bloco correspondente fica selecionado.
- **Variáveis:** Por baixo do código vês o valor atual de cada variável. O que mudou desde a última paragem acende-se a amarelo por um momento.
- **Passo a passo:** O botão [Passo a passo](#zeige-einzelschritt) ao lado de ▶︎ executa exatamente uma linha e para outra vez. Sem ponto de paragem, inicia o programa e para antes da primeira linha.
- **Continuar:** ▶︎ corre até ao próximo ponto de paragem ou até ao fim. **■ Parar** termina.

Experimenta com este programa. Põe um ponto de paragem na linha 3 e carrega várias vezes em ▶︎. Como crescem `i` e `soma`?

```
int soma = 0;
for (int i = 1; i <= 4; i++) {
    soma = soma + i;
}
System.out.println("Soma: " + soma);
```

::: ludwig
É um teste de secretária, só que o computador toma notas por ti. Antes de cada passo, pensa no valor que a variável devia ter a seguir. Quando a tabela não bate com o que esperavas, encontraste o sítio do erro.
:::

## Exercício: Primeiro o código, depois o estrutograma

Desta vez não desenhas. Abre a área Código e escreve este código Java:

```
System.out.println("Número inicial?");
int zahl = scanner.nextInt();
while (zahl > 0) {
    System.out.println(zahl);
    zahl = zahl - 1;
}
System.out.println("Start!");
```

::: übung l20-countdown
titel: Contagem decrescente
bereich: beide
auftrag: Escreve o código Java acima na área Código. Executa-o com ▶︎ e introduz um número inicial na consola.
  Depois observa o estrutograma que foi construído e clica em Verificar.
test: 3 -> 3 | 2 | 1 | Start!
test: 1 -> 1 | Start!
test: 0 -> Start!
braucht: whileSchleife
tipp: Abre a área Código com a barra estreita mais à direita e começa simplesmente a escrever.
tipp: Atenção ao ponto e vírgula no fim de cada instrução e às chavetas do ciclo while. Por baixo do código aparece uma indicação quando ainda falta alguma coisa.
lösung: l20-countdown-loesung.visustruct
:::

## Exercício: Java como estrutograma

Agora ao contrário: aqui está um pedaço de código Java. Reconstrói-o como estrutograma.

```
System.out.println("Introduz um número");
int n = scanner.nextInt();
int fatorial = 1;
for (int i = 1; i <= n; i++) {
    fatorial = fatorial * i;
}
System.out.println(fatorial);
```

::: übung l17-fakultaet
titel: Fatorial a partir de Java
bereich: beide
auftrag: Reconstrói o código Java de cima como estrutograma. O programa lê um número n e mostra o produto 1 · 2 · … · n.
  No fim, confirma na vista de código se o teu código Java fica igual.
test: 3 -> 6
test: 5 -> 120
test: 1 -> 1
braucht: forSchleife
tipp: Lê o código Java linha a linha e pensa que bloco serve para cada linha.
tipp: As duas primeiras linhas Java juntas são uma única entrada: `input: int n "Introduz um número"`. O ciclo for tem os três campos `int i = 1`, `i <= n` e `i++`.
lösung: l17-fakultaet-loesung.visustruct
:::

## Exercício: else if

Em Java, vários casos escrevem-se muitas vezes com `else if`:

```
if (idade < 6) {
    System.out.println("Entrada gratuita");
} else if (idade < 18) {
    System.out.println("Bilhete de criança: 4 euros");
} else {
    System.out.println("Bilhete de adulto: 8 euros");
}
```

Num estrutograma não existe `else if`. Aí, uma segunda decisão fica no ramo false da primeira. Se o ramo false tiver só essa decisão, o VisuStruct volta a transformá-la em `else if` quando gera o código, e em `elif` em Python.

::: übung l17-ticket
titel: Preço do bilhete
auftrag: Pede a idade como número inteiro e reconstrói o código Java de cima como estrutograma.
test: 5 -> Entrada gratuita
test: 6 -> Bilhete de criança: 4 euros
test: 17 -> Bilhete de criança: 4 euros
test: 18 -> Bilhete de adulto: 8 euros
braucht: verzweigung
tipp: No código Java há outro `if` dentro de um `else`. No estrutograma isso é uma decisão dentro de um ramo.
tipp: Arrasta uma segunda decisão com a condição `idade < 18` para o ramo false da primeira decisão.
lösung: l17-ticket-loesung.visustruct
:::

## Jogo: Que bloco é?

::: spiel frage
titel: Jogo: Que bloco é?
intro: O Ludwig mostra-te Java. Que bloco do estrutograma está por trás? Oito rondas.
frage: Que bloco é este?

runde:
    do {
        numero = numero * 2;
    } while (numero < 100);
- Ciclo while
- [x] Ciclo do-while
- Ciclo for
> A condição está em baixo. Por isso o corpo corre pelo menos uma vez.

runde:
    switch (escolha) {
        case 1 -> { System.out.println("água"); }
        default -> { System.out.println("Esse botão não existe."); }
    }
- Decisão
- [x] Seleção
- Chamada
> Uma variável é comparada com valores fixos: isso é a seleção.

runde:
    break;
- Chamada
- Ciclo infinito
- [x] Interrupção
> O `break` sai logo do ciclo onde está.

runde:
    calcular();
- [x] Chamada
- Saída
- Instrução
> Um nome com parênteses: aqui é chamado um subprograma.

runde:
    int numero = scanner.nextInt();
- Saída
- [x] Entrada
- Chamada
> O scanner lê um valor. Isso é uma entrada.

runde:
    while (true) {
        System.out.println("Olá");
    }
- Ciclo while com condição
- [x] Ciclo infinito
- Ciclo do-while
> `while (true)` não tem uma condição verdadeira. Só um break o poderia terminar.

runde:
frage: Queres um ficheiro Java completo que possas compilar e executar logo. O que escolhes na vista de código?
- Excerto
- [x] Classe
> Um excerto são só as instruções para o método `main`. Classe cria o ficheiro inteiro.

runde:
frage: No depurador, uma linha está amarela. O que quer dizer?
- Tem um erro.
- [x] É a próxima a ser executada.
- Tem um ponto de paragem.
> Amarela é a próxima linha. Um ponto de paragem é um ponto vermelho no número da linha.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo abrir a vista de código e escolher Java como linguagem. → A vista de código
- Consigo reconhecer em Java a saída, a entrada, as decisões e os ciclos. → Os elementos em Java
- Consigo explicar a diferença entre Excerto e Classe. → Excerto ou Classe
- Consigo explicar como o código Java corre em qualquer sistema operativo com o compilador, o bytecode e a JVM. → Como o Java corre em qualquer computador
- Consigo distinguir o JDK do JRE. → Como o Java corre em qualquer computador
- Consigo explicar porque é que um programa em C++ tem de ser compilado de novo para cada sistema operativo e um programa Java não. → Como o Java corre em qualquer computador
- Consigo reconstruir um programa Java curto como estrutograma. → Exercício: Java como estrutograma
- Consigo escrever Java na área Código e ler o estrutograma que é construído. → Escrever Java diretamente
- Consigo executar um programa com ▶︎ e usar entradas e saídas na consola. → Executar o programa
- Consigo encontrar um erro de sintaxe ou de execução pelo número de linha vermelho. → Executar o programa
- Consigo pôr pontos de paragem e seguir um programa passo a passo. → Encontrar erros com o depurador
:::

## Teste de conhecimentos

::: quiz
? Como fica `output: "Olá"` em Java?
→ Os elementos em Java
- [ ] print("Olá")
- [x] System.out.println("Olá");
- [ ] console.log("Olá");
> print é Python, console.log é JavaScript.

? De onde vem o nome da classe em Classe?
→ Excerto ou Classe
- [ ] Chama-se sempre Main.
- [x] Do título do diagrama
- [ ] Do primeiro bloco
> Sem título, a classe chama-se Main.

? Que código Java pertence a um ciclo do-while?
→ Os elementos em Java
- [ ] while (condição) { … }
- [x] do { … } while (condição);
- [ ] for (;;) { … }
> No do-while a condição está no fim, por isso o corpo é executado pelo menos uma vez.

? Em que se transforma uma Interrupção no código Java?
→ Os elementos em Java
- [x] break;
- [ ] return;
- [ ] exit();

? O que acontece num ponto vermelho antes do número da linha?
→ Encontrar erros com o depurador
- [ ] A linha é ignorada.
- [x] O programa para antes dessa linha.
- [ ] A linha tem um erro.
> É um ponto de paragem. Continua-se com ▶︎ ou com Passo a passo.

? Porque é que o mesmo ficheiro `.class` corre no Windows, no macOS e no Linux?
→ Como o Java corre em qualquer computador
- [ ] O compilador cria um ficheiro diferente para cada sistema operativo.
- [x] Em cada sistema operativo, uma JVM executa o mesmo bytecode.
- [ ] Os programas Java não precisam de sistema operativo.
> O bytecode fica igual. Só a JVM existe em separado para cada sistema.

? De que precisas para escrever e compilar programas Java?
→ Como o Java corre em qualquer computador
- [ ] só do JRE
- [x] do JDK
- [ ] só da JVM
> O JRE chega para executar. O compilador `javac` só vem com o JDK.

? Queres usar o teu programa no Windows e no Mac. O que é verdade?
→ Como o Java corre em qualquer computador
- [ ] O Java tem de ser compilado de novo para cada sistema, o C++ não.
- [x] O C++ tem de ser compilado de novo para cada sistema, o Java não.
- [ ] Os dois só se compilam uma vez.
> O C++ passa diretamente a código máquina para um sistema. O Java passa a bytecode, e é a JVM que o executa em cada sistema.

? O número de linha 3 na área Código está vermelho. O que quer isso dizer?
→ Executar o programa
- [ ] Há um ponto de paragem na linha 3.
- [x] Há um erro na linha 3.
- [ ] A linha 3 é a próxima a ser executada.
> Um ponto de paragem é um ponto vermelho redondo, e a próxima linha está a amarelo. Um número de linha vermelho mostra um erro de sintaxe ou de execução.
:::
