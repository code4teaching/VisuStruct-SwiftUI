---
titel: Lançar o dado com MVC
nach: 40
stufe: 3
---

Constrói um jogo de dados com Model View Controller. Um botão **Lançar** lança o dado, e duas views mostram o resultado.

O model já está pronto. Lança o dado e conta quantas vezes foi lançado e quantos seis saíram:

```
class Dado {
    int pontos = 1;
    int lancamentos = 0;
    int seis = 0;

    void lancar() {
        pontos = (int) (Math.random() * 6) + 1;
        lancamentos++;
        if (pontos == 6) {
            seis++;
        }
    }
}
```

A tua tarefa:

1. Testa primeiro o model sem janela: lança dez vezes no `main` e depois mostra `lancamentos` e `seis`.
2. Escreve a view `VistaPontos`. Mostra o número que saiu num JLabel grande, por exemplo "4".
3. Escreve a view `VistaEstatistica`. Mostra por exemplo "Seis: 2 em 10 lançamentos".
4. O controller é o ouvinte do botão: manda o model lançar e passa os valores novos às duas views.

Extra: um botão **Novo jogo** põe tudo no início. O método para isso pertence ao model.

::: ludwig
Lembra-te da regra da lição 40: no model não há um único `JLabel`. Se mudares o tamanho da letra ao lançar, isso pertence à view.
:::
