---
titel: Um semáforo com cores
bereich: Janelas com Swing
kurz: Definir cores de fundo e mudar um semáforo com uma variável de estado.
---

## Competências que vou adquirir agora

::: kompetenzen
- pintar uma etiqueta com setOpaque e setBackground
- guardar um estado numa variável static
- usar o BorderLayout para pôr algo grande no meio e algo estreito em baixo
- explicar para que servem o FlowLayout, o GridLayout e o BorderLayout
- programar um semáforo com quatro fases
:::

## O objetivo

Vamos construir um semáforo: uma área grande acende a vermelho. A cada clique em **Seguinte** muda: vermelho, verde, amarelo e outra vez vermelho.

As novidades desta vez são as **cores** e um **estado**: o programa tem de se lembrar de que cor está acesa.

Marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen).

## Cores no Swing

As cores estão na classe `Color` de `java.awt`. Cores já prontas são, por exemplo, `Color.RED`, `Color.GREEN`, `Color.YELLOW`, `Color.ORANGE` e `Color.WHITE`.

É assim que pintas uma etiqueta:

```java
JLabel luz = new JLabel("", SwingConstants.CENTER);
luz.setOpaque(true);
luz.setBackground(Color.RED);
```

- `setBackground(…)` define a cor de fundo.
- Um `JLabel` precisa ainda de `setOpaque(true)`. Sem esta linha o fundo é transparente e a cor fica invisível.

::: ludwig
`opaque` é inglês para “opaco”, ou seja, não transparente. Normalmente uma etiqueta é transparente, como letras escritas num vidro. Só com `setOpaque(true)` ganha uma área própria que se pode pintar.
:::

## Lembrar a cor

Para o semáforo saber o que vem a seguir, guarda o seu estado num número: 0 é vermelho, 1 é verde, 2 é amarelo. Tal como no contador de cliques da lição 32, a variável fica na classe, para o ouvinte a poder alterar:

```java
static int fase = 0;
```

A cada clique a fase avança um. Depois do amarelo (2) vem outra vez o vermelho (0):

```java
seguinte.addActionListener(e -> {
    fase++;
    if (fase > 2) {
        fase = 0;
    }
    if (fase == 0) {
        luz.setBackground(Color.RED);
    } else if (fase == 1) {
        luz.setBackground(Color.GREEN);
    } else {
        luz.setBackground(Color.YELLOW);
    }
});
```

## O programa completo

```java
import javax.swing.*;
import java.awt.*;

public class Semaforo {
    static int fase = 0;

    public static void main(String[] args) {
        JFrame janela = new JFrame("Semáforo");
        janela.setSize(200, 300);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setLayout(new BorderLayout());

        JLabel luz = new JLabel("", SwingConstants.CENTER);
        luz.setOpaque(true);
        luz.setBackground(Color.RED);
        JButton seguinte = new JButton("Seguinte");

        seguinte.addActionListener(e -> {
            fase++;
            if (fase > 2) {
                fase = 0;
            }
            if (fase == 0) {
                luz.setBackground(Color.RED);
            } else if (fase == 1) {
                luz.setBackground(Color.GREEN);
            } else {
                luz.setBackground(Color.YELLOW);
            }
        });

        janela.add(luz, BorderLayout.CENTER);
        janela.add(seguinte, BorderLayout.SOUTH);
        janela.setVisible(true);
    }
}
```

Aqui entra um layout novo, o **BorderLayout**. Tem cinco lugares: `NORTH` (em cima), `SOUTH` (em baixo), `WEST` (à esquerda), `EAST` (à direita) e `CENTER` (no meio). O meio fica com todo o espaço que sobra. Assim a luz fica grande e o botão fica estreito em baixo.

::: angeberwissen
O BorderLayout é o layout que um `JFrame` usa quando não lhe dás nenhum. Um `add` sem indicação de lugar vai para o `CENTER`. É por isso que na lição 31 as peças ficaram todas umas por cima das outras.
:::

::: angeberwissen
Os profissionais avançam a fase numa linha: `fase = (fase + 1) % 3;`. O operador de resto `%` dá o resto da divisão. 3 % 3 é 0, por isso depois do 2 recomeça no 0.
:::

## Que layout para quê?

Já conheces três layouts. Cada um arruma os blocos de outra maneira:

| Layout | Como arruma | Bom para |
|---|---|---|
| `FlowLayout` (lição 29) | lado a lado, como palavras numa linha, cada bloco do tamanho necessário | alguns botões numa fila |
| `GridLayout` (lição 31) | uma grelha de células do mesmo tamanho, preenchida linha a linha | formulários, teclados como o da calculadora |
| `BorderLayout` (esta lição) | cinco lugares: em cima, em baixo, à esquerda, à direita e o meio, que fica com o resto | algo grande no meio, por exemplo uma imagem ou um mostrador, com botões na margem |

Sem `setLayout`, uma janela usa o BorderLayout. É por isso que, nesse caso, tudo vai para o meio.

::: ludwig
Ao planear, pergunta-te: todas as partes devem ter o mesmo tamanho? Então GridLayout. Uma parte deve ser grande e o resto estreito na margem? Então BorderLayout. As partes devem simplesmente manter o tamanho normal? Então FlowLayout.
:::

## Jogo: Onde fica o botão?

