---
titel: Ler e guardar texto
bereich: Ficheiros
kurz: Ler um ficheiro de texto linha a linha com Scanner e guardar um ficheiro com PrintWriter.
---

## Porquê ficheiros?

Tudo o que está em variáveis desaparece assim que o programa termina. Se um programa deve lembrar-se de alguma coisa, por exemplo uma pontuação, uma lista ou notas, guarda os dados num **ficheiro**. Na próxima vez que arranca, volta a ler o ficheiro.

A Zora está livre, e o Ludwig está a preparar uma festa. A lista de compras dele está pronta no ficheiro `compras.txt`:

::: datei compras.txt
Feno
Maçãs
Cenouras
Dentes-de-leão
:::

Um ficheiro com a extensão `.txt` contém só texto, linha a linha. Podes abri-lo com qualquer editor, por exemplo o Bloco de Notas no Windows ou o TextEdit no Mac.

## Ler um ficheiro com Scanner

Já conheces o `Scanner`: `new Scanner(System.in)` lê do teclado. Se lhe deres um ficheiro em vez de `System.in`, ele lê do ficheiro:

```java
import java.io.*;
import java.util.Scanner;

Scanner ficheiro = new Scanner(new File("compras.txt"));
while (ficheiro.hasNextLine()) {
    String linha = ficheiro.nextLine();
    System.out.println(linha);
}
ficheiro.close();
```

| Método | Significado |
|---|---|
| `new File("compras.txt")` | o ficheiro com este nome |
| `hasNextLine()` | Ainda há mais uma linha? `true` ou `false` |
| `nextLine()` | devolve a linha seguinte e avança uma linha |
| `close()` | fecha o ficheiro quando terminas |

O ciclo repete-se enquanto houver mais uma linha. Em cada volta, `nextLine()` vai buscar a linha seguinte. `File` pertence ao pacote `java.io`, por isso precisas de `import java.io.*;`.

::: diagramm dt-lesen.visustruct
É assim que a leitura fica num estrutograma. Experimenta na simulação.
:::

::: ludwig
Imagina o Scanner como um dedo a apontar para uma linha. `nextLine()` lê a linha debaixo do dedo e desce o dedo uma linha. Quando o dedo já está abaixo da última linha, `hasNextLine()` devolve `false`.
:::

## E se o ficheiro não existir?

Se o ficheiro não existir, o Java não o consegue ler e lança uma `FileNotFoundException`. O Java exige que o teu programa conte com isso. Ou apanhas a exceção com try e catch, como na lição 22:

```java
try {
    Scanner ficheiro = new Scanner(new File("compras.txt"));
    // ... ler ...
    ficheiro.close();
} catch (FileNotFoundException e) {
    System.out.println("Falta o ficheiro compras.txt!");
}
```

Ou escreves `throws Exception` a seguir a `main`. Isso quer dizer: "Este método pode lançar uma exceção, eu não trato dela." Nesse caso, o programa para se o ficheiro não existir.

```java
public static void main(String[] args) throws Exception {
```

> O VisuStruct escreve `throws Exception` a seguir a `main` automaticamente assim que o teu programa trabalha com ficheiros. Na simulação, o VisuStruct indica um ficheiro em falta com "Não existe nenhum ficheiro chamado …".

## Exercício: Numerar a lista de compras

::: übung l23-java-nummern
titel: Numerar a lista de compras
code: java
auftrag: Lê `compras.txt` linha a linha e mostra cada linha com o seu número: **1. Feno**, **2. Maçãs** e assim por diante.
start: l23-java-nummern-start.visustruct
test: - -> 1. Feno | 2. Maçãs | 3. Cenouras | 4. Dentes-de-leão
braucht: whileSchleife
tipp: Antes do ciclo, cria `int numero = 1;` e aumenta o número no fim de cada volta.
tipp: A saída é `System.out.println(numero + ". " + linha);`
lösung: l23-java-nummern-loesung.visustruct
:::

## Escrever num ficheiro com PrintWriter

Para escrever existe o `PrintWriter`. Os seus métodos têm os mesmos nomes que os de `System.out`:

```java
PrintWriter saida = new PrintWriter("saudacao.txt");
saida.println("Olá Zora!");
saida.println("Até amanhã, Ludwig");
saida.close();
```

Depois disto, `saudacao.txt` contém:

```
Olá Zora!
Até amanhã, Ludwig
```

- `println` escreve o texto e começa depois uma nova linha, `print` escreve sem nova linha.
- Se o ficheiro já existir, é **substituído**. O conteúdo antigo desaparece.
- Depois da execução, o VisuStruct mostra por baixo da saída o que foi guardado no ficheiro.

::: ludwig
Não te esqueças do `close()`! O PrintWriter junta primeiro o texto numa memória intermédia e só o escreve no ficheiro quando é fechado. Sem `close()` o ficheiro fica vazio. Já perdi assim uma história inteira.
:::

