---
titel: Tabelas em CSV
bereich: Ficheiros
kurz: Ler uma tabela num ficheiro CSV, dividir cada linha com split e fazer contas com os números.
---

## Uma tabela num ficheiro de texto

A professora Cabra, da escola do castelo, guardou as notas da turma numa tabela. Como na Alemanha, 1 é a melhor nota e 6 a pior:

| Nome | Matemática | Alemão | Inglês |
|---|---|---|---|
| Ludwig | 2 | 3 | 1 |
| Zora | 1 | 2 | 2 |
| Raposa | 4 | 3 | 5 |
| Lebre | 2 | 1 | 3 |

No ficheiro, a tabela fica assim:

::: datei turma.csv
Nome;Matemática;Alemão;Inglês
Ludwig;2;3;1
Zora;1;2;2
Raposa;4;3;5
Lebre;2;1;3
:::

Isto é um **ficheiro CSV**. CSV quer dizer "Comma-Separated Values", ou seja, "valores separados por vírgulas". Cada linha é uma linha da tabela, e as colunas estão separadas por um carácter separador. Em Portugal e na Alemanha usa-se normalmente o **ponto e vírgula** `;`, porque a vírgula já aparece em números como `2,5`.

- A primeira linha é o **cabeçalho**. Diz o que está em cada coluna.
- Cada uma das linhas seguintes é um **registo**, aqui um aluno ou uma aluna.
- O Excel, o LibreOffice e o Numbers abrem ficheiros CSV diretamente como tabela.

## Dividir uma linha com split

Já conheces o `split(";")` da lição 17. Divide um texto em cada ponto e vírgula e devolve um array:

```java
String linha = "Zora;1;2;2";
String[] partes = linha.split(";");
// partes[0] é "Zora", partes[1] é "1", partes[2] é "2", partes[3] é "2"
```

Depois disto, as notas ainda são **texto**. Só podes fazer contas com elas depois de as transformares num número com `Integer.parseInt`:

```java
int matematica = Integer.parseInt(partes[1]);
```

::: diagramm dt-csv.visustruct
Dividir uma linha CSV e ler a nota de Matemática como número.
:::

## Ler o ficheiro inteiro

Para o ficheiro inteiro, combinas o BufferedReader da lição 24 com `split`. O cabeçalho não tem notas, por isso lês essa linha antes do ciclo e saltas por cima dela:

```java
BufferedReader leitor = new BufferedReader(new FileReader("turma.csv"));
String linha = leitor.readLine();   // cabeçalho
linha = leitor.readLine();          // primeiro registo
while (linha != null) {
    String[] partes = linha.split(";");
    System.out.println(partes[0] + ": Matemática " + partes[1]);
    linha = leitor.readLine();
}
leitor.close();
```

::: ludwig
Sem o segundo `readLine()` antes do ciclo, o cabeçalho vai parar ao ciclo. Aí, `Integer.parseInt("Matemática")` tenta fazer um número a partir da palavra, e o Java para com uma `NumberFormatException`.
:::

## Exercício: Média de Matemática

::: übung l25-java-schnitt
titel: Média de Matemática
code: java
auftrag: Calcula a média das notas de Matemática. Salta o cabeçalho, soma as notas de Matemática (coluna 1) e divide pelo número de registos. Mostra **Média de Matemática:** e a média.
start: l25-java-schnitt-start.visustruct
test: - -> Média de Matemática: 2.25
braucht: whileSchleife
tipp: Antes do ciclo, cria `double soma = 0;` e `int quantidade = 0;`. Com `double`, nada é cortado na divisão.
tipp: No ciclo: `String[] partes = linha.split(";");`, depois `soma = soma + Integer.parseInt(partes[1]);` e `quantidade++;`.
lösung: l25-java-schnitt-loesung.visustruct
:::

## Exercício: Melhor nota a Inglês

::: übung l25-java-beste
titel: Melhor nota a Inglês
code: java
auftrag: Quem tem a melhor nota a Inglês (coluna 3)? Mostra **Melhor nota a Inglês:**, o nome e, entre parênteses, a nota.
start: l25-java-beste-start.visustruct
test: - -> Melhor nota a Inglês: Ludwig (1)
braucht: whileSchleife, verzweigung
tipp: Guarda a melhor nota até agora em `int melhorNota = 7;` e o nome em `String melhorNome = "";`. Qualquer nota verdadeira é melhor do que 7.
tipp: Se `nota < melhorNota`, guardas a nova nota e `partes[0]` como nome.
lösung: l25-java-beste-loesung.visustruct
:::

