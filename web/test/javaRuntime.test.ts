import { describe, expect, it } from 'vitest'
import { asProgram, mainClassName } from '../src/ui/javaRuntime'

describe('Java mit CheerpJ', () => {
  it('nimmt die öffentliche Klasse als Startklasse', () => {
    expect(mainClassName('class Hilfe {}\npublic class Zaehler { }')).toBe('Zaehler')
    expect(mainClassName('class Main { }')).toBe('Main')
  })

  it('packt Code ohne Klasse in public class Main', () => {
    const snippet = asProgram('System.out.println("Hallo");')
    expect(snippet).toContain('public class Main {')
    expect(snippet).toContain('public static void main(String[] args) {\nSystem.out.println("Hallo");')
    const withMain = asProgram('public static void main(String[] args) {\n}')
    expect(withMain.match(/static void main/g)).toHaveLength(1)
    expect(mainClassName(withMain)).toBe('Main')
    expect(asProgram('public class A {}')).toBe('public class A {}')
    // Getippter Import kommt vor die Klasse, nicht in main.
    const imported = asProgram('import java.util.Scanner;\nScanner s = new Scanner(System.in);')
    expect(imported.startsWith('import java.util.Scanner;\n')).toBe(true)
    expect(imported.split('public class Main')[1]).not.toContain('import')
  })
})
