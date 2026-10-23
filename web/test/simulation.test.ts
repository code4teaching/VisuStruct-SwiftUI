import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ElementType, makeElement, type VSDocument, type VSElement } from '../src/core/model'
import { SimulationEngine, type SimState } from '../src/core/simulation'
import { decodeDocument } from '../src/core/xmlCodec'

// Port von SimulationEngineTests.swift und SimulationConditionTests.swift.

const examples = join(__dirname, '..', '..', 'VisuStruct-Dateien')
const example = (name: string) => decodeDocument(readFileSync(join(examples, name), 'utf8'))

const doc = (elements: VSElement[]): VSDocument => ({ caption: '', elements })
const stmt = (text: string) => makeElement(ElementType.anweisung, { textLines: [text] })

/** Lässt die Simulation bis zum Ende laufen und beantwortet `input:`-Anfragen der Reihe nach. */
function runSimulation(document: VSDocument, inputs: string[] = [], maxSteps = 10_000): SimState & { message?: string } {
  const engine = new SimulationEngine(document)
  const remaining = [...inputs]
  let steps = 0
  while (steps < maxSteps) {
    if (engine.state.inputRequest) {
      const next = remaining.shift()
      if (next === undefined) throw new Error('Simulation wartet auf Eingabe, aber es sind keine Eingaben mehr übrig.')
      engine.provideInput(next)
      continue
    }
    if (!engine.canStep) break
    engine.step()
    steps += 1
  }
  expect(steps).toBeLessThan(maxSteps)
  return { ...engine.state, message: engine.message }
}

