---
titel: Cifra de César
nach: 17
stufe: 3
---

Há mais de 2000 anos, o general romano Júlio César enviava mensagens secretas às suas tropas. O truque era simples: substituía cada letra pela letra que está **três posições à frente** no alfabeto. O A passa a D, o B passa a E e assim por diante. A mensagem legível chama-se **texto simples**, a cifrada **texto cifrado**. O número de posições que se avança é a **chave**, muitas vezes chamada apenas `k`.

::: grafik caesar-verschiebung.svg
Cifrar com a chave 3: cada letra de cima passa a ser a letra de baixo. No fim recomeça-se do início, por isso X, Y e Z passam a A, B e C.
:::

Assim, `HALLO` passa a `KDOOR`. Quem conhece a chave recua simplesmente três posições e consegue voltar a ler a mensagem.

### O disco de cifra

Para não ter de contar sempre, construiu-se um **disco de cifra**: dois discos com o alfabeto, um pequeno sobre um grande, presos no meio para poderem rodar. Por fora está o texto simples, por dentro o texto cifrado. Rodando o disco interior três letras, por baixo de cada letra exterior aparece a sua letra cifrada. Discos assim existem desde o século XV. Na Guerra Civil Americana (1861–1865), os soldados levavam pequenos discos de latão.

::: grafik caesar-scheibe.svg
Um disco de cifra inspirado nos discos históricos de latão. A janela azul mostra: com a chave 3, por baixo do A está o D.
:::

::: angeberwissen
O próprio César nem sequer tinha um disco! Sabemo-lo pelo historiador romano Suetónio: nas suas cartas, César avançava cada letra três posições e contava isso simplesmente de cabeça. O disco só foi inventado por Leon Battista Alberti por volta de 1467, cerca de 1500 anos mais tarde. Aliás, eu também conto de cabeça. Não tenho dedos, só cascos.
:::

Experimenta tu. Roda o disco interior, escreve um texto e vê como surge o texto cifrado. Com **Decifrar** faz-se o caminho inverso.

::: caesar 3
LUDWIG
:::

::: ludwig
Um disco verdadeiro é muito fácil de fazer: dois círculos de cartão, um um pouco mais pequeno, cada um com 26 campos iguais para o alfabeto, e um colchete de latão no meio. Está pronta a tua ferramenta de agente secreto!
:::

::: quiz
? Em que letra se transforma o Y com a chave 3?
- [ ] A
- [x] B
- [ ] C
> A seguir ao Y vem o Z, depois recomeça-se com A e B. Três posições à frente é, portanto, o B.

? Um texto cifrado foi cifrado com a chave 5. Como o decifras?
- [ ] Avançar mais 5 posições
- [x] Recuar 5 posições
- [ ] Ler as letras de trás para a frente
> Decifrar é o contrário de cifrar. Recuar 5 posições é, aliás, o mesmo que avançar 21, porque 5 + 21 = 26.
:::

### O programa: há mais do que um caminho

Como ensinas o computador a avançar uma letra `k` posições? Não existe *a* única solução certa. Vamos ver dois caminhos. Ambos percorrem o texto carácter a carácter com um ciclo for, tal como na lição sobre cadeias de caracteres. A diferença está na forma como avançam uma única letra.

Nos dois caminhos ajuda o operador de resto `%`. Ele garante que depois do Z se continua no A: as posições 0 a 25 ficam como estão, 26 passa a 0, 27 passa a 1 e assim por diante.

### Caminho 1: o alfabeto num array

Colocas o alfabeto num array `char[] alfabeto = {'A', 'B', …, 'Z'}`. Para cada letra da palavra procuras no array a sua posição `pos`, ou seja, o seu índice. A letra cifrada está então no mesmo array na posição `(pos + k) % 26`.

Um exemplo com a chave 3: o X está na posição 23. Então `(23 + 3) % 26 = 0`, e na posição 0 está o A.

::: übung aufgabe-caesar-array
titel: César com array
auftrag: O diagrama inicial já contém o array `alfabeto`. Pede uma palavra em maiúsculas e a chave `k`. Depois mostra a palavra cifrada. Para HALLO e 3, isso dá `KDOOR`.
start: aufgabe-caesar-array-start.visustruct
test: HALLO, 3 -> KDOOR
test: ZEBRA, 1 -> AFCSB
test: LUDWIG, 13 -> YHQJVT
braucht: forSchleife, verzweigung
tipp: Cria um texto vazio `String segredo = ""`. Percorre a palavra carácter a carácter com um ciclo for. Em cada passagem acrescentas uma letra cifrada ao fim de `segredo`.
tipp: Para encontrar a posição de uma letra precisas de um segundo ciclo, interior, sobre o array: se `alfabeto[j] == letra`, guardas `pos = j`.
tipp: Depois do ciclo interior acrescentas `alfabeto[(pos + k) % 26]`: `segredo = segredo + alfabeto[(pos + k) % 26]`. Depois do ciclo exterior mostras `segredo`.
lösung: aufgabe-caesar-array-loesung.visustruct
:::

