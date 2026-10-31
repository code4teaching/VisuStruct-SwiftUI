---
titel: Variáveis e tipos de dados
bereich: Fundamentos
kurz: Guardar valores, conhecer os tipos de dados int, double, String e boolean, e fazer contas.
---

## Competências que vou adquirir agora

::: kompetenzen
- criar uma variável com tipo de dados, nome e valor
- explicar que o Java distingue maiúsculas de minúsculas (`numero` não é `Numero`)
- distinguir os tipos de dados int, double, String e boolean
- explicar que = é uma atribuição e não uma comparação
- fazer contas com + - * / % e usar a divisão inteira
- criar e mostrar variáveis em Java
:::

## O que é uma variável?

Uma **variável** é como uma caixa com etiqueta. Tem um **nome**, um **tipo de dados** e um **valor**.

```
int idade = 14
```

Aqui a variável chama-se `idade`, o seu tipo de dados é `int` (número inteiro) e o seu valor é 14. Mais tarde podes voltar a usar o valor através do nome.

::: grafik l04-variable.svg
A variável como caixa: o nome na etiqueta, o tipo de dados como autocolante, o valor lá dentro.
:::

> Os nomes de variáveis começam por uma **letra minúscula** e não têm espaços. Bons nomes dizem o que está lá dentro: `preco` é melhor do que `p`. Evita acentos e cedilhas nos nomes: escreve `preco` e não `preço`.

::: angeberwissen
Em setembro de 1999 perdeu-se a sonda Mars Climate Orbiter. Uma equipa calculava a força de impulso em unidades americanas (libras), a outra esperava unidades métricas (newtons). Nos dados só estava o número, não a unidade. A sonda voou demasiado baixo na atmosfera de Marte e ardeu, um prejuízo de cerca de 125 milhões de dólares. Um nome que diz o que guarda, como `impulsoEmNewtonSegundos`, teria evitado a confusão. Já agora, eu escrevo sempre `fenoEmQuilos` na minha caixa de feno.
:::

Se um nome tiver várias palavras, escreves-as juntas e começas cada palavra seguinte com maiúscula: `precoComIva`, `numeroDeAlunos`. Esta forma de escrever chama-se **camelCase**.

::: angeberwissen
O camelCase tem este nome porque as maiúsculas no meio saem da palavra como as bossas de um camelo: `precoComIva` tem duas bossas. Eu, como bode, tenho zero bossas, mas dois chifres. Infelizmente ainda ninguém inventou a escrita BodeCase.
:::

::: grafik l04-camelcase.svg
As maiúsculas C e I sobressaem como as duas bossas do camelo.
:::

## Maiúsculas e minúsculas

O Java distingue **maiúsculas de minúsculas**. Em inglês diz-se **case-sensitive**. Para o Java, `numero`, `Numero` e `NUMERO` são três nomes diferentes, ou seja, três caixas diferentes:

```
int numero = 4
int Numero = 6
```

Aqui há duas variáveis. Se mais tarde escreveres `NUMERO`, o Java não encontra nenhuma variável com esse nome. O programa não corre e aparece uma mensagem de erro.

> Isto também vale para as palavras do Java: `String` e `System` escrevem-se com maiúscula, `int` e `double` com minúscula. Nos teus programas, nunca cries duas variáveis que só se distinguem por maiúsculas e minúsculas. Isso confunde-te a ti e a quem lê o teu código.

## Exercício: Três nomes

::: übung l04-gross-klein
titel: Três nomes
auftrag: O Ludwig criou duas variáveis: `numero` com o valor 4 e `Numero` com o valor 6. O estrutograma deve multiplicá-las e mostrar **Resultado: 24**. Mas não corre.
  Abre o exercício, carrega em Verificar e lê a mensagem de erro. Corrige a instrução e carrega outra vez em Verificar.
