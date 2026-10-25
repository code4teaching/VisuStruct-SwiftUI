/**
 * Vorschläge nach dem Punkt: `eingabe.` → nextInt(), nextLine() …
 * Der Typ kommt aus der Deklaration im eigenen Code (`Scanner eingabe = …`), der Variablenname ist beliebig.
 * Nur die Klassen und Methoden, die in den Lektionen vorkommen, mit kurzer Beschreibung für Anfänger.
 */

export type MemberLanguage = 'de' | 'en' | 'pt'

export interface JavaMember {
  name: string
  /** Methode (mit Klammern) oder Feld wie `length` bei Arrays. */
  kind: 'method' | 'field'
  /** Methode erwartet Werte in den Klammern. */
  params: boolean
  /** Typ des Ergebnisses, für Ketten wie `eingabe.nextLine().` */
  returns: string
  description: string
}

/** [Name, Klammerinhalt (leer = keine Werte, null = Feld), Ergebnistyp, de, en, pt] */
type Row = [string, string | null, string, string, string, string]

const scanner: Row[] = [
  ['nextInt', '', 'int', 'Ganze Zahl einlesen', 'Read a whole number', 'Ler um número inteiro'],
  ['nextDouble', '', 'double', 'Kommazahl einlesen', 'Read a decimal number', 'Ler um número decimal'],
  ['nextLine', '', 'String', 'Ganze Zeile als Text einlesen', 'Read a whole line as text', 'Ler uma linha inteira como texto'],
  ['next', '', 'String', 'Ein Wort einlesen (bis zum Leerzeichen)', 'Read one word (up to a space)', 'Ler uma palavra (até ao espaço)'],
  ['nextBoolean', '', 'boolean', 'true oder false einlesen', 'Read true or false', 'Ler true ou false'],
  ['nextLong', '', 'long', 'Große ganze Zahl einlesen', 'Read a large whole number', 'Ler um número inteiro grande'],
  ['hasNextInt', '', 'boolean', 'Kommt als Nächstes eine ganze Zahl?', 'Is the next input a whole number?', 'A próxima entrada é um número inteiro?'],
  ['hasNextDouble', '', 'boolean', 'Kommt als Nächstes eine Kommazahl?', 'Is the next input a decimal number?', 'A próxima entrada é um número decimal?'],
  ['hasNextLine', '', 'boolean', 'Gibt es noch eine Zeile?', 'Is there another line?', 'Existe mais uma linha?'],
  ['hasNext', '', 'boolean', 'Gibt es noch ein Wort?', 'Is there another word?', 'Existe mais uma palavra?'],
  ['close', '', 'void', 'Eingabe schließen', 'Close the input', 'Fechar a entrada'],
]

