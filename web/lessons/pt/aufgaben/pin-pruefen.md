---
titel: Verificar o PIN
nach: 12
stufe: 2
---

Numa caixa multibanco tens três tentativas para o teu PIN. Se escreveres um PIN errado três vezes, o cartão fica bloqueado.

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
