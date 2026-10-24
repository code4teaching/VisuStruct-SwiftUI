---
titel: Combinar condições
bereich: Fundamentos
kurz: Juntar várias condições com e, ou e não, e verificar intervalos de valores.
---

## E: &&

Às vezes uma só comparação não chega. Por exemplo, só tens direito a um bilhete jovem se tiveres **pelo menos 12 anos e menos de 18**.

Com `&&` (e) juntas duas condições. O resultado só é `true` se **as duas** condições forem verdadeiras.

::: diagramm l08-jugendticket.visustruct
As duas comparações têm de estar certas. Experimenta 11, 12, 17 e 18 na simulação.
:::

## Ou: ||

Com `||` (ou), o resultado é `true` se **pelo menos uma** das condições for verdadeira. Também podem ser as duas.

```
dia == 6 || dia == 7
```

Esta condição é verdadeira se `dia` tiver o valor 6 ou o valor 7, ou seja, ao sábado ou ao domingo.

> Num teclado português, a barra vertical `|` escreve-se com Shift e a tecla à esquerda do 1.

## Exercício: Fim de semana

::: übung l08-wochenende
titel: Fim de semana
auftrag: Pede um dia da semana como número (1 é segunda-feira, 7 é domingo). Mostra **Fim de semana** se for sábado ou domingo, senão **Dia útil**.
test: 6 -> Fim de semana
test: 7 -> Fim de semana
test: 1 -> Dia útil
test: 5 -> Dia útil
braucht: verzweigung
tipp: É fim de semana se o dia for 6 **ou** 7. Para isso precisas de duas comparações numa só condição.
tipp: Sábado é 6, domingo é 7. Junta as duas comparações com `||`.
lösung: l08-wochenende-loesung.visustruct
:::

## Verificar intervalos de valores

No ensino básico em Portugal, as notas vão de 1 a 5 (5 é a melhor). Verificas se uma nota está **dentro do intervalo** com duas comparações e `&&`:

```
nota >= 1 && nota <= 5
```

::: grafik l08-zahlenstrahl.svg
O intervalo verde de 1 a 5 é válido; as duas pontas estão incluídas.
:::

Ao contrário, uma nota está **fora** do intervalo se for demasiado pequena **ou** demasiado grande:

::: diagramm l08-note.visustruct
Não há notas menores do que 1 nem maiores do que 5.
:::

> A forma como se escreve na matemática, `1 <= nota <= 5`, não funciona. Tens de a dividir em duas comparações e juntá-las com `&&`.

## Exercício: Nota válida

::: übung l08-note-gueltig
titel: Nota válida
auftrag: Pede uma nota como número inteiro. Mostra **válida** se estiver entre 1 e 5 (1 e 5 incluídos), senão **inválida**.
test: 1 -> válida
test: 5 -> válida
test: 3 -> válida
test: 0 -> inválida
test: 6 -> inválida
braucht: verzweigung
tipp: Uma nota válida tem de cumprir duas coisas ao mesmo tempo: não ser demasiado pequena **e** não ser demasiado grande.
tipp: A nota tem de ser maior ou igual a 1 e, ao mesmo tempo, menor ou igual a 5.
lösung: l08-gueltig-loesung.visustruct
:::

## Não e parênteses

Com `!` (não) inverte-se uma condição: `true` passa a `false` e vice-versa.

```
!(nota >= 1 && nota <= 5)
```

Isto é verdadeiro se a nota **não** estiver no intervalo, e quer dizer o mesmo que `nota < 1 || nota > 5`.

Se `&&` e `||` aparecerem juntos, o `&&` é calculado primeiro, tal como a multiplicação antes da adição. É melhor usar **parênteses**; assim fica claro o que pertence ao quê:

```
(idade >= 12 && idade < 18) || estudante == 1
```

## A tabela de verdade

Uma **tabela de verdade** mostra de relance o que resulta de `&&`, `||` e `!`. À esquerda estão as quatro possibilidades para duas condições `a` e `b`, à direita o resultado:

