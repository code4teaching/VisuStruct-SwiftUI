---
titel: O editor
bereich: Primeiros passos
kurz: Inserir elementos, escrever texto, mover e eliminar.
---

## Competências que vou adquirir agora

::: kompetenzen
- inserir um elemento da área Elementos e substituir um marcador
- alterar o texto de um bloco e mudar entre Instrução, Entrada e Saída
- mover, copiar e eliminar blocos e anular passos
:::

## O ecrã

O VisuStruct tem dois editores: o [editor de estrutogramas](#zeige-editor), de que trata esta lição, e à direita a área [Código](#zeige-codelive) para código Java (a partir da lição 4). Se o editor de estrutogramas estiver recolhido, esta lição abre-o sozinha. As palavras azuis mostram-te as áreas, mesmo que estejam recolhidas: passa o rato por cima de uma, e a área abre-se ao lado da área de aprendizagem e acende-se. Se clicares nela (ou tocares nela), fica aberta.

O editor de estrutogramas tem várias áreas. Passa o rato por cima de uma palavra azul ou toca nela, e essa área acende-se no editor; as áreas recolhidas, como os Elementos, abrem-se.

- **Mesmo em cima, a [barra de ferramentas](#zeige-leiste):** Novo, Abrir e Guardar. À direita, a roda dentada das [Definições](#zeige-einstellungen): tamanho do texto e idioma.
- **Por baixo, as [ferramentas](#zeige-werkzeuge)** por cima dos elementos e do estrutograma: Anular, Cortar, Copiar, Colar, Eliminar, Exportar, Código e Simulação. Os botões só mostram ícones. Se puseres o rato por cima de um, aparece o nome.
- **À esquerda, os [Elementos](#zeige-elemente):** Aqui estão todos os blocos que podes arrastar para o estrutograma. Há quem chame a esta área a paleta.
- **Ao meio, o [estrutograma](#zeige-struktogramm):** Um diagrama novo contém apenas um marcador vazio, assinalado com **ø**.
- **Em baixo, o [Inspetor de objetos](#zeige-objektinspektor):** Aqui editas o texto do elemento selecionado.

> Podes recolher esta área de aprendizagem a qualquer momento com o [ícone da barra lateral](#zeige-lernen) no topo desta área. Fica só a barra estreita “🎓 Aprender” à esquerda; um clique abre-a de novo. Ela fica aberta ao lado do editor, para poderes experimentar logo o que lês. Da mesma forma, há à esquerda a coluna [📁 Ficheiros](#zeige-dateien) para os teus programas guardados (lição 3) e à direita a área [Código](#zeige-codelive) para Java (a partir da lição 4).

## Inserir um elemento

Arrasta um elemento da área **Elementos** para o estrutograma. Enquanto arrastas, uma linha azul mostra onde ele vai ficar:

- **Sobre o marcador ø:** O elemento substitui o marcador.
- **Sobre a metade de cima de um bloco:** O elemento fica antes dele.
- **Sobre a metade de baixo de um bloco:** O elemento fica depois dele.

::: grafik l02-einfuegen.svg
O sítio onde largas decide onde fica o novo elemento.
:::

Também funciona sem arrastar: **clica** num elemento da área Elementos (ou toca nele). Ele é então inserido depois do bloco selecionado. Se o marcador **ø** estiver selecionado, substitui-o.

Com o teclado, usa a tecla **Tab** para saltar para um elemento e prime **Enter**. O novo elemento também fica depois do bloco selecionado.

::: angeberwissen
Agarrar blocos e arrastá-los de um lado para o outro, tal como estás a fazer agora, tem um nome pomposo: **manipulação direta**. Foi Ben Shneiderman quem inventou o termo em 1982. Sim, o senhor dos estrutogramas. Aquele homem trabalhava mais do que eu quando estou a pastar.
:::

## Escrever texto

Clica num bloco. Ele fica com um contorno azul, e o seu texto aparece no Inspetor de objetos por baixo do diagrama. O que escreveres lá aparece logo no diagrama.

O bloco da área Elementos chama-se **Instrução**. Em cima, no Inspetor de objetos, escolhes de que tipo deve ser:

- **Instrução:** calcular ou definir alguma coisa, p. ex. `int numero = 5`. Vais aprender como na lição 4.
- **Entrada:** pedir um valor enquanto o estrutograma é executado. Isso vem na lição 6.
- **Saída:** mostrar alguma coisa. No diagrama fica com `output:` à frente, p. ex. `output: "Olá"`.

Para começar, só precisas de Saída. Os textos que devem aparecer exatamente como estão ficam entre **aspas**.

::: diagramm l2-ausgabe.visustruct
Duas saídas, uma a seguir à outra. Abre o diagrama no editor e inicia a simulação para veres a saída.
:::

## Mover, copiar, eliminar

- **Mover:** Arrasta um bloco existente com o rato para um novo sítio.
- **Copiar e colar:** Seleciona um bloco e prime Ctrl+C e Ctrl+V (no Mac ⌘C e ⌘V). A cópia fica depois do bloco selecionado.
- **Eliminar:** Seleciona um bloco e prime Del, ou clica no [caixote do lixo](#zeige-loeschen) „Eliminar seleção“ nas ferramentas.
- **Anular:** Ctrl+Z anula o último passo, Ctrl+Shift+Z refá-lo (no Mac ⌘Z e ⌘⇧Z).

## Exercício: Olá Mundo

::: übung l2-hallo
titel: Olá Mundo
auftrag: Constrói um estrutograma que mostre **Olá Mundo**.
Arrasta uma **Instrução** dos Elementos para o marcador **ø** e clica no bloco. No Inspetor de objetos, por baixo do estrutograma, há três botões em cima: Instrução, Entrada e Saída. Clica em **Saída**. Depois escreve `"Olá Mundo"` no campo de texto por baixo, com aspas.
test: - -> Olá Mundo
braucht: anweisung
tipp: Só precisas de um único bloco. O texto que deve aparecer vai para o campo de texto do Inspetor de objetos.
tipp: Atenção às aspas. Sem elas, o VisuStruct procura uma variável chamada Olá.
lösung: l2-hallo-loesung.visustruct
:::

Clica em **Verificar** quando terminares. O VisuStruct executa o teu estrutograma e compara a saída.

## Exercício: Duas linhas

::: übung l2-zwei-zeilen
titel: Duas linhas
auftrag: Mostra primeiro **Olá** e depois **Estou a aprender estrutogramas**, cada um na sua linha.
test: - -> Olá | Estou a aprender estrutogramas
tipp: Duas linhas significa duas saídas. Os blocos ficam uns por cima dos outros e são executados de cima para baixo.
tipp: Cada saída é um bloco próprio. Arrasta a segunda Instrução para a metade de baixo da primeira.
lösung: l2-zwei-zeilen-loesung.visustruct
:::

## Jogo: Profissional do editor

::: spiel frage
titel: Jogo: Profissional do editor
intro: O Ludwig testa se dominas o editor. Sete rondas.

runde:
frage: Arrastas uma instrução para o marcador **ø**. O que acontece?
- [x] A instrução substitui o marcador.
- A instrução fica depois do marcador.
- Nada, não se pode largar nada sobre ø.
> O marcador só guarda o lugar. O novo elemento ocupa-o.

runde:
frage: Arrastas um elemento para a metade **de cima** de um bloco. Onde fica?
- [x] antes dele
- depois dele
- Substitui o bloco.
> Metade de cima quer dizer antes, metade de baixo quer dizer depois. A linha azul mostra-te enquanto arrastas.

runde:
frage: Arrastas um elemento para a metade **de baixo** de um bloco. Onde fica?
- antes dele
- [x] depois dele
- no fim do estrutograma
> Metade de baixo quer dizer: logo a seguir a este bloco.

runde:
frage: Apagaste um bloco sem querer. O que o traz de volta?
- Ctrl+C / ⌘C
- [x] Ctrl+Z / ⌘Z
- Ctrl+V / ⌘V
> Ctrl+Z / ⌘Z anula o último passo. Ctrl+C / ⌘C copia, Ctrl+V / ⌘V cola.

runde:
frage: Ao executar deve aparecer exatamente **Olá**. O que está no bloco?
- [x] output: "Olá"
- output: Olá
- "Olá"
> Um texto que deve aparecer tal e qual fica entre aspas. O editor põe `output:` à frente quando escolhes o tipo Saída.

runde:
frage: Onde alteras o texto do bloco selecionado?
- na área Elementos
- [x] no Inspetor de objetos
- na barra de ferramentas lá em cima
> O Inspetor de objetos por baixo do diagrama mostra o texto do bloco selecionado.

runde:
frage: Clicas num elemento da área Elementos, sem arrastar. Onde fica?
- [x] depois do bloco selecionado
- no início
- no fim
> Sem arrastar (clique, ou Tab e Enter), o novo elemento fica depois do bloco que está selecionado nesse momento.
:::

## Lista de verificação

Avalia-te com honestidade em cada ponto: ☂️ ainda não, ⛅ em parte, ☀️ consigo com segurança. Com ⛅ e ☂️, **Rever** ajuda-te. Depois vem o teste de conhecimentos. Mostra-te se a tua autoavaliação está certa.

::: checkliste
- Consigo inserir um elemento da área Elementos e substituir um marcador. → Inserir um elemento
- Consigo alterar o texto de um bloco e mudar entre Instrução, Entrada e Saída. → Escrever texto
- Consigo mover, copiar e eliminar blocos e anular passos. → Mover, copiar, eliminar
:::

## Teste de conhecimentos

::: quiz
? O que significa o sinal ø num bloco?
→ Inserir um elemento
- [ ] O bloco contém um erro.
- [x] Aqui ainda há um marcador vazio.
- [ ] O programa termina aqui.
> Um marcador é substituído quando arrastas um elemento para cima dele.

? Arrastas uma Instrução para a metade de baixo de um bloco. Onde é que ela fica?
→ Inserir um elemento
- [ ] Antes dele
- [x] Depois dele
- [ ] O bloco é substituído.

? Como mostras o texto Bom dia exatamente como está?
→ Escrever texto
- [ ] output: Bom dia
- [x] output: "Bom dia"
- [ ] input: "Bom dia"
> Sem aspas, Bom dia é entendido como o nome de uma variável.
:::
