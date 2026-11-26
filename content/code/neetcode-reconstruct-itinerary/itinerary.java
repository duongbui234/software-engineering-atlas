import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.ArrayDeque;
import java.util.List;

class Itinerary {
    static List<String> findItinerary(String[][] tickets) {
        var outgoing = new HashMap<String, ArrayList<String>>();
        for (String[] ticket : tickets) {
            outgoing.computeIfAbsent(ticket[0], key -> new ArrayList<>()).add(ticket[1]);
        }
        for (var destinations : outgoing.values()) {
            destinations.sort(Collections.reverseOrder());
        }

        var stack = new ArrayDeque<String>();
        var suffix = new ArrayList<String>(tickets.length + 1);
        stack.push("JFK");
        while (!stack.isEmpty()) {
            var destinations = outgoing.get(stack.peek());
            if (destinations != null && !destinations.isEmpty()) {
                stack.push(destinations.remove(destinations.size() - 1));
            } else {
                suffix.add(stack.pop());
            }
        }
        Collections.reverse(suffix);
        return suffix;
    }

    // TESTS
    record Case(String[][] tickets, String want) {}
    public static void main(String[] args) {
        Case[] cases = {
            new Case(new String[][]{{"BBB", "CCC"}, {"JFK", "AAA"}, {"AAA", "BBB"}}, "JFK AAA BBB CCC"),
            new Case(new String[][]{{"JFK", "AAA"}, {"JFK", "BBB"}, {"BBB", "JFK"}}, "JFK BBB JFK AAA"),
            new Case(new String[][]{{"JFK", "AAA"}, {"JFK", "AAA"}, {"AAA", "JFK"}}, "JFK AAA JFK AAA"),
            new Case(new String[][]{{"JFK", "BBB"}, {"BBB", "JFK"}, {"JFK", "AAA"}, {"AAA", "JFK"}}, "JFK AAA JFK BBB JFK"),
            new Case(new String[][]{{"JFK", "AAA"}, {"AAA", "CCC"}, {"CCC", "JFK"}, {"AAA", "BBB"}, {"BBB", "AAA"}}, "JFK AAA BBB AAA CCC JFK")
        };
        for (Case test : cases) {
            if (!String.join(" ", findItinerary(test.tickets())).equals(test.want())) {
                throw new AssertionError("Sai hành trình");
            }
        }
        System.out.printf("%d/%d ca đúng%n", cases.length, cases.length);
    }
}
