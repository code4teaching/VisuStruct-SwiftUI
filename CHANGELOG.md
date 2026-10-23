# Changelog

All notable changes to this repository will be documented in this file.

The format is loosely inspired by Keep a Changelog.

## [Unreleased]

### Added

- **Web, lessons (de/en/pt): three Swing games** (new lesson blocks `::: spiel zuhoerer`, `vertrag` and `layout`). Lesson 25 gets “Who is listening?” (code, a mock window and clicks; after the answer the clicks are played, the event goes to the listener and its lines light up, then the buttons can be tried freely) and “Contract fulfilled?” (ten classes and lambdas, does it fulfil `ActionListener`? every answer checked with javac). Lesson 27 gets “Who is counting?” with the static field, lesson 28 “Where does the button go?” with small window pictures for FlowLayout, GridLayout and BorderLayout as answers.
- **Web, settings:** separate text sizes for the structure chart and for Live code (code, console, input), each Small, Medium, Large or Extra large, so the code can be enlarged without the rest.
- **Web, lessons (de/en/pt):** five more Swing lessons, each with one new building block: 27 “Click counter with reset” (static field instead of a local variable in the lambda, with the real compiler error), 28 “A traffic light with colours” (`Color`, `setOpaque`/`setBackground`, state variable, BorderLayout), 29 “Grade calculator in a window” (else if, range check and try/catch; IHK scale in de, A–F in en, levels 1–5 in pt), 30 “A calculator” (`GridLayout(0, 2)`, `"" + (a + b)`, division by 0) and 31 “Guess the number” (`Math.random()`, guess counter, `setEnabled(false)`, binary search as expert knowledge). New glossary term Attribut/Atributo.
- **Web, Code live:** new button “Indent” (next to ▶ Run) indents the code like Eclipse or IntelliJ, four spaces per level, only the selected lines if there is a selection. It counts brackets, so half-finished code and pseudocode are indented too. After a change in the structure chart, the changed lines are indented to fit the typed code. Lesson 20 (de/en/pt) mentions the button.
- **Web, lessons (de/en/pt):** new lesson 22 “When the program crashes: try and catch” (section “Catching errors”): a crash with an array index, switching on real Java, reading the error message, try and catch, `Integer.parseInt` with `NumberFormatException`, an expert box on exceptions as objects and the task “Dividing safely”. The Swing lessons move to 23–25 (progress is carried over). New lesson 26 “Doubling a number in a window”: JLabel, JTextField and a “Calculate” button, why only the button shows without a layout (Ludwig), `GridLayout(0, 1)`, `getText`/`parseInt`/`setText` and try/catch against “abc”. New glossary term exception.
- **Web, Code live:** `try { … } catch (…) { … } finally { … }` no longer reports problems; the whole block becomes one statement box (run it with real Java).
- **Web:** the browser tab shows the VisuStruct app icon, as on the website.
- **Web, Code live:** shortcuts from Eclipse and IntelliJ in the suggestions: `syso`, `sysout` and `sout` insert `System.out.println();`, `main` and `psvm` insert the main method.
- **Web:** “About VisuStruct” has a section “Third-party software” (CodeMirror and Lezer, MIT; CheerpJ and javac for Swing support) with a link to `licenses.txt`. The build writes that file next to the app with the licence texts of all bundled packages, as the MIT License requires.
- **Web, Code live: debugger.** Click a line number to set a breakpoint (red dot); ▶ Run pauses before that line. The next line is yellow and its element is selected in the structure chart, a variables table below the code shows the current values and briefly highlights what changed. New Step button (own icon) runs one line and pauses again (also starts the program paused before the first line); ▶ continues to the next breakpoint. The code is read-only while the program runs. Lesson 20 (de/en/pt) gets the section “Find mistakes with the debugger” with a Ludwig tip, checklist item and quiz question.
- **Web, lesson 9 (de/en/pt):** truth table graphic for &&, || and !, a step on storing conditions in boolean variables, and the game “True or false?” (new lesson block `::: spiel`): ten rounds with values and a condition that get harder, each answer explained step by step (`15 >= 12 && 15 < 18` → `true && true` → `true`).
- **Web, lessons (de/en/pt):** new section “Windows with Swing” with three lessons: 22 “Your first window” (JFrame, setSize, setDefaultCloseOperation, why setVisible comes last; expert box on classes and objects), 23 “A button in the window” (JButton, add, FlowLayout; the button can be pressed but nothing happens yet) and 24 “The button reacts” (ActionListener with a lambda, several statements on a click; expert box: ActionListener is an interface, with the anonymous class). Lesson 20 now points to Swing support. New glossary terms event and interface. Ludwig boxes with a code block or long code no longer overflow the learning column.
- **Web, Code live:** a lambda with a block (`e -> { … }`) or an anonymous class (`new ActionListener() { … }`) inside a statement no longer reports a missing `}`; the whole statement becomes one statement box.
- **Repository:** VisuStruct is now licensed under the MIT License (`LICENSE`).
- **Web, Code live:** new setting “Swing support” (gear menu, Java section). When it is on, ▶ Run compiles the typed Java with the real `javac` and runs it as real Java via CheerpJ, so Swing windows appear in a “Java windows” area above the console. Runtime and compiler (about 40 MB) are loaded only on the first run. Code without a class is wrapped in `public class Main`. Each run closes the windows of the previous one; a program without windows ends with “Program finished”.
- **Web, exercises (de/en/pt):** “Ludwig’s tip” box (`::: ludwig`) in the lesson format. The Fibonacci exercise uses it to connect moving the values on with swapping from lesson 5 and sorting in lesson 19, plus a quiz question on the order of the two assignments.
- **Web, Files:** the learning progress (finished lessons and exercises, exercise diagrams, quiz answers) is also kept as `lernstand.json` in the workspace. Opening a workspace merges the file with the browser's progress (finished stays finished, the furthest step counts) and every change is written back about a second later.
- **Web, Files:** saving without a chosen class asks first: pick one of the class folders or type a new one (“Create and save”); the choice stays selected. Creating a folder and deleting now use the same in-page dialog instead of the browser's prompt/confirm, which embedded views block.
- **Web, Code live:** the element of the code line with the cursor is filled light blue in the structure chart, like the code line itself.
- **Web, Code live:** the Java editor shows line numbers (matching the line given in hints such as “Line 9: One too many }”).
- **Web, lessons (de/en/pt):** lesson 20 explains Live code (type Java, the structure chart builds itself; ▶ Run and the console) with the new exercise “Countdown” (code first, then check the structure chart). Lesson 3 explains the Files column with class and date folders, lesson 2 the new tools row with icons, lesson 7 the console during the simulation. New pointers for Files, Live code, Run, console and the tools.
- **Web:** new column “Files” (left of Learning) as a workspace for class folders such as `11FI1`. Saving puts the program into the chosen class and a folder for today (`2026-10-23`, created automatically) as `.visustruct` plus `.java` when Code live shows Java; clicking a program opens it again. In Chrome and Edge the workspace is a real folder on the computer (remembered after reloading); on the iPad and in other browsers it lives in the browser's storage.
- **Web, Code live:** during the step-by-step simulation, the Code live console is cleared at the start and then shows the same output and input as running the program.
- **Web, Code live:** ▶ Run and ■ Stop buttons run the program (via the simulation engine, at full speed). Output and input appear in a console below the code in Code live, resizable with a draggable divider; endless loops can be stopped.
- **Web:** “About VisuStruct” button in the settings menu (gear), with the web app’s version number (from `web/package.json`), author, links and file format.
- **Web, Code live:** Java can be shown as a snippet, with a `main` method, as a class, or both (settings menu). The class name is the diagram title – typing `public class Name` in the code renames the diagram.
- **Web, Code live:** the Java column is now a real code editor (CodeMirror 6, MIT): coloured syntax, bracket matching, automatic indentation and suggestions while typing – templates for `if`, `if … else`, `for`, `while`, `do … while`, `switch`, output and input with grey placeholders, plus the variables of your own code.
- **Web, Code live:** type Java in the code column and the diagram builds itself as you type (unfinished code is tolerated: open blocks count as closed, missing parts become placeholders, a hint names what is still missing). Changing the diagram afterwards only rewrites the lines of the changed elements, so your own comments and formatting stay. JavaScript and Python stay display-only for now.
- **Website:** GitHub Actions workflow that publishes `website/` to visustruct.org via SFTP after the web tests pass (tag `web-v…` or manual start).

