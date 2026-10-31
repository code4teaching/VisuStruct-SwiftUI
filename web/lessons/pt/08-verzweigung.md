---
titel: Decisão
bereich: Fundamentos
kurz: Usar uma condição para decidir qual de dois ramos é executado.
---

## Competências que vou adquirir agora

::: kompetenzen
- explicar que é executado exatamente um ramo de uma decisão
- usar os operadores de comparação == != < <= > >=
- distinguir == de =
- construir uma decisão com um ramo vazio
- escrever uma decisão com if e else em Java
:::

## Se, então, senão

Até agora, todos os blocos eram sempre executados. Mas muitas vezes um programa deve **decidir**: se uma condição se verificar, faz uma coisa, senão faz a outra.

É para isso que serve a **decisão**. A condição fica no triângulo em cima. Por baixo, o estrutograma divide-se em dois ramos:

- **true** (esquerda): é executado se a condição for verdadeira
- **false** (direita): é executado se a condição for falsa

É sempre executado **exatamente um** dos dois ramos. Depois, o programa continua por baixo da decisão.

::: diagramm l07-alter-pruefen.visustruct
Consoante a idade introduzida, aparece uma mensagem ou a outra. Experimenta 17 e 18 na simulação.
:::

## Inserir uma decisão

Arrasta a **Decisão** da área Elementos para o estrutograma. Clica no triângulo e escreve a condição no Inspetor de objetos, p. ex. `idade >= 18`. A palavra `if` já está à frente.

Cada ramo começa com um marcador ø. Arrasta instruções para lá. Um ramo também pode ter vários blocos uns por cima dos outros.

## Operadores de comparação

Uma condição é normalmente uma **comparação**. O seu resultado é sempre `true` ou `false`.

- `==` igual, p. ex. `numero == 0`
- `!=` diferente, p. ex. `resposta != 42`
- `<` menor, `<=` menor ou igual
- `>` maior, `>=` maior ou igual

> Não confundas `==` com `=`. Um só `=` é uma atribuição e guarda um valor. Para comparar precisas de dois sinais de igual.

Com `%` verificas se um número é divisível por outro: `numero % 2 == 0` é verdadeiro se `numero` for par.

## Exercício: Par ou ímpar

::: übung l07-gerade
titel: Par ou ímpar
auftrag: Pede um número inteiro. Mostra **par** se for par, senão **ímpar**.
test: 4 -> par
test: 7 -> ímpar
test: 0 -> par
braucht: verzweigung
tipp: Aqui há duas possibilidades, por isso precisas de uma decisão. Como reconheces um número par?
tipp: Um número é par se não sobrar resto quando o divides por 2. A condição é `numero % 2 == 0`.
lösung: l07-gerade-loesung.visustruct
:::

## Exercício: O número maior

::: übung l07-maximum
titel: O número maior
auftrag: Pede dois números inteiros e mostra só o maior. Se os dois forem iguais, mostra esse número.
test: 3, 8 -> 8
test: 9, 2 -> 9
test: 5, 5 -> 5
braucht: verzweigung
tipp: Uma decisão compara os dois números. Cada ramo tem exatamente uma saída.
tipp: Compara com `a > b`. No ramo true mostras `a`, no ramo false `b`.
lösung: l07-maximum-loesung.visustruct
:::

## Um ramo vazio

Às vezes uma coisa só deve acontecer se a condição for verdadeira e, caso contrário, não acontece nada. Então o ramo false fica **vazio**. No estrutograma mostra o marcador **ø**.

::: diagramm l07-rabatt.visustruct
A partir de 50 euros tens 5 euros de desconto. Caso contrário não acontece nada; o ramo false está vazio. A saída em baixo é executada nos dois casos.
:::

::: angeberwissen
Uma única decisão esquecida deixou meia Internet em alvoroço em 2014: a falha de segurança **Heartbleed** no OpenSSL, um programa que muitos sites usam para a encriptação. Um computador podia dizer ao servidor: “Devolve-me a palavra *pão*, tem 500 letras.” O servidor não verificava se 500 correspondia ao comprimento real de 3 e devolvia simplesmente 500 caracteres da sua memória. Às vezes lá dentro estavam palavras-passe de outras pessoas. Só faltava um if: se o comprimento indicado for maior do que o real, então não devolver nada. Já agora, isto não tinha nada a ver com chavetas. Mééé, verifica as tuas entradas antes de acreditares nelas.
:::

## Exercício: Valor absoluto

