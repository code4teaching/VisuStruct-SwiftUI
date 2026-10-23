---
titel: Sequência
bereich: Fundamentos
kurz: Executar passos um a seguir ao outro, prestar atenção à ordem e trocar valores.
---

## Passo a passo

Uma **sequência** é uma série de passos que são executados exatamente uma vez e exatamente por esta ordem. No estrutograma, os blocos ficam simplesmente uns por cima dos outros.

Cada bloco só começa quando o bloco de cima terminou. Nada é saltado e nada é repetido.

> A sequência é o mais simples dos três blocos básicos. Quase todos os estrutogramas são feitos sobretudo de sequências.

## A ordem conta

Quando fazes chá, notas logo se a ordem estiver errada. Com contas é igual, só que é mais difícil de ver.

::: diagramm l04-rechnen.visustruct
Primeiro duplicar, depois somar 1: o resultado é 7. Se trocares os dois blocos do meio, dá 8.
:::

A instrução `numero = numero * 2` quer dizer: pega no valor de `numero`, multiplica-o por 2 e volta a guardar o resultado em `numero`. Por isso, o que está em `numero` depende do que aconteceu antes.

::: angeberwissen
Os estrutogramas não são só coisa da escola. Segundo Shneiderman, empresas como a IBM e a Siemens também planeavam os seus programas com eles. Ou seja, aqui estás a aprender coisas de profissionais. Mééé-ravilha!
:::

## Exercício: Pôr por ordem

::: übung l04-reihenfolge
titel: Pôr por ordem
auftrag: O diagrama inicial tem os blocos certos, mas pela ordem errada. Move-os de modo que no fim seja mostrado **20**.
start: l04-reihenfolge-start.visustruct
test: - -> 20
braucht: anweisung
tipp: Lê cada bloco e pergunta-te: de que variável precisa, e onde é que essa variável recebe o seu valor?
tipp: Uma variável tem de ser criada antes de fazeres contas com ela. A saída vem mesmo no fim. Confirma de cabeça: (2 + 3) · 4 = 20.
lösung: l04-reihenfolge-loesung.visustruct
:::

## Trocar dois valores

Imagina dois copos: um com sumo, outro com água. Se quiseres trocar o que está lá dentro, precisas de um terceiro copo, vazio.

Com variáveis é exatamente igual. Se escreveres simplesmente `a = b` e depois `b = a`, o valor antigo de `a` já se perdeu. No fim, as duas variáveis têm o mesmo valor.

A solução é uma **variável auxiliar** que guarda o valor antigo durante pouco tempo:

::: grafik l05-tauschen.svg
Três passos com um copo vazio: primeiro o sumo para aux, depois a água para a esquerda, depois o sumo de aux para a direita.
:::

::: diagramm l04-tauschen.visustruct
Primeiro guarda-se a em aux. Depois a recebe o valor de b, e b recebe o valor guardado em aux.
:::

## Exercício: Trocar copos

::: übung l04-glaeser-tauschen
titel: Trocar copos
auftrag: O copo da esquerda tem sumo, o da direita tem água. Troca o conteúdo das variáveis `esquerda` e `direita` antes de serem mostradas.
Não alteres os dois primeiros blocos. Insere novas instruções entre eles.
start: l04-tauschen-start.visustruct
test: - -> Esquerda: água | Direita: sumo
braucht: anweisung
tipp: Como trocas dois copos cheios na vida real? Precisas de um terceiro copo, vazio.
tipp: Cria uma variável auxiliar com `String aux = esquerda`. Depois disso precisas de mais duas atribuições.
lösung: l04-tauschen-loesung.visustruct
:::

## Lista de verificação

::: checkliste
- Sei que uma sequência é executada de cima para baixo. → Passo a passo
- Sei explicar porque é que a ordem dos passos conta. → A ordem conta
- Sei trocar dois valores com uma variável auxiliar. → Trocar dois valores
:::

## Teste de conhecimentos

::: quiz
? Quantas vezes é executado cada bloco de uma sequência?
- [ ] Até uma condição ser falsa
- [x] Exatamente uma vez
- [ ] Nenhuma, se estiver vazio
> Numa sequência nada é repetido e nada é saltado. Para repetir existem os ciclos.

? No início a = 5 e b = 9. Depois é executado `a = b` e a seguir `b = a`. O que está nas variáveis no fim?
- [ ] a = 9 e b = 5
- [x] a = 9 e b = 9
- [ ] a = 5 e b = 5
> Depois de `a = b`, o valor antigo 5 perdeu-se. `b = a` só copia o 9 de volta.

? Porque precisas de uma variável auxiliar para trocar valores?
- [x] Para um valor não ser escrito por cima antes de ser preciso
- [ ] Para o estrutograma ficar mais comprido
- [ ] Porque senão não se podem mostrar variáveis

? O que mostra a sequência `int x = 4`, `x = x + 1`, `x = x * 3`, `output: x`?
- [ ] 13
- [x] 15
- [ ] 4
> Primeiro x passa a 5, depois a 15.
:::