### Changed

- **Web, Code live:** the setting “Swing support” is now called “Real Java (with Swing)” in all languages.
- **Web, learning area:** an open lesson shows its number as a badge next to the title, like in the lesson list.
- **Web:** the settings menu shows the version number (now 0.3.12) right next to “About VisuStruct”.
- **Web:** the settings menu (gear) is grouped into sections with headings: Display (text size, language), Code live (programming language, code keywords), Java (class, main, Swing support; only shown when Java is selected) and About VisuStruct at the bottom.
- **Web:** toolbar buttons are icons with tooltips. The top bar keeps New, Open, Save and Settings; undo, clipboard, delete, export, code and simulation moved into a toolbar above the Elements and diagram columns. Run and Stop in Code live are icons too.
- **Web:** Column widths are freely adjustable: with the diagram collapsed, Learning and Code live share the width at a draggable divider; with all three open, Learning and Code live can be dragged wider until the diagram keeps 240 px.
- **Web:** The footer (status, home page, imprint, privacy) now runs below all three columns – Learning, diagram and Code live – instead of only under the diagram.
- **App:** the area below the diagram is headed “Object Inspector · <element kind>” (German „Objektinspektor · Verzweigung“ etc.), matching the web editor and the lessons. The palette keeps its heading “Elements”.
- **Simulation:** conditions now support string comparisons (`name == "Anna"`, `name.equals("Anna")`), parentheses (`(a < 3 || a > 10) && b`), and negation with `!`. Operators inside string literals are no longer treated as operators.
- **Simulation:** after an error the simulation stops on the failing block instead of skipping it and running on; Reset starts over.
- **Code generation:** a branch whose false side holds only another branch now becomes `else if` (Python: `elif`) instead of a nested `else { if … }` block, in Java, Python and JavaScript.

