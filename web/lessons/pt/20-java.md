---
titel: Estrutograma e código
bereich: Do estrutograma ao código
kurz: Todos os elementos em Java num relance, gerar código, escrever Java na área Programação, executá-lo e procurar erros.
---

## A vista de código

Nas lições 4 a 16 já escreveste cada elemento em Java. Aqui vês tudo num relance e aprendes como o VisuStruct transforma um estrutograma inteiro num programa Java.

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
| Ciclo infinito | `while (true) { … }` | 11 |
| Interrupção | `break;` | 18 |
| Chamada | `calcular();` | 18 |
| Array | `int[] numeros = new int[5];` | 15, 16 |

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
    }
}
```

O nome da classe vem do **título** do diagrama. O ficheiro tem de ter exatamente o mesmo nome, aqui `Tabuada.java`. O **Guardar Java…** trata disso por ti.

> O código gerado é um bom começo, mas confirma-o. Se primeiro criares uma variável e mais tarde a voltares a ler com uma entrada, o VisuStruct escreve mesmo assim `int pin = scanner.nextInt();`. O Java indica então que `pin` já existe. Basta apagares o `int` nessa linha.

## O modo de linguagem Java

Na [roda dentada](#zeige-einstellungen) em cima à direita podes ativar as **Palavras-chave do código**. Então os blocos da área Elementos têm os mesmos nomes que os comandos em Java: `if`, `switch`, `for`, `while`, `do`, `while(true)`, `break` e `call`. O resto da interface fica no teu idioma.

Isto ajuda-te a associar os blocos aos comandos Java. O teu diagrama em si fica igual.

## Escrever Java diretamente

Até agora desenhaste primeiro o estrutograma e depois viste o código. Na área [Programação](#zeige-codelive) também funciona ao contrário. Clica na barra estreita **Programação** à direita. Ao lado do estrutograma aparece uma coluna onde escreves tu mesmo o Java.

- **Do estrutograma para o código:** Quando alteras alguma coisa no estrutograma, o código Java muda logo.
- **Do código para o estrutograma:** Quando escreves Java, o VisuStruct constrói o estrutograma enquanto escreves. Se ainda faltar alguma coisa, por exemplo uma chaveta de fecho `}`, aparece uma indicação por baixo do código.
- **Sugestões:** Enquanto escreves, o VisuStruct sugere modelos, por exemplo para `if`, `for` ou `while`. Com Enter aceitas um modelo. Substitui simplesmente os marcadores cinzentos pelo teu texto.
- **Indentar:** Se o teu código ficou desarrumado, clica no botão **Indentar** em cima na área Programação. Cada nível fica então quatro espaços mais para dentro, como no Eclipse ou no IntelliJ. Se tiveres linhas selecionadas, o VisuStruct só indenta essas.

Assim podes experimentar os dois caminhos. Desenhar primeiro o estrutograma é bom para planear um processo. Escrever o código diretamente é mais rápido quando já sabes o que queres. O estrutograma ajuda-te depois a verificar o teu código.

## Executar o programa

Em cima, na área Programação, [▶︎ Executar](#zeige-ausfuehren) inicia o teu programa e **■ Parar** termina-o, por exemplo num ciclo infinito. O que o teu programa mostra aparece em baixo na [consola](#zeige-konsole). Se pedir uma entrada, escreve-a lá e carrega em Enter.

Podes arrastar com o rato a fronteira entre o código e a consola para cima ou para baixo.

> A área Programação entende os comandos Java que também existem como blocos no estrutograma. Ainda não conhece classes próprias nem objetos. Janelas com Swing funcionam na mesma: liga o **Java verdadeiro (com Swing)** na roda dentada (lição “A tua primeira janela”).

::: angeberwissen
Os profissionais chamam **IDE** (Integrated Development Environment) a um programa onde se escreve código, se executa e se procuram erros. Com a área Programação, o VisuStruct é um pequeno IDE com estrutograma incluído.
:::

## Encontrar erros com o depurador

Às vezes um programa corre, mas calcula mal. Aí ajuda o **depurador** (debugger): executa o teu programa devagar e tu vês o que acontece.

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

Desta vez não desenhas. Abre a área Programação e escreve este código Java:

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
auftrag: Escreve o código Java acima na área Programação. Executa-o com ▶︎ e introduz um número inicial na consola.
  Depois observa o estrutograma que foi construído e clica em Verificar.
test: 3 -> 3 | 2 | 1 | Start!
test: 1 -> 1 | Start!
test: 0 -> Start!
braucht: whileSchleife
tipp: Abre a área Programação com a barra estreita mais à direita e começa simplesmente a escrever.
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

## Lista de verificação

::: checkliste
- Sei abrir a vista de código e escolher Java como linguagem. → A vista de código
- Sei como ficam em Java a saída, a entrada, as decisões e os ciclos. → Os elementos em Java
- Sei a diferença entre Excerto e Classe. → Excerto ou Classe
- Sei reconstruir um programa Java curto como estrutograma. → Exercício: Java como estrutograma
- Sei escrever Java na área Programação e ler o estrutograma que é construído. → Escrever Java diretamente
- Sei executar um programa com ▶︎ e usar entradas e saídas na consola. → Executar o programa
- Consigo pôr pontos de paragem e seguir um programa passo a passo. → Encontrar erros com o depurador
:::

## Teste de conhecimentos

::: quiz
? Como fica `output: "Olá"` em Java?
- [ ] print("Olá")
- [x] System.out.println("Olá");
- [ ] console.log("Olá");
> print é Python, console.log é JavaScript.

? De onde vem o nome da classe em Classe?
- [ ] Chama-se sempre Main.
- [x] Do título do diagrama
- [ ] Do primeiro bloco
> Sem título, a classe chama-se Main.

? Que código Java pertence a um ciclo do-while?
- [ ] while (condição) { … }
- [x] do { … } while (condição);
- [ ] for (;;) { … }
> No do-while a condição está no fim, por isso o corpo é executado pelo menos uma vez.

? Em que se transforma uma Interrupção no código Java?
- [x] break;
- [ ] return;
- [ ] exit();

? O que acontece num ponto vermelho antes do número da linha?
- [ ] A linha é ignorada.
- [x] O programa para antes dessa linha.
- [ ] A linha tem um erro.
> É um ponto de paragem. Continua-se com ▶︎ ou com Passo a passo.
:::
