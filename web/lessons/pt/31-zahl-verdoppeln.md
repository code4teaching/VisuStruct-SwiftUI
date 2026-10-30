---
titel: Duplicar um número na janela
bereich: Janelas com Swing
kurz: Arrumar uma etiqueta, um campo de texto e um botão com um GridLayout e calcular com o texto do campo de texto.
---

## Competências que vou adquirir agora

::: kompetenzen
- pôr um JLabel e um JTextField na janela
- explicar porque é que sem layout só se vê a última peça
- arrumar tudo umas por baixo das outras com GridLayout
- calcular com getText, Integer.parseInt e setText
- escrever um programa que não falha com “abc”
:::

## O objetivo

Vamos construir uma pequena calculadora com janela: em cima está uma etiqueta, por baixo um campo de texto e um botão **Calcular**. Se escreveres 2 e clicares, o campo de texto mostra 4. Clicas outra vez e passa a 8, depois 16 e assim por diante.

Para isso precisas de duas peças novas:

- **JLabel**: uma etiqueta, ou seja, texto simples na janela.
- **JTextField**: um campo de texto onde se pode escrever.

Como nas últimas lições, marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen).

## Três peças na janela

Pomos as três peças na janela, tal como o botão na lição 29:

```java
import javax.swing.*;

public class Duplicar {
    public static void main(String[] args) {
        JFrame janela = new JFrame("Duplicar número");
        janela.setSize(250, 150);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JLabel etiqueta = new JLabel("Escreve um número:");
        JTextField campo = new JTextField();
        JButton botao = new JButton("Calcular");
        janela.add(etiqueta);
        janela.add(campo);
        janela.add(botao);

        janela.setVisible(true);
    }
}
```

Executa o programa. Ups: só se vê o botão gigante. Onde estão a etiqueta e o campo de texto?

## Porque só se vê o botão

::: ludwig
Lembras-te do botão gigante? Sem um layout próprio, um `JFrame` só tem **um** lugar: o meio. Cada `add` põe a peça nova exatamente aí, do tamanho da janela inteira. As três peças ficam por isso umas por cima das outras no mesmo lugar, e a janela só mostra a última que lá puseste: o botão. Assim não consegues usar o programa.
:::

A solução é outra vez um layout. Desta vez usamos o **GridLayout**. Divide a janela em células do mesmo tamanho, como uma grelha:

```java
janela.setLayout(new GridLayout(0, 1));
```

Os dois números são linhas e colunas. `0` linhas quer dizer “tantas quantas forem precisas”, `1` coluna quer dizer: tudo umas por baixo das outras. Para o `GridLayout` precisas ainda de `import java.awt.*;` lá em cima.

| Layout | Como arruma |
|---|---|
| sem layout | tudo no meio, umas por cima das outras |
| `FlowLayout` | lado a lado como palavras, com mudança de linha quando é preciso |
| `GridLayout(0, 1)` | umas por baixo das outras, todas as linhas da mesma altura |

## A janela com GridLayout

```java
import javax.swing.*;
import java.awt.*;

public class Duplicar {
    public static void main(String[] args) {
        JFrame janela = new JFrame("Duplicar número");
        janela.setSize(250, 150);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setLayout(new GridLayout(0, 1));

        JLabel etiqueta = new JLabel("Escreve um número:");
        JTextField campo = new JTextField();
        JButton botao = new JButton("Calcular");
        janela.add(etiqueta);
        janela.add(campo);
        janela.add(botao);

        janela.setVisible(true);
    }
}
```

Agora as três estão umas por baixo das outras. Podes escrever no campo de texto e carregar no botão. Mas o programa ainda não calcula nada.

::: angeberwissen
Com `new GridLayout(2, 3)` obténs 2 linhas com 3 colunas cada, ou seja, 6 células do mesmo tamanho. É assim que se constroem, por exemplo, as teclas de uma calculadora. As peças preenchem as células pela ordem das linhas `add`, linha a linha da esquerda para a direita.
:::

## Calcular com o texto do campo de texto

Com um clique, o programa deve ir buscar o número ao campo de texto, duplicá-lo e voltar a escrevê-lo lá. Isso faz-se com três métodos:

- `campo.getText()` dá-te o texto do campo de texto, por exemplo `"2"`.
- `Integer.parseInt(…)` transforma-o no número 2. Já conheces isto da lição 22.
- `campo.setText(…)` escreve um texto novo no campo de texto.

Juntamente com o ActionListener da lição 30 fica assim:

```java
botao.addActionListener(e -> {
    int numero = Integer.parseInt(campo.getText());
    campo.setText("" + numero * 2);
});
```

`setText` precisa de um texto. `"" + numero * 2` junta o resultado a um texto vazio e assim transforma o número num texto.

## Não é um número? Sem falhas!

