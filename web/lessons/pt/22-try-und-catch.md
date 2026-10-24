---
titel: Quando o programa falha: try e catch
bereich: Apanhar erros
kurz: Ler mensagens de erro com Java verdadeiro e apanhar falhas com try e catch.
---

## Falhou!

Este programa deve escrever três notas. Escreve-o na área [Programação](#zeige-codelive) e clica em [▶︎ Executar](#zeige-ausfuehren):

```java
int[] notas = {2, 3, 1};
System.out.println("Primeira nota: " + notas[0]);
System.out.println("Quarta nota: " + notas[3]);
System.out.println("Pronto!");
```

A primeira nota aparece e depois acabou. O VisuStruct indica “Expressão inválida: notas[3]”, e “Pronto!” nunca chega a aparecer. O array só tem as posições 0, 1 e 2; a posição 3 não existe.

::: ludwig
Já te aconteceu? Um pequeno erro e o programa inteiro vai-se. A mim aconteceu-me tantas vezes que cheguei a chorar em frente ao ecrã. Mas há uma solução, e chama-se **try** e **catch**.
:::

::: angeberwissen
Em 1947, a equipa de Grace Hopper encontrou no computador Mark II da Universidade de Harvard uma traça que tinha causado uma avaria. Colaram-na no diário de bordo e escreveram: “First actual case of bug being found”. Desde então, os erros de programa chamam-se **bugs** (inglês para insetos).
:::

## Ligar o Java verdadeiro

Normalmente a área Programação calcula com a mesma simulação que o estrutograma. Quando há um erro, ela simplesmente para. Para veres o que faz o Java verdadeiro, liga o Java verdadeiro:

1. Clica na [roda dentada](#zeige-einstellungen) em cima à direita e escolhe Java como **Linguagem de programação**.
2. Na secção Java, marca **Java verdadeiro (com Swing)**.

Na primeira execução, o VisuStruct descarrega uma única vez cerca de 40 MB. Depois disso, o teu código é compilado e executado como num ambiente de desenvolvimento Java a sério.

> Com o Java verdadeiro, as entradas pela consola (`Scanner`) ainda não funcionam. Por isso os nossos exemplos não precisam de entradas.

Escreve agora o programa como uma classe completa, para que os números das linhas batam certo, e executa-o:

```java
public class Notas {
    public static void main(String[] args) {
        int[] notas = {2, 3, 1};
        System.out.println("Primeira nota: " + notas[0]);
        System.out.println("Quarta nota: " + notas[3]);
        System.out.println("Pronto!");
    }
}
```

Na [consola](#zeige-konsole) aparece agora:

```
Primeira nota: 2
java.lang.ArrayIndexOutOfBoundsException: 3
	at Notas.main(Notas.java:5)
```

## Ler a mensagem de erro

Uma mensagem destas assusta à primeira vista. Mas diz-te exatamente o que se passa:

| Parte | Significado |
|---|---|
| `ArrayIndexOutOfBoundsException` | O tipo de erro: o índice está fora do array. |
| `3` | O índice errado. |
| `Notas.java:5` | A linha onde aconteceu: a linha 5. |

O Java chama a um erro destes, durante a execução, uma **exceção** (em inglês *exception*). Diz-se: o Java *lança* uma exceção. Se ninguém a apanhar, o programa para. É por isso que “Pronto!” não aparece.

::: ludwig
Lê as mensagens de erro sempre de cima: primeiro o nome da exceção, depois o número da linha. Na área Programação, os números das linhas estão à esquerda do código.
:::

## try e catch

Com **try** e **catch** apanhas a exceção. Altera a linha com `notas[3]` assim:

```java
try {
    System.out.println("Quarta nota: " + notas[3]);
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Esta nota não existe.");
}
System.out.println("Pronto!");
```

- `try` quer dizer “tenta”. O Java executa o bloco entre chavetas normalmente.
- Se uma linha lá dentro lançar uma exceção, o Java salta logo para o bloco `catch`. O resto do bloco `try` é saltado.
- Entre parênteses, depois de `catch`, está a exceção que é apanhada e um nome para ela, normalmente `e`.
- Depois, o programa continua normalmente. Agora também aparece “Pronto!”.

Se tudo correr bem no bloco `try`, o bloco `catch` é simplesmente saltado.

::: ludwig
try e catch são como a rede por baixo do trapézio no circo: enquanto tudo corre bem, nem dás por ela. Se alguém cair, a rede apanha-o e o espetáculo continua.
:::

> No estrutograma não há nenhuma caixa para try e catch. Por isso o VisuStruct mostra o bloco inteiro como uma instrução. Só o podes executar com o Java verdadeiro.

## Transformar texto num número

Muitas vezes um número começa por ser texto, por exemplo mais tarde num campo de texto numa janela. `Integer.parseInt` transforma texto num número inteiro:

```java
String entrada = "doze";
try {
    int numero = Integer.parseInt(entrada);
    System.out.println("Dobro: " + numero * 2);
} catch (NumberFormatException e) {
    System.out.println("Isto não é um número: " + entrada);
}
```

O Java não consegue converter “doze” e lança uma `NumberFormatException`. O programa escreve “Isto não é um número: doze”. Muda a primeira linha para `String entrada = "12";` e executa outra vez: agora aparece “Dobro: 24”.

## Saber de profissional: as exceções são objetos

Isto não está no programa da disciplina, mas é útil saber.

::: angeberwissen
Cada exceção é um objeto de uma classe própria, por exemplo `ArithmeticException` para a divisão por 0. `e.getMessage()` dá-te a sua mensagem, por exemplo `/ by zero`.

Depois de um `try` podem vir vários blocos `catch`, um para cada tipo de erro. `catch (Exception e)` apanha todas as exceções, mas diz-te menos sobre o que aconteceu. E um bloco `finally { … }` no fim corre sempre, quer tenha havido erro quer não.
:::

## Jogo: A rede apanha?

::: spiel frage
titel: Jogo: A rede apanha?
intro: O Ludwig anda no trapézio. O try e o catch apanham-no, ou o programa vai abaixo? Sete rondas.

runde:
    int[] notas = {2, 3, 1};
    System.out.println(notas[3]);
    System.out.println("Pronto!");
frage: O que acontece com Java a sério?
- Aparece 1 e Pronto!
- Só aparece Pronto!
- [x] O programa vai abaixo com uma ArrayIndexOutOfBoundsException.
> A posição 3 não existe. Ninguém apanha a exceção, por isso Pronto! nunca chega a aparecer.

runde:
    int[] notas = {2, 3, 1};
    try {
        System.out.println(notas[3]);
    } catch (ArrayIndexOutOfBoundsException e) {
        System.out.println("Esta nota não existe.");
    }
    System.out.println("Pronto!");
frage: O que aparece?
- Pronto!
- [x] Esta nota não existe.\nPronto!
- Esta nota não existe.
> O bloco catch apanha a exceção, e depois o programa continua normalmente.

runde:
    try {
        System.out.println("A");
        System.out.println(10 / 0);
        System.out.println("B");
    } catch (ArithmeticException e) {
        System.out.println("C");
    }
frage: O que aparece?
- A\nB\nC
- [x] A\nC
- C
> Em 10 / 0, o Java salta logo para o bloco catch. O resto do bloco try, o B, é saltado.

runde:
    String entrada = "12";
    try {
        int numero = Integer.parseInt(entrada);
        System.out.println("Dobro: " + numero * 2);
    } catch (NumberFormatException e) {
        System.out.println("Isto não é um número: " + entrada);
    }
frage: O que aparece?
- [x] Dobro: 24
- Isto não é um número: 12
- Dobro: 1212
> "12" pode ser convertido. Se tudo correr bem no bloco try, o catch é saltado.

runde:
frage: Que exceção lança `Integer.parseInt("2.5")`?
- ArithmeticException
- [x] NumberFormatException
- nenhuma, o resultado é 2
> parseInt só converte números inteiros. Com um ponto, o formato não é válido.

runde:
frage: Que exceção lança `12 / 0` com `int`?
- [x] ArithmeticException
- NumberFormatException
- ArrayIndexOutOfBoundsException
> Dividir por 0 não funciona com números inteiros. A mensagem é `/ by zero`.

runde:
    try {
        int fatias = 12 / 0;
    } catch (NumberFormatException e) {
        System.out.println("Erro!");
    }
    System.out.println("Pronto!");
frage: O que acontece?
- Aparece Erro! e Pronto!
- Só aparece Pronto!
- [x] O programa vai abaixo.
> O catch só apanha a exceção que está entre parênteses. Uma ArithmeticException cai pela rede.
:::

## Tarefa: dividir em segurança

Este programa falha:

```java
int bolo = 12;
int pessoas = 0;
System.out.println("Cada um recebe " + bolo / pessoas + " fatias.");
System.out.println("Bom apetite!");
```

1. Executa-o com o Java verdadeiro e lê a mensagem de erro. Que exceção é?
2. Apanha-a com try e catch. Em vez da falha deve aparecer “Sem pessoas não se pode dividir.”, e “Bom apetite!” deve aparecer na mesma.
3. Põe `pessoas` a 4 e verifica que aparece “Cada um recebe 3 fatias.”.

::: ludwig
A exceção chama-se `ArithmeticException`. Põe no bloco `try` só a linha que pode falhar.
:::

## Lista de verificação

::: checkliste
- Consigo ligar o Java verdadeiro na área Programação. → Ligar o Java verdadeiro
- Consigo ler numa mensagem de erro a exceção e a linha. → Ler a mensagem de erro
- Consigo apanhar uma exceção com try e catch. → try e catch
- Consigo transformar texto num número com Integer.parseInt e apanhar a NumberFormatException. → Transformar texto num número
- O meu programa divide em segurança, mesmo por 0. → Tarefa: dividir em segurança
:::

## Teste de conhecimentos

::: quiz
? O que acontece quando uma exceção não é apanhada?
- [ ] O Java salta a linha e continua.
- [x] O programa para.
- [ ] O computador reinicia.
> É por isso que no primeiro exemplo “Pronto!” não aparece.

? O que acontece no bloco try depois da linha que lança uma exceção?
- [ ] As restantes linhas correm na mesma.
- [x] O resto é saltado e o Java salta para o bloco catch.
- [ ] O Java recomeça o bloco try.

? Que exceção lança Integer.parseInt("doze")?
- [ ] ArithmeticException
- [ ] ArrayIndexOutOfBoundsException
- [x] NumberFormatException
> “doze” não tem um formato de número que o Java entenda.

? Associa cada exceção à sua causa.
= ArrayIndexOutOfBoundsException -> índice fora do array
= ArithmeticException -> divisão por 0
= NumberFormatException -> o texto não é um número
:::
