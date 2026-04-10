package de.visustruct.control;

import java.awt.Desktop;
import java.awt.Taskbar;
import java.awt.desktop.AboutEvent;
import java.awt.desktop.AboutHandler;
import java.awt.desktop.QuitEvent;
import java.awt.desktop.QuitHandler;
import java.awt.desktop.QuitResponse;

import javax.swing.ImageIcon;

public class MacHandler implements AboutHandler, QuitHandler {

	private final Controlling controlling;

	public MacHandler(Controlling controlling) {

		// apple.laf.useScreenMenuBar wird in Main gesetzt (Menü im Fenster für zuverlässiges Speichern unter FlatLaf).
		System.setProperty("com.apple.mrj.application.apple.menu.about.name", GlobalSettings.guiTitel);

		this.controlling = controlling;

		if (Desktop.isDesktopSupported()) {
			Desktop desktop = Desktop.getDesktop();
			if (desktop.isSupported(Desktop.Action.APP_ABOUT)) {
				desktop.setAboutHandler(this);
			}
			if (desktop.isSupported(Desktop.Action.APP_QUIT_HANDLER)) {
				desktop.setQuitHandler(this);
			}
			// Dateien per Doppelklick: OpenFilesHandler wird in Main registriert (vor new Controlling).
		}

		if (Taskbar.isTaskbarSupported()) {
			Taskbar taskbar = Taskbar.getTaskbar();
			if (taskbar.isSupported(Taskbar.Feature.ICON_IMAGE)) {
				taskbar.setIconImage(new ImageIcon(getClass().getResource(GlobalSettings.logoName)).getImage());
			}
		}
	}

	@Override
	public void handleQuitRequestWith(QuitEvent quitEvent, QuitResponse response) {
		if (!controlling.programmBeendenGeklickt()) {
			response.cancelQuit();
		}
	}

	@Override
	public void handleAbout(AboutEvent event) {
		controlling.showInfo();
	}

}
