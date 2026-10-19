import './ui/styles.css'
import { App, applyCanvasStubTexts } from './ui/app'
import { preferredLanguage, setLanguage } from './ui/i18n'

void setLanguage(preferredLanguage(), false).then(() => {
  applyCanvasStubTexts()
  new App(document.getElementById('app')!)
})
