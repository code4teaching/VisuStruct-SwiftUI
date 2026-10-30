---
titel: Muitos botões, um ouvinte
bereich: Janelas com Swing
kurz: Um ouvinte para muitos botões e descobrir com getActionCommand e getSource qual foi o botão clicado.
---

## Competências que vou adquirir agora

::: kompetenzen
- guardar um ouvinte numa variável do tipo ActionListener e registá-lo em vários botões
- explicar o que devolvem getActionCommand e getSource
- pôr botões num JPanel com um ciclo
- construir um cadeado que só abre com o código certo
:::

## O objetivo

Desde a história do bolo, o Ludwig quer trancar o seu estábulo. Ele constrói um **cadeado de código**: nove teclas com algarismos, um zero, **C** para apagar e **OK** para verificar. Só quem escrever 1234 recebe "Portão aberto!".

São doze botões. Até agora, cada botão tinha o seu próprio ouvinte, como na calculadora da lição 35. Hoje aprendes como **um** ouvinte chega para todos os botões.

Marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen).

## Nove ouvintes quase iguais

Com um ouvinte por tecla ficaria assim:

```java
um.addActionListener(e -> visor.setText(visor.getText() + "1"));
dois.addActionListener(e -> visor.setText(visor.getText() + "2"));
tres.addActionListener(e -> visor.setText(visor.getText() + "3"));
// ... e assim por diante até 9
```

As linhas só se distinguem pelo algarismo. Quem quiser mudar um pormenor tem de o fazer nove vezes e de certeza que se esquece de uma linha.

## Um ouvinte numa variável

Um ouvinte também pode ficar numa **variável**. O seu tipo de dados é `ActionListener`, o contrato da lição 30. Depois registas o mesmo ouvinte em vários botões:

```java
ActionListener algarismo = e -> visor.setText(visor.getText() + e.getActionCommand());

um.addActionListener(algarismo);
dois.addActionListener(algarismo);
tres.addActionListener(algarismo);
```

`ActionListener` está no pacote `java.awt.event`. Por isso precisas de `import java.awt.event.*;` lá em cima.

Agora o código só existe uma vez. Mas como sabe o ouvinte que algarismo deve acrescentar?

## Quem clicou?

O `e` antes da seta é o **evento**, um objeto do tipo `ActionEvent`. O botão entrega-o a cada clique, e lá dentro está o que aconteceu:

| Chamada | Devolve | Exemplo |
|---|---|---|
| `e.getActionCommand()` | a legenda do botão clicado, como texto | `"7"` |
| `e.getSource()` | o próprio botão clicado | o botão `ok` |

- `getActionCommand()` dá jeito quando a legenda já diz o que fazer, como nos algarismos.
- `getSource()` compara-se com um botão usando `==`: `if (e.getSource() == ok)`. Aqui `==` está certo, porque se trata exatamente deste objeto, não de um texto.

::: ludwig
Textos comparas com `equals`, botões com `==`. Se quiseres decidir pela legenda, escreves `e.getActionCommand().equals("OK")`. Também funciona, mas deixa de funcionar assim que alguém mudar a legenda para "Abrir". `e.getSource() == ok` continua certo.
:::

## Botões num ciclo

Com um ouvinte partilhado, podes até criar as teclas dos algarismos num ciclo. Para ficarem bem arrumadas numa grelha, vão para um **JPanel**. Um JPanel é uma área na janela com o seu próprio layout:

```java
JPanel teclas = new JPanel(new GridLayout(0, 3));
for (int i = 1; i <= 9; i++) {
    JButton algarismo = new JButton("" + i);
    algarismo.addActionListener(tecla);
    teclas.add(algarismo);
}
```

- `"" + i` transforma o número `i` no texto da legenda.
- Em cada volta nasce um botão novo. Todos recebem o mesmo ouvinte `tecla`.
- `janela.add(teclas, BorderLayout.CENTER)` põe a área inteira, com todas as teclas, na janela.

## O programa completo

```java
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Cadeado {
    public static void main(String[] args) {
        JFrame janela = new JFrame("Cadeado de código");
        janela.setSize(240, 300);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setLayout(new BorderLayout());

        JLabel visor = new JLabel("", SwingConstants.CENTER);
        JPanel teclas = new JPanel(new GridLayout(0, 3));
        JButton apagar = new JButton("C");
        JButton ok = new JButton("OK");

        ActionListener tecla = e -> {
            if (e.getSource() == apagar) {
                visor.setText("");
            } else if (e.getSource() == ok) {
                if (visor.getText().equals("1234")) {
                    visor.setText("Portão aberto!");
                } else {
                    visor.setText("Errado");
                }
            } else {
                visor.setText(visor.getText() + e.getActionCommand());
            }
        };

        for (int i = 1; i <= 9; i++) {
            JButton algarismo = new JButton("" + i);
            algarismo.addActionListener(tecla);
            teclas.add(algarismo);
        }
        JButton zero = new JButton("0");
        zero.addActionListener(tecla);
        apagar.addActionListener(tecla);
        ok.addActionListener(tecla);
        teclas.add(apagar);
        teclas.add(zero);
        teclas.add(ok);

        janela.add(visor, BorderLayout.NORTH);
        janela.add(teclas, BorderLayout.CENTER);
        janela.setVisible(true);
    }
}
```

- `apagar` e `ok` são criados **antes** do ouvinte, porque o ouvinte compara com eles.
- O ouvinte verifica primeiro os dois botões especiais. Todos os outros são algarismos e acrescentam a sua legenda.

