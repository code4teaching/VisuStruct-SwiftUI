import { t } from './i18n'

/** Eine Textdatei wie im Editor: Name oben, darunter der Inhalt mit Zeilennummern. `written`: vom Programm gespeichert. */
export function textFileView(name: string, content: string, written = false): HTMLElement {
  const box = document.createElement('figure')
  box.className = written ? 'learn-file written' : 'learn-file'
  const caption = document.createElement('figcaption')
  const icon = document.createElement('span')
  icon.className = 'learn-file-icon'
  icon.setAttribute('aria-hidden', 'true')
  icon.textContent = '📄'
  caption.append(icon, written ? t('web_sim_written_file_fmt', name) : name)
  const pre = document.createElement('pre')
  pre.className = 'learn-file-text'
  pre.dir = 'ltr'
  // Am Ende steht meist ein Zeilenumbruch; dahinter beginnt keine neue Zeile.
  const lines = content.replace(/\n$/, '').split('\n')
  lines.forEach((line, i) => {
    const n = document.createElement('span')
    n.className = 'ln'
    n.textContent = String(i + 1)
    pre.append(n, line + '\n')
  })
  box.append(caption, pre)
  return box
}

/** Alle Dateien, die ein Programm gespeichert hat. */
export function writtenFilesView(files: Map<string, string>): HTMLElement[] {
  return [...files].map(([name, content]) => textFileView(name, content, true))
}
