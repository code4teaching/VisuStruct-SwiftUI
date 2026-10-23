---
titel: O botão reage
bereich: Janelas com Swing
kurz: Com um ActionListener decides o que acontece com um clique.
---

## Um clique é um evento

Na lição anterior podias carregar no botão, mas nada acontecia. Num programa com janelas é a pessoa que decide quando acontece alguma coisa: clica, escreve ou fecha uma janela. Cada ação destas chama-se **evento**.

Por isso o teu programa tem de esperar pelo clique e dar por ele. Para isso registas no botão um ouvinte, um **ActionListener** (inglês para “ouvinte de ações”). A cada clique o botão chama o seu ouvinte, e o ouvinte executa o teu código.

::: ludwig
Até agora o teu programa corria de cima para baixo, como no estrutograma. O código do ouvinte, pelo contrário, só corre mais tarde, sempre que alguém clica. Quantas vezes isso acontece, ninguém sabe de antemão.
:::

## A linha com a seta

É assim que registas o ouvinte:

```
botao.addActionListener(e -> botao.setText("Fui clicado"));
```

Lido de fora para dentro:

- `botao.addActionListener( … )` regista um ouvinte no botão.
- `e` é o evento. Contém, por exemplo, quando foi o clique. Aqui não precisas dele, mas o nome tem de estar lá.
- `->` lê-se “então faz”.
- `botao.setText("Fui clicado")` é o que acontece com o clique: o botão recebe um texto novo.

A linha vem depois de `new JButton(…)`, porque o botão já tem de existir. E, como tudo o resto, vem antes de `setVisible(true)`.

## O programa completo

```
import javax.swing.*;
import java.awt.*;

public class ClicaMe {
    public static void main(String[] args) {
        JFrame janela = new JFrame("Clica-me");
        janela.setSize(300, 200);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setLayout(new FlowLayout());

        JButton botao = new JButton("Clica-me");
        botao.addActionListener(e -> botao.setText("Fui clicado"));
        janela.add(botao);

        janela.setVisible(true);
    }
}
```

Executa-o e clica no botão. Agora diz “Fui clicado”.

> Se o texto novo for mais comprido do que o antigo, o FlowLayout alarga o botão sozinho.

## Várias instruções com um clique

Se com um clique deve acontecer mais do que uma coisa, pões chavetas depois da seta. Lá dentro, cada instrução tem o seu ponto e vírgula, como no corpo de um ciclo:

```
botao.addActionListener(e -> {
    botao.setText("Fui clicado");
    janela.setTitle("Obrigado!");
    System.out.println("Clique!");
});
```

`System.out.println` escreve na [consola](#zeige-konsole), como de costume. Clica várias vezes: a cada clique aparece uma nova linha “Clique!”. Assim vês que o código do ouvinte corre mesmo a cada clique.

::: ludwig
Atenção ao fim: primeiro `}` fecha o bloco, depois `)` fecha o parêntese de `addActionListener`, e só então vem o ponto e vírgula. Ou seja, `});`. Se faltar alguma coisa, aparece uma indicação por baixo do código.
:::

## Saber de profissional: ActionListener é uma interface

Isto não está no programa da disciplina. Se quiseres saber o que está por trás da seta, continua a ler.

::: angeberwissen
`ActionListener` é uma **interface**, uma espécie de contrato. Diz: quem quiser ser um ActionListener tem de ter um método `actionPerformed(ActionEvent e)`. A cada clique o botão chama exatamente esse método.
:::

A linha com a seta já conheces do passo 2:

```
botao.addActionListener(e -> botao.setText("Fui clicado"));
```

Sem a seta escreve-se o ouvinte como uma classe sem nome que cumpre o contrato (uma classe anónima):

```
botao.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent e) {
        botao.setText("Fui clicado");
    }
});
```

Para isso precisas ainda de `import java.awt.event.*;` em cima. As duas formas fazem exatamente o mesmo. A seta `e -> …` é a forma curta (uma expressão lambda, desde o Java 8): `e` é o parâmetro de `actionPerformed`, e depois da seta vem o seu corpo. A forma curta funciona porque a interface tem um único método. Assim o Java sabe de que método se trata.

## Tarefa: fui clicado

Agora terminas a tarefa: constrói uma janela com um botão “Clica-me” de tamanho normal. Depois do clique, o botão diz “Fui clicado”.

Extra: constrói dois botões “Vermelho” e “Azul”. Um clique num botão escreve o seu nome no título da janela, por exemplo “Escolheste Vermelho”.

::: ludwig
Cada botão recebe o seu próprio ouvinte, com o seu próprio `addActionListener`. O título mudas com `janela.setTitle(…)`.
:::

## Lista de verificação

::: checkliste
- Sei o que é um evento. → Um clique é um evento
- Sei usar addActionListener para decidir o que acontece com um clique. → A linha com a seta
- Sei executar várias instruções com um clique. → Várias instruções com um clique
- Depois do clique, o meu botão diz “Fui clicado”. → Tarefa: fui clicado
:::

## Teste de conhecimentos

::: quiz
? O que é um ActionListener?
- [ ] Um botão com texto
- [x] Um ouvinte que executa o teu código a cada clique
- [ ] Um layout para janelas
> Registas o ouvinte no botão com addActionListener.

? Quando corre botao.setText("Fui clicado") dentro do ouvinte?
- [ ] Logo no início do programa
- [x] Sempre que alguém clica no botão
- [ ] Só no primeiro clique
> O código do ouvinte só corre quando o evento acontece.

? Como termina um ouvinte com chavetas?
- [ ] };)
- [x] });
- [ ] );}
> Primeiro fecha o bloco, depois o parêntese de addActionListener, depois o ponto e vírgula.

? Associa cada parte à sua função.
= JButton -> um botão
= addActionListener -> registar um ouvinte
= setText -> mudar o texto
= setVisible(true) -> mostrar a janela
:::