::: übung l07-betrag
titel: Valor absoluto de um número
auftrag: Pede um número inteiro. Se for negativo, torna-o positivo. Depois mostra o número. Assim, -5 passa a 5, e 7 fica 7.
Usa uma decisão com um ramo vazio e só **uma** saída por baixo da decisão.
test: -5 -> 5
test: 7 -> 7
test: 0 -> 0
test: -12 -> 12
braucht: verzweigung
tipp: Só os números negativos têm de ser alterados. O que acontece a um número se o multiplicares por -1?
tipp: A condição é `numero < 0`. No ramo true trocas o sinal, p. ex. com `numero = 0 - numero`. O ramo false fica vazio.
lösung: l07-betrag-loesung.visustruct
:::

## Agora em Java

Esta é a verificação da idade do início desta lição em Java:

```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Quantos anos tens?");
int idade = scanner.nextInt();
if (idade >= 18) {
    System.out.println("És maior de idade.");
} else {
    System.out.println("Ainda não és maior de idade.");
}
```

- A condição fica depois de `if`, entre **parênteses curvos** `( )`.
- O ramo true fica entre **chavetas** `{ }`, o ramo false vem depois de `else`, nas suas próprias chavetas. Depois de uma chaveta não há ponto e vírgula.
- Se o ramo false estiver vazio, deixas simplesmente de fora `else { }`.
- O teu programa precisa das duas primeiras linhas uma vez, assim que lê alguma coisa. Depois, `scanner.nextInt()` lê um número inteiro. A pergunta antes disso é uma saída normal.

::: angeberwissen
O Java também tem uma mascote: o **Duke**, um bonequinho preto e branco com um grande nariz vermelho. Foi desenhado pela equipa do Java em 1992 e desde então acena em conferências e t-shirts. O Ludwig acha que um bode teria ficado melhor.
:::

::: übung l08-java-bestanden
titel: Aprovado em Java
code: java
auftrag: Escreve um programa em Java que pergunta pela pontuação. A partir de 50 pontos mostra **aprovado**, senão **reprovado**.
  Escreve o código na área Programação e depois clica em Verificar.
test: 50 -> aprovado
test: 49 -> reprovado
test: 100 -> aprovado
test: 0 -> reprovado
braucht: verzweigung
tipp: Começa pelas duas linhas do scanner. Depois perguntas pelos pontos, lês o valor e comparas com `if`.
tipp: A condição é `pontos >= 50`. Num ramo fica `System.out.println("aprovado");` e depois de `else` vem `System.out.println("reprovado");`.
lösung: l08-java-bestanden-loesung.visustruct
:::

::: angeberwissen
Se um ramo tiver só uma instrução, o Java até deixa tirar as chavetas. Nós nunca fazemos isso, e é por esta razão:

```java
if (idade >= 18)
    System.out.println("És maior de idade.");
    System.out.println("Podes ver o filme.");
```

Sem chavetas, só a primeira linha pertence ao if. A segunda é sempre executada, até para quem tem doze anos. A indentação engana, porque o Java não liga aos espaços.

Foi exatamente um erro destes que estava escondido em iPhones e Macs em 2014, conhecido como **“goto fail”**. Na linguagem C, a linha `goto fail;` aparecia por engano duas vezes debaixo de um if sem chavetas. A segunda era sempre executada e saltava a verificação dos certificados de segurança. Numa rede Wi-Fi aberta, um atacante podia, por exemplo, fazer-se passar pelo teu banco. Mééé, as chavetas custam dois caracteres, uma falha de segurança custa muito mais.
:::

## Preenche os espaços: par ou ímpar

::: lückentext
titel: Par ou ímpar
auftrag: Preenche as palavras e os sinais que faltam. O programa deve mostrar se um número é par.
```java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Que número?");
int numero = scanner.nextInt();
[[if]] (numero [[%]] 2 [[==]] 0) [[{]]
    System.out.println("par");
[[}]] [[else]] {
    System.out.println("ímpar");
}
```
erklärung: `numero % 2` é o resto da divisão por 2. Se for 0, o número é par. Para comparar precisas de `==`, um `=` sozinho é uma atribuição. Os dois ramos ficam entre chavetas.
:::

## Encontra o erro: entrada

::: übung l08-java-fehler
titel: Corrigir a entrada
code: java
auftrag: No jardim zoológico, as crianças com **menos** de 6 anos entram de graça, todos os outros pagam 4 euros. Mas o programa também deixa entrar de graça as crianças de seis anos.
  “Abrir no editor” mostra o código na área Programação. Encontra o erro, corrige-o e carrega em Verificar.
