import { mbotColorLanguage } from '../core/mbot'
import { mbotLink } from '../core/mbotLink'
import { mbotProgram } from '../core/mbotProgram'
import type { VSDocument } from '../core/model'
import { t } from './i18n'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * VisuBot: „Auf mBot2 übertragen“. Übersetzt das Programm für den CyberPi, speichert es dort fest und erklärt,
 * wie es weitergeht: Kabel ab, mBot2 an den Start, Taste A.
 */
export function uploadToMBot(doc: VSDocument, subprograms: VSDocument[]) {
  const dialog = document.createElement('dialog')
  dialog.className = 'about mbot-upload'
  dialog.setAttribute('aria-labelledby', 'mbot-upload-title')
  dialog.innerHTML = `
    <header>
      <h2 id="mbot-upload-title">⬆ ${esc(t('web_visubot_upload_title'))}</h2>
      <button type="button" data-action="upload-close">${esc(t('about_done'))}</button>
    </header>
    <div class="about-body">
      <ol class="mbot-upload-steps">
        <li>${esc(t('web_visubot_upload_step1'))}</li>
        <li>${esc(t('web_visubot_upload_step2'))}</li>
        <li>${esc(t('web_visubot_upload_step3'))}</li>
      </ol>
      <progress max="1" value="0" hidden></progress>
      <p class="mbot-upload-status" role="status"></p>
      <div class="mbot-upload-ready" hidden>
        <p class="mbot-upload-ready-title">✓ ${esc(t('web_visubot_upload_ready_title'))}</p>
        <ol>
          <li>${esc(t('web_visubot_upload_ready_unplug'))}</li>
          <li>${esc(t('web_visubot_upload_ready_place'))}</li>
          <li><strong>${esc(t('web_visubot_upload_ready_press'))}</strong></li>
        </ol>
      </div>
      <button type="button" class="primary" data-action="upload-start">⬆ ${esc(t('web_visubot_upload_start'))}</button>
    </div>`
  const status = dialog.querySelector<HTMLElement>('.mbot-upload-status')!
  const bar = dialog.querySelector('progress')!
  const start = dialog.querySelector<HTMLButtonElement>('[data-action=upload-start]')!
  let busy = false
  const close = () => !busy && dialog.close()
  dialog.querySelector('[data-action=upload-close]')!.addEventListener('click', close)
  dialog.addEventListener('cancel', (ev) => busy && ev.preventDefault())
  dialog.addEventListener('click', (ev) => ev.target === dialog && close())
  dialog.addEventListener('close', () => dialog.remove())

  const program = mbotProgram(doc, subprograms, mbotColorLanguage(), t('web_visubot_upload_label'))
  if ('error' in program) {
    status.textContent = `⚠︎ ${t(`web_visubot_upload_error_${program.error}`)}`
    start.hidden = true
  }

  start.addEventListener('click', async () => {
    if (!('source' in program)) return
    busy = true
    start.disabled = true
    dialog.querySelector<HTMLElement>('.mbot-upload-ready')!.hidden = true
    bar.hidden = false
    bar.value = 0
    status.textContent = t('web_visubot_upload_busy')
    try {
      await mbotLink.upload(program.source, (done, total) => (bar.value = done / total))
      // Groß und deutlich: was jetzt am mBot2 zu tun ist (Holger 27.10.)
      bar.hidden = true
      status.textContent = ''
      dialog.querySelector<HTMLElement>('.mbot-upload-steps')!.hidden = true
      dialog.querySelector<HTMLElement>('.mbot-upload-ready')!.hidden = false
      start.textContent = `⬆ ${t('web_visubot_upload_again')}`
    } catch (e) {
      const error = e as Error
      // Auswahl des Anschlusses abgebrochen: nichts melden
      status.textContent = error.name === 'NotFoundError' ? '' : `⚠︎ ${t('web_visubot_upload_failed')} (${error.message})`
      bar.hidden = true
      await mbotLink.disconnect(error.name === 'NotFoundError' ? undefined : error.message).catch(() => undefined)
    } finally {
      busy = false
      start.disabled = false
    }
  })
  document.body.append(dialog)
  dialog.showModal()
}

/** Safari und iPad können kein USB (Web Serial): kurzer Hinweis statt Verbinden oder Übertragen. */
export function showNoSerialHint() {
  const dialog = document.createElement('dialog')
  dialog.className = 'about mbot-upload'
  dialog.setAttribute('aria-labelledby', 'mbot-hint-title')
  dialog.innerHTML = `
    <header>
      <h2 id="mbot-hint-title">🔌 ${esc(t('web_visubot_no_serial_title'))}</h2>
      <button type="button" data-action="hint-close">${esc(t('about_done'))}</button>
    </header>
    <div class="about-body"><p>${esc(t('web_visubot_no_serial_hint'))}</p></div>`
  dialog.querySelector('[data-action=hint-close]')!.addEventListener('click', () => dialog.close())
  dialog.addEventListener('click', (ev) => ev.target === dialog && dialog.close())
  dialog.addEventListener('close', () => dialog.remove())
  document.body.append(dialog)
  dialog.showModal()
}
