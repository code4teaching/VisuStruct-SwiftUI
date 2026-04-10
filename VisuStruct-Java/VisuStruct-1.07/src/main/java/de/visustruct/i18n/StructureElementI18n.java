package de.visustruct.i18n;

import de.visustruct.control.Struktogramm;

/**
 * I18n für Strukturblöcke: didaktische Namen ({@code structure.element.*}) und Paletten-Kurzlabels ({@code structure.palette.*}).
 */
public final class StructureElementI18n {

	private static final String[] ELEMENT_KEYS = {
			"structure.element.statement",
			"structure.element.decision",
			"structure.element.multiway",
			"structure.element.forLoop",
			"structure.element.whileLoop",
			"structure.element.doWhileLoop",
			"structure.element.infiniteLoop",
			"structure.element.breakExit",
			"structure.element.call",
			"structure.element.empty",
	};

	private static final String[] PALETTE_KEYS = {
			"structure.palette.statement",
			"structure.palette.decision",
			"structure.palette.multiway",
			"structure.palette.forLoop",
			"structure.palette.whileLoop",
			"structure.palette.doWhileLoop",
			"structure.palette.infiniteLoop",
			"structure.palette.breakExit",
			"structure.palette.call",
			"structure.palette.empty",
	};

	private StructureElementI18n() {
	}

	/** Standardtexte für neu eingefügte Elemente (Typ 0–9), gemäß aktueller UI-Sprache. */
	public static String[] didacticDefaultTexts() {
		String[] r = new String[ELEMENT_KEYS.length];
		for (int i = 0; i < ELEMENT_KEYS.length; i++) {
			r[i] = I18n.tr(ELEMENT_KEYS[i]);
		}
		return r;
	}

	/** Kurztext auf der linken Palette für Strukturtyp {@code typ} ({@link Struktogramm#typAnweisung} …). */
	public static String paletteShortLabel(int typ) {
		if (typ < 0 || typ >= PALETTE_KEYS.length) {
			return "";
		}
		return I18n.tr(PALETTE_KEYS[typ]);
	}

	/** Tooltip: ausführliche didaktische Bezeichnung. */
	public static String paletteTooltip(int typ) {
		if (typ < 0 || typ >= ELEMENT_KEYS.length) {
			return "";
		}
		return I18n.tr(ELEMENT_KEYS[typ]);
	}

	/**
	 * Linker Teil einer Vorschau-Zeile im Dialog „Beschriftung (Struktogramm)“ — immer der
	 * didaktische Name (wie in den Menüs/Einstellungen), nicht das kompakte Paletten-Symbol.
	 */
	public static String previewRowLabel(int slotIndex) {
		if (slotIndex < 0 || slotIndex >= ELEMENT_KEYS.length) {
			return "";
		}
		return I18n.tr(ELEMENT_KEYS[slotIndex]);
	}
}
