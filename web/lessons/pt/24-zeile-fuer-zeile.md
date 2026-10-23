---
titel: Linha a linha com BufferedReader
bereich: Ficheiros
kurz: Ler com BufferedReader e readLine até chegar null, e ler um ficheiro inteiro de uma vez com Files.
---

## O bolo desapareceu!

Na manhã a seguir à festa, o bolo do Ludwig desapareceu. Felizmente, o castelo tem um diário. Cada linha começa com o dia e a hora:

::: datei diario.txt
Seg 08:15 Ludwig alimenta as cabras
Seg 12:30 Zora lê na torre
Seg 18:00 Raposa passa às escondidas pelo portão
Ter 09:00 Ludwig faz um bolo
Ter 14:45 Lebre traz cenouras
Ter 16:20 Raposa pergunta pela receita
Ter 23:55 O bolo desapareceu
Qua 07:00 Zora encontra migalhas junto à toca da Raposa
:::

Já o conseguias ler com o Scanner da lição 23. Mas, para ficheiros, os profissionais usam muitas vezes o **BufferedReader**.

## Ler com BufferedReader

```
import java.io.*;

BufferedReader leitor = new BufferedReader(new FileReader("diario.txt"));
String linha = leitor.readLine();
while (linha != null) {
    System.out.println(linha);
    linha = leitor.readLine();
}
leitor.close();
```

- `new FileReader("diario.txt")` abre o ficheiro, e `new BufferedReader(…)` põe-lhe uma memória intermédia à volta. Vai buscar o ficheiro em pedaços grandes e por isso é mais rápido com ficheiros longos.
- `readLine()` devolve a linha seguinte. Quando já não há linhas, devolve **null**.
- Por isso, o ciclo repete-se enquanto `linha != null`. No fim de cada volta lê a linha seguinte.

::: diagramm dt-buffered.visustruct
Primeiro ler uma linha, depois verificar, e no fim da volta ler a seguinte.
:::

**null** quer dizer "nada". Não é o texto vazio `""`, mas nenhum texto. Uma variável com `null` não tem métodos: `linha.length()` para então com uma `NullPointerException`. Por isso, verifica sempre primeiro `linha != null`.

| | Scanner | BufferedReader |
|---|---|---|
| Criar | `new Scanner(new File(…))` | `new BufferedReader(new FileReader(…))` |
| Ainda há mais uma linha? | `hasNextLine()` | `readLine()` devolve `null` |
| Linha seguinte | `nextLine()` | `readLine()` |
| Ponto forte | também lê números (`nextInt()`) | rápido, mesmo com ficheiros grandes |

::: ludwig
O ciclo é diferente do ciclo com o Scanner: a primeira linha é lida **antes** do ciclo, e cada uma das seguintes **no fim** da volta. Se te esqueceres da leitura no fim, o programa lê sempre a mesma linha e nunca para.
:::

## Exercício: Quantas vezes aparece a Raposa?

::: übung l24-java-fuchs
titel: Quantas vezes aparece a Raposa?
code: java
auftrag: Lê o diário com o BufferedReader e conta as linhas onde aparece **Raposa**. No fim, mostra **Raposa:** e o número.
start: l24-java-fuchs-start.visustruct
test: - -> Raposa: 3
braucht: whileSchleife, verzweigung
tipp: Antes do ciclo, cria `int quantidade = 0;`. No ciclo verificas `linha.contains("Raposa")`.
tipp: O `linha = leitor.readLine();` fica no fim do ciclo, depois do if.
lösung: l24-java-fuchs-loesung.visustruct
:::

## Fechar automaticamente

Para que o `close()` não seja esquecido, mesmo depois de uma exceção, existe uma forma curta do try: o que é criado entre os parênteses a seguir a `try` é fechado pelo Java sozinho no fim.

```
try (BufferedReader leitor = new BufferedReader(new FileReader("diario.txt"))) {
    String linha = leitor.readLine();
    while (linha != null) {
        System.out.println(linha);
        linha = leitor.readLine();
    }
} catch (IOException e) {
    System.out.println("Falta o diário.");
}
```

Isto chama-se **try-with-resources**. `IOException` apanha todos os erros ao ler e escrever, incluindo um ficheiro em falta.

> Tal como try e catch, o try-with-resources só funciona com Java verdadeiro (lição 22). Na simulação, escreves tu o `close()`.

## O atalho: Files

Desde o Java 11 é ainda mais curto. `Files.readString` lê o ficheiro inteiro de uma vez, como já conheces da lição 17. Com `split("\n")` divides o texto num array de linhas:

```
import java.nio.file.*;

String texto = Files.readString(Path.of("diario.txt"));
String[] linhas = texto.split("\n");
for (int i = 0; i < linhas.length; i++) {
    System.out.println(linhas[i]);
}
```

Agora todas as linhas estão no array. Podes vê-las pela ordem que quiseres, por exemplo de trás para a frente ou só uma sim, uma não.

