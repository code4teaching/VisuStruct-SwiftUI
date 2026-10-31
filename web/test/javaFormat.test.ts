import { describe, expect, it } from 'vitest'
import { formatJava } from '../src/core/javaFormat'

describe('Formatieren', () => {
  it('schließende Klammern auf eigener Zeile, Leerzeichen um Operatoren (Beispiel von Holger)', () => {
    const code = `import java.util.Scanner;
Scanner scanner = new Scanner(System.in);
int punkte = scanner.nextInt();
if (punkte>=50) {
    System.out.println("Bestanden");} else {
    System.out.println("Nicht bestanden");}`
    expect(formatJava(code)).toBe(`import java.util.Scanner;
Scanner scanner = new Scanner(System.in);
int punkte = scanner.nextInt();
if (punkte >= 50) {
    System.out.println("Bestanden");
} else {
    System.out.println("Nicht bestanden");
}`)
  })

  it('Klassen, Schleifen, try/catch, Lambda, Generics und Array-Initialisierer', () => {
    const code = `public class A{
public static void main(String[] args){
int[] a={1,2,3}; int x=-1; double d=(double) -x*2;
for(int i=0;i<a.length;i++){x+=a[i];}
List<String> l=new ArrayList<>(); Map<String, List<Integer>> m = new HashMap<>();
do{x--;}while(x>0);
try{x=1/x;}catch(Exception e){x=0;}finally{x++;}
button.addActionListener(e->{x++;});
if(x<5&&!b){y=x>3?1:0;}else if(x==2) {return;}
for (int z:a) {}
switch(x){case 1->{x=2;} default->x=3;}
String s="a{b}x>=1"+x; // Kommentar {x=1;}
}
}`
    expect(formatJava(code)).toBe(`public class A {
    public static void main(String[] args) {
        int[] a = {1, 2, 3};
        int x = -1;
        double d = (double) -x * 2;
        for (int i = 0; i < a.length; i++) {
            x += a[i];
        }
        List<String> l = new ArrayList<>();
        Map<String, List<Integer>> m = new HashMap<>();
        do {
            x--;
        } while (x > 0);
        try {
            x = 1 / x;
        } catch (Exception e) {
            x = 0;
        } finally {
            x++;
        }
        button.addActionListener(e -> {
            x++;
        });
        if (x < 5 && !b) {
            y = x > 3 ? 1 : 0;
        } else if (x == 2) {
            return;
        }
        for (int z : a) {}
        switch (x) {
            case 1 -> {
                x = 2;
            }
            default -> x = 3;
        }
        String s = "a{b}x>=1" + x; // Kommentar {x=1;}
    }
}`)
  })

  it('gut formatierter Code bleibt, wie er ist', () => {
    const code = `import java.util.*;

public class Main {
    public static void main(String[] args) {
        switch (x) {
            case 1:
                x = 2;
                break;
            default:
                x = 0;
        }
        /*
         * Blockkommentar
         */
        if (Alter über 18?) {
            System.out.println("Erwachsen");
        }
    }
}`
    expect(formatJava(code)).toBe(code)
  })

  it('nur die angegebenen Zeilen', () => {
    expect(formatJava('if (a) {b();}\nif (c) {d();}', 2, 2)).toBe('if (a) {b();}\nif (c) {\n    d();\n}')
  })
})
