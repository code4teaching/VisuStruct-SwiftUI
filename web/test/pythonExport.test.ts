import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'
import { generateCode } from '../src/core/codeGenerator'
import { sameOutput, usedElementTypes } from '../src/core/exerciseCheck'
import { ElementType } from '../src/core/model'
import { diagram, lessons, tasks } from '../src/learn/content'

// Jede Musterlösung als echtes Python ausführen: gleiche Ausgabe wie in der Simulation.

const python = spawnSync('python3', ['--version']).status === 0

/** Eingaben ohne Hinweistext lesen; `print("x: ")` direkt vor einem `input(` ist nur ein Hinweis. */
function runnable(code: string): string {
  const lines = code.split('\n')
  const kept = lines.filter((line, i) => !(/^\s*print\("[^"]*"\)$/.test(line) && lines[i + 1]?.includes('input(')))
  return 'import sys\ninput = lambda prompt="": sys.stdin.readline().rstrip("\\n")\n' + kept.join('\n') + '\n'
}

describe.skipIf(!python)('Python-Export', () => {
  it('jede Musterlösung läuft als Python mit derselben Ausgabe', () => {
    let checked = 0
    const blocks = [...lessons.flatMap((l) => l.steps.flatMap((s) => s.blocks)), ...tasks.flatMap((t) => t.blocks)]
    for (const block of blocks) {
      if (block.kind !== 'exercise' || !block.exercise.solution) continue
      const doc = diagram(block.exercise.solution)!
      // Ein Aufruf braucht ein Unterprogramm, das es im Export nicht gibt.
      if (usedElementTypes(doc).has(ElementType.aufruf)) continue
      const code = generateCode(doc, 'python')
      for (const test of block.exercise.tests) {
        const run = spawnSync('python3', ['-c', runnable(code)], { input: test.inputs.join('\n') + '\n', encoding: 'utf8' })
        const outputs = run.stdout.split('\n').slice(0, -1)
        const where = `${block.exercise.id} mit ${JSON.stringify(test.inputs)}\n${code}\n${run.stderr}`
        expect(run.status, where).toBe(0)
        expect(sameOutput(outputs, test.expected), `${where}\n${JSON.stringify(outputs)}`).toBe(true)
      }
      checked++
    }
    expect(checked).toBeGreaterThan(20)
  })
})
