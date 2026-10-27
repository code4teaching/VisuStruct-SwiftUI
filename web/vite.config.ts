import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import { viteSingleFile } from 'vite-plugin-singlefile'
import pkg from './package.json'

/**
 * `licenses.txt` neben der Web-App: die Lizenztexte aller mitgelieferten Pakete (Abhängigkeiten ohne devDependencies
 * aus package-lock.json), dazu Hinweise auf das, was erst zur Laufzeit von fremden Servern geladen wird.
 * Die MIT-Lizenz von CodeMirror und Lezer verlangt, dass ihr Text mit ausgeliefert wird.
 */
const CYBERPI_UPLOADER_LICENSE = `MIT License

Copyright (c) 2026 TWO PLUS THREE LIMITED

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`

function thirdPartyLicenses(): Plugin {
  return {
    name: 'third-party-licenses',
    generateBundle() {
      const lock = JSON.parse(readFileSync('package-lock.json', 'utf8')) as { packages: Record<string, { version?: string; license?: string; dev?: boolean }> }
      const parts = [
        'VisuStruct Web – verwendete Software / Third-party software',
        '',
        'VisuStruct: MIT License, Copyright (c) 2026 Holger Sebastiao, https://github.com/code4teaching/VisuStruct-SwiftUI',
        '',
        'Nur mit „Swing-Unterstützung“ wird zur Laufzeit geladen / Loaded at run time only with “Swing support”:',
        '- CheerpJ by Leaning Technologies, https://cheerpj.com (CheerpJ Community License, from the CheerpJ CDN)',
        '- javac from OpenJDK 8 (tools.jar from https://github.com/leaningtech/javafiddle, Apache License 2.0; OpenJDK: GPLv2 with Classpath Exception)',
        '',
        'Übertragen auf den mBot2 / Upload to the mBot2: Ablauf nach / protocol after cyberpi-uploader, https://github.com/weare2plus3/cyberpi-uploader',
        ...CYBERPI_UPLOADER_LICENSE.split('\n'),
        '',
        'Mitgelieferte Pakete / Bundled packages:',
      ]
      const entries = Object.entries(lock.packages)
        .filter(([path, p]) => path.startsWith('node_modules/') && !p.dev)
        .sort(([a], [b]) => a.localeCompare(b))
      for (const [path, p] of entries) {
        const name = path.replace(/^.*node_modules\//, '')
        const file = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENCE'].map((f) => join(path, f)).find((f) => existsSync(f))
        parts.push('', '='.repeat(72), `${name} ${p.version ?? ''} (${p.license ?? 'see below'})`, '='.repeat(72), '')
        parts.push(file ? readFileSync(file, 'utf8').trim() : 'License text not found in the package.')
      }
      this.emitFile({ type: 'asset', fileName: 'licenses.txt', source: parts.join('\n') + '\n' })
    },
  }
}

// `npm run build` → dist/ (relative paths, e.g. for website/app/).
// `npm run build:single` → one self-contained index.html (preview/sharing).
export default defineConfig(({ mode }) => ({
  base: './',
  // Versionsnummer der Web-App für „Über VisuStruct“; vor jeder Veröffentlichung in package.json erhöhen.
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: mode === 'single' ? [viteSingleFile()] : [thirdPartyLicenses()],
  build: { outDir: mode === 'single' ? 'dist-single' : 'dist' },
  // Beispieldateien liegen eine Ebene höher in `VisuStruct-Dateien`.
  server: { fs: { allow: ['..'] } },
  test: { environment: 'jsdom' },
}))
