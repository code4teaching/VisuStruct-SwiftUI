---
titel: Combining conditions
bereich: Basics
kurz: Join several conditions with and, or and not, and check ranges of values.
---

## And: &&

Sometimes a single comparison is not enough. For example, you only get a youth ticket if you are **at least 12 and younger than 18**.

With `&&` (and) you join two conditions. The result is only `true` if **both** conditions are true.

::: diagramm l08-jugendticket.visustruct
Both comparisons must be right. Try 11, 12, 17 and 18 in the simulation.
:::

## Or: ||

With `||` (or) the result is `true` if **at least one** of the conditions is true. Both may be true as well.

```
day == 6 || day == 7
```

This condition is true if `day` has the value 6 or the value 7, so on Saturday or Sunday.

> On many keyboards you type the vertical bar `|` with Shift and the backslash key. On a German keyboard it is AltGr and `<`, on a Mac Option and 7.

## Exercise: Weekend

::: übung l08-wochenende
titel: Weekend
auftrag: Ask for a day of the week as a number (1 is Monday, 7 is Sunday). Output **Weekend** if it is Saturday or Sunday, otherwise **Weekday**.
test: 6 -> Weekend
test: 7 -> Weekend
test: 1 -> Weekday
test: 5 -> Weekday
braucht: verzweigung
tipp: It is the weekend if the day is 6 **or** 7. For that you need two comparisons in one condition.
tipp: Saturday is 6, Sunday is 7. Join the two comparisons with `||`.
lösung: l08-wochenende-loesung.visustruct
:::

## Check ranges of values

In German schools, grades go from 1 (best) to 6. You check whether a grade is **in the range** with two comparisons and `&&`:

```
grade >= 1 && grade <= 6
```

::: grafik l08-zahlenstrahl.svg
The green range from 1 to 6 is valid; both ends are included.
:::

The other way round, a grade is **outside** the range if it is too small **or** too big:

::: diagramm l08-note.visustruct
There is no grade smaller than 1 or bigger than 6.
:::

> The way you write it in maths, `1 <= grade <= 6`, does not work. You have to split it into two comparisons and join them with `&&`.

## Exercise: Valid grade

::: übung l08-note-gueltig
titel: Valid grade
auftrag: Ask for a grade as a whole number. Output **valid** if it is between 1 and 6 (1 and 6 are included), otherwise **invalid**.
test: 1 -> valid
test: 6 -> valid
test: 3 -> valid
test: 0 -> invalid
test: 7 -> invalid
braucht: verzweigung
tipp: A valid grade has to meet two things at once: not too small **and** not too big.
tipp: The grade must be greater than or equal to 1 and at the same time less than or equal to 6.
lösung: l08-gueltig-loesung.visustruct
:::

## Not and brackets

With `!` (not) you turn a condition round: `true` becomes `false` and the other way round.

```
!(grade >= 1 && grade <= 6)
```

This is true if the grade is **not** in the range, and it means the same as `grade < 1 || grade > 6`.

If `&&` and `||` appear together, `&&` is worked out first, just like multiplication before addition. It is better to use **brackets**; then it is clear what belongs together:

```
(age >= 12 && age < 18) || student == 1
```

## Exercise: Leap year

::: übung l08-schaltjahr
titel: Leap year
auftrag: A year is a leap year if it can be divided by 4 but not by 100. Years that can be divided by 400 are leap years anyway.
Ask for a year and output **Leap year** or **Not a leap year**.
test: 2024 -> Leap year
test: 2023 -> Not a leap year
test: 1900 -> Not a leap year
test: 2000 -> Leap year
braucht: verzweigung
tipp: Check the rule with examples first: 2024 is a leap year, 1900 is not, 2000 is. “Can be divided” means the remainder is 0.
tipp: Divisible by 4 means `year % 4 == 0`, not divisible by 100 means `year % 100 != 0`. Join these two with `&&`, put brackets around them and add the case for 400 with `||`.
lösung: l08-schaltjahr-loesung.visustruct
:::

## Checklist

::: checkliste
- I know when a combination with && is true. → And: &&
- I know when a combination with || is true. → Or: ||
- I can turn a condition round with !. → Not and brackets
- I can check whether a value is in a range such as 1 to 6. → Check ranges of values
:::

## Quiz

::: quiz
? When is `a && b` true?
- [ ] If a or b is true
- [x] Only if a and b are both true
- [ ] If exactly one of them is true
> With && both parts must be right. If one is false, the whole thing is false.

? The variable day has the value 6. What does `day == 6 || day == 7` give?
- [x] true
- [ ] false
> With || it is enough if one side is true.

? Which condition checks whether number is between 10 and 20 (both included)?
- [ ] 10 <= number <= 20
- [ ] number >= 10 || number <= 20
- [x] number >= 10 && number <= 20
> With || every number would be allowed, because every number is greater than 10 or less than 20.

? What does `!(5 > 3)` give?
- [ ] true
- [x] false
> 5 > 3 is true, and ! turns that round.
:::
