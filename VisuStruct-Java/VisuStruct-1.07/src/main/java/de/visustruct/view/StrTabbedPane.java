package de.visustruct.view;
import java.awt.Color;
import java.awt.Component;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import javax.swing.BorderFactory;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JViewport;
import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import de.visustruct.control.Controlling;
import de.visustruct.control.Struktogramm;
import de.visustruct.i18n.I18n;

public class StrTabbedPane extends JTabbedPane implements ChangeListener{
   
   private static final long serialVersionUID = 1L;
   private Controlling controlling;
   //private boolean stateChangedFreigegeben;

   public StrTabbedPane(Controlling controlling){
      super(JTabbedPane.TOP, JTabbedPane.SCROLL_TAB_LAYOUT);
      this.controlling = controlling;
      setBorder(BorderFactory.createEmptyBorder(8, 6, 10, 10));

      addChangeListener(this);
      addKeyListener(controlling);

      addMouseListener(new MouseAdapter() {
         @Override
         public void mouseClicked(MouseEvent e) {
            if (e.getClickCount() != 2) {
               return;
            }
            int idx = indexAtLocation(e.getX(), e.getY());
            if (idx >= 0) {
               renameTabAt(idx);
            }
         }
      });
   }


   /**
    * Doppelklick auf den Reiter: Namen ändern. Stern ({@code *}) bei ungespeicherten Änderungen bleibt erhalten.
    * Ohne gespeicherte Datei: danach Speicherdialog (Ordner und Dateiname), damit der Speicherort gleich gewählt werden kann.
    */
   private void renameTabAt(int index) {
      String raw = getTitleAt(index);
      boolean dirty = raw.endsWith("*");
      String current = dirty ? raw.substring(0, raw.length() - 1) : raw;

      String neu = (String) JOptionPane.showInputDialog(controlling.getGUI(),
            I18n.tr("dialog.renameTab.message"), I18n.tr("dialog.renameTab.title"), JOptionPane.PLAIN_MESSAGE,
            null, null, current);
      if (neu == null) {
         return;
      }
      neu = neu.trim();
      if (neu.isEmpty()) {
         return;
      }
      if (neu.length() > 200) {
         neu = neu.substring(0, 200);
      }

      setTitleAt(index, neu + (dirty ? "*" : ""));
      Struktogramm str = gibStruktogrammAt(index);
      if (str != null && str.gibAktuellenSpeicherpfad().isEmpty()) {
         str.setVorgeschlagenenSpeicherBasisnamen(neu);
      }
      controlling.titelleisteAktualisieren();

      setSelectedIndex(index);
      if (str != null && str.gibAktuellenSpeicherpfad().isEmpty()) {
         // Nach dem Umbenennen-Dialog erst im nächsten EDT-Takt speichern (sonst bleibt der Speicherdialog unter macOS oft ohne Wirkung).
         SwingUtilities.invokeLater(() -> controlling.speichern(false));
      }
   }


   private Struktogramm gibStruktogrammAt(int index) {
      if (index < 0 || index >= getTabCount()) {
         return null;
      }
      Component c = getComponentAt(index);
      if (!(c instanceof JScrollPane)) {
         return null;
      }
      Component view = ((JScrollPane) c).getViewport().getView();
      return (view instanceof Struktogramm) ? (Struktogramm) view : null;
   }


   /** Tab-Index des gegebenen Struktogramms (nicht abhängig vom ausgewählten Reiter). */
   public int indexOfStruktogramm(Struktogramm str) {
      if (str == null) {
         return -1;
      }
      for (int i = 0; i < getTabCount(); i++) {
         if (gibStruktogrammAt(i) == str) {
            return i;
         }
      }
      return -1;
   }


   public void titelFuerStruktogrammSetzen(Struktogramm str, String titel) {
      int i = indexOfStruktogramm(str);
      if (i >= 0 && titel != null) {
         setTitleAt(i, titel);
      }
   }