describe('Simulation', () => {
  it('Collatz gibt die Folge aus', () => {
    const state = runSimulation(example('Collatz.visustruct'))
    expect(state.outputLines).toEqual(
      ['58', '29', '88', '44', '22', '11', '34', '17', '52', '26', '13', '40', '20', '10', '5', '16', '8', '4', '2', '1'],
    )
    expect(state.variables.get('number')).toEqual({ kind: 'int', value: 1 })
  })

  it('Fibonacci gibt die ersten zehn Zahlen aus', () => {
    expect(runSimulation(example('Fibonacci.visustruct')).outputLines).toEqual(
      ['1', '1', '2', '3', '5', '8', '13', '21', '34', '55'],
    )
  })

  it('NumberEven nutzt die Eingabe', () => {
    const d = example('2026-04-23-NumberEven.visustruct')
    expect(runSimulation(d, ['4']).outputLines).toEqual(['number is even'])
    expect(runSimulation(d, ['7']).outputLines).toEqual(['number is odd'])
  })

  it('weist ungültige Ganzzahl-Eingaben zurück', () => {
    const engine = new SimulationEngine(doc([stmt('input: int n'), stmt('print: n * 2')]))
    engine.step()
    expect(engine.state.inputRequest?.variableName).toBe('n')
    engine.provideInput('abc')
    expect(engine.state.inputErrorNotice).toEqual({ kind: 'wholeNumberExpected' })
    expect(engine.state.inputRequest).toBeDefined()
    engine.provideInput('21')
    expect(engine.state.inputRequest).toBeUndefined()
    engine.step()
    expect(engine.state.outputLines).toEqual(['42'])
  })

  it('zählende Schleifen', () => {
    const forLoop = doc([
      stmt('int sum = 0'),
      makeElement(ElementType.forSchleife, { textLines: ['int i = 1', 'i <= 4', 'i++'], loopBody: [stmt('sum += i')] }),
    ])
    expect(runSimulation(forLoop).variables.get('sum')).toEqual({ kind: 'int', value: 10 })

    const doUntil = doc([
      stmt('int k = 0'),
      makeElement(ElementType.doUntilSchleife, { textLines: ['k < 3'], loopBody: [stmt('k++')] }),
    ])
    expect(runSimulation(doUntil).variables.get('k')).toEqual({ kind: 'int', value: 3 })
  })

  it('Fallauswahl springt in den default-Fall', () => {
    const d = (day: number) =>
      doc([
        stmt(`int day = ${day}`),
        makeElement(ElementType.fallauswahl, {
          textLines: ['day'],
          cases: [
            { name: '1', elements: [stmt('print: "Montag"')] },
            { name: '2', elements: [stmt('print: "Dienstag"')] },
            { name: 'default', elements: [stmt('print: "anderer Tag"')] },
          ],
        }),
      ])
    expect(runSimulation(d(2)).outputLines).toEqual(['Dienstag'])
    expect(runSimulation(d(5)).outputLines).toEqual(['anderer Tag'])
  })

  it('überspringt den Platzhalter ø', () => {
    const d = (a: number) =>
      doc([
        stmt('ø'),
        stmt(`int a = ${a}`),
        makeElement(ElementType.verzweigung, {
          textLines: ['a > 3'],
          cases: [
            { name: 'true', elements: [stmt('print: "groß"')] },
            { name: 'false', elements: [stmt('ø')] },
          ],
        }),
      ])
    const big = runSimulation(d(5))
    expect(big.outputLines).toEqual(['groß'])
    expect(big.isHalted).toBe(false)
    const small = runSimulation(d(1))
    expect(small.outputLines).toEqual([])
    expect(small.isHalted).toBe(false)
    expect(small.message).toBe('Simulation finished.')
  })

  it('rechnet mit boolean-Variablen', () => {
    const loop = makeElement(ElementType.whileSchleife, {
      textLines: ['!fertig'],
      loopBody: [stmt('i++'), stmt('fertig = i >= 3')],
    })
    const state = runSimulation(
      doc([
        stmt('int i = 0'),
        stmt('boolean fertig = false'),
        loop,
        stmt('bool gross = i > 2 && fertig'),
        stmt('print: "fertig: " + fertig'),
        makeElement(ElementType.verzweigung, {
          textLines: ['gross == true'],
          cases: [
            { name: 'true', elements: [stmt('print: "ja"')] },
            { name: 'false', elements: [stmt('print: "nein"')] },
          ],
        }),
        stmt('gross = !gross'),
        stmt('print: gross'),
      ]),
    )
    expect(state.isHalted).toBe(false)
    expect(state.variables.get('i')).toEqual({ kind: 'int', value: 3 })
    expect(state.outputLines).toEqual(['fertig: true', 'ja', 'false'])
  })

  it('liest boolean ein', () => {
    const engine = new SimulationEngine(doc([stmt('input: boolean ok "Okay?"'), stmt('print: ok')]))
    engine.step()
    expect(engine.state.inputRequest?.valueType).toBe('boolean')
    engine.provideInput('vielleicht')
    expect(engine.state.inputErrorNotice).toEqual({ kind: 'booleanExpected' })
    engine.provideInput('Wahr')
    engine.step()
    expect(engine.state.outputLines).toEqual(['true'])
  })

  it('Division durch null meldet einen Fehler', () => {
    const engine = new SimulationEngine(doc([stmt('int x = 1 / 0')]))
    engine.step()
    expect(engine.state.notice).toEqual({ kind: 'divisionByZero' })
    expect(engine.message).toBe('Division by zero.')
    expect(engine.state.variables.has('x')).toBe(false)
  })

  it('meldet das Ende nach dem letzten Schritt', () => {
    const engine = new SimulationEngine(doc([stmt('int x = 1')]))
    engine.step()
    expect(engine.message).toBe('Simulation finished.')
  })

  it('Werte und Arrays', () => {
    const state = runSimulation(
      doc([
        stmt('double d = 7.0 / 2'),
        stmt('int[] a = {3, 4, 5}'),
        stmt('a[1] = a[0] * 10'),
        stmt('String s = "x"'),
        stmt('print: "len=" + a.length + " a=" + a + " d=" + d'),
        stmt('d += 1'),
      ]),
    )
    expect(state.outputLines).toEqual(['len=3 a=[3, 30, 5] d=3.5'])
    expect(state.variables.get('d')).toEqual({ kind: 'double', value: 4.5 })
    expect(state.lastTrace).toBe('d = 3.5 + 1.0 -> 4.5')
  })
})