start: l04-gross-klein-start.visustruct
test: - -> Resultado: 24
braucht: anweisung
tipp: Quantos nomes diferentes há no estrutograma? `numero`, `Numero` e `NUMERO` são três nomes diferentes para o computador.
tipp: `NUMERO` não existe. Para 24 precisas de 4 vezes 6, ou seja, `numero` vezes `Numero`: `int resultado = numero * Numero`. Com `numero * numero` dá 16.
lösung: l04-gross-klein-loesung.visustruct
:::

## Os quatro tipos de dados

O tipo de dados diz que tipo de valor pode ser guardado na variável.

- **int:** números inteiros, p. ex. `int quantidade = 3` ou `int temperatura = -5`
- **double:** números decimais, p. ex. `double preco = 2.5`. Escreves um **ponto**, nunca uma vírgula.
- **String:** texto, p. ex. `String nome = "Inês"`. O texto fica entre aspas.
- **boolean:** valores lógicos, só `true` ou `false`

Há mais tipos de dados. Um deles vais precisar em breve: `char` para um **único caractere**, p. ex. `char nota = 'C'`. Um `char` fica entre aspas **simples**. Vais conhecê-lo melhor na lição 17.

::: diagramm l05-datentypen.visustruct
Três variáveis com tipos de dados diferentes. Abre o diagrama e inicia a simulação.
:::

Os valores lógicos aparecem sobretudo em **condições**: `idade >= 18` é `true` ou `false`. É disso que trata a lição 8. Uma variável do tipo `boolean` recebe simplesmente `true` ou `false`:

```
boolean adulto = false
```

::: angeberwissen
A 4 de junho de 1996, o foguetão Ariane 5 explodiu apenas 37 segundos depois da descolagem. A culpa foi de uma única linha: um número decimal para a velocidade foi metido numa variável inteira demasiado pequena para valores tão grandes. O tipo de dados não é um pormenor, pode custar meio milhar de milhões de euros.
:::

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
- `%` resto de uma divisão (diz-se “módulo”), p. ex. `17 % 5` dá 2

A **divisão com resto** conheces da escola primária, quando ainda não sabias números decimais: 17 : 5 = 3 e sobram 2. O 5 cabe três vezes no 17, o que dá 15. Até 17 faltam ainda 2: esse é o resto. O computador calcula com números inteiros exatamente assim: `/` dá o resultado sem o resto, `%` dá só o resto.

| Escola primária | com `/` | com `%` |
|---|---|---|
| 17 : 5 = 3, resto 2 | `17 / 5` dá 3 | `17 % 5` dá 2 |
| 20 : 5 = 4, resto 0 | `20 / 5` dá 4 | `20 % 5` dá 0 |
| 3 : 5 = 0, resto 3 | `3 / 5` dá 0 | `3 % 5` dá 3 |

Se o resto for 0, a divisão é exata. Mais tarde usas isto para ver se um número é par: nos números pares, `numero % 2` dá 0.

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
auftrag: Compras 3 cadernos a 2.5 euros cada. Cria `quantidade` como `int` e `preco` como `double`, calcula o preço total numa variável `precoTotal` e mostra `Total: 7.5 euros`.
test: - -> Total: 7.5 euros
braucht: anweisung
tipp: A quantidade vezes o preço dá o preço total. Para cada variável, pensa se é um número inteiro ou um número decimal.
tipp: O preço total é um número decimal, por isso `precoTotal` precisa do tipo `double`.
lösung: l05-einkauf-loesung.visustruct
:::

## Agora em Java

Um estrutograma é um plano. Em **Java** torna-se um programa que o computador executa. As tuas compras do exercício ficam assim:

```java editor
int quantidade = 3;
double preco = 2.5;
double precoTotal = quantidade * preco;
System.out.println("Total: " + precoTotal + " euros");
```

- Primeiro o tipo de dados, depois o nome, depois o valor, tal como no bloco.
- Cada instrução termina com um **ponto e vírgula** `;`.
- Em Java, uma saída escreve-se `System.out.println(…)`.

Como é que o computador entende o teu código Java e porque é que ele corre igual no Windows, no macOS e no Linux, vais ver na lição “Estrutograma e código”.

