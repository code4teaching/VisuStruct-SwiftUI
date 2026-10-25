---
titel: mBot2 in input and output
---

## Sensors are inputs

::: mbot2
focus: ultrasonic, screen
view: front
:::

In the IPO principle the input has so far come from the keyboard. A robot gets its inputs from **sensors**. The [ultrasonic sensor]{part=ultrasonic} at the front, for example, measures the distance to the next wall: `mbot.getDistance()` gives it in centimetres.

The mBot2's output appears on its [screen]{part=screen}: `mbot.showText("Hello")` shows a text. With `+` you put it together from parts, just like with `output:`.

You find the sensor **Distance** in the elements in the group **mBot2 sensors**, and **show text** among the **🤖 mBot2 commands**.

::: übung vb-k-abstand-anzeigen
titel: Show the distance
auftrag: Store the distance in a variable `distance`. Then the mBot2 shows for example **Distance: 42 cm** on its screen.
messwerte: getDistance=42 -> none, screen "Distance: 42 cm"
messwerte: getDistance=7 -> none, screen "Distance: 7 cm"
tipp: First statement: `int distance = mbot.getDistance()`. That is the input.
tipp: Second statement: `mbot.showText("Distance: " + distance + " cm")`. That is the output.
lösung: vb-k-abstand-anzeigen-loesung.visustruct
:::
