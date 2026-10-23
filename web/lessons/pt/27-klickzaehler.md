---
titel: Contador de cliques com reset
bereich: Janelas com Swing
kurz: Dois botões alteram o mesmo número: criar uma variável para a classe toda.
---

## O objetivo

Uma janela conta cliques: em cima está o número, por baixo dois botões. **+1** soma um, **Reset** volta a pôr o número a 0.

A novidade desta vez: dois botões trabalham com o **mesmo** número. Para isso precisas de uma variável que os dois ouvintes conheçam.

Marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen).

## A primeira tentativa

A ideia mais óbvia é criar o número no `main`, como de costume, e somá-lo no ouvinte:

```
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

```
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

```
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

## Tarefa: contador de cliques

Reconstrói o contador de cliques e acrescenta:

- um botão **−1** que subtrai um,
- o número nunca deve ficar abaixo de 0. Se estiver em 0, o −1 não faz nada.

::: ludwig
Para “nunca abaixo de 0”, o ouvinte do −1 precisa de um `if`: só se `contagem > 0` é que subtrai.
:::

## Lista de verificação

::: checkliste
- Sei porque é que um ouvinte não pode alterar uma variável do main. → A primeira tentativa
- Consigo criar uma variável static na classe. → Uma variável para a classe toda
- Dois botões alteram o mesmo número. → O programa completo
- O meu contador tem −1 e nunca fica abaixo de 0. → Tarefa: contador de cliques
:::

## Teste de conhecimentos

::: quiz
? Porque é que o ouvinte não pode alterar a variável contagem do main?
- [ ] Porque no Swing não são permitidos números
- [x] Porque o ouvinte só corre mais tarde e o Java não deixa a seta alterar variáveis do main
- [ ] Porque a contagem fica demasiado grande

? Onde fica static int contagem = 0;?
- [ ] No main, bem em cima
- [x] Na classe, fora do main
- [ ] No ouvinte

? O que faz SwingConstants.CENTER em new JLabel("0", SwingConstants.CENTER)?
- [x] Põe o texto no meio da etiqueta.
- [ ] Põe a janela no meio do ecrã.
- [ ] Aumenta a letra.
:::