const string: Row[] = [
  ['length', '', 'int', 'Anzahl der Zeichen', 'Number of characters', 'Número de caracteres'],
  ['charAt', 'index', 'char', 'Zeichen an Stelle index (ab 0)', 'Character at position index (from 0)', 'Carácter na posição index (a partir de 0)'],
  ['equals', 'text', 'boolean', 'Gleicher Text? (statt ==)', 'Same text? (instead of ==)', 'Mesmo texto? (em vez de ==)'],
  ['equalsIgnoreCase', 'text', 'boolean', 'Gleicher Text, groß/klein egal?', 'Same text, ignoring case?', 'Mesmo texto, ignorando maiúsculas?'],
  ['compareTo', 'text', 'int', 'Alphabetisch vergleichen (<0, 0, >0)', 'Compare alphabetically (<0, 0, >0)', 'Comparar alfabeticamente (<0, 0, >0)'],
  ['substring', 'von, bis', 'String', 'Teiltext von Stelle von bis vor bis', 'Part of the text from start up to before end', 'Parte do texto do início até antes do fim'],
  ['indexOf', 'text', 'int', 'Erste Stelle des Textes (−1 = fehlt)', 'First position of the text (−1 = missing)', 'Primeira posição do texto (−1 = não existe)'],
  ['lastIndexOf', 'text', 'int', 'Letzte Stelle des Textes (−1 = fehlt)', 'Last position of the text (−1 = missing)', 'Última posição do texto (−1 = não existe)'],
  ['contains', 'text', 'boolean', 'Kommt der Text darin vor?', 'Does it contain the text?', 'Contém o texto?'],
  ['startsWith', 'text', 'boolean', 'Fängt damit an?', 'Starts with it?', 'Começa com isto?'],
  ['endsWith', 'text', 'boolean', 'Hört damit auf?', 'Ends with it?', 'Termina com isto?'],
  ['toUpperCase', '', 'String', 'In GROSSBUCHSTABEN', 'In UPPER CASE', 'Em MAIÚSCULAS'],
  ['toLowerCase', '', 'String', 'In kleinbuchstaben', 'In lower case', 'Em minúsculas'],
  ['trim', '', 'String', 'Leerzeichen vorn und hinten weg', 'Remove spaces at both ends', 'Remover espaços no início e no fim'],
  ['replace', 'alt, neu', 'String', 'Text ersetzen', 'Replace text', 'Substituir texto'],
  ['split', 'trenner', 'String[]', 'In Teile zerlegen, z. B. split(";")', 'Split into parts, e.g. split(";")', 'Dividir em partes, p. ex. split(";")'],
  ['isEmpty', '', 'boolean', 'Leerer Text?', 'Empty text?', 'Texto vazio?'],
  ['toCharArray', '', 'char[]', 'Als Array von Zeichen', 'As an array of characters', 'Como array de caracteres'],
]

const printStream: Row[] = [
  ['println', 'wert', 'void', 'Ausgeben, danach neue Zeile', 'Print, then a new line', 'Escrever e mudar de linha'],
  ['print', 'wert', 'void', 'Ausgeben ohne neue Zeile', 'Print without a new line', 'Escrever sem mudar de linha'],
  ['printf', 'format, werte', 'PrintStream', 'Formatiert ausgeben, z. B. "%.2f"', 'Print formatted, e.g. "%.2f"', 'Escrever formatado, p. ex. "%.2f"'],
]

const printWriter: Row[] = [...printStream, ['close', '', 'void', 'Datei speichern und schließen', 'Save and close the file', 'Guardar e fechar o ficheiro']]

const bufferedReader: Row[] = [
  ['readLine', '', 'String', 'Nächste Zeile lesen (null = Ende)', 'Read the next line (null = end)', 'Ler a próxima linha (null = fim)'],
  ['close', '', 'void', 'Datei schließen', 'Close the file', 'Fechar o ficheiro'],
]

const file: Row[] = [
  ['exists', '', 'boolean', 'Gibt es die Datei?', 'Does the file exist?', 'O ficheiro existe?'],
  ['getName', '', 'String', 'Name der Datei', 'Name of the file', 'Nome do ficheiro'],
  ['length', '', 'long', 'Größe in Bytes', 'Size in bytes', 'Tamanho em bytes'],
]

const exception: Row[] = [
  ['getMessage', '', 'String', 'Fehlermeldung als Text', 'Error message as text', 'Mensagem de erro como texto'],
  ['printStackTrace', '', 'void', 'Fehler mit Zeilen ausgeben', 'Print the error with its lines', 'Mostrar o erro com as linhas'],
]

const actionEvent: Row[] = [
  ['getSource', '', 'Object', 'Welcher Knopf wurde geklickt?', 'Which button was clicked?', 'Que botão foi clicado?'],
  ['getActionCommand', '', 'String', 'Beschriftung des Knopfs', 'Label of the button', 'Texto do botão'],
]

