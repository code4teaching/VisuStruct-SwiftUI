import { describe, expect, it } from 'vitest'
import { exampleProject } from '../src/core/javaProject'
import { freeProjectName, listProjects, readProject, writeProject } from '../src/ui/objectWorkspace'
import type { WsDir, WsEntry } from '../src/ui/workspaceStore'

/** Ordner im Speicher: Pfad → Text, Ordner enden auf `/`. */
class MemDir implements WsDir {
  constructor(
    readonly name: string,
    private files: Map<string, string>,
    private path = '',
  ) {}
  async list(): Promise<WsEntry[]> {
    const seen = new Map<string, WsEntry>()
    for (const key of this.files.keys()) {
      if (!key.startsWith(this.path) || key === this.path) continue
      const rest = key.slice(this.path.length)
      const slash = rest.indexOf('/')
      const name = slash < 0 ? rest : rest.slice(0, slash)
      if (!name.startsWith('.') && !seen.has(name)) seen.set(name, { kind: slash < 0 ? 'file' : 'directory', name })
    }
    return [...seen.values()]
  }
  async dir(name: string, create = false): Promise<WsDir> {
    const key = `${this.path}${name}/`
    if (![...this.files.keys()].some((k) => k.startsWith(key))) {
      if (!create) throw new Error('missing')
      this.files.set(key, '')
    }
    return new MemDir(name, this.files, key)
  }
  async read(name: string) {
    const text = this.files.get(this.path + name)
    if (text === undefined) throw new Error('missing')
    return text
  }
  async write(name: string, text: string) {
    this.files.set(this.path + name, text)
  }
  async has(name: string) {
    return [...this.files.keys()].some((k) => k === this.path + name || k.startsWith(`${this.path}${name}/`))
  }
  async remove(name: string) {
    for (const k of [...this.files.keys()]) if (k === this.path + name || k.startsWith(`${this.path}${name}/`)) this.files.delete(k)
  }
}

describe('objectWorkspace', () => {
  it('schreibt ein Projekt wie Eclipse und liest es wieder', async () => {
    const files = new Map<string, string>()
    const root = new MemDir('VisuObject-Workspace', files)
    const zoo = { ...exampleProject(), packages: ['leer'] }
    await writeProject(root, 'Zoo', zoo, { Hund: { x: 10, y: 20 } })
    expect(files.has('Zoo/src/tiere/Hund.java')).toBe(true)
    expect(files.has('Zoo/.project')).toBe(true)
    expect(files.get('Zoo/.classpath')).toContain('kind="src" path="src"')
    expect(await listProjects(root)).toEqual(['Zoo'])
    const back = await readProject(root, 'Zoo')
    expect(back.project.files.map((f) => f.path).sort()).toEqual(zoo.files.map((f) => f.path).sort())
    expect(back.project.packages).toEqual(['leer'])
    expect(back.project.uml).toEqual(zoo.uml)
    expect(back.positions).toEqual({ Hund: { x: 10, y: 20 } })
  })

  it('räumt gelöschte Dateien und Packages weg, lässt bin stehen', async () => {
    const files = new Map<string, string>()
    const root = new MemDir('ws', files)
    const zoo = exampleProject()
    await writeProject(root, 'Zoo', zoo, {})
    files.set('Zoo/bin/tiere/Hund.class', 'x')
    await writeProject(root, 'Zoo', { ...zoo, files: zoo.files.filter((f) => !f.path.startsWith('personen/')) }, {})
    expect([...files.keys()].some((k) => k.startsWith('Zoo/src/personen'))).toBe(false)
    expect(files.has('Zoo/bin/tiere/Hund.class')).toBe(true)
  })

  it('findet freie Namen', () => {
    expect(freeProjectName('MeinProjekt', ['meinprojekt', 'MeinProjekt2'])).toBe('MeinProjekt3')
  })
})
