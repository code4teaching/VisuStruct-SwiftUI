/**
 * VisuObject: „Neu“ im Package Explorer wie in Eclipse (New Java Project, Source Folder, Package,
 * Class, Interface). Jede Art hat ein kleines Fenster; für Klassen mit Modifier, abstract/final,
 * Oberklasse, Interfaces und Methoden-Rümpfen. `classSource` schreibt daraus den Java-Code.
 */

import type { ProjectClass } from '../core/javaProject'
import { t } from './i18n'

export type NewKind = 'project' | 'folder' | 'package' | 'class' | 'interface'

export interface NewClassOptions {
  kind: 'class' | 'interface'
  /** Java-Package ohne Source Folder; leer = Standard-Package. */
  pkg: string
  name: string
  isPublic: boolean
  isAbstract: boolean
  isFinal: boolean
  superclass?: ProjectClass
  interfaces: ProjectClass[]
  main: boolean
  constructors: boolean
  inherited: boolean
  comment: boolean
  author: string
}

const defaultValue = (type: string) =>
  type === 'boolean' ? 'false' : /^(int|long|short|byte|double|float)$/.test(type) ? '0' : type === 'char' ? "'\\0'" : 'null'

const paramList = (params: { name: string; type: string }[]) => params.map((p) => `${p.type} ${p.name}`).join(', ')

/** Abstrakte Methoden aus Oberklasse und Interfaces, die die neue Klasse schreiben muss (ohne doppelte). */
function inheritedAbstract(o: NewClassOptions): { name: string; type: string; params: { name: string; type: string }[]; visibility: string }[] {
  const out = new Map<string, { name: string; type: string; params: { name: string; type: string }[]; visibility: string }>()
  const add = (cls: ProjectClass, fromInterface: boolean) => {
    for (const m of cls.members)
      if (m.kind === 'method' && !m.isStatic && (fromInterface || m.isAbstract)) {
        const sig = `${m.name}(${m.params.map((p) => p.type).join(',')})`
        if (!out.has(sig)) out.set(sig, { name: m.name, type: m.type || 'void', params: m.params, visibility: fromInterface || m.visibility === '+' ? 'public' : m.visibility === '#' ? 'protected' : '' })
      }
  }
  if (o.superclass) add(o.superclass, false)
  for (const i of o.interfaces) add(i, true)
  return [...out.values()]
}

/** Java-Datei der neuen Klasse bzw. des neuen Interfaces. */
export function classSource(o: NewClassOptions): string {
  const lines: string[] = []
  if (o.pkg) lines.push(`package ${o.pkg};`, '')
  const imports = [o.superclass, ...o.interfaces].filter((c): c is ProjectClass => !!c && !!c.pkg && c.pkg !== o.pkg).map((c) => `import ${c.pkg}.${c.name};`)
  if (imports.length) lines.push(...[...new Set(imports)].sort(), '')
  if (o.comment) {
    lines.push('/**', ` * ${o.name}`, ' *')
    lines.push(` * @author ${o.author.trim() || '…'}`, ' */')
  }
  const mods = [o.isPublic ? 'public' : '', o.kind === 'class' && o.isAbstract ? 'abstract' : '', o.kind === 'class' && o.isFinal ? 'final' : ''].filter(Boolean).join(' ')
  const names = o.interfaces.map((i) => i.name)
  const head =
    o.kind === 'class'
      ? `${mods ? mods + ' ' : ''}class ${o.name}${o.superclass ? ` extends ${o.superclass.name}` : ''}${names.length ? ` implements ${names.join(', ')}` : ''}`
      : `${mods ? mods + ' ' : ''}interface ${o.name}${names.length ? ` extends ${names.join(', ')}` : ''}`
  lines.push(`${head} {`)
  const body: string[][] = []
  if (o.kind === 'class') {
    if (o.constructors && o.superclass) {
      const ctors = o.superclass.members.filter((m) => m.kind === 'constructor')
      for (const c of ctors.length ? ctors : [{ params: [] as { name: string; type: string }[] }])
        body.push([`    public ${o.name}(${paramList(c.params)}) {`, `        super(${c.params.map((p) => p.name).join(', ')});`, '    }'])
    } else if (o.constructors) body.push([`    public ${o.name}() {`, '    }'])
    if (o.inherited && !o.isAbstract)
      for (const m of inheritedAbstract(o))
        body.push(['    @Override', `    ${m.visibility ? m.visibility + ' ' : ''}${m.type} ${m.name}(${paramList(m.params)}) {`, ...(m.type === 'void' ? [] : [`        return ${defaultValue(m.type)};`]), '    }'])
    if (o.main) body.push(['    public static void main(String[] args) {', '    }'])
  }
  if (body.length) lines.push('', body.map((b) => b.join('\n')).join('\n\n'))
  lines.push('}', '')
  return lines.join('\n')
}