start: l08-java-fehler-start.visustruct
test: 5 -> Entrada gratuita
test: 6 -> 4 euros
test: 10 -> 4 euros
test: 0 -> Entrada gratuita
braucht: verzweigung
tipp: Experimenta o programa com 6. Que operador de comparação ainda deixa passar o 6?
tipp: “Menos de 6” é `idade < 6`. `<=` significa “menor ou igual”.
lösung: l08-java-fehler-loesung.visustruct
:::

## Jogo: Que caminho?

::: spiel frage
titel: Jogo: Que caminho?
intro: O Ludwig escreveu decisões em Java. Avalia a condição de cabeça e diz o que aparece. Sete rondas.

runde:
    int x = 5;
    if (x > 5) {
        System.out.println("grande");
    } else {
        System.out.println("pequeno");
    }
frage: O que aparece?
- grande
- [x] pequeno
- nada
> 5 > 5 é falso, porque 5 não é maior do que 5. Portanto, o ramo falso.

runde:
    int x = 5;
    if (x >= 5) {
        System.out.println("grande");
    } else {
        System.out.println("pequeno");
    }
frage: O que aparece?
- [x] grande
- pequeno
- grande e pequeno
> `>=` quer dizer "maior ou igual". 5 >= 5 é verdadeiro.

runde:
    int numero = 7;
    if (numero % 2 == 0) {
        System.out.println("par");
    } else {
        System.out.println("ímpar");
    }
frage: O que aparece?
- par
- [x] ímpar
- 1
> 7 % 2 dá resto 1, portanto não 0. O número é ímpar.

runde:
    int x = -4;
    if (x < 0) {
        x = -x;
    }
    System.out.println(x);
frage: O que aparece?
- -4
- [x] 4
- nada
> -4 < 0 é verdadeiro, por isso o sinal é invertido.

runde:
    int x = 4;
    if (x < 0) {
        x = -x;
    }
    System.out.println(x);
frage: O que aparece?
- -4
- [x] 4
- nada
> 4 < 0 é falso. O ramo falso está vazio, o programa continua simplesmente por baixo.

runde:
    int nota = 3;
    if (nota != 3) {
        System.out.println("diferente");
    } else {
        System.out.println("três");
    }
frage: O que aparece?
- diferente
- [x] três
- nada
> `!=` quer dizer "diferente de". 3 != 3 é falso.

runde:
    int a = 8;
    int b = 12;
    if (a > b) {
        System.out.println(a);
    } else {
        System.out.println(b);
    }
frage: O que aparece?
- 8
- [x] 12
- 20
> O programa mostra o maior dos dois números.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo explicar que é executado exatamente um ramo de uma decisão. → Se, então, senão
- Consigo usar os operadores de comparação == != < <= > >=. → Operadores de comparação
- Consigo distinguir == de =. → Operadores de comparação
- Consigo construir uma decisão com um ramo vazio. → Um ramo vazio
- Consigo escrever uma decisão com if e else em Java. → Agora em Java
:::

## Teste de conhecimentos

::: quiz
? Que ramo é executado se a condição for falsa?
→ Se, então, senão
- [ ] O ramo true
- [x] O ramo false
- [ ] Os dois ramos
- [ ] Nenhum, o programa termina
> Com false, é executado o ramo da direita. Depois, o programa continua por baixo da decisão.

? Que condição verifica se idade é exatamente 18?
→ Operadores de comparação
- [ ] idade = 18
- [x] idade == 18
- [ ] idade >= 18
> Um só = é uma atribuição. Para comparar precisas de ==.

? O que significa ø num ramo?
→ Um ramo vazio
- [x] Neste caso não acontece nada.
- [ ] O programa termina aqui.
- [ ] A condição é falsa.

? A condição é `pontos >= 50`. Para que valor é verdadeira?
→ Operadores de comparação
- [ ] 49
- [x] 50
- [ ] 0
> >= quer dizer maior ou igual. Portanto o 50 está incluído.

? Nos manuais, a decisão tem muitas vezes outro nome. Qual?
→ Se, então, senão
- [ ] Seleção múltipla
- [x] Instrução condicional
- [ ] Iteração
> As instruções de um ramo só são executadas sob uma condição. Por isso também se chama instrução condicional.

? Onde fica em Java a condição de uma decisão?
→ Agora em Java
- [x] Entre parênteses curvos logo a seguir a if
- [ ] Entre chavetas depois de else
- [ ] Depois de um ponto e vírgula
> `if (idade >= 18) { … }`: os parênteses curvos pertencem à condição, as chavetas ao ramo.
:::