   public void titelFuerStruktogrammBearbeitetMarkieren(Struktogramm str, boolean bearbeitet) {
      int i = indexOfStruktogramm(str);
      if (i < 0) {
         return;
      }
      String titel = getTitleAt(i);
      if (bearbeitet) {
         if (titel.isEmpty()) {
            titel = I18n.tr("tab.untitled") + "*";
         } else if (titel.charAt(titel.length() - 1) != '*') {
            titel += "*";
         }
      } else {
         if (!titel.isEmpty() && titel.charAt(titel.length() - 1) == '*') {
            titel = titel.substring(0, titel.length() - 1);
         }
      }
      setTitleAt(i, titel);
   }
   
   
   public GUI gibGUI(){
	   return controlling.getGUI();
   }
   
//   public void changeListenerAktivieren(){
//      addChangeListener(this);
//      stateChangedFreigegeben = true;
//   }
   
   
   public Struktogramm struktogrammHinzufuegen(){
      Struktogramm str = new Struktogramm(this);
      JScrollPane scroll = new JScrollPane(str);
      Color bc = UIManager.getColor("Component.borderColor");
      if (bc == null) {
         bc = UIManager.getColor("controlShadow");
      }
      if (bc == null) {
         bc = Color.LIGHT_GRAY;
      }
      scroll.setBorder(BorderFactory.createLineBorder(bc, 1, true));
      add(I18n.tr("tab.untitled"), scroll);
      //stateChangedFreigegeben = false; //changeListener kurz deaktivieren...
      setSelectedIndex(getTabCount() -1); //...weil es sonst in graphicsInitialisieren Probleme gibt
      //stateChangedFreigegeben = true;
      return str;
   }
   
   
   public void titelDerAktuellenSeiteSetzen(String titel){
      Struktogramm s = gibAktuellesStruktogramm();
      if (s != null) {
         titelFuerStruktogrammSetzen(s, titel);
      }
   }
   
   public void titelDerAktuellenSeiteAlsBearbeitetOderAlsGespespeichertMarkieren(boolean bearbeitet){
      Struktogramm dokumentStr = gibAktuellesStruktogramm();
      if (dokumentStr != null) {
         titelFuerStruktogrammBearbeitetMarkieren(dokumentStr, bearbeitet);
      }
   }
   
   
   public void aktuellesStruktogrammschliessen(){
      Object[] opts = {
            I18n.tr("dialog.saveBeforeClose.save"),
            I18n.tr("dialog.saveBeforeClose.dontSave"),
            I18n.tr("dialog.saveBeforeClose.cancel"),
      };
      int r = JOptionPane.showOptionDialog(controlling.getGUI(),
            I18n.tr("dialog.saveBeforeClose.message"),
            I18n.tr("dialog.saveBeforeClose.title"),
            JOptionPane.DEFAULT_OPTION,
            JOptionPane.QUESTION_MESSAGE,
            null, opts, opts[2]);
      if (r == 0) {
         controlling.speichern(false);
         remove(getSelectedIndex());
      } else if (r == 1) {
         remove(getSelectedIndex());
      }
   }
   
   
   /** Alle geöffneten Diagramme nach Theme-Wechsel neu einfärben und zeichnen. */
   public void refreshAllStruktogrammeNachThemeWechsel() {
      for (int i = 0; i < getTabCount(); i++) {
         Struktogramm str = gibStruktogrammAt(i);
         if (str != null) {
            str.refreshAfterThemeChange();
         }
      }
   }


   public Struktogramm gibAktuellesStruktogramm(){
      if(getTabCount() > 0){
         /*getSelectedComponent() liefert das JScrollPane,
           dieses liefert mit getComponents()[0] seinen JViewPort,
           dieser liefert mit getComponents()[0] dann das Struktogramm*/
         return (Struktogramm)(((JViewport)(((JScrollPane)getSelectedComponent()).getComponents())[0]).getComponents())[0];
      }else{
         return null;
      }
   }
   
   
   public void stateChanged(ChangeEvent e){
//      if (stateChangedFreigegeben && (getTabCount() > 1)){//wenn es das erste ist (nach Schließen), wird diese Methode aufgerufen und graphicsInitialisieren klappt noch nicht, darum nicht zulassen
//
//
//         Struktogramm str = gibAktuellesStruktogramm();
//         if (str != null){
//            str.graphicsInitialisieren();
//            str.zeichenbereichAktualisieren();
//            str.zeichne();
//            gui.titelleisteAktualisieren();
//         }
//      }
	   
	   controlling.titelleisteAktualisieren();
   }
   
   
   public boolean einOderMehrereStruktogrammeNichtGespeichert(){
      for(int i=0; i < getTabCount(); i++){
         String t = getTitleAt(i);
         if(!t.isEmpty() && t.charAt(t.length() - 1) == '*'){
            return true;	 
         }
      }
      
      return false;
   }
}