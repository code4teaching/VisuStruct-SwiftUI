---
titel: Seleção
bereich: Fundamentos
kurz: Executar um de vários casos, consoante o valor de uma variável.
---

## Competências que vou adquirir agora

::: kompetenzen
- inserir uma seleção, acrescentar casos e alterar os nomes dos casos
- explicar quando é executado o caso default
- decidir se serve melhor uma seleção ou uma decisão
- escrever uma seleção múltipla em Java com switch
:::

## Muitas possibilidades, uma variável

Uma máquina de bebidas tem três botões: 1 para água, 2 para sumo, 3 para chocolate quente. Com decisões precisas de três blocos encaixados uns nos outros. Isso fica depressa largo e confuso.

::: diagramm l09-verschachtelt.visustruct
A máquina com três decisões encaixadas. Cada decisão volta a verificar a mesma variável escolha.
:::

Sempre que comparas **uma variável** com **vários valores fixos**, há uma forma mais simples: a **seleção**.

## Como se constrói uma seleção

Em cima, no bloco, está a variável que decide. Por baixo há uma coluna própria para cada caso. Por cima de cada coluna está o valor a que ela pertence.

::: diagramm l09-automat.visustruct
A mesma máquina como seleção. Se escolha tiver o valor 2, só é executada a coluna 2.
:::

- A simulação procura o caso cujo nome corresponde exatamente ao valor.
- Se nenhum caso corresponder, é executado o **default**. Este caso fica sempre na ponta da direita.
- Depois, o programa continua por baixo da seleção. Só é executado **um** caso.

> Uma seleção nova tem os casos 1, 2 e default. Clica num caso para alterar o seu **Nome do caso** no Inspetor de objetos. Com **Adicionar caso** ganhas uma nova coluna antes do default.

## Casos com texto

Os casos não têm de ser números. Também podes escolher pelo conteúdo de uma variável `String`. Então escreves o texto como nome do caso, por exemplo `vermelho`.

::: diagramm l09-ampel.visustruct
Um semáforo: consoante a cor introduzida, aparece uma mensagem diferente. Na simulação, experimenta também uma cor que não existe.
:::

Maiúsculas e minúsculas contam: `Vermelho` não corresponde ao caso `vermelho`.

## Exercício: Nota por extenso

::: übung l09-note
titel: Nota por extenso
auftrag: Pede uma nota como número inteiro e mostra-a por extenso: 1 muito insuficiente, 2 insuficiente, 3 suficiente, 4 bom, 5 muito bom.
  Para qualquer outro número deve aparecer **Nota inválida**.
test: 5 -> muito bom
test: 3 -> suficiente
test: 1 -> muito insuficiente
test: 9 -> Nota inválida
braucht: fallauswahl
tipp: Para muitos valores fixos, uma seleção é mais clara do que muitas decisões. Cada nota tem um caso próprio.
tipp: Usa “Adicionar caso” até teres os casos 1 a 5 e default. Em cima, na seleção, escreves `nota`.
lösung: l09-note-loesung.visustruct
:::

## Exercício: Calculadora

::: übung l09-rechner
titel: Calculadora
auftrag: Pede, um a seguir ao outro, um número inteiro `a`, um operador como `String` e um segundo número inteiro `b`.
  Para `+`, `-` e `*` mostras o resultado. Para qualquer outro sinal aparece **Operador desconhecido**.
test: 3, +, 4 -> 7
test: 10, -, 4 -> 6
test: 6, *, 7 -> 42
test: 1, x, 2 -> Operador desconhecido
braucht: fallauswahl
tipp: Primeiro lê os três valores. Depois, uma seleção sobre o operador decide o que é calculado.
tipp: Antes da seleção, cria `int resultado = 0`. Em cada caso calculas, por exemplo, `resultado = a + b` e depois mostras `resultado`. Os nomes dos casos são simplesmente `+`, `-` e `*`.
lösung: l09-rechner-loesung.visustruct
:::

## Seleção ou decisão?

A seleção só verifica se um valor é **exatamente igual** a um nome de caso. Portanto:

