---
titel: Adivinha o número
bereich: Janelas com Swing
kurz: Um jogo com número aleatório, contagem de tentativas e um botão que se desliga no fim.
---

## O objetivo

Agora um jogo: o computador pensa num número de 1 a 100. Tu adivinhas, e a janela diz-te “demasiado pequeno” ou “demasiado grande”. Quando o encontrares, diz-te quantas tentativas precisaste.

As novidades desta vez são os **números aleatórios** e um botão que se **desliga** no fim.

Marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen).

## Um número aleatório

`Math.random()` dá um número decimal aleatório de 0 até quase 1, por exemplo 0.4173. Em três passos transforma-se num número inteiro de 1 a 100:

```java
int secreto = (int) (Math.random() * 100) + 1;
```

| Passo | Exemplo |
|---|---|
| `Math.random()` | 0.4173 |
| `* 100` | 41.73 |
| `(int)` corta as casas decimais | 41 |
| `+ 1` | 42 |

Sem o `+ 1` sairia de 0 a 99.

Experimenta na área [Programação](#zeige-codelive): `int secreto = (int) (Math.random() * 100) + 1;` e `System.out.println(secreto);`. Cada execução dá um número diferente.

::: angeberwissen
Na verdade, os computadores não sabem lançar dados. O `Math.random()` calcula com uma fórmula uma longa sequência de números que só **parecem** aleatórios. Chamam-se números pseudoaleatórios. Para jogos chega perfeitamente.
:::

## O que o jogo guarda

O jogo tem de se lembrar de duas coisas ao longo de todos os cliques: o número secreto e o número de tentativas. Tal como no contador de cliques da lição 32, as duas ficam na classe:

```java
static int secreto = (int) (Math.random() * 100) + 1;
static int tentativas = 0;
```

## O programa completo

```java
import javax.swing.*;
import java.awt.*;

public class AdivinhaNumero {
    static int secreto = (int) (Math.random() * 100) + 1;
    static int tentativas = 0;

    public static void main(String[] args) {
        JFrame janela = new JFrame("Adivinha o número");
        janela.setSize(320, 180);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setLayout(new GridLayout(0, 1));

        JLabel dica = new JLabel("Estou a pensar num número de 1 a 100.");
        JTextField campo = new JTextField();
        JButton botao = new JButton("Adivinhar");

        botao.addActionListener(e -> {
            int palpite = Integer.parseInt(campo.getText());
            tentativas++;
            if (palpite < secreto) {
                dica.setText(palpite + " é demasiado pequeno.");
            } else if (palpite > secreto) {
                dica.setText(palpite + " é demasiado grande.");
            } else {
                dica.setText("Certo! Precisaste de " + tentativas + " tentativas.");
                botao.setEnabled(false);
            }
            campo.setText("");
        });

        janela.add(dica);
        janela.add(campo);
        janela.add(botao);
        janela.setVisible(true);
    }
}
```

- `campo.setText("")` esvazia o campo de texto depois de cada palpite, para escreveres logo o seguinte.
- `botao.setEnabled(false)` desliga o botão. Fica cinzento e já não se pode clicar. O jogo acabou.

::: ludwig
Com `setEnabled(true)` voltas a ligar um botão. Assim podes, por exemplo, só ativar um botão depois de alguém ter escrito alguma coisa.
:::

## Saber de profissional: ganhar com 7 tentativas

::: angeberwissen
Quem adivinha com jeito nunca precisa de mais de 7 tentativas. Escolhe sempre o meio do intervalo que ainda resta: primeiro 50, depois 25 ou 75 e assim por diante. Cada palpite corta o intervalo a meio: 100, 50, 25, 13, 7, 4, 2, 1. É a **pesquisa binária** da lição 19. Como 2 elevado a 7 = 128 é maior do que 100, chegam 7 palpites.
:::

## Tarefa: adivinha o número

Reconstrói o jogo e melhora-o:

- Uma entrada como “abc” não conta como tentativa e mostra a dica “Escreve um número”.
- Um segundo botão **Novo jogo** pensa num número novo, põe as tentativas a 0, volta a ligar o botão Adivinhar e repõe a dica.

Extra: depois de 7 tentativas falhadas o jogo está perdido. A janela revela então o número secreto.

::: ludwig
Para “não conta como tentativa”, o `tentativas++` tem de vir **depois** de `Integer.parseInt`, os dois dentro do bloco `try`. Se o `parseInt` lançar uma exceção, a linha com `tentativas++` é saltada.
:::

## Lista de verificação

::: checkliste
- Consigo criar com Math.random um número inteiro aleatório de 1 a 100. → Um número aleatório
- Sei que variáveis pertencem à classe. → O que o jogo guarda
- Consigo desligar um botão com setEnabled. → O programa completo
- O meu jogo tem um botão “Novo jogo”. → Tarefa: adivinha o número
:::

## Teste de conhecimentos

::: quiz
? Que números dá (int) (Math.random() * 100) + 1?
- [ ] 0 a 100
- [x] 1 a 100
- [ ] 1 a 101

? O que faz botao.setEnabled(false)?
- [ ] Tira o botão da janela.
- [x] O botão fica cinzento e já não se pode clicar.
- [ ] Muda o texto do botão.

? Com a pesquisa binária, quantas tentativas precisas no máximo para 1 a 100?
- [ ] 50
- [ ] 10
- [x] 7
> Cada palpite corta o intervalo a meio, e 2 elevado a 7 = 128 é maior do que 100.
:::
