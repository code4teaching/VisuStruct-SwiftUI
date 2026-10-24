---
titel: Verificar o PIN
nach: 12
stufe: 2
---

Numa caixa multibanco tens três tentativas para o teu PIN. Se escreveres um PIN errado três vezes, o cartão fica bloqueado.

::: angeberwissen
John Shepherd-Barron, que instalou o primeiro multibanco em Londres em 1967, queria PINs de seis algarismos. Mas a mulher dele disse que só conseguia decorar quatro. É por isso que o teu PIN tem hoje quatro algarismos.
:::

::: übung aufgabe-pin
titel: Verificar o PIN
auftrag: O PIN certo é 1234. Pede o PIN até estar certo ou até se terem gastado três tentativas. Depois mostra **PIN correto** ou **Cartão bloqueado**.
test: 1234 -> PIN correto
test: 1111, 1234 -> PIN correto
test: 1, 2, 1234 -> PIN correto
test: 1, 2, 3 -> Cartão bloqueado
braucht: doUntilSchleife, verzweigung
tipp: O ciclo termina em dois casos: quando o PIN está certo ou quando se gastaram três tentativas. Conta as tentativas.
tipp: O PIN é pedido pelo menos uma vez, por isso serve um ciclo do-while. Antes dele, cria `int pin = 0` e `int tentativas = 0`. O ciclo repete-se enquanto `pin != 1234 && tentativas < 3`. Depois do ciclo, uma decisão decide o que é mostrado.
lösung: aufgabe-pin-loesung.visustruct
:::

E agora o mesmo em Java:

::: übung aufgabe-pin-java
titel: Verificar o PIN em Java
code: java
auftrag: Resolve agora em Java a tarefa de cima. As saídas ficam exatamente iguais.
test: 1234 -> PIN correto
test: 1111, 1234 -> PIN correto
test: 1, 2, 1234 -> PIN correto
test: 1, 2, 3 -> Cartão bloqueado
braucht: doUntilSchleife, verzweigung
tipp: `do { … } while (…);` pergunta pelo menos uma vez. Depois do `while (…)` há um ponto e vírgula.
tipp: Cria antes `int pin = 0;` e `int tentativas = 0;`. No ciclo: `int entrada = scanner.nextInt();`, `pin = entrada;` e `tentativas++;`. A condição é `pin != 1234 && tentativas < 3`.
lösung: aufgabe-pin-java-loesung.visustruct
:::
