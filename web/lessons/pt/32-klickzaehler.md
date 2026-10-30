---
titel: Contador de cliques com reset
bereich: Janelas com Swing
kurz: Dois botões alteram o mesmo número: criar uma variável para a classe toda.
---

## Competências que vou adquirir agora

::: kompetenzen
- explicar porque é que um ouvinte não pode alterar uma variável do main
- criar uma variável static na classe
- fazer com que dois botões alterem o mesmo número
- construir um contador com −1 que nunca fica abaixo de 0
:::

## O objetivo

Uma janela conta cliques: em cima está o número, por baixo dois botões. **+1** soma um, **Reset** volta a pôr o número a 0.

A novidade desta vez: dois botões trabalham com o **mesmo** número. Para isso precisas de uma variável que os dois ouvintes conheçam.

Marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen).

## A primeira tentativa

A ideia mais óbvia é criar o número no `main`, como de costume, e somá-lo no ouvinte:

```java
int contagem = 0;
botao.addActionListener(e -> {
    contagem++;
    numero.setText("" + contagem);
});
```

Se executares isto com o Java verdadeiro, o compilador indica um erro:

```
local variables referenced from a lambda expression must be final or effectively final
```

::: ludwig
O ouvinte só corre mais tarde, a cada clique, muito depois de o `main` ter terminado. Por isso pode ler as variáveis do `main`, mas não alterá-las. O Java insiste: uma variável do `main` que aparece na seta tem de ficar igual. Para um número que muda a cada clique, precisamos de outro lugar.
:::

## Uma variável para a classe toda

A solução: a variável **não** vai para o `main`, mas diretamente para a classe, por cima do `main`. Assim pertence à classe toda, e qualquer ouvinte a pode alterar:

```java
public class Contador {
    static int contagem = 0;

    public static void main(String[] args) {
        // aqui a janela, como de costume
    }
}
```

- `static` quer dizer: a variável pertence à própria classe. Como o `main` também é `static`, aqui é preciso.
- Uma variável destas chama-se **atributo** da classe. Vive tanto tempo como o programa, e não só enquanto o `main` corre.

## O programa completo

```java
import javax.swing.*;
import java.awt.*;

public class Contador {
    static int contagem = 0;

    public static void main(String[] args) {
        JFrame janela = new JFrame("Contador de cliques");
        janela.setSize(250, 200);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setLayout(new GridLayout(0, 1));

        JLabel numero = new JLabel("0", SwingConstants.CENTER);
        JButton mais = new JButton("+1");
        JButton reset = new JButton("Reset");

        mais.addActionListener(e -> {
            contagem++;
            numero.setText("" + contagem);
        });
        reset.addActionListener(e -> {
            contagem = 0;
            numero.setText("0");
        });

        janela.add(numero);
        janela.add(mais);
        janela.add(reset);
        janela.setVisible(true);
    }
}
```

`SwingConstants.CENTER` põe o texto da etiqueta no meio. Clica algumas vezes em +1 e depois em Reset.

::: angeberwissen
Com `numero.setFont(new Font("SansSerif", Font.BOLD, 48));` o número fica grande e a negrito. `Font` vem de `java.awt`, que já importaste.
:::

## Jogo: Quem está a contar?

::: spiel zuhoerer
titel: Jogo: Quem está a contar?
intro: Agora os ouvintes fazem contas com a variável da classe. O Ludwig mostra-te o código, a janela e os cliques. Que número aparece no fim? A seguir o Ludwig reproduz os cliques.
frage: O que diz a etiqueta depois dos cliques?

runde:
    static int contagem = 0;
    JLabel numero = new JLabel("0");
    JButton mais = new JButton("+1");
    mais.addActionListener(e -> {
        contagem++;
        numero.setText("" + contagem);
    });
klicks: +1, +1, +1
- 1
- [x] 3
- 0
> A variável está na classe e guarda o valor entre os cliques. Cada clique soma um: 1, 2, 3.

runde:
    static int contagem = 0;
    JLabel numero = new JLabel("0");
    JButton mais = new JButton("+1");
    JButton reset = new JButton("Reset");
    mais.addActionListener(e -> {
        contagem++;
        numero.setText("" + contagem);
    });
    reset.addActionListener(e -> {
        contagem = 0;
        numero.setText("0");
    });
klicks: +1, +1, Reset, +1
- 3
- 0
- [x] 1
> Depois de dois cliques aparece 2. O Reset põe a variável a 0, e o último clique volta a contar até 1.

runde:
    static int contagem = 0;
    JLabel numero = new JLabel("0");
    JButton mais = new JButton("+1");
    mais.addActionListener(e -> contagem++);
klicks: +1, +1
- 2
- [x] 0
- 1
> A variável fica a 2, mas ninguém a escreve na etiqueta. Sem `numero.setText(…)` a janela continua a mostrar 0. Calcular e mostrar são duas coisas diferentes.

runde:
    static int contagem = 0;
    JLabel numero = new JLabel("Cliques: 0");
    JButton mais = new JButton("+1");
    mais.addActionListener(e -> {
        contagem++;
        numero.setText("Cliques: " + contagem + 1);
    });
klicks: +1
- Cliques: 2
- Cliques: 1
- [x] Cliques: 11
> A armadilha dos parênteses: o Java calcula da esquerda para a direita. `"Cliques: " + contagem` dá o texto “Cliques: 1”, e `+ 1` junta mais um 1 no fim.

runde:
    static int contagem = 0;
    JLabel numero = new JLabel("0");
    JButton um = new JButton("+1");
    JButton dez = new JButton("+10");
    um.addActionListener(e -> {
        contagem++;
        numero.setText("" + contagem);
    });
    dez.addActionListener(e -> {
        contagem += 10;
        numero.setText("" + contagem);
    });
klicks: +10, +1, +10
- 12
- [x] 21
- 111
> Os dois ouvintes alteram a mesma variável: 10, depois 11, depois 21. `contagem += 10` é a forma curta de `contagem = contagem + 10`.
:::

## Tarefa: contador de cliques

Reconstrói o contador de cliques e acrescenta:

- um botão **−1** que subtrai um,
- o número nunca deve ficar abaixo de 0. Se estiver em 0, o −1 não faz nada.

::: ludwig
Para “nunca abaixo de 0”, o ouvinte do −1 precisa de um `if`: só se `contagem > 0` é que subtrai.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo explicar porque é que um ouvinte não pode alterar uma variável do main. → A primeira tentativa
- Consigo criar uma variável static na classe. → Uma variável para a classe toda
- Consigo fazer com que dois botões alterem o mesmo número. → O programa completo
- Consigo construir um contador com −1 que nunca fica abaixo de 0. → Tarefa: contador de cliques
:::

## Teste de conhecimentos

::: quiz
? Porque é que o ouvinte não pode alterar a variável contagem do main?
→ A primeira tentativa
- [ ] Porque no Swing não são permitidos números
- [x] Porque o ouvinte só corre mais tarde e o Java não deixa a seta alterar variáveis do main
- [ ] Porque a contagem fica demasiado grande

? Onde fica static int contagem = 0;?
→ Uma variável para a classe toda
- [ ] No main, bem em cima
- [x] Na classe, fora do main
- [ ] No ouvinte

? O que faz SwingConstants.CENTER em new JLabel("0", SwingConstants.CENTER)?
→ O programa completo
- [x] Põe o texto no meio da etiqueta.
- [ ] Põe a janela no meio do ecrã.
- [ ] Aumenta a letra.
:::