describe('Bedingungen', () => {
  const branch = (condition: string, setup = ['int a = 5', 'String name = "Anna"']) =>
    doc([
      ...setup.map(stmt),
      makeElement(ElementType.verzweigung, {
        textLines: [condition],
        cases: [
          { name: 'true', elements: [stmt('print: "ja"')] },
          { name: 'false', elements: [stmt('print: "nein"')] },
        ],
      }),
    ])

  const check = (condition: string, expected: boolean) => {
    const state = runSimulation(branch(condition))
    expect(state.message === 'Simulation finished.' ? undefined : state.message, condition).toBeUndefined()
    expect(state.outputLines, condition).toEqual([expected ? 'ja' : 'nein'])
  }

  it('boolesche Operatoren', () => {
    check('a > 3 && a < 10', true)
    check('a < 3 || a == 5', true)
    check('a != 5', false)
  })

  it('String-Vergleiche', () => {
    check('name == "Anna"', true)
    check('name != "Anna"', false)
    check('"Anna" == name', true)
    check('name.equals("Anna")', true)
    check('!name.equals("Bob")', true)
    check('name == "Anna" && a == 5', true)
  })

  it('Operatoren in String-Literalen sind Text', () => {
    const state = runSimulation(branch('text == "a && b || c"', ['String text = "a && b || c"']))
    expect(state.outputLines).toEqual(['ja'])
  })

  it('Klammern und Negation', () => {
    check('(a < 3 || a == 5) && a > 0', true)
    check('(a < 3 || a > 10) && a > 0', false)
    check('!(a > 3)', false)
    check('!(a > 3 && a < 4)', true)
    check('(a + 1) * 2 > 11', true)
    check('((a == 5))', true)
  })

  it('Schlüsselwort mit getrennt geklammerten Teilen', () => {
    check('if (a > 3) && (a < 10)', true)
    check('if (a > 3) && (a > 10)', false)
  })

  it('while-Schleife mit String-Bedingung', () => {
    const d = doc([
      stmt('String answer = "nein"'),
      stmt('int tries = 0'),
      makeElement(ElementType.whileSchleife, {
        textLines: ['answer != "ja"'],
        loopBody: [stmt('input: answer'), stmt('tries++')],
      }),
    ])
    expect(runSimulation(d, ['vielleicht', 'ja']).variables.get('tries')).toEqual({ kind: 'int', value: 2 })
  })

  it('String mit Zahl vergleichen ist ein Fehler', () => {
    const state = runSimulation(branch('name == 5'))
    expect(state.isHalted).toBe(true)
    expect(state.outputLines).toEqual([])
  })

  it('bleibt beim fehlerhaften Schritt stehen', () => {
    const engine = new SimulationEngine(doc([stmt('print: "vorher"'), stmt('int x = 1 / 0'), stmt('print: "danach"')]))
    engine.step()
    engine.step()
    expect(engine.state.isHalted).toBe(true)
    expect(engine.canStep).toBe(false)
    expect(engine.currentStepPath).toEqual([1])
    expect(engine.message).toBe('Division by zero.')
    engine.step()
    expect(engine.state.outputLines).toEqual(['vorher'])
    expect(engine.message).toBe('Division by zero.')
    engine.reset()
    expect(engine.state.isHalted).toBe(false)
    expect(engine.canStep).toBe(true)
  })

  it('teilt ganze Zahlen wie Java', () => {
    const state = runSimulation(
      doc([
        stmt('int a = 7'),
        stmt('int b = 2'),
        stmt('int q = a / b'),
        stmt('double d = a / b'),
        stmt('double e = a / 2.0'),
        stmt('int n = -7 / 2'),
        stmt('double[] w = {1.5, 2.5}'),
        stmt('print: "q=" + a / b + " d=" + d + " e=" + e + " n=" + n'),
        stmt('double m = (w[0] + w[1]) / 2'),
        stmt('int k = 10 / 4 * 2'),
      ]),
    )
    expect(state.variables.get('q')).toEqual({ kind: 'int', value: 3 })
    expect(state.variables.get('d')).toEqual({ kind: 'double', value: 3 })
    expect(state.variables.get('e')).toEqual({ kind: 'double', value: 3.5 })
    expect(state.variables.get('n')).toEqual({ kind: 'int', value: -3 })
    expect(state.outputLines).toEqual(['q=3 d=3.0 e=3.5 n=-3'])
    expect(state.variables.get('m')).toEqual({ kind: 'double', value: 2 })
    expect(state.variables.get('k')).toEqual({ kind: 'int', value: 4 })
  })

  it('rechnet mit mehreren Arrayfächern und erlaubt Leerzeichen im Index des Ziels', () => {
    const state = runSimulation(doc([stmt('int[] a = {5, 3, 1}'), stmt('int d = a[0] - a[1]'), stmt('int i = 0'), stmt('a[i + 1] = a[i] + a[i + 2]')]))
    expect(state.variables.get('d')).toEqual({ kind: 'int', value: 2 })
    expect(state.variables.get('a')).toEqual({ kind: 'intArray', value: [5, 6, 1] })
  })

  it('Aussprung verlässt die innerste Schleife', () => {
    const jump = makeElement(ElementType.aussprung, { textLines: ['Schleife verlassen'] })
    const document = doc([
      stmt('int summe = 0'),
      makeElement(ElementType.endlosschleife, {
        loopBody: [
          stmt('input: int zahl "Zahl?"'),
          makeElement(ElementType.verzweigung, {
            textLines: ['zahl == 0'],
            cases: [
              { name: 'true', elements: [jump] },
              { name: 'false', elements: [stmt('summe = summe + zahl')] },
            ],
          }),
        ],
      }),
      makeElement(ElementType.forSchleife, {
        textLines: ['int i = 0', 'i < 10', 'i++'],
        loopBody: [
          makeElement(ElementType.verzweigung, {
            textLines: ['i == 2'],
            cases: [
              { name: 'true', elements: [jump] },
              { name: 'false', elements: [stmt('ø')] },
            ],
          }),
        ],
      }),
      stmt('print: "Summe: " + summe + " i=" + i'),
      jump,
      stmt('print: "nie"'),
    ])
    const state = runSimulation(document, ['3', '4', '0'])
    expect(state.outputLines).toEqual(['Summe: 7 i=2'])
    expect(state.message).toBe('Simulation finished.')
  })

  it('Aufruf führt das Unterprogramm aus', () => {
    const call = (name: string) => makeElement(ElementType.aufruf, { textLines: [name] })
    const titel: VSDocument = { caption: 'zeigeTitel()', elements: [stmt('print: "== Quiz =="'), stmt('int punkte = 0')] }
    const zaehlen: VSDocument = {
      caption: 'zaehlen',
      elements: [
        makeElement(ElementType.whileSchleife, { textLines: ['true'], loopBody: [stmt('punkte++'), makeElement(ElementType.aussprung, {})] }),
        stmt('print: "punkte=" + punkte'),
        makeElement(ElementType.aussprung, {}),
        stmt('print: "nie"'),
      ],
    }
    const subprograms: Record<string, VSDocument> = { zeigetitel: titel, zaehlen }
    const engine = new SimulationEngine(
      doc([call('zeigeTitel()'), call('zaehlen();'), call('zaehlen()'), call('fehlt()'), stmt('print: "Ende " + punkte')]),
      (name) => subprograms[name.toLowerCase()],
    )
    const paths: (number[] | undefined)[] = []
    while (engine.canStep) {
      engine.step()
      paths.push(engine.currentStepPath)
      if (engine.state.notice?.kind === 'subprogramNotFound') expect(engine.message).toBe('No open diagram is called fehlt(). The call was skipped.')
    }
    expect(engine.state.outputLines).toEqual(['== Quiz ==', 'punkte=1', 'punkte=2', 'Ende 2'])
    expect(engine.message).toBe('Simulation finished.')
    // Im Unterprogramm bleibt der Aufruf-Kasten markiert
    expect(paths[0]).toEqual([0])
  })

  describe('Unterprogramme mit Kopfzeile', () => {
    const call = (text: string) => makeElement(ElementType.aufruf, { textLines: [text] })
    const branch = (condition: string, yes: VSElement[], no: VSElement[]) =>
      makeElement(ElementType.verzweigung, { textLines: [condition], cases: [{ name: 'true', elements: yes }, { name: 'false', elements: no }] })
    const run = (main: VSElement[], subs: VSDocument[], inputs: string[] = []) => {
      const engine = new SimulationEngine(doc(main), (name) => subs.find((d) => d.caption.includes(name + '(')))
      const remaining = [...inputs]
      for (let i = 0; i < 10_000 && (engine.canStep || engine.state.inputRequest); i++) {
        if (engine.state.inputRequest) engine.provideInput(remaining.shift()!)
        else engine.step()
      }
      return engine
    }

    it('übergibt Werte, gibt mit return zurück und hält Variablen lokal', () => {
      const quadrat: VSDocument = { caption: 'int quadrat(int x)', elements: [stmt('int y = x * x'), stmt('return y')] }
      const engine = run([stmt('int x = 3'), stmt('int y = 10'), call('int q = quadrat(x + 1)'), stmt('print: x + " " + y + " " + q')], [quadrat])
      expect(engine.state.outputLines).toEqual(['3 10 16'])
      expect(engine.state.variables.has('q')).toBe(true)
      expect(engine.message).toBe('Simulation finished.')
    })

    it('ruft void-Unterprogramme mit Parametern auf und beendet sie mit return', () => {
      const zeige: VSDocument = {
        caption: 'void zeigeSumme(int a, int b)',
        elements: [branch('a < 0', [stmt('return')], []), stmt('int summe = a + b'), stmt('print: "Summe: " + summe')],
      }
      const engine = run([call('zeigeSumme(3, 4)'), call('zeigeSumme(-1, 4);'), stmt('print: "Ende"')], [zeige])
      expect(engine.state.outputLines).toEqual(['Summe: 7', 'Ende'])
      expect(engine.state.variables.has('summe')).toBe(false)
    })

    it('rechnet rekursiv mit eigenen Variablen je Aufruf', () => {
      const fakultaet: VSDocument = {
        caption: 'int fakultaet(int n)',
        elements: [branch('n <= 1', [stmt('return 1')], [call('int rest = fakultaet(n - 1)'), stmt('return n * rest')])],
      }
      const engine = run([stmt('input: int n "Zahl?"'), call('int f = fakultaet(n)'), stmt('print: f')], [fakultaet], ['5'])
      expect(engine.state.outputLines).toEqual(['120'])
    })

    it('meldet falsche Werte und fehlendes return', () => {
      const quadrat: VSDocument = { caption: 'int quadrat(int x)', elements: [stmt('int y = x * x')] }
      let engine = run([call('quadrat(1, 2)')], [quadrat])
      expect(engine.state.notice).toEqual({ kind: 'callArguments', text: 'quadrat' })
      engine = run([call('int q = quadrat(2)')], [quadrat])
      expect(engine.state.notice).toEqual({ kind: 'missingReturn', text: 'quadrat' })
      expect(engine.message).toBe('quadrat ended without returning a value with return.')
    })

    it('übergibt Zahlen als Kopie und Arrays als Referenz', () => {
      const verdopple: VSDocument = { caption: 'void verdopple(int x)', elements: [stmt('x = x * 2'), stmt('print: "innen: " + x')] }
      const leeren: VSDocument = {
        caption: 'void leeren(boolean[] reihe)',
        elements: [
          makeElement(ElementType.forSchleife, { textLines: ['int i = 0', 'i < reihe.length', 'i++'], loopBody: [stmt('reihe[i] = false')] }),
        ],
      }
      const engine = run(
        [
          stmt('int zahl = 5'),
          call('verdopple(zahl)'),
          stmt('print: "außen: " + zahl'),
          stmt('boolean[] saal = {true, false, true}'),
          call('leeren(saal)'),
          stmt('print: saal[0] + " " + saal[2]'),
        ],
        [verdopple, leeren],
      )
      expect(engine.state.outputLines).toEqual(['innen: 10', 'außen: 5', 'false false'])
      expect(engine.state.variables.has('reihe')).toBe(false)
      expect(engine.message).toBe('Simulation finished.')
    })

    it('gibt geänderte 2D-Arrays zurück und prüft den Array-Typ', () => {
      const verkaufe: VSDocument = { caption: 'void verkaufe(boolean[][] sitze, int r, int p)', elements: [stmt('sitze[r][p] = true')] }
      let engine = run([stmt('boolean[][] kino = new boolean[2][3]'), call('verkaufe(kino, 1, 2)'), stmt('print: kino[1][2]')], [verkaufe])
      expect(engine.state.outputLines).toEqual(['true'])
      engine = run([stmt('int[] zahlen = {1, 2}'), call('verkaufe(zahlen, 0, 0)')], [verkaufe])
      expect(engine.state.notice?.kind).toBe('invalidExpression')
    })

    it('beendet mit return im Hauptprogramm das Programm', () => {
      const engine = run([stmt('print: "a"'), stmt('return'), stmt('print: "b"')], [])
      expect(engine.state.outputLines).toEqual(['a'])
      expect(engine.message).toBe('Simulation finished.')
    })
  })

  it('bricht ab, wenn sich ein Unterprogramm selbst aufruft', () => {
    const self: VSDocument = { caption: 'rekursion', elements: [makeElement(ElementType.aufruf, { textLines: ['rekursion()'] })] }
    const engine = new SimulationEngine(self, () => self)
    for (let i = 0; i < 1000 && engine.canStep; i++) engine.step()
    expect(engine.state.isHalted).toBe(true)
    expect(engine.state.notice?.kind).toBe('callTooDeep')
  })
})

