---
titel: Dados em JSON
bereich: Ficheiros
kurz: Perceber ficheiros JSON, tirar valores com indexOf e substring e escrever JSON tu mesmo.
---

## Competências que vou adquirir agora

::: kompetenzen
- reconhecer objetos, chaves, valores e listas em JSON
- tirar um valor de uma linha JSON com indexOf e substring
- mostrar todos os valores de uma chave de um ficheiro JSON
- construir e guardar uma entrada JSON com + e \"
- guardar dados num ficheiro JSON
- nomear um ponto forte e um ponto fraco do JSON
:::

## Dados com nomes

O zoo do castelo guarda os seus animais num ficheiro `zoo.json`:

::: datei zoo.json
{
  "zoo": "Zoo do Castelo",
  "animais": [
    {"nome": "Ludwig", "especie": "bode", "idade": 7},
    {"nome": "Zora", "especie": "cabra", "idade": 6},
    {"nome": "Raposa", "especie": "raposa-vermelha", "idade": 4},
    {"nome": "Lebre", "especie": "lebre", "idade": 2}
  ]
}
:::

Isto é **JSON**, a "JavaScript Object Notation". Quase todas as aplicações web e todos os jogos enviam e guardam dados assim. Ao contrário de um ficheiro CSV, antes de cada valor está o seu **nome**, a **chave**.

| Carácter | Significado | Exemplo |
|---|---|---|
| `{ … }` | um **objeto**: pares de chave e valor | `{"nome": "Zora", "idade": 6}` |
| `"chave": valor` | um par, separado por dois pontos | `"idade": 6` |
| `[ … ]` | uma **lista** de valores, como um array | `"animais": [ … ]` |
| `,` | separa os pares e as entradas de uma lista | |
| `"…"` | um texto. Números e `true`/`false` ficam sem aspas. | `"cabra"`, `6` |

Objetos e listas podem ser **encaixados** uns nos outros: o objeto do zoo contém a lista `animais`, e cada animal é outra vez um objeto. Tal como nos arrays, a lista conta a partir de 0: `animais[1].nome` é `"Zora"`.

::: angeberwissen
Foi Douglas Crockford quem tornou o JSON conhecido no início dos anos 2000. Na licença do seu programa de JSON escreveu: “O software deve ser usado para o Bem, não para o Mal.” Por isso, a empresa IBM perguntou se o podia usar na mesma. Ele respondeu que a IBM e os seus clientes também o podiam usar para o Mal.
:::

## Tirar um valor

Os profissionais leem JSON com uma biblioteca, por exemplo o **Gson**. Ela não faz parte do Java e tem de ser adicionada primeiro. Para o nosso ficheiro do zoo chegam os métodos de String da lição 17, porque cada animal está na sua própria linha.

Em Java, escreves umas aspas dentro de um texto como `\"`. Assim, o texto `"\"nome\": \""` é `"nome": "`, exatamente o que está antes de cada nome.

```java
String linha = "{\"nome\": \"Zora\", \"especie\": \"cabra\", \"idade\": 6},";
int inicio = linha.indexOf("\"nome\": \"") + 9;
int fim = linha.indexOf("\"", inicio);
String nome = linha.substring(inicio, fim);
```

- `indexOf("\"nome\": \"")` encontra o início de `"nome": "`. São 9 caracteres, por isso o nome começa 9 caracteres mais à frente.
- `indexOf("\"", inicio)` procura as aspas seguintes **a partir de** `inicio`. É aí que o nome acaba.
- `substring(inicio, fim)` recorta o nome: `Zora`.

::: diagramm dt-json.visustruct
Tirar o nome de uma linha JSON.
:::

## Exercício: Todos os nomes do zoo

::: übung l26-java-namen
titel: Todos os nomes do zoo
code: java
auftrag: Lê `zoo.json` linha a linha. Em cada linha que contém `"nome"`, mostra só o nome.
start: l26-java-namen-start.visustruct
test: - -> Ludwig | Zora | Raposa | Lebre
braucht: whileSchleife, verzweigung
tipp: Verifica com `linha.contains("\"nome\"")` se há um nome na linha. As outras linhas são saltadas.
tipp: Dentro do if: `int inicio = linha.indexOf("\"nome\": \"") + 9;`, depois `int fim = linha.indexOf("\"", inicio);` e `System.out.println(linha.substring(inicio, fim));`.
lösung: l26-java-namen-loesung.visustruct
:::

## Escrever JSON

Para escrever, juntas o texto com `+` e escreves-o no ficheiro com o PrintWriter da lição 23. Os textos em JSON precisam de aspas, portanto `\"` no texto Java, os números não:

```java
String nome = "Zora";
int pontos = 15;
String entrada = "{\"nome\": \"" + nome + "\", \"pontos\": " + pontos + "}";
// entrada é {"nome": "Zora", "pontos": 15}
```

Numa lista há uma vírgula entre as entradas, mas **nenhuma** depois da última. Isso verificas com um if.

::: ludwig
Umas aspas esquecidas ou uma vírgula a mais, e nenhum programa consegue ler o ficheiro. O JSON é rigoroso. Por isso, os profissionais também usam uma biblioteca para escrever.
:::

