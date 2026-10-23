Technical terms for the learning area. When a term appears in a step, it is marked there once and shows its explanation
on hover or tap. If it is in bold in that step, it is being explained right there and is not marked.
`also:` lists other forms that are recognised too. Upper and lower case matter.

### Algorithm
also: algorithm, algorithms, Algorithms
Exact step-by-step instructions for solving a task. Every step is clear.

### Structure chart
also: structure chart, structure charts, Structure charts, Nassi-Shneiderman diagram, Nassi-Shneiderman diagrams
An algorithm drawn as a picture made of boxes. You read it from top to bottom. It is also called a Nassi-Shneiderman diagram.

### Flowchart
also: flowchart, flowcharts, Flowcharts
An algorithm drawn as symbols joined by arrows (DIN 66001 / ISO 5807). A diamond is a decision.

### Pseudocode
also: pseudocode
An algorithm written as text in plain language with fixed words such as IF and WHILE. The indentation shows what belongs together.

### Statement
also: statement, statements, Statements
A single step in the structure chart, for example a calculation, an input or an output.

### Sequence
also: sequence, sequences, Sequences
Steps that run one after another from top to bottom, each exactly once.

### Branch
also: branch, branches, Branches, conditional statement, conditional statements
A block that uses a condition to decide which of two paths runs. It is also called a conditional statement.

### Path
also: path, paths
One of the two ways through a branch: left for true, right for false.

### Loop
also: loop, loops, Loops, iteration, repetition
A block that repeats steps as long as a condition holds.

### Loop body
also: loop body
The inside of a loop, that is, the steps that are repeated.

### Pass
also: passes
Running the inside of a loop once.

### Condition
also: condition, conditions, Conditions
A question that can only be answered with yes (true) or no (false), for example age >= 18.

### Placeholder
also: placeholder, placeholders
An empty box with the sign ø. If you drag an element onto it, the element replaces it.

### Object Inspector
The area below the diagram. Here you edit the text and settings of the box you just clicked.

### Simulation
also: simulation
Runs your structure chart in the editor, step by step if you like. That way you see what happens.

### Variable
also: variable, variables, Variables
A labelled box for a value. It has a name, a data type and a value.

### Constant
also: constant, constants, Constants
A variable whose value stays the same once it is set. You write `const` in front of it, e.g. `const double VAT = 0.19`.

### Data type
also: data type, data types, Data types
Says what kind of value fits into a variable: int (whole number), double (decimal number), String (text) or boolean (true or false).

### Assignment
also: assignment, assignments, Assignments
The sign =. It works out the right-hand side and stores the result in the variable on the left.

### Temporary variable
also: temporary variable, temporary variables, helper variable
An extra variable that keeps a value for a short time, for example when swapping.

### IPO model
also: input-process-output
Input, process, output: first ask for values, then calculate, then show the result.

### Problem analysis
also: problem analysis
You read a task carefully and work out what is given, what you are looking for and how to get from one to the other.

### Comparison operator
also: comparison operator, comparison operators, Comparison operators
A sign that compares two values, for example == or <. The result is true or false.

### Switch
also: switch, multiple selection
A block that runs exactly one of several cases, depending on the value of a variable. It is also called multiple selection.

### Pre-test loop
also: pre-test loop, pre-test loops, head-controlled
The loop checks its condition before every pass. If the condition is false right at the start, the loop does not run even once.

### Post-test loop
also: post-test loop, post-test loops, foot-controlled
The loop checks its condition only after every pass. So it always runs at least once.

### Counter variable
also: counter variable, counter variables, counter
A variable that counts along in a loop, usually i.

### Endless loop
also: endless loop, endless loops, infinite loop, infinite loops
A loop whose condition never becomes false. It never stops by itself.

### Array
also: array, arrays, Arrays
A row of slots with one shared name and the same data type.

### Index
also: index, indices, indexes
The number of a slot in an array. Counting starts at 0.

### String
also: strings, Strings
A text, that is, a row of characters. In Java the data type is called String. The characters are counted from 0.

### 2D array
also: 2D arrays, two-dimensional array, two-dimensional arrays
An array with rows and columns, like a table. A slot needs two indices, e.g. `seats[1][2]`.

### Subprogram
also: subprogram, subprograms, Subprograms, method, methods, Methods, procedure, procedures, function, functions, Functions
A structure chart of its own for part of a task. It runs when it is called. In Java it is called a method; depending on its kind also a procedure or a function.

### Parameter
also: parameter, parameters, Parameters
A variable in the header line of a subprogram. When it is called, it gets the value from the parentheses.

### Spaghetti code
also: spaghetti code
A program that jumps around so wildly that you can hardly follow what happens. Structure charts prevent that.

### Call by value
also: call by value
A subprogram gets a copy of the value. If it changes its parameter, the caller's variable stays the same.

### Call by reference
also: call by reference
A subprogram gets a reference to the same data, e.g. to an array. If it changes a slot, the caller sees the change too.

### Return value
also: return value, return values, Return values
The result that a subprogram hands back to the call with return.

### Break
A block that leaves the loop it is in straight away. Then the program continues below the loop.

### Desk check
also: desk check, desk checks, Desk checks
You run a structure chart on paper and write down the values of the variables after every step.

### Linear search
also: linear search
A way of searching that compares all values one after another with the value you are looking for. It also works with unsorted values.

### Binary search
also: binary search
A way of searching sorted values. It looks at the middle and keeps searching only in the matching half.

### Bubble sort
also: bubble sort, Bubblesort
A simple way of sorting. It always compares two neighbours and swaps them if they are the wrong way round.

### Event
also: event, events, Events
Something a person does in a window program, for example clicking a button. The program reacts to it with a listener (ActionListener).

### Interface
also: Interfaces
A kind of contract in Java: it states which methods a class must have. `ActionListener` is an interface with the method `actionPerformed`.

### Exception
also: exception, exceptions, Exceptions
An error that only happens while the program runs, for example an index outside the array. If no `catch` catches it, the program stops.
