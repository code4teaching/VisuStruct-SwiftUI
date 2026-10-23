---
titel: Maior de idade?
nach: 8
stufe: 1
---

No cinema, na carta de condução ou para votar: muitas vezes interessa saber se alguém já tem 18 anos.

::: übung aufgabe-volljaehrig
titel: Maior de idade?
auftrag: Pede a idade. Se a pessoa tiver 18 anos ou mais, mostra **maior de idade**, senão **menor de idade**.
test: 18 -> maior de idade
test: 35 -> maior de idade
test: 17 -> menor de idade
test: 6 -> menor de idade
braucht: verzweigung
tipp: Há duas saídas possíveis, por isso precisas de uma decisão.
tipp: Lê a idade com `input: int idade "Quantos anos tens?"`. A condição da decisão é `idade >= 18`. Garante que 18 já conta como maior de idade.
lösung: aufgabe-volljaehrig-loesung.visustruct
:::

E agora o mesmo em Java:

::: übung aufgabe-volljaehrig-java
titel: Maior de idade? em Java
code: java
auftrag: Resolve agora em Java a tarefa de cima. As saídas ficam exatamente iguais.
test: 18 -> maior de idade
test: 35 -> maior de idade
test: 17 -> menor de idade
test: 6 -> menor de idade
braucht: verzweigung
tipp: Lê a idade com `int idade = scanner.nextInt();`.
tipp: `if (idade >= 18) { … } else { … }`, com um `System.out.println(…)` em cada ramo.
lösung: aufgabe-volljaehrig-loesung.visustruct
:::
