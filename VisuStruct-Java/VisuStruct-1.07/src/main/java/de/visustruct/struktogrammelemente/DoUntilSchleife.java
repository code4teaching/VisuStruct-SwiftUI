package de.visustruct.struktogrammelemente;

import java.awt.Graphics2D;

import de.visustruct.control.GlobalSettings;
import de.visustruct.control.Struktogramm;
import de.visustruct.other.JTextAreaEasy;
import de.visustruct.view.CodeErzeuger;

public class DoUntilSchleife extends Schleife {//erbt von Schleife

   public DoUntilSchleife(Graphics2D g){
      super(g);
      
      setzeText(GlobalSettings.gibElementBeschriftung(Struktogramm.typDoUntilSchleife));
   }
   
   
   
   @Override
   protected void textZeichnen(){
      int texthoehe = gibTexthoehe(text[0]);
      int yVerschiebungAktuell = gibHoehe() -15; //Position der untersten Zeile: 15 Pixel über dem unteren Rand

      g.setColor(getFarbeSchrift());
      
      //Textzeilen werden von unten nach oben gezeichnet (von der Letzten bis zur Ersten)
      for (int i=text.length -1; i >= 0; i--){
         g.drawString(text[i], gibX() + gibXVerschiebungFuerTextInMitte(text[i]), gibY() + yVerschiebungAktuell);
         yVerschiebungAktuell -= texthoehe;
      }
   }
   
   
   @Override
   public boolean neuesElementMussOberhalbPlatziertWerden(int y){
      return y < gibY() + gibHoehe() - getUntererRand()/2;//hier wird anhand der Position der Maus im Kopfteil (der unten ist) entschieden, weil man beim ganzer Betrachtung nicht unterhalb einfügen kann
   }
   
   
   @Override
   protected void randGroesseSetzen(){
      setUntererRand(obererRandZusatz + text.length * gibTexthoehe(text[0]));//der untere Rand ist der Zusatzrand plus die Höhe aller Textzeilen (obererRandZusatz heißt nur oberer..., weil DoUntilSchleife von Schleife erbt und dort von einem oberen Rand ausgegangen wird)
   }
   
   
   
   

   @Override
   public void quellcodeGenerieren(int typ, int anzahlEingerueckt, int anzahlEinzuruecken, boolean alsKommentar, JTextAreaEasy textarea){
     String vorher = "";
      String nachher = "";


      if (typ == CodeErzeuger.typPython) {
         vorher = "while True:\n";
         int bodyStart = anzahlEingerueckt + anzahlEinzuruecken;
         nachher = quellcodeMitKommentarVorspann("if not (", "):\n", typ, bodyStart, alsKommentar)
               + wandleZuAusgabe("break\n", typ, bodyStart + anzahlEinzuruecken, alsKommentar);
      } else {
         vorher = "do{\n";
         nachher = quellcodeMitKommentarVorspann("}while(", ");\n", typ, anzahlEingerueckt, alsKommentar);
      }

      textarea.hinzufuegen(wandleZuAusgabe(vorher, typ, anzahlEingerueckt, alsKommentar));
      liste.quellcodeAllerUnterelementeGenerieren(typ, anzahlEingerueckt + anzahlEinzuruecken, anzahlEinzuruecken, alsKommentar, textarea);
      if (typ == CodeErzeuger.typPython) {
         textarea.hinzufuegen(wandleZuAusgabe(nachher, typ, 0, alsKommentar));
      } else {
         textarea.hinzufuegen(wandleZuAusgabe(nachher, typ, anzahlEingerueckt, alsKommentar));
      }
   }
   
   
   
   @Override
	public int getObererRand(){
		return 0;
	}
   
   @Override
	public int getUntererRand(){
		return super.getUntererRand() + getYVergroesserung();
	}
   
}