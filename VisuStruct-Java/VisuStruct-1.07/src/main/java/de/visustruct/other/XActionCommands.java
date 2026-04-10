package de.visustruct.other;

public enum XActionCommands {
	neu, oeffnen, speichern, speicherUnter, bildSpeichern, bildInZwischenAblage, quellcodeErzeugen,
	struktogrammSchliessen, programmBeenden,
	
	rueckgaengig, widerrufen, ganzesStruktogrammKopieren,
	
	letztesElementStrecken, schriftartAendern,
	groesseAendernMitMausrad, zoomeinstellungen, vergroesserungenRuckgaengigMachen,
	elementShortcutsVerwenden,

	/** Dialog „Beschriftung (Struktogramm)“ / Textvorlagen für neue Blöcke. */
	elementBeschriftungEinstellen,
	
	info,
	
	lookAndFeelOSStandard, lookAndFeelSwingStandard, lookAndFeelNimbus,
	lookAndFeelFlatLight, lookAndFeelFlatDark, struktogrammbeschreibungHinzufuegen,

	/** UI-Sprache Englisch (Menü „Einstellungen → Sprachen“). */
	languageEnglish,
	/** UI-Sprache Deutsch. */
	languageGerman,
	/** UI-Sprache Português (Portugal). */
	languagePortuguesePortugal

}
