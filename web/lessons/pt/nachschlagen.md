## Elementos básicos

### Instrução

Um único passo. Serve para criar variáveis ou para calcular.

```
int numero = 5
double preco = 2.5
String nome = "Ada"
numero = numero + 1
```

### Tipos de dados

O tipo de dados vem antes do nome da variável.

| Tipo de dados | Significado | Exemplo |
|---|---|---|
| `int` | número inteiro | `int quantidade = 3` |
| `double` | número decimal (com ponto) | `double preco = 2.5` |
| `String` | texto entre aspas duplas | `String nome = "Ada"` |
| `boolean` | valor lógico | `boolean pronto = false` |
| `char` | um único caractere entre aspas simples | `char nota = 'C'` |

`'C'` é um `char`, `"C"` é uma String. Um caractere de um texto obténs com `charAt`: `char primeiro = nome.charAt(0)`. Cada caractere tem um código de caractere: `(int) 'A'` é 65, `(char) 66` é `'B'`.

### Entrada

Pede um valor enquanto o estrutograma é executado e guarda-o numa variável. O texto entre aspas é a pergunta.

```
input: int idade "Quantos anos tens?"
input: double preco "Introduz um preço"
input: String nome "Como te chamas?"
```

### Saída

Mostra um texto ou um valor. Os textos ficam entre aspas; juntas texto e variáveis com `+`.

```
output: "Olá"
output: soma
output: "Tens " + idade + " anos."
```

> Numa saída, `+` junta sempre as partes: com 3 e 4, `output: a + b` mostra 34. Por isso calcula primeiro numa variável, p. ex. `int soma = a + b`, e depois mostra `soma`.

## Decisões

### Decisão

Verifica uma condição. Se for verdadeira, é executado o ramo da esquerda (true), senão o da direita (false).

```
idade >= 18
numero % 2 == 0
nota < 1 || nota > 5
```

### Seleção

Escolhe um de vários casos, consoante o valor de uma variável. Se nenhum caso servir, aplica-se `default`. Acrescentas casos à direita com **Adicionar caso**.

## Ciclos

### Ciclo while

Repete o seu interior **enquanto** a condição for verdadeira. A condição é verificada antes de cada iteração.

```
numero != 1
i < 10
```

### Ciclo do-while

Executa o seu interior **pelo menos uma vez** e só depois verifica a condição.

### Ciclo for

Conta uma variável desde um valor inicial até um limite. Os três campos são Início, Condição e Passo.

```
int i = 0
i < 5
i++
```

### Ciclo infinito

Repete o seu interior sem condição. Uma **Interrupção** lá dentro permite sair dele.

### Interrupção

Sai do ciclo que a rodeia (`break`).

## Subprogramas

### Chamada

Representa um subprograma, p. ex. `calcularSoma()`. Com parâmetros e valor de retorno, o subprograma tem uma linha de cabeçalho como título:

```
int quadrado(int x)       linha de cabeçalho do subprograma
return x * x              devolve o resultado
int q = quadrado(5)       chamada, q fica com 25
mostrarSoma(3, 4)         chamada de um subprograma void
```

## Cálculos e comparações

### Operadores e comparações

- `+ - * /` as quatro operações básicas
- `%` resto de uma divisão (`7 % 2` dá 1)
- `==` igual, `!=` diferente
- `<` `<=` `>` `>=` menor, menor ou igual, maior, maior ou igual
- `&&` e, `||` ou

## Arrays

### Arrays

Vários valores com um só nome. Começa-se a contar em 0.

```
int[] numeros = {3, 7, 1}
output: numeros[0]
int[] vazio = new int[5]
```

Um **array 2D** é uma tabela com linhas e colunas:

```
boolean[][] lugares = new boolean[3][5]
lugares[1][4] = true
output: lugares.length + " filas, " + lugares[0].length + " lugares"
```
