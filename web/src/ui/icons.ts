/** Symbole für Werkzeugleisten: 24er-Raster, Strich in Textfarbe. Name steht im Tooltip (`data-tip`). */

const svg = (body: string, filled = false) =>
  `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`

export const icons = {
  newFile: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M12 11v6M9 14h6"/>'),
  open: svg('<path d="M3 18V6a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v2"/><path d="M3 18l3-7h16l-3 7z"/>'),
  save: svg('<path d="M5 3h11l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M7 3v5h8V3"/><path d="M7 21v-7h10v7"/>'),
  undo: svg('<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'),
  redo: svg('<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>'),
  cut: svg('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.1 8.1L20 20M8.1 15.9L20 4"/>'),
  copy: svg('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>'),
  paste: svg('<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>'),
  trash: svg('<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/><path d="M10 11v6M14 11v6"/>'),
  share: svg('<path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>'),
  code: svg('<path d="M8 6l-6 6 6 6"/><path d="M16 6l6 6-6 6"/>'),
  play: svg('<path d="M7 4l13 8-13 8z"/>', true),
  /** Einzelschritt (wie „Step over“ in Entwicklungsumgebungen): Bogen über eine Zeile zur nächsten. */
  step: svg('<path d="M4 13a8 8 0 0 1 14.5-4.5"/><path d="M19.5 4v5h-5"/><circle cx="12" cy="18" r="2.2" fill="currentColor"/>'),
  indent: svg('<path d="M11 6h10M11 12h10M11 18h10M3 6h4"/><path d="M3 10l4 3-4 3"/>'),
  stop: svg('<rect x="6" y="6" width="12" height="12" rx="1.5"/>', true),
  folder: svg('<path d="M3 18V6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  newFolder: svg('<path d="M3 18V6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 10v6M9 13h6"/>'),
  diagram: svg('<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M4 8h16M4 8l8 5 8-5M12 13v8"/>'),
  fileText: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>'),
  pencil: svg('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
}
