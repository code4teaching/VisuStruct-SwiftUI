package de.visustruct.other;
import java.awt.Container;
import java.awt.Font;

//Quelle: http://www.dpunkt.de/java/Referenz/Das_Paket_javax.swing/28.html
import javax.swing.JScrollPane;
import javax.swing.JTextArea;

public class JTextAreaEasy extends JTextArea {
    
	private static final long serialVersionUID = -4009874987394271922L;
	private JScrollPane scrollpane;
	/** Während der Quellcode-Generierung: Sammeln statt vieler {@link #append}-Aufrufe. */
	private StringBuilder quellcodeBatch;

    public JTextAreaEasy(){
       super();
       setLineWrap(false);
       setWrapStyleWord(false);
       //setBounds(0, 0, 400, 200);
    }
    
    public JTextAreaEasy(int xpos, int ypos, int breite, int hoehe){
       super();
       setLineWrap(false);
       setWrapStyleWord(false);
       setBounds(xpos, ypos, breite, hoehe);
    }
    
    public void setzeContainer(Container cp){
       scrollpane = new JScrollPane(this);//http://www.dpunkt.de/java/Programmieren_mit_Java/Oberflaechenprogrammierung/14.html
       scrollpane.setBounds(getBounds());
       cp.add(scrollpane);
    }
    
    public void hinzufuegen(String s){
       if (quellcodeBatch != null) {
    	   quellcodeBatch.append(s);
       } else {
    	   append(s);
       }
    }

    /** Startet gepufferte Ausgabe für {@link #hinzufuegen}/{@link #zeilenumbruch}; mit {@link #endQuellcodeBatch()} abschließen. */
    public void beginQuellcodeBatch() {
    	quellcodeBatch = new StringBuilder(16384);
    }

    /** Schreibt den Puffer einmal in die Textarea (siehe {@link #beginQuellcodeBatch()}). */
    public void endQuellcodeBatch() {
    	if (quellcodeBatch != null) {
    		setText(quellcodeBatch.toString());
    		quellcodeBatch = null;
    	}
    }
    
    public void einfuegenAnStelle(String s, int stelle){
       insert(s,stelle);
    }
    
    public void zeilenumbruch(){
       hinzufuegen("\n");
    }
    
    public void zeilenumbruchAnStelle(int stelle){
       einfuegenAnStelle("\n",stelle);
    }
    
    public void leeren(){
       quellcodeBatch = null;
       setText("");
    }
    
    public void setzeNurLesen(boolean nurLesen){
       setEditable(!nurLesen);
    }
    
    public String gibText(){
       return getText();
    }
    
    public void setzeText(String text){
       setText(text);
    }
    
    public String[] gibTextzeilenArray(){
       return getText().split("\n");//http://download.oracle.com/javase/1.4.2/docs/api/java/lang/String.html#split%28java.lang.String%29
    }
    
    public void setzeFont(Font font){
       setFont(font);
    }
}