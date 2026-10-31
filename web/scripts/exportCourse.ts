/**
 * Kurs für die Swift-App: Lektionen und Aufgaben je Sprache als JSON (`npm run build:course`).
 * Liest dieselben Markdown-Dateien wie die Web-App mit demselben Parser und zerlegt den Text schon hier in einfache
 * Absätze, Listen, Code und Tabellen, damit die App ihn ohne eigenen Markdown-Parser nativ anzeigen kann.
 * Diagramme und Bilder, auf die Lektionen verweisen, kommen (in der passenden Sprache) mit in die Datei.
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseLesson, parseTask, type Block, type Exercise } from '../src/learn/lessonFormat'

type Lang = 'de' | 'en' | 'pt'
const languages: Lang[] = ['de', 'en', 'pt']

const here = dirname(fileURLToPath(import.meta.url))
const lessonsDir = resolve(here, '../lessons')
const outDir = resolve(here, '../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/Course/Content')

/** Wie `filesFor` in `content.ts`: Dateien der Sprache, ergänzt um die englischen. */
function markdownFiles(lang: Lang, sub = ''): [string, string][] {
  const read = (l: Lang) => {
    const dir = join(lessonsDir, l, sub)
    if (!existsSync(dir)) return new Map<string, string>()
    return new Map(
      readdirSync(dir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => [f, readFileSync(join(dir, f), 'utf8')] as [string, string]),
    )
  }
  return [...new Map([...read('en'), ...(lang === 'en' ? [] : read(lang))])].sort(([a], [b]) => a.localeCompare(b))
}

/** Wie `localized` in `content.ts`: Deutsch liegt ohne Unterordner, sonst `<Sprache>/`, dann `en/`, dann ohne. */
function localizedPath(folder: string, file: string, lang: Lang): string | undefined {
  const candidates = lang === 'de' ? [file, `en/${file}`] : [...(lang === 'en' ? [] : [`${lang}/${file}`]), `en/${file}`, file]
  return candidates.map((c) => join(lessonsDir, folder, c)).find((p) => existsSync(p))
}

// MARK: Markdown in Blöcke (wie `markdownToHTML`, aber als Daten)

type Md =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'code'; text: string }
  | { type: 'note'; blocks: Md[] }
  | { type: 'table'; head: string[]; rows: string[][] }

/** Inline-Markdown bleibt (die App nutzt `AttributedString(markdown:)`); Links auf Stellen in der Web-App werden zu Text. */
function inline(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (all, label: string, url: string) => (/^(https?:|mailto:)/.test(url) ? all : label))
}