describe('Zweidimensionale Arrays und boolean-Arrays', () => {
  it('legt ein 2D-Array an, schreibt und liest Fächer und kennt beide Längen', () => {
    const state = runSimulation(
      doc([
        stmt('boolean[][] sitze = new boolean[3][4]'),
        stmt('sitze[1][2] = true'),
        stmt('int r = 2'),
        stmt('sitze[r][r + 1] = !sitze[1][2]'),
        stmt('int reihen = sitze.length'),
        stmt('int plaetze = sitze[0].length'),
        stmt('int[][] t = {{1, 2, 3}, {4, 5, 6}}'),
        stmt('t[1][0] = t[0][2] * 10'),
        stmt('output: sitze[1][2] + " " + t[1][0] + " " + t[1][2]'),
      ]),
    )
    expect(state.notice).toEqual({ kind: 'finished' })
    expect(state.variables.get('sitze')).toEqual({
      kind: 'grid',
      elementType: 'boolean',
      value: [
        [false, false, false, false],
        [false, false, true, false],
        [false, false, false, false],
      ],
    })
    expect(state.variables.get('reihen')).toEqual({ kind: 'int', value: 3 })
    expect(state.variables.get('plaetze')).toEqual({ kind: 'int', value: 4 })
    expect(state.variables.get('t')).toEqual({ kind: 'grid', elementType: 'int', value: [[1, 2, 3], [30, 5, 6]] })
    expect(state.outputLines).toEqual(['true 30 6'])
  })

  it('zählt freie Plätze mit verschachtelten Schleifen und boolean-Bedingung', () => {
    const state = runSimulation(
      doc([
        stmt('boolean[][] sitze = {{true, false}, {false, false}}'),
        stmt('int frei = 0'),
        makeElement(ElementType.forSchleife, {
          textLines: ['int r = 0', 'r < sitze.length', 'r++'],
          loopBody: [
            makeElement(ElementType.forSchleife, {
              textLines: ['int p = 0', 'p < sitze[r].length', 'p++'],
              loopBody: [
                makeElement(ElementType.verzweigung, {
                  textLines: ['!sitze[r][p]'],
                  cases: [
                    { name: 'true', elements: [stmt('frei = frei + 1')] },
                    { name: 'false', elements: [stmt('ø')] },
                  ],
                }),
              ],
            }),
          ],
        }),
      ]),
    )
    expect(state.notice).toEqual({ kind: 'finished' })
    expect(state.variables.get('frei')).toEqual({ kind: 'int', value: 3 })
  })

  it('kennt boolean-Arrays mit einer Dimension', () => {
    const state = runSimulation(doc([stmt('boolean[] an = new boolean[3]'), stmt('an[1] = true'), stmt('output: an[1] + " " + an[2]')]))
    expect(state.outputLines).toEqual(['true false'])
  })

  it('meldet Fächer außerhalb des 2D-Arrays', () => {
    const state = runSimulation(doc([stmt('int[][] t = new int[2][2]'), stmt('t[2][0] = 1')]))
    expect(state.notice?.kind).toBe('invalidExpression')
  })
})

