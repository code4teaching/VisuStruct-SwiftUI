---
titel: Chamada e interrupção
bereich: Fundamentos
kurz: Dividir tarefas grandes em subprogramas e sair mais cedo dos ciclos.
---

## Dividir tarefas grandes

Os estrutogramas compridos ficam depressa confusos. Por isso divides uma tarefa grande em **problemas mais pequenos**. Cada problema mais pequeno tem um nome próprio e um estrutograma próprio, um **subprograma**.

Um quiz, por exemplo, tem três partes: dar as boas-vindas, fazer as perguntas, mostrar o resultado. O programa principal só nomeia estas três partes:

::: diagramm l15-hauptprogramm.visustruct
O programa principal é feito só de três chamadas. O que acontece em cada parte está num estrutograma próprio.
:::

Assim vês num relance como o programa está construído. Os pormenores estão noutro sítio.

## A chamada

Uma **chamada** é um bloco com linhas verticais duplas à esquerda e à direita. Quer dizer: executa aqui o subprograma com este nome e depois continua.

- Arrastas a **Chamada** da área Elementos e escreves lá o nome, p. ex. `mostrarBoasVindas()`.
- Os parênteses curvos no fim mostram que é um subprograma. É assim que também se escreve em Java, Python e JavaScript.
- O subprograma em si constróis como estrutograma próprio num novo separador. Como título escreves o mesmo nome.

::: diagramm l15-unterprogramm.visustruct
O subprograma mostrarBoasVindas() como estrutograma próprio.
:::

> **Na simulação:** Quando a simulação chega a uma chamada, procura entre os separadores abertos o estrutograma com este título e executa-o. Depois continua no programa principal. Enquanto o subprograma é executado, o bloco da chamada fica destacado. Um subprograma como este, só com um nome como título, partilha as suas variáveis com o programa principal. Daqui a pouco vais aprender como um subprograma tem variáveis próprias. Se não houver nenhum separador que corresponda, a simulação salta a chamada e mostra um aviso.

::: angeberwissen
Porque é que o teu professor diz sempre “método” em Java e nunca “função” ou “procedimento”? Porque em Java cada subprograma tem de pertencer a uma classe, e os subprogramas de uma classe chamam-se métodos. Mas a diferença continua a existir: se um método devolve um resultado, na verdade é uma função. Se tiver `void` à frente, não devolve nada e na verdade é um procedimento. O Java simplifica e chama métodos aos dois. Eu também: o meu método chama-se Ruminar.
:::

## Exercício: Acrescentar uma chamada

::: übung l15-titel
titel: Cumprimento com chamada
auftrag: Imagina que o subprograma `mostrarTitulo()` já existe. Constrói o programa principal: primeiro chama `mostrarTitulo()`. Depois pede um nome e mostra **Olá** e o nome.
  Ou seja, quando se escreve Ada, aparece **Olá Ada**.
test: Ada -> Olá Ada
test: Rui -> Olá Rui
braucht: aufruf
tipp: O programa principal tem três partes: a chamada, a entrada e a saída.
tipp: Arrasta uma Chamada da área Elementos lá para cima e escreve `mostrarTitulo()`. Por baixo vêm a entrada `input: String nome "Como te chamas?"` e a saída.
lösung: l15-titel-loesung.visustruct
:::

## Passar valores: parâmetros

Muitas vezes um subprograma deve trabalhar com valores que só se conhecem quando é chamado. Nesse caso tem uma **linha de cabeçalho** como título:

```
void mostrarSoma(int a, int b)
```

- `void` quer dizer: o subprograma não devolve nenhum resultado.
- `mostrarSoma` é o nome.
- Entre os parênteses estão os **parâmetros**: variáveis com tipo de dados que recebem os seus valores quando o subprograma é chamado. Vários separam-se com vírgulas.

::: diagramm l15-zeige-summe.visustruct
O subprograma com a linha de cabeçalho como título. Faz contas com a e b como se fossem variáveis normais.
:::

