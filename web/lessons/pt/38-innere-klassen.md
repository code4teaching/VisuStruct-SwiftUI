---
titel: Classes internas
bereich: Janelas com Swing
kurz: Escrever um ouvinte como classe interna com nome, como classe anónima e como lambda, e saber quem vê o quê.
---

## O objetivo

O contador de cliques da lição 32 já conheces. Hoje escreves o seu ouvinte de **três maneiras**, que fazem todas exatamente o mesmo:

1. como **classe interna com nome**, como se fazia quase sempre antes do Java 8,
2. como **classe anónima**, que conheces do saber de profissional da lição 30,
3. como **lambda** com a seta, como até agora.

Em código de outras pessoas, em livros e na internet vais encontrar as três. Depois desta lição vais reconhecê-las.

Marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen).

## Lembrete: o contrato

Um ouvinte é tudo o que cumpre o contrato `ActionListener`. Nele está exatamente um método:

```
public void actionPerformed(ActionEvent e)
```

O botão chama-o a cada clique. As três maneiras de escrever são três caminhos para fornecer este único método.

## 1. A classe interna com nome

Uma **classe interna** fica dentro de outra classe. Tem um nome, aqui `Mais`, e cumpre o contrato com `implements ActionListener`:

```
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Contador {
    static int contagem = 0;
    static JLabel numero = new JLabel("0", SwingConstants.CENTER);

    static class Mais implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            contagem++;
            numero.setText("" + contagem);
        }
    }

    public static void main(String[] args) {
        JFrame janela = new JFrame("Contador de cliques");
        janela.setSize(250, 200);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setLayout(new GridLayout(0, 1));

        JButton mais = new JButton("+1");
        JButton outro = new JButton("Também +1");
        mais.addActionListener(new Mais());
        outro.addActionListener(new Mais());

        janela.add(numero);
        janela.add(mais);
        janela.add(outro);
        janela.setVisible(true);
    }
}
```

- `new Mais()` cria um objeto da classe `Mais`. É esse o ouvinte que o botão recebe.
- Como a classe tem nome, podes usá-la em vários botões, aqui em `mais` e `outro`.
- A classe está **fora** de `main`. Por isso só vê o que está na classe `Contador`: `contagem` e `numero`. É por isso que `numero` desta vez é uma variável da classe e não de `main`.
- Precisas de `static class` porque `main` é static. Sem `static`, o javac indica "non-static variable this cannot be referenced from a static context".

## 2. A classe anónima

Se só precisas do ouvinte num sítio, podes escrever a classe mesmo onde o objeto é preciso. Assim ela não recebe nome:

```
mais.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent e) {
        contagem++;
        numero.setText("" + contagem);
    }
});
```

- `new ActionListener() { … }` quer dizer: "um objeto novo que cumpre o contrato ActionListener, e é assim: …".
- No fim está `});`: a chaveta fecha a classe, o parêntese fecha a chamada de `addActionListener`.
- A classe anónima está **dentro** de `main`. Por isso também vê as variáveis de `main`, desde que já não mudem.

## 3. O lambda

O lambda é a forma curta da classe anónima, desde o Java 8:

```
mais.addActionListener(e -> {
    contagem++;
    numero.setText("" + contagem);
});
```

Fica de fora tudo o que o Java já sabe: `new ActionListener()`, o nome `actionPerformed`, `public void` e o tipo `ActionEvent`. Sobram o parâmetro `e`, a seta e o corpo. Isto só funciona porque o contrato tem exatamente **um** método.

## As três comparadas

| | classe interna com nome | classe anónima | lambda |
|---|---|---|---|
| tem nome | sim, p. ex. `Mais` | não | não |
| fica | na classe, fora de `main` | mesmo junto ao botão | mesmo junto ao botão |
| para vários botões | sim, `new Mais()` | não | sim, numa variável (lição 37) |
| vê variáveis de `main` | não | sim, se não mudarem | sim, se não mudarem |
| comprimento | a mais longa | média | a mais curta |

