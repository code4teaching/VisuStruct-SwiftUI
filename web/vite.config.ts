import { defineConfig } from 'vitest/config'
import { viteSingleFile } from 'vite-plugin-singlefile'
import pkg from './package.json'

// `npm run build` → dist/ (relative paths, e.g. for website/app/).
// `npm run build:single` → one self-contained index.html (preview/sharing).
export default defineConfig(({ mode }) => ({
  base: './',
  // Versionsnummer der Web-App für „Über VisuStruct“; vor jeder Veröffentlichung in package.json erhöhen.
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: mode === 'single' ? [viteSingleFile()] : [],
  build: { outDir: mode === 'single' ? 'dist-single' : 'dist' },
  // Beispieldateien liegen eine Ebene höher in `VisuStruct-Dateien`.
  server: { fs: { allow: ['..'] } },
  test: { environment: 'jsdom' },
}))
