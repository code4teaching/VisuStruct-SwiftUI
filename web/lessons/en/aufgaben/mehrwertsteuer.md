---
titel: Sales tax
nach: 6
stufe: 1
---

In Germany, 19 % **VAT** (value added tax, a kind of sales tax) is added to almost everything you buy. The shop calculates with the net price (without tax) and adds the tax on top. That gives the gross price you pay at the till.

An example: you buy a folding phone that opens up into a tablet. The shop's price tag says 1000 euros net. On top of that come 19 %, so 190 euros. At the till you pay 1190 euros. The shop is not allowed to keep the 190 euros: it passes them on to the tax office.

::: grafik aufgabe-mehrwertsteuer.svg
Net price plus VAT gives the gross price. The VAT goes to the tax office.
:::

::: angeberwissen
Baah, the shop bought the phone itself, of course: from the manufacturer for 800 euros plus 152 euros VAT. These 152 euros are called **input tax**, and the shop may subtract them from the 190 euros. So it only transfers 38 euros to the tax office. In the end only one person pays the whole tax: the customer at the till. That is you. I pay no tax at all, by the way. I just eat grass.
:::

The tax rate never changes while you calculate. That is why you create it as a **constant**: a variable whose value stays the same once it is set. You write `const` in front of it, for example `const double VAT = 0.19`. Names of constants are written in capital letters so you recognise them straight away. In Java code this becomes `final double VAT = 0.19;`.

If the tax rate ever changes, you only have to change this one line.

::: übung aufgabe-mehrwertsteuer
titel: Sales tax
auftrag: Create the constant `VAT` with the value 0.19. Then ask for the net price. First output the tax and then the gross price, only the number each time.
  For a net price of 100 the outputs are **19** and **119**.
test: 100 -> 19 | 119
test: 50 -> 9.5 | 59.5
test: 0 -> 0 | 0
tipp: The tax is 19 percent of the net price. The gross price is what you pay in the end.
tipp: The tax is `netPrice * VAT`. You get the gross price by adding the tax to the net price. Both values are decimal numbers, so `double`.
lösung: aufgabe-mehrwertsteuer-loesung.visustruct
:::

::: quiz
? Why do you create the tax rate as a constant?
- [ ] Because constants are calculated faster
- [x] Because its value should not change in the program
- [ ] Because decimal numbers can only be stored as constants
> A constant keeps its value. If the tax rate ever changes, you only change the one line with `const`.
:::
