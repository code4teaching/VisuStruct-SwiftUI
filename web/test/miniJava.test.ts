import { describe, expect, it } from 'vitest'
import { MiniJava, MiniJavaError, formatDouble } from '../src/core/miniJava'

function run(files: Record<string, string> | string, input: string[] = []) {
  const list = typeof files === 'string' ? [{ path: 'Main.java', source: files }] : Object.entries(files).map(([path, source]) => ({ path, source }))
  let out = ''
  const vm = new MiniJava(list, { out: (t) => (out += t) })
  vm.start()
  vm.go('run')
  for (let guard = 0; guard < 1000; guard++) {
    const s = vm.run(new Set(), 100000)
    if (s.k === 'input') vm.input(input.length ? input.shift()! : null)
    else if (s.k === 'sleep' || s.k === 'running') continue
    else if (s.k === 'exception') return out + s.text
    else if (s.k === 'error') throw s.error
    else return out
  }
  throw new Error('läuft zu lange')
}

const main = (body: string, extra = '') => `public class Main {\n${extra}\npublic static void main(String[] args) {\n${body}\n}\n}`

describe('miniJava', () => {
  it('rechnet wie Java', () => {
    expect(run(main('System.out.println(7 / 2); System.out.println(7 / 2.0); System.out.println(7 % 3); System.out.println(1 + 2 + "x" + 1 + 2);'))).toBe('3\n3.5\n1\n3x12\n')
    expect(run(main("double d = 5; System.out.println(d); int i = (int) 3.9; System.out.println(i); char c = 'A'; c++; System.out.println(c); System.out.println(c + 1);"))).toBe('5.0\n3\nB\n67\n')
    expect(run(main('System.out.println(Integer.MAX_VALUE + 1); System.out.println(0.1 + 0.2); System.out.println(1e7);'))).toBe('-2147483648\n0.30000000000000004\n1.0E7\n')
    expect(run(main('int x = 5; x += 2.7; System.out.println(x); String s = "a"; s += 1; System.out.println(s);'))).toBe('7\na1\n')
  })

  it('Schleifen, switch, Arrays', () => {
    const src = 'import java.util.Arrays;\n' + main(`
      int summe = 0;
      for (int i = 1; i <= 10; i++) { if (i % 2 == 0) continue; summe += i; }
      System.out.println(summe);
      int[] a = {3, 1, 2};
      Arrays.sort(a);
      System.out.println(Arrays.toString(a) + " " + a.length);
      int[][] g = new int[2][3];
      g[1][2] = 4;
      System.out.println(g[1][2] + g[0][0]);
      String tag = "Mo";
      switch (tag) { case "Mo": System.out.println("Montag"); case "Di": System.out.println("weiter"); break; default: System.out.println("nein"); }
      int k = 0; while (true) { k++; if (k > 3) break; } System.out.println(k);
      do { k--; } while (k > 0); System.out.println(k);
    `)
    expect(run(src)).toBe('25\n[1, 2, 3] 3\n4\nMontag\nweiter\n4\n0\n')
  })

  it('Klassen, Konstruktoren, Vererbung, toString', () => {
    const files = {
      'Tier.java': `public abstract class Tier {
        private String name;
        protected int beine = 4;
        public Tier(String name) { this.name = name; }
        public String getName() { return name; }
        public abstract String laut();
        public String toString() { return name + " sagt " + laut(); }
      }`,
      'Hund.java': `public class Hund extends Tier {
        public Hund(String name) { super(name); }
        public String laut() { return "Wuff"; }
      }`,
      'Vogel.java': `public class Vogel extends Tier {
        public Vogel() { this("Piepmatz"); beine = 2; }
        public Vogel(String n) { super(n); }
        @Override public String laut() { return "Piep"; }
        public String toString() { return super.toString() + " (" + beine + " Beine)"; }
      }`,
      'Main.java': `import java.util.ArrayList;
        public class Main {
          static int zaehler = 0;
          public static void main(String[] args) {
            ArrayList<Tier> tiere = new ArrayList<>();
            tiere.add(new Hund("Bello"));
            tiere.add(new Vogel());
            for (Tier t : tiere) { System.out.println(t); zaehler++; }
            System.out.println(zaehler + " " + tiere.size() + " " + (tiere.get(0) instanceof Hund));
            Tier t = tiere.get(1);
            Vogel v = (Vogel) t;
            System.out.println(v.getName());
          }
        }`,
    }
    expect(run(files)).toBe('Bello sagt Wuff\nPiepmatz sagt Piep (2 Beine)\n2 2 true\nPiepmatz\n')
  })

  it('Exceptions mit try/catch/finally und ungefangen', () => {
    const src = main(`
      try { int x = 5 / 0; } catch (ArithmeticException e) { System.out.println("Fehler: " + e.getMessage()); } finally { System.out.println("fertig"); }
      try { throw new KontoException("leer"); } catch (Exception e) { System.out.println(e.getMessage()); }
      int[] a = new int[2];
      a[2] = 1;
    `)
    const files = { 'Main.java': src, 'KontoException.java': 'public class KontoException extends Exception { public KontoException(String m) { super(m); } }' }
    expect(run(files)).toBe('Fehler: / by zero\nfertig\nleer\nException in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 2 out of bounds for length 2\n\tat Main.main(Main.java:8)')
  })

  it('Scanner mit nextInt und nextLine wie in Java', () => {
    const src = `import java.util.Scanner;
      public class Main { public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Zahl: ");
        int z = sc.nextInt();
        String rest = sc.nextLine();
        String name = sc.nextLine();
        double d = sc.nextDouble();
        System.out.println(z * 2 + "|" + rest + "|" + name + "|" + d);
      } }`
    expect(run(src, ['21', 'Anna Lena', '2,5'])).toBe('Zahl: 42||Anna Lena|2.5\n')
  })

  it('printf und String-Methoden', () => {
    expect(
      run(main('System.out.printf("%5.2f|%-4d|%s%n", 3.14159, 7, "x"); String s = "Hallo"; System.out.println(s.charAt(1) + s.substring(2).toUpperCase() + s.indexOf("l") + s.equals("Hallo"));')),
    ).toBe(' 3,14|7   |x\naLLO2true\n')
  })

  it('statische Methoden, Rekursion, enum', () => {
    const src = `public class Main {
      enum Farbe { ROT, GRUEN }
      static int fak(int n) { return n <= 1 ? 1 : n * fak(n - 1); }
      public static void main(String[] args) {
        System.out.println(fak(5));
        Farbe f = Farbe.GRUEN;
        switch (f) { case ROT: System.out.println("r"); break; case GRUEN: System.out.println("g"); break; }
        System.out.println(f + " " + f.ordinal());
      }
    }`
    expect(() => run(src)).toThrow(MiniJavaError) // innere Klassen kann der Debugger nicht
    const files = { 'Farbe.java': 'public enum Farbe { ROT, GRUEN }', 'Main.java': src.replace('enum Farbe { ROT, GRUEN }', '') }
    expect(run(files)).toBe('120\ng\nGRUEN 1\n')
  })

  it('meldet Endlosrekursion als StackOverflowError', () => {
    expect(run(main('f();', 'static void f() { f(); }'))).toMatch(/^Exception in thread "main" java.lang.StackOverflowError/)
  })

  it('hält an Haltepunkten und geht Schritt für Schritt', () => {
    const src = `public class Main {
  public static void main(String[] args) {
    Konto k = new Konto();
    k.einzahlen(5);
    k.einzahlen(7);
    System.out.println(k.stand);
  }
}`
    const konto = `public class Konto {
  int stand;
  void einzahlen(int b) {
    stand = stand + b;
  }
}`
    let out = ''
    const vm = new MiniJava(
      [
        { path: 'Main.java', source: src },
        { path: 'Konto.java', source: konto },
      ],
      { out: (t) => (out += t) },
    )
    vm.start()
    vm.go('run')
    const bp = new Set(['Konto.java:3'])
    let s = vm.run(bp)
    expect(s).toEqual({ k: 'paused', pos: { file: 'Konto.java', line: 3 } })
    let stack = vm.stack()
    expect(stack.map((f) => f.title)).toEqual(['Konto.einzahlen()', 'Main.main()'])
    expect(stack[0].vars).toEqual([
      { name: 'this', type: 'Konto', value: 'k', ref: expect.any(Number) },
      { name: 'b', type: 'int', value: '5' },
    ])
    expect(vm.heap()).toEqual([{ id: expect.any(Number), name: 'k', cls: 'Konto', fields: [{ name: 'stand', type: 'int', value: '0' }] }])
    // Schritt: schließende Klammer der Methode, dann zurück in main
    vm.go('into')
    expect(vm.run(bp)).toEqual({ k: 'paused', pos: { file: 'Konto.java', line: 4 } })
    expect(vm.heap()[0].fields[0].value).toBe('5')
    vm.go('out')
    expect(vm.run(bp)).toEqual({ k: 'paused', pos: { file: 'Main.java', line: 4 } })
    vm.go('over')
    // Ein Haltepunkt in der Methode hält auch beim Überspringen an (wie in Eclipse).
    expect(vm.run(bp)).toEqual({ k: 'paused', pos: { file: 'Konto.java', line: 3 } })
    vm.go('out')
    expect(vm.run(bp)).toEqual({ k: 'paused', pos: { file: 'Main.java', line: 5 } })
    expect(vm.heap()[0].fields[0].value).toBe('12')
    vm.go('run')
    s = vm.run(bp)
    expect(s.k).toBe('done')
    expect(out).toBe('12\n')
    stack = vm.stack()
    expect(stack).toEqual([])
  })

  it('benennt Objekte nach Variablen und Attributen', () => {
    const src = `import java.util.ArrayList;
public class Main {
  public static void main(String[] args) {
    Team t = new Team();
    t.add(new Spieler("Anna"));
    t.add(new Spieler("Ben"));
    Spieler s1 = t.liste.get(0);
    System.out.println(s1);
  }
}
class Team { ArrayList<Spieler> liste = new ArrayList<>(); Spieler kapitaen; void add(Spieler s) { liste.add(s); kapitaen = s; } }
class Spieler { String name; Spieler(String n) { name = n; } public String toString() { return name; } }`
    const vm = new MiniJava([{ path: 'Main.java', source: src }], { out: () => {} })
    vm.start()
    vm.go('run')
    expect(vm.run(new Set(['Main.java:6']))).toMatchObject({ k: 'paused' })
    const heap = vm.heap()
    expect(heap.map((o) => `${o.name}:${o.cls}`)).toEqual(['t:Team', 'spieler:Spieler', 'kapitaen:Spieler'])
    expect(heap[0].fields).toEqual([
      { name: 'liste', type: 'ArrayList<Spieler>', value: '[spieler, kapitaen]' },
      { name: 'kapitaen', type: 'Spieler', value: 'kapitaen' },
    ])
    expect(heap[1].fields).toEqual([{ name: 'name', type: 'String', value: '"Anna"' }])
  })

  it('formatiert Kommazahlen wie Java', () => {
    expect([1, 0.5, 100, 1e-4, 12345678.9, -2].map(formatDouble)).toEqual(['1.0', '0.5', '100.0', '1.0E-4', '1.23456789E7', '-2.0'])
  })

  it('schneidet Aufrufe für das Sequenzdiagramm mit', () => {
    const src = `public class Main {
  public static void main(String[] args) {
    Team t = new Team();
    Spieler s1 = new Spieler("Anna");
    t.aufnehmen(s1);
    System.out.println(t.anzahl());
  }
}
class Team { int n; void aufnehmen(Spieler s) { n++; s.begruessen(); } int anzahl() { return n; } }
class Spieler { String name; Spieler(String n) { name = n; } void begruessen() { } }`
    const vm = new MiniJava([{ path: 'Main.java', source: src }], { out: () => {} })
    vm.start()
    vm.go('run')
    expect(vm.run(new Set()).k).toBe('done')
    const { participants, events } = vm.sequence()
    expect(participants.map((p) => p.label)).toEqual(['Main', 't : Team', 's1 : Spieler'])
    const key = Object.fromEntries(participants.map((p) => [p.key, p.label]))
    expect(events.map((e) => (e.k === 'return' ? `return ${e.label}${e.hidden ? ' (hidden)' : ''}` : `${key[e.from]} -> ${key[e.to]}: ${e.label}`))).toEqual([
      'Main -> t : Team: new Team()',
      'return  (hidden)',
      'Main -> s1 : Spieler: new Spieler("Anna")',
      'return  (hidden)',
      'Main -> t : Team: aufnehmen(s1)',
      't : Team -> s1 : Spieler: begruessen()',
      'return ',
      'return ',
      'Main -> t : Team: anzahl()',
      'return 1',
    ])
  })

  it('Scanner ohne Import ist wie bei javac ein Fehler', () => {
    const body = 'Scanner eingabe = new Scanner(System.in); System.out.println(eingabe.next());'
    let err: unknown
    try {
      run(main(body), ['Hallo'])
    } catch (e) {
      err = e
    }
    expect(err).toBeInstanceOf(MiniJavaError)
    expect((err as MiniJavaError).code).toBe('import')
    expect((err as MiniJavaError).detail).toBe('import java.util.Scanner;')
    expect(run('import java.util.Scanner;\n' + main(body), ['Hallo'])).toBe('Hallo\n')
    expect(run('import java.util.*;\n' + main(body), ['Hallo'])).toBe('Hallo\n')
  })
})