// Gemeinsam für alle Swing-Bausteine (JFrame, JButton, JLabel, JTextField, JPanel).
const component: Row[] = [
  ['setBackground', 'farbe', 'void', 'Hintergrundfarbe, z. B. Color.RED', 'Background colour, e.g. Color.RED', 'Cor de fundo, p. ex. Color.RED'],
  ['setForeground', 'farbe', 'void', 'Schriftfarbe', 'Text colour', 'Cor do texto'],
  ['setFont', 'schrift', 'void', 'Schrift, z. B. new Font("Arial", Font.BOLD, 24)', 'Font, e.g. new Font("Arial", Font.BOLD, 24)', 'Letra, p. ex. new Font("Arial", Font.BOLD, 24)'],
  ['setVisible', 'true', 'void', 'Anzeigen (true) oder verstecken (false)', 'Show (true) or hide (false)', 'Mostrar (true) ou esconder (false)'],
  ['setEnabled', 'true', 'void', 'Anklickbar (true) oder grau (false)', 'Clickable (true) or greyed out (false)', 'Clicável (true) ou cinzento (false)'],
  ['setSize', 'breite, höhe', 'void', 'Größe in Pixeln', 'Size in pixels', 'Tamanho em píxeis'],
]

const container: Row[] = [
  ['add', 'baustein', 'Component', 'Baustein hinzufügen', 'Add a component', 'Adicionar um componente'],
  ['setLayout', 'layout', 'void', 'Anordnung, z. B. new FlowLayout()', 'Layout, e.g. new FlowLayout()', 'Disposição, p. ex. new FlowLayout()'],
  ['remove', 'baustein', 'void', 'Baustein entfernen', 'Remove a component', 'Remover um componente'],
]

const jframe: Row[] = [
  ['setTitle', 'text', 'void', 'Titel oben im Fenster', 'Title at the top of the window', 'Título no topo da janela'],
  ['setDefaultCloseOperation', 'JFrame.EXIT_ON_CLOSE', 'void', 'Was beim Schließen passiert', 'What happens when closing', 'O que acontece ao fechar'],
  ['setLocationRelativeTo', 'null', 'void', 'Mit null: Fenster in die Mitte', 'With null: centre the window', 'Com null: janela no centro'],
  ['setResizable', 'false', 'void', 'Größe änderbar?', 'Can the size change?', 'Pode mudar de tamanho?'],
  ['pack', '', 'void', 'Größe passend zum Inhalt', 'Size to fit the content', 'Tamanho ajustado ao conteúdo'],
  ['getContentPane', '', 'JPanel', 'Inhaltsfläche des Fensters', 'Content area of the window', 'Área de conteúdo da janela'],
  ['dispose', '', 'void', 'Fenster schließen', 'Close the window', 'Fechar a janela'],
]

const textHolder: Row[] = [
  ['setText', 'text', 'void', 'Text setzen', 'Set the text', 'Definir o texto'],
  ['getText', '', 'String', 'Text holen', 'Get the text', 'Obter o texto'],
]

const jbutton: Row[] = [
  ['addActionListener', 'e -> { }', 'void', 'Was beim Klick passiert', 'What happens on click', 'O que acontece ao clicar'],
  ['setOpaque', 'true', 'void', 'Hintergrund sichtbar (für Farben)', 'Show the background (for colours)', 'Mostrar o fundo (para cores)'],
  ['setBorderPainted', 'false', 'void', 'Rahmen zeichnen?', 'Draw the border?', 'Desenhar a borda?'],
]

const jlabel: Row[] = [
  ['setOpaque', 'true', 'void', 'Hintergrund sichtbar (für Farben)', 'Show the background (for colours)', 'Mostrar o fundo (para cores)'],
  ['setHorizontalAlignment', 'JLabel.CENTER', 'void', 'Text links, mittig oder rechts', 'Text left, centre or right', 'Texto à esquerda, centro ou direita'],
]

const jtextfield: Row[] = [
  ['addActionListener', 'e -> { }', 'void', 'Was bei Enter passiert', 'What happens on Enter', 'O que acontece ao carregar em Enter'],
  ['setEditable', 'false', 'void', 'Darf man hineinschreiben?', 'Can you type into it?', 'Pode-se escrever?'],
  ['setColumns', 'anzahl', 'void', 'Breite in Zeichen', 'Width in characters', 'Largura em caracteres'],
  ['requestFocus', '', 'void', 'Cursor hineinsetzen', 'Put the cursor into it', 'Pôr o cursor no campo'],
]

