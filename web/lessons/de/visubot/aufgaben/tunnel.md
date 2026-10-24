---
titel: Der Tunnelsucher
nach: 4
stufe: 3
---

Der mBot2 soll im ersten **Tunnelfeld** anhalten: Das ist ein Feld mit einer Wand links **und** einer Wand rechts. Felder mit nur einer Wand zählen nicht. In der Simulation ist das richtige Feld hellgrün, der Liniensensor sieht es aber nicht.

Der Ultraschallsensor schaut nur nach vorn. Um nach links zu schauen, dreht sich der mBot2 nach links, misst und dreht sich wieder zurück.

Den Messwert merkst du dir in einer **Variable**, zum Beispiel in einer Anweisung `links = mbot.getDistance()`. Am Anfang legst du sie an: `int links = 99`.

::: übung vb-tunnel
titel: Der Tunnelsucher
auftrag: Programmiere den mBot2 so, dass er in beiden Welten im ersten Tunnelfeld anhält. Ein Feld ist 30 cm groß.
welt: tunnel-1, tunnel-2
braucht: doUntilSchleife
tipp: In jedem Durchlauf fährt der mBot2 ein Feld vor und schaut sich dann nach links und nach rechts um. Merk dir beide Abstände in Variablen. Am Ende schaut er wieder nach vorn.
tipp: Hier passt eine Schleife, die erst fährt und danach prüft. Sie läuft weiter, solange links **oder** rechts mindestens 20 cm frei ist: `links >= 20 || rechts >= 20`.
lösung: vb-tunnel-loesung.visustruct
:::

::: angeberwissen
Auch diese Aufgabe kommt von **Kara** (SwissEduc, ETH Zürich). Kara hat es leichter: Kara kann gleichzeitig nach links und rechts schauen und muss sich dafür nicht drehen.
:::