## Exercício: Completar a lista de compras

::: übung l23-java-ergaenzen
titel: Completar a lista de compras
code: java
auftrag: O Ludwig ainda precisa de bolo. Lê `compras.txt` e escreve cada linha no novo ficheiro `compras-nova.txt`. Depois acrescenta **Bolo** como última linha. No fim, mostra quantas linhas foram guardadas: **5 linhas guardadas**.
start: l23-java-ergaenzen-start.visustruct
test: - -> 5 linhas guardadas
datei: compras-nova.txt -> Feno | Maçãs | Cenouras | Dentes-de-leão | Bolo
braucht: whileSchleife
tipp: No ciclo, lês uma linha com `ficheiro.nextLine()` e escreve-la logo a seguir com `saida.println(linha)`.
tipp: Depois do ciclo vem `saida.println("Bolo");`. Fecha os dois ficheiros com `close()`, senão `compras-nova.txt` fica vazio.
lösung: l23-java-ergaenzen-loesung.visustruct
:::

## Jogo: O que fica no ficheiro?

::: spiel frage
titel: Jogo: O que fica no ficheiro?
intro: O Ludwig escreve ficheiros com o PrintWriter. Lê o código e prevê o que fica no ficheiro. Seis rondas.
frage: O que fica depois no ficheiro?

runde:
    PrintWriter saida = new PrintWriter("saudacao.txt");
    saida.println("Olá");
    saida.println("Zora");
    saida.close();
- [x] Olá\nZora
- OláZora
- Zora
> `println` começa uma nova linha depois de cada texto.

runde:
    PrintWriter saida = new PrintWriter("palavra.txt");
    saida.print("Bo");
    saida.print("la");
    saida.println("!");
    saida.close();
- Bo\nla\n!
- [x] Bola!
- Bo la !
> `print` continua a escrever sem nova linha, por isso as partes ficam coladas.

runde:
    PrintWriter saida = new PrintWriter("segredo.txt");
    saida.println("O tesouro está na torre");
- O tesouro está na torre
- [x] Nada, o ficheiro fica vazio.
- O Java indica um erro.
> Sem `close()` o texto nunca chega ao ficheiro. Fica na memória intermédia.

runde:
    // Antes, nota.txt contém: Antigo
    PrintWriter saida = new PrintWriter("nota.txt");
    saida.println("Novo");
    saida.close();
- Antigo\nNovo
- [x] Novo
- Novo\nAntigo
> Um novo PrintWriter substitui o ficheiro. O conteúdo antigo desaparece.

runde:
    PrintWriter saida = new PrintWriter("numeros.txt");
    for (int i = 1; i <= 3; i++) {
        saida.println(i * 2);
    }
    saida.close();
- 1\n2\n3
- 246
- [x] 2\n4\n6
> O ciclo escreve 2, 4 e 6, cada número na sua linha.

runde:
    // compras.txt contém: Feno, Maçãs (uma por linha)
    Scanner ficheiro = new Scanner(new File("compras.txt"));
    PrintWriter saida = new PrintWriter("grande.txt");
    while (ficheiro.hasNextLine()) {
        saida.println(ficheiro.nextLine().toUpperCase());
    }
    ficheiro.close();
    saida.close();
- Feno\nMaçãs
- [x] FENO\nMAÇÃS
- FENOMAÇÃS
> Cada linha é lida, passada para maiúsculas e escrita na sua própria linha.
:::

## Lista de verificação

::: checkliste
- Sei porque é que os programas guardam dados em ficheiros. → Porquê ficheiros?
- Sei ler um ficheiro de texto linha a linha com Scanner, hasNextLine e nextLine. → Ler um ficheiro com Scanner
- Sei porque é que o Java exige try e catch ou throws com ficheiros. → E se o ficheiro não existir?
- Sei escrever um ficheiro com PrintWriter e não me esqueço do close(). → Escrever num ficheiro com PrintWriter
- A minha lista de compras está numerada e completa. → Exercício: Completar a lista de compras
:::

## Teste de conhecimentos

::: quiz
? O que devolve hasNextLine()?
- [ ] a linha seguinte
- [x] true se ainda houver uma linha, senão false
- [ ] o número de linhas
> Com hasNextLine() o ciclo verifica se continua.

? O que acontece se chamares new PrintWriter("lista.txt") para um ficheiro que já existe?
- [ ] O texto novo é acrescentado no fim.
- [x] O ficheiro é substituído.
- [ ] O Java indica um erro.

? Porque é que um ficheiro fica vazio, apesar de println ter sido chamado?
- [ ] Porque println só escreve na consola.
- [x] Porque falta o close().
- [ ] Porque o nome do ficheiro termina em .txt.
> Só o close() escreve a memória intermédia no ficheiro.

? Liga cada método à sua tarefa.
= nextLine() -> lê a linha seguinte
= println(texto) -> escreve uma linha
= close() -> fecha o ficheiro
:::