function markdownBlocks(source: string): Md[] {
  const out: Md[] = []
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const item = /^\s*([-*]|\d+\.)\s+/
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') {
      i++
      continue
    }
    if (line.startsWith('```')) {
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++])
      i++
      out.push({ type: 'code', text: code.join('\n') })
      continue
    }
    const heading = /^#{3,4}\s+(.*)$/.exec(line)
    if (heading) {
      out.push({ type: 'heading', text: inline(heading[1]) })
      i++
      continue
    }
    if (item.test(line)) {
      const ordered = /^\s*\d+\./.test(line)
      const items: string[] = []
      while (i < lines.length && item.test(lines[i])) {
        let text = lines[i].replace(item, '')
        i++
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !item.test(lines[i])) text += ' ' + lines[i++].trim()
        items.push(inline(text))
      }
      out.push({ type: 'list', ordered, items })
      continue
    }
    if (line.startsWith('|') && /^\|?[\s:|-]*-{3,}[\s:|-]*$/.test(lines[i + 1] ?? '')) {
      const cells = (row: string) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => inline(c.trim()))
      const head = cells(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].startsWith('|')) rows.push(cells(lines[i++]))
      out.push({ type: 'table', head, rows })
      continue
    }
    if (line.startsWith('>')) {
      const quote: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) quote.push(lines[i++].replace(/^>\s?/, ''))
      out.push({ type: 'note', blocks: markdownBlocks(quote.join('\n')) })
      continue
    }
    const para: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !/^(```|#{3,4}\s|>|\||\s*([-*]|\d+\.)\s+)/.test(lines[i])) para.push(lines[i++].trim())
    out.push({ type: 'paragraph', text: inline(para.join(' ')) })
  }
  return out
}

// MARK: Blöcke für die App

interface Assets {
  diagrams: Record<string, string>
  images: Record<string, { svg?: string; base64?: string; width?: number; height?: number }>
}

function svgSize(svg: string): { width?: number; height?: number } {
  const box = /viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/.exec(svg)
  if (box) return { width: Number(box[1]), height: Number(box[2]) }
  const w = /<svg[^>]*\swidth="([\d.]+)/.exec(svg)
  const h = /<svg[^>]*\sheight="([\d.]+)/.exec(svg)
  return { width: w ? Number(w[1]) : undefined, height: h ? Number(h[1]) : undefined }
}

function addDiagram(assets: Assets, file: string, lang: Lang, where: string) {
  if (assets.diagrams[file]) return
  const path = localizedPath('diagramme', file, lang)
  if (!path) throw new Error(`${where}: Diagramm ${file} fehlt.`)
  assets.diagrams[file] = readFileSync(path, 'utf8')
}

function addImage(assets: Assets, file: string, lang: Lang, where: string) {
  if (assets.images[file]) return
  const path = localizedPath('bilder', file, lang)
  if (!path) throw new Error(`${where}: Bild ${file} fehlt.`)
  if (file.endsWith('.svg')) {
    const svg = readFileSync(path, 'utf8')
    assets.images[file] = { svg, ...svgSize(svg) }
  } else {
    assets.images[file] = { base64: readFileSync(path).toString('base64') }
  }
}

function exercise(ex: Exercise, assets: Assets, lang: Lang, where: string) {
  // Die Musterlösung zeigt die App nicht an. Sie prüft damit nur, ob ihre Simulation die Übung schon kann.
  for (const file of [ex.start, ex.solution, ...ex.subprograms]) if (file) addDiagram(assets, file, lang, where)
  return {
    id: ex.id,
    title: ex.title,
    task: markdownBlocks(ex.task),
    start: ex.start,
    tests: ex.tests,
    requires: ex.requires,
    hints: ex.hints.map(inline),
    solution: ex.solution,
    subprograms: ex.subprograms.length ? ex.subprograms : undefined,
    java: ex.code === 'java' || undefined,
  }
}

function appBlocks(blocks: Block[], assets: Assets, lang: Lang, where: string): unknown[] {
  return blocks.flatMap((b): unknown[] => {
    switch (b.kind) {
      case 'markdown':
        return markdownBlocks(b.text)
      case 'diagram':
        addDiagram(assets, b.file, lang, where)
        return [{ type: 'diagram', file: b.file, caption: inline(b.caption) }]
      case 'exercise':
        return [{ type: 'exercise', exercise: exercise(b.exercise, assets, lang, where) }]
      case 'checklist':
        return [{ type: 'checklist', items: b.items.map((it) => ({ text: inline(it.text), step: it.step })) }]
      case 'quiz':
        return [
          {
            type: 'quiz',
            questions: b.questions.map((q) => ({
              question: inline(q.question),
              options: q.options.map((o) => ({ text: inline(o.text), correct: o.correct })),
              pairs: q.pairs,
              explanation: q.explanation && inline(q.explanation),
            })),
          },
        ]
      case 'brag':
        return [{ type: 'brag', tip: b.tip || undefined, blocks: markdownBlocks(b.text) }]
      case 'images':
        for (const f of b.files) addImage(assets, f, lang, where)
        return [{ type: 'images', files: b.files, caption: inline(b.caption) }]
      case 'graphic':
        addImage(assets, b.file, lang, where)
        return [{ type: 'images', files: [b.file], caption: inline(b.caption) }]
      case 'textFile':
        return [{ type: 'textFile', name: b.name, content: b.content }]
      case 'caesar':
        return [{ type: 'caesar', key: b.key, text: b.text }]
      case 'game':
      case 'roundGame':
      case 'rescueGame':
        return [{ type: 'game' }]
    }
  })
}

// MARK: Texte der Lern-Oberfläche

/** Die `web_learn_*`-Texte der Web-App (ohne Vorsilbe), damit App und Web gleich sprechen. */
function webStrings(lang: Lang): Record<string, string> {
  const file = resolve(here, `../src/i18n/${lang === 'pt' ? 'pt-PT' : lang}.strings`)
  const result: Record<string, string> = {}
  for (const m of readFileSync(file, 'utf8').matchAll(/^"web_learn_([^"]+)"\s*=\s*"((?:[^"\\]|\\.)*)";/gm)) {
    result[m[1]] = m[2].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  }
  return result
}

/** Nur in der App: Kauf, und was es dort (noch) nicht gibt. */
const appStrings: Record<Lang, Record<string, string>> = {
  de: {
    app_locked: 'Ab Lektion 4 gehört diese Lektion zum Kurs. Mit einem einmaligen Kauf schaltest du alle Lektionen und Aufgaben frei.',
    app_tasks_locked: 'Die Aufgaben gehören zum Kurs. Mit einem einmaligen Kauf schaltest du alle Lektionen und Aufgaben frei.',
    app_unlock: 'Kurs freischalten',
    app_free_note: 'Lektion 1 bis 3 kannst du gratis ausprobieren.',
    app_game: 'Dieses Spiel gibt es bisher nur im Lernbereich auf visustruct.org.',
    app_caesar: 'Die Caesar-Scheibe gibt es bisher nur im Lernbereich auf visustruct.org.',
    app_java: 'Diese Übung löst du in Java. Das geht bisher nur im Lernbereich auf visustruct.org.',
    app_not_checkable: 'Diese Übung kann die App noch nicht prüfen. Im Lernbereich auf visustruct.org geht das schon.',
    app_close: 'Lernbereich schließen',
    app_file: 'Datei',
  },
  en: {
    app_locked: 'From lesson 4 on, this lesson is part of the course. A one-time purchase unlocks all lessons and tasks.',
    app_tasks_locked: 'The tasks are part of the course. A one-time purchase unlocks all lessons and tasks.',
    app_unlock: 'Unlock the course',
    app_free_note: 'You can try lessons 1 to 3 for free.',
    app_game: 'For now, this game is only available in the learning area on visustruct.org.',
    app_caesar: 'For now, the Caesar wheel is only available in the learning area on visustruct.org.',
    app_java: 'You solve this exercise in Java. For now, that only works in the learning area on visustruct.org.',
    app_not_checkable: 'The app cannot check this exercise yet. The learning area on visustruct.org already can.',
    app_close: 'Close learning area',
    app_file: 'File',
  },
  pt: {
    app_locked: 'A partir da lição 4, esta lição faz parte do curso. Uma compra única desbloqueia todas as lições e tarefas.',
    app_tasks_locked: 'As tarefas fazem parte do curso. Uma compra única desbloqueia todas as lições e tarefas.',
    app_unlock: 'Desbloquear o curso',
    app_free_note: 'Podes experimentar as lições 1 a 3 gratuitamente.',
    app_game: 'Por agora, este jogo só existe na área de aprendizagem em visustruct.org.',
    app_caesar: 'Por agora, o disco de César só existe na área de aprendizagem em visustruct.org.',
    app_java: 'Resolves este exercício em Java. Por agora, isso só funciona na área de aprendizagem em visustruct.org.',
    app_not_checkable: 'A aplicação ainda não consegue verificar este exercício. A área de aprendizagem em visustruct.org já consegue.',
    app_close: 'Fechar a área de aprendizagem',
    app_file: 'Ficheiro',
  },
}

function exportLanguage(lang: Lang) {
  const assets: Assets = { diagrams: {}, images: {} }
  const lessons = markdownFiles(lang)
    .filter(([name]) => /^\d+/.test(name))
    .map(([name, source]) => parseLesson(source, `${lang}/${name}`))
    .sort((a, b) => a.number - b.number)
    .map((l) => ({
      id: l.id,
      number: l.number,
      title: l.title,
      section: l.section,
      summary: inline(l.summary),
      steps: l.steps.map((s) => ({ title: s.title, blocks: appBlocks(s.blocks, assets, lang, `${lang}/${l.id}`) })),
    }))
  const tasks = markdownFiles(lang, 'aufgaben')
    .map(([name, source]) => parseTask(source, `${lang}/aufgaben/${name}`))
    .sort((a, b) => (a.after ?? 0) - (b.after ?? 0) || a.level - b.level || a.title.localeCompare(b.title, lang))
    .map((t) => ({ id: t.id, title: t.title, after: t.after, level: t.level, blocks: appBlocks(t.blocks, assets, lang, `${lang}/aufgaben/${t.id}`) }))
  const sorted = <T>(o: Record<string, T>) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)))
  const strings = { ...webStrings(lang), ...appStrings[lang] }
  const course = { language: lang, strings: sorted(strings), lessons, tasks, diagrams: sorted(assets.diagrams), images: sorted(assets.images) }
  mkdirSync(outDir, { recursive: true })
  const file = join(outDir, `course-${lang}.json`)
  writeFileSync(file, JSON.stringify(course) + '\n')
  console.log(`${file}: ${lessons.length} Lektionen, ${tasks.length} Aufgaben`)
}

for (const lang of languages) exportLanguage(lang)
