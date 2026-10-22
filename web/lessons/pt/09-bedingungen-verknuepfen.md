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

## Lista de verificação

::: checkliste
- Sei quando uma combinação com && é verdadeira. → E: &&
- Sei quando uma combinação com || é verdadeira. → Ou: ||
- Sei inverter uma condição com !. → Não e parênteses
- Sei verificar se um valor está num intervalo como de 1 a 5. → Verificar intervalos de valores
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
:::