describe('Zeichenketten', () => {
  it('kennt die wichtigsten String-Methoden', () => {
    const state = runSimulation(
      doc([
        stmt('String wort = "Ziegenbock"'),
        stmt('int n = wort.length()'),
        stmt('char erster = wort.charAt(0)'),
        stmt('char letzter = wort.charAt(wort.length() - 1)'),
        stmt('String teil = wort.substring(0, 6)'),
        stmt('String rest = wort.substring(6)'),
        stmt('int pos = wort.indexOf("bock")'),
        stmt('int fehlt = wort.indexOf("x")'),
        stmt('String gross = wort.toUpperCase()'),
        stmt('boolean hat = wort.contains("gen")'),
        stmt('String[] woerter = "Ludwig ist ein Geißbock".split(" ")'),
        stmt('output: woerter.length + " " + woerter[3] + " " + wort.substring(0, n - 4) + wort.charAt(1)'),
      ]),
    )
    expect(state.notice).toEqual({ kind: 'finished' })
    const v = (name: string) => state.variables.get(name)
    expect(v('n')).toEqual({ kind: 'int', value: 10 })
    expect(v('erster')).toEqual({ kind: 'string', value: 'Z' })
    expect(v('letzter')).toEqual({ kind: 'string', value: 'k' })
    expect(v('teil')).toEqual({ kind: 'string', value: 'Ziegen' })
    expect(v('rest')).toEqual({ kind: 'string', value: 'bock' })
    expect(v('pos')).toEqual({ kind: 'int', value: 6 })
    expect(v('fehlt')).toEqual({ kind: 'int', value: -1 })
    expect(v('gross')).toEqual({ kind: 'string', value: 'ZIEGENBOCK' })
    expect(v('hat')).toEqual({ kind: 'boolean', value: true })
    expect(state.outputLines).toEqual(['4 Geißbock Ziegeni'])
  })

  it('vergleicht Zeichen in einer Schleife', () => {
    const state = runSimulation(
      doc([
        stmt('String wort = "Kaffee"'),
        stmt('int anzahl = 0'),
        makeElement(ElementType.forSchleife, {
          textLines: ['int i = 0', 'i < wort.length()', 'i++'],
          loopBody: [
            makeElement(ElementType.verzweigung, {
              textLines: ["wort.charAt(i) == 'e'"],
              cases: [
                { name: 'true', elements: [stmt('anzahl = anzahl + 1')] },
                { name: 'false', elements: [stmt('ø')] },
              ],
            }),
          ],
        }),
      ]),
    )
    expect(state.notice).toEqual({ kind: 'finished' })
    expect(state.variables.get('anzahl')).toEqual({ kind: 'int', value: 2 })
  })

  it('meldet charAt außerhalb des Worts', () => {
    const state = runSimulation(doc([stmt('String w = "abc"'), stmt('char c = w.charAt(3)')]))
    expect(state.notice?.kind).toBe('invalidExpression')
  })
})