## Exercício: Guardar pontos em JSON

::: übung l26-java-schreiben
titel: Guardar pontos em JSON
code: java
auftrag: Guarda os pontos do torneio de perguntas como lista em `pontos.json`. Cada linha contém um objeto com **nome** e **pontos**, e entre os objetos há uma vírgula. No fim, mostra **3 entradas guardadas**.
start: l26-java-schreiben-start.visustruct
test: - -> 3 entradas guardadas
datei: pontos.json -> [ | {"nome": "Ludwig", "pontos": 12}, | {"nome": "Zora", "pontos": 15}, | {"nome": "Raposa", "pontos": 9} | ]
braucht: forSchleife, verzweigung
tipp: Percorre os arrays com `for (int i = 0; i < nomes.length; i++)`. Constrói a entrada com `"  {\"nome\": \"" + nomes[i] + "\", \"pontos\": " + pontos[i] + "}"`.
tipp: Se `i < nomes.length - 1`, acrescentas ainda `","`. Depois do ciclo, escreve `"]"` e fecha o ficheiro.
lösung: l26-java-schreiben-loesung.visustruct
:::

## Pontos fortes e fracos do JSON

| Bom | Difícil |
|---|---|
| Cada valor tem um nome. Vê-se logo o que `6` quer dizer. | O ficheiro é mais longo do que um CSV, porque as chaves aparecem em todas as linhas. |
| Os dados podem ser encaixados, por exemplo uma lista dentro de um objeto. | O Java não lê JSON sozinho. É precisa uma biblioteca como o Gson. |
| O JSON é o padrão na web. Quase todas as linguagens de programação o conhecem. | Um carácter a mais ou a menos torna o ficheiro inteiro ilegível. |

## Jogo: Qual é a chave?

::: spiel frage
titel: Jogo: Qual é a chave?
intro: O Ludwig procura valores em ficheiros JSON. Lê o ficheiro e diz qual é o valor pedido. Cinco rondas.

runde:
    {"nome": "Zora", "especie": "cabra", "idade": 6}
frage: Qual é o valor de **idade**?
- "idade"
- [x] 6
- "cabra"
> Antes dos dois pontos está a chave, depois está o valor. Os números ficam sem aspas.

runde:
    {
      "animais": [
        {"nome": "Ludwig", "idade": 7},
        {"nome": "Zora", "idade": 6},
        {"nome": "Raposa", "idade": 4}
      ]
    }
frage: O que é **animais[1].nome**?
- Ludwig
- [x] Zora
- Raposa
> A lista conta a partir de 0, como um array. `animais[1]` é o segundo animal.

runde:
    {
      "zoo": "Zoo do Castelo",
      "chefe": {"nome": "Ludwig", "especie": "bode"}
    }
frage: Como chegas a **bode**?
- [x] chefe.especie
- especie
- zoo.chefe.especie
> `especie` está dentro do objeto `chefe`. Por isso o caminho passa por `chefe`.

runde:
    {
      "nome": "Lebre",
      "comidaPreferida": ["cenouras", "trevo", "dentes-de-leão"]
    }
frage: O que é **comidaPreferida[2]**?
- trevo
- cenouras
- [x] dentes-de-leão
> O índice 0 é cenouras, o 1 é trevo e o 2 é dentes-de-leão. Algo assim dificilmente cabe numa célula em CSV.

runde:
    {"nome": "Raposa", "idade": 4, "comFome": true}
frage: Que chave tem um valor lógico?
- nome
- idade
- [x] comFome
> `true` e `false` ficam sem aspas, como os números. Em Java isto seria um `boolean`.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo reconhecer objetos, chaves, valores e listas em JSON. → Dados com nomes
- Consigo tirar um valor de uma linha JSON com indexOf e substring. → Tirar um valor
- Consigo mostrar todos os valores de uma chave de um ficheiro JSON. → Exercício: Todos os nomes do zoo
- Consigo construir e guardar uma entrada JSON com + e \". → Escrever JSON
- Consigo guardar dados num ficheiro JSON. → Exercício: Guardar pontos em JSON
- Consigo nomear um ponto forte e um ponto fraco do JSON. → Pontos fortes e fracos do JSON
:::

## Teste de conhecimentos

::: quiz
? O que está em JSON antes de cada valor?
→ Dados com nomes
- [ ] o número da linha
- [x] a sua chave, por exemplo "nome"
- [ ] um ponto e vírgula
> A chave e o valor estão separados por dois pontos.

? Como escreves umas aspas dentro de um texto Java?
→ Escrever JSON
- [ ] ""
- [x] \"
- [ ] '"'

? Em {"animais": [{"nome": "Ludwig"}, {"nome": "Zora"}]}, qual é o valor de animais[0].nome?
→ Dados com nomes
- [x] Ludwig
- [ ] Zora
- [ ] animais
> A lista conta a partir de 0.

? Liga.
→ Pontos fortes e fracos do JSON
= { } -> um objeto com chaves e valores
= [ ] -> uma lista
= : -> separa a chave do valor
:::