No bloco da chamada escreves os valores entre os parênteses, p. ex. `mostrarSoma(3, 4)`. O primeiro valor vai para `a`, o segundo para `b`. Em vez de números também podes usar variáveis e contas, como `mostrarSoma(x, x + 1)`.

::: diagramm l15-zeige-summe-haupt.visustruct
O programa principal chama mostrarSoma duas vezes com valores diferentes. Abre os dois diagramas e inicia aqui a simulação.
:::

> **Variáveis locais:** Os parâmetros e todas as variáveis criadas no subprograma pertencem só ao subprograma. Ele recebe **cópias** dos valores; mais sobre isso em baixo, em passagem por valor. Durante a chamada, a simulação só mostra as variáveis do subprograma.

## Devolver um resultado: return

Um subprograma também pode devolver um resultado, o **valor de retorno**. Nesse caso, a linha de cabeçalho tem o tipo de dados do resultado em vez de `void`:

```
int quadrado(int x)
```

A instrução `return resultado` devolve o valor e termina logo o subprograma. Quando o chamas, guardas o resultado numa variável: depois de `int q = quadrado(5)`, `q` tem o valor 25.

::: diagramm l15-quadrat.visustruct
O subprograma quadrado calcula e devolve o resultado com return.
:::

::: diagramm l15-quadrat-haupt.visustruct
O programa principal guarda o valor de retorno em q. Abre os dois diagramas e experimenta a simulação.
:::

> Um subprograma com valor de retorno tem de terminar com `return`. Se faltar o return, a simulação indica um erro.

Na **vista de código**, a linha de cabeçalho passa a ser um método Java (`public static int quadrado(int x)`), um `def` em Python e uma `function` em JavaScript. Se os subprogramas estiverem abertos noutros separadores, aparecem no código juntamente com o programa principal.

## Exercício: Calcular a área

::: übung l15-flaeche
titel: Calcular a área
auftrag: Constrói dois diagramas. O subprograma `int area(int a, int b)` devolve a área de um retângulo, ou seja, a vezes b. O programa principal pede o comprimento e a largura, chama `area` e mostra **Área:** e o resultado.
  Com 3 e 4 aparece **Área: 12**.
test: 3, 4 -> Área: 12
test: 5, 5 -> Área: 25
test: 7, 0 -> Área: 0
braucht: aufruf
tipp: Constróis dois diagramas: um subprograma que só calcula e devolve o resultado, e um programa principal para a entrada e a saída.
tipp: Abre um novo separador com **+** e dá-lhe o título `int area(int a, int b)`. Lá dentro basta uma instrução: `return a * b`. No programa principal escreves `int f = area(comprimento, largura)` no bloco da chamada.
lösung: l15-flaeche-loesung.visustruct
unterprogramm: l15-flaeche-unterprogramm-loesung.visustruct
:::

## Cópia ou original: passagem por valor e passagem por referência

O que acontece se um subprograma alterar o seu parâmetro? Depende do **que** é passado.

**Passagem por valor:** Com `int`, `double`, `boolean`, `char` e `String`, o subprograma recebe uma **cópia** do valor. Se alterar o seu parâmetro, a variável de quem chamou fica como estava.

**Passagem por referência:** Com um **array**, o subprograma não recebe uma cópia, mas uma referência para o mesmo array. Se alterar uma posição, a posição também fica alterada para quem chamou. A linha de cabeçalho para isso fica assim:

```
void limpar(boolean[] lugares)
```

::: grafik uebergabe.svg
Em cima, duplicar recebe uma cópia de numero. Em baixo, fila e lugares apontam para o mesmo array.
:::

Experimenta as duas. Abre os três diagramas e inicia a simulação no programa principal:

::: diagramm uebergabe-verdopple.visustruct
duplicar só altera a sua cópia x.
:::

::: diagramm uebergabe-leeren.visustruct
limpar põe todos os lugares a false, por exemplo quando uma sessão é cancelada.
:::

