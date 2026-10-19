/** Abbild von `VisuStructElement.swift` / Java-Typnummern in `Struktogramm`. */
export enum ElementType {
  anweisung = 0,
  verzweigung = 1,
  fallauswahl = 2,
  forSchleife = 3,
  whileSchleife = 4,
  doUntilSchleife = 5,
  endlosschleife = 6,
  aussprung = 7,
  aufruf = 8,
  leerElement = 9,
}

export interface RGBA {
  r: number
  g: number
  b: number
  a: number
}

/** Ein `<strelem>` inkl. Unterstrukturen (Schleifenrumpf bzw. Fälle). */
export interface VSElement {
  type: ElementType
  /** Java `xVergroesserung`/`yVergroesserung` (`zx`/`zy`). */
  zoomX: number
  zoomY: number
  textColor?: RGBA
  backgroundColor?: RGBA
  /** `<text>`-Kinder, jede Zeile einzeln. */
  textLines: string[]
  /** Nur bei Schleifen gesetzt. */
  loopBody?: VSElement[]
  /** Nur bei Verzweigung/Fallauswahl gesetzt. Letzter Fall ist i. d. R. „default“. */
  cases?: VSCase[]
}

export interface VSCase {
  name: string
  elements: VSElement[]
}

/** Root-Tag `<struktogramm …>`. */
export interface VSDocument {
  fontFamily?: string
  fontSize?: number
  fontStyle?: number
  caption: string
  elements: VSElement[]
}

export function isLoop(t: ElementType): boolean {
  return (
    t === ElementType.forSchleife ||
    t === ElementType.whileSchleife ||
    t === ElementType.doUntilSchleife ||
    t === ElementType.endlosschleife
  )
}

export function isMultiway(t: ElementType): boolean {
  return t === ElementType.verzweigung || t === ElementType.fallauswahl
}

export function makeElement(type: ElementType, init: Partial<VSElement> = {}): VSElement {
  return { type, zoomX: 0, zoomY: 0, textLines: [''], ...init }
}