const array: Row[] = [['length', null, 'int', 'Anzahl der Elemente (ohne Klammern)', 'Number of elements (no brackets)', 'Número de elementos (sem parênteses)']]

/** Methoden an Objekten; Basisklassen über `extendsOf`. */
const instance: Record<string, Row[]> = {
  Scanner: scanner,
  String: string,
  PrintStream: printStream,
  PrintWriter: printWriter,
  BufferedReader: bufferedReader,
  FileReader: [['close', '', 'void', 'Datei schließen', 'Close the file', 'Fechar o ficheiro']],
  File: file,
  Exception: exception,
  ActionEvent: actionEvent,
  Component: component,
  Container: container,
  JFrame: jframe,
  JPanel: [],
  JButton: jbutton,
  JLabel: jlabel,
  JTextField: jtextfield,
  TextHolder: textHolder,
}

const extendsOf: Record<string, string[]> = {
  JFrame: ['Container', 'Component'],
  JPanel: ['Container', 'Component'],
  JButton: ['TextHolder', 'Component'],
  JLabel: ['TextHolder', 'Component'],
  JTextField: ['TextHolder', 'Component'],
  PrintWriter: [],
}

/** Klassenname mit Punkt: `Math.`, `System.`, `Integer.` … */
const statics: Record<string, Row[]> = {
  // mBot2 (siehe mbot.ts): fester Name wie `System.out`, ohne eigenes Objekt anzulegen.
  mbot: [
    ['forward', 'cm', 'void', 'Geradeaus vorwärts fahren', 'Drive forward', 'Andar para a frente'],
    ['backward', 'cm', 'void', 'Rückwärts fahren', 'Drive backward', 'Andar para trás'],
    ['turnLeft', 'grad', 'void', 'Auf der Stelle nach links drehen', 'Turn left on the spot', 'Rodar para a esquerda'],
    ['turnRight', 'grad', 'void', 'Auf der Stelle nach rechts drehen', 'Turn right on the spot', 'Rodar para a direita'],
    ['stop', '', 'void', 'Motoren anhalten', 'Stop the motors', 'Parar os motores'],
    ['pause', 'ms', 'void', 'Millisekunden warten', 'Wait milliseconds', 'Esperar milissegundos'],
    ['setLed', 'rot, gruen, blau', 'void', 'LEDs in einer Farbe (je 0–255)', 'LEDs in a colour (0–255 each)', 'LEDs numa cor (0–255 cada)'],
    ['ledOff', '', 'void', 'LEDs aus', 'LEDs off', 'Desligar LEDs'],
    ['showText', '"Hallo"', 'void', 'Text auf dem Bildschirm zeigen', 'Show text on the screen', 'Mostrar texto no ecrã'],
    ['playTone', 'hz, ms', 'void', 'Ton spielen, z. B. playTone(440, 500)', 'Play a tone, e.g. playTone(440, 500)', 'Tocar um som, p. ex. playTone(440, 500)'],
    ['getDistance', '', 'int', 'Abstand vorn in cm (Ultraschall)', 'Distance ahead in cm (ultrasonic)', 'Distância à frente em cm (ultrassom)'],
    ['getLine', '', 'int', 'Liniensensor: 0 = keine Linie, 15 = alle vier auf der Linie', 'Line sensor: 0 = no line, 15 = all four on the line', 'Sensor de linha: 0 = sem linha, 15 = os quatro na linha'],
    ['getBrightness', '', 'int', 'Helligkeit 0–100', 'Brightness 0–100', 'Luminosidade 0–100'],
    ['getLoudness', '', 'int', 'Lautstärke 0–100', 'Loudness 0–100', 'Volume 0–100'],
    ['isRed', '', 'boolean', 'Farbsensor sieht Rot', 'Colour sensor sees red', 'O sensor de cor vê vermelho'],
    ['isGreen', '', 'boolean', 'Farbsensor sieht Grün', 'Colour sensor sees green', 'O sensor de cor vê verde'],
    ['isBlue', '', 'boolean', 'Farbsensor sieht Blau', 'Colour sensor sees blue', 'O sensor de cor vê azul'],
    ['isYellow', '', 'boolean', 'Farbsensor sieht Gelb', 'Colour sensor sees yellow', 'O sensor de cor vê amarelo'],
    ['isButtonA', '', 'boolean', 'Taste A ist gedrückt', 'Button A is pressed', 'O botão A está premido'],
    ['isButtonB', '', 'boolean', 'Taste B ist gedrückt', 'Button B is pressed', 'O botão B está premido'],
    ['isJoystickUp', '', 'boolean', 'Joystick nach oben gedrückt', 'Joystick pushed up', 'Joystick para cima'],
    ['isJoystickDown', '', 'boolean', 'Joystick nach unten gedrückt', 'Joystick pushed down', 'Joystick para baixo'],
    ['isJoystickLeft', '', 'boolean', 'Joystick nach links gedrückt', 'Joystick pushed left', 'Joystick para a esquerda'],
    ['isJoystickRight', '', 'boolean', 'Joystick nach rechts gedrückt', 'Joystick pushed right', 'Joystick para a direita'],
    ['getPitch', '', 'int', 'Neigung nach vorn (+) oder hinten (−) in Grad', 'Tilt forward (+) or back (−) in degrees', 'Inclinação para a frente (+) ou trás (−) em graus'],
    ['getRoll', '', 'int', 'Neigung zur Seite in Grad', 'Tilt sideways in degrees', 'Inclinação lateral em graus'],
    ['isShaken', '', 'boolean', 'Der mBot2 wird geschüttelt', 'The mBot2 is being shaken', 'O mBot2 está a ser abanado'],
  ],
  System: [
    ['out', null, 'PrintStream', 'Ausgabe in die Konsole', 'Output to the console', 'Saída para a consola'],
    ['in', null, 'InputStream', 'Eingabe von der Tastatur (für Scanner)', 'Keyboard input (for Scanner)', 'Entrada do teclado (para Scanner)'],
    ['err', null, 'PrintStream', 'Fehlerausgabe', 'Error output', 'Saída de erros'],
    ['currentTimeMillis', '', 'long', 'Uhrzeit in Millisekunden', 'Time in milliseconds', 'Hora em milissegundos'],
    ['exit', '0', 'void', 'Programm beenden', 'End the program', 'Terminar o programa'],
  ],
  Math: [
    ['random', '', 'double', 'Zufallszahl von 0 bis unter 1', 'Random number from 0 to below 1', 'Número aleatório de 0 até menos de 1'],
    ['abs', 'zahl', 'double', 'Betrag (ohne Minus)', 'Absolute value (no minus)', 'Valor absoluto (sem menos)'],
    ['sqrt', 'zahl', 'double', 'Wurzel', 'Square root', 'Raiz quadrada'],
    ['pow', 'basis, exponent', 'double', 'Hoch: pow(2, 3) = 8', 'Power: pow(2, 3) = 8', 'Potência: pow(2, 3) = 8'],
    ['max', 'a, b', 'double', 'Größere von zwei Zahlen', 'Larger of two numbers', 'Maior de dois números'],
    ['min', 'a, b', 'double', 'Kleinere von zwei Zahlen', 'Smaller of two numbers', 'Menor de dois números'],
    ['round', 'zahl', 'long', 'Runden', 'Round', 'Arredondar'],
    ['floor', 'zahl', 'double', 'Abrunden', 'Round down', 'Arredondar para baixo'],
    ['ceil', 'zahl', 'double', 'Aufrunden', 'Round up', 'Arredondar para cima'],
    ['PI', null, 'double', 'Kreiszahl π = 3.14159…', 'Pi π = 3.14159…', 'Pi π = 3,14159…'],
  ],
  Integer: [
    ['parseInt', 'text', 'int', 'Text in ganze Zahl umwandeln', 'Turn text into a whole number', 'Converter texto em número inteiro'],
    ['toString', 'zahl', 'String', 'Zahl in Text umwandeln', 'Turn a number into text', 'Converter número em texto'],
    ['MAX_VALUE', null, 'int', 'Größte int-Zahl', 'Largest int value', 'Maior valor int'],
    ['MIN_VALUE', null, 'int', 'Kleinste int-Zahl', 'Smallest int value', 'Menor valor int'],
  ],
  Double: [
    ['parseDouble', 'text', 'double', 'Text in Kommazahl umwandeln', 'Turn text into a decimal number', 'Converter texto em número decimal'],
    ['toString', 'zahl', 'String', 'Zahl in Text umwandeln', 'Turn a number into text', 'Converter número em texto'],
  ],
  String: [
    ['valueOf', 'wert', 'String', 'Wert in Text umwandeln', 'Turn a value into text', 'Converter valor em texto'],
    ['format', 'format, werte', 'String', 'Formatierter Text, z. B. "%.2f"', 'Formatted text, e.g. "%.2f"', 'Texto formatado, p. ex. "%.2f"'],
    ['join', 'trenner, teile', 'String', 'Teile mit Trenner verbinden', 'Join parts with a separator', 'Juntar partes com um separador'],
  ],
  Character: [
    ['isDigit', 'zeichen', 'boolean', 'Ist es eine Ziffer?', 'Is it a digit?', 'É um algarismo?'],
    ['isLetter', 'zeichen', 'boolean', 'Ist es ein Buchstabe?', 'Is it a letter?', 'É uma letra?'],
    ['isUpperCase', 'zeichen', 'boolean', 'Ist es ein Großbuchstabe?', 'Is it upper case?', 'É maiúscula?'],
    ['toUpperCase', 'zeichen', 'char', 'In Großbuchstaben', 'To upper case', 'Para maiúscula'],
    ['toLowerCase', 'zeichen', 'char', 'In Kleinbuchstaben', 'To lower case', 'Para minúscula'],
  ],
  Files: [
    ['readString', 'Path.of("datei.txt")', 'String', 'Ganze Datei als Text lesen', 'Read the whole file as text', 'Ler o ficheiro inteiro como texto'],
    ['writeString', 'pfad, text', 'Path', 'Text in Datei schreiben', 'Write text to a file', 'Escrever texto num ficheiro'],
    ['readAllLines', 'pfad', 'List', 'Alle Zeilen lesen', 'Read all lines', 'Ler todas as linhas'],
    ['exists', 'pfad', 'boolean', 'Gibt es die Datei?', 'Does the file exist?', 'O ficheiro existe?'],
  ],
  Path: [['of', '"datei.txt"', 'Path', 'Pfad zu einer Datei', 'Path to a file', 'Caminho para um ficheiro']],
  JFrame: [['EXIT_ON_CLOSE', null, 'int', 'Programm endet beim Schließen', 'Program ends when closed', 'O programa termina ao fechar']],
  JLabel: [
    ['CENTER', null, 'int', 'Mittig', 'Centred', 'Ao centro'],
    ['LEFT', null, 'int', 'Links', 'Left', 'À esquerda'],
    ['RIGHT', null, 'int', 'Rechts', 'Right', 'À direita'],
  ],
  Font: [
    ['BOLD', null, 'int', 'Fett', 'Bold', 'Negrito'],
    ['PLAIN', null, 'int', 'Normal', 'Plain', 'Normal'],
    ['ITALIC', null, 'int', 'Kursiv', 'Italic', 'Itálico'],
  ],
  Color: (
    [
      ['RED', 'Rot', 'Red', 'Vermelho'],
      ['GREEN', 'Grün', 'Green', 'Verde'],
      ['BLUE', 'Blau', 'Blue', 'Azul'],
      ['YELLOW', 'Gelb', 'Yellow', 'Amarelo'],
      ['ORANGE', 'Orange', 'Orange', 'Laranja'],
      ['WHITE', 'Weiß', 'White', 'Branco'],
      ['BLACK', 'Schwarz', 'Black', 'Preto'],
      ['GRAY', 'Grau', 'Grey', 'Cinzento'],
      ['LIGHT_GRAY', 'Hellgrau', 'Light grey', 'Cinzento-claro'],
      ['PINK', 'Rosa', 'Pink', 'Rosa'],
      ['CYAN', 'Türkis', 'Cyan', 'Ciano'],
      ['MAGENTA', 'Magenta', 'Magenta', 'Magenta'],
    ] as const
  ).map(([name, de, en, pt]): Row => [name, null, 'Color', de, en, pt]),
}

