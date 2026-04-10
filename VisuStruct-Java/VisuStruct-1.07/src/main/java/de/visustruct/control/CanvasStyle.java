package de.visustruct.control;

import java.awt.Color;

import javax.swing.LookAndFeel;
import javax.swing.UIManager;

import com.formdev.flatlaf.FlatDarkLaf;
import com.formdev.flatlaf.themes.FlatMacDarkLaf;

/**
 * Farben der Struktogramm-Zeichenfläche (nicht die Swing-Fenster).
 * Bei <b>Modern · dark</b> (FlatDark) wird eine hellere graue Fläche genutzt, passend zum dunklen UI.
 */
public final class CanvasStyle {

	private static Color background;
	private static Color diagramFrame;
	private static Color titleText;
	private static Color elementBorder;
	private static Color elementText;
	private static Color elementSelectedFill;
	private static Color dropPreview;
	private static Color dragFrame;
	private static Color elementFill;

	private CanvasStyle() {
	}

	static {
		applyLightPalette();
	}

	private static void applyLightPalette() {
		background = new Color(0xFAFAFA);
		diagramFrame = new Color(0xD1D5DB);
		titleText = new Color(0x111827);
		elementBorder = new Color(0x4B5563);
		elementText = new Color(0x111827);
		elementSelectedFill = new Color(0xBFDBFE);
		dropPreview = new Color(0x93C5FD);
		dragFrame = new Color(0x3B82F6);
		elementFill = Color.WHITE;
	}

	/** Zeichenfläche spürbar dunkler; Blöcke bleiben hell genug für Lesbarkeit. */
	private static void applyDarkPalette() {
		background = new Color(0x1E1E22);
		diagramFrame = new Color(0x6B6B70);
		titleText = new Color(0xF4F4F5);
		elementBorder = new Color(0x71717A);
		elementText = new Color(0x18181B);
		elementSelectedFill = new Color(0x1E3A5F);
		dropPreview = new Color(0x3B5A8C);
		dragFrame = new Color(0x5B9FFF);
		elementFill = new Color(0xECECF0);
	}

	private static boolean isFlatDarkTheme() {
		LookAndFeel laf = UIManager.getLookAndFeel();
		return laf instanceof FlatDarkLaf || laf instanceof FlatMacDarkLaf;
	}

	/**
	 * Nach Theme-Wechsel ({@link javax.swing.UIManager#setLookAndFeel}) aufrufen, z. B. aus {@link de.visustruct.view.UiTheme#applyAfterTheme()}.
	 */
	public static void syncToTheme() {
		if (isFlatDarkTheme()) {
			applyDarkPalette();
		} else {
			applyLightPalette();
		}
	}

	public static Color getBackground() {
		return background;
	}

	public static Color getDiagramFrame() {
		return diagramFrame;
	}

	public static Color getTitleText() {
		return titleText;
	}

	public static Color getElementBorder() {
		return elementBorder;
	}

	public static Color getElementText() {
		return elementText;
	}

	public static Color getElementSelectedFill() {
		return elementSelectedFill;
	}

	public static Color getDropPreview() {
		return dropPreview;
	}

	public static Color getDragFrame() {
		return dragFrame;
	}

	/** Füllfarbe der Blöcke (nicht markiert). */
	public static Color getElementFill() {
		return elementFill;
	}
}
