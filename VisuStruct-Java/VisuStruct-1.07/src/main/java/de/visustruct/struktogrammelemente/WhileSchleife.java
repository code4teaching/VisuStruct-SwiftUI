package de.visustruct.struktogrammelemente;

import java.awt.Graphics2D;

import de.visustruct.control.GlobalSettings;
import de.visustruct.control.Struktogramm;
import de.visustruct.other.JTextAreaEasy;
import de.visustruct.view.CodeErzeuger;

public class WhileSchleife extends Schleife { //erbt von Schleife

   public WhileSchleife(Graphics2D g){
      super(g);
      setzeText(GlobalSettings.gibElementBeschriftung(Struktogramm.typWhileSchleife));
   }
   
   
   @Override
   public boolean neuesElementMussOberhalbPlatziertWerden(int y){
      return y < gibY() + getObererRand()/2;//hier wird anhand der Position der Maus im Kopfteil entschieden, weil man beim ganzer Betrachtung nicht unterhalb einfügen kann
   }
   
   
   
   @Override      //siehe DoUntilSchleife
   public void quellcodeGenerieren(int typ, int anzahlEingerueckt, int anzahlEinzuruecken, boolean alsKommentar, JTextAreaEasy textarea){
      String vorher = "";
      String nachher = "";


      if (typ == CodeErzeuger.typPython) {
         vorher = quellcodeMitKommentarVorspann("while ", ":\n", typ, anzahlEingerueckt, alsKommentar);
         nachher = "";
      } else {
         vorher = quellcodeMitKommentarVorspann("while(", "){\n", typ, anzahlEingerueckt, alsKommentar);
         nachher = "}\n";
      }

      textarea.hinzufuegen(wandleZuAusgabe(vorher,typ,anzahlEingerueckt,alsKommentar));
      liste.quellcodeAllerUnterelementeGenerieren(typ,anzahlEingerueckt+anzahlEinzuruecken,anzahlEinzuruecken,alsKommentar,textarea);
      if (!nachher.isEmpty()) {
         textarea.hinzufuegen(wandleZuAusgabe(nachher,typ,anzahlEingerueckt,alsKommentar));
      }
   }
   
}