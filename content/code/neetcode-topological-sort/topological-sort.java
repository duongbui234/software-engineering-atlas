// Ga GRPH-03: sắp xếp topo cho ba bài Course Schedule, Course Schedule II, Alien Dictionary.
// Chạy: java topological-sort.java
import java.util.*;

public class Main {
    // ---------- Khuôn chung: thuật toán Kahn ----------
    // n đỉnh 0..n-1, edges là các cặp {trước, sau}. Trả về thứ tự lấy ra được.
    // Nếu thứ tự ngắn hơn n thì đồ thị có chu trình.
    static List<Integer> kahn(int n, List<int[]> edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[n];
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            indeg[e[1]]++; // "sau" còn chờ thêm một việc
        }
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int v = 0; v < n; v++) if (indeg[v] == 0) queue.add(v);
        List<Integer> order = new ArrayList<>();
        while (!queue.isEmpty()) {
            int v = queue.poll();
            order.add(v);
            for (int w : adj.get(v)) {
                if (--indeg[w] == 0) queue.add(w); // hết việc phải chờ: sẵn sàng
            }
        }
        return order;
    }

    // Đề cho [a, b] nghĩa là "học b trước a", tức cạnh b → a.
    static List<int[]> toEdges(int[][] prerequisites) {
        List<int[]> edges = new ArrayList<>();
        for (int[] p : prerequisites) edges.add(new int[] {p[1], p[0]});
        return edges;
    }

    static List<List<Integer>> buildAdj(int n, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : toEdges(prerequisites)) adj.get(e[0]).add(e[1]);
        return adj;
    }

    // ---------- 207. Course Schedule: chỉ hỏi có học hết được không ----------
    static boolean canFinish(int numCourses, int[][] prerequisites) {
        return kahn(numCourses, toEdges(prerequisites)).size() == numCourses;
    }

    // Cách thứ hai: DFS ba màu. Trắng = chưa thăm, xám = đang trên đường đi, đen = đã xong.
    static final int WHITE = 0, GRAY = 1, BLACK = 2;

    static boolean canFinishDfs(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = buildAdj(numCourses, prerequisites);
        int[] color = new int[numCourses];
        for (int v = 0; v < numCourses; v++) {
            if (color[v] == WHITE && hasCycleFrom(v, adj, color)) return false;
        }
        return true;
    }

    static boolean hasCycleFrom(int v, List<List<Integer>> adj, int[] color) {
        color[v] = GRAY;
        for (int w : adj.get(v)) {
            if (color[w] == GRAY) return true; // quay lại một đỉnh còn trên đường: chu trình
            if (color[w] == WHITE && hasCycleFrom(w, adj, color)) return true;
        }
        color[v] = BLACK;
        return false;
    }

    // ---------- 210. Course Schedule II: trả về một thứ tự học ----------
    static int[] findOrder(int numCourses, int[][] prerequisites) {
        List<Integer> order = kahn(numCourses, toEdges(prerequisites));
        if (order.size() != numCourses) return new int[0];
        return order.stream().mapToInt(Integer::intValue).toArray();
    }

    // DFS: một môn "xong" (tô đen) sau mọi môn đứng sau nó. Đảo ngược thứ tự xong là thứ tự topo.
    static int[] findOrderDfs(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = buildAdj(numCourses, prerequisites);
        int[] color = new int[numCourses];
        List<Integer> finished = new ArrayList<>();
        for (int v = 0; v < numCourses; v++) {
            if (color[v] == WHITE && !visit(v, adj, color, finished)) return new int[0];
        }
        Collections.reverse(finished);
        return finished.stream().mapToInt(Integer::intValue).toArray();
    }

    static boolean visit(int v, List<List<Integer>> adj, int[] color, List<Integer> finished) {
        color[v] = GRAY;
        for (int w : adj.get(v)) {
            if (color[w] == GRAY) return false;
            if (color[w] == WHITE && !visit(w, adj, color, finished)) return false;
        }
        color[v] = BLACK;
        finished.add(v);
        return true;
    }

    // ---------- 269. Alien Dictionary: tự dựng cạnh từ các cặp từ kề nhau ----------
    static String alienOrder(String[] words) {
        List<Character> letters = new ArrayList<>(); // theo thứ tự xuất hiện đầu tiên
        Map<Character, Integer> id = new HashMap<>();
        for (String word : words) {
            for (char ch : word.toCharArray()) {
                if (!id.containsKey(ch)) {
                    id.put(ch, letters.size());
                    letters.add(ch);
                }
            }
        }
        List<int[]> edges = new ArrayList<>();
        Set<String> seenEdge = new HashSet<>();
        for (int i = 0; i + 1 < words.length; i++) {
            String a = words[i], b = words[i + 1];
            int len = Math.min(a.length(), b.length());
            int j = 0;
            while (j < len && a.charAt(j) == b.charAt(j)) j++;
            if (j == len) {
                if (a.length() > b.length()) return ""; // "abc" đứng trước "ab": danh sách sai
                continue; // một từ là đầu của từ kia: không cho biết gì
            }
            String key = "" + a.charAt(j) + b.charAt(j);
            if (seenEdge.add(key)) { // mỗi cạnh chỉ thêm một lần, để danh sách kề và bậc vào khớp nhau
                edges.add(new int[] {id.get(a.charAt(j)), id.get(b.charAt(j))});
            }
        }
        List<Integer> order = kahn(letters.size(), edges);
        if (order.size() != letters.size()) return "";
        StringBuilder sb = new StringBuilder();
        for (int v : order) sb.append(letters.get(v));
        return sb.toString();
    }

    // ---------- Kiểm tra ----------
    static boolean isValidOrder(int n, int[][] prerequisites, int[] order) {
        if (order.length != n) return false;
        int[] pos = new int[n];
        Arrays.fill(pos, -1);
        for (int i = 0; i < n; i++) {
            if (order[i] < 0 || order[i] >= n || pos[order[i]] != -1) return false;
            pos[order[i]] = i;
        }
        for (int[] p : prerequisites) if (pos[p[1]] >= pos[p[0]]) return false;
        return true;
    }

    static int compareBy(Map<Character, Integer> rank, String a, String b) {
        for (int i = 0; i < Math.min(a.length(), b.length()); i++) {
            if (a.charAt(i) != b.charAt(i)) return rank.get(a.charAt(i)) - rank.get(b.charAt(i));
        }
        return a.length() - b.length();
    }

    // Danh sách từ có được xếp đúng theo bảng chữ `alphabet` không, và có đủ mọi chữ không.
    static boolean sortedBy(String[] words, String alphabet) {
        Map<Character, Integer> rank = new HashMap<>();
        for (int i = 0; i < alphabet.length(); i++) rank.put(alphabet.charAt(i), i);
        Set<Character> all = new HashSet<>();
        for (String w : words) for (char c : w.toCharArray()) {
            if (!rank.containsKey(c)) return false;
            all.add(c);
        }
        if (all.size() != alphabet.length() || rank.size() != alphabet.length()) return false;
        for (int i = 0; i + 1 < words.length; i++) if (compareBy(rank, words[i], words[i + 1]) > 0) return false;
        return true;
    }

    // Bộ sinh số giả ngẫu nhiên cố định hạt giống, để lần chạy nào cũng như nhau.
    static long seed = 42;

    static int rand(int k) {
        seed = seed * 48271 % 2147483647;
        return (int) (seed % k);
    }

    public static void main(String[] args) {
        // Trang phục buổi sáng: 0 tất, 1 quần, 2 áo sơ mi, 3 giày, 4 thắt lưng, 5 cà vạt, 6 áo khoác.
        int[][] outfit = {{3, 0}, {3, 1}, {4, 1}, {4, 2}, {5, 2}, {6, 5}, {6, 4}};
        int[][] chain = new int[1999][];
        for (int i = 0; i < 1999; i++) chain[i] = new int[] {i + 1, i};
        int[] ns = new int[300];
        int[][][] ps = new int[300][][];
        for (int t = 0; t < 300; t++) {
            int n = 1 + rand(8);
            int m = rand(10);
            int[][] p = new int[m][];
            for (int i = 0; i < m; i++) {
                int a = rand(n);
                int b = rand(n);
                p[i] = new int[] {a, b};
            }
            ns[t] = n;
            ps[t] = p;
        }
        List<String[]> alienLists = new ArrayList<>();
        for (int t = 0; t < 200; t++) {
            String pool = "abcdef".substring(0, 2 + rand(5));
            int k = 2 + rand(6);
            String[] words = new String[k];
            for (int i = 0; i < k; i++) {
                int l = 1 + rand(3);
                StringBuilder sb = new StringBuilder();
                for (int c = 0; c < l; c++) sb.append(pool.charAt(rand(pool.length())));
                words[i] = sb.toString();
            }
            // xếp theo một bảng chữ đảo ngược, để đáp án không trùng thứ tự a-z
            Map<Character, Integer> rank = new HashMap<>();
            for (int i = 0; i < pool.length(); i++) rank.put(pool.charAt(i), pool.length() - 1 - i);
            Arrays.sort(words, (x, y) -> compareBy(rank, x, y));
            alienLists.add(words);
        }

        boolean agree = true, valid = true, alienOk = true;
        for (int t = 0; t < 300; t++) {
            int n = ns[t];
            int[][] p = ps[t];
            if (canFinish(n, p) != canFinishDfs(n, p)) agree = false;
            int[] o = findOrder(n, p);
            if (canFinish(n, p)) {
                if (!isValidOrder(n, p, o) || !isValidOrder(n, p, findOrderDfs(n, p))) valid = false;
            } else if (o.length != 0) valid = false;
        }
        for (String[] l : alienLists) if (!sortedBy(l, alienOrder(l))) alienOk = false;

        Object[][] cases = {
            {"207 hai môn, một điều kiện", canFinish(2, new int[][] {{1, 0}})},
            {"207 hai môn chờ nhau: chu trình", !canFinish(2, new int[][] {{1, 0}, {0, 1}})},
            {"207 môn tự cần chính nó", !canFinish(1, new int[][] {{0, 0}})},
            {"207 chuỗi 2 000 môn", canFinish(2000, chain) && canFinishDfs(2000, chain)},
            {"207 Kahn và DFS ba màu khớp nhau trên 300 đồ thị", agree},
            {"210 trang phục buổi sáng", Arrays.equals(findOrder(7, outfit), new int[] {0, 1, 2, 3, 4, 5, 6})},
            {"210 DFS cũng cho thứ tự hợp lệ", isValidOrder(7, outfit, findOrderDfs(7, outfit))},
            {"210 có chu trình thì trả mảng rỗng", findOrder(3, new int[][] {{0, 1}, {1, 2}, {2, 0}}).length == 0},
            {"210 thứ tự hợp lệ trên 300 đồ thị", valid},
            {"269 ví dụ bốn từ", alienOrder(new String[] {"ba", "bc", "ac", "cab"}).equals("bac")},
            {"269 hai chữ ngược nhau: chu trình", alienOrder(new String[] {"z", "x", "z"}).equals("")},
            {"269 từ dài đứng trước đầu của nó", alienOrder(new String[] {"abc", "ab"}).equals("")},
            {"269 chữ không có cạnh vẫn phải có mặt",
                sortedBy(new String[] {"za", "zb"}, alienOrder(new String[] {"za", "zb"}))},
            {"269 khớp bảng chữ trên 200 danh sách ngẫu nhiên", alienOk},
        };

        int ok = 0;
        for (Object[] c : cases) {
            if ((Boolean) c[1]) ok++;
            else System.out.println("SAI: " + c[0]);
        }
        System.out.println("topological-sort " + ok + "/" + cases.length + " ca đúng");
    }
}
