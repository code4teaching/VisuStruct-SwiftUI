import { placeholderElement } from './editing'
import { ElementType, makeElement, type VSElement } from './model'

/** Wie `ElementPalette.swift`: neue Elemente aus der Palette. */
export type PaletteItem =
  | 'anweisung'
  | 'verzweigung'
  | 'whileSchleife'
  | 'doUntilSchleife'
  | 'forZaehlSchleife'
  | 'fallauswahl'
  | 'endlosschleife'
  | 'aussprung'
  | 'aufruf'

/** Beschriftungen aus `de.lproj/Localizable.strings` (`element_*`). */
export const paletteItems: { item: PaletteItem; label: string }[] = [
  { item: 'anweisung', label: 'Anweisung' },
  { item: 'verzweigung', label: 'Verzweigung' },
  { item: 'fallauswahl', label: 'Fallauswahl' },
  { item: 'forZaehlSchleife', label: 'For-Schleife' },
  { item: 'whileSchleife', label: 'While-Schleife' },
  { item: 'doUntilSchleife', label: 'Do-while-Schleife' },
  { item: 'endlosschleife', label: 'Endlosschleife' },
  { item: 'aufruf', label: 'Aufruf' },
  { item: 'aussprung', label: 'Aussprung' },
]

export function paletteElement(item: PaletteItem): VSElement {
  const stub = placeholderElement
  switch (item) {
    case 'anweisung':
      return makeElement(ElementType.anweisung)
    case 'verzweigung':
      return makeElement(ElementType.verzweigung, {
        cases: [
          { name: 'true', elements: [stub()] },
          { name: 'false', elements: [stub()] },
        ],
      })
    case 'fallauswahl':
      return makeElement(ElementType.fallauswahl, {
        cases: [
          { name: '1', elements: [stub()] },
          { name: '2', elements: [stub()] },
          { name: 'default', elements: [stub()] },
        ],
      })
    case 'forZaehlSchleife':
      return makeElement(ElementType.forSchleife, { textLines: ['', '', ''], loopBody: [stub()] })
    case 'whileSchleife':
      return makeElement(ElementType.whileSchleife, { loopBody: [stub()] })
    case 'doUntilSchleife':
      return makeElement(ElementType.doUntilSchleife, { loopBody: [stub()] })
    case 'endlosschleife':
      return makeElement(ElementType.endlosschleife, { loopBody: [stub()] })
    case 'aussprung':
      return makeElement(ElementType.aussprung)
    case 'aufruf':
      return makeElement(ElementType.aufruf)
  }
}
