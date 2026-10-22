---
titel: Seleção
bereich: Fundamentos
kurz: Executar um de vários casos, consoante o valor de uma variável.
---

## Muitas possibilidades, uma variável

Uma máquina de bebidas tem três botões: 1 para água, 2 para sumo, 3 para chocolate quente. Com decisões precisas de três blocos encaixados uns nos outros. Isso fica depressa largo e confuso.

::: diagramm l09-verschachtelt.visustruct
A máquina com três decisões encaixadas. Cada decisão volta a verificar a mesma variável escolha.
:::

Sempre que comparas **uma variável** com **vários valores fixos**, há uma forma mais simples: a **seleção**.

## Como se constrói uma seleção

Em cima, no bloco, está a variável que decide. Por baixo há uma coluna própria para cada caso. Por cima de cada coluna está o valor a que ela pertence.

::: diagramm l09-automat.visustruct
A mesma máquina como seleção. Se escolha tiver o valor 2, só é executada a coluna 2.
:::

- A simulação procura o caso cujo nome corresponde exatamente ao valor.
- Se nenhum caso corresponder, é executado o **default**. Este caso fica sempre na ponta da direita.
- Depois, o programa continua por baixo da seleção. Só é executado **um** caso.

> Uma seleção nova tem os casos 1, 2 e default. Clica num caso para alterar o seu **Nome do caso** no Inspetor de objetos. Com **Adicionar caso** ganhas uma nova coluna antes do default.

## Casos com texto

Os casos não têm de ser números. Também podes escolher pelo conteúdo de uma variável `String`. Então escreves o texto como nome do caso, por exemplo `vermelho`.

::: diagramm l09-ampel.visustruct
Um semáforo: consoante a cor introduzida, aparece uma mensagem diferente. Na simulação, experimenta também uma cor que não existe.
:::

Maiúsculas e minúsculas contam: `Vermelho` não corresponde ao caso `vermelho`.

## Exercício: Nota por extenso

::: übung l09-note
titel: Nota por extenso
auftrag: Pede uma nota como número inteiro e mostra-a por extenso: 1 muito insuficiente, 2 insuficiente, 3 suficiente, 4 bom, 5 muito bom.
  Para qualquer outro número deve aparecer **Nota inválida**.
test: 5 -> muito bom
test: 3 -> suficiente
test: 1 -> muito insuficiente
test: 9 -> Nota inválida
braucht: fallauswahl
tipp: Para muitos valores fixos, uma seleção é mais clara do que muitas decisões. Cada nota tem um caso próprio.
tipp: Usa “Adicionar caso” até teres os casos 1 a 5 e default. Em cima, na seleção, escreves `nota`.
lösung: l09-note-loesung.visustruct
:::

## Exercício: Calculadora

::: übung l09-rechner
titel: Calculadora
auftrag: Pede, um a seguir ao outro, um número inteiro `a`, um operador como `String` e um segundo número inteiro `b`.
  Para `+`, `-` e `*` mostras o resultado. Para qualquer outro sinal aparece **Operador desconhecido**.
test: 3, +, 4 -> 7
test: 10, -, 4 -> 6
test: 6, *, 7 -> 42
test: 1, x, 2 -> Operador desconhecido
braucht: fallauswahl
tipp: Primeiro lê os três valores. Depois, uma seleção sobre o operador decide o que é calculado.
tipp: Antes da seleção, cria `int resultado = 0`. Em cada caso calculas, por exemplo, `resultado = a + b` e depois mostras `resultado`. Os nomes dos casos são simplesmente `+`, `-` e `*`.
lösung: l09-rechner-loesung.visustruct
:::

## Seleção ou decisão?

A seleção só verifica se um valor é **exatamente igual** a um nome de caso. Portanto:

- **Seleção:** uma variável, vários valores fixos. Exemplos: escolher num menu, dia da semana como número, notas.
- **Decisão:** intervalos e condições combinadas. Exemplos: `idade >= 18`, `temperatura < 0 || temperatura > 30`.

Por isso, para “idade 18 ou mais” continuas a precisar da decisão. Não podes criar um caso próprio para cada idade possível.

## Lista de verificação

::: checkliste
- Sei inserir uma seleção, acrescentar casos e alterar os nomes dos casos. → Como se constrói uma seleção
- Sei quando é executado o caso default. → Como se constrói uma seleção
- Sei decidir se serve melhor uma seleção ou uma decisão. → Seleção ou decisão?
:::

## Teste de conhecimentos

::: quiz
? A variável dia tem o valor 5. Existem os casos 1, 2, 3 e default. O que é executado?
- [ ] Nada
- [ ] O caso 3
- [x] O caso default
> Nenhum nome de caso corresponde a 5, por isso aplica-se o default.

? Quantos casos são executados de cada vez que a seleção é executada?
- [x] Exatamente um
- [ ] Todos os casos a partir do que corresponde
- [ ] Todos os casos
> Depois do caso que corresponde, o programa continua logo por baixo da seleção.

? Para que é que uma seleção NÃO serve?
- [ ] Escolher a opção 1, 2 ou 3 de um menu
- [x] Verificar se uma temperatura está acima dos 30 graus
- [ ] Tratar uma cor como vermelho, amarelo ou verde
> “Acima dos 30” é um intervalo. Para isso precisas de uma decisão com uma comparação.

? No semáforo escreves `Vermelho`, e o caso chama-se `vermelho`. O que acontece?
- [ ] É executado o caso vermelho.
- [x] É executado o caso default.
- [ ] A simulação indica um erro.
> Maiúsculas e minúsculas contam. Vermelho e vermelho são textos diferentes.

? Com que nome também encontras a seleção nos manuais?
- [ ] Instrução condicional
- [ ] Sequência
- [x] Seleção múltipla
> É escolhido um de muitos casos. Por isso também se chama seleção múltipla.
:::