## Pontos fortes e fracos do CSV

| Bom | Difícil |
|---|---|
| As tabelas ocupam pouco espaço. | Se o separador aparecer no texto, por exemplo `Lebre;muito bem; esforçada`, a linha parte-se em partes a mais. |
| O Excel e outros programas abrem o ficheiro diretamente. | Tudo é uma tabela plana. Se um animal tiver várias comidas preferidas, isso não cabe bem numa célula. |
| Qualquer programa o consegue ler com `split`. | O ficheiro não diz se `1` é um número ou um texto. |

::: ludwig
O Excel guarda ficheiros CSV com ponto e vírgula em Portugal e na Alemanha, mas com vírgula em Inglaterra e nos EUA. Por isso, quem abre um ficheiro de outro país às vezes vê tudo numa única coluna.
:::

## Jogo: Linha estragada

::: spiel bombe
titel: Jogo: Linha estragada
intro: Em cada ficheiro CSV há **exatamente uma linha estragada**, e a bomba está a contar. Compara cada linha com o cabeçalho e toca na linha estragada antes que o tempo acabe. Cinco rondas, 20 segundos cada.
zeit: 20
daten: csv

runde:
    Nome;Matemática;Alemão;Inglês
    Ludwig;2;3;1
    Zora;1
    Raposa;4;3;5
frage: Cada linha precisa de quatro colunas.
fehler: 3
besser: Zora;1;2;2
> Faltam duas notas à Zora. Então `partes[3]` não existe, e o Java para com uma `ArrayIndexOutOfBoundsException`.

runde:
    Nome;Nota;Comentário
    Ludwig;2;trabalha bem em equipa
    Lebre;1;muito bem; esforçada
    Zora;1;lê muito
frage: Cada linha precisa de três colunas.
fehler: 3
besser: Lebre;1;muito bem, esforçada
> O ponto e vírgula no comentário separa uma quarta coluna. O separador não pode aparecer no texto.

runde:
    Nome;Matemática;Alemão;Inglês
    Ludwig;2;3;1
    Zora;1;2;2
    Raposa,4,3,5
frage: O separador é o ponto e vírgula.
fehler: 4
besser: Raposa;4;3;5
> Aqui há vírgulas em vez de pontos e vírgulas. `split(";")` não encontra nenhum ponto e vírgula e devolve a linha inteira como uma única parte.

runde:
    Nome;Matemática;Alemão;Inglês
    Lebre;2;1;3
    Raposa;quatro;3;5
    Ludwig;2;3;1
frage: As notas são números.
fehler: 3
besser: Raposa;4;3;5
> `Integer.parseInt("quatro")` não consegue fazer um número a partir da palavra e lança uma `NumberFormatException`.

runde:
    Nome;Matemática;Alemão;Inglês
    Zora;1;2;2
    Lebre;2;1;3
    Ludwig;2;;1
frage: Nenhum campo pode estar vazio.
fehler: 4
besser: Ludwig;2;3;1
> Entre os dois pontos e vírgulas não há nada. `Integer.parseInt("")` lança uma `NumberFormatException`.
:::

## Lista de verificação

::: checkliste
- Sei como é feito um ficheiro CSV: cabeçalho, registos, separador. → Uma tabela num ficheiro de texto
- Sei dividir uma linha com split e fazer dela um número com Integer.parseInt. → Dividir uma linha com split
- Salto o cabeçalho antes de fazer contas. → Ler o ficheiro inteiro
- Calculei a média de Matemática. → Exercício: Média de Matemática
- Encontrei a melhor nota a Inglês. → Exercício: Melhor nota a Inglês
- Conheço um ponto forte e um ponto fraco do CSV. → Pontos fortes e fracos do CSV
:::

## Teste de conhecimentos

::: quiz
? O que devolve "Lebre;2;1;3".split(";")[2]?
- [ ] "2"
- [x] "1"
- [ ] 1
> A contagem começa em 0. E o resultado é um texto, não um número.

? Porque é que o programa chama readLine() duas vezes antes do ciclo?
- [ ] Para ler o ficheiro mais depressa.
- [x] A primeira linha é o cabeçalho, sem notas. É saltada.
- [ ] Porque readLine precisa sempre de duas linhas.

? O que acontece com Integer.parseInt("Matemática")?
- [ ] Devolve 0.
- [x] O Java lança uma NumberFormatException.
- [ ] Devolve o comprimento da palavra.

? Liga.
= cabeçalho -> diz o que está nas colunas
= registo -> uma linha com valores
= separador -> separa as colunas, muitas vezes ;
:::
