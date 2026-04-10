package de.visustruct.struktogrammelemente;

import java.awt.Graphics2D;

import de.visustruct.control.GlobalSettings;
import de.visustruct.control.Struktogramm;
import de.visustruct.other.JTextAreaEasy;
import de.visustruct.view.CodeErzeuger;

public class Verzweigung extends Fallauswahl { //erbt von Fallauswahl
   private boolean seitenSindVertauscht;
   private static final String jaText = "true";
   private static final String neinText = "false";

   public Verzweigung(Graphics2D g){
      super(g,2);
      gibLinkeSeite().setzeBeschreibung(jaText);
      gibRechteSeite().setzeBeschreibung(neinText);
      xVerschiebungFuerTrennlinie = 0;
      yVerschiebungFuerTrennLinie = 0; //die schrägen Linien sollen bis zum Boden des Kopfteils gehen
      obererRandZusatz = 20;
      seitenSindVertauscht = false;
      setzeText(GlobalSettings.gibElementBeschriftung(Struktogramm.typVerzweigung));
   }
   
   
   @Override  //siehe Fallauswahl
   public void quellcodeGenerieren(int typ, int anzahlEingerueckt, int anzahlEinzuruecken, boolean alsKommentar, JTextAreaEasy textarea){
      String vorher = "";
      String nachher = "";
      String zwischenStueck = "";


      if (typ == CodeErzeuger.typPython) {
         vorher = quellcodeMitKommentarVorspann("if ", ":\n", typ, anzahlEingerueckt, alsKommentar);
         zwischenStueck = "else:\n";
         nachher = "";
      } else {
         vorher = quellcodeMitKommentarVorspann("if(", "){\n", typ, anzahlEingerueckt, alsKommentar);
         zwischenStueck = "}else{\n";
         nachher = "}\n";
      }

      textarea.hinzufuegen(wandleZuAusgabe(vorher,typ,anzahlEingerueckt,alsKommentar));

      StruktogrammElementListe jaSeite;
      StruktogrammElementListe neinSeite;
      if (seitenSindVertauscht){
         jaSeite = gibRechteSeite();
         neinSeite = gibLinkeSeite();
      }else{
         jaSeite = gibLinkeSeite();
         neinSeite = gibRechteSeite();
      }

      jaSeite.quellcodeAllerUnterelementeGenerieren(typ,anzahlEingerueckt+anzahlEinzuruecken,anzahlEinzuruecken,alsKommentar,textarea);
      textarea.hinzufuegen(wandleZuAusgabe(zwischenStueck,typ,anzahlEingerueckt,alsKommentar));
      neinSeite.quellcodeAllerUnterelementeGenerieren(typ,anzahlEingerueckt+anzahlEinzuruecken,anzahlEinzuruecken,alsKommentar,textarea);

      if (!nachher.isEmpty()) {
         textarea.hinzufuegen(wandleZuAusgabe(nachher,typ,anzahlEingerueckt,alsKommentar));
      }

   }
   
   
   
   
   
   private StruktogrammElementListe gibLinkeSeite(){
      return listen.get(0);
   }
   
   private StruktogrammElementListe gibRechteSeite(){
      return listen.get(1);
   }

   
   
   public void seitenVertauschen(){
      listenTauschen(0,1);
      seitenSindVertauscht = !seitenSindVertauscht;
   }
   
   
   
   @Override
   public void erstelleNeueSpalte(){

   }

}
