/**
 * Sprachen wie `AppLanguage.swift`: Texte aus den `Localizable.strings` der App, dazu
 * `src/i18n/<Sprache>.strings` für Texte, die es nur in der Web-Version gibt.
 * Fehlt ein Text in einer Sprache, gilt der englische (nie der Schlüssel selbst).
 */

export const languages = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ko', name: '한국어' },
  { code: 'ja', name: '日本語' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'uk', name: 'Українська' },
  { code: 'ar', name: 'العربية' },
  { code: 'ru', name: 'Русский' },
  { code: 'he', name: 'עברית' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'sv', name: 'Svenska' },
  { code: 'da', name: 'Dansk' },
  { code: 'nb', name: 'Norsk bokmål' },
  { code: 'zh-Hans', name: '中文（简体）' },
  { code: 'zh-Hant', name: '中文（繁體）' },
  { code: 'pt-PT', name: 'Português' },
  { code: 'java', name: 'Java (Keywords)' },
] as const

export type LanguageCode = (typeof languages)[number]['code']

/** Sprachen, die die Web-App zur Auswahl anbietet (Holger, 2026-10-22). Die übrigen bleiben übersetzt und lassen sich hier wieder einschalten. */
const offered: readonly LanguageCode[] = ['de', 'en', 'pt-PT', 'java']
export const offeredLanguages = languages.filter((l) => offered.includes(l.code))
const isOffered = (code: string): code is LanguageCode => offered.includes(code as LanguageCode)

const appStrings = import.meta.glob('../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/*.lproj/Localizable.strings', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>
const javaStrings = import.meta.glob('../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/Java.strings', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>
const webStrings = import.meta.glob('../i18n/*.strings', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>

function loader(table: Record<string, () => Promise<string>>, suffix: string): (() => Promise<string>) | undefined {
  return Object.entries(table).find(([path]) => path.endsWith(suffix))?.[1]
}

/** Liest das Apple-Format `"schlüssel" = "wert";` (Kommentare werden übersprungen). */
export function parseStrings(source: string): Map<string, string> {
  const map = new Map<string, string>()
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  const re = /"((?:[^"\\]|\\.)*)"\s*=\s*"((?:[^"\\]|\\.)*)"\s*;/g
  const unescape = (s: string) =>
    s.replace(/\\(u[0-9a-fA-F]{4}|.)/g, (_, c: string) =>
      c === 'n' ? '\n' : c === 't' ? '\t' : c.startsWith('u') && c.length === 5 ? String.fromCharCode(parseInt(c.slice(1), 16)) : c,
    )
  for (const m of withoutComments.matchAll(re)) map.set(unescape(m[1]), unescape(m[2]))
  return map
}

async function loadTable(code: LanguageCode): Promise<Map<string, string>> {
  const app = code === 'java' ? loader(javaStrings, '/Java.strings') : loader(appStrings, `/${code}.lproj/Localizable.strings`)
  const web = loader(webStrings, `/${code}.strings`)
  const table = new Map<string, string>()
  for (const load of [app, web]) {
    if (!load) continue
    for (const [k, v] of parseStrings(await load())) table.set(k, v)
  }
  return table
}

let current: LanguageCode = 'en'
let table = new Map<string, string>()
let english = new Map<string, string>()

const storageKey = 'appLanguageCode'

/** Wie `AppLanguage.deviceDefault`: erste Browsersprache, die VisuStruct anbietet, sonst Englisch. */
export function preferredLanguage(): LanguageCode {
  // Link von der Webseite, z. B. visustruct.org/app/?lang=de
  const fromURL = new URLSearchParams(location.search).get('lang')
  if (fromURL && isOffered(fromURL)) return fromURL
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved && isOffered(saved)) return saved
  } catch {
    /* ohne Speicher */
  }
  for (const tag of navigator.languages ?? [navigator.language]) {
    const t = tag.toLowerCase()
    if (t.startsWith('pt')) return 'pt-PT'
    const hit = offeredLanguages.find((l) => l.code !== 'java' && l.code === t.split('-')[0])
    if (hit) return hit.code
  }
  return 'en'
}

export async function setLanguage(code: LanguageCode, remember = true) {
  if (english.size === 0) english = await loadTable('en')
  table = code === 'en' ? english : await loadTable(code)
  current = code
  if (remember) {
    try {
      localStorage.setItem(storageKey, code)
    } catch {
      /* nur für diese Sitzung */
    }
  }
  const root = document.documentElement
  root.lang = code === 'java' ? 'en' : code
  root.dir = code === 'ar' || code === 'he' ? 'rtl' : 'ltr'
}

export function currentLanguage(): LanguageCode {
  return current
}

/** Übersetzung zu `key`; `%@`, `%d` und `%1$@` werden der Reihe nach durch `args` ersetzt. */
export function t(key: string, ...args: (string | number)[]): string {
  const text = table.get(key) ?? english.get(key) ?? key
  if (args.length === 0) return text
  let next = 0
  return text.replace(/%(?:(\d+)\$)?[@d]/g, (_, pos: string | undefined) => String(args[pos ? Number(pos) - 1 : next++] ?? ''))
}