::: angeberwissen
O Java chamava-se primeiro **Oak** (carvalho), por causa da árvore em frente à janela do escritório de James Gosling. A partir de 1991, a sua equipa na Sun Microsystems queria programar pequenos aparelhos, como boxes de televisão. Mas o nome Oak já pertencia a outra empresa. Assim, em 1995 passou a chamar-se **Java**, como o café da ilha de Java. É por isso que o logótipo é uma chávena a fumegar.
:::

## Texto em Java

As variáveis não guardam só números. Para texto existe o tipo de dados `String`:

```java editor
String nome = "Inês";
int idade = 14;
double altura = 1.62;
System.out.println(nome + " tem " + idade + " anos.");
System.out.println("Altura: " + altura + " m");
```

- O texto fica entre aspas.
- `String` escreve-se com maiúscula, `int`, `double` e `boolean` com minúscula. O Java distingue-os.
- Com `+` juntas texto e números.

Escreves Java na área [Código](#zeige-codelive). O estrutograma constrói-se sozinho enquanto escreves. “Abrir no editor” leva o exemplo para a área Código. Clica aí em “Executar”, depois muda o nome, a idade ou a altura e experimenta outra vez.

::: übung l04-java-steckbrief
titel: Ficha em Java
code: java
auftrag: Escreve a ficha do Ludwig, o bode. Cria três variáveis: o nome **Ludwig**, a idade **7** e a altura **1.2**. Depois mostra estas duas linhas:
  **Ludwig tem 7 anos.** e **Altura: 1.2 m**
  “Abrir no editor” abre também a área Código à direita. Escreve lá o teu código; o estrutograma constrói-se sozinho. Depois clica em Verificar.
test: - -> Ludwig tem 7 anos. | Altura: 1.2 m
braucht: anweisung
tipp: Precisas de uma `String`, um `int` e um `double`. Cada linha termina com ponto e vírgula.
tipp: `String nome = "Ludwig";`, `int idade = 7;` e `double altura = 1.2;`. Juntas a saída com `+`: `System.out.println(nome + " tem " + idade + " anos.");`
lösung: l04-java-steckbrief-loesung.visustruct
:::

## Preenche os espaços: tipos de dados

::: lückentext
titel: Ficha em Java
auftrag: Preenche as palavras que faltam. Por fora está a moldura de que qualquer programa Java precisa num ficheiro próprio. As variáveis ficam lá dentro.
```java
[[public]] class Ficha {
    public static [[void]] main(String[] args) {
        [[int]] idade = 14;
        [[double]] altura = 1.62;
        [[String]] nome = "Mia";
        [[boolean]] temAnimal = true;
        System.out.[[println]](nome + " tem " + idade + " anos.");
    }
}
```
erklärung: Números inteiros são `int`, números decimais `double`, textos `String` (com S maiúsculo) e valores lógicos `boolean`. `public class` e `public static void main` formam a moldura. Na área Código podes deixá-la de fora, há mais sobre isto na lição “Java”.
:::

## Encontra o erro: segundos

::: übung l04-java-fehler
titel: Corrigir os segundos
code: java
auftrag: O programa deve converter 200 segundos em minutos e segundos e mostrar **3 min 20 s**. Mas mostra **20 min 3 s**.
  “Abrir no editor” mostra o código na área Código. Encontra o erro, corrige-o e carrega em Verificar.
start: l04-java-fehler-start.visustruct
test: - -> 3 min 20 s
braucht: anweisung
tipp: `/` divide sem resto, `%` dá o resto. Qual dos dois precisas para os minutos e qual para os segundos que sobram?
tipp: Os dois operadores estão trocados: `int minutos = segundos / 60;` e `int resto = segundos % 60;`
lösung: l04-java-fehler-loesung.visustruct
:::

## Porque é que não corre?

::: übung l04-java-laeuft-nicht
titel: Corrigir a ficha
code: java
auftrag: O programa deve mostrar **Ludwig tem 7 anos.** Mas não corre, porque há duas palavras mal escritas.
  “Abrir no editor” mostra o código na área Código. Clica em “Executar” e lê a mensagem de erro. Corrige o erro e carrega em Verificar.
start: l04-java-laeuft-nicht-start.visustruct
test: - -> Ludwig tem 7 anos.
braucht: anweisung
tipp: O Java distingue maiúsculas de minúsculas. Compara cada palavra da saída com o que foi criado em cima.
tipp: `System` escreve-se com S maiúsculo. A variável chama-se `idade` com i minúsculo: `System.out.println(nome + " tem " + idade + " anos.");`
lösung: l04-java-laeuft-nicht-loesung.visustruct
:::

## Jogo: Que tipo de dados?

::: spiel frage
titel: Jogo: Que tipo de dados?
intro: O Ludwig juntou valores. Que tipo de dados serve para cada valor? Oito rondas.
antworten: int | double | String | boolean

runde:
frage: Que tipo de dados serve para `17`?
richtig: int
> Um número inteiro sem ponto decimal é um `int`.

runde:
frage: Que tipo de dados serve para `3.5`?
richtig: double
> Números com ponto decimal são `double`.

runde:
frage: Que tipo de dados serve para `"Olá"`?
richtig: String
> Texto entre aspas é uma `String`.

runde:
frage: Que tipo de dados serve para `true`?
richtig: boolean
> `true` e `false` são os dois valores lógicos, tipo de dados `boolean`.

runde:
frage: Que tipo de dados serve para `"17"`?
richtig: String
> Atenção às aspas! Aqui 17 é um texto com o qual não se pode calcular.

runde:
frage: Que tipo de dados serve para `-4`?
richtig: int
> Os números inteiros negativos também são `int`.

runde:
frage: Que tipo de dados serve para `0.0`?
richtig: double
> O ponto torna-o um número decimal, mesmo que a seguir só esteja um 0.

runde:
frage: Que tipo de dados serve para `"false"`?
richtig: String
> Entre aspas, false também é só um texto. O valor lógico não tem aspas.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo criar uma variável com tipo de dados, nome e valor. → O que é uma variável?
- Consigo explicar que o Java distingue maiúsculas de minúsculas (`numero` não é `Numero`). → Maiúsculas e minúsculas
- Consigo distinguir os tipos de dados int, double, String e boolean. → Os quatro tipos de dados
- Consigo explicar que = é uma atribuição e não uma comparação. → Atribuição com =
- Consigo fazer contas com + - * / % e usar a divisão inteira. → Fazer contas
- Consigo criar e mostrar variáveis em Java. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? Que tipo de dados serve para o valor 3.75?
→ Os quatro tipos de dados
- [ ] int
- [x] double
- [ ] String
- [ ] boolean
> Os números decimais são do tipo double. No VisuStruct escrevem-se com ponto.

? Quantas variáveis criam `int numero = 1`, `int Numero = 2` e `int NUMERO = 3`?
→ Maiúsculas e minúsculas
- [ ] uma
- [ ] duas
- [x] três
> O Java distingue maiúsculas de minúsculas. Os três nomes são diferentes, por isso há três variáveis.

? Que valor tem x depois de `int x = 17 / 5`?
→ Fazer contas
- [ ] 3.4
- [x] 3
- [ ] 4
> Com números inteiros, tudo o que vem depois da vírgula desaparece. Não é arredondado.

? Quanto dá `17 % 5`?
→ Fazer contas
- [x] 2
- [ ] 3
- [ ] 3.4
> 17 a dividir por 5 dá 3, resto 2. O operador % dá o resto.

? No início, `int pontos = 10`. O que fica em pontos depois de `pontos = pontos * 2`?
→ Atribuição com =
- [ ] 10
- [ ] 12
- [x] 20
> O lado direito é calculado com o valor antigo 10, e o resultado 20 é guardado em pontos.

? Que linha cria corretamente um número decimal em Java?
→ Agora em Java
- [ ] double preco = 2,5;
- [x] double preco = 2.5;
- [ ] Double preco = 2.5
> Os números decimais escrevem-se com ponto, e no fim há um ponto e vírgula.
:::
