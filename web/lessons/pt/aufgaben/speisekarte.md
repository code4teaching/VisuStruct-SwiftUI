---
titel: Ementa
nach: 10
stufe: 1
---

Na cantina da escola pedes por número. O programa diz-te que prato corresponde ao número.

::: übung aufgabe-speisekarte
titel: Ementa
auftrag: Pede um número. Para 1 mostra **Salada grega**, para 2 **Bacalhau à Brás** e para 3 **Wrap de falafel**. Para qualquer outro número mostra **Escolhe um número válido**.
test: 1 -> Salada grega
test: 2 -> Bacalhau à Brás
test: 3 -> Wrap de falafel
test: 7 -> Escolhe um número válido
braucht: fallauswahl
tipp: Para vários números fixos serve uma seleção. O que acontece com todos os outros números?
tipp: Lê o número com `input: int prato "Que prato?"`. A seleção verifica `prato`, e os casos chamam-se `1`, `2` e `3`. Todos os outros números vão parar ao caso `default`.
lösung: aufgabe-speisekarte-loesung.visustruct
:::

E agora o mesmo em Java:

::: übung aufgabe-speisekarte-java
titel: Ementa em Java
code: java
auftrag: Resolve agora em Java a tarefa de cima. As saídas ficam exatamente iguais.
test: 1 -> Salada grega
test: 2 -> Bacalhau à Brás
test: 3 -> Wrap de falafel
test: 7 -> Escolhe um número válido
braucht: fallauswahl
tipp: Em Java isto é uma seleção com `switch (prato) { … }`.
tipp: Cada caso é assim: `case 1 -> { System.out.println("…"); }`. Para todos os outros números há `default -> { … }`.
lösung: aufgabe-speisekarte-loesung.visustruct
:::
