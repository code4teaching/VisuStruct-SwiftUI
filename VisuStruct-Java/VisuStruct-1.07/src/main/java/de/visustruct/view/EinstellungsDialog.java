package de.visustruct.view;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.Toolkit;

import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.SwingUtilities;
import javax.swing.WindowConstants;

import de.visustruct.control.GlobalSettings;
import de.visustruct.i18n.I18n;

public class EinstellungsDialog extends JDialog {

	private static final long serialVersionUID = -6402017961524470279L;

	public static final int anzahlStruktogrammElemente = 10;

	private final GUI hostGui;

	public EinstellungsDialog(GUI gui, boolean modal) {
		super(gui, I18n.tr("dialog.elementText.title"), modal);
		hostGui = gui;
		setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
		setSize(500, 480);
		Dimension d = Toolkit.getDefaultToolkit().getScreenSize();
		setLocation((d.width - getSize().width) / 2, (d.height - getSize().height) / 2);
		setLayout(new BorderLayout(10, 10));

		JLabel kopf = new JLabel("<html><div style='width:420px'>" + I18n.tr("dialog.elementText.intro") + "</div></html>");
		kopf.setBorder(BorderFactory.createEmptyBorder(4, 8, 0, 8));
		add(kopf, BorderLayout.NORTH);

		int startIdx = GlobalSettings.getElementBeschriftungPresetIndex();
		if (startIdx < 0 || startIdx >= ElementBeschriftungPresets.ANZAHL_PRESETS) {
			startIdx = ElementBeschriftungPresets.PRESET_ENGLISH_JAVA;
		}

		JPanel radioPanel = new JPanel();
		radioPanel.setLayout(new BoxLayout(radioPanel, BoxLayout.Y_AXIS));
		radioPanel.setBorder(BorderFactory.createEmptyBorder(0, 8, 0, 8));
		ButtonGroup gruppe = new ButtonGroup();
		JRadioButton[] radios = new JRadioButton[ElementBeschriftungPresets.ANZAHL_PRESETS];
		int startDialogPlatz = ElementBeschriftungPresets.dialogPlatzFuerPreset(startIdx);
		for (int u = 0; u < ElementBeschriftungPresets.PRESET_DIALOG_REIHENFOLGE.length; u++) {
			int preset = ElementBeschriftungPresets.PRESET_DIALOG_REIHENFOLGE[u];
			JRadioButton rb = new JRadioButton(ElementBeschriftungPresets.getPresetAnzeigename(preset));
			rb.setActionCommand(Integer.toString(u));
			gruppe.add(rb);
			radioPanel.add(rb);
			radioPanel.add(Box.createVerticalStrut(2));
			radios[u] = rb;
			if (u == startDialogPlatz) {
				rb.setSelected(true);
			}
		}

		JTextArea vorschau = new JTextArea();
		vorschau.setEditable(false);
		vorschau.setLineWrap(true);
		vorschau.setWrapStyleWord(true);
		vorschau.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 12));
		vorschau.setBorder(BorderFactory.createEmptyBorder(6, 8, 6, 8));
		vorschau.setText(ElementBeschriftungPresets.alsVorschauText(startIdx));

		Runnable vorschauAktualisieren = () -> {
			int sel = ElementBeschriftungPresets.PRESET_ENGLISH_JAVA;
			for (int u = 0; u < radios.length; u++) {
				if (radios[u].isSelected()) {
					sel = ElementBeschriftungPresets.presetIndexAtDialogPlatz(u);
					break;
				}
			}
			vorschau.setText(ElementBeschriftungPresets.alsVorschauText(sel));
		};
		for (JRadioButton rb : radios) {
			rb.addActionListener(e -> vorschauAktualisieren.run());
		}

		JScrollPane scroll = new JScrollPane(vorschau);
		scroll.setBorder(BorderFactory.createTitledBorder(I18n.tr("dialog.elementText.previewTitle")));

		JPanel mitte = new JPanel(new BorderLayout(0, 8));
		mitte.setBorder(BorderFactory.createEmptyBorder(0, 4, 0, 8));
		mitte.add(radioPanel, BorderLayout.NORTH);
		mitte.add(scroll, BorderLayout.CENTER);
		add(mitte, BorderLayout.CENTER);

		JPanel unten = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 8));
		JButton abbrechen = new JButton(I18n.tr("dialog.elementText.cancel"));
		abbrechen.addActionListener(e -> setVisible(false));
		JButton ok = new JButton(I18n.tr("dialog.elementText.ok"));
		ok.addActionListener(e -> {
			int sel = ElementBeschriftungPresets.PRESET_ENGLISH_JAVA;
			for (int u = 0; u < radios.length; u++) {
				if (radios[u].isSelected()) {
					sel = ElementBeschriftungPresets.presetIndexAtDialogPlatz(u);
					break;
				}
			}
			GlobalSettings.wendeElementBeschriftungsPresetAn(sel);
			GlobalSettings.saveSettings();
			SwingUtilities.invokeLater(() -> {
				hostGui.rebuildMenuBar();
				hostGui.gibAuswahlPanel().aktualisiereBeschriftungen();
				hostGui.gibAuswahlPanel().revalidate();
				hostGui.gibAuswahlPanel().repaint();
				SwingUtilities.invokeLater(() -> hostGui.gibAuswahlPanel().aktualisiereBeschriftungen());
			});
			setVisible(false);
		});
		unten.add(abbrechen);
		unten.add(ok);
		add(unten, BorderLayout.SOUTH);

		setVisible(true);
	}
}
