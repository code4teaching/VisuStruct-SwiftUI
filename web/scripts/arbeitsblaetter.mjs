// Baut die Arbeitsblätter (PDF, A4) von VisuBot Kids zum Ausdrucken und Einlaminieren.
// Aufruf: in web/ erst `npx vite --port 5199` starten, dann `node scripts/arbeitsblaetter.mjs <Zielordner>`.
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

// playwright ist keine Abhängigkeit des Projekts; require findet es auch global (NODE_PATH).
const { chromium } = createRequire(import.meta.url)('playwright')

const base = process.env.WS_URL ?? 'http://localhost:5199/arbeitsblatt.html'
const out = process.argv[2] ?? 'arbeitsblaetter'
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(base)
const list = await page.evaluate(() => window.worksheetList)
const jobs = [
  ...list.lessons.map((l) => ({ l, kind: 'lektion' })),
  ...list.tasks.map((l) => ({ l, kind: 'aufgabe' })),
]
const counter = { '34': 0, '57': 0 }
for (const { l, kind } of jobs) {
  const [folder, ...rest] = l.split('/')
  const name = rest.at(-1)
  const level = folder === 'bloecke34' ? '34' : '57'
  const dir = join(out, level === '34' ? 'Klasse-3-4' : 'Klasse-5-7')
  mkdirSync(dir, { recursive: true })
  // Die App zählt die Lektionen durch (Dateinummern dürfen doppelt sein, z. B. 06-…, 06-…).
  const nr = kind === 'lektion' ? ++counter[level] : 0
  await page.goto(`${base}?stufe=${level}&${kind}=${name}${nr ? `&nr=${nr}` : ''}`)
  await page.waitForSelector('body[data-ready="1"]')
  await page.waitForTimeout(300)
  const file = join(dir, kind === 'aufgabe' ? `Aufgabe-${name.replace(/^(kids|block)-/, '')}.pdf` : `Lektion-${String(nr).padStart(2, '0')}-${name.replace(/^\d+-/, '')}.pdf`)
  await page.pdf({ path: file, format: 'A4', printBackground: true, preferCSSPageSize: true })
  console.log(file)
}
await browser.close()
