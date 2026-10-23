---
titel: Duplicar um número na janela
bereich: Janelas com Swing
kurz: Arrumar uma etiqueta, um campo de texto e um botão com um GridLayout e calcular com o texto do campo de texto.
---

## O objetivo

Vamos construir uma pequena calculadora com janela: em cima está uma etiqueta, por baixo um campo de texto e um botão **Calcular**. Se escreveres 2 e clicares, o campo de texto mostra 4. Clicas outra vez e passa a 8, depois 16 e assim por diante.

Para isso precisas de duas peças novas:

- **JLabel**: uma etiqueta, ou seja, texto simples na janela.
- **JTextField**: um campo de texto onde se pode escrever.

Como nas últimas lições, marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen).

## Três peças na janela

Pomos as três peças na janela, tal como o botão na lição 24:

```
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

```
janela.setLayout(new GridLayout(0, 1));
```

Os dois números são linhas e colunas. `0` linhas quer dizer “tantas quantas forem precisas”, `1` coluna quer dizer: tudo umas por baixo das outras. Para o `GridLayout` precisas ainda de `import java.awt.*;` lá em cima.

| Layout | Como arruma |
|---|---|
| sem layout | tudo no meio, umas por cima das outras |
| `FlowLayout` | lado a lado como palavras, com mudança de linha quando é preciso |
| `GridLayout(0, 1)` | umas por baixo das outras, todas as linhas da mesma altura |

## A janela com GridLayout

```
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

Juntamente com o ActionListener da lição 25 fica assim:

```
botao.addActionListener(e -> {
    int numero = Integer.parseInt(campo.getText());
    campo.setText("" + numero * 2);
});
```

`setText` precisa de um texto. `"" + numero * 2` junta o resultado a um texto vazio e assim transforma o número num texto.

## Não é um número? Sem falhas!

Escreve “abc” no campo de texto e clica em Calcular. A janela fica, mas não acontece nada, e na [consola](#zeige-konsole) aparece uma `NumberFormatException`. Da lição 22 já sabes o que fazer:

```
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

::: checkliste
- Consigo pôr um JLabel e um JTextField na janela. → Três peças na janela
- Sei porque sem layout só se vê a última peça. → Porque só se vê o botão
- Consigo arrumar tudo umas por baixo das outras com GridLayout(0, 1). → A janela com GridLayout
- Consigo calcular com getText, Integer.parseInt e setText. → Calcular com o texto do campo de texto
- O meu programa não falha com “abc”. → Não é um número? Sem falhas!
:::

## Teste de conhecimentos

::: quiz
? Porque é que sem layout só se vê o botão?
- [ ] Porque faltam a etiqueta e o campo de texto
- [x] Porque todas as peças estão no meio umas por cima das outras e a última tapa as outras
- [ ] Porque a janela é demasiado pequena

? O que significa new GridLayout(0, 1)?
- [ ] Nenhuma linha e uma coluna, por isso a janela fica vazia
- [x] Tantas linhas quantas forem precisas numa coluna, ou seja, tudo umas por baixo das outras
- [ ] Uma linha, tudo lado a lado

? O que te dá campo.getText()?
- [ ] Sempre um número
- [x] O texto do campo de texto
- [ ] O título da janela
> Para um número precisas ainda de Integer.parseInt.

? Associa cada peça à sua função.
= JLabel -> etiqueta
= JTextField -> campo de texto para escrever
= JButton -> botão
= GridLayout -> arrumação em grelha
:::
