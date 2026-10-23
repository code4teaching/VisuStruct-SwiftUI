---
titel: Strings
bereich: Fundamentos
kurz: Trabalhar com texto: ler caracteres, recortar partes, pesquisar, comparar e dividir.
---

## Um texto é uma fila de caracteres

Já conheces `String`: `String nome = "Ludwig"`. Na informática, um texto destes chama-se **string** (em inglês, “fio”), porque os caracteres ficam pendurados uns a seguir aos outros como contas num fio. Também se diz **cadeia de caracteres**. Cada caractere tem um lugar com um índice, tal como num array. Também aqui **se começa a contar em 0**: o primeiro caractere está a 0 passos do início.

::: grafik zk-zeichen.svg
Os dez caracteres de “Passatempo” com os seus índices de 0 a 9.
:::

Uma String traz consigo **métodos**. Escreves o nome da variável, um ponto e o método:

- `palavra.length()` dá o número de caracteres, aqui 10.
- `palavra.charAt(0)` dá o caractere com o índice 0, aqui `'P'`.

> Nas Strings escreves `length()` **com** parênteses, nos arrays `length` **sem**. Infelizmente, o Java é mesmo assim.

Em Java, um único caractere tem o tipo de dados `char`. Um `char` fica entre aspas **simples**: `'P'`. Uma String fica entre aspas duplas: `"P"`.

```
char primeiro = palavra.charAt(0)
char ultimo = palavra.charAt(palavra.length() - 1)
```

Tal como num array, o último caractere tem o índice `length() - 1`.

## Recortar partes

Com `substring` recortas uma parte do texto:

- `palavra.substring(0, 5)` dá os caracteres desde o índice 0 **até mesmo antes** do índice 5, ou seja, `"Passa"`.
- `palavra.substring(5)` dá tudo desde o índice 5 até ao fim, ou seja, `"tempo"`.

O fim **não** está incluído. Dá jeito: `substring(0, 5)` dá exatamente 5 caracteres.

::: diagramm zk-zeichen.visustruct
Todos os métodos desta lição num exemplo. Percorre-o na simulação e compara cada saída com a imagem.
:::

## Pesquisar e comparar

Mais métodos de que precisas muitas vezes:

| Método | Significado | Exemplo com `"Passatempo"` |
|---|---|---|
| `indexOf("tempo")` | Onde começa o texto? | 5 |
| `indexOf("x")` | não encontrado | -1 |
| `contains("sat")` | O texto aparece? | true |
| `toUpperCase()` | tudo em maiúsculas | PASSATEMPO |
| `toLowerCase()` | tudo em minúsculas | passatempo |
| `equals("Passatempo")` | o mesmo texto? | true |

> Em Java comparas duas Strings com `equals`, não com `==`. Já dois caracteres (`char`) comparas com `==`, p. ex. `palavra.charAt(i) == 'a'`.

::: angeberwissen
Experimenta `"Ludwig".equals("ludwig")`. A resposta é false! Para um computador, L e l são caracteres completamente diferentes. Lá dentro, cada caractere é guardado como um número: L é 76 e l é 108. Esta numeração chama-se ASCII e é de 1963. Mééé, portanto, para um computador, Ludwig e ludwig são dois bodes diferentes. Eu sou o do L maiúsculo.
:::

## Caractere a caractere

Com um ciclo for percorres um texto caractere a caractere. O índice `i` vai de 0 a `palavra.length() - 1`, tal como num array:

::: diagramm zk-zaehlen.visustruct
Conta quantas vezes aparece a letra a. Na simulação, experimenta “banana” e observa i e quantidade.
:::

## Dividir com split

Muitas vezes há várias informações numa só linha, separadas por um caractere, p. ex. `"Ludwig;bode;7"`. Com `split` cortas a linha nesse caractere. O resultado é um **array de Strings**:

```
String[] partes = linha.split(";")
```

Depois disso, `partes[0]` é `"Ludwig"`, `partes[1]` é `"bode"` e `partes[2]` é `"7"`. Com `partes.length` descobres quantas partes há.

::: diagramm zk-split.visustruct
A linha é dividida no ponto e vírgula, e cada parte é mostrada com o seu índice.
:::

> Os ficheiros CSV, que conheces das folhas de cálculo, são feitos da mesma maneira: uma linha por registo, com os valores separados por vírgula ou ponto e vírgula.

## Exercício: Iniciais

::: übung zk-initialen
titel: Iniciais
auftrag: Pede um nome próprio e um apelido e mostra as iniciais. Ou seja, para Ludwig Bode fica `L. B.`
test: Ludwig, Bode -> L. B.
test: Ada, Lovelace -> A. L.
test: Ben, Shneiderman -> B. S.
braucht: anweisung
tipp: A inicial é a primeira letra de um nome. Que método dá o caractere numa determinada posição?
tipp: `nome.charAt(0)` dá a primeira letra. A saída fica então `nome.charAt(0) + ". " + apelido.charAt(0) + "."`
lösung: zk-initialen-loesung.visustruct
:::

