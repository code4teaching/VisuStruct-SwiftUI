---
titel: Dois separadores
bereich: Janelas com Swing
kurz: Construir uma janela com dois separadores, levar dados de um separador para o outro e guardar a lista num ficheiro de texto.
---

## O objetivo

A lista de compras do Ludwig da lição 23 ganha uma janela. Tem dois **separadores**, como os do browser:

- No separador **Entrada** escreves o que precisas e clicas em **Adicionar**.
- No separador **Lista** está tudo o que escreveste. Um botão **Guardar** escreve a lista num ficheiro de texto.

Novos são os separadores (`JTabbedPane`), uma área de texto com várias linhas (`JTextArea`) e guardar a partir de um ouvinte.

Marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen).

## Separadores com JTabbedPane

Cada separador mostra a sua própria área. As áreas são JPanels, como o teclado do cadeado na lição 37:

```java
JTabbedPane separadores = new JTabbedPane();
JPanel entrada = new JPanel(new GridLayout(0, 1));
JPanel lista = new JPanel(new BorderLayout());

separadores.addTab("Entrada", entrada);
separadores.addTab("Lista", lista);
janela.add(separadores);
```

| Chamada | Significado |
|---|---|
| `addTab("Entrada", entrada)` | um separador novo com a legenda "Entrada", mostra o JPanel `entrada` |
| `setSelectedIndex(1)` | muda para o segundo separador, conta-se a partir de 0 |
| `setTitleAt(1, "Lista (3)")` | muda a legenda do segundo separador |

No início está aberto o separador que foi adicionado primeiro.

## Uma área de texto com várias linhas

Um `JTextField` só tem uma linha. Para a lista precisas de uma `JTextArea`:

```java
JTextArea area = new JTextArea();
area.setEditable(false);
area.append("Feno\n");
```

- `append` acrescenta texto no fim. O `"\n"` começa depois uma nova linha, como ao dividir com `split("\n")` na lição 24.
- `setEditable(false)` impede que se escreva diretamente na lista.
- `getText()` devolve o texto inteiro com todas as linhas.

## De um separador para o outro

O botão **Adicionar** está no separador Entrada, a área de texto no separador Lista. Mesmo assim, o ouvinte pode usar os dois. Todas as peças são variáveis em `main`, e o lambda vê-as todas, seja qual for o separador em que aparecem depois:

```java
adicionar.addActionListener(e -> {
    area.append(campo.getText() + "\n");
    info.setText(campo.getText() + " está na lista.");
    campo.setText("");
});
```

::: ludwig
Uma peça só pode estar numa **única** área. Se juntares o mesmo botão primeiro a `entrada` e depois a `lista`, o Swing tira-o de `entrada`. Só aparece no separador Lista.
:::

## Guardar dentro do ouvinte

Para guardar usas o `PrintWriter` da lição 23. Dentro do ouvinte há um senão: a saída com `throws Exception` da lição 23 aqui não existe. O lambda é um método próprio, `actionPerformed`, e segundo o contrato não pode passar adiante uma `FileNotFoundException`. Por isso, guardar fica dentro de try e catch:

```java
guardar.addActionListener(e -> {
    try {
        PrintWriter saida = new PrintWriter("listacompras.txt");
        saida.print(area.getText());
        saida.close();
        info.setText("Guardado em listacompras.txt");
        separadores.setSelectedIndex(0);
    } catch (FileNotFoundException ex) {
        info.setText("Não foi possível guardar.");
    }
});
```

- A exceção chama-se aqui `ex`, porque o nome `e` já está ocupado pelo evento.
- Depois de guardar, a janela volta com `setSelectedIndex(0)` ao separador Entrada, onde está a mensagem.
- O VisuStruct mostra o ficheiro guardado por baixo da consola, assim que clicares em Guardar.

## O programa completo

```java
import javax.swing.*;
import java.awt.*;
import java.io.*;

public class ListaCompras {
    public static void main(String[] args) {
        JFrame janela = new JFrame("Lista de compras");
        janela.setSize(300, 250);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JTabbedPane separadores = new JTabbedPane();

        JPanel entrada = new JPanel(new GridLayout(0, 1));
        JTextField campo = new JTextField();
        JButton adicionar = new JButton("Adicionar");
        JLabel info = new JLabel("Ainda não há nada na lista.");
        entrada.add(new JLabel("Do que precisas?"));
        entrada.add(campo);
        entrada.add(adicionar);
        entrada.add(info);

        JPanel lista = new JPanel(new BorderLayout());
        JTextArea area = new JTextArea();
        area.setEditable(false);
        JButton guardar = new JButton("Guardar");
        lista.add(area, BorderLayout.CENTER);
        lista.add(guardar, BorderLayout.SOUTH);

        separadores.addTab("Entrada", entrada);
        separadores.addTab("Lista", lista);

        adicionar.addActionListener(e -> {
            area.append(campo.getText() + "\n");
            info.setText(campo.getText() + " está na lista.");
            campo.setText("");
        });

        guardar.addActionListener(e -> {
            try {
                PrintWriter saida = new PrintWriter("listacompras.txt");
                saida.print(area.getText());
                saida.close();
                info.setText("Guardado em listacompras.txt");
                separadores.setSelectedIndex(0);
            } catch (FileNotFoundException ex) {
                info.setText("Não foi possível guardar.");
            }
        });

        janela.add(separadores);
        janela.setVisible(true);
    }
}
```

