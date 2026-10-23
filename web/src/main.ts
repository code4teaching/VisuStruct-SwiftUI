import './ui/styles.css'
import { App, applyCanvasStubTexts } from './ui/app'
import { preferredLanguage, setCodeKeywords, setLanguage, storedCodeKeywords } from './ui/i18n'

// Erst die Sprache (sie übernimmt ein altes „Java (Keywords)“), dann den Schalter Code-Keywords.
const language = preferredLanguage()
void Promise.all([setLanguage(language, false), setCodeKeywords(storedCodeKeywords(), false)]).then(() => {
  applyCanvasStubTexts()
  new App(document.getElementById('app')!)
})
