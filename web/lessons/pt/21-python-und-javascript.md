---
titel: Python e JavaScript
bereich: Do estrutograma ao código
kurz: Gerar código Python e JavaScript a partir do estrutograma e executar JavaScript diretamente no navegador.
---

## O mesmo diagrama, três linguagens

Na vista de código ([Código](#zeige-code) nas ferramentas) escolhes a linguagem em cima. O estrutograma fica igual; só muda a forma de escrever. Assim podes comparar as linguagens facilmente.

::: diagramm l18-beispiel.visustruct
Um número é diminuído em 3 uma e outra vez até deixar de ser maior do que 0.
:::

## Python

Para o diagrama de cima, o VisuStruct gera este código Python:

```
numero = int(input("Valor inicial?"))
while numero > 0:
    print(numero)
    numero = numero - 3
print("Fim")
```

O que é diferente em Python em relação ao Java:

- **Não há ponto e vírgula** nem **chavetas**. O Python reconhece o que pertence a um ciclo ou a uma decisão só pela **indentação**. Depois de `while`, `if` e `else` vêm dois pontos.
- As variáveis **não têm tipo de dados**: `int numero = 5` passa a `numero = 5`.
- A saída chama-se `print(…)`, a entrada `input(…)`. Para um número, fica `int(…)` à volta.
- Em Python, os arrays chamam-se **listas**: `int[] numeros = {2, 4, 6}` passa a `numeros = [2, 4, 6]`, e `numeros.length` passa a `len(numeros)`.
- Um ciclo for simples como `int i = 0`, `i < 5`, `i++` passa a `for i in range(5):`.

## Cuidados com o Python

Em alguns sítios, o Python é mais rigoroso do que o Java. Por isso, o VisuStruct traduz a forma de escrever do Java quando exporta:

- **Texto e número com +:** `"Soma: " + soma` passa a `"Soma: " + str(soma)`. Sem `str(…)`, o Python para com um erro.
- **Não existe i++:** passa a `i += 1`.
- **&&, || e !** chamam-se `and`, `or` e `not` em Python, e `true` e `false` passam a `True` e `False`.
- **Divisão inteira:** Em Python, `7 / 2` dá sempre 3.5. Se o estrutograma dividir dois valores `int`, o VisuStruct escreve `7 // 2`, que dá 3, tal como em Java.
- **Ciclos for:** Os ciclos de contagem passam a `for … in range(…)`, também com `i <= n`, a contar para trás ou com passos como `i = i + 2`. Se um ciclo não encaixar nesse padrão, passa a ciclo `while`.
- **Não existe do-while:** passa a `while True:` com `if not (…): break` no fim.

Se um diagrama estiver marcado como **pseudocódigo**, só aparece um aviso por cima do código. Nesse caso o texto é um esboço e não um programa executável.

## JavaScript

O mesmo diagrama em JavaScript:

```
"use strict";

let numero = parseInt((prompt("Valor inicial?") ?? "0"), 10);
while (numero > 0) {
    console.log(numero);
    numero = numero - 3;
}
console.log("Fim");
```

O JavaScript parece-se com o Java: chavetas, ponto e vírgula, `while (…)` e `if (…)`. As diferenças:

- As variáveis criam-se com `let`, sem tipo de dados. As constantes com `const`.
- A saída chama-se `console.log(…)`, a entrada `prompt(…)`. O `parseInt(…)` transforma a entrada num número inteiro.
- Os arrays ficam entre parênteses retos: `let numeros = [2, 4, 6];`.
- `"use strict";` mesmo lá em cima faz o JavaScript queixar-se de erros de escrita nos nomes das variáveis.
- O JavaScript só tem um tipo de número. Se o estrutograma dividir dois valores `int`, o VisuStruct escreve `Math.trunc(a / b)`. Assim desaparecem os algarismos depois da vírgula, tal como em Java.

::: angeberwissen
O JavaScript não tem quase nada a ver com o Java. Brendan Eich criou-o em 1995 em apenas dez dias para o navegador Netscape. Primeiro chamava-se Mocha, depois LiveScript. Como toda a gente andava entusiasmada com o Java, pouco antes do lançamento mudaram-lhe o nome para JavaScript, por razões de publicidade. Desde então, as duas linguagens são constantemente confundidas. Os programadores dizem que o Java e o JavaScript têm tanto em comum como um carro e uma carpete.
:::

## Executar JavaScript no navegador

O JavaScript é a linguagem dos navegadores. Por isso o VisuStruct consegue **executar o código logo**:

::: angeberwissen
Já agora, porque é que as ligações no navegador são azuis? Em 1985, a equipa de Ben Shneiderman testou que cor se vê bem mas não atrapalha a leitura. Ganhou o azul-claro. O vermelho destacava-se mais, mas as pessoas lembravam-se pior do texto a seguir.
:::

1. Escolhe **JavaScript** na vista de código.
2. Clica em **Testar no navegador**.
3. O que o `console.log` mostra aparece em **Saída**. Se o programa pedir um valor com `prompt`, escreve-o e clica em **OK**.
4. **Parar** cancela o programa.

O VisuStruct para sozinho um ciclo infinito `while (true)` depois de 100 000 iterações e indica **Execução interrompida: possível ciclo infinito.**

> No código JavaScript, uma **Chamada** precisa de um subprograma com esse nome, senão o JavaScript indica um erro. Ao contrário da simulação, o navegador não procura nos outros separadores.

## Exercício: Python como estrutograma

Este programa Python mostra todos os números pares de 0 até um limite:

```
limite = int(input("Até que número?"))
for i in range(0, limite + 1, 2):
    print(i)
```

`range(0, limite + 1, 2)` quer dizer: começar em 0, parar antes de `limite + 1`, contar de dois em dois.

::: übung l18-python
titel: Números pares
auftrag: Reconstrói o programa Python de cima como estrutograma com um ciclo for. Com o limite 7, mostra 0, 2, 4 e 6.
test: 7 -> 0 | 2 | 4 | 6
test: 4 -> 0 | 2 | 4
test: 0 -> 0
braucht: forSchleife
tipp: `range(0, limite + 1, 2)` conta de 0 até ao limite de dois em dois. Isso é um ciclo for.
tipp: Os três campos do ciclo for são `int i = 0`, `i <= limite` e `i = i + 2`.
lösung: l18-python-loesung.visustruct
:::

## Exercício: JavaScript como estrutograma

```
let idade = parseInt((prompt("Quantos anos tens?") ?? "0"), 10);
if (idade >= 18) {
    console.log("Podes votar.");
} else {
    let anos = 18 - idade;
    console.log("Espera mais " + anos + " anos.");
}
```

::: übung l18-js
titel: Votar a partir dos 18
auftrag: Reconstrói o código JavaScript de cima como estrutograma. Depois testa na vista de código, com **JavaScript** e **Testar no navegador**, se o teu código mostra o mesmo que a simulação.
test: 12 -> Espera mais 6 anos.
test: 18 -> Podes votar.
test: 15 -> Espera mais 3 anos.
test: 40 -> Podes votar.
braucht: verzweigung
tipp: Lê o código linha a linha. `if` e `else` passam a uma decisão.
tipp: `prompt` e `parseInt` juntos são uma entrada: `input: int idade "Quantos anos tens?"`. O ramo false tem dois blocos: primeiro `int anos = 18 - idade`, depois a saída.
lösung: l18-js-loesung.visustruct
:::

## Jogo: Que linguagem?

::: spiel frage
titel: Jogo: Que linguagem?
intro: O Ludwig misturou linhas de três linguagens. Reconheces de onde vem cada uma? Oito rondas.
frage: Em que linguagem está isto escrito?
antworten: Java | Python | JavaScript

runde:
    print(numero)
richtig: Python
> Em Python, a saída chama-se `print(…)`, sem ponto e vírgula.

runde:
    console.log(numero);
richtig: JavaScript
> `console.log` é a saída em JavaScript.

runde:
    System.out.println(numero);
richtig: Java
> A saída comprida com `System.out` só existe em Java.

runde:
    let numeros = [2, 4, 6];
richtig: JavaScript
> `let` e parênteses retos: um array em JavaScript.

runde:
    for i in range(5):
richtig: Python
> Dois pontos em vez de chavetas, e `range`: típico de Python.

runde:
    int[] numeros = {2, 4, 6};
richtig: Java
> Só o Java escreve o tipo de dados `int[]` à frente.

runde:
    numero = int(input("Valor inicial?"))
richtig: Python
> Sem tipo de dados antes da variável, sem ponto e vírgula, e `int(…)` à volta da entrada.

runde:
    let numero = parseInt(prompt("Valor inicial?"), 10);
richtig: JavaScript
> `prompt` pede um valor no browser, `parseInt` transforma-o num número.
:::

## Lista de verificação

::: checkliste
- Sei escolher e comparar Python e JavaScript na vista de código. → O mesmo diagrama, três linguagens
- Sei que o Python forma blocos pela indentação e não precisa de tipos de dados. → Python
- Sei o que o VisuStruct ajusta ao traduzir para Python. → Cuidados com o Python
- Sei executar JavaScript com Testar no navegador. → Executar JavaScript no navegador
:::

## Teste de conhecimentos

::: quiz
? Como reconhece o Python que linhas pertencem a um ciclo?
- [ ] Pelas chavetas
- [x] Pela indentação
- [ ] Pelo ponto e vírgula no fim da linha

? Como fica `output: soma` em JavaScript?
- [ ] print(soma)
- [ ] System.out.println(soma);
- [x] console.log(soma);

? Que linguagem consegue o VisuStruct executar diretamente no navegador?
- [ ] Java
- [ ] Python
- [x] JavaScript
> Qualquer navegador consegue executar JavaScript. Para Java e Python precisas de um programa próprio.

? O que acontece em Python com `print("Soma: " + soma)` se soma for o número 7?
- [ ] É mostrado Soma: 7.
- [x] O Python indica um erro, porque texto e número não se podem juntar com +.
- [ ] É mostrado Soma:.
> str(soma) transforma o número em texto.
:::