::: grafik l09-wahrheitstabelle.svg
Verde é true, vermelho é false. Com && só há uma linha verde, com || só uma vermelha.
:::

Para fixar:

- `a && b` só é verdadeiro se **ambas** forem verdadeiras.
- `a || b` só é falso se **ambas** forem falsas.
- `!a` inverte o valor.

::: angeberwissen
O tipo de dados `boolean` tem o nome de **George Boole**. Este inglês mostrou já em 1847 que se pode calcular com verdadeiro e falso como com números, quase cem anos antes de existir o primeiro computador. Hoje a sua lógica está em todos os chips.
:::

## Valores lógicos em variáveis

O resultado de uma condição é um **valor lógico** do tipo `boolean`. Podes guardá-lo numa variável, tal como um número, e usá-lo mais tarde:

```
boolean fimDeSemana = dia == 6 || dia == 7
```

Na decisão fica então só `fimDeSemana`. Lê-se quase como uma frase: "Se for fim de semana, então …". Não escrevas `fimDeSemana == true`, porque `fimDeSemana` já é true ou false.

Com `!fimDeSemana` perguntas pelo contrário, ou seja, um dia útil.

::: ludwig
Condições longas ficam mais claras se puseres partes delas em variáveis boolean com nomes claros, por exemplo `boolean jovem = idade >= 12 && idade < 18`.
:::

## Jogo: Verdadeiro ou falso?

Agora é a tua vez. Calcula cada condição de cabeça. Depois de cada resposta vês como o VisuStruct a avalia passo a passo.

::: spiel
idade: 8..20
dia: 1..7
nota: 0..6
estudante: boolean
fimDeSemana: boolean
? idade >= 18
? dia == 6
? nota != 3
? idade >= 12 && idade < 18
? dia == 6 || dia == 7
? estudante && fimDeSemana
? !estudante
? nota >= 1 && nota <= 5
? !(idade < 18)
? estudante || idade >= 18
? (idade >= 12 && idade < 18) || estudante
? !(nota >= 1 && nota <= 5)
? !fimDeSemana && dia != 3
? idade >= 12 && idade < 18 && !estudante
:::

## Exercício: Ano bissexto

::: übung l08-schaltjahr
titel: Ano bissexto
auftrag: Um ano é bissexto se for divisível por 4, mas não por 100. Os anos divisíveis por 400 são bissextos de qualquer forma.
Pede um ano e mostra **Ano bissexto** ou **Não é ano bissexto**.
test: 2024 -> Ano bissexto
test: 2023 -> Não é ano bissexto
test: 1900 -> Não é ano bissexto
test: 2000 -> Ano bissexto
braucht: verzweigung
tipp: Confirma primeiro a regra com exemplos: 2024 é bissexto, 1900 não é, 2000 é. “Divisível” quer dizer que o resto é 0.
tipp: Divisível por 4 é `ano % 4 == 0`, não divisível por 100 é `ano % 100 != 0`. Junta estas duas com `&&`, põe parênteses à volta e acrescenta o caso do 400 com `||`.
lösung: l08-schaltjahr-loesung.visustruct
:::

## Agora em Java

O bilhete jovem do início fica assim em Java:

```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Quantos anos tens?");
int idade = scanner.nextInt();
if (idade >= 12 && idade < 18) {
    System.out.println("Bilhete jovem");
} else {
    System.out.println("Sem bilhete jovem");
}
```

Os sinais `&&`, `||` e `!` são exatamente os que já usas no estrutograma. Vêm do Java. Como sempre, a condição inteira fica entre os parênteses curvos depois de `if`.

