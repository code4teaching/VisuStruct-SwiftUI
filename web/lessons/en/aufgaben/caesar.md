---
titel: Caesar cipher
nach: 17
stufe: 3
---

More than 2000 years ago, the Roman general Julius Caesar sent secret messages to his troops. His trick was simple: he replaced every letter with the letter **three places further on** in the alphabet. A becomes D, B becomes E and so on. The readable message is called the **plain text**, the encrypted one the **secret text**. The number of places you shift by is the **key**, often just called `k`.

::: grafik caesar-verschiebung.svg
Encryption with the key 3: each letter at the top becomes the letter below it. At the end you start again from the beginning, so X, Y and Z become A, B and C.
:::

This turns `HALLO` into `KDOOR`. Anyone who knows the key simply shifts three places back and can read the message again.

### The cipher wheel

To avoid counting every time, people built a **cipher wheel**: two discs with the alphabet, a small one on top of a large one, fixed in the middle so it can turn. The outer ring shows the plain text, the inner ring the secret text. Turn the inner disc by three letters, and below every outer letter you find its secret letter. Wheels like this have existed since the 15th century. In the American Civil War (1861–1865), soldiers carried small brass wheels.

::: grafik caesar-scheibe.svg
A cipher wheel modelled on historical brass wheels. The blue window shows: with the key 3, D is below A.
:::

Try it yourself. Turn the inner wheel, type a text and watch the secret text appear. **Decrypt** goes the other way.

::: caesar 3
LUDWIG
:::

::: ludwig
You can easily make a real wheel yourself: two circles of cardboard, one a bit smaller, each with 26 equal fields for the alphabet, and a paper fastener in the middle. Your secret agent tool is ready!
:::

::: quiz
? What does the letter Y become with the key 3?
- [ ] A
- [x] B
- [ ] C
> After Y comes Z, then you start again with A and B. Three places further on is therefore B.

? A secret text was encrypted with the key 5. How do you decrypt it?
- [ ] Shift it 5 places further on again
- [x] Shift it 5 places back
- [ ] Read the letters backwards
> Decrypting is the opposite of encrypting. By the way, 5 places back is the same as 21 places forward, because 5 + 21 = 26.
:::

### The program: there is more than one way

How do you teach the computer to shift a letter by `k` places? There is no *single* right solution. We look at two ways. Both go through the text character by character with a for loop, just like in the lesson on strings. The difference is how they shift a single letter.

In both ways the remainder operator `%` helps. It makes sure that after Z you continue with A: positions 0 to 25 stay as they are, 26 becomes 0, 27 becomes 1 and so on.

### Way 1: the alphabet in an array

You put the alphabet into an array `char[] alphabet = {'A', 'B', …, 'Z'}`. For every letter of the word you search the array for its position `pos`, that is its index. The secret letter is then in the same array at position `(pos + k) % 26`.

An example with the key 3: X is at position 23. Then `(23 + 3) % 26 = 0`, and position 0 holds A.

::: übung aufgabe-caesar-array
titel: Caesar with an array
auftrag: The start diagram already contains the array `alphabet`. Ask for a word in capital letters and for the key `k`. Then output the encrypted word. For HALLO and 3 that is `KDOOR`.
start: aufgabe-caesar-array-start.visustruct
test: HALLO, 3 -> KDOOR
test: ZEBRA, 1 -> AFCSB
test: LUDWIG, 13 -> YHQJVT
braucht: forSchleife, verzweigung
tipp: Create an empty text `String secret = ""`. Go through the word character by character with a for loop. In every pass you append one secret letter to `secret`.
tipp: To find the position of a letter you need a second, inner loop over the array: if `alphabet[j] == letter`, remember `pos = j`.
tipp: After the inner loop, append `alphabet[(pos + k) % 26]`: `secret = secret + alphabet[(pos + k) % 26]`. After the outer loop, output `secret`.
lösung: aufgabe-caesar-array-loesung.visustruct
:::

### Way 2: calculating with the ASCII table

For the computer, every character is really a number. Which number belongs to which character is listed in the **ASCII table**. There A has the code 65, B the code 66 and so on up to Z with 90. In Java you turn a character into its code with `(int)` and a code back into a character with `(char)`:

```
int code = (int) 'A'
char letter = (char) 68
```

After that, `code` is 65 and `letter` is `'D'`. Changing a value from one data type into another like this is called a **type cast**.

Now you can calculate with the letter. So that the jump from Z back to A works, first subtract 65. Then A has position 0 and Z position 25, exactly as in way 1. Shift with `% 26` and add the 65 back at the end:

::: grafik caesar-ascii.svg
At the top the capital letters with their ASCII codes. Below, the calculation for X with the key 3: the result is A.
:::

::: übung aufgabe-caesar-ascii
titel: Caesar with ASCII
code: java
auftrag: Write a Java program that reads a word in capital letters and the key `k` and outputs the encrypted word. This time without an array: calculate with `(int)` and `(char)`.
test: HALLO, 3 -> KDOOR
test: ZEBRA, 1 -> AFCSB
test: LUDWIG, 13 -> YHQJVT
braucht: forSchleife
tipp: Go through the word with a for loop. You get the code of the character at position `i` with `int code = (int) word.charAt(i);`.
tipp: Calculate `code = (code - 65 + k) % 26 + 65;` and append the character: `secret = secret + (char) code;`. Before the loop write `String secret = "";`, after the loop `System.out.println(secret);`.
lösung: aufgabe-caesar-ascii-loesung.visustruct
:::

### Which way is better?

**Way 1: array.** The idea is to search for the position in the array.
- Advantage: easy to understand, and your own alphabets work too, e.g. with Ä, Ö and Ü.
- Disadvantage: every letter has to be searched for.

**Way 2: ASCII.** The idea is to calculate with the character code.
- Advantage: short and without searching, therefore faster.
- Disadvantage: you need to know the ASCII codes.

Both programs give the same result. That is often how programming works: there are several correct solutions, and you choose the one that fits your task best.

::: übung aufgabe-caesar-entschluesseln
titel: Decrypt Caesar
code: java
auftrag: Now turn the tables. Read a secret text in capital letters and the key `k` and output the plain text. For KDOOR and 3 that is `HALLO`. You decide which way to use.
test: KDOOR, 3 -> HALLO
test: AFCSB, 1 -> ZEBRA
test: YHQJVT, 13 -> LUDWIG
braucht: forSchleife
tipp: Decrypting means shifting `k` places back instead of forward. So `+ k` becomes `- k`.
tipp: Careful with A: `0 - 3` gives -3, and in Java `%` does not turn that into a positive number. So add another 26: `code = (code - 65 - k + 26) % 26 + 65;`
lösung: aufgabe-caesar-entschluesseln-loesung.visustruct
:::

::: angeberwissen
Unfortunately, Caesar is not secure. There are only 25 keys, and you can try them all in a few minutes. It is even quicker with a trick: in English, E is the most common letter. If H is the most common letter in the secret text, the key was probably 3. On the internet there is also ROT13, which is Caesar with the key 13. Applying ROT13 twice gives you the plain text again, because 13 + 13 = 26.
:::