Escreve “abc” no campo de texto e clica em Calcular. A janela fica, mas não acontece nada, e na [consola](#zeige-konsole) aparece uma `NumberFormatException`. Da lição 22 já sabes o que fazer:

```java
botao.addActionListener(e -> {
    try {
        int numero = Integer.parseInt(campo.getText());
        campo.setText("" + numero * 2);
    } catch (NumberFormatException erro) {
        etiqueta.setText("Escreve um número inteiro!");
    }
});
```

Em vez de um erro na consola, vês agora um aviso na janela.

::: ludwig
A seta já tem um `e` para o evento. Por isso a exceção no `catch` precisa de outro nome, aqui `erro`. O Java não permite duas variáveis com o mesmo nome.
:::

## Jogo: O que fica na janela?

::: spiel frage
titel: Jogo: O que fica na janela?
intro: O Ludwig escreve algo no campo de texto e clica em Calcular. Lê o ouvinte e prevê o que a janela mostra depois. Seis rondas.

runde:
    botao.addActionListener(e -> {
        int numero = Integer.parseInt(campo.getText());
        campo.setText("" + numero * 2);
    });
frage: No campo de texto está 21. O que fica lá depois do clique?
- 2121
- [x] 42
- 21
> `parseInt` transforma o texto no número 21. O dobro é 42.

runde:
    botao.addActionListener(e -> {
        int numero = Integer.parseInt(campo.getText());
        campo.setText("" + numero * 2);
    });
frage: No campo de texto está 21. Clicas duas vezes. O que fica lá depois?
- 42
- [x] 84
- 4242
> Cada clique duplica o que está no campo nesse momento: 21, 42, 84.

runde:
    botao.addActionListener(e -> {
        campo.setText(campo.getText() + campo.getText());
    });
frage: No campo de texto está 21. O que fica lá depois do clique?
- 42
- [x] 2121
- 21
> Sem `parseInt` continua a ser texto, e `+` junta textos.

runde:
    botao.addActionListener(e -> {
        try {
            int numero = Integer.parseInt(campo.getText());
            campo.setText("" + numero * 2);
        } catch (NumberFormatException erro) {
            etiqueta.setText("Escreve um número inteiro!");
        }
    });
frage: No campo de texto está abc. O que acontece com o clique?
- [x] A etiqueta mostra "Escreve um número inteiro!"
- No campo de texto fica abcabc.
- A janela vai abaixo.
> `parseInt` lança uma NumberFormatException, e o `catch` apanha-a.

runde:
    botao.addActionListener(e -> {
        try {
            int numero = Integer.parseInt(campo.getText());
            campo.setText("" + numero * 2);
        } catch (NumberFormatException erro) {
            etiqueta.setText("Escreve um número inteiro!");
        }
    });
frage: No campo de texto está 2.5. O que acontece com o clique?
- No campo de texto fica 5.0.
- No campo de texto fica 5.
- [x] A etiqueta mostra "Escreve um número inteiro!"
> `Integer.parseInt` só conhece números inteiros. Para ele, 2.5 não é um número.

runde:
    botao.addActionListener(e -> {
        int numero = Integer.parseInt(campo.getText());
        campo.setText("" + numero + numero);
    });
frage: No campo de texto está 5. O que fica lá depois do clique?
- 10
- [x] 55
- 5
> `"" + numero` já é um texto, e o segundo `+` junta outra vez o 5. Com `"" + (numero + numero)` o Java calcula primeiro.
:::

## Tarefa: duplicar um número

Junta o programa todo:

- uma janela com o título “Duplicar número”, com 250 píxeis de largura e 150 píxeis de altura,
- umas por baixo das outras, uma etiqueta, um campo de texto e um botão “Calcular”,
- cada clique duplica o número no campo de texto: 2, 4, 8, 16, …
- com “abc” aparece um aviso na etiqueta em vez de uma falha.

Extra: um segundo botão “Dividir por 2” divide o número por 2. O que acontece com 5?

::: ludwig
O botão “Dividir por 2” entra no GridLayout como quarta linha e recebe o seu próprio ActionListener. Com `int`, o Java corta as casas decimais ao dividir.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo pôr um JLabel e um JTextField na janela. → Três peças na janela
- Consigo explicar porque é que sem layout só se vê a última peça. → Porque só se vê o botão
- Consigo arrumar tudo umas por baixo das outras com GridLayout(0, 1). → A janela com GridLayout
- Consigo calcular com getText, Integer.parseInt e setText. → Calcular com o texto do campo de texto
- Consigo escrever um programa que não falha com “abc”. → Não é um número? Sem falhas!
:::

## Teste de conhecimentos

::: quiz
? Porque é que sem layout só se vê o botão?
→ Porque só se vê o botão
- [ ] Porque faltam a etiqueta e o campo de texto
- [x] Porque todas as peças estão no meio umas por cima das outras e a última tapa as outras
- [ ] Porque a janela é demasiado pequena

? O que significa new GridLayout(0, 1)?
→ A janela com GridLayout
- [ ] Nenhuma linha e uma coluna, por isso a janela fica vazia
- [x] Tantas linhas quantas forem precisas numa coluna, ou seja, tudo umas por baixo das outras
- [ ] Uma linha, tudo lado a lado

? O que te dá campo.getText()?
→ Calcular com o texto do campo de texto
- [ ] Sempre um número
- [x] O texto do campo de texto
- [ ] O título da janela
> Para um número precisas ainda de Integer.parseInt.

? Associa cada peça à sua função.
→ Três peças na janela
= JLabel -> etiqueta
= JTextField -> campo de texto para escrever
= JButton -> botão
= GridLayout -> arrumação em grelha
:::
