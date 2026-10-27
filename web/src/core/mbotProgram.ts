import { generateCode } from './codeGenerator'
import { MBOT_LED_COLORS, MBOT_SENSORS } from './mbot'
import type { VSDocument } from './model'
import { parseSubprogramHeader } from './simulation'

/**
 * VisuBot: das fertige Programm als MicroPython-Datei für den CyberPi, damit der mBot2 es ohne Kabel fährt.
 * Der Code kommt aus dem Python-Generator; `mbot.forward()` usw. bleiben stehen, weil die Datei vorn eine
 * kleine Klasse `MBot` mit denselben Namen wie in Java mitbringt. Nach dem Einschalten zeigt der Bildschirm
 * „A = Start“, das Programm läuft nach einem Druck auf Taste A.
 */

/** Firmware-Farbnamen (`get_color_sta`) → Name in der Sprache der Lektionen. */
const COLOR_WORDS: Record<string, string> = { red: 'rot', green: 'grün', blue: 'blau', yellow: 'gelb', cyan: 'türkis', purple: 'lila', white: 'weiß', black: 'schwarz' }

const sensorMethods = () =>
  Object.entries(MBOT_SENSORS)
    .map(([name, spec]) => {
      if (name === 'getColor') return `    def ${name}(self):\n        farbe = ${spec.python}\n        return FARBNAMEN.get(farbe, farbe)\n`
      const value = typeof spec.simulated === 'boolean' ? `bool(${spec.python})` : spec.python
      return `    def ${name}(self):\n        return ${value}\n`
    })
    .join('\n')

function prelude(language: string): string {
  const colors = Object.entries(MBOT_LED_COLORS)
    .map(([name, rgb]) => `    ${JSON.stringify(name)}: (${rgb.join(', ')}),\n`)
    .join('')
  const words = Object.entries(COLOR_WORDS)
    .map(([en, de]) => `    ${JSON.stringify(en)}: ${JSON.stringify(language === 'de' ? de : en)},\n`)
    .join('')
  return `import event, time, cyberpi, mbot2, mbuild

FARBEN = {
${colors}}

FARBNAMEN = {
${words}}


class Led:
    def __init__(self, nr):
        self.nr = nr

    def setColor(self, farbe):
        r, g, b = FARBEN.get(farbe, (0, 0, 0))
        cyberpi.led.on(r, g, b, id=self.nr + 1)


class MBot:
    def forward(self, cm=10):
        mbot2.straight(cm)

    def backward(self, cm=10):
        mbot2.straight(-cm)

    def turnLeft(self, grad=90):
        mbot2.turn(-grad)

    def turnRight(self, grad=90):
        mbot2.turn(grad)

    def stop(self):
        mbot2.EM_stop("ALL")

    def drive(self, links, rechts):
        mbot2.drive_power(links, -rechts)

    def setLed(self, r, g, b):
        cyberpi.led.on(r, g, b)

    def ledOff(self):
        cyberpi.led.off()

    def led(self, nr):
        return Led(nr)

    def playTone(self, hz, ms):
        cyberpi.audio.play_tone(hz, ms / 1000)

    def pause(self, ms):
        time.sleep(ms / 1000)

    def resetTimer(self):
        cyberpi.timer.reset()

    def emotion(self, name):
        getattr(cyberpi.emotion, name)()

    def showText(self, text):
        cyberpi.display.clear()
        cyberpi.display.show_label(str(text), 24, "center")

${sensorMethods()}

mbot = MBot()
`
}

const startPart = (label: string) => `

laeuft = False


@event.start
def beim_einschalten():
    mbot.showText(${JSON.stringify(label)})


@event.is_press("a")
def taste_a():
    global laeuft
    if laeuft:
        return
    laeuft = True
    cyberpi.display.clear()
    try:
        programm()
    finally:
        mbot.stop()
        laeuft = False
`

export type MBotProgram = { source: string } | { error: 'input' | 'files' | 'empty' }

/**
 * `doc`: Hauptprogramm, `subprograms`: Unterprogramme aus anderen Reitern; `language`: Sprache der Farbnamen
 * (wie `mbot.getColor()` in der Simulation). Eingaben und Dateien gehen am Roboter nicht.
 */
