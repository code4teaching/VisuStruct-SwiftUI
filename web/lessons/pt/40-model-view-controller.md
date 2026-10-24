---
titel: Model View Controller
bereich: Janelas com Swing
kurz: Dividir o contador de cliques em model, view e controller e perceber quem fala com quem.
---

## O objetivo

Os programas grandes com janelas têm quase sempre a mesma estrutura. Chama-se **Model View Controller**, ou **MVC**, em português modelo, vista e controlador:

- O **model** guarda os dados e conhece as suas regras.
- A **view** só mostra os dados.
- O **controller** reage aos cliques e dá o recado.

Aprendes MVC com o contador de cliques da lição 32. Ele é dividido em três partes, passo a passo. No fim mostra a mesma contagem duas vezes: como número e como barra.

Marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen).

## Tudo numa classe

Até agora o contador de cliques era assim, tudo está em `main` e numa variável da classe:

```java
static int contagem = 0;

public static void main(String[] args) {
    // ... construir a janela ...
    JLabel numero = new JLabel("0", SwingConstants.CENTER);
    JButton mais = new JButton("+1");
    mais.addActionListener(e -> {
        contagem++;
        numero.setText("" + contagem);
    });
}
```

Funciona. Mas imagina que a contagem também deve aparecer como barra, mais tarde numa segunda janela e num ficheiro. Então cada ouvinte tem de se lembrar de todos os visores. Contar e mostrar ficam atados num nó, e com cada visor o nó fica maior.

O MVC desata o nó: cada tarefa recebe a sua própria classe.

## O model

O model é o próprio contador, sem nada de Swing:

```java
class Contador {
    int valor = 0;

    void aumentar() {
        valor++;
    }

    int getValor() {
        return valor;
    }
}
```

- Desta vez não há `static` antes de `valor` e dos métodos. Assim pertencem a um **objeto**: `new Contador()` constrói um contador com o seu próprio `valor`, tal como `new JButton("+1")` constrói um botão com a sua própria legenda.
- `model.aumentar()` chama o método deste contador, tal como `botao.setText(…)`.
- Quem quer saber o valor pergunta com `getValor()`. Mudá-lo só é possível através de `aumentar()`.

Como o model não precisa de janela, podes experimentá-lo sem janela nenhuma:

```java
public class ContadorTeste {
    public static void main(String[] args) {
        Contador model = new Contador();
        model.aumentar();
        model.aumentar();
        System.out.println(model.getValor());
    }
}

class Contador {
    int valor = 0;

    void aumentar() {
        valor++;
    }

    int getValor() {
        return valor;
    }
}
```

A saída é 2. Num ficheiro podem estar várias classes. Só uma delas é `public`, e essa tem o `main`.

## A view

A view mostra o valor e mais nada. Não faz contas e não sabe de onde vem o número:

```java
class VistaNumero {
    JLabel numero = new JLabel("0", SwingConstants.CENTER);

    void atualizar(int valor) {
        numero.setText("" + valor);
    }
}
```

- A view recebe o valor com `atualizar(int valor)` e escreve-o no seu JLabel.
- A janela e o botão constróis em `main`, como sempre. Com `janela.add(view.numero)` o JLabel da view entra na janela.

## O controller

O controller é o ouvinte do botão. Liga o model à view:

```java
Contador model = new Contador();
VistaNumero view = new VistaNumero();

mais.addActionListener(e -> {
    model.aumentar();
    view.atualizar(model.getValor());
});
```

- Primeiro muda o model, depois vai buscar o novo valor e entrega-o à view.
- O problema da lição 32 desapareceu: a variável `model` nunca muda, aponta sempre para o mesmo contador. Só o `valor` lá dentro muda. Por isso o lambda pode usar `model`, sem nenhum `static`.

## Quem fala com quem?

A cada clique correm quatro mensagens, sempre pela mesma ordem:

::: grafik mvc-klick.svg
As setas acendem-se uma após a outra. O model conta na segunda seta, o visor só na quarta.
:::

1. O botão comunica o clique ao controller (`actionPerformed`).
2. O controller diz ao model: `aumentar()`.
3. O controller pergunta ao model o novo valor: `getValor()`.
4. O controller entrega o valor à view: `atualizar(valor)`.

O model não fala com ninguém. Espera até lhe perguntarem.

::: ludwig
Lembra-te: o model não sabe nada de janelas. Em `Contador` não há nenhum `JLabel` nem nenhum `import javax.swing`. Se precisares de Swing ali, o código pertence à view.
:::

## A vantagem: uma segunda view

Agora a contagem também deve aparecer como barra. Para isso junta-se uma segunda view. Uma `JProgressBar` é uma barra que se enche, aqui de 0 a 10:

```java
class VistaBarra {
    JProgressBar barra = new JProgressBar(0, 10);

    void atualizar(int valor) {
        barra.setValue(valor);
    }
}
```

O controller ganha mais uma linha. O model fica exatamente como estava:

```java
mais.addActionListener(e -> {
    model.aumentar();
    view.atualizar(model.getValor());
    barra.atualizar(model.getValor());
});
```

É exatamente esta a vantagem do MVC: podes acrescentar ou trocar visores sem mexer no model.

## O programa completo

```java
import javax.swing.*;
import java.awt.*;

class Contador {
    int valor = 0;

    void aumentar() {
        valor++;
    }

    int getValor() {
        return valor;
    }
}

class VistaNumero {
    JLabel numero = new JLabel("0", SwingConstants.CENTER);

    void atualizar(int valor) {
        numero.setText("" + valor);
    }
}

class VistaBarra {
    JProgressBar barra = new JProgressBar(0, 10);

    void atualizar(int valor) {
        barra.setValue(valor);
    }
}

public class ContadorCliques {
    public static void main(String[] args) {
        Contador model = new Contador();
        VistaNumero view = new VistaNumero();
        VistaBarra barra = new VistaBarra();

        JFrame janela = new JFrame("Contador de cliques");
        janela.setSize(250, 200);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setLayout(new GridLayout(0, 1));

        JButton mais = new JButton("+1");
        mais.addActionListener(e -> {
            model.aumentar();
            view.atualizar(model.getValor());
            barra.atualizar(model.getValor());
        });

        janela.add(view.numero);
        janela.add(barra.barra);
        janela.add(mais);
        janela.setVisible(true);
    }
}
```

Clica algumas vezes em +1 e vê o número e a barra a crescer juntos.

::: angeberwissen
O MVC foi inventado em 1979 pelo norueguês Trygve Reenskaug, no centro de investigação Xerox PARC, na Califórnia. Já nessa altura havia lá computadores com janelas e rato. No mesmo ano, Steve Jobs visitou o laboratório e ficou tão entusiasmado que a Apple passou a construir computadores com janelas e rato.
:::

## Jogo: Onde pertence o código?

::: spiel frage
titel: Jogo: Onde pertence o código?
intro: O Ludwig atirou código de um programa MVC para um monte. Arruma cada peça. Oito rondas.
frage: Onde pertence este código?
antworten: Model | View | Controller

runde:
    int valor = 0;
richtig: Model
> A contagem são os dados. Os dados moram no model.

runde:
    numero.setText("" + valor);
richtig: View
> Mostrar algo no ecrã é a tarefa da view.

runde:
    mais.addActionListener(e -> model.aumentar());
richtig: Controller
> Reagir a um clique e avisar o model: é isso que o controller faz.

runde:
    void aumentar() {
        valor++;
    }
richtig: Model
> O próprio model sabe como mudar os seus dados.

runde:
    barra.setValue(valor);
richtig: View
> Uma barra que se enche só mostra. Portanto: view.

runde:
    void aumentar() {
        if (valor < 10) {
            valor++;
        }
    }
richtig: Model
> "No máximo 10" é uma regra para os dados. As regras pertencem ao model, assim valem para todos os botões e todas as views.

runde:
    view.atualizar(model.getValor());
richtig: Controller
> Ir buscar o valor ao model e entregá-lo à view: é o controller no meio.

runde:
    JLabel numero = new JLabel("0", SwingConstants.CENTER);
richtig: View
> Um JLabel é uma peça do ecrã. No model não há Swing.
:::

## Jogo: Quem é o próximo?

::: spiel reihenfolge
titel: Jogo: Quem é o próximo?
intro: Depois de um clique, o model, a view e o controller falam uns com os outros, mas só funciona por uma ordem. Põe os passos pela ordem certa. Cinco rondas.

runde:
frage: Clicas em +1 no contador de cliques. O que acontece, um passo após o outro?
- Clicas em +1.
- O controller recebe `actionPerformed`.
- O controller chama `model.aumentar()`.
- O model aumenta o `valor`.
- O controller vai buscar `model.getValor()`.
- A view mostra o novo número.
> Clique, controller, mudar o model, ir buscar o valor, mostrar. São as quatro setas da imagem, com a contagem no meio.

runde:
    mais.addActionListener(e -> {
        model.aumentar();
        view.atualizar(model.getValor());
        barra.atualizar(model.getValor());
    });
frage: O que acontece depois de um clique em +1, um passo após o outro?
- O clique em +1
- `model.aumentar()`
- O número mostra o novo valor.
- A barra cresce.
> O ouvinte trata as suas linhas de cima para baixo: primeiro o model, depois o número, depois a barra.

runde:
frage: Põe o controller pela ordem certa, para que a view mostre o novo número.
- `mais.addActionListener(e -> {`
- `model.aumentar();`
- `view.atualizar(model.getValor());`
- `});`
> Primeiro mudar, depois mostrar. Ao contrário, a view ainda mostra o valor antigo.

runde:
    reset.addActionListener(e -> {
        model.reiniciar();
        view.atualizar(model.getValor());
    });
frage: O contador está em 5. Clicas em Reset. O que acontece, um passo após o outro?
- Clicas em Reset.
- O model põe o `valor` a 0.
- `model.getValor()` devolve 0.
- A view mostra 0.
> Também o Reset passa pelo controller até ao model. A view só sabe do novo valor no fim.

runde:
frage: Um teste sem janela deve escrever 1. Por que ordem estão as linhas no main?
- `Contador model = new Contador();`
- `model.aumentar();`
- `System.out.println(model.getValor());`
> Primeiro construir o objeto, depois trabalhar com ele e no fim ver o resultado. O model pode ser testado sem janela nenhuma.
:::

## Tarefa: Um contador com limites

Constrói o programa completo e experimenta-o.

Depois melhora-o:

- Um botão **−1** conta para baixo. O model recebe para isso um método `diminuir()`, o controller um segundo ouvinte.
- Um botão **Reset** põe o contador a 0 com `reiniciar()`.
- O próprio model trata dos limites: nunca abaixo de 0 e nunca acima de 10, porque aí a barra está cheia.
- Extra: uma terceira view `VistaConsola`, cujo `atualizar` escreve "Novo valor: 3" com `System.out.println`. Uma view não tem de ser uma janela.

## Lista de verificação

::: checkliste
- Sei dizer o que fazem o model, a view e o controller. → O objetivo
- Sei escrever um model sem Swing e testá-lo sem janela. → O model
- Sei o que constrói new Contador() e porque é que ali não há static. → O model
- Conheço as quatro mensagens depois de um clique. → Quem fala com quem?
- Sei acrescentar uma segunda view sem mudar o model. → A vantagem: uma segunda view
- O meu contador tem −1, Reset e limites no model. → Tarefa: Um contador com limites
:::

## Teste de conhecimentos

::: quiz
? Onde fica a regra "O contador nunca passa de 10"?
- [x] no model
- [ ] na view
- [ ] no controller
> As regras sobre os dados pertencem ao model. Assim valem seja qual for o botão.

? O que faz a view?
- [ ] Calcula o novo valor.
- [x] Mostra o valor que recebe.
- [ ] Ouve os cliques.

? Porque é que o lambda pode usar model, se model é uma variável do main?
- [ ] Porque Contador é public.
- [x] Porque model aponta sempre para o mesmo contador; só o valor lá dentro muda.
- [ ] Porque os lambdas podem mudar qualquer variável.

? O que tens de mudar no model quando se junta uma segunda view?
- [x] nada
- [ ] um segundo método aumentar
- [ ] um segundo JLabel

? Liga.
= Contador com valor e aumentar() -> model
= VistaNumero com atualizar(int valor) -> view
= o ouvinte do botão -> controller
:::
