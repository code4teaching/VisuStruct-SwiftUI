package de.visustruct.view;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Insets;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.AbstractButton;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JRadioButton;
import javax.swing.WindowConstants;

import de.visustruct.control.GlobalSettings;
import de.visustruct.i18n.I18n;
import de.visustruct.control.Struktogramm;
import de.visustruct.other.JNumberField;
import de.visustruct.other.JTextAreaEasy;

/** Dialog: Quellcode-Export als Java oder Python. */
public class CodeErzeuger extends JDialog {

	private static final long serialVersionUID = 6073577055724789562L;

	private ButtonGroup buttongroup = new ButtonGroup();
	private JRadioButton javaButton = new JRadioButton();
	private JRadioButton pythonButton = new JRadioButton();
	private JTextAreaEasy textarea;
	private JCheckBox checkboxKommentare = new JCheckBox();
	private JLabel jLabel1 = new JLabel();
	private JNumberField numberfieldEinrueckung = new JNumberField();
	private JLabel jLabel2 = new JLabel();
	private JNumberField numberfieldZeichenzahl = new JNumberField();
	private JButton buttonCodeErzeugen = new JButton();
	private JButton buttonSchliessen = new JButton();
	private Struktogramm str;

	public static final int typJava = 0;
	/** {@code match}/{@code case} (Python 3.10+), Einrückung wie bei Java. */
	public static final int typPython = 1;

	public CodeErzeuger(JFrame owner, String title, boolean modal, Struktogramm str) {
		super(owner, title, modal);
		setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
		int frameWidth = 498;
		int frameHeight = 418;
		setSize(frameWidth, frameHeight);
		Dimension d = Toolkit.getDefaultToolkit().getScreenSize();
		int x = (d.width - getSize().width) / 2;
		int y = (d.height - getSize().height) / 2;
		setLocation(x, y);
		Container cp = getContentPane();
		cp.setLayout(null);

		javaButton.setBounds(16, 220, 200, 17);
		javaButton.setText(I18n.tr("dialog.codeGen.targetJava"));
		cp.add(javaButton);
		pythonButton.setBounds(16, 242, 200, 17);
		pythonButton.setText(I18n.tr("dialog.codeGen.targetPython"));
		cp.add(pythonButton);
		buttongroup.add(javaButton);
		buttongroup.add(pythonButton);
		if (GlobalSettings.getCodeErzeugerProgrammiersprache() == typPython) {
			pythonButton.setSelected(true);
		} else {
			javaButton.setSelected(true);
		}

		checkboxKommentare.setBounds(16, 268, 400, 17);
		checkboxKommentare.setText(I18n.tr("dialog.codeGen.emitComments"));
		checkboxKommentare.setSelected(GlobalSettings.isCodeErzeugerAlsKommentar());
		cp.add(checkboxKommentare);
		jLabel1.setBounds(16, 296, 323, 16);
		jLabel1.setText(I18n.tr("dialog.codeGen.indentFirstLine"));
		jLabel1.setFont(new Font("MS Sans Serif", Font.PLAIN, 13));
		cp.add(jLabel1);
		numberfieldEinrueckung.setBounds(344, 296, 49, 24);
		numberfieldEinrueckung.setText(""+GlobalSettings.getCodeErzeugerEinrueckungGesamt());
		cp.add(numberfieldEinrueckung);
		jLabel2.setBounds(16, 328, 300, 16);
		jLabel2.setText(I18n.tr("dialog.codeGen.spacesPerLevel"));
		jLabel2.setFont(new Font("MS Sans Serif", Font.PLAIN, 13));
		cp.add(jLabel2);
		numberfieldZeichenzahl.setBounds(344, 328, 49, 24);
		numberfieldZeichenzahl.setText(""+GlobalSettings.getCodeErzeugerEinrueckungProStufe());
		cp.add(numberfieldZeichenzahl);
		buttonCodeErzeugen.setBounds(16, 368, 147, 25);
		buttonCodeErzeugen.setText(I18n.tr("dialog.codeGen.generate"));
		buttonCodeErzeugen.setMargin(new Insets(2, 2, 2, 2));
		buttonCodeErzeugen.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				buttonCodeErzeugen_ActionPerformed(evt);
			}
		});
		cp.add(buttonCodeErzeugen);
		buttonSchliessen.setBounds(296, 368, 91, 25);
		buttonSchliessen.setText(I18n.tr("dialog.codeGen.close"));
		buttonSchliessen.setMargin(new Insets(2, 2, 2, 2));
		buttonSchliessen.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				buttonSchliessen_ActionPerformed(evt);
			}
		});
		cp.add(buttonSchliessen);

		textarea = new JTextAreaEasy(8,10,480,200);
		textarea.setzeFont(new Font("Monospaced", Font.PLAIN, 15));
		textarea.setzeContainer(cp);

		this.str = str;

		setResizable(false);
		setVisible(true);
	}

	private static JRadioButton getSelectedRadioButton(ButtonGroup bg) {
		for (java.util.Enumeration<AbstractButton> e = bg.getElements(); e.hasMoreElements();) {
			AbstractButton b = e.nextElement();
			if (b.isSelected()) {
				return (JRadioButton) b;
			}
		}
		return null;
	}

	public void buttonCodeErzeugen_ActionPerformed(ActionEvent evt) {
		if (numberfieldEinrueckung.isNumeric() && numberfieldZeichenzahl.isNumeric()){

			JRadioButton radioB = getSelectedRadioButton(buttongroup);
			int typ = typJava;
			if (radioB == pythonButton) {
				typ = typPython;
			}

			textarea.leeren();
			textarea.beginQuellcodeBatch();
			final int einrueckung = numberfieldEinrueckung.getInt();
			final int einrueckungProStufe = numberfieldZeichenzahl.getInt();
			final boolean alsKommentar = checkboxKommentare.isSelected();
			try {
				str.gibListe().quellcodeAllerUnterelementeGenerieren(typ, einrueckung, einrueckungProStufe, alsKommentar, textarea);
			} finally {
				textarea.endQuellcodeBatch();
			}
			GlobalSettings.setCodeErzeugerEinrueckungGesamt(einrueckung);
			GlobalSettings.setCodeErzeugerEinrueckungProStufe(einrueckungProStufe);
			GlobalSettings.setCodeErzeugerProgrammiersprache(typ);
			GlobalSettings.setCodeErzeugerAlsKommentar(alsKommentar);
			GlobalSettings.saveSettings();
		}else{
			JOptionPane.showMessageDialog(this, I18n.tr("dialog.codeInvalidInput.message"),
					I18n.tr("dialog.codeInvalidInput.title"), JOptionPane.ERROR_MESSAGE);
		}
	}

	public static String gibKommentarZeichen(boolean kommentarStart, int codeTyp) {
		if (codeTyp == typPython) {
			return "\"\"\"";
		}
		if (kommentarStart) {
			return "/*";
		}
		return "*/";
	}

	public void buttonSchliessen_ActionPerformed(ActionEvent evt) {
		setVisible(false);
	}

}
