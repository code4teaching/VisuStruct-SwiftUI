---
titel: Comparar formatos
bereich: Ficheiros
kurz: Comparar os mesmos dados em txt, CSV e JSON, escolher o formato certo e converter um ficheiro noutro formato.
---

## Competências que vou adquirir agora

::: kompetenzen
- reconhecer os mesmos dados em txt, CSV e JSON
- comparar pontos fortes e fracos de txt, CSV e JSON
- converter um ficheiro CSV em frases
- converter um ficheiro CSV em JSON
:::

## Os mesmos animais três vezes

O Ludwig guardou os animais do castelo em três ficheiros. Todos dizem o mesmo, só que escrito de outra maneira.

Como texto, tal como se escreveria a uma pessoa:

::: datei animais.txt
Ludwig (bode) tem 7 anos.
Zora (cabra) tem 6 anos.
Raposa (raposa-vermelha) tem 4 anos.
:::

Como tabela em CSV:

::: datei animais.csv
Nome;Espécie;Idade
Ludwig;bode;7
Zora;cabra;6
Raposa;raposa-vermelha;4
:::

Como JSON:

::: datei animais.json
[
  {"nome": "Ludwig", "especie": "bode", "idade": 7},
  {"nome": "Zora", "especie": "cabra", "idade": 6},
  {"nome": "Raposa", "especie": "raposa-vermelha", "idade": 4}
]
:::

## O que sabe fazer cada formato?

| | txt | CSV | JSON |
|---|---|---|---|
| Fácil de ler para pessoas | sim | mais ou menos | mais ou menos |
| Ordem fixa para programas | não | sim, colunas | sim, chaves |
| O que quer dizer um valor? | está na frase | está no cabeçalho | está mesmo antes dele |
| Encaixar (uma lista dentro de uma entrada) | não | difícil | sim |
| Abrir no Excel | não | sim | não |
| Ler em Java | Scanner, BufferedReader | mais `split` | métodos de String ou uma biblioteca |
| Tamanho | pequeno | o mais pequeno | o maior |

Em resumo:

- **txt** para textos que pessoas leem: cartas, notas, um diário.
- **CSV** para tabelas: notas, medições, uma lista de recordes. Todas as linhas têm as mesmas colunas.
- **JSON** para dados com estrutura: jogos guardados, definições, tudo o que circula entre programas e na web.

::: ludwig
Quando a tua aplicação de meteorologia vai buscar a temperatura, a resposta chega quase sempre em JSON. E quando um professor exporta as notas do programa da escola, recebe muitas vezes um ficheiro CSV.
:::

## Exercício: De CSV para frases

::: übung l27-java-saetze
titel: De CSV para frases
code: java
auftrag: Converte `animais.csv` em texto. Para cada animal, escreve uma frase como **Ludwig (bode) tem 7 anos.** no ficheiro `frases.txt`. No fim, mostra **3 frases guardadas**.
start: l27-java-saetze-start.visustruct
test: - -> 3 frases guardadas
datei: frases.txt -> Ludwig (bode) tem 7 anos. | Zora (cabra) tem 6 anos. | Raposa (raposa-vermelha) tem 4 anos.
braucht: whileSchleife
tipp: O código inicial já salta o cabeçalho. Divide cada linha com `String[] partes = linha.split(";");`.
tipp: A frase é `partes[0] + " (" + partes[1] + ") tem " + partes[2] + " anos."`. Conta com `quantidade++` e lê a linha seguinte no fim do ciclo.
lösung: l27-java-saetze-loesung.visustruct
:::

## Exercício: De CSV para JSON

::: übung l27-java-json
titel: De CSV para JSON
code: java
auftrag: Converte `animais.csv` em JSON e guarda-o em `animais-novos.json`, exatamente como `animais.json` acima. No fim, mostra **3 animais guardados**.
start: l27-java-json-start.visustruct
test: - -> 3 animais guardados
datei: animais-novos.json -> [ | {"nome": "Ludwig", "especie": "bode", "idade": 7}, | {"nome": "Zora", "especie": "cabra", "idade": 6}, | {"nome": "Raposa", "especie": "raposa-vermelha", "idade": 4} | ]
braucht: forSchleife, verzweigung
tipp: `linhas[0]` é o cabeçalho. Por isso, começa o ciclo for em `i = 1` e divide `linhas[i]` com `split(";")`.
tipp: Constrói a entrada com `\"`, como na lição 26. A idade é um número e fica sem aspas. Só acrescentas uma vírgula se `i < linhas.length - 1`.
lösung: l27-java-json-loesung.visustruct
:::

## Jogo: Que formato serve?

::: spiel frage
titel: Jogo: Que formato serve?
intro: O Ludwig quer guardar dados e não sabe que formato usar. Ajuda-o. Seis rondas.
antworten: txt | CSV | JSON

runde:
frage: As notas da turma inteira devem ser abertas no Excel.
richtig: CSV
> As notas são uma tabela, e o Excel abre ficheiros CSV diretamente.

runde:
frage: O Ludwig escreve uma carta à Zora.
richtig: txt
> Uma carta é texto para pessoas. Não precisa de colunas nem de chaves.

runde:
frage: Um jogo guardado com nome, nível e uma lista de todas as chaves apanhadas.
richtig: JSON
> Em JSON, uma lista pode ficar encaixada numa entrada. Em CSV dificilmente cabe numa célula.

runde:
frage: Um aparelho de medição guarda a hora e a temperatura a cada minuto, durante um ano inteiro.
richtig: CSV
> Muitas linhas iguais com as mesmas colunas: para isto, o CSV é o mais pequeno. O JSON repetiria as chaves em todas as linhas.

runde:
frage: Uma aplicação de meteorologia vai buscar a previsão a um servidor na internet.
richtig: JSON
> O JSON é o padrão na web. Quase todas as aplicações recebem os dados assim.

runde:
frage: O diário do castelo, em que cada entrada é uma frase curta.
richtig: txt
> Cada linha é uma frase para pessoas. É lida linha a linha, como na lição 24.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo reconhecer os mesmos dados em txt, CSV e JSON. → Os mesmos animais três vezes
- Consigo comparar pontos fortes e fracos de txt, CSV e JSON. → O que sabe fazer cada formato?
- Consigo converter um ficheiro CSV em frases. → Exercício: De CSV para frases
- Consigo converter um ficheiro CSV em JSON. → Exercício: De CSV para JSON
:::

## Teste de conhecimentos

::: quiz
? Que formato o Excel abre diretamente como tabela?
→ O que sabe fazer cada formato?
- [ ] txt
- [x] CSV
- [ ] JSON

? Porque é que um ficheiro JSON é normalmente maior do que um CSV com os mesmos dados?
→ O que sabe fazer cada formato?
- [ ] Porque o JSON guarda mais números.
- [x] Porque as chaves se repetem em cada entrada.
- [ ] Porque o JSON não usa vírgulas.

? Em que formato cada valor diz o que significa?
→ O que sabe fazer cada formato?
- [ ] txt
- [ ] CSV
- [x] JSON
> Em JSON a chave está mesmo antes do valor, por exemplo "idade": 7.

? Liga cada objetivo a um formato.
→ O que sabe fazer cada formato?
= uma carta à Zora -> txt
= a pauta de notas da turma -> CSV
= um jogo guardado com listas -> JSON
:::