### Fixed

- **Web, Code live:** typing `void main` no longer suggests the main template, so Enter after the name doesn't insert a second main method.
- **Web, Code live:** pasting (or dropping) code at a grey placeholder such as `// Your code` now replaces the placeholder, like typing does. Before, the placeholder stayed in front of the pasted text and commented out its first line (e.g. `import javax.swing.*;`).
- **iPhone:** texts of existing elements (conditions, statements, …) can be edited again. Tapping the middle of an element now selects it and opens the text editor instead of setting an insert marker; insert before/after via the top/bottom strips or the palette. While an insert marker is set, “Edit text” is offered next to “Cancel insert”.

### Planned / Notes

- Documentation polish for product/marketing surfaces only when explicitly requested.

## [1.5.3] - 2026-09-06

### Added

- **File menu:** New, Open, Open Recent, Save, Save As, Print, and Close on the menu bar / keyboard (`Cmd+N/O/S/Shift+S/P/W`), including on Mac (Designed for iPad). Open Recent uses the same list as the toolbar.
- **Files:** double-click or Open With a `.visustruct` or `.strk` file in Finder / Files opens it in VisuStruct (same XML as the Java Struktogrammeditor). The simulation layout is unchanged.

### Fixed

- **Tabs:** warn before closing diagrams with unsaved changes, offering to save, discard, or cancel.
- **File menu:** recently used files show up again under Ablage / File. Nested Open Recent stayed empty because SwiftUI Commands snapshot `FocusedValue`; the list now comes from the shared recents store and is listed directly in Ablage.
- **File menu:** Open, New, Save, and the other Ablage items are enabled after launch. Commands kept a frozen empty `FocusedValue`, so those entries stayed grayed out. Ablage now posts notifications the editor handles, and Open starts enabled instead of waiting on a FocusedValue snapshot.
- **File menu:** Open was missing entirely on Mac (Designed for iPad) because SwiftUI’s Open command with ⌘O is absorbed as the system document-open item and then dropped. Ablage → Öffnen is now a UIKit `UIAction` in the File menu.
- **File menu:** recent files sit under **Zuletzt verwendet** again instead of filling Ablage; the nested list is built when that submenu opens.

## [1.2.1] - 2026-04-20

### Added

- **Code generator (iPad & Mac):** movable floating panel with a drag handle so the structogram stays visible; **iPhone** still uses a full-screen sheet.
- **UI scale:** independent text scaling for the **diagram canvas** vs the **inspector** (`VisuStructUIScale`, wired through Settings / app storage).
- **Switch block:** short inspector hint for the selector expression (code-style example: `day`).

### Changed

- **Inspector hints:** removed the long for-loop explainer (columns and placeholders carry the UX); removed `e.g.` prefixes from inline examples; removed the endless-loop hint line; **break** placeholder copy now describes an **optional comment** (empty field still emits a plain `break` in generated code).
- **Canvas:** **break** and **method call** tiles center label text vertically and horizontally inside the drawable area (accounting for side bars), consistent with statement blocks.
- **`VisuStructCore`:** layout and code-generator adjustments supporting the above; localized string updates across locales.

## [1.2] - 2026-04-17

### Added

- Broad localization coverage across app strings + Settings bundle integration where applicable.
- Diagram clipboard UX (copy/cut/paste) plus keyboard/menu shortcuts on platforms where supported.
- Statement modes for structured diagram authoring:
  - Output prefix `print:` with codegen mappings per language target.
  - Input prefix `input:` with codegen mappings per language target (starter typing stays uniform across languages).
- JavaScript runner improvements for web-based execution (`prompt()` supported in `WKWebView`).

### Changed

- Diagram layout/rendering refinements for multi-way blocks and selection overlay ordering.
- Editor typography improvements for code entry on iPad/Mac.
- Version metadata aligned for release workflow (marketing version / build numbers in Xcode project).

### Fixed

- Issues where diagram sizing/selection visuals could diverge when using placeholder/display text.
- Various UX polish items discovered during multilingual rollout.
