---
titel: Würfeln mit MVC
nach: 40
stufe: 3
---

Baue ein Würfelspiel nach Model View Controller. Ein Knopf **Würfeln** würfelt, und zwei Views zeigen das Ergebnis.

Das Model ist schon fertig. Es würfelt und zählt mit, wie oft gewürfelt wurde und wie viele Sechsen dabei waren:

```java
class Wuerfel {
    int augen = 1;
    int wuerfe = 0;
    int sechsen = 0;

    void wuerfeln() {
        augen = (int) (Math.random() * 6) + 1;
        wuerfe++;
        if (augen == 6) {
            sechsen++;
        }
    }
}
```

Deine Aufgabe:

1. Teste das Model zuerst ohne Fenster: Würfle in `main` zehnmal und gib danach `wuerfe` und `sechsen` aus.
2. Schreibe die View `AugenAnzeige`. Sie zeigt in einem großen JLabel die gewürfelte Zahl, zum Beispiel „4“.
3. Schreibe die View `StatistikAnzeige`. Sie zeigt zum Beispiel „Sechsen: 2 von 10 Würfen“.
4. Der Controller ist der Zuhörer am Knopf: Er lässt das Model würfeln und gibt beiden Views die neuen Werte.

Zusatz: Ein Knopf **Neues Spiel** setzt alles auf Anfang. Die Methode dafür gehört ins Model.

::: ludwig
Denk an die Regel aus Lektion 40: Im Model steht kein einziges `JLabel`. Wenn du beim Würfeln die Schriftgröße änderst, gehört das in die View.
:::
