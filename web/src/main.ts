import './ui/styles.css'
import { App, applyCanvasStubTexts } from './ui/app'
import { installTooltips } from './ui/tooltip'
import { preferredLanguage, setCodeKeywords, setLanguage, storedCodeKeywords } from './ui/i18n'
import { setVisuObjectWorld, visuObjectWorld } from './ui/visubotView'

// Nach einem Update kann eine noch offene oder zwischengespeicherte Seite Dateien der alten Version
// nachladen wollen, die es nicht mehr gibt. Dann einmal neu laden statt leer zu bleiben.
const reloadKey = 'visustruct.reloadedAfterError'

function reloadOnce(): boolean {
  try {
    const last = Number(sessionStorage.getItem(reloadKey))
    if (last && Date.now() - last < 30_000) return false
    sessionStorage.setItem(reloadKey, String(Date.now()))
  } catch {
    return false
  }
  location.reload()
  return true
}

/** Statt einer leeren Seite: kurzer Hinweis mit Knopf zum Neuladen (Texte fest, die Übersetzungen fehlen ja evtl.). */
function showStartupError(error: unknown) {
  console.error(error)
  const de = (navigator.language || '').toLowerCase().startsWith('de')
  const box = document.createElement('div')
  box.className = 'startup-error'
  const title = document.createElement('h1')
  title.textContent = de ? 'VisuStruct konnte nicht starten' : 'VisuStruct could not start'
  const text = document.createElement('p')
  text.textContent = de
    ? 'Wahrscheinlich gibt es gerade eine neue Version. Lade die Seite neu. Hilft das nicht, drücke Strg+Umschalt+R (Mac: ⌘⇧R).'
    : 'There is probably a new version. Reload the page. If that does not help, press Ctrl+Shift+R (Mac: ⌘⇧R).'
  const button = document.createElement('button')
  button.textContent = de ? 'Neu laden' : 'Reload'
  button.addEventListener('click', () => location.reload())
  const detail = document.createElement('pre')
  detail.textContent = String(error instanceof Error ? error.message : error)
  box.append(title, text, button, detail)
  ;(document.getElementById('app') ?? document.body).replaceWith(box)
}

window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnce()) event.preventDefault()
})

// Erst die Sprache (sie übernimmt ein altes „Java (Keywords)“), dann den Schalter Code-Keywords.
const language = preferredLanguage()
Promise.all([setLanguage(language, false), setCodeKeywords(storedCodeKeywords(), false)])
  .then(() => {
    applyCanvasStubTexts()
    installTooltips()
    // Welt VisuObject (…/app/?visuobject) hat eine eigene Oberfläche; ?visustruct und ?visubot wählt die App selbst.
    const query = new URLSearchParams(location.search)
    if (query.has('visuobject')) setVisuObjectWorld()
    const root = document.getElementById('app')!
    if (visuObjectWorld() && !query.has('visustruct') && !query.has('visubot')) return import('./ui/objectApp').then(({ ObjectApp }) => new ObjectApp(root))
    new App(root)
  })
  .then(() => {
    try {
      sessionStorage.removeItem(reloadKey)
    } catch {
      /* egal */
    }
  })
  .catch((error: unknown) => {
    // Fehlende Datei nach einem Update: einmal neu laden, sonst Hinweis zeigen.
    if (/dynamically imported module|Importing a module script failed|error loading dynamically/i.test(String(error)) && reloadOnce()) return
    showStartupError(error)
  })
