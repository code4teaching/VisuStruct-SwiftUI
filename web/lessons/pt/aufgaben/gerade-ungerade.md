---
titel: Par ou ímpar
nach: 8
stufe: 1
---

Um número é par se não sobrar resto quando o divides por 2. O resto calcula-se com `%`: `8 % 2` dá 0, `7 % 2` dá 1.

::: übung aufgabe-gerade
titel: Par ou ímpar
auftrag: Pede um número inteiro. Mostra se é par ou ímpar. Para 4 a saída é **4 é par**, para 7 **7 é ímpar**.
test: 4 -> 4 é par
test: 7 -> 7 é ímpar
test: 0 -> 0 é par
test: 15 -> 15 é ímpar
braucht: verzweigung
tipp: Uma decisão escolhe entre par e ímpar. Par quer dizer: divisível por 2 sem resto.
tipp: A condição é `numero % 2 == 0`. Na saída juntas o número e o texto com `+`, p. ex. `numero + " é par"`.
lösung: aufgabe-gerade-loesung.visustruct
:::

E agora o mesmo em Java:

::: übung aufgabe-gerade-java
titel: Par ou ímpar em Java
code: java
auftrag: Resolve agora em Java a tarefa de cima. As saídas ficam exatamente iguais.
test: 4 -> 4 é par
test: 7 -> 7 é ímpar
test: 0 -> 0 é par
test: 15 -> 15 é ímpar
braucht: verzweigung
tipp: Lês um número com `int numero = scanner.nextInt();`. Antes disso perguntas com `System.out.println(…)`.
tipp: `if (numero % 2 == 0) { … } else { … }`. A saída é `System.out.println(numero + " é par");`.
lösung: aufgabe-gerade-loesung.visustruct
:::
