---
titel: Treino de vocabulário
nach: 27
stufe: 3
---

O Ludwig está a aprender inglês. As palavras dele estão num ficheiro CSV, à esquerda em português, à direita em inglês:

::: datei vocabulario.csv
Português;Inglês
cabra;goat
feno;hay
prado;meadow
:::

Como só o ficheiro conhece as palavras, mais tarde podes simplesmente acrescentar linhas novas sem alterar o programa.

::: angeberwissen
Foi Sebastian Leitner quem, em 1972, tornou conhecida a caixa de fichas com várias divisões: as fichas que sabes passam para a divisão seguinte e aparecem menos vezes, as erradas voltam para a primeira. Muitas apps de vocabulário ainda funcionam assim.
:::

::: übung aufgabe-vokabeln
titel: Treino de vocabulário
code: java
auftrag: Pergunta cada palavra do ficheiro: mostra **Como se diz cabra em inglês?** e lê a resposta com `scanner.next()`. Se estiver certa, mostra **Certo!**, senão por exemplo **Errado, é goat.**
  No fim aparece quantas estavam certas, por exemplo **2 de 3 certas**.
start: aufgabe-vokabeln-start.visustruct
test: goat, hay, meadow -> Como se diz cabra em inglês? | Certo! | Como se diz feno em inglês? | Certo! | Como se diz prado em inglês? | Certo! | 3 de 3 certas
test: cow, hay, meadow -> Como se diz cabra em inglês? | Errado, é goat. | Como se diz feno em inglês? | Certo! | Como se diz prado em inglês? | Certo! | 2 de 3 certas
test: goat, feno, prado -> Como se diz cabra em inglês? | Certo! | Como se diz feno em inglês? | Errado, é hay. | Como se diz prado em inglês? | Errado, é meadow. | 1 de 3 certas
braucht: whileSchleife, verzweigung
tipp: Salta a linha de cabeçalho. No ciclo, divide cada linha com `split(";")`: `partes[0]` é a palavra em português, `partes[1]` a palavra em inglês.
tipp: Os textos comparam-se com `resposta.equals(partes[1])`, não com `==`. Conta com `int certas = 0;` e `int contagem = 0;` antes do ciclo.
lösung: aufgabe-vokabeln-loesung.visustruct
:::
