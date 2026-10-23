---
titel: Decisão
bereich: Fundamentos
kurz: Usar uma condição para decidir qual de dois ramos é executado.
---

## Se, então, senão

Até agora, todos os blocos eram sempre executados. Mas muitas vezes um programa deve **decidir**: se uma condição se verificar, faz uma coisa, senão faz a outra.

É para isso que serve a **decisão**. A condição fica no triângulo em cima. Por baixo, o estrutograma divide-se em dois ramos:

- **true** (esquerda): é executado se a condição for verdadeira
- **false** (direita): é executado se a condição for falsa

É sempre executado **exatamente um** dos dois ramos. Depois, o programa continua por baixo da decisão.

::: diagramm l07-alter-pruefen.visustruct
Consoante a idade introduzida, aparece uma mensagem ou a outra. Experimenta 17 e 18 na simulação.
:::

## Inserir uma decisão

Arrasta a **Decisão** da área Elementos para o estrutograma. Clica no triângulo e escreve a condição no Inspetor de objetos, p. ex. `idade >= 18`. A palavra `if` já está à frente.

Cada ramo começa com um marcador ø. Arrasta instruções para lá. Um ramo também pode ter vários blocos uns por cima dos outros.

## Operadores de comparação

Uma condição é normalmente uma **comparação**. O seu resultado é sempre `true` ou `false`.

- `==` igual, p. ex. `numero == 0`
- `!=` diferente, p. ex. `resposta != 42`
- `<` menor, `<=` menor ou igual
- `>` maior, `>=` maior ou igual

> Não confundas `==` com `=`. Um só `=` é uma atribuição e guarda um valor. Para comparar precisas de dois sinais de igual.

Com `%` verificas se um número é divisível por outro: `numero % 2 == 0` é verdadeiro se `numero` for par.

## Exercício: Par ou ímpar

::: übung l07-gerade
titel: Par ou ímpar
auftrag: Pede um número inteiro. Mostra **par** se for par, senão **ímpar**.
test: 4 -> par
test: 7 -> ímpar
test: 0 -> par
braucht: verzweigung
tipp: Aqui há duas possibilidades, por isso precisas de uma decisão. Como reconheces um número par?
tipp: Um número é par se não sobrar resto quando o divides por 2. A condição é `numero % 2 == 0`.
lösung: l07-gerade-loesung.visustruct
:::

## Exercício: O número maior

::: übung l07-maximum
titel: O número maior
auftrag: Pede dois números inteiros e mostra só o maior. Se os dois forem iguais, mostra esse número.
test: 3, 8 -> 8
test: 9, 2 -> 9
test: 5, 5 -> 5
braucht: verzweigung
tipp: Uma decisão compara os dois números. Cada ramo tem exatamente uma saída.
tipp: Compara com `a > b`. No ramo true mostras `a`, no ramo false `b`.
lösung: l07-maximum-loesung.visustruct
:::

## Um ramo vazio

Às vezes uma coisa só deve acontecer se a condição for verdadeira e, caso contrário, não acontece nada. Então o ramo false fica **vazio**. No estrutograma mostra o marcador **ø**.

::: diagramm l07-rabatt.visustruct
A partir de 50 euros tens 5 euros de desconto. Caso contrário não acontece nada; o ramo false está vazio. A saída em baixo é executada nos dois casos.
:::

## Exercício: Valor absoluto

::: übung l07-betrag
titel: Valor absoluto de um número
auftrag: Pede um número inteiro. Se for negativo, torna-o positivo. Depois mostra o número. Assim, -5 passa a 5, e 7 fica 7.
Usa uma decisão com um ramo vazio e só **uma** saída por baixo da decisão.
test: -5 -> 5
test: 7 -> 7
test: 0 -> 0
test: -12 -> 12
braucht: verzweigung
tipp: Só os números negativos têm de ser alterados. O que acontece a um número se o multiplicares por -1?
tipp: A condição é `numero < 0`. No ramo true trocas o sinal, p. ex. com `numero = 0 - numero`. O ramo false fica vazio.
lösung: l07-betrag-loesung.visustruct
:::

## Lista de verificação

::: checkliste
- Sei que é executado exatamente um ramo de uma decisão. → Se, então, senão
- Conheço os operadores de comparação == != < <= > >=. → Operadores de comparação
- Sei distinguir == de =. → Operadores de comparação
- Sei construir uma decisão com um ramo vazio. → Um ramo vazio
:::

## Teste de conhecimentos

::: quiz
? Que ramo é executado se a condição for falsa?
- [ ] O ramo true
- [x] O ramo false
- [ ] Os dois ramos
- [ ] Nenhum, o programa termina
> Com false, é executado o ramo da direita. Depois, o programa continua por baixo da decisão.

? Que condição verifica se idade é exatamente 18?
- [ ] idade = 18
- [x] idade == 18
- [ ] idade >= 18
> Um só = é uma atribuição. Para comparar precisas de ==.

? O que significa ø num ramo?
- [x] Neste caso não acontece nada.
- [ ] O programa termina aqui.
- [ ] A condição é falsa.

? A condição é `pontos >= 50`. Para que valor é verdadeira?
- [ ] 49
- [x] 50
- [ ] 0
> >= quer dizer maior ou igual. Portanto o 50 está incluído.

? Nos manuais, a decisão tem muitas vezes outro nome. Qual?
- [ ] Seleção múltipla
- [x] Instrução condicional
- [ ] Iteração
> As instruções de um ramo só são executadas sob uma condição. Por isso também se chama instrução condicional.
:::
