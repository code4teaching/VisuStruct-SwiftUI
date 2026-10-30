---
titel: A tua primeira janela
bereich: Janelas com Swing
kurz: Abrir uma janela tua com Java e Swing, explicado linha a linha.
---

## Competências que vou adquirir agora

::: kompetenzen
- ligar o “Java verdadeiro” na área Programação
- abrir uma janela com título e tamanho
- explicar o que faz cada linha do programa com janela
- explicar porque é que setVisible(true) fica no fim
:::

## Programas com janelas

Até agora os teus programas escreviam texto na consola. Mas a maioria dos programas que conheces tem **janelas** com botões e campos de texto. A isto chama-se uma interface gráfica.

O Java traz uma caixa de ferramentas para isso: o **Swing**. No VisuStruct ligas o Swing assim:

1. Abre à direita a área [Programação](#zeige-codelive).
2. Clica na [roda dentada](#zeige-einstellungen) em cima à direita e escolhe Java como **Linguagem de programação**.
3. Por baixo, na secção Java, marca **Java verdadeiro (com Swing)**.

Na primeira vez que clicas em [▶︎ Executar](#zeige-ausfuehren), o VisuStruct descarrega uma única vez cerca de 40 MB, o que demora um pouco. Depois disso o teu código corre como Java verdadeiro, e as tuas janelas aparecem na área Programação na área **Janelas Java**, por cima da consola.

> Com o “Java verdadeiro”, as entradas pela consola (`Scanner`) ainda não funcionam. Para programas com entradas, desliga outra vez a opção.

::: angeberwissen
O Swing existe desde 1998. Antes disso, o Java só tinha o AWT, mais antigo, com uma classe `Frame`. Para ninguém confundir os blocos novos, quase todos os nomes no Swing começam por **J**: `JFrame`, `JButton`, `JLabel`. Pelo J reconheces logo o Swing.
:::

## O programa completo

Este é o programa mais pequeno que abre uma janela. Escreve-o na área Programação e clica em [▶︎ Executar](#zeige-ausfuehren):

```java
import javax.swing.*;

public class MinhaJanela {
    public static void main(String[] args) {
        JFrame janela = new JFrame("A minha primeira janela");
        janela.setSize(300, 200);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setVisible(true);
    }
}
```

Aparece uma janela cinzenta vazia com o título “A minha primeira janela”. Mais nada, mas é a tua própria janela!

A moldura com `public class` e `main` já conheces da lição Java. Novas são a primeira linha e as quatro linhas dentro de `main`. Vamos vê-las uma a uma.

::: ludwig
Olha para o estrutograma ao lado do código: cada linha em `main` é um bloco, todos uns por baixo dos outros. No início, um programa com janelas é então só uma sequência.
:::

## Linha a linha

| Linha | O que faz |
|---|---|
| `import javax.swing.*;` | Traz a caixa de ferramentas Swing para o programa. Sem esta linha o Java não conhece `JFrame`. |
| `JFrame janela = new JFrame("A minha primeira janela");` | Constrói uma janela nova. O texto entre parênteses é o título em cima, na moldura da janela. Depois falas com ela através da variável `janela`. |
| `janela.setSize(300, 200);` | A janela fica com 300 píxeis de largura e 200 píxeis de altura. |
| `janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);` | Quando alguém fecha a janela, o programa também termina. |
| `janela.setVisible(true);` | Só agora a janela fica visível. |

O ponto em `janela.setSize(…)` quer dizer: “Janela, faz isto!” Antes do ponto está quem deve fazer alguma coisa, depois do ponto o que deve fazer.

> Sem `setDefaultCloseOperation`, o Java só esconde a janela quando ela é fechada. O programa continua a correr sem se ver.

## Porque é que setVisible fica no fim

`setVisible(true)` mostra a janela tal como ela está nesse momento. Por isso preparas tudo primeiro: título, tamanho e, mais tarde, também botões. Só mesmo no fim tornas a janela visível.

O que só pões na janela depois de `setVisible(true)` muitas vezes não aparece. É que o Java não volta a desenhar a janela sozinho. Às vezes só aparece quando se muda o tamanho da janela. Erros destes são difíceis de encontrar.

::: ludwig
Primeiro preparar, depois mostrar. Como no teatro: a cortina só sobe quando o palco está pronto.
:::

Experimenta: apaga a linha com `setVisible(true)` e executa o programa outra vez. O programa corre, mas não vês nenhuma janela.

## Saber de profissional: classes e objetos

Isto não está no programa da disciplina, mas ajuda-te a perceber o Swing.

::: angeberwissen
O Java é, na verdade, uma linguagem **orientada a objetos**. `JFrame` é uma classe, ou seja, uma planta para janelas. Com `new JFrame(…)` o Java constrói, segundo essa planta, uma janela a sério: um **objeto**. Com dois `new` podias construir duas janelas, ambas com a mesma planta.

`setSize` e `setVisible` são métodos que qualquer objeto janela sabe fazer. Por isso escreves `janela.setSize(…)`: o objeto `janela` executa o seu método. O teu próprio programa também é uma classe, neste caso `MinhaJanela`.
:::

## Jogo: O que acontece?

::: spiel frage
titel: Jogo: O que acontece?
intro: O Ludwig andou a mexer no programa da janela. Lê as linhas e prevê o que acontece. Seis rondas.

runde:
    JFrame janela = new JFrame("Olá");
    janela.setSize(300, 200);
    janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
frage: O que vês depois de executar?
- uma janela com o título "Olá"
- [x] nenhuma janela
- uma mensagem de erro
> Falta `setVisible(true)`. A janela está construída, mas fica invisível.

runde:
    JFrame janela = new JFrame("Olá");
    janela.setSize(200, 300);
    janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    janela.setVisible(true);
frage: Como é a janela?
- mais larga do que alta
- [x] mais alta do que larga
- quadrada
> O primeiro número é a largura, o segundo a altura: 200 de largura, 300 de altura.

runde:
    JFrame janela = new JFrame("Olá");
    janela.setSize(300, 200);
    janela.setVisible(true);
frage: Fechas a janela. O que acontece ao programa?
- Termina.
- [x] Continua a correr, invisível.
- A janela volta logo a abrir.
> Sem `setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE)`, o Java só esconde a janela.

runde:
    JFrame janela = new JFrame();
    janela.setSize(300, 200);
    janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    janela.setVisible(true);
frage: O que aparece no topo da moldura da janela?
- janela
- JFrame
- [x] nada, o título está vazio
> Sem texto entre os parênteses, a janela não tem título. O nome da variável `janela` nunca aparece na janela.

runde:
    public class Teste {
        public static void main(String[] args) {
            JFrame janela = new JFrame("Teste");
            janela.setVisible(true);
        }
    }
frage: O que diz o javac?
- [x] cannot find symbol: class JFrame
- nada, a janela aparece
- missing return statement
> Falta a linha `import javax.swing.*;`. Sem ela, o Java não conhece `JFrame`.

runde:
    JFrame a = new JFrame("Uma");
    JFrame b = new JFrame("Duas");
    a.setSize(300, 200);
    b.setSize(300, 200);
    a.setVisible(true);
frage: O que vês?
- [x] uma janela com o título "Uma"
- duas janelas
- uma janela com o título "Duas"
> Duas janelas feitas com a mesma planta, mas só a `a` fica visível.
:::

## Tarefa: a tua própria janela

Altera o programa de forma que

- o título diga “Olá” e o teu nome,
- a janela tenha 400 píxeis de largura e 300 píxeis de altura,
- o programa termine quando fechas a janela.

Executa-o e verifica os três pontos.

::: ludwig
Não te apetece escrever tanto? Com o “Java verdadeiro” podes escrever na área Programação só as quatro linhas de `main`. O VisuStruct põe-nas sozinho dentro de uma classe e acrescenta as linhas `import`. Num ambiente de desenvolvimento Java a sério precisas, no entanto, do programa completo.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo ligar o “Java verdadeiro” na área Programação. → Programas com janelas
- Consigo abrir uma janela com título e tamanho. → O programa completo
- Consigo explicar o que faz cada linha do programa com janela. → Linha a linha
- Consigo explicar porque é que setVisible(true) fica no fim. → Porque é que setVisible fica no fim
:::

## Teste de conhecimentos

::: quiz
? Que linha torna a janela visível?
→ Porque é que setVisible fica no fim
- [ ] janela.setSize(300, 200);
- [x] janela.setVisible(true);
- [ ] new JFrame("Olá");
> Sem setVisible(true) a janela fica invisível.

? Onde fica melhor janela.setVisible(true)?
→ Porque é que setVisible fica no fim
- [ ] Mesmo no início de main
- [x] No fim, quando a janela já está preparada
- [ ] Tanto faz.
> O que vem depois de setVisible(true) muitas vezes não aparece.

? O que faz setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE)?
→ Linha a linha
- [ ] A janela fecha-se logo.
- [x] Quando se fecha a janela, o programa termina.
- [ ] A janela já não se pode fechar.

? Como reconheces os blocos do Swing?
→ Linha a linha
- [x] O nome começa por J, p. ex. JFrame.
- [ ] Estão entre chavetas.
- [ ] Terminam em Window.
:::