## Exercício: Ao contrário

::: übung zk-rueckwaerts
titel: Ao contrário
auftrag: Pede uma palavra e mostra-a ao contrário. Ludwig passa a `giwduL`.
test: Ludwig -> giwduL
test: Ana -> anA
test: a -> a
braucht: forSchleife
tipp: Percorre a palavra caractere a caractere, mas de trás para a frente, e vai construindo um novo texto.
tipp: Cria `String invertida = ""`. O ciclo começa no último índice `palavra.length() - 1` e conta para trás até 0 com `i--`. Em cada iteração acrescentas `palavra.charAt(i)` no fim.
lösung: zk-rueckwaerts-loesung.visustruct
:::

## Exercício: Contar palavras

::: übung zk-woerter
titel: Contar palavras
auftrag: Pede uma frase e mostra quantas palavras tem, p. ex. `Palavras: 5` para “O Ludwig é um bode”. As palavras estão separadas por exatamente um espaço.
test: O Ludwig é um bode -> Palavras: 5
test: Olá -> Palavras: 1
test: Eu gosto de cabras -> Palavras: 4
braucht: anweisung
tipp: Entre as palavras há sempre um espaço. Que método divide um texto num caractere?
tipp: Divide a frase num array de Strings com `frase.split(" ")`. O seu comprimento é o número de palavras.
lösung: zk-woerter-loesung.visustruct
:::

## Agora em Java

Os métodos desta lição já são Java. Um programa completo com um texto fica assim:

```
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Como te chamas?");
String nome = scanner.next();
System.out.println("Olá " + nome.toUpperCase() + "!");
System.out.println("O teu nome tem " + nome.length() + " letras.");
```

- `scanner.next()` lê uma palavra, ou seja, texto até ao próximo espaço. Para números continuas a usar `scanner.nextInt()`.
- O texto fica entre aspas **duplas** `"Ludwig"`, um único carácter entre aspas **simples** `'L'`.
- Depois de `length()`, `toUpperCase()` e dos outros métodos há sempre parênteses curvos, mesmo quando não há nada lá dentro.
- Comparas dois textos com `equals`. Cada letra conta: `"Ludwig".equals("ludwig")` é false.

::: übung l17-java-passwort
titel: Verificar a palavra-passe
code: java
auftrag: Escreve em Java um programa que pergunta pela palavra-passe. Se for **Ludwig**, mostra **Bem-vindo!**, senão **Palavra-passe errada**.
  Atenção às maiúsculas e minúsculas: `ludwig` está errado.
test: Ludwig -> Bem-vindo!
test: ludwig -> Palavra-passe errada
test: Geißbock -> Palavra-passe errada
braucht: verzweigung
tipp: Lê a palavra-passe com `scanner.next()` para uma variável String. Depois comparas numa decisão.
tipp: A condição é `entrada.equals("Ludwig")`. Em Java, `==` não compara textos de forma fiável.
lösung: l17-java-passwort-loesung.visustruct
:::

## Lista de verificação

::: checkliste
- Sei que os caracteres de uma String também se contam a partir de 0. → Um texto é uma fila de caracteres
- Sei trabalhar com `length()` e `charAt(i)`. → Um texto é uma fila de caracteres
- Sei recortar uma parte de um texto com `substring`. → Recortar partes
- Conheço `indexOf`, `contains`, `toUpperCase` e `equals`. → Pesquisar e comparar
- Sei percorrer um texto caractere a caractere com um ciclo. → Caractere a caractere
- Sei dividir um texto num array de Strings com `split`. → Dividir com split
- Sei ler um texto em Java e compará-lo com `equals`. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? Quanto dá `"Ludwig".charAt(1)`?
- [ ] L
- [x] u
- [ ] d
> Começa-se a contar em 0: L tem o índice 0, u o índice 1.

? Quanto dá `"Estrutura".substring(0, 6)`?
- [x] Estrut
- [ ] Estrutu
- [ ] strutu
> Os caracteres com os índices 0 a 5. O fim 6 não está incluído.

? Uma palavra tem 7 caracteres. Que índice tem o último caractere?
- [ ] 7
- [x] 6
- [ ] 8
> Tal como num array: sempre um a menos do que o comprimento.

? Como comparas duas Strings quanto ao conteúdo em Java?
- [ ] a == b
- [x] a.equals(b)
- [ ] a = b

? Associa cada método ao que dá para `"Passatempo"`.
= length() -> 10
= charAt(0) -> P
= indexOf("tempo") -> 5
= substring(5) -> tempo

? Que condição verifica em Java se `entrada` contém o texto Ludwig?
- [ ] entrada = "Ludwig"
- [ ] entrada == 'Ludwig'
- [x] entrada.equals("Ludwig")
> Comparas textos com equals. As aspas simples são só para um único carácter.
:::
