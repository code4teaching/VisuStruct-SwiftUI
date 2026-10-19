/** Beispieldiagramme aus `VisuStruct-Dateien` (werden beim Bauen eingebettet). */
const files = import.meta.glob('../../../VisuStruct-Dateien/**/*.visustruct', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const examples: { name: string; xml: string }[] = Object.entries(files)
  .map(([path, xml]) => ({ name: path.replace(/^.*VisuStruct-Dateien\//, '').replace(/\.visustruct$/, ''), xml }))
  .sort((a, b) => a.name.localeCompare(b.name, 'de'))
