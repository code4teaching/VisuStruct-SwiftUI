---
titel: Idade num subprograma
nach: 18
stufe: 2
---

A verificação da idade de “Maior de idade?” passa agora a ser um subprograma próprio. O programa principal só o chama.

::: übung aufgabe-alter-unterprogramm
titel: Idade num subprograma
auftrag: Constrói dois diagramas. O programa principal mostra **Bem-vindo**, depois chama `verificarIdade()` e no fim mostra **Adeus**.
  O subprograma `verificarIdade` fica num separador próprio: pede a idade e mostra **maior de idade** ou **menor de idade**.
test: 20 -> Bem-vindo | maior de idade | Adeus
test: 18 -> Bem-vindo | maior de idade | Adeus
test: 12 -> Bem-vindo | menor de idade | Adeus
braucht: aufruf
tipp: O programa principal tem três blocos. O subprograma faz o trabalho a sério.
tipp: Abre o exercício no editor e constrói lá o programa principal com a chamada `verificarIdade()`. Depois abre um novo separador com **+** e dá-lhe o título `verificarIdade`. Constrói nele a entrada e a decisão. O Verificar encontra o subprograma pelo título do separador.
lösung: aufgabe-alter-haupt-loesung.visustruct
unterprogramm: aufgabe-alter-unterprogramm-loesung.visustruct
:::
