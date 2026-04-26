public class Fibonacci {
    public static void main(String[] args) {
        int anzahl = 10;
        int number1 = 1;
        System.out.println(number1);
        int number2 = 1;
        System.out.println(number2);
        int number3 = 0;
        for (int i = 2; i<anzahl; i++) {
            number3 = number1 + number2;
            System.out.println(number3);
            number1 = number2;
            number2 = number3;
        }
    }
}
