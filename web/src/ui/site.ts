/**
 * Webseiten der Welten auf visucode.de: visustruct.visucode.de, visubot.visucode.de, visuobject.visucode.de.
 * Jede Subdomain hat ihre eigene Startseite (/de/, /en/, /pt/ …) und eine eigene Kopie der Web-App unter /app/.
 */
export type SiteWorld = 'visustruct' | 'visubot' | 'visuobject'

export const SITE_DOMAIN = 'visucode.de'

/** Welt der Subdomain, auf der die App gerade läuft (z. B. `visubot` auf visubot.visucode.de), sonst `undefined`. */
export function hostWorld(host: string = location.hostname): SiteWorld | undefined {
  const m = /^(visustruct|visubot|visuobject)\.visucode\.de$/.exec(host.toLowerCase())
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
