import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

// EXAMPLE
class Station {
    public static void main(String[] args) {
        int[][] points = {{0, 0}, {4, 0}, {5, 0}, {5, 2}};
        String[][] tickets = {{"JFK", "AAA"}, {"JFK", "BBB"}, {"BBB", "JFK"}};
        if (Connect.prim(points) != 7 || Connect.kruskal(points) != 7) {
            throw new AssertionError("Sai giá nối");
        }
        if (!String.join(" ", Itinerary.findItinerary(tickets)).equals("JFK BBB JFK AAA")) {
            throw new AssertionError("Sai hành trình");
        }
        System.out.println("2/2 ca đúng");
    }
}

class Connect {
    record Edge(int weight, int a, int b) {}

    static int distance(int[] p, int[] q) {
        return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]);
    }

    static long prim(int[][] points) {
        int n = points.length;
        boolean[] inTree = new boolean[n];
        int[] best = new int[n];
        Arrays.fill(best, Integer.MAX_VALUE);
        best[0] = 0;
        long total = 0;

        for (int step = 0; step < n; step++) {
            int next = -1;
            for (int i = 0; i < n; i++) {
                if (!inTree[i] && (next == -1 || best[i] < best[next])) next = i;
            }
            inTree[next] = true;
            total += best[next];
            for (int i = 0; i < n; i++) {
                if (!inTree[i]) best[i] = Math.min(best[i], distance(points[next], points[i]));
            }
        }
        return total;
    }

    static int root(int[] parent, int i) {
        while (parent[i] != i) {
            parent[i] = parent[parent[i]];
            i = parent[i];
        }
        return i;
    }

    static long kruskal(int[][] points) {
        int n = points.length;
        var edges = new ArrayList<Edge>(n * (n - 1) / 2);
        for (int a = 0; a < n; a++) {
            for (int b = a + 1; b < n; b++) edges.add(new Edge(distance(points[a], points[b]), a, b));
        }
        edges.sort(Comparator.comparingInt(Edge::weight));
        int[] parent = new int[n];
        int[] size = new int[n];
        Arrays.fill(size, 1);
        for (int i = 0; i < n; i++) parent[i] = i;

        int used = 0;
        long total = 0;
        for (Edge edge : edges) {
            int x = root(parent, edge.a()), y = root(parent, edge.b());
            if (x == y) continue;
            if (size[x] < size[y]) {
                int oldX = x;
                x = y;
                y = oldX;
            }
            parent[y] = x;
            size[x] += size[y];
            total += edge.weight();
            if (++used == n - 1) break;
        }
        return total;
    }
}

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
}