::: diagramm uebergabe-haupt.visustruct
numero continua a ser 5 depois da chamada. Já os lugares em fila ficam livres depois da chamada.
:::

> Se quiseres receber um número de volta de um subprograma, usa `return`, p. ex. `numero = duplicar(numero)` com a linha de cabeçalho `int duplicar(int x)`. Um array, pelo contrário, pode ser alterado diretamente pelo subprograma.

::: angeberwissen
Em rigor, o Java só conhece a passagem por valor. Mas, com um array, não é copiado o array inteiro, só o seu **endereço** na memória. Com o endereço copiado, o subprograma encontra o mesmo array. É como se eu te desse uma cópia da chave do meu cacifo: a chave é copiada, mas o feno no cacifo só existe uma vez.
:::

## Exercício: Pontos de bónus

::: übung uebergabe-bonus
titel: Pontos de bónus
auftrag: O programa principal chama `bonus(pontos)` e depois mostra todos os pontos. Constrói o subprograma `void bonus(int[] pontos)`, que aumenta em 1 cada pontuação do array. Em vez de 3, 5 e 8 vês então **4**, **6** e **9**.
start: uebergabe-bonus-start.visustruct
test: - -> 4 | 6 | 9
braucht: aufruf
tipp: O programa principal já está pronto. Só constróis o subprograma num novo separador.
tipp: Abre um novo separador com **+** e o título `void bonus(int[] pontos)`. Lá dentro, um ciclo for percorre todas as posições e calcula `pontos[i] = pontos[i] + 1`. Não precisas de return, porque o array é alterado diretamente.
lösung: uebergabe-bonus-loesung.visustruct
unterprogramm: uebergabe-bonus-unterprogramm-loesung.visustruct
:::

## A interrupção

Às vezes um ciclo deve terminar **mais cedo**, a meio do seu corpo. É para isso que serve a **Interrupção**. Ela sai imediatamente do ciclo em que está. O programa continua no primeiro bloco depois do ciclo. Em Java, Python e JavaScript chama-se `break`.

Reconheces a Interrupção pela ponta no seu lado esquerdo. Podes escrever um pequeno comentário no bloco, p. ex. `Sair do ciclo`. Ele aparece no código como comentário depois de `break`.

Uma Interrupção está quase sempre numa **decisão**: só se sai do ciclo se uma condição se verificar.

Um caso típico é o **ciclo infinito com Interrupção**. O ciclo em si não tem condição. É executado até se chegar à Interrupção:

::: diagramm l15-endlos-aussprung.visustruct
O ciclo pede sempre um número. Com 0 salta para fora, senão soma o número à soma.
:::

Sem Interrupção, um ciclo infinito nunca acabaria mesmo.

## Interrupção na simulação

A simulação executa a Interrupção como `break`: sai do ciclo mais interior e continua depois dele. Se uma Interrupção estiver fora de qualquer ciclo, o subprograma termina; no programa principal termina o programa todo. O `return` faz o mesmo.

Muitas vezes podes passar completamente sem Interrupção: escreves a condição de paragem diretamente no ciclo. Normalmente até fica mais claro.

## Exercício: Somar até 0

::: übung l15-bis-null
titel: Somar até 0
auftrag: Reconstrói o programa “Somar até 0” **sem** Interrupção. Ele pede números inteiros até alguém escrever 0. Depois mostra **Soma:** e a soma de todos os números introduzidos.
test: 3, 4, 0 -> Soma: 7
test: 0 -> Soma: 0
test: 10, -2, 5, 0 -> Soma: 13
tipp: Sem Interrupção, é a própria condição do ciclo que tem de verificar se foi escrito 0.
tipp: Pede o primeiro número antes do ciclo. O ciclo while é executado com a condição `numero != 0`. No corpo somas o número à soma e depois pedes o número seguinte. Na segunda entrada só escreves `input: numero "…"`, porque `numero` já existe.
lösung: l15-bis-null-loesung.visustruct
:::

