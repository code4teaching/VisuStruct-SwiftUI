import { describe, expect, it } from 'vitest'
import {
  addPackage,
  classFileText,
  exampleProject,
  moveFile,
  packageOf,
  packagesOf,
  projectClasses,
  projectFromFiles,
  projectFromJSON,
  projectToJSON,
  removeFile,
  removePackage,
  renamePackage,
  withPackageLine,
} from '../src/core/javaProject'
import { projectFromZip, projectToZip } from '../src/ui/projectZip'

describe('javaProject', () => {
  it('liest Packages aus Pfaden', () => {
    expect(packageOf('tiere/haus/Hund.java')).toBe('tiere.haus')
    expect(packageOf('Main.java')).toBe('')
    expect(packagesOf(exampleProject())).toEqual(['personen', 'tiere'])
  })

  it('zeigt das Standard-Package nur mit Dateien und leere Packages auch', () => {
    let p = addPackage({ name: 'P', files: [], packages: [] }, 'leer')
    expect(packagesOf(p)).toEqual(['leer'])
    p = { ...p, files: [{ path: 'Main.java', text: 'public class Main {}' }] }
    expect(packagesOf(p)).toEqual(['leer', ''])
  })

  it('setzt, ändert und entfernt die package-Zeile', () => {
    expect(withPackageLine('public class A {}\n', 'x')).toBe('package x;\n\npublic class A {}\n')
    expect(withPackageLine('package x;\n\npublic class A {}\n', 'y.z')).toBe('package y.z;\n\npublic class A {}\n')
    expect(withPackageLine('// Kopf\npackage x;\n\npublic class A {}\n', '')).toBe('// Kopf\npublic class A {}\n')
    expect(classFileText('tiere', 'Katze', 'class')).toBe('package tiere;\n\npublic class Katze {\n}\n')
  })

  it('kennt alle Klassen mit Datei und Package', () => {
    const classes = projectClasses(exampleProject())
    expect(classes.map((c) => `${c.pkg}.${c.name}`).sort()).toEqual(['personen.Besitzer', 'tiere.Hund', 'tiere.Tier'])
    expect(classes.find((c) => c.name === 'Hund')?.superclass).toBe('Tier')
  })

  it('verschiebt Dateien und benennt Packages um', () => {
    let p = moveFile(exampleProject(), 'tiere/Hund.java', 'haustiere/Hund.java')
    expect(p.files.find((f) => f.path === 'haustiere/Hund.java')?.text.startsWith('package haustiere;')).toBe(true)
    p = renamePackage(p, 'tiere', 'zoo.tiere')
    expect(p.files.find((f) => f.path === 'zoo/tiere/Tier.java')?.text.startsWith('package zoo.tiere;')).toBe(true)
  })

  it('behält ein Package nach dem Löschen der letzten Datei', () => {
    let p = removeFile(exampleProject(), 'personen/Besitzer.java')
    expect(packagesOf(p)).toContain('personen')
    p = removePackage(p, 'personen')
    expect(packagesOf(p)).toEqual(['tiere'])
  })

  it('macht aus einzelnen Dateien ein Projekt', () => {
    const p = projectFromFiles('P', [{ name: 'code.txt', text: 'package a.b;\r\npublic class X {}' }])
    expect(p.files).toEqual([{ path: 'a/b/X.java', text: 'package a.b;\npublic class X {}' }])
  })

  it('speichert als JSON und als ZIP', () => {
    const p = addPackage(exampleProject(), 'leer')
    expect(projectFromJSON(projectToJSON(p))).toEqual(p)
    expect(projectFromJSON('kaputt')).toBeUndefined()
    const back = projectFromZip(projectToZip(p), 'X')
    expect(back.name).toBe('Zoo')
    expect(back.files.map((f) => f.path).sort()).toEqual(p.files.map((f) => f.path).sort())
    expect(back.files.find((f) => f.path === 'tiere/Hund.java')?.text).toBe(p.files[1].text)
  })
})
