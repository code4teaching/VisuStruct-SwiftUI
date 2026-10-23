---
titel: Avaliar o lançamento da bola
nach: 25
stufe: 2
---

No dia do desporto, todos escreveram numa tabela a distância a que lançaram a bola:

::: datei lancamento.csv
Nome;Distancia
Ludwig;28
Zora;42
Raposa;35
Lebre;21
:::

::: übung aufgabe-ballwurf
titel: Avaliar o lançamento da bola
code: java
auftrag: Lê o ficheiro e salta a linha de cabeçalho. Mostra quantos participaram (**Participantes: 4**) e a que distância lançaram em média (**Média: 31.5 m**).
  Guarda o lançamento mais longo no ficheiro **vencedor.txt**, por exemplo **Vencedor: Zora (42 m)**.
start: aufgabe-ballwurf-start.visustruct
test: - -> Participantes: 4 | Média: 31.5 m
datei: vencedor.txt -> Vencedor: Zora (42 m)
braucht: whileSchleife, verzweigung
tipp: Precisas de quatro variáveis antes do ciclo: a contagem, a soma como `double`, a melhor distância e o melhor nome.
tipp: No ciclo: `String[] partes = linha.split(";");` e `int distancia = Integer.parseInt(partes[1]);`. Se `distancia > melhorDistancia`, guarda a distância e o nome. Para guardar: `PrintWriter saida = new PrintWriter("vencedor.txt");`, `saida.println(…)` e `saida.close();`.
lösung: aufgabe-ballwurf-loesung.visustruct
:::
