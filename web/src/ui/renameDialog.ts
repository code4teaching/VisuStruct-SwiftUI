import { checkNewName } from '../core/rename'
import { t } from './i18n'

export interface RenameRequest {
  /** Namen zur Auswahl (Struktogramm); vorne der vorgeschlagene. Im Code genau einer: das Wort unter dem Cursor. */
  names: string[]
  /** Alle Namen im Programm, um „gibt es schon“ zu erkennen. */
  existing: string[]
  /** Stellen mit diesem Namen (für den Hinweis). */
  count(name: string): number
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

/** Fenster „Variable umbenennen“: Name wählen, neuen Namen tippen, Enter übernimmt, Esc bricht ab. */
export function askRename(request: RenameRequest): Promise<{ from: string; to: string } | undefined> {
  return new Promise((resolve) => {
    const box = document.createElement('div')
    box.className = 'confirm'
    const single = request.names.length === 1
    box.innerHTML = `<form class="confirm-card rename-card" role="dialog" aria-label="${esc(t('web_rename_title'))}">
      <p><strong>${esc(t('web_rename_title'))}</strong></p>
      <label>${esc(t('web_rename_old'))}
        ${
          single
            ? `<input class="mono" value="${esc(request.names[0])}" readonly />`
            : `<select class="mono">${request.names.map((n) => `<option>${esc(n)}</option>`).join('')}</select>`
        }
      </label>
      <label>${esc(t('web_rename_new'))}
        <input class="mono rename-new" autocomplete="off" autocapitalize="off" spellcheck="false" />
      </label>
      <p class="hint rename-info" role="status" aria-live="polite"></p>
      <p class="hint">${esc(t('web_rename_hint'))}</p>
      <div class="group"><button type="button" data-r="0">${esc(t('web_rename_cancel'))}</button><button type="submit" class="primary">${esc(t('web_rename_apply'))}</button></div>
    </form>`
    const form = box.querySelector('form')!
    const old = box.querySelector<HTMLInputElement | HTMLSelectElement>('label input, label select')!
    const input = box.querySelector<HTMLInputElement>('.rename-new')!
    const info = box.querySelector<HTMLElement>('.rename-info')!
    const apply = box.querySelector<HTMLButtonElement>('button[type=submit]')!

    const update = () => {
      const from = old.value
      const to = input.value.trim()
      const check = checkNewName(from, to, request.existing)
      const count = t('web_rename_count_fmt', request.count(from))
      info.classList.toggle('rename-warning', !check.ok ? to !== '' && to !== from : check.warning === 'exists')
      if (!check.ok) {
        info.textContent = check.reason === 'invalid' ? t('web_rename_invalid') : check.reason === 'keyword' ? t('web_rename_keyword_fmt', to) : count
      } else info.textContent = check.warning === 'exists' ? `${count} ${t('web_rename_exists_fmt', to)}` : count
      apply.disabled = !check.ok
    }
    const close = (result?: { from: string; to: string }) => {
      box.remove()
      resolve(result)
    }
    input.value = old.value
    old.addEventListener('change', () => {
      input.value = old.value
      update()
    })
    input.addEventListener('input', update)
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const to = input.value.trim()
      if (checkNewName(old.value, to, request.existing).ok) close({ from: old.value, to })
    })
    box.addEventListener('click', (e) => {
      if (e.target === box || (e.target as HTMLElement).dataset.r === '0') close()
    })
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        close()
      }
    })
    update()
    document.body.append(box)
    input.focus()
    input.select()
  })
}

/** Kleines Menü beim Rechtsklick mit „Umbenennen …“; schließt bei Klick daneben und mit Esc. */
export function showRenameMenu(x: number, y: number, label: string, pick: () => void) {
  document.querySelector('.rename-menu')?.remove()
  const menu = document.createElement('div')
  menu.className = 'rename-menu'
  menu.setAttribute('role', 'menu')
  const item = document.createElement('button')
  item.setAttribute('role', 'menuitem')
  item.textContent = label
  menu.append(item)
  menu.style.left = `${Math.min(x, window.innerWidth - 220)}px`
  menu.style.top = `${Math.min(y, window.innerHeight - 50)}px`
  const close = () => {
    menu.remove()
    document.removeEventListener('pointerdown', outside, true)
    document.removeEventListener('keydown', escape, true)
  }
  const outside = (e: Event) => {
    if (!menu.contains(e.target as Node)) close()
  }
  const escape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }
  item.addEventListener('click', () => {
    close()
    pick()
  })
  document.addEventListener('pointerdown', outside, true)
  document.addEventListener('keydown', escape, true)
  document.body.append(menu)
  item.focus()
}
