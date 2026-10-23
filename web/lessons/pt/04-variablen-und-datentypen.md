---
titel: Variáveis e tipos de dados
bereich: Fundamentos
kurz: Guardar valores, conhecer os tipos de dados int, double, String e boolean, e fazer contas.
---

## O que é uma variável?

Uma **variável** é como uma caixa com etiqueta. Tem um **nome**, um **tipo de dados** e um **valor**.

```
int idade = 14
```

Aqui a variável chama-se `idade`, o seu tipo de dados é `int` (número inteiro) e o seu valor é 14. Mais tarde podes voltar a usar o valor através do nome.

::: grafik l04-variable.svg
A variável como caixa: o nome na etiqueta, o tipo de dados como autocolante, o valor lá dentro.
:::

> Os nomes de variáveis começam por uma letra e não têm espaços. Bons nomes dizem o que está lá dentro: `preco` é melhor do que `p`. Evita acentos e cedilhas nos nomes: escreve `preco` e não `preço`.

## Os quatro tipos de dados

O tipo de dados diz que tipo de valor pode ser guardado na variável.

- **int:** números inteiros, p. ex. `int quantidade = 3` ou `int temperatura = -5`
- **double:** números decimais, p. ex. `double preco = 2.5`. Escreves um **ponto**, nunca uma vírgula.
- **String:** texto, p. ex. `String nome = "Inês"`. O texto fica entre aspas.
- **boolean:** valores lógicos, só `true` ou `false`

::: diagramm l05-datentypen.visustruct
Três variáveis com tipos de dados diferentes. Abre o diagrama e inicia a simulação.
:::

Os valores lógicos aparecem sobretudo em **condições**: `idade >= 18` é `true` ou `false`. É disso que trata a lição 8. Também podes guardar o resultado de uma condição numa variável:

```
int idade = 15
boolean adulto = idade >= 18
```

Depois disso, `adulto` tem o valor `false`.

## Atribuição com =

O sinal `=` chama-se **atribuição**. Não quer dizer “é igual a” como na matemática. Quer dizer: calcula o lado direito e guarda o resultado na variável da esquerda.

```
int pontos = 10
pontos = pontos + 5
```

Na matemática, a segunda linha estaria errada, porque nenhum número é igual a si próprio mais 5. Na programação lê-se assim: pega no valor antigo 10, soma 5 e guarda 15 em `pontos`. O tipo de dados só se escreve da primeira vez, quando a variável é criada.

::: grafik l04-zuweisung.svg
Primeiro calcula-se o lado direito, depois o resultado vai para a variável da esquerda.
:::

## Fazer contas

Podes fazer contas com números:

- `+` mais, `-` menos, `*` vezes, `/` a dividir por
- `%` resto de uma divisão, p. ex. `17 % 5` dá 2

**A multiplicação e a divisão vêm antes da adição e da subtração**, e os parênteses calculam-se primeiro: `2 * (3 + 4)` dá 14.

## Exercício: Retângulo

::: übung l05-rechteck
titel: Calcular um retângulo
auftrag: Um retângulo tem 7 de comprimento e 4 de largura. Cria as variáveis `comprimento` e `largura`. Calcula a área e o perímetro em variáveis próprias e mostra os dois assim:
`Área: 28` e na linha seguinte `Perímetro: 22`.
test: - -> Área: 28 | Perímetro: 22
braucht: anweisung
tipp: Pensa primeiro de que variáveis precisas: duas para as medidas e duas para os resultados. São todas números inteiros.
tipp: A área é o comprimento vezes a largura, o perímetro é 2 vezes (comprimento mais largura). Para a saída escreves p. ex. `output: "Área: " + area`. O `+` junta o texto e o valor da variável.
lösung: l05-rechteck-loesung.visustruct
:::

## Divisão inteira

Se dividires dois números inteiros e guardares o resultado numa variável `int`, tudo o que vem depois da vírgula desaparece. **Não é arredondado.**

```
int x = 7 / 2      dá 3
int r = 7 % 2      dá 1 (o resto)
double d = 7.0 / 2 dá 3.5
```

Com `/` e `%` juntos podes fazer boas conversões, por exemplo de minutos para horas e minutos:

::: diagramm l05-division.visustruct
135 minutos são 2 horas (135 / 60) e sobram 15 minutos (135 % 60).
:::

## Exercício: Converter segundos

::: übung l05-sekunden
titel: Converter segundos
auftrag: 200 segundos devem ser mostrados em minutos e segundos. A primeira e a última instrução já lá estão. Insere entre elas instruções que calculem `minutos` e `resto`.
start: l05-sekunden-start.visustruct
test: - -> 3 minutos e 20 segundos
braucht: anweisung
tipp: Quantos minutos inteiros cabem em 200 segundos, e quantos segundos sobram? Calcula primeiro de cabeça.
tipp: Um minuto tem 60 segundos. Usa `/` para os minutos inteiros e `%` para o resto. As duas variáveis são do tipo `int`.
lösung: l05-sekunden-loesung.visustruct
:::

## Exercício: Compras

::: übung l05-einkauf
titel: Compras
auftrag: Compras 3 cadernos a 2.5 euros cada. Cria `quantidade` como `int` e `preco` como `double`, calcula o preço total numa variável `total` e mostra `Total: 7.5 euros`.
test: - -> Total: 7.5 euros
braucht: anweisung
tipp: A quantidade vezes o preço dá o preço total. Para cada variável, pensa se é um número inteiro ou um número decimal.
tipp: O preço total é um número decimal, por isso `total` precisa do tipo `double`.
lösung: l05-einkauf-loesung.visustruct
:::

## Lista de verificação

::: checkliste
- Sei criar uma variável com tipo de dados, nome e valor. → O que é uma variável?
- Conheço os tipos de dados int, double, String e boolean. → Os quatro tipos de dados
- Sei que = é uma atribuição e não uma comparação. → Atribuição com =
- Sei fazer contas com + - * / % e conheço a divisão inteira. → Fazer contas
:::

## Teste de conhecimentos

::: quiz
? Que tipo de dados serve para o valor 3.75?
- [ ] int
- [x] double
- [ ] String
- [ ] boolean
> Os números decimais são do tipo double. No VisuStruct escrevem-se com ponto.

? Que valor tem x depois de `int x = 17 / 5`?
- [ ] 3.4
- [x] 3
- [ ] 4
> Com números inteiros, tudo o que vem depois da vírgula desaparece. Não é arredondado.

? Quanto dá `17 % 5`?
- [x] 2
- [ ] 3
- [ ] 3.4
> 17 a dividir por 5 dá 3, resto 2. O operador % dá o resto.

? No início, `int pontos = 10`. O que fica em pontos depois de `pontos = pontos * 2`?
- [ ] 10
- [ ] 12
- [x] 20
> O lado direito é calculado com o valor antigo 10, e o resultado 20 é guardado em pontos.
:::
