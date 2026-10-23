---
titel: Calculadora de notas na janela
bereich: Janelas com Swing
kurz: Escrever a percentagem, determinar o nível com else if e apanhar entradas erradas.
---

## O objetivo

Uma janela transforma a percentagem de um teste num nível: escreves a percentagem (0 a 100), clicas em **Calcular nível** e em baixo aparece o nível.

Desta vez não há nenhuma peça nova do Swing. A novidade é que combinas tudo o que já sabes: campo de texto, botão, `else if` da lição 20 e try/catch da lição 22.

Marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen).

## A escala de níveis

Usamos a escala de níveis do ensino básico:

| Percentagem | Nível |
|---|---|
| 90 a 100 | 5 |
| 70 a 89 | 4 |
| 50 a 69 | 3 |
| 20 a 49 | 2 |
| 0 a 19 | 1 |

Com `else if` verificas de cima para baixo. Ganha a primeira condição verdadeira:

```
int nivel;
if (percentagem >= 90) {
    nivel = 5;
} else if (percentagem >= 70) {
    nivel = 4;
} else if (percentagem >= 50) {
    nivel = 3;
} else if (percentagem >= 20) {
    nivel = 2;
} else {
    nivel = 1;
}
```

::: ludwig
Com 75 %, `percentagem >= 90` é falso, mas `percentagem >= 70` é verdadeiro. Portanto nível 4, e as restantes condições já nem são verificadas. É por isso que basta sempre o limite de baixo.
:::

Podes experimentar esta parte sem janela na área [Programação](#zeige-codelive). Escreve `int percentagem = 75;` antes e `System.out.println("Nível: " + nivel);` depois. O estrutograma mostra-te as decisões encaixadas.

## A janela

```
import javax.swing.*;
import java.awt.*;

public class CalculadoraNiveis {
    public static void main(String[] args) {
        JFrame janela = new JFrame("Calculadora de níveis");
        janela.setSize(260, 180);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setLayout(new GridLayout(0, 1));

        JLabel pergunta = new JLabel("Percentagem (0 a 100):");
        JTextField campo = new JTextField();
        JButton botao = new JButton("Calcular nível");
        JLabel resultado = new JLabel("Nível: ?");

        botao.addActionListener(e -> {
            int percentagem = Integer.parseInt(campo.getText());
            int nivel;
            if (percentagem >= 90) {
                nivel = 5;
            } else if (percentagem >= 70) {
                nivel = 4;
            } else if (percentagem >= 50) {
                nivel = 3;
            } else if (percentagem >= 20) {
                nivel = 2;
            } else {
                nivel = 1;
            }
            resultado.setText("Nível: " + nivel);
        });

        janela.add(pergunta);
        janela.add(campo);
        janela.add(botao);
        janela.add(resultado);
        janela.setVisible(true);
    }
}
```

Experimenta 100, 75, 50 e 12.

## Apanhar entradas erradas

Ainda há duas coisas que podem correr mal:

1. Alguém escreve “abc”. Então `Integer.parseInt` lança uma `NumberFormatException`.
2. Alguém escreve 150 ou −5. É um número, mas não é uma percentagem válida.

O primeiro caso apanhas com try/catch, o segundo com um `if` antes de calcular o nível:

```
botao.addActionListener(e -> {
    try {
        int percentagem = Integer.parseInt(campo.getText());
        if (percentagem < 0 || percentagem > 100) {
            resultado.setText("Escreve um valor de 0 a 100.");
        } else {
            // aqui o cálculo do nível de cima
        }
    } catch (NumberFormatException erro) {
        resultado.setText("Isso não é um número.");
    }
});
```

::: ludwig
`||` quer dizer “ou” (lição 9). A condição é verdadeira se a percentagem for demasiado pequena **ou** demasiado grande.
:::

## Tarefa: calculadora de níveis

Junta a calculadora de níveis, com as duas verificações do último passo. Testa com 90, 89, 0, 100, 101 e “dez”.

Extra: escreve também a menção do nível, por exemplo “Nível: 4 (Bom)”. As menções são Muito bom, Bom, Suficiente, Insuficiente e Fraco.

::: ludwig
Testa sempre os limites: 90 tem de dar 5, 89 tem de dar 4. É nos limites que se escondem a maioria dos erros, por exemplo `>` em vez de `>=`.
:::

## Lista de verificação

::: checkliste
- Consigo transformar uma percentagem num nível com else if. → A escala de níveis
- Consigo mostrar o nível na janela. → A janela
- O meu programa avisa com “abc” e com valores fora de 0 a 100. → Apanhar entradas erradas
- Testei os limites 90 e 89. → Tarefa: calculadora de níveis
:::

## Teste de conhecimentos

::: quiz
? Que nível dá a escala com 70 %?
- [ ] 3
- [x] 4
- [ ] 5
> 70 é o limite de baixo do nível 4.

? Porque é que em cada condição basta o limite de baixo?
- [x] Porque o else if já separou antes os casos mais altos
- [ ] Porque o Java não conhece limites de cima
- [ ] Porque a percentagem é sempre 100

? Que condição deteta percentagens inválidas?
- [ ] percentagem < 0 && percentagem > 100
- [x] percentagem < 0 || percentagem > 100
- [ ] percentagem >= 0 || percentagem <= 100
> Um número não pode ser ao mesmo tempo menor do que 0 e maior do que 100, por isso é preciso o ou.
:::
