---
titel: Java
bereich: Do estrutograma ao código
kurz: Gerar e ler código Java a partir do estrutograma e, ao contrário, reconstruir código Java como estrutograma.
---

## A vista de código

Um estrutograma descreve um processo. Para um computador o executar, precisas de um programa numa linguagem de programação. O VisuStruct escreve esse código por ti.

Clica em [{ } Code](#zeige-code) na barra de ferramentas. À direita aparece o **Gerador de código**:

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

- **Instrução:** `int soma = 0` passa a `int soma = 0;`
- **Saída:** `output: soma` passa a `System.out.println(soma);`
- **Entrada:** `input: int numero "Número?"` passa a duas linhas: `System.out.println("Número?");` e `int numero = scanner.nextInt();`. Para o `Scanner`, `Scanner scanner = new Scanner(System.in);` é escrito uma vez lá em cima.
- **Decisão:** `if (condição) { … } else { … }`
- **Seleção:** `switch (valor) { case 1 -> { … } default -> { … } }`
- **Ciclo while:** `while (condição) { … }`
- **Ciclo do-while:** `do { … } while (condição);`
- **Ciclo for:** `for (int i = 0; i < 5; i++) { … }`; os três campos ficam uns a seguir aos outros entre os parênteses, separados por ponto e vírgula.
- **Ciclo infinito:** `while (true) { … }`
- **Interrupção:** `break;`
- **Chamada:** `calcular();`

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

Na barra de ferramentas podes mudar o idioma da interface. Além do português, inglês, alemão e muitos outros, existe **Java (Keywords)**. Então os blocos da área Elementos têm os mesmos nomes que os comandos em Java: `if`, `switch`, `for`, `while`, `do`, `while(true)`, `break` e `call`. O resto da interface fica então em inglês.

Isto ajuda-te a associar os blocos aos comandos Java. O teu diagrama em si fica igual.

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
:::