::: spiel layout
titel: Jogo: Onde fica o botão?
intro: Já conheces três layouts e a janela sem layout nenhum. O Ludwig mostra-te código com os botões A, B, C … Como fica a janela? Toca na imagem certa.
frage: Como fica a janela?

runde:
    janela.add(new JButton("A"));
    janela.add(new JButton("B"));
    janela.add(new JButton("C"));
- flow: A B C
- grid: A / B / C
- [x] border: C=C
> Sem layout próprio, cada `add` vai para o meio, do tamanho da janela. Os três ficam uns por cima dos outros e só se vê o último: C.

runde:
    janela.setLayout(new FlowLayout());
    janela.add(new JButton("A"));
    janela.add(new JButton("B"));
    janela.add(new JButton("C"));
- [x] flow: A B C
- grid: A B C
- border: C=C
> O FlowLayout põe os botões no tamanho normal lado a lado, como palavras numa linha, e centra-os.

runde:
    janela.setLayout(new GridLayout(0, 1));
    janela.add(new JButton("A"));
    janela.add(new JButton("B"));
    janela.add(new JButton("C"));
- flow: A B C
- [x] grid: A / B / C
- grid: A B C
> Uma coluna e tantas linhas quantas forem precisas: tudo uns por baixo dos outros, cada linha com a mesma altura e tão larga como a janela.

runde:
    janela.setLayout(new GridLayout(0, 2));
    janela.add(new JButton("A"));
    janela.add(new JButton("B"));
    janela.add(new JButton("C"));
    janela.add(new JButton("D"));
- grid: A C / B D
- [x] grid: A B / C D
- grid: A / B / C / D
> Duas colunas. As células são preenchidas linha a linha, sempre primeiro à esquerda e depois à direita: A B, depois C D.

runde:
    janela.setLayout(new GridLayout(2, 3));
    janela.add(new JButton("A"));
    janela.add(new JButton("B"));
    janela.add(new JButton("C"));
    janela.add(new JButton("D"));
    janela.add(new JButton("E"));
    janela.add(new JButton("F"));
- grid: A B / C D / E F
- [x] grid: A B C / D E F
- flow: A B C D E F
> Primeiro vêm as linhas, depois as colunas: 2 linhas com 3 colunas cada.

runde:
    janela.setLayout(new GridLayout(0, 2));
    janela.add(new JButton("A"));
    janela.add(new JButton("B"));
    janela.add(new JButton("C"));
- [x] grid: A B / C
- grid: A B C
- grid: A / B C
> Duas colunas, três botões: a primeira linha fica cheia, na segunda o C fica à esquerda e a célula da direita fica vazia.

runde:
    janela.setLayout(new BorderLayout());
    janela.add(new JButton("A"), BorderLayout.NORTH);
    janela.add(new JButton("B"), BorderLayout.CENTER);
    janela.add(new JButton("C"), BorderLayout.SOUTH);
- grid: A / B / C
- [x] border: N=A C=B S=C
- border: N=C C=B S=A
> NORTH é em cima, SOUTH em baixo. O meio fica com todo o espaço que sobra, por isso o B é grande.

runde:
    janela.setLayout(new BorderLayout());
    janela.add(new JButton("A"), BorderLayout.WEST);
    janela.add(new JButton("B"));
    janela.add(new JButton("C"), BorderLayout.EAST);
- flow: A B C
- border: N=A C=B S=C
- [x] border: W=A C=B E=C
> WEST é à esquerda, EAST à direita. O B não tem lugar indicado e por isso vai para o CENTER.
:::

## Tarefa: semáforo

Reconstrói o semáforo e torna-o mais realista. Em alguns países, como a Alemanha, depois do vermelho acendem durante pouco tempo o vermelho e o amarelo juntos. Acrescenta por isso uma quarta fase:

- 0: vermelho
- 1: vermelho e amarelo (usa `Color.ORANGE`)
- 2: verde
- 3: amarelo

Extra: em cada fase, escreve também com `luz.setText(…)` o que o semáforo quer dizer, por exemplo “Parar” ou “Avançar”.

::: ludwig
Com quatro fases, depois do 3 vem o 0. Ajusta por isso o número em `if (fase > 2)`.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo pintar uma etiqueta com setOpaque e setBackground. → Cores no Swing
- Consigo guardar um estado numa variável static. → Lembrar a cor
- Consigo usar o BorderLayout para pôr algo grande no meio e algo estreito em baixo. → O programa completo
- Consigo explicar para que servem o FlowLayout, o GridLayout e o BorderLayout. → Que layout para quê?
- Consigo programar um semáforo com quatro fases. → Tarefa: semáforo
:::

## Teste de conhecimentos

::: quiz
? Porque é que a cor fica invisível sem setOpaque(true)?
→ Cores no Swing
- [ ] Porque Color.RED não existe
- [x] Porque, sem isso, uma etiqueta é transparente
- [ ] Porque a janela é demasiado pequena

? Que lugar do BorderLayout fica com o espaço que sobra?
→ O programa completo
- [ ] NORTH
- [ ] SOUTH
- [x] CENTER

? fase é 2 e o ouvinte executa fase++ e depois if (fase > 2) { fase = 0; }. Que valor tem fase a seguir?
→ Lembrar a cor
- [x] 0
- [ ] 2
- [ ] 3
> Depois de fase++ é 3, que é maior do que 2, por isso passa a 0.
:::
