package de.visustruct.struktogrammelemente;

import java.awt.Graphics2D;
import java.awt.Rectangle;

import de.visustruct.control.GlobalSettings;
import de.visustruct.control.Struktogramm;
import de.visustruct.other.JTextAreaEasy;


public class Anweisung extends StruktogrammElement {

   public Anweisung(String text, Graphics2D g){
      super(g);
      obererRandZusatz = 10;
      setzeText(text);
   }

   public Anweisung(Graphics2D g){
      this(GlobalSettings.gibElementBeschriftung(Struktogramm.typAnweisung),g);
   }
   
   
   
   
   @Override
   public void quellcodeGenerieren(int typ, int anzahlEingerueckt, int anzahlEinzuruecken, boolean alsKommentar, JTextAreaEasy textarea){
      String zeile;
      if (alsKommentar) {
    	  zeile = wandleZuAusgabe(co("kommentar") + co("text") + co("kommentarzu") + "\n", typ, anzahlEingerueckt, true)
    			  + wandleZuAusgabe(co("text"), typ, anzahlEingerueckt, false);
      } else {
    	  zeile = wandleZuAusgabe(co("kommentar") + co("text") + co("kommentarzu"), typ, anzahlEingerueckt, false);
      }
      textarea.hinzufuegen(zeile + "\n");
   }
   
   

   
   
   @Override
   protected int gibMindestbreite(){
      return gibBreiteDerBreitestenTextzeile() + getXVergroesserung() + 30;
   }
   
   @Override
   public Rectangle zeichenbereichAktualisieren(int x, int y){
      
      bereich.setBounds(x,y, gibMindestbreite() , getObererRand() + getYVergroesserung());

      return bereich;
   }
   
}