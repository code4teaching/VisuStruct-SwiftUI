---
titel: Stopwatch and battery
bereich: Motors and methods
kurz: Measure time and keep an eye on the battery.
---

## Skills I will gain now

::: kompetenzen
- reset the stopwatch and read it
- drive for a certain time
- show the battery level
:::

## The stopwatch

::: mbot2
focus: cyberpi
view: top
:::

A stopwatch runs inside the [CyberPi]{part=cyberpi}. It counts the seconds since the program started. With **reset stopwatch** (`mbot.resetTimer()`) it starts again at 0.

| Sensor or command | Text | Value |
|---|---|---|
| reset stopwatch | `mbot.resetTimer()` | |
| stopwatch | `mbot.getTimer()` | seconds with a decimal place, e.g. `1.5` |

This is how you drive for a certain time: reset the stopwatch, step on the gas, wait as long as the stopwatch is not far enough yet, stop.

## Driving two seconds in the structure chart

::: übung vb-zwei-sekunden
titel: Two seconds
auftrag: The mBot2 resets the stopwatch and steps on the gas with 50 %. As long as the stopwatch is below 2 seconds, it waits a moment. Then it stops. With 50 % it manages 10 cm per second, so it must stop 20 cm further on.
welt: zeit-1
braucht: whileSchleife
tipp: At the top are **reset stopwatch** and `mbot.drive(50, 50)`. Below it a while loop with `mbot.getTimer() < 2`.
tipp: Inside the loop is **wait a moment**, after the loop **stop**.
lösung: vb-zwei-sekunden-loesung.visustruct
:::

## The battery

::: mbot2
focus: shield
view: top
:::

Under the transparent [shield]{part=shield} you see the battery. How full it is comes from `mbot.getBattery()` in percent: `100` is completely full. When it is almost empty, the motors get weaker. Then it is time to charge.

::: angeberwissen
Your phone does not measure its battery directly in percent either. It measures the voltage: a full lithium battery has a little over 4 volts, an empty one just over 3. From that it calculates the percentage, just like the CyberPi.
:::

## Now in Java: battery display

::: übung vb-java-akku
titel: Battery display
code: java
auftrag: Write in Java: the mBot2 shows for example **Battery: 80 %** on the screen. If the battery is below 20 %, the LEDs also light up red.
messwerte: getBattery=80 -> none, ledOff, screen "Battery: 80 %"
messwerte: getBattery=15 -> none, ledOn, screen "Battery: 15 %"
braucht: verzweigung
tipp: `mbot.showText("Battery: " + mbot.getBattery() + " %");` puts the text together from three parts.
tipp: After it: `if (mbot.getBattery() < 20) { mbot.setLed(255, 0, 0); }`
lösung: vb-java-akku-loesung.visustruct
:::

::: übung vb-fehler-21-stoppuhr-akku
titel: Why doesn't it run?
code: java
auftrag: Ludwig typed in "Battery display", but the program does not run. "Open in editor" shows the code in the Code area. Click "Run" and read the error message. Fix the mistake and click Check.
start: vb-fehler-21-stoppuhr-akku-start.visustruct
messwerte: getBattery=80 -> none, ledOff, screen "Battery: 80 %"
messwerte: getBattery=15 -> none, ledOn, screen "Battery: 15 %"
tipp: Count the numbers in the brackets. How many does the command need? You can find it under **Reference**.
tipp: It should be `mbot.setLed(255, 0, 0)`.
lösung: vb-java-akku-loesung.visustruct
:::

## Game: Stopwatch and battery

::: spiel frage
titel: Game: Stopwatch and battery
intro: Read the code and predict what happens. Five rounds.

runde:
    mbot.resetTimer();
    mbot.drive(50, 50);
    while (mbot.getTimer() < 2) {
        mbot.pause(100);
    }
    mbot.stop();
frage: How long does the mBot2 drive?
- 0.1 seconds
- [x] 2 seconds
- until it reaches the wall
> It waits until the stopwatch shows 2 seconds, then it stops.

runde:
    mbot.resetTimer();
    mbot.drive(50, 50);
    while (mbot.getTimer() < 2) {
        mbot.pause(100);
    }
    mbot.stop();
frage: At 50 % it manages 10 cm per second. How far does it drive?
- 10 cm
- [x] 20 cm
- 50 cm
> 2 seconds times 10 cm per second is 20 cm.

runde:
    mbot.pause(3000);
    mbot.resetTimer();
    mbot.pause(1000);
    mbot.showText(mbot.getTimer());
frage: Roughly which number does the screen show?
- 0
- [x] 1
- 4
> After `mbot.resetTimer()` the stopwatch starts again at 0. After that only 1 second passes.

runde:
    if (mbot.getBattery() < 20) {
        mbot.setLed(255, 0, 0);
    }
    mbot.showText("Battery: " + mbot.getBattery() + " %");
frage: The battery has 15 % left. What happens?
- Only the screen shows **Battery: 15 %**.
- Only the LEDs light up red.
- [x] The screen shows **Battery: 15 %**, and the LEDs light up red.
> 15 is less than 20. The display is below the branch and always comes.

runde:
    if (mbot.getBattery() < 20) {
        mbot.setLed(255, 0, 0);
    }
    mbot.showText("Battery: " + mbot.getBattery() + " %");
frage: The battery has 80 %. What happens?
- [x] Only the screen shows **Battery: 80 %**.
- Only the LEDs light up red.
- Nothing at all.
> 80 is not less than 20, so the LEDs stay off.
:::

## Checklist

Rate yourself honestly for each point: ☂️ not yet, ⛅ partly, ☀️ I can do this confidently. For ⛅ and ☂️, **Review** helps you. Then comes the quiz. It shows you whether your self-assessment is right.

::: checkliste
- I can reset the stopwatch and read it. → The stopwatch
- I can drive for a certain time. → Driving two seconds in the structure chart
- I can show the battery level. → Now in Java: battery display
:::

## Quiz

::: quiz
? What does `mbot.getTimer()` give right after `mbot.resetTimer()`?
→ The stopwatch
- [x] 0
- [ ] 100
- [ ] The time of day
> The stopwatch starts again at 0.
? Why does the mBot2 only wait **a moment** in the loop instead of stopping?
→ Driving two seconds in the structure chart
- [ ] Because otherwise the loop does not start.
- [x] Because it should keep driving until the time is up.
- [ ] Because otherwise the stopwatch stops.
> Stepping on the gas still applies while it waits.
:::