::: angeberwissen
O teclado do telefone tem o 1 em cima à esquerda, o da calculadora e do teclado do computador tem o 7 em cima à esquerda. Porquê? Quando chegaram os telefones de teclas, fizeram-se testes com pessoas que tinham de marcar números com eles. Com o 1 em cima eram mais rápidas, e as máquinas de calcular já tinham a sua disposição há muito tempo. O cadeado do Ludwig faz como o telefone.
:::

## Jogo: Quem clicou?

::: spiel zuhoerer
titel: Jogo: Quem clicou?
intro: Em cada ronda, **um** ouvinte está registado em vários botões. O Ludwig mostra-te o código, a janela e os cliques. O que fica no visor no fim? Depois o Ludwig reproduz os cliques.
frage: O que fica no visor depois dos cliques?

runde:
    JFrame janela = new JFrame("Letras");
    JLabel visor = new JLabel("");
    JButton a = new JButton("A");
    JButton b = new JButton("B");
    ActionListener z = e -> visor.setText(visor.getText() + e.getActionCommand());
    a.addActionListener(z);
    b.addActionListener(z);
klicks: A, B, A
- A
- AB
- [x] ABA
> Um ouvinte, dois botões. `e.getActionCommand()` devolve de cada vez a legenda do botão clicado, e ela é acrescentada no fim.

runde:
    JFrame janela = new JFrame("Contador");
    static int numero = 0;
    JLabel visor = new JLabel("0");
    JButton mais = new JButton("+");
    JButton menos = new JButton("-");
    ActionListener z = e -> {
        if (e.getSource() == mais) {
            numero++;
        } else {
            numero--;
        }
        visor.setText("" + numero);
    };
    mais.addActionListener(z);
    menos.addActionListener(z);
klicks: +, +, -
- 3
- [x] 1
- -1
> `e.getSource()` diz qual foi o botão. Duas vezes mais, uma vez menos: 0 + 1 + 1 - 1 = 1.

runde:
    JFrame janela = new JFrame("Letras");
    JLabel visor = new JLabel("");
    JButton a = new JButton("A");
    JButton b = new JButton("B");
    JButton c = new JButton("C");
    ActionListener z = e -> visor.setText(visor.getText() + e.getActionCommand());
    a.addActionListener(z);
    b.addActionListener(z);
klicks: A, C, B
- ACB
- [x] AB
- A
> O ouvinte só está registado em A e B. Quando se clica em C, ninguém está a ouvir.

runde:
    JFrame janela = new JFrame("Teclas");
    JLabel visor = new JLabel("");
    JButton um = new JButton("1");
    JButton dois = new JButton("2");
    JButton apagar = new JButton("C");
    ActionListener z = e -> {
        if (e.getActionCommand().equals("C")) {
            visor.setText("");
        } else {
            visor.setText(visor.getText() + e.getActionCommand());
        }
    };
    um.addActionListener(z);
    dois.addActionListener(z);
    apagar.addActionListener(z);
klicks: 1, 2, C, 1
- 121
- 12
- [x] 1
> Depois de 1 e 2 o visor mostra "12". C apaga tudo, e o último 1 fica sozinho.

runde:
    JFrame janela = new JFrame("Cadeado");
    JLabel visor = new JLabel("");
    JButton quatro = new JButton("4");
    JButton dois = new JButton("2");
    JButton ok = new JButton("OK");
    ActionListener z = e -> {
        if (e.getSource() == ok) {
            if (visor.getText().equals("42")) {
                visor.setText("Portão aberto!");
            } else {
                visor.setText("Errado");
            }
        } else {
            visor.setText(visor.getText() + e.getActionCommand());
        }
    };
    quatro.addActionListener(z);
    dois.addActionListener(z);
    ok.addActionListener(z);
klicks: 2, 4, OK
- Portão aberto!
- [x] Errado
- 24OK
> Foi escrito "24", mas o segredo é "42". A ordem dos cliques conta.
:::

## Tarefa: Cadeado de código

Constrói o cadeado de código e experimenta-o.

Depois melhora-o:

- Depois de três tentativas erradas, o **OK** desliga-se, como o botão do Adivinha o número na lição 36. Conta as tentativas numa variável `static int` na classe.
- Extra: o visor mostra `*` em vez dos algarismos. Guarda a entrada verdadeira numa `static String entrada = "";` e acrescenta ao visor só uma estrela.

::: ludwig
Também na calculadora da lição 35 chega um ouvinte para +, -, \* e /. Verifica lá dentro com `e.getActionCommand().equals("+")` que sinal de operação foi clicado.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo guardar um ouvinte numa variável do tipo ActionListener e registá-lo em vários botões. → Um ouvinte numa variável
- Consigo explicar o que devolvem getActionCommand e getSource. → Quem clicou?
- Consigo pôr botões num JPanel com um ciclo. → Botões num ciclo
- Consigo construir um cadeado que só abre com o código certo. → Tarefa: Cadeado de código
:::

## Teste de conhecimentos

::: quiz
? O que devolve e.getActionCommand() num clique no botão new JButton("7")?
→ Quem clicou?
- [ ] o número 7
- [x] o texto "7"
- [ ] o próprio botão

? Como verificas se foi clicado o botão ok?
→ Quem clicou?
- [x] e.getSource() == ok
- [ ] e.getSource().equals("ok")
- [ ] ok.getActionCommand()
> getSource devolve o próprio botão, e esse comparas com ==.

? Porque é que um ouvinte fica numa variável?
→ Um ouvinte numa variável
- [ ] Para correr mais depressa.
- [x] Para o poder registar em vários botões e escrever o código só uma vez.
- [ ] Porque senão os lambdas não são permitidos.

? Liga.
→ Quem clicou?
= ActionListener -> tipo de dados de um ouvinte
= ActionEvent -> o evento e com a informação sobre o clique
= JPanel -> uma área com o seu próprio layout
:::