::: ludwig
Se uma variável de `main` tiver de mudar no ouvinte, como `contagem++`, tem de ir para a classe, seja qual for a maneira de escrever. Esse era o problema da lição 32.
:::

::: angeberwissen
Depois de compilar, espreita a pasta com os ficheiros `.class`. O javac cria um ficheiro para cada classe: `Contador.class`, `Contador$Mais.class` para a classe interna e `Contador$1.class` para a classe anónima. Como não tem nome, recebe um número. Um lambda não tem ficheiro próprio, o Java só o constrói quando o programa arranca.
:::

## Jogo: Que maneira de escrever?

::: spiel frage
titel: Jogo: Que maneira de escrever?
intro: O Ludwig mostra-te ouvintes de programas de outras pessoas. Que maneira de escrever é esta? Seis rondas.
frage: Que maneira de escrever é esta?
antworten: classe interna com nome | classe anónima | lambda

runde:
    botao.addActionListener(e -> texto.setText("Olá"));
richtig: lambda
> A seta `->` denuncia o lambda.

runde:
    botao.addActionListener(new ActionListener() {
        public void actionPerformed(ActionEvent e) {
            texto.setText("Olá");
        }
    });
richtig: classe anónima
> `new ActionListener() {` e a seguir um método inteiro: aqui está a ser escrita uma classe sem nome.

runde:
    static class Saudacao implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            texto.setText("Olá");
        }
    }
richtig: classe interna com nome
> A classe chama-se `Saudacao` e cumpre o contrato com `implements ActionListener`.

runde:
    botao.addActionListener(new Saudacao());
richtig: classe interna com nome
> `new Saudacao()` cria um objeto da classe `Saudacao`. A própria classe está noutro sítio e tem nome.

runde:
    ActionListener tecla = e -> {
        visor.setText(visor.getText() + e.getActionCommand());
    };
richtig: lambda
> Um lambda numa variável, como no cadeado da lição 37. A seta denuncia-o.

runde:
    ActionListener tecla = new ActionListener() {
        public void actionPerformed(ActionEvent e) {
            visor.setText(visor.getText() + e.getActionCommand());
        }
    };
richtig: classe anónima
> Uma classe anónima também pode ficar numa variável. Assim pode ser registada em vários botões, tal como o lambda.
:::

## Tarefa: Um contador, três maneiras

Constrói o contador de cliques com três botões:

- **+1** recebe a classe interna com nome `Mais`.
- **-1** recebe uma classe anónima.
- **Reset** recebe um lambda.

Experimenta se os três botões contam como esperado. Depois tira o `static` da classe `Mais` e lê a mensagem de erro do javac.

## Lista de verificação

::: checkliste
- Sei escrever um ouvinte como classe interna com nome. → 1. A classe interna com nome
- Sei escrever um ouvinte como classe anónima. → 2. A classe anónima
- Sei o que fica de fora no lambda. → 3. O lambda
- Sei que maneira de escrever vê que variáveis. → As três comparadas
- O meu contador tem três botões escritos de três maneiras. → Tarefa: Um contador, três maneiras
:::

## Teste de conhecimentos

::: quiz
? Porque é que a forma curta com a seta funciona com ActionListener?
- [ ] Porque ActionListener é uma classe.
- [x] Porque o contrato tem exatamente um método.
- [ ] Porque o botão o exige.

? Que maneira de escrever podes usar com new Mais() em vários botões sem a guardar numa variável?
- [x] a classe interna com nome
- [ ] a classe anónima
- [ ] o lambda

? Porque é que está static antes de class Mais?
- [ ] Para a classe ser mais rápida.
- [x] Porque main é static e senão não consegue criar um objeto de Mais.
- [ ] Porque todas as classes têm de ser static.

? Liga.
= class Mais implements ActionListener -> classe interna com nome
= new ActionListener() { … } -> classe anónima
= a seta depois de e -> lambda
:::