### Caminho 2: calcular com a tabela ASCII

Para o computador, cada carácter é na verdade um número. Que número pertence a que carácter está na **tabela ASCII**. Aí o A tem o código 65, o B o código 66 e assim por diante até ao Z com 90. Em Java transformas um carácter no seu código com `(int)` e um código de volta num carácter com `(char)`:

```
int codigo = (int) 'A'
char letra = (char) 68
```

Depois disso, `codigo` vale 65 e `letra` vale `'D'`. Uma conversão destas de um tipo de dados para outro chama-se **conversão de tipo** (em inglês *cast*).

Agora já podes fazer contas com a letra. Para que o salto do Z de volta ao A funcione, subtrais primeiro 65. Assim o A fica na posição 0 e o Z na posição 25, tal como no caminho 1. Avanças com `% 26` e no fim voltas a somar os 65:

::: grafik caesar-ascii.svg
Em cima, as letras maiúsculas com os seus códigos ASCII. Em baixo, o cálculo para o X com a chave 3: o resultado é A.
:::

::: übung aufgabe-caesar-ascii
titel: César com ASCII
code: java
auftrag: Escreve um programa em Java que lê uma palavra em maiúsculas e a chave `k` e mostra a palavra cifrada. Desta vez sem array: calcula com `(int)` e `(char)`.
test: HALLO, 3 -> KDOOR
test: ZEBRA, 1 -> AFCSB
test: LUDWIG, 13 -> YHQJVT
braucht: forSchleife
tipp: Percorre a palavra com um ciclo for. O código do carácter na posição `i` obténs com `int codigo = (int) palavra.charAt(i);`.
tipp: Calcula `codigo = (codigo - 65 + k) % 26 + 65;` e acrescenta o carácter: `segredo = segredo + (char) codigo;`. Antes do ciclo escreves `String segredo = "";`, depois do ciclo `System.out.println(segredo);`.
lösung: aufgabe-caesar-ascii-loesung.visustruct
:::

### Qual é o melhor caminho?

**Caminho 1: array.** A ideia é procurar a posição no array.
- Vantagem: fácil de perceber, e também funciona com alfabetos próprios, p. ex. com Ç.
- Desvantagem: é preciso procurar cada letra.

**Caminho 2: ASCII.** A ideia é calcular com o código do carácter.
- Vantagem: curto e sem procura, por isso mais rápido.
- Desvantagem: é preciso conhecer os códigos ASCII.

Os dois programas dão o mesmo resultado. Na programação é muitas vezes assim: há várias soluções certas, e escolhes a que melhor se adapta à tua tarefa.

::: übung aufgabe-caesar-entschluesseln
titel: Decifrar César
code: java
auftrag: Agora inverte o jogo. Lê um texto cifrado em maiúsculas e a chave `k` e mostra o texto simples. Para KDOOR e 3, isso dá `HALLO`. Escolhes tu o caminho.
test: KDOOR, 3 -> HALLO
test: AFCSB, 1 -> ZEBRA
test: YHQJVT, 13 -> LUDWIG
braucht: forSchleife
tipp: Decifrar significa recuar `k` posições em vez de avançar. Assim, o `+ k` passa a `- k`.
tipp: Cuidado com o A: `0 - 3` dá -3, e em Java o `%` não transforma isso num número positivo. Por isso soma ainda 26: `codigo = (codigo - 65 - k + 26) % 26 + 65;`
lösung: aufgabe-caesar-entschluesseln-loesung.visustruct
:::

::: angeberwissen
Infelizmente, a cifra de César não é segura. Há apenas 25 chaves, e é possível experimentá-las todas em poucos minutos. Com um truque é ainda mais rápido: em português, as letras mais frequentes são o A e o E. Se no texto cifrado o H aparecer muitas vezes, a chave foi provavelmente 3. Na internet existe ainda o ROT13, que é a cifra de César com a chave 13. Aplicar ROT13 duas vezes devolve o texto simples, porque 13 + 13 = 26.
:::
