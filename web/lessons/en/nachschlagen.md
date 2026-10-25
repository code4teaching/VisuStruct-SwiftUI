## Basics

### Statement

A single step. You use it to create variables or to calculate.

```
int number = 5
double price = 2.5
String name = "Ada"
number = number + 1
```

### Input

Asks for a value while the chart runs and stores it in a variable. The text in quotation marks is the question.

```
input: int age "How old are you?"
input: double price "Enter a price"
input: String name "What is your name?"
```

### Output

Shows a text or a value. Texts go in quotation marks; you join text and variables with `+`.

```
output: "Hello"
output: sum
output: "You are " + age + " years old."
```

> In an output, `+` always joins the parts together: with 3 and 4, `output: a + b` shows 34. So calculate in a variable first, e.g. `int sum = a + b`, and then output `sum`.

## Branches

### Branch

Checks a condition. If it is true, the left path (true) runs, otherwise the right one (false).

```
age >= 18
number % 2 == 0
grade < 1 || grade > 6
```

### Switch

Picks one of several cases, depending on the value of a variable. If no case fits, `default` applies. You add cases on the right with **Add Case**.

## Loops

### While loop

Repeats its inside **as long as** the condition is true. The condition is checked before every pass.

```
number != 1
i < 10
```

### Do-while loop

Runs its inside **at least once** and checks the condition only afterwards.

### For loop

Counts a variable from a start value up to a limit. The three fields are Init, Condition and Step.

```
int i = 0
i < 5
i++
```

### Endless loop

Repeats its inside without a condition. A **Break** inside it lets you leave it.

### Break

Leaves the loop around it (`break`).

## Subprograms

### Call

Stands for a subprogram, e.g. `calculateSum()`. With parameters and a return value, the subprogram has a header line as its title:

```
int square(int x)       header line of the subprogram
return x * x            hands back the result
int q = square(5)       call, q gets 25
showSum(3, 4)           call of a void subprogram
```

## Calculating and comparing

### Operators and comparisons

- `+ - * /` the four basic operations
- `%` remainder of a division (`7 % 2` is 1)
- `==` equal, `!=` not equal
- `<` `<=` `>` `>=` less than, less than or equal, greater than, greater than or equal
- `&&` and, `||` or

## Arrays

### Arrays

Several values under one name. Counting starts at 0.

```
int[] numbers = {3, 7, 1}
output: numbers[0]
int[] empty = new int[5]
```

A **2D array** is a table with rows and columns:

```
boolean[][] seats = new boolean[3][5]
seats[1][4] = true
output: seats.length + " rows, " + seats[0].length + " seats"
```
