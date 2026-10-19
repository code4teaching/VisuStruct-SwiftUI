import { ElementType, isLoop, isMultiway, makeElement, type VSDocument, type VSElement } from './model'

/**
 * Port der benötigten Teile von `VisuStructDocumentEditing.swift`.
 * Pfade wie dort: Wurzelindex, dann je Schleife `0, i` bzw. je Verzweigung/Fallauswahl `fall, i`.
 * Alle Funktionen sind rein (das Dokument wird nicht verändert).
 */
export class EditError extends Error {}

const clone = <T>(v: T): T => structuredClone(v)

export function placeholderElement(): VSElement {
  return makeElement(ElementType.anweisung, { textLines: ['ø'] })
}

export function newEmptyDocument(): VSDocument {
  return { caption: '', elements: [placeholderElement()] }
}

export function isPlaceholderElement(el: VSElement): boolean {
  if (el.type === ElementType.leerElement) return true
  if (el.type === ElementType.anweisung) {
    const t = el.textLines
    return t.length === 0 || (t.length === 1 && t[0] === 'ø')
  }
  return false
}

export function isPlaceholderSlot(doc: VSDocument, path: number[]): boolean {
  const el = tryElementAt(doc, path)
  return el !== undefined && isPlaceholderElement(el)
}

/** Die Liste, in der das Element am Pfad steht, plus sein Index darin. */
function locate(elements: VSElement[], path: number[]): { list: VSElement[]; index: number } {
  if (path.length === 0) throw new EditError('Invalid element path.')
  const [i, ...rest] = path
  if (i < 0 || i >= elements.length) throw new EditError('Invalid element path.')
  if (rest.length === 0) return { list: elements, index: i }
  const [head, ...tail] = rest
  if (tail.length === 0) throw new EditError('Invalid element path.')
  return locate(childList(elements[i], head), tail)
}

/** Kindliste eines Containers: Schleifenrumpf (`head` = 0) bzw. Fall `head`. */
function childList(el: VSElement, head: number): VSElement[] {
  if (isLoop(el.type)) {
    if (head !== 0 || !el.loopBody) throw new EditError('Invalid element path.')
    return el.loopBody
  }
  if (isMultiway(el.type)) {
    if (!el.cases || head < 0 || head >= el.cases.length) throw new EditError('Invalid element path.')
    return el.cases[head].elements
  }
  throw new EditError('Invalid element path.')
}

export function elementAt(doc: VSDocument, path: number[]): VSElement {
  const { list, index } = locate(doc.elements, path)
  return list[index]
}

export function tryElementAt(doc: VSDocument, path: number[]): VSElement | undefined {
  try {
    return elementAt(doc, path)
  } catch {
    return undefined
  }
}

export function replaceAtPath(doc: VSDocument, path: number[], element: VSElement): VSDocument {
  const d = clone(doc)
  const { list, index } = locate(d.elements, path)
  list[index] = clone(element)
  return d
}

export function setTextLines(doc: VSDocument, path: number[], lines: string[]): VSDocument {
  const el = clone(elementAt(doc, path))
  el.textLines = lines.length === 0 ? [''] : lines
  return replaceAtPath(doc, path, el)
}

export function canDeleteElement(doc: VSDocument, path: number[]): boolean {
  if (path.length === 0) return false
  if (path.length === 1 && doc.elements.length === 1) return !isPlaceholderSlot(doc, path)
  return tryElementAt(doc, path) !== undefined
}

export function deleteAtPath(doc: VSDocument, path: number[]): VSDocument {
  const d = clone(doc)
  const { list, index } = locate(d.elements, path)
  if (path.length === 1 && list.length === 1) {
    // Letztes Wurzelelement: durch Platzhalter ersetzen; der Platzhalter selbst bleibt.
    if (isPlaceholderElement(list[0])) throw new EditError('The last root element cannot be deleted.')
    list[0] = placeholderElement()
    return d
  }
  list.splice(index, 1)
  // Leere Schleifenrümpfe/Fälle bekommen wieder einen Platzhalter (wie Swift).
  if (path.length > 1 && list.length === 0) list.push(placeholderElement())
  return d
}

/** Einfügen in die Kindliste unter `parentPath` (`[]` = Wurzel, sonst Container-Pfad + Rumpf/Fall-Index). */
export function insertAt(doc: VSDocument, parentPath: number[], index: number, element: VSElement): VSDocument {
  const d = clone(doc)
  let list: VSElement[]
  if (parentPath.length === 0) {
    list = d.elements
  } else {
    const container = parentPath.slice(0, -1)
    const head = parentPath[parentPath.length - 1]
    const { list: l, index: i } = locate(d.elements, container)
    list = childList(l[i], head)
  }
  list.splice(Math.min(Math.max(0, index), list.length), 0, clone(element))
  return d
}

export function insertBeforeSibling(doc: VSDocument, element: VSElement, before: number[]): VSDocument {
  if (before.length === 0) throw new EditError('Invalid element path.')
  return insertAt(doc, before.slice(0, -1), before[before.length - 1], element)
}

export function insertAfterSibling(doc: VSDocument, element: VSElement, after: number[]): VSDocument {
  if (after.length === 0) throw new EditError('Invalid element path.')
  return insertAt(doc, after.slice(0, -1), after[after.length - 1] + 1, element)
}

function isStrictAncestor(ancestor: number[], path: number[]): boolean {
  return ancestor.length < path.length && ancestor.every((v, i) => path[i] === v)
}

/** Passt einen Pfad an, nachdem `removedPath` aus seiner Geschwisterliste entfernt wurde. */
export function adjustPathAfterRemoving(path: number[], removedPath: number[]): number[] {
  if (removedPath.length === 0) return path
  const removedIndex = removedPath[removedPath.length - 1]
  const parent = removedPath.slice(0, -1)
  if (path.length <= parent.length || !parent.every((v, i) => path[i] === v)) return path
  const pos = parent.length
  if (path[pos] <= removedIndex) return path
  const adjusted = [...path]
  adjusted[pos] -= 1
  return adjusted
}

const samePath = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i])

export function moveBeforeSibling(doc: VSDocument, from: number[], before: number[]): VSDocument {
  if (samePath(from, before)) return doc
  if (isStrictAncestor(from, before)) throw new EditError('Invalid element path.')
  const moving = elementAt(doc, from)
  const d = deleteAtPath(doc, from)
  return insertBeforeSibling(d, moving, adjustPathAfterRemoving(before, from))
}

export function moveAfterSibling(doc: VSDocument, from: number[], after: number[]): VSDocument {
  if (samePath(from, after)) return doc
  if (isStrictAncestor(from, after)) throw new EditError('Invalid element path.')
  const moving = elementAt(doc, from)
  const d = deleteAtPath(doc, from)
  return insertAfterSibling(d, moving, adjustPathAfterRemoving(after, from))
}

export function moveReplacingPlaceholder(doc: VSDocument, from: number[], placeholder: number[]): VSDocument {
  if (!isPlaceholderSlot(doc, placeholder)) throw new EditError('Invalid element path.')
  if (samePath(from, placeholder)) return doc
  if (isStrictAncestor(from, placeholder)) throw new EditError('Invalid element path.')
  const moving = elementAt(doc, from)
  const d = deleteAtPath(doc, from)
  return replaceAtPath(d, adjustPathAfterRemoving(placeholder, from), moving)
}
