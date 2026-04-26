import java.util.Scanner;

public class CheckPin {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int anzahl = 0;
        const PIN = 1234;
        int pin = 0;
        do {
            input: pin "Pin eingeben";
            anzahl++;
        } while (PIN != pin && anzahl < 3);
        if (true) {
            System.out.println("Richtige Pin");
        } else {
            System.out.println("Falsche Pin");
        }
    }
}
