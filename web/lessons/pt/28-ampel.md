---
titel: Um semáforo com cores
bereich: Janelas com Swing
kurz: Definir cores de fundo e mudar um semáforo com uma variável de estado.
---

## O objetivo

Vamos construir um semáforo: uma área grande acende a vermelho. A cada clique em **Seguinte** muda: vermelho, verde, amarelo e outra vez vermelho.

As novidades desta vez são as **cores** e um **estado**: o programa tem de se lembrar de que cor está acesa.

Marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen).

## Cores no Swing

As cores estão na classe `Color` de `java.awt`. Cores já prontas são, por exemplo, `Color.RED`, `Color.GREEN`, `Color.YELLOW`, `Color.ORANGE` e `Color.WHITE`.

É assim que pintas uma etiqueta:

```
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

Para o semáforo saber o que vem a seguir, guarda o seu estado num número: 0 é vermelho, 1 é verde, 2 é amarelo. Tal como no contador de cliques da lição 27, a variável fica na classe, para o ouvinte a poder alterar:

```
static int fase = 0;
```

A cada clique a fase avança um. Depois do amarelo (2) vem outra vez o vermelho (0):

```
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

```
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
O BorderLayout é o layout que um `JFrame` usa quando não lhe dás nenhum. Um `add` sem indicação de lugar vai para o `CENTER`. É por isso que na lição 26 as peças ficaram todas umas por cima das outras.
:::

::: angeberwissen
Os profissionais avançam a fase numa linha: `fase = (fase + 1) % 3;`. O operador de resto `%` dá o resto da divisão. 3 % 3 é 0, por isso depois do 2 recomeça no 0.
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

::: checkliste
- Consigo pintar uma etiqueta com setOpaque e setBackground. → Cores no Swing
- Consigo guardar um estado numa variável static. → Lembrar a cor
- Com o BorderLayout consigo pôr algo grande no meio e algo estreito em baixo. → O programa completo
- O meu semáforo tem quatro fases. → Tarefa: semáforo
:::

## Teste de conhecimentos

::: quiz
? Porque é que a cor fica invisível sem setOpaque(true)?
- [ ] Porque Color.RED não existe
- [x] Porque, sem isso, uma etiqueta é transparente
- [ ] Porque a janela é demasiado pequena

? Que lugar do BorderLayout fica com o espaço que sobra?
- [ ] NORTH
- [ ] SOUTH
- [x] CENTER

? fase é 2 e o ouvinte executa fase++ e depois if (fase > 2) { fase = 0; }. Que valor tem fase a seguir?
- [x] 0
- [ ] 2
- [ ] 3
> Depois de fase++ é 3, que é maior do que 2, por isso passa a 0.
:::
