---
titel: IVA
nach: 6
stufe: 1
---

Em Portugal continental, a quase tudo o que compras é somado 23 % de **IVA** (imposto sobre o valor acrescentado). A loja calcula com o preço sem IVA e soma o imposto por cima. Isso dá o preço com IVA que pagas na caixa.

Um exemplo: compras um telemóvel dobrável que se abre e fica um tablet. Na etiqueta da loja estão 1000 euros sem IVA. Por cima vêm 23 %, ou seja, 230 euros. Na caixa pagas 1230 euros. A loja não pode ficar com os 230 euros: entrega-os às Finanças.

::: grafik aufgabe-mehrwertsteuer.svg
Preço sem IVA mais IVA dá o preço com IVA. O IVA vai para as Finanças.
:::

::: angeberwissen
Mééé, claro que a própria loja comprou o telemóvel: ao fabricante, por 800 euros mais 184 euros de IVA. Estes 184 euros chamam-se **IVA dedutível**, e a loja pode descontá-los dos 230 euros. Por isso só entrega 46 euros às Finanças. No fim, só uma pessoa paga o imposto todo: o cliente na caixa. Ou seja, tu. Eu, já agora, não pago imposto nenhum. Só como erva.
:::

A taxa do imposto nunca muda enquanto fazes as contas. Por isso crias-a como **constante**: uma variável cujo valor não muda depois de definido. Escreves `const` à frente, por exemplo `const double IVA = 0.23`. Os nomes das constantes escrevem-se em maiúsculas para as reconheceres logo. No código Java isto passa a `final double IVA = 0.23;`.

Se a taxa alguma vez mudar, só tens de alterar esta linha.

::: übung aufgabe-mehrwertsteuer
titel: IVA
auftrag: Cria a constante `IVA` com o valor 0.23. Depois pede o preço sem IVA. Mostra primeiro o imposto e depois o preço com IVA, de cada vez só o número.
  Para um preço sem IVA de 100, as saídas são **23** e **123**.
test: 100 -> 23 | 123
test: 50 -> 11.5 | 61.5
test: 0 -> 0 | 0
tipp: O imposto é 23 por cento do preço sem IVA. O preço com IVA é o que pagas no fim.
tipp: O imposto é `precoSemIva * IVA`. O preço com IVA obténs somando o imposto ao preço sem IVA. Os dois valores são números decimais, portanto `double`.
lösung: aufgabe-mehrwertsteuer-loesung.visustruct
:::

::: quiz
? Porque crias a taxa do imposto como constante?
- [ ] Porque as constantes são calculadas mais depressa
- [x] Porque o seu valor não deve mudar no programa
- [ ] Porque os números decimais só podem ser guardados como constantes
> Uma constante mantém o seu valor. Se a taxa alguma vez mudar, só alteras a linha com `const`.
:::