- **Seleção:** uma variável, vários valores fixos. Exemplos: escolher num menu, dia da semana como número, notas.
- **Decisão:** intervalos e condições combinadas. Exemplos: `idade >= 18`, `temperatura < 0 || temperatura > 30`.

Por isso, para “idade 18 ou mais” continuas a precisar da decisão. Não podes criar um caso próprio para cada idade possível.

## Agora em Java

A máquina de bebidas fica assim em Java:

```java editor
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("1 água, 2 sumo, 3 chocolate quente");
int escolha = scanner.nextInt();
switch (escolha) {
    case 1 -> {
        System.out.println("Aqui está a tua água.");
    }
    case 2 -> {
        System.out.println("Aqui está o teu sumo.");
    }
    case 3 -> {
        System.out.println("Aqui está o teu chocolate quente.");
    }
    default -> {
        System.out.println("Este botão não existe.");
    }
}
```

- Depois de `switch`, a variável que é comparada fica entre parênteses curvos.
- Cada caso começa com `case`, o valor e uma seta `->`. Depois, entre chavetas, fica o que deve acontecer.
- `default` é o caso “senão”. Corre quando nenhum valor serve.

::: angeberwissen
A seta `case 1 ->` só existe em Java desde 2020 (Java 14). Antes escrevia-se `case 1:` e era preciso terminar cada caso com `break;`. Quem se esquecia, continuava simplesmente para o caso seguinte. A seta poupou muitos problemas a muitos programadores.
:::

::: übung l10-java-wuerfel
titel: Dado por extenso
code: java
auftrag: Escreve um programa em Java com `switch` que lê um número. Para 1 mostra **um**, para 2 **dois**, para 3 **três** e senão **não conheço**.
test: 1 -> um
test: 2 -> dois
test: 3 -> três
test: 7 -> não conheço
braucht: fallauswahl
tipp: Precisas de três casos `case` e um caso `default`.
tipp: `switch (numero) { case 1 -> { System.out.println("um"); } … default -> { System.out.println("não conheço"); } }`
lösung: l10-java-wuerfel-loesung.visustruct
:::

## Preenche os espaços: switch

::: lückentext
titel: Meses por extenso
auftrag: Preenche as palavras e os sinais que faltam na seleção múltipla.
```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Que mês (1 a 3)?");
int mes = scanner.nextInt();
[[switch]] (mes) {
    [[case]] 1 -> {
        System.out.println("janeiro");
    }
    case 2 [[->]] {
        System.out.println("fevereiro");
    }
    [[case]] 3 -> {
        System.out.println("março");
    }
    [[default]] -> {
        System.out.println("Não conheço");
    }
}
```
erklärung: Depois de `switch` vem a variável entre parênteses. Cada caso começa com `case`, o valor e a seta `->`. `default` é executado quando nenhum caso serve.
:::

## Encontra o erro: calculadora

::: übung l10-java-fehler
titel: Corrigir a calculadora
code: java
auftrag: A calculadora lê dois números e uma opção: 1 mais, 2 menos, 3 vezes. Com 7, 3 e a opção 2 devia dar **4**, mas dá **-4**.
  “Abrir no editor” mostra o código na área Código. Encontra o erro, corrige-o e carrega em Verificar.
start: l10-java-fehler-start.visustruct
test: 7, 3, 2 -> 4
test: 7, 3, 1 -> 10
test: 7, 3, 3 -> 21
test: 7, 3, 5 -> Não existe
test: 10, 4, 2 -> 6
braucht: fallauswahl
tipp: Mais e vezes estão certos. Olha com atenção para o `case 2`.
tipp: No menos, a ordem conta: `a - b` em vez de `b - a`.
lösung: l10-java-fehler-loesung.visustruct
:::

## Jogo: Que caso?

::: spiel frage
titel: Jogo: Que caso?
intro: O Ludwig carrega em botões da máquina de bebidas e de outras seleções. O que acontece? Seis rondas.

