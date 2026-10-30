---
titel: Uma calculadora
bereich: Janelas com Swing
kurz: Duas colunas com GridLayout, quatro botões de cálculo e apanhar a divisão por 0.
---

## Competências que vou adquirir agora

::: kompetenzen
- construir duas colunas com GridLayout
- explicar porque é que "" + (a + b) precisa de parênteses
- programar os quatro botões de cálculo
- construir uma calculadora que não falha com 0 nem com “abc”
:::

## O objetivo

Vamos construir uma pequena calculadora: dois campos de texto para os números, quatro botões **+**, **-**, **\*** e **/** e uma linha para o resultado.

As novidades desta vez são **duas colunas** no GridLayout e **vários botões** que calculam todos com os mesmos campos de texto.

Marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen).

## Duas colunas

Até agora, com `GridLayout(0, 1)`, ficava tudo umas por baixo das outras. Com `GridLayout(0, 2)` há duas colunas. As peças preenchem as células pela ordem das linhas `add`, sempre primeiro à esquerda e depois à direita:

| esquerda | direita |
|---|---|
| Primeiro número: | campo de texto |
| Segundo número: | campo de texto |
| + | - |
| \* | / |
| Resultado: | ? |

As etiquetas da esquerda não vais precisar delas mais tarde. Por isso podes construí-las logo dentro do `add`, sem variável:

```java
janela.add(new JLabel("Primeiro número:"));
janela.add(campo1);
```

## A janela com o primeiro botão

```java
import javax.swing.*;
import java.awt.*;

public class Calculadora {
    public static void main(String[] args) {
        JFrame janela = new JFrame("Calculadora");
        janela.setSize(280, 220);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setLayout(new GridLayout(0, 2));

        JTextField campo1 = new JTextField();
        JTextField campo2 = new JTextField();
        JButton mais = new JButton("+");
        JButton menos = new JButton("-");
        JButton vezes = new JButton("*");
        JButton dividir = new JButton("/");
        JLabel resultado = new JLabel("?");

        mais.addActionListener(e -> {
            int a = Integer.parseInt(campo1.getText());
            int b = Integer.parseInt(campo2.getText());
            resultado.setText("" + (a + b));
        });

        janela.add(new JLabel("Primeiro número:"));
        janela.add(campo1);
        janela.add(new JLabel("Segundo número:"));
        janela.add(campo2);
        janela.add(mais);
        janela.add(menos);
        janela.add(vezes);
        janela.add(dividir);
        janela.add(new JLabel("Resultado:"));
        janela.add(resultado);
        janela.setVisible(true);
    }
}
```

Escreve 3 e 4 e clica em +. Em baixo aparece 7.

::: ludwig
Atenção aos parênteses em `"" + (a + b)`. Sem eles, o Java calcula da esquerda para a direita: `"" + a` dá o texto “3”, e `"3" + b` junta o 4 no fim. Sai “34” em vez de 7. O parêntese garante que primeiro se faz a conta.
:::

## Os outros três botões

Os botões -, \* e / funcionam da mesma maneira. Só muda o sinal na última linha:

```java
menos.addActionListener(e -> {
    int a = Integer.parseInt(campo1.getText());
    int b = Integer.parseInt(campo2.getText());
    resultado.setText("" + (a - b));
});
```

O / tem duas particularidades:

- Com `int`, o Java corta as casas decimais ao dividir. 7 / 2 dá 3.
- Se o segundo número for 0, o Java lança uma `ArithmeticException`, como na tarefa “Dividir em segurança” da lição 22.

## Apanhar a divisão por 0

```java
dividir.addActionListener(e -> {
    int a = Integer.parseInt(campo1.getText());
    int b = Integer.parseInt(campo2.getText());
    try {
        resultado.setText("" + (a / b));
    } catch (ArithmeticException erro) {
        resultado.setText("Não se divide por 0!");
    }
});
```

::: angeberwissen
Com `double` e `Double.parseDouble(…)` há casas decimais: 7 / 2 dá 3.5. Em contrapartida, com números decimais o Java não lança nenhuma exceção ao dividir por 0. O resultado é então `Infinity`, ou seja, “infinito”.
:::

## Saber de profissional: um método próprio

Isto não está no programa da disciplina, mas torna o código mais curto.

::: angeberwissen
Cada ouvinte lê os mesmos dois campos. Podes passar esta repetição para um método próprio, um subprograma como na lição 18. Fica na classe, ao lado do `main`:

`static int numero(JTextField campo) { return Integer.parseInt(campo.getText()); }`

No ouvinte basta então escrever `resultado.setText("" + (numero(campo1) + numero(campo2)));`.
:::

## Jogo: O que mostra a calculadora?

::: spiel frage
titel: Jogo: O que mostra a calculadora?
intro: O Ludwig andou a mexer na calculadora. Lê o ouvinte e prevê o que aparece no resultado. Seis rondas.

runde:
    mais.addActionListener(e -> {
        int a = Integer.parseInt(campo1.getText());
        int b = Integer.parseInt(campo2.getText());
        resultado.setText("" + a + b);
    });
frage: Escreves 3 e 4 e clicas em +. O que aparece no resultado?
- 7
- [x] 34
- 12
> Sem parênteses, o Java trabalha da esquerda para a direita: `"" + 3` é o texto "3", e `+ 4` junta o 4 no fim.

runde:
    vezes.addActionListener(e -> {
        int a = Integer.parseInt(campo1.getText());
        int b = Integer.parseInt(campo2.getText());
        resultado.setText("" + a * b);
    });
frage: Escreves 3 e 4 e clicas em *. O que aparece no resultado?
- 34
- [x] 12
- 7
> A multiplicação vem antes da soma também aqui: o Java calcula primeiro 3 * 4 e depois junta o 12 ao texto. O mais não tem esta prioridade, por isso precisa dos parênteses.

runde:
    dividir.addActionListener(e -> {
        int a = Integer.parseInt(campo1.getText());
        int b = Integer.parseInt(campo2.getText());
        resultado.setText("" + (a / b));
    });
frage: Escreves 7 e 2 e clicas em /. O que aparece no resultado?
- 3.5
- [x] 3
- 4
> Com `int`, o Java corta as casas decimais. Não arredonda.

runde:
    dividir.addActionListener(e -> {
        int a = Integer.parseInt(campo1.getText());
        int b = Integer.parseInt(campo2.getText());
        try {
            resultado.setText("" + (a / b));
        } catch (ArithmeticException erro) {
            resultado.setText("Não se divide por 0!");
        }
    });
frage: Escreves 8 e 0 e clicas em /. O que aparece no resultado?
- 0
- [x] Não se divide por 0!
- Infinity
> Com `int`, dividir por 0 lança uma ArithmeticException, e o `catch` escreve o aviso.

runde:
    dividir.addActionListener(e -> {
        double a = Double.parseDouble(campo1.getText());
        double b = Double.parseDouble(campo2.getText());
        resultado.setText("" + (a / b));
    });
frage: Escreves 7 e 2 e clicas em /. O que aparece no resultado?
- 3
- [x] 3.5
- 3.0
> Com `double`, as casas decimais ficam.

runde:
    dividir.addActionListener(e -> {
        double a = Double.parseDouble(campo1.getText());
        double b = Double.parseDouble(campo2.getText());
        try {
            resultado.setText("" + (a / b));
        } catch (ArithmeticException erro) {
            resultado.setText("Não se divide por 0!");
        }
    });
frage: Escreves 8 e 0 e clicas em /. O que aparece no resultado?
- Não se divide por 0!
- [x] Infinity
- 0.0
> Com `double` não há exceção. O resultado é `Infinity`, ou seja "infinito", e o `catch` nunca chega a entrar.
:::

## Tarefa: calculadora

Acaba a calculadora:

- os quatro botões calculam,
- o / avisa “Não se divide por 0!” em vez de falhar,
- se um campo tiver “abc” ou estiver vazio, aparece “Escreve dois números”.

Extra: um quinto botão **C** esvazia os dois campos e volta a pôr o resultado em “?”.

::: ludwig
Para o “abc” cada ouvinte precisa de um try/catch com `NumberFormatException`. Depois de um `try` também podem vir dois `catch`, um para `NumberFormatException` e outro para `ArithmeticException`. Já agora: um campo vazio dá o texto `""`, e isso também não é um número.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo construir duas colunas com GridLayout(0, 2). → Duas colunas
- Consigo explicar porque é que "" + (a + b) precisa de parênteses. → A janela com o primeiro botão
- Consigo programar os quatro botões de cálculo. → Os outros três botões
- Consigo construir uma calculadora que não falha com 0 nem com “abc”. → Tarefa: calculadora
:::

## Teste de conhecimentos

::: quiz
? a é 3 e b é 4. Quanto dá "" + a + b?
→ A janela com o primeiro botão
- [ ] 7
- [x] 34
- [ ] Um erro
> O Java calcula da esquerda para a direita: primeiro surge o texto "3", depois junta-se o 4.

? Quanto dá 7 / 2 com int?
→ Os outros três botões
- [ ] 3.5
- [x] 3
- [ ] 4

? Por que ordem preenche o GridLayout(0, 2) as células?
→ Duas colunas
- [x] Linha a linha, primeiro à esquerda e depois à direita
- [ ] Coluna a coluna, começando de cima para baixo na coluna da esquerda
- [ ] Ao acaso
:::