export function mbotProgram(doc: VSDocument, subprograms: VSDocument[], language: string, startLabel = 'A = Start'): MBotProgram {
  const options = { pythonWithoutMatch: true }
  const main = javaConcatenation(generateCode(doc, 'python', options))
  const defs = subprograms.filter((s) => s !== doc && parseSubprogramHeader(s.caption)).map((s) => javaConcatenation(generateCode(s, 'python', options)))
  const all = [main, ...defs].join('\n')
  if (/\binput\(/u.test(all)) return { error: 'input' }
  if (/\bopen\(|\bos\.path\b/u.test(all)) return { error: 'files' }
  const imports = new Set<string>()
  const strip = (code: string) =>
    code
      .split('\n')
      .filter((line) => {
        if (/^import \w+$/u.test(line)) imports.add(line)
        return !/^import \w+$/u.test(line)
      })
      .join('\n')
      .trim()
  const body = strip(main)
  if (body === '' || /^#[^\n]*$/u.test(body)) return { error: 'empty' }
  const indented = body
    .split('\n')
    .map((line) => (line.trim() === '' ? '' : '    ' + line))
    .join('\n')
  const source =
    `# VisuStruct VisuBot\n${prelude(language)}${[...imports].join('\n')}\n\n` +
    defs.map((d) => strip(d) + '\n\n\n').join('') +
    `def programm():\n${indented}\n` +
    startPart(startLabel)
  return { source }
}

/**
 * Java verkettet Text mit `+` auch mit Zahlen (`"Akku: " + mbot.getBattery()`), Python nicht. In jeder Kette
 * mit einem Text in Anführungszeichen wird alles andere zu `str(…)`; Zahlen vor dem ersten Text werden wie in
 * Java erst addiert (`a + b + "x"` → `str(a + b) + "x"`).
 */
export function javaConcatenation(code: string): string {
  return code
    .split('\n')
    .map((line) => {
      const m = /^(\s*)(.*)$/u.exec(line)!
      return m[2].startsWith('#') ? line : m[1] + rewrite(m[2])
    })
    .join('\n')
}

const separator = /^(==|!=|<=|>=|\+=|-=|\*=|\/=|=|<|>|,|:)/u
const keyword = /^(and|or|not|in|if|elif|while|return|for|else)\b/u

/** Text an Trennern (Vergleich, Zuweisung, Komma, Schlüsselwort) auf oberster Ebene zerlegen, jedes Stück umschreiben. */
function rewrite(text: string): string {
  let out = ''
  let piece = ''
  let depth = 0
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '"' || c === "'") {
      const end = stringEnd(text, i)
      piece += text.slice(i, end)
      i = end - 1
      continue
    }
    if (c === '(' || c === '[' || c === '{') depth++
    if (c === ')' || c === ']' || c === '}') depth--
    if (depth === 0) {
      const sep = separator.exec(text.slice(i)) ?? (/\w/u.test(text[i - 1] ?? '') ? null : keyword.exec(text.slice(i)))
      if (sep) {
        out += rewritePiece(piece) + sep[0]
        piece = ''
        i += sep[0].length - 1
        continue
      }
    }
    piece += c
  }
  return out + rewritePiece(piece)
}

function stringEnd(text: string, start: number): number {
  const quote = text[start]
  for (let i = start + 1; i < text.length; i++) {
    if (text[i] === '\\') i++
    else if (text[i] === quote) return i + 1
  }
  return text.length
}

/** Ein Stück ohne Trenner: erst die Klammern innen, dann die `+`-Kette. */
function rewritePiece(piece: string): string {
  let inner = ''
  const operands: string[] = []
  let depth = 0
  let open = 0
  for (let i = 0; i < piece.length; i++) {
    const c = piece[i]
    if (c === '"' || c === "'") {
      const end = stringEnd(piece, i)
      if (depth === 0) inner += piece.slice(i, end)
      i = end - 1
      continue
    }
    if (c === '(' || c === '[' || c === '{') {
      if (depth === 0) open = i
      depth++
      if (depth === 1) {
        inner += c
        continue
      }
    }
    if (c === ')' || c === ']' || c === '}') {
      depth--
      if (depth === 0) {
        inner += rewrite(piece.slice(open + 1, i)) + c
        continue
      }
    }
    if (depth > 0) continue
    // binäres Plus: davor steht ein Wert, kein Operator
    if (c === '+' && inner.trim() !== '' && !/[-+*/%(,=<>]\s*$/u.test(inner)) {
      operands.push(inner)
      inner = ''
      continue
    }
    inner += c
  }
  if (depth > 0) inner += piece.slice(open)
  operands.push(inner)
  if (operands.length < 2) return operands[0]
  const lead = /^\s*/u.exec(operands[0])![0]
  const trail = /\s*$/u.exec(operands[operands.length - 1])![0]
  const parts = operands.map((o) => o.trim())
  const isText = (p: string) => p.startsWith('"') || p.startsWith("'") || p.startsWith('str(')
  const first = parts.findIndex(isText)
  if (first < 0) return piece
  const before = first > 0 ? [`str(${parts.slice(0, first).join(' + ')})`] : []
  const after = parts.slice(first).map((p) => (isText(p) ? p : `str(${p})`))
  return lead + [...before, ...after].join(' + ') + trail
}
