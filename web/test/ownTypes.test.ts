import { describe, expect, it } from 'vitest'
import { parseClasses } from '../src/core/classModel'
import { memberCompletionsAt } from '../src/core/javaMembers'
import { ownTypes } from '../src/core/ownTypes'

const spieler = `package spiel;
public class Spieler extends Person {
    private int punkte;
    public String name;
    int level;
    protected boolean aktiv;
    public static int anzahl;
    public Spieler() {}
    public int getPunkte() { return punkte; }
    public void setPunkte(int punkte) { this.punkte = punkte; }
    private void geheim() {}
    public static Spieler neu() { return new Spieler(); }
}`
const person = `package spiel;
public class Person {
    public String getVorname() { return ""; }
}`
const fenster = `package gui;
public class Fenster extends JFrame {
}`

const types = [...parseClasses(spieler).map((c) => ({ ...c, pkg: 'spiel' })), ...parseClasses(person).map((c) => ({ ...c, pkg: 'spiel' })), ...parseClasses(fenster).map((c) => ({ ...c, pkg: 'gui' }))]
const names = (code: string, place: { cls?: string; pkg: string }) => memberCompletionsAt(code, code.length, 'de', ownTypes(types, place))?.members.map((m) => m.name)

describe('Vorschläge nach dem Punkt für eigene Klassen', () => {
  it('zeigt Methoden und sichtbare Attribute samt Oberklasse', () => {
    const code = 'Spieler s1 = new Spieler();\ns1.'
    expect(names(code, { cls: 'Main', pkg: 'spiel' })).toEqual(['name', 'level', 'aktiv', 'getPunkte', 'setPunkte', 'getVorname'])
    // Anderes Package: nur public.
    expect(names(code, { cls: 'Main', pkg: 'app' })).toEqual(['name', 'getPunkte', 'setPunkte', 'getVorname'])
  })
  it('this. zeigt auch private, Klasse. die static-Mitglieder', () => {
    expect(names('this.', { cls: 'Spieler', pkg: 'spiel' })).toContain('geheim')
    expect(names('Spieler.', { cls: 'Main', pkg: 'app' })).toEqual(['anzahl', 'neu'])
    // private wird nicht vererbt: in Person ist punkte über einen Spieler nicht erreichbar.
    expect(names('Spieler s = null;\ns.', { cls: 'Person', pkg: 'spiel' })).not.toContain('punkte')
  })
  it('folgt Ketten und Standard-Oberklassen', () => {
    expect(names('Spieler s = null;\ns.name.', { pkg: 'app' })).toContain('length')
    expect(names('Fenster f = new Fenster();\nf.', { pkg: 'app' })).toContain('setVisible')
  })
})
