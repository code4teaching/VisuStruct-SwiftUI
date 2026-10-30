import { describe, expect, it } from 'vitest'
import { parseClasses } from '../src/core/classModel'
import { freeObjectName, isA, linkedValue, objectFields, refNames } from '../src/core/objectModel'

const classes = parseClasses(`class Person { private String name; static int anzahl; }
class Spieler extends Person { private int punkte; private Team team; private ArrayList<Spieler> freunde; }
class Team { }`)

describe('Objektdiagramm', () => {
  it('Attribute samt Oberklasse, ohne static', () => {
    expect(objectFields(classes, 'Spieler').map((f) => `${f.name}:${f.target ?? ''}:${f.many}`)).toEqual(['name::false', 'punkte::false', 'team:Team:false', 'freunde:Spieler:true'])
  })
  it('Referenzen lesen und verbinden', () => {
    expect(refNames('[s1, s2]')).toEqual(['s1', 's2'])
    expect(refNames('null')).toEqual([])
    const [, , team, freunde] = objectFields(classes, 'Spieler')
    expect(linkedValue(team, 'null', 't1')).toBe('t1')
    expect(linkedValue(freunde, '[s1]', 's2')).toBe('[s1, s2]')
    expect(linkedValue(freunde, '[s1]', 's1')).toBe('[s1]')
  })
  it('Vererbung und Namen', () => {
    expect(isA(classes, 'Spieler', 'Person')).toBe(true)
    expect(isA(classes, 'Team', 'Person')).toBe(false)
    expect(freeObjectName('Spieler', ['spieler1'])).toBe('spieler2')
  })
})
