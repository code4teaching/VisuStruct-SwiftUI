import { describe, expect, it } from 'vitest'
import { exampleProject, notesFromJSON, projectFromJSON, projectToJSON } from '../src/core/javaProject'
import { projectFromZip, projectToZip } from '../src/ui/projectZip'

describe('Notizen im Klassendiagramm', () => {
  const notes = [{ id: 'n1', text: 'Oberklasse\naller Tiere', x: 300, y: 40, attach: ['Tier'] }]
  it('bleiben beim Speichern als JSON und ZIP erhalten', () => {
    const project = { ...exampleProject(), notes }
    expect(projectFromJSON(projectToJSON(project))?.notes).toEqual(notes)
    expect(projectFromZip(projectToZip(project), 'x').notes).toEqual(notes)
  })
  it('lässt kaputte Einträge weg', () => {
    expect(notesFromJSON([{ id: 'a', text: 'ok', x: 1, y: 2 }, { id: 'b' }, null, 'x'])).toEqual([{ id: 'a', text: 'ok', x: 1, y: 2 }])
    expect(notesFromJSON({})).toBeUndefined()
  })
})
