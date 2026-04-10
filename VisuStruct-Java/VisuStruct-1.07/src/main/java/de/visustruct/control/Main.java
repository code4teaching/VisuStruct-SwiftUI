package de.visustruct.control;

import java.awt.Desktop;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.swing.SwingUtilities;

import de.visustruct.i18n.I18n;

public class Main {

	/**
	 * Pfade aus dem macOS-„Datei öffnen“-Ereignis, die eintreffen bevor {@link Controlling} fertig ist.
	 */
	private static final List<String> pendingMacOpenPaths = new CopyOnWriteArrayList<>();

	public static void main(String[] args) {

		// Vor dem ersten AWT-/Java2D-Zugriff: auf macOS den Metal-Pipeline-Bug umgehen,
		// der bei manchen JDKs ein leeres/graues Fenster erzeugt.
		String os = System.getProperty("os.name", "").toLowerCase();
		boolean isMac = os.contains("mac");
		if (isMac) {
			System.setProperty("sun.java2d.metal", "false");
			// Menü im Fenster: Mit FlatLaf + Bildschirm-Menüleiste sind unter macOS oft „Speichern“ u. a. grau oder ohne Wirkung.
			System.setProperty("apple.laf.useScreenMenuBar", "false");
			// Menüleiste links neben „Apple“: Anzeigename statt Startklassenname „Main“
			// (muss vor dem ersten AWT-Zugriff gesetzt werden, gleicher Wert wie GlobalSettings.APP_DISPLAY_NAME).
			System.setProperty("apple.awt.application.name", GlobalSettings.APP_DISPLAY_NAME);
		}

		GlobalSettings.init();
		I18n.syncWithSettings();
		System.setProperty("com.apple.mrj.application.apple.menu.about.name", GlobalSettings.guiTitel);

		final String[] startArgs = args != null ? args : new String[0];

		final Controlling[] controllingHolder = new Controlling[1];

		SwingUtilities.invokeLater(() -> {
			// OpenFilesHandler muss vor new Controlling stehen, sonst geht das Ereignis beim
			// Start per Doppelklick auf .visustruct / .xml / Legacy .strk verloren.
			if (isMac && Desktop.isDesktopSupported()) {
				Desktop d = Desktop.getDesktop();
				if (d.isSupported(Desktop.Action.APP_OPEN_FILE)) {
					d.setOpenFileHandler(e -> {
						for (File f : e.getFiles()) {
							if (f == null) {
								continue;
							}
							String path = f.getAbsolutePath();
							SwingUtilities.invokeLater(() -> deliverMacOpenFile(path, controllingHolder));
						}
					});
				}
			}

			controllingHolder[0] = new Controlling(startArgs);
			for (String p : new ArrayList<>(pendingMacOpenPaths)) {
				controllingHolder[0].oeffneStruktogrammDateiAusFinder(p);
			}
			pendingMacOpenPaths.clear();
		});
	}

	private static void deliverMacOpenFile(String path, Controlling[] holder) {
		if (holder[0] != null) {
			holder[0].oeffneStruktogrammDateiAusFinder(path);
		} else {
			pendingMacOpenPaths.add(path);
		}
	}
}