| Forma | Boa para |
|---|---|
| `Scanner` | ficheiros pequenos, ler números e palavras |
| `BufferedReader` | ficheiros grandes, linha a linha |
| `Files.readString` | ficheiros pequenos que cabem inteiros no programa |

::: ludwig
Um ficheiro com um milhão de linhas é melhor lido linha a linha com o BufferedReader. Com `Files.readString`, o ficheiro inteiro teria de ir de uma vez para a memória.
:::

## Exercício: A entrada mais longa

::: übung l24-java-laengster
titel: A entrada mais longa
code: java
auftrag: No código inicial, as linhas do diário já estão no array `linhas`. Encontra a linha mais longa e mostra-a assim: **Entrada mais longa:** seguido da linha.
start: l24-java-laengster-start.visustruct
test: - -> Entrada mais longa: Qua 07:00 Zora encontra migalhas junto à toca da Raposa
braucht: forSchleife, verzweigung
tipp: Guarda a linha mais longa até agora em `String maisLonga = linhas[0];` e percorre as outras linhas com um ciclo for.
tipp: Se `linhas[i].length() > maisLonga.length()`, então `linhas[i]` passa a ser a mais longa.
lösung: l24-java-laengster-loesung.visustruct
:::

## Jogo: Detetive de ficheiros

::: spiel frage
titel: Jogo: Detetive de ficheiros
intro: Quem levou o bolo? Cada programa procura no **diário** a partir do início. Prevê o que mostra e junta as pistas. Cinco rondas.
frage: O que mostra o programa?

runde:
    String linha = leitor.readLine();
    linha = leitor.readLine();
    System.out.println(linha.substring(10));
- Ludwig alimenta as cabras
- [x] Zora lê na torre
- Seg 12:30 Zora lê na torre
> O segundo `readLine()` devolve a segunda linha. O texto depois da hora começa no índice 10.

runde:
    int n = 0;
    String linha = leitor.readLine();
    while (linha != null) {
        if (linha.startsWith("Ter")) n++;
        linha = leitor.readLine();
    }
    System.out.println(n);
- 3
- [x] 4
- 8
> Quatro entradas são de terça-feira.

runde:
    String linha = leitor.readLine();
    while (linha != null) {
        if (linha.contains("bolo")) {
            System.out.println(linha.substring(4, 9));
        }
        linha = leitor.readLine();
    }
- [x] 09:00\n23:55
- 09:00
- Ter\nTer
> Há duas linhas com "bolo". `substring(4, 9)` recorta a hora.

runde:
    String linha = leitor.readLine();
    String ultima = "";
    while (linha != null) {
        if (linha.contains("Raposa")) ultima = linha;
        linha = leitor.readLine();
    }
    System.out.println(ultima);
- Ter 16:20 Raposa pergunta pela receita
- [x] Qua 07:00 Zora encontra migalhas junto à toca da Raposa
- Seg 18:00 Raposa passa às escondidas pelo portão
> `ultima` é substituída a cada resultado. No fim fica lá o último. "toca da Raposa" também contém "Raposa".

runde:
    String linha = leitor.readLine();
    while (linha != null) {
        if (linha.contains("migalhas")) {
            int junto = linha.indexOf("junto à ");
            System.out.println(linha.substring(junto + 8));
        }
        linha = leitor.readLine();
    }
- [x] toca da Raposa
- junto à toca da Raposa
- migalhas
> As migalhas estão junto à toca da Raposa. A Raposa perguntou pela receita, e às 23:55 o bolo tinha desaparecido. Caso resolvido!
:::

## Lista de verificação

::: checkliste
- Sei ler um ficheiro com BufferedReader e readLine. → Ler com BufferedReader
- Sei que readLine devolve null no fim, e verifico linha != null. → Ler com BufferedReader
- Contei quantas vezes a Raposa aparece no diário. → Exercício: Quantas vezes aparece a Raposa?
- Sei ler um ficheiro inteiro com Files.readString e dividi-lo em linhas com split. → O atalho: Files
- Encontrei a entrada mais longa. → Exercício: A entrada mais longa
:::

## Teste de conhecimentos

::: quiz
? O que devolve readLine() quando o ficheiro chegou ao fim?
- [ ] ""
- [x] null
- [ ] -1
> null quer dizer: já não há mais texto.

? Porque é que no fim do ciclo há outra vez linha = leitor.readLine()?
- [ ] Para fechar o ficheiro.
- [x] Senão linha fica sempre igual e o ciclo nunca para.
- [ ] Para mostrar a primeira linha duas vezes.

? O que faz o try-with-resources?
- [ ] Lê o ficheiro mais depressa.
- [x] Fecha o ficheiro sozinho no fim.
- [ ] Impede qualquer exceção.

? Liga cada forma àquilo para que é boa.
= BufferedReader -> ficheiros grandes, linha a linha
= Files.readString -> ficheiros pequenos de uma vez
= Scanner -> ler números e palavras
:::
