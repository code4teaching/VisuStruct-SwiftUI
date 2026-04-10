package de.visustruct.struktogrammelemente;

import java.awt.Graphics2D;

import de.visustruct.control.GlobalSettings;
import de.visustruct.control.Struktogramm;
import de.visustruct.other.JTextAreaEasy;
import de.visustruct.view.CodeErzeuger;

public class Aussprung extends Anweisung {

	public Aussprung(Graphics2D g){
		super(g);

		setzeText(GlobalSettings.gibElementBeschriftung(Struktogramm.typAussprung));
	}


	@Override
	public void zeichne(){
		super.zeichne();

		g.drawLine(gibX() +10,gibY(),gibX(),gibY()+gibHoehe()/2);
		g.drawLine(gibX() +10,gibY()+gibHoehe(),gibX(),gibY()+gibHoehe()/2);
	}



	@Override
	public void quellcodeGenerieren(int typ, int anzahlEingerueckt, int anzahlEinzuruecken, boolean alsKommentar, JTextAreaEasy textarea){
		String s = "";

		if (typ == CodeErzeuger.typPython) {
			s = co("kommentar") + "break  # / return  " + co("text") + co("kommentarzu");
		} else {
			s = co("kommentar") + "break;/return; " + co("text") + co("kommentarzu");
		}

		textarea.hinzufuegen(wandleZuAusgabe(s, typ,anzahlEingerueckt,alsKommentar)+"\n");
	}

}