Escreve Feno, clica em Adicionar, depois Maçãs e outra vez Adicionar. Muda para o separador Lista e clica em Guardar.

## Jogo: Onde vai parar?

::: spiel frage
titel: Jogo: Onde vai parar?
intro: O Ludwig constrói janelas com separadores. Lê o código e prevê o que vês. Seis rondas.

runde:
    separadores.addTab("Entrada", entrada);
    separadores.addTab("Lista", lista);
frage: Que separador está aberto no início?
- [x] Entrada
- Lista
- nenhum
> No início está aberto o separador que foi adicionado primeiro.

runde:
    separadores.addTab("Lista", lista);
    separadores.addTab("Entrada", entrada);
frage: Que separador está aberto no início?
- Entrada
- [x] Lista
- os dois
> Desta vez a Lista vem primeiro. A ordem dos `addTab` decide a ordem dos separadores.

runde:
    separadores.addTab("Entrada", entrada);
    separadores.addTab("Lista", lista);
    separadores.addTab("Ajuda", ajuda);
    separadores.setSelectedIndex(1);
frage: Que separador está aberto?
- Entrada
- [x] Lista
- Ajuda
> Conta-se a partir de 0: 0 é Entrada, 1 é Lista, 2 é Ajuda.

runde:
    adicionar.addActionListener(e -> {
        area.append(campo.getText() + "\n");
        campo.setText("");
    });
    // Escreves Feno, clicas em Adicionar, escreves Maçãs, clicas em Adicionar.
frage: O que está depois no separador Lista?
- Maçãs
- FenoMaçãs
- [x] Feno\nMaçãs
> `append` acrescenta no fim, e cada `"\n"` começa uma nova linha.

runde:
    JButton botao = new JButton("OK");
    entrada.add(botao);
    lista.add(botao);
frage: Onde aparece o botão OK?
- nos dois separadores
- só no separador Entrada
- [x] só no separador Lista
> Uma peça só pode estar numa área. No segundo `add`, o Swing tira-a de `entrada`.

runde:
    guardar.addActionListener(e -> {
        area.setText("");
        separadores.setTitleAt(1, "Lista (vazia)");
        separadores.setSelectedIndex(0);
    });
    // O botão guardar está no separador Lista.
frage: O que vês depois do clique?
- o separador Lista vazio
- [x] o separador Entrada, e o segundo separador chama-se "Lista (vazia)"
- o separador Entrada, e o segundo separador continua a chamar-se "Lista"
> O ouvinte esvazia a área, muda o nome do separador e muda para o separador 0. Tudo acontece com um clique.
:::

## Tarefa: Lista de compras com separadores

Constrói o programa e experimenta-o.

Depois melhora-o:

- Entradas vazias não vão para a lista. Verifica antes `campo.getText().isEmpty()` (lição 17).
- O separador Lista mostra no título quantas coisas estão na lista: "Lista (3)". Conta numa variável `static int` e usa `setTitleAt`.
- Extra: um terceiro separador **Ajuda** com um JLabel que explica como funciona o programa.

## Lista de verificação

::: checkliste
- Sei construir uma janela com dois separadores. → Separadores com JTabbedPane
- Sei acrescentar linhas a uma JTextArea com append. → Uma área de texto com várias linhas
- Sei porque é que um ouvinte pode usar peças dos dois separadores. → De um separador para o outro
- Sei guardar um ficheiro dentro de um ouvinte com try e catch. → Guardar dentro do ouvinte
- A minha lista de compras conta quantas coisas tem. → Tarefa: Lista de compras com separadores
:::

## Teste de conhecimentos

::: quiz
? Que separador está aberto depois de separadores.setSelectedIndex(0)?
- [x] o primeiro
- [ ] o segundo
- [ ] nenhum

? Porque é que guardar dentro do ouvinte fica em try e catch?
- [ ] Porque o PrintWriter só funciona dentro de try.
- [x] Porque actionPerformed não pode passar adiante uma FileNotFoundException.
- [ ] Porque o main não tem throws.

? Qual é a diferença entre JTextField e JTextArea?
- [ ] Não há nenhuma.
- [x] A JTextArea pode mostrar várias linhas.
- [ ] Num JTextField não se pode escrever.

? Liga.
= JTabbedPane -> uma área com separadores
= JPanel -> a área de um separador
= JTextArea -> uma área de texto com várias linhas
:::
