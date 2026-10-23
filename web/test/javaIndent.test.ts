import { describe, expect, it } from 'vitest'
import { indentJava } from '../src/core/javaIndent'

const flat = (code: string) => code.split('\n').map((l) => l.trim()).join('\n')

describe('Einrücken', () => {
  it('Blöcke, switch, try/catch und Lambda wie in Eclipse', () => {
    const code = `public class A {
    public static void main(String[] args) {
        int x = 3; // Kommentar mit {
        if (x > 2) {
            System.out.println("a { b");
        } else {
            System.out.println("b");
        }
        switch (x) {
            case 1 -> {
                System.out.println("1");
            }
            default -> {
                x++;
            }
        }
        switch (x) {
            case 1:
                x = 2;
                break;
            default:
                x = 0;
        }
        try {
            x = 1 / x;
        } catch (ArithmeticException e) {
            x = 0;
        }
        button.addActionListener(e -> {
            x++;
        });
        /*
         * Blockkommentar
         */
    }
}`
    expect(indentJava(flat(code))).toBe(code)
  })

  it('Pseudocode und halbfertiger Code', () => {
    expect(indentJava('if (Alter über 18?) {\nSystem.out.println("Erwachsen");\n} else {\n  x\n}')).toBe(
      'if (Alter über 18?) {\n    System.out.println("Erwachsen");\n} else {\n    x\n}',
    )
    expect(indentJava('while (x > 0) {\nx--;')).toBe('while (x > 0) {\n    x--;')
    expect(indentJava('}\n}\nx++;')).toBe('}\n}\nx++;')
  })

  it('nur die angegebenen Zeilen', () => {
    expect(indentJava('if (a) {\nb();\nc();\n}', 3, 3)).toBe('if (a) {\nb();\n    c();\n}')
  })
})