## Lista de verificação

::: checkliste
- Sei dividir uma tarefa grande em problemas mais pequenos. → Dividir tarefas grandes
- Sei inserir uma chamada e construir um subprograma num separador próprio. → A chamada
- Sei passar valores a um subprograma com parâmetros. → Passar valores: parâmetros
- Sei devolver um valor de retorno com return e guardá-lo ao chamar. → Devolver um resultado: return
- Sei explicar porque é que um subprograma não consegue alterar um número, mas consegue alterar um array. → Cópia ou original: passagem por valor e passagem por referência
- Sei o que faz uma Interrupção e porque está numa decisão. → A interrupção
- Sei terminar um ciclo com uma Interrupção ou através da sua condição. → Interrupção na simulação
:::

## Teste de conhecimentos

::: quiz
? O que significa um bloco de chamada com o texto `mostrarResultado()`?
- [ ] O programa termina aqui.
- [x] O subprograma mostrarResultado() é executado aqui, e depois o programa continua.
- [ ] A palavra mostrarResultado() é mostrada aqui.

? Onde continua o programa depois de uma Interrupção?
- [ ] No início do ciclo
- [x] No primeiro bloco depois do ciclo
- [ ] Logo no início do programa
> A Interrupção sai do ciclo em que está. Em Java, Python e JavaScript chama-se break.

? Porque é que uma Interrupção costuma estar numa decisão?
- [x] Para só se sair do ciclo se uma condição se verificar
- [ ] Porque senão uma Interrupção não pode ser guardada
- [ ] Porque uma decisão é ela própria um ciclo
> Sem decisão, sair-se-ia do ciclo logo na primeira iteração.

? Onde encontra a simulação o subprograma de uma chamada `mostrarResultado()`?
- [ ] Tem de estar no mesmo estrutograma.
- [x] Num separador aberto com o título mostrarResultado()
- [ ] A simulação não consegue executar subprogramas.
> Constrói cada subprograma num separador próprio e dá-lhe como título o nome da chamada.

? O subprograma tem a linha de cabeçalho `void mostrarSoma(int a, int b)`. Que chamada serve?
- [ ] mostrarSoma()
- [x] mostrarSoma(3, 4)
- [ ] int s = mostrarSoma(3, 4)
> Dois parâmetros precisam de dois valores. E `void` quer dizer que não volta nada que pudesses guardar.

? Depois de `int q = quadrado(5)`, q tem 25. O que está no fim do subprograma quadrado?
- [ ] output: x * x
- [x] return x * x
- [ ] q = x * x
> Com return, o subprograma devolve o valor à chamada. Uma saída só o mostraria.

? `void duplicar(int x)` calcula `x = x * 2`. O programa principal tem `int numero = 5` e depois a chamada `duplicar(numero)`. Que valor tem numero a seguir?
- [x] 5
- [ ] 10
- [ ] 0
> Passagem por valor: duplicar só alterou uma cópia de numero.

? `void limpar(boolean[] lugares)` põe todas as posições a false. O que é verdade para o array fila no programa principal depois de `limpar(fila)`?
- [ ] Não mudou, porque o subprograma recebe uma cópia.
- [x] Todas as posições são false, porque lugares e fila são o mesmo array.
- [ ] O array é apagado.
> Passagem por referência: um array é passado como referência. Quem chamou também vê as alterações nas posições.

? Como se chama um subprograma em Java?
- [ ] Classe
- [x] Método
- [ ] Ciclo
> Em Java, um subprograma é um método, por exemplo o método `main`. Consoante o tipo, também se chama procedimento ou função.

? Muitos blocos têm um segundo nome nos manuais. Associa cada termo do VisuStruct ao seu outro nome.
= Decisão -> Instrução condicional
= Seleção -> Seleção múltipla
= Ciclo -> Iteração
= Subprograma -> Método
> Os dois nomes querem dizer o mesmo. Se conheces um deles, também percebes o outro.
:::
