---
titel: Conversor de unidades
nach: 35
stufe: 2
---

Constrói uma janela que converte comprimentos. Em cima escreves um comprimento em metros, por baixo há três botões:

- **em cm** mostra o comprimento em centímetros, 1.5 passa a "150.0 cm",
- **em mm** mostra-o em milímetros, 1.5 passa a "1500.0 mm",
- **em km** mostra-o em quilómetros, 1500 passa a "1.5 km".

O resultado aparece num JLabel por baixo dos botões. Se no campo não estiver um número, aparece "Escreve um número", e o programa não vai abaixo.

Podes começar assim:

```java
import javax.swing.*;
import java.awt.*;

public class Unidades {
    public static void main(String[] args) {
        JFrame janela = new JFrame("Conversor de unidades");
        janela.setSize(300, 200);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setLayout(new GridLayout(0, 1));

        JTextField metros = new JTextField();
        JButton emCm = new JButton("em cm");
        JLabel resultado = new JLabel("?", SwingConstants.CENTER);

        emCm.addActionListener(e -> {
            double m = Double.parseDouble(metros.getText());
            resultado.setText((m * 100) + " cm");
        });

        janela.add(metros);
        janela.add(emCm);
        janela.add(resultado);
        janela.setVisible(true);
    }
}
```

Extra: um quarto botão **em pés** converte para a unidade inglesa. Um pé são 0.3048 m.

::: ludwig
Marca **Java verdadeiro (com Swing)** na [roda dentada](#zeige-einstellungen). Para "abc" no campo, cada ouvinte precisa de um try/catch com `NumberFormatException`, tal como na calculadora.
:::