// MARK: - Fenster

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

export interface WizardContext {
  roots: string[]
  /** Java-Packages (ohne Source Folder) je Source Folder, `''` = Standard-Package. */
  packagesIn(root: string): string[]
  classes: ProjectClass[]
  root: string
  pkg: string
  /** Fehlermeldung zum Namen oder `undefined`, wenn er passt. */
  check(kind: NewKind, name: string, root: string, pkg: string): string | undefined
  suggest(kind: NewKind): string
}

export interface WizardResult {
  kind: NewKind
  name: string
  root: string
  pkg: string
  options?: NewClassOptions
}

const authorKey = 'visuobject.author'
function storedAuthor(): string {
  try {
    return localStorage.getItem(authorKey) ?? ''
  } catch {
    return ''
  }
}

/** Fenster „Neu …“; `undefined` bei Abbrechen. Rückfragen nie mit `window.prompt` (in eingebetteten Ansichten gesperrt). */
export function newWizard(kind: NewKind, ctx: WizardContext): Promise<WizardResult | undefined> {
  return new Promise((resolve) => {
    const box = document.createElement('div')
    box.className = 'confirm vo-wizard-back'
    const isType = kind === 'class' || kind === 'interface'
    const rootSelect = `<label>${esc(t('web_visuobject_new_root'))}<select name="root">${ctx.roots.map((r) => `<option${r === ctx.root ? ' selected' : ''}>${esc(r)}</option>`).join('')}</select></label>`
    const pkgSelect = `<label>${esc(t('web_visuobject_new_package'))}<select name="pkg"></select></label>`
    const others = ctx.classes
    const superOptions = others.filter((c) => c.kind === 'class').map((c) => `<option value="${esc(c.name)}">${esc(c.pkg ? `${c.name} (${c.pkg})` : c.name)}</option>`).join('')
    const interfaces = others.filter((c) => c.kind === 'interface')
    const interfaceBoxes = interfaces.length
      ? `<fieldset class="vo-wizard-list"><legend>${esc(t(kind === 'class' ? 'web_visuobject_new_interfaces' : 'web_visuobject_new_extends_interfaces'))}</legend>${interfaces.map((c) => `<label class="check"><input type="checkbox" name="iface" value="${esc(c.name)}"> ${esc(c.name)}</label>`).join('')}</fieldset>`
      : ''
    const check = (name: string, label: string, on = false) => `<label class="check"><input type="checkbox" name="${name}"${on ? ' checked' : ''}> ${label}</label>`
    const typeFields = isType
      ? `${rootSelect}${pkgSelect}
        <label>${esc(t('web_visuobject_new_name'))}<input type="text" name="name" autocomplete="off" spellcheck="false"></label>
        <fieldset class="vo-wizard-row"><legend>${esc(t('web_visuobject_new_modifiers'))}</legend>
          <select name="visibility" aria-label="${esc(t('web_visuobject_new_modifiers'))}"><option value="public" selected>public</option><option value="package">${esc(t('web_visuobject_new_package_private'))}</option></select>
          ${kind === 'class' ? `${check('abstract', 'abstract')}${check('final', 'final')}` : ''}
        </fieldset>
        ${kind === 'class' ? `<label>${esc(t('web_visuobject_new_superclass'))}<select name="superclass"><option value="">java.lang.Object</option>${superOptions}</select></label>` : ''}
        ${interfaceBoxes}
        ${
          kind === 'class'
            ? `<fieldset class="vo-wizard-list"><legend>${esc(t('web_visuobject_new_stubs'))}</legend>
          ${check('main', '<code>public static void main(String[] args)</code>')}
          ${check('constructors', esc(t('web_visuobject_new_stub_constructors')))}
          ${check('inherited', esc(t('web_visuobject_new_stub_inherited')), true)}
        </fieldset>`
            : ''
        }
        <fieldset class="vo-wizard-row"><legend>${esc(t('web_visuobject_new_comment_legend'))}</legend>
          ${check('comment', esc(t('web_visuobject_new_comment')))}
          <input type="text" name="author" autocomplete="name" placeholder="${esc(t('web_visuobject_new_author'))}" aria-label="${esc(t('web_visuobject_new_author'))}" value="${esc(storedAuthor())}">
        </fieldset>`
      : `${kind === 'package' ? rootSelect : ''}<label>${esc(t('web_visuobject_new_name'))}<input type="text" name="name" autocomplete="off" spellcheck="false"></label>`
    box.innerHTML = `<form class="confirm-card vo-wizard" role="dialog" aria-modal="true" aria-label="${esc(t(`web_visuobject_new_${kind}_title`))}">
      <h2>${esc(t(`web_visuobject_new_${kind}_title`))}</h2>
      <p class="hint">${esc(t(`web_visuobject_new_${kind}_hint`))}</p>
      ${typeFields}
      <p class="vo-wizard-error" role="alert"></p>
      <div class="group"><button type="button" data-cancel>${esc(t('close_unsaved_cancel'))}</button><button type="submit" class="primary">${esc(t('web_visuobject_new_finish'))}</button></div>
    </form>`
    const form = box.querySelector('form')!
    const field = <T extends HTMLElement>(name: string) => form.querySelector<T>(`[name="${name}"]`)
    const nameInput = field<HTMLInputElement>('name')!
    const rootInput = field<HTMLSelectElement>('root')
    const pkgInput = field<HTMLSelectElement>('pkg')
    const error = form.querySelector<HTMLElement>('.vo-wizard-error')!
    nameInput.value = ctx.suggest(kind)
    const fillPackages = () => {
      if (!pkgInput) return
      const pkgs = ctx.packagesIn(rootInput?.value ?? ctx.root)
      const list = pkgs.includes('') ? pkgs : [...pkgs, '']
      const keep = pkgInput.value || ctx.pkg
      pkgInput.innerHTML = list.map((p) => `<option value="${esc(p)}"${p === keep ? ' selected' : ''}>${esc(p || t('web_visuobject_default_package'))}</option>`).join('')
    }
    fillPackages()
    rootInput?.addEventListener('change', fillPackages)
    // abstract und final schließen sich aus, wie in Eclipse.
    const abstract = field<HTMLInputElement>('abstract')
    const final = field<HTMLInputElement>('final')
    abstract?.addEventListener('change', () => abstract.checked && final && (final.checked = false))
    final?.addEventListener('change', () => final.checked && abstract && (abstract.checked = false))
    const validate = () => {
      const message = ctx.check(kind, nameInput.value.trim(), rootInput?.value ?? ctx.root, pkgInput?.value ?? ctx.pkg)
      error.textContent = message ?? ''
      return !message
    }
    nameInput.addEventListener('input', validate)
    pkgInput?.addEventListener('change', validate)
    const done = (value: WizardResult | undefined) => {
      box.remove()
      resolve(value)
    }
    form.addEventListener('submit', (ev) => {
      ev.preventDefault()
      if (!validate()) return nameInput.focus()
      const name = nameInput.value.trim()
      const root = rootInput?.value ?? ctx.root
      const pkg = pkgInput?.value ?? ''
      if (!isType) return done({ kind, name, root, pkg })
      const author = field<HTMLInputElement>('author')!.value
      try {
        localStorage.setItem(authorKey, author)
      } catch {
        /* nicht schlimm */
      }
      const on = (n: string) => !!field<HTMLInputElement>(n)?.checked
      const byName = (n: string) => ctx.classes.find((c) => c.name === n)
      const superName = field<HTMLSelectElement>('superclass')?.value
      done({
        kind,
        name,
        root,
        pkg,
        options: {
          kind,
          pkg,
          name,
          isPublic: field<HTMLSelectElement>('visibility')!.value === 'public',
          isAbstract: on('abstract'),
          isFinal: on('final'),
          superclass: superName ? byName(superName) : undefined,
          interfaces: [...form.querySelectorAll<HTMLInputElement>('[name=iface]:checked')].map((i) => byName(i.value)).filter((c): c is ProjectClass => !!c),
          main: on('main'),
          constructors: on('constructors'),
          inherited: on('inherited'),
          comment: on('comment'),
          author,
        },
      })
    })
    box.addEventListener('click', (ev) => {
      const target = ev.target as HTMLElement
      if (target === box || target.closest('[data-cancel]')) done(undefined)
    })
    box.addEventListener('keydown', (ev) => {
      ev.stopPropagation()
      if (ev.key === 'Escape') done(undefined)
    })
    document.body.append(box)
    nameInput.focus()
    nameInput.select()
  })
}
