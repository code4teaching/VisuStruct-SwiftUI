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