function toMember(row: Row, lang: MemberLanguage): JavaMember {
  const [name, params, returns, de, en, pt] = row
  return { name, kind: params === null ? 'field' : 'method', params: !!params, returns, description: lang === 'de' ? de : lang === 'pt' ? pt : en }
}

function rowsOf(type: string): Row[] | undefined {
  if (/\[\]$/.test(type)) return array
  if (/Exception$|^Throwable$/.test(type)) return instance.Exception
  const own = instance[type]
  if (!own) return undefined
  const seen = new Set<string>()
  const rows: Row[] = []
  for (const t of [type, ...(extendsOf[type] ?? [])]) {
    for (const row of instance[t] ?? []) {
      if (seen.has(row[0])) continue
      seen.add(row[0])
      rows.push(row)
    }
  }
  return rows
}

/** Methoden eines Typs, z. B. `membersOf('Scanner', 'de')`. */
export function membersOf(type: string, lang: MemberLanguage = 'de'): JavaMember[] {
  return (rowsOf(type) ?? []).map((r) => toMember(r, lang))
}

const declarationTypes = '[A-Z]\\w*|int|long|double|float|boolean|char|byte|short|var'

/** Typ einer Variablen aus ihrer Deklaration: `Scanner eingabe`, `String[] namen`, `for (String s : namen)`, `catch (Exception e)`. */
export function declaredType(code: string, name: string): string | undefined {
  const re = new RegExp(`(?:^|[^\\w.])(${declarationTypes})\\s*(?:<[^<>;]*>)?((?:\\s*\\[\\s*\\])*)\\s+${name}\\s*(?:\\[\\s*\\])*\\s*(=\\s*([^;]*))?(?=[=;,):]|$)`, 'gm')
  let type: string | undefined
  for (const m of code.matchAll(re)) {
    let t = m[1]
    if (t === 'var') {
      const init = m[4] ?? ''
      t = /^new\s+([A-Z]\w*)/.exec(init)?.[1] ?? (/^"/.test(init) ? 'String' : '')
      if (!t) continue
    }
    // Schlüsselwörter, die wie ein Typ aussehen könnten, nicht mitnehmen.
    if (/^(return|new|else|case|throw)$/.test(t)) continue
    type = t + m[2].replace(/\s+/g, '')
  }
  return type
}

/** Ein Glied der Kette vor dem Punkt: `eingabe`, `namen[i]`, `nextLine()`. */
interface Link {
  name: string
  call: boolean
  indices: number
}

/** Zerlegt `a.b(x).c[0]` in Glieder; `undefined`, wenn es kein einfacher Ausdruck ist. */
function parseChain(text: string): { head: string; links: Link[] } | undefined {
  let i = 0
  let head: string
  const literal = /^"(?:[^"\\]|\\.)*"/.exec(text)
  if (literal) {
    head = '"'
    i = literal[0].length
  } else {
    const id = /^[A-Za-z_]\w*/.exec(text)
    if (!id) return undefined
    head = id[0]
    i = id[0].length
  }
  const links: Link[] = [{ name: head, call: false, indices: 0 }]
  const skipGroup = (open: string, close: string) => {
    let depth = 0
    for (; i < text.length; i++) {
      if (text[i] === '"') {
        const s = /^"(?:[^"\\]|\\.)*"/.exec(text.slice(i))
        if (!s) return false
        i += s[0].length - 1
      } else if (text[i] === open) depth++
      else if (text[i] === close && --depth === 0) {
        i++
        return true
      }
    }
    return false
  }
  while (i < text.length) {
    const last = links[links.length - 1]
    if (text[i] === '(' && !last.call && last.indices === 0) {
      if (!skipGroup('(', ')')) return undefined
      last.call = true
    } else if (text[i] === '[') {
      if (!skipGroup('[', ']')) return undefined
      last.indices++
    } else if (text[i] === '.') {
      const id = /^[A-Za-z_]\w*/.exec(text.slice(i + 1))
      if (!id) return undefined
      links.push({ name: id[0], call: false, indices: 0 })
      i += 1 + id[0].length
    } else return undefined
  }
  return { head, links }
}