::: übung l09-java-schule
titel: Escola ou tempo livre
code: java
auftrag: Escreve um programa em Java que pergunta a hora (0 a 23). Das 8 até às 15, inclusive, mostra **Escola**, senão **Tempo livre**.
test: 8 -> Escola
test: 15 -> Escola
test: 16 -> Tempo livre
test: 7 -> Tempo livre
braucht: verzweigung
tipp: A hora tem de cumprir duas condições ao mesmo tempo. Que operador quer dizer “e”?
tipp: `if (hora >= 8 && hora <= 15) { … } else { … }`
lösung: l09-java-schule-loesung.visustruct
:::

## Preenche os espaços: condições

::: lückentext
titel: Nota e fim de semana
auftrag: Preenche os operadores e as palavras que faltam.
```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Que nota?");
int nota = scanner.nextInt();
if (nota >= 1 [[&&]] nota [[<=]] 5) {
    System.out.println("nota válida");
} else {
    System.out.println("nota inválida");
}
System.out.println("Que dia (1 a 7)?");
int dia = scanner.nextInt();
[[boolean]] fimDeSemana = dia == 6 [[||]] dia == 7;
if ([[!]]fimDeSemana) {
    System.out.println("dia de escola");
}
```
erklärung: Uma nota é válida quando **as duas** condições são verdadeiras, por isso `&&`. É fim de semana quando **uma** das duas é verdadeira, por isso `||`. O resultado cabe numa variável `boolean`, e `!` inverte-o.
:::

## Encontra o erro: sem escola

::: übung l09-java-fehler
titel: Corrigir o dia sem escola
code: java
auftrag: O programa deve mostrar **sem escola** para o dia 6 (sábado) e o dia 7 (domingo), e **escola** nos outros dias. Mas mostra sempre **escola**.
  “Abrir no editor” mostra o código na área Programação. Encontra o erro, corrige-o e carrega em Verificar.
start: l09-java-fehler-start.visustruct
test: 6 -> sem escola
test: 7 -> sem escola
test: 3 -> escola
test: 1 -> escola
braucht: verzweigung
tipp: `dia` pode ser 6 **e** 7 ao mesmo tempo?
tipp: Basta que uma das duas condições seja verdadeira: `dia == 6 || dia == 7`.
lösung: l09-java-fehler-loesung.visustruct
:::

## Lista de verificação

::: checkliste
- Sei quando uma combinação com && é verdadeira. → E: &&
- Sei quando uma combinação com || é verdadeira. → Ou: ||
- Sei inverter uma condição com !. → Não e parênteses
- Sei verificar se um valor está num intervalo como de 1 a 5. → Verificar intervalos de valores
- Sei ler a tabela de verdade de &&, || e !. → A tabela de verdade
- Sei guardar o resultado de uma condição numa variável boolean. → Valores lógicos em variáveis
- Acertei pelo menos 8 de 10 condições no jogo. → Jogo: Verdadeiro ou falso?
- Sei ligar condições em Java com && e ||. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? Quando é que `a && b` é verdadeiro?
- [ ] Se a ou b for verdadeiro
- [x] Só se a e b forem ambos verdadeiros
- [ ] Se exatamente um deles for verdadeiro
> Com && as duas partes têm de estar certas. Se uma for falsa, o todo é falso.

? A variável dia tem o valor 6. Quanto dá `dia == 6 || dia == 7`?
- [x] true
- [ ] false
> Com || basta que um dos lados seja verdadeiro.

? Que condição verifica se numero está entre 10 e 20 (ambos incluídos)?
- [ ] 10 <= numero <= 20
- [ ] numero >= 10 || numero <= 20
- [x] numero >= 10 && numero <= 20
> Com || todos os números seriam permitidos, porque qualquer número é maior do que 10 ou menor do que 20.

? Quanto dá `!(5 > 3)`?
- [ ] true
- [x] false
> 5 > 3 é verdadeiro, e o ! inverte isso.

? Como escreves em Java “idade é pelo menos 12 e menor do que 18”?
- [ ] if (12 <= idade < 18)
- [x] if (idade >= 12 && idade < 18)
- [ ] if (idade >= 12 || idade < 18)
> Cada comparação fica sozinha, ligada com `&&`.
:::
