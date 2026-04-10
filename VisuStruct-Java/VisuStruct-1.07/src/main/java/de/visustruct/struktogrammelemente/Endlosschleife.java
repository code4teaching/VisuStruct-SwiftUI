package de.visustruct.struktogrammelemente;

import java.awt.Graphics2D;

import de.visustruct.control.GlobalSettings;
import de.visustruct.control.Struktogramm;
import de.visustruct.other.JTextAreaEasy;
import de.visustruct.view.CodeErzeuger;

public class Endlosschleife extends Schleife {//erbt von Schleife

   public Endlosschleife(Graphics2D g){
      super(g);

      setUntererRand(40);//obererRand wird schon in Schleife gesetzt
      setzeText(GlobalSettings.gibElementBeschriftung(Struktogramm.typEndlosschleife));
   }
   
   
   //siehe DoUntilSchleife
   @Override
   public void quellcodeGenerieren(int typ, int anzahlEingerueckt, int anzahlEinzuruecken, boolean alsKommentar, JTextAreaEasy textarea){
      String vorher = "";
      String nachher = "";


      if (typ == CodeErzeuger.typPython) {
         vorher = "while True"+co("zwangkommentar")+co("text")+co("zwangkommentarzu")+":\n";
         nachher = "";
      } else {
         vorher = "while(true)"+co("zwangkommentar")+co("text")+co("zwangkommentarzu")+"{\n";
         nachher = "}\n";
      }

      textarea.hinzufuegen(wandleZuAusgabe(vorher,typ,anzahlEingerueckt,alsKommentar));
      liste.quellcodeAllerUnterelementeGenerieren(typ,anzahlEingerueckt+anzahlEinzuruecken,anzahlEinzuruecken,alsKommentar,textarea);
      if (!nachher.isEmpty()) {
         textarea.hinzufuegen(wandleZuAusgabe(nachher,typ,anzahlEingerueckt,alsKommentar));
      }
   }
   
}