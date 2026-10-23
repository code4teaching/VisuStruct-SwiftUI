---
titel: Um botão na janela
bereich: Janelas com Swing
kurz: Pôr um botão na janela e arrumá-lo bem com um layout.
---

## Construir um botão

Uma janela vazia é aborrecida. Agora vai lá para dentro um botão. No Swing, um botão chama-se **JButton** (button é inglês para botão).

Precisas de duas linhas novas:

```
JButton botao = new JButton("Clica-me");
janela.add(botao);
```

- `new JButton("Clica-me")` constrói um botão. O texto entre parênteses fica escrito no botão.
- `janela.add(botao)` põe o botão na janela. Sem `add` o botão existe, mas não está em lado nenhum e não o vês.

## O programa completo

As duas linhas ficam **antes** de `setVisible(true)`, porque a janela deve primeiro ficar pronta e só depois ser mostrada:

```
import javax.swing.*;

public class JanelaBotao {
    public static void main(String[] args) {
        JFrame janela = new JFrame("Botão");
        janela.setSize(300, 200);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JButton botao = new JButton("Clica-me");
        janela.add(botao);

        janela.setVisible(true);
    }
}
```

Executa o programa. Surpresa: o botão é enorme e enche a janela toda!

::: ludwig
A ordem é a mesma da primeira janela: preparar, construir o botão, pô-lo na janela e só no fim mostrar. As linhas em branco no código ajudam-te a ver estas partes.
:::

## O botão gigante

A forma como uma janela arruma as suas partes é decidida pelo seu **layout**. Sem mais indicações, um `JFrame` põe tudo no meio e torna-o tão grande como a janela inteira.

Com outro layout o botão fica com o tamanho normal. O **FlowLayout** põe tudo lado a lado, como palavras numa linha, só do tamanho necessário:

```
import javax.swing.*;
import java.awt.*;

public class JanelaBotao {
    public static void main(String[] args) {
        JFrame janela = new JFrame("Botão");
        janela.setSize(300, 200);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setLayout(new FlowLayout());

        JButton botao = new JButton("Clica-me");
        janela.add(botao);

        janela.setVisible(true);
    }
}
```

O `FlowLayout` pertence à caixa de ferramentas AWT, mais antiga. Por isso há uma segunda linha em cima: `import java.awt.*;`.

::: angeberwissen
No FlowLayout os blocos correm como texto: se um botão já não cabe na linha, passa para a seguinte. Torna a janela estreita e vê como os botões mudam de linha. Flow é inglês para fluxo.
:::

## Clicar funciona, mas nada acontece

Clica no botão. Ele fica um pouco mais escuro enquanto o carregas. O Swing mostra assim que foi carregado. Fora isso, não acontece nada.

Isto não é um erro: ainda não disseste ao programa **o que** deve acontecer com um clique. Isso aprendes na próxima lição.

## Jogo: Desativar a bomba

::: spiel bombe
titel: Jogo: Desativar a bomba
intro: Em cada programa de janela há **exatamente um erro**, e a bomba está a contar. Lê o que o programa deve fazer e toca na linha errada antes de o tempo acabar. Seis rondas, 25 segundos cada.
zeit: 25

runde:
    JFrame janela = new JFrame("Botão");
    janela.setSize(300, 200);
    JButton botao = new JButton(Clica-me);
    janela.add(botao);
    janela.setVisible(true);
frage: Deve mostrar um botão "Clica-me".
fehler: 3
besser: JButton botao = new JButton("Clica-me");
> A legenda é um texto e precisa de aspas.

runde:
    JFrame janela = new JFrame("Botão");
    janela.setSize(300, 200);
    JButton botao = new JButton("OK");
    janela.add(janela);
    janela.setVisible(true);
frage: Deve pôr o botão "OK" na janela.
fehler: 4
besser: janela.add(botao);
> Na janela entra o botão, não a própria janela.

runde:
    import java.swing.*;
    import java.awt.*;
frage: Deve trazer o Swing e o FlowLayout para o programa.
fehler: 1
besser: import javax.swing.*;
> O Swing está em `javax.swing`, com x. O FlowLayout vem de `java.awt`, sem x.

runde:
    JFrame janela = new JFrame("Botão");
    janela.setSize(300, 200);
    janela.setLayout(new FlowLayout);
    janela.add(new JButton("OK"));
    janela.setVisible(true);
frage: Deve mostrar o botão no tamanho normal.
fehler: 3
besser: janela.setLayout(new FlowLayout());
> Depois de `new` e do nome vêm sempre parênteses, mesmo que não haja nada lá dentro.

runde:
    JFrame janela = new JFrame("Botão");
    janela.setSize(300, 200);
    janela.setLayout(new FlowLayout());
    JButton botao = new Jbutton("OK");
    janela.add(botao);
    janela.setVisible(true);
frage: Deve mostrar um botão "OK".
fehler: 4
besser: JButton botao = new JButton("OK");
> O Java distingue maiúsculas de minúsculas: `JButton` com B maiúsculo.

runde:
    JFrame janela = new JFrame("Botão");
    janela.setSize(300, 200);
    janela.setLayout(new FlowLayout());
    janela.add(new JButton("OK"));
    janela.setVisible(false);
frage: Deve mostrar a janela com o botão.
fehler: 5
besser: janela.setVisible(true);
> Com `false`, a janela fica invisível.
:::

## Tarefa: clica-me

Constrói uma janela com o título “Teste do botão”, com 300 por 200 píxeis e um botão “Clica-me” de tamanho normal. Deve ser possível carregar no botão, mesmo que ainda não aconteça nada.

Extra: põe um segundo botão “Eu também” ao lado. Por que ordem aparecem os botões? Troca as duas linhas `add` e experimenta outra vez.

::: ludwig
Cada botão precisa da sua própria variável, por exemplo `botao` e `botao2`, e do seu próprio `add`. O FlowLayout põe os botões pela ordem das linhas `add`.
:::

## Lista de verificação

::: checkliste
- Sei construir um botão e pô-lo na janela com add. → Construir um botão
- Sei porque é que o botão entra antes de setVisible(true). → O programa completo
- Sei usar o FlowLayout para o botão ter o tamanho normal. → O botão gigante
- Construí uma janela com um botão em que se pode carregar. → Tarefa: clica-me
:::

## Teste de conhecimentos

::: quiz
? O que faz janela.add(botao)?
- [ ] Constrói um botão novo.
- [x] Põe o botão na janela.
- [ ] Torna o botão clicável.
> O botão é construído com new JButton(…).

? Porque é que, sem FlowLayout, o botão enche a janela toda?
- [ ] Porque o texto é demasiado comprido
- [x] Porque sem layout próprio a janela torna tudo tão grande como ela
- [ ] Porque falta o setSize

? Que linha import precisas para o FlowLayout?
- [ ] import javax.swing.*;
- [x] import java.awt.*;
- [ ] import java.util.*;
> O FlowLayout vem do AWT, mais antigo.

? O que acontece nesta lição quando clicas no botão?
- [ ] O programa termina.
- [x] O botão fica mais escuro por um momento, e mais nada.
- [ ] No botão aparece “Fui clicado”.
> O que deve acontecer com um clique aprendes na próxima lição.
:::
