/**
 * Webseiten der Welten auf visucode.de: visustruct.visucode.de, visubot.visucode.de, visuobject.visucode.de.
 * Jede Subdomain hat ihre eigene Startseite (/de/, /en/, /pt/ …) und eine eigene Kopie der Web-App unter /app/.
 */
export type SiteWorld = 'visustruct' | 'visubot' | 'visuobject' | 'visubotkids'

export const SITE_DOMAIN = 'visucode.de'

/** Welt der Subdomain, auf der die App gerade läuft (z. B. `visubot` auf visubot.visucode.de), sonst `undefined`. */
export function hostWorld(host: string = location.hostname): SiteWorld | undefined {
  const m = /^(visustruct|visubotkids|visubot|visuobject)\.visucode\.de$/.exec(host.toLowerCase())
  return m ? (m[1] as SiteWorld) : undefined
}

/** Startseite von VisuCode (visucode.de): dort wählt man ein anderes Programm (Deutsch in der Wurzel, sonst /en/, /pt/). */
export function visucodeURL(languageCode: string): string {
  const lang = siteLanguage(languageCode)
  return `https://${SITE_DOMAIN}/${lang === 'de' ? '' : `${lang}/`}`
}

/** Sprachordner der Webseite zur App-Sprache (die Seiten gibt es auf Deutsch, Englisch und Portugiesisch). */
export function siteLanguage(code: string): 'de' | 'en' | 'pt' {
  return code === 'pt-PT' ? 'pt' : code === 'de' ? 'de' : 'en'
}

/**
 * Startseite einer Welt, auf Wunsch mit Abschnitt (#contact, #privacy).
 * Läuft die App unter /app/ auf der Subdomain dieser Welt, relativ (`../de/index.html`), sonst absolut.
 */
export function worldHomeURL(
  world: SiteWorld,
  languageCode: string,
  section?: string,
  where: { hostname: string; pathname: string } = location,
): string {
  const lang = siteLanguage(languageCode)
  const hash = section ? `#${section}` : ''
  const local = hostWorld(where.hostname) === world && /\/app\/(index\.html)?$/.test(where.pathname)
  return local ? `../${lang}/index.html${hash}` : `https://${world}.${SITE_DOMAIN}/${lang}/${hash}`
}

/**
 * VisuBot Kids (Holger 5.11.): dieselbe App mit festem Kinder-Modus für die 5./6. Klasse auf visubotkids.visucode.de.
 * Nur Blöcke, nur die Block-Lektionen und -Aufgaben, kein Umschalter; Struktogramm, Eigenschaften und fast das ganze
 * Zahnrad sind weg, „Zeig mir den Code“ zeigt das Java dazu. Zum Ausprobieren auch mit `?kids` in der Adresse.
 * Der Modus wird nicht gespeichert: Er hängt nur an der Adresse.
 */
let kids = false

export const kidsMode = () => kids

export function setKidsMode(on: boolean) {
  kids = on
}

/** Läuft die App als VisuBot Kids? Auf visubotkids.visucode.de immer, sonst nur mit `?kids`. */
export function kidsWanted(host: string = location.hostname, search: string = location.search): boolean {
  return hostWorld(host) === 'visubotkids' || new URLSearchParams(search).has('kids')
}
