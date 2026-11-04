---
titel: Adivinha o número
bereich: Janelas com Swing
kurz: Um jogo com número aleatório, contagem de tentativas e um botão que se desliga no fim.
---

## Competências que vou adquirir agora

::: kompetenzen
- criar com Math.random um número inteiro aleatório de 1 a 100
- decidir que variáveis pertencem à classe
- desligar um botão com setEnabled
- construir um jogo de adivinhar com um botão “Novo jogo”
:::

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

Experimenta na área [Código](#zeige-codelive): `int secreto = (int) (Math.random() * 100) + 1;` e `System.out.println(secreto);`. Cada execução dá um número diferente.

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

## Ganhar com 7 tentativas

::: angeberwissen
Quem adivinha com jeito nunca precisa de mais de 7 tentativas. Escolhe sempre o meio do intervalo que ainda resta: primeiro 50, depois 25 ou 75 e assim por diante. Cada palpite corta o intervalo a meio: 100, 50, 25, 13, 7, 4, 2, 1. É a **pesquisa binária** da lição 19. Como 2 elevado a 7 = 128 é maior do que 100, chegam 7 palpites.
:::

## Tarefa: adivinha o número

Reconstrói o jogo e melhora-o:

- Uma entrada como “abc” não conta como tentativa e mostra a dica “Escreve um número”.
- Um segundo botão **Novo jogo** pensa num número novo, põe as tentativas a 0, volta a ligar o botão Adivinhar e repõe a dica.

Extra: depois de 7 tentativas falhadas o jogo está perdido. A janela revela então o número secreto.

**Terminaste quando …**

- cada palpite errado mostra “demasiado pequeno” ou “demasiado grande”,
- “abc” mostra o aviso para escrever um número e as tentativas não mudam,
- **Novo jogo** põe as tentativas a 0, volta a ligar o botão de adivinhar e repõe o aviso.

::: ludwig
Para “não conta como tentativa”, o `tentativas++` tem de vir **depois** de `Integer.parseInt`, os dois dentro do bloco `try`. Se o `parseInt` lançar uma exceção, a linha com `tentativas++` é saltada.
:::

## Jogo: Demasiado pequeno ou demasiado grande?

::: spiel frage
titel: Jogo: Demasiado pequeno ou demasiado grande?
intro: O Ludwig está a jogar ao adivinha o número. Lê o código e prevê o que acontece. Sete rondas.

runde:
    // secreto é 42
    if (palpite < secreto) {
        dica.setText(palpite + " é demasiado pequeno.");
    } else if (palpite > secreto) {
        dica.setText(palpite + " é demasiado grande.");
    } else {
        dica.setText("Certo!");
    }
frage: O Ludwig escreve 50. O que diz a dica?
- 50 é demasiado pequeno.
- [x] 50 é demasiado grande.
- Certo!
> 50 é maior do que 42.

runde:
frage: O número está entre 1 e 100. 50 era demasiado grande, 25 era demasiado pequeno. Que número é que o Ludwig, esperto, tenta a seguir?
- 26
- [x] 37
- 49
> Sobram 26 a 49. O meio é 37 (ou 38). Assim, cada palpite corta o intervalo a meio.

runde:
    int dado = (int) (Math.random() * 6) + 1;
frage: Que números pode ter `dado`?
- 0 a 6
- [x] 1 a 6
- 1 a 7
> `Math.random() * 6` vai de 0 até um pouco menos de 6. `(int)` faz disso 0 a 5, e `+ 1` faz 1 a 6. Um dado!

runde:
    int numero = (int) (Math.random() * 10);
frage: Que números pode ter `numero`?
- [x] 0 a 9
- 1 a 10
- 0 a 10
> Sem `+ 1` começa em 0, e o 10 nunca é alcançado.

runde:
    // secreto é 42
    tentativas++;
    if (palpite == secreto) {
        dica.setText("Certo! Precisaste de " + tentativas + " tentativas.");
    }
frage: O Ludwig escreve 50, depois 25, depois 42. O que diz a dica no fim?
- Certo! Precisaste de 2 tentativas.
- [x] Certo! Precisaste de 3 tentativas.
- Certo! Precisaste de 42 tentativas.
> `tentativas++` conta a cada clique, também no acerto.

runde:
    botao.setEnabled(false);
frage: O Ludwig encontrou o número e clica mais uma vez em **Adivinhar**. O que acontece?
- O jogo recomeça.
- Conta mais uma tentativa.
- [x] Nada, o botão fica cinzento e não se pode clicar.
> `setEnabled(false)` desliga o botão.

runde:
frage: Agora o número está entre 1 e 1000. Quantos palpites são precisos, no máximo, com a pesquisa binária?
- 7
- [x] 10
- 500
> 2 elevado a 10 = 1024 é maior do que 1000. Dez divisões a meio chegam.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo criar com Math.random um número inteiro aleatório de 1 a 100. → Um número aleatório
- Consigo decidir que variáveis pertencem à classe. → O que o jogo guarda
- Consigo desligar um botão com setEnabled. → O programa completo
- Consigo construir um jogo de adivinhar com um botão “Novo jogo”. → Tarefa: adivinha o número
:::

## Teste de conhecimentos

::: quiz
? Que números dá (int) (Math.random() * 100) + 1?
→ Um número aleatório
- [ ] 0 a 100
- [x] 1 a 100
- [ ] 1 a 101

? O que faz botao.setEnabled(false)?
→ O programa completo
- [ ] Tira o botão da janela.
- [x] O botão fica cinzento e já não se pode clicar.
- [ ] Muda o texto do botão.

? Com a pesquisa binária, quantas tentativas precisas no máximo para 1 a 100?
→ Tarefa: adivinha o número
- [ ] 50
- [ ] 10
- [x] 7
> Cada palpite corta o intervalo a meio, e 2 elevado a 7 = 128 é maior do que 100.
:::
