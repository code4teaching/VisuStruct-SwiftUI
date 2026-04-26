public class Collatz {
    public static void main(String[] args) {
        int number = 19;
        while (number != 1) {
            if (number % 2 == 0) {
                number = number / 2;
            } else {
                number = number * 3 + 1;
            }
            System.out.println(number);
        }
    }
}
