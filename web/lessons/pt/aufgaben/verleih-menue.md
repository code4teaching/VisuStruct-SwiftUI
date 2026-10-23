---
titel: Menu de aluguer
nach: 18
stufe: 2
---

Na máquina de aluguer podes reservar vários veículos, um a seguir ao outro. O menu volta sempre até escolheres **0** para sair.

::: übung aufgabe-verleih
titel: Menu de aluguer
auftrag: Pede sempre uma escolha: 1 = bicicleta elétrica, 2 = trotinete elétrica, 0 = sair. Para 1 mostra **Bicicleta reservada**, para 2 **Trotinete reservada** e para qualquer outro número **Escolha inválida**.
  Para 0, o programa mostra **Adeus** e sai do ciclo com uma Interrupção.
test: 0 -> Adeus
test: 1, 2, 0 -> Bicicleta reservada | Trotinete reservada | Adeus
test: 2, 5, 1, 0 -> Trotinete reservada | Escolha inválida | Bicicleta reservada | Adeus
braucht: endlosschleife, aussprung
tipp: O menu é executado uma e outra vez até alguém escolher 0. Para isso serve bem um ciclo infinito com uma Interrupção.
tipp: Usa um ciclo infinito. Lá dentro vem primeiro a entrada `input: int escolha "1 = bicicleta elétrica, 2 = trotinete elétrica, 0 = sair"`, depois uma seleção sobre `escolha` com os casos `0`, `1`, `2` e `default`. O caso `0` tem a saída e, por baixo, a Interrupção.
lösung: aufgabe-verleih-loesung.visustruct
:::

E agora o mesmo em Java:

::: übung aufgabe-verleih-java
titel: Menu de aluguer em Java
code: java
auftrag: Resolve agora em Java a tarefa de cima. As saídas ficam exatamente iguais.
test: 0 -> Adeus
test: 1, 2, 0 -> Bicicleta reservada | Trotinete reservada | Adeus
test: 2, 5, 1, 0 -> Trotinete reservada | Escolha inválida | Bicicleta reservada | Adeus
braucht: endlosschleife, aussprung
tipp: `while (true) { … }` corre sem fim até aparecer um `break;`.
tipp: Em Java usa aqui `if`/`else if` em vez de `switch`: um `break;` dentro de um `switch` só sai do `switch`, não do ciclo. `if (escolha == 0) { System.out.println("Adeus"); break; } else if (escolha == 1) { … }`.
lösung: aufgabe-verleih-java-loesung.visustruct
:::