/** Anfang des Ausdrucks vor dem Punkt an `end` (rückwärts über Namen, Punkte, Klammern und Texte). */
function chainStart(line: string, end: number): number {
  let i = end
  while (i > 0) {
    const c = line[i - 1]
    if (/[\w.]/.test(c)) i--
    else if (c === ')' || c === ']') {
      const open = c === ')' ? '(' : '['
      let depth = 0
      let j = i - 1
      for (; j >= 0; j--) {
        if (line[j] === c) depth++
        else if (line[j] === open && --depth === 0) break
      }
      if (j < 0) return i
      i = j
    } else if (c === '"') {
      const j = line.lastIndexOf('"', i - 2)
      if (j < 0) return i
      i = j
    } else break
  }
  return i
}

const withoutIndex = (type: string, n: number) => type.slice(0, Math.max(0, type.length - 2 * n))

function memberType(type: string, name: string, isStatic: boolean): string | undefined {
  const rows = isStatic ? statics[type] : rowsOf(type)
  return rows?.find((r) => r[0] === name)?.[2]
}

/** Typ des Ausdrucks vor dem Punkt, z. B. `eingabe` → Scanner, `eingabe.nextLine()` → String. */
export function receiverType(code: string, receiver: string): { type: string; isStatic: boolean } | undefined {
  const chain = parseChain(receiver)
  if (!chain) return undefined
  const [first, ...rest] = chain.links
  let type: string | undefined
  let isStatic = false
  if (chain.head === '"') type = 'String'
  else {
    type = declaredType(code, first.name)
    if (!type && statics[first.name] && !first.call) {
      type = first.name
      isStatic = true
    }
    if (!type) return undefined
    if (first.indices) type = withoutIndex(type, first.indices)
  }
  for (const link of rest) {
    const next = memberType(type, link.name, isStatic)
    if (!next) return undefined
    type = withoutIndex(next, link.indices)
    isStatic = false
  }
  return { type, isStatic }
}

/**
 * Vorschläge an der Stelle `pos`, wenn direkt davor `ausdruck.` (plus angefangener Name) steht.
 * `from` ist der Anfang des angefangenen Namens hinter dem Punkt.
 */
export function memberCompletionsAt(code: string, pos: number, lang: MemberLanguage = 'de'): { from: number; members: JavaMember[] } | undefined {
  const lineStart = code.lastIndexOf('\n', pos - 1) + 1
  const before = code.slice(lineStart, pos)
  const m = /\.\s*(\w*)$/.exec(before)
  if (!m) return undefined
  const dot = m.index
  const receiver = before.slice(chainStart(before, dot), dot)
  if (!receiver || /^\d/.test(receiver)) return undefined
  const found = receiverType(code, receiver)
  if (!found) return undefined
  const rows = found.isStatic ? statics[found.type] : rowsOf(found.type)
  if (!rows) return undefined
  return { from: pos - m[1].length, members: rows.map((r) => toMember(r, lang)) }
}