runde:
    int escolha = 2;
    switch (escolha) {
        case 1 -> { System.out.println("água"); }
        case 2 -> { System.out.println("sumo"); }
        case 3 -> { System.out.println("chocolate quente"); }
        default -> { System.out.println("Esse botão não existe."); }
    }
frage: O que aparece?
- água
- [x] sumo
- Esse botão não existe.
> escolha é 2, por isso corre exatamente o `case 2`.

runde:
    int escolha = 4;
    switch (escolha) {
        case 1 -> { System.out.println("água"); }
        case 2 -> { System.out.println("sumo"); }
        case 3 -> { System.out.println("chocolate quente"); }
        default -> { System.out.println("Esse botão não existe."); }
    }
frage: O que aparece?
- chocolate quente
- nada
- [x] Esse botão não existe.
> Nenhum caso serve para 4, por isso corre o `default`.

runde:
    String dia = "segunda";
    switch (dia) {
        case "Segunda" -> { System.out.println("Matemática"); }
        case "Terça" -> { System.out.println("Educação Física"); }
        default -> { System.out.println("livre"); }
    }
frage: O que aparece?
- Matemática
- Educação Física
- [x] livre
> Nos textos conta cada letra: "segunda" com s minúsculo não é "Segunda".

runde:
    int nota = 0;
    switch (nota) {
        case 1 -> { System.out.println("muito bom"); }
        case 2 -> { System.out.println("bom"); }
        case 3 -> { System.out.println("suficiente"); }
    }
frage: O que aparece?
- muito bom
- [x] nada
- suficiente
> Nenhum caso serve e não há `default`. Então simplesmente não acontece nada.

runde:
frage: Queres verificar se `idade >= 18`. O que serve melhor?
- [x] uma decisão
- uma seleção
> Uma seleção só compara com valores fixos. Para "maior ou igual" precisas de uma decisão.

runde:
frage: Um dado mostra de 1 a 6, e para cada número deve aparecer uma palavra diferente. O que serve melhor?
- uma decisão
- [x] uma seleção
> Uma variável, seis valores fixos: é exatamente para isso que serve a seleção.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo inserir uma seleção, acrescentar casos e alterar os nomes dos casos. → Como se constrói uma seleção
- Consigo explicar quando é executado o caso default. → Como se constrói uma seleção
- Consigo decidir se serve melhor uma seleção ou uma decisão. → Seleção ou decisão?
- Consigo escrever uma seleção múltipla em Java com switch. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? A variável dia tem o valor 5. Existem os casos 1, 2, 3 e default. O que é executado?
→ Como se constrói uma seleção
- [ ] Nada
- [ ] O caso 3
- [x] O caso default
> Nenhum nome de caso corresponde a 5, por isso aplica-se o default.

? Quantos casos são executados de cada vez que a seleção é executada?
→ Como se constrói uma seleção
- [x] Exatamente um
- [ ] Todos os casos a partir do que corresponde
- [ ] Todos os casos
> Depois do caso que corresponde, o programa continua logo por baixo da seleção.

? Para que é que uma seleção NÃO serve?
→ Seleção ou decisão?
- [ ] Escolher a opção 1, 2 ou 3 de um menu
- [x] Verificar se uma temperatura está acima dos 30 graus
- [ ] Tratar uma cor como vermelho, amarelo ou verde
> “Acima dos 30” é um intervalo. Para isso precisas de uma decisão com uma comparação.

? No semáforo escreves `Vermelho`, e o caso chama-se `vermelho`. O que acontece?
→ Como se constrói uma seleção
- [ ] É executado o caso vermelho.
- [x] É executado o caso default.
- [ ] A simulação indica um erro.
> Maiúsculas e minúsculas contam. Vermelho e vermelho são textos diferentes.

? Com que nome também encontras a seleção nos manuais?
→ Como se constrói uma seleção
- [ ] Instrução condicional
- [ ] Sequência
- [x] Seleção múltipla
> É escolhido um de muitos casos. Por isso também se chama seleção múltipla.

? Como se chama em Java o caso “senão” de um switch?
→ Agora em Java
- [ ] else
- [x] default
- [ ] case 0
:::
