// LC 269 Alien Dictionary: rút thứ tự chữ cái từ một danh sách từ đã xếp sẵn.
// Chạy: java alien-dictionary.java
import java.util.*;

public class Main {
    record Graph(boolean[] present, boolean[][] adj, int[] indeg) {}

    // Bước chung: so từng cặp từ KỀ NHAU, lấy chữ khác ĐẦU TIÊN làm một cạnh u → v.
    // Trả null khi danh sách tự mâu thuẫn: một từ đứng trước phần đầu của chính nó.
    static Graph buildGraph(String[] words) {
        boolean[] present = new boolean[26];
        for (String w : words) for (char ch : w.toCharArray()) present[ch - 'a'] = true; // chữ nào có mặt cũng phải ra
        boolean[][] adj = new boolean[26][26];
        int[] indeg = new int[26];
        for (int i = 0; i + 1 < words.length; i++) {
            String a = words[i], b = words[i + 1];
            int n = Math.min(a.length(), b.length());
            int j = 0;
            while (j < n && a.charAt(j) == b.charAt(j)) j++;
            if (j == n) {
                if (a.length() > b.length()) return null; // "abc" đứng trước "ab": danh bạ sai
                continue; // "ab" trước "abc": hợp lệ, không có manh mối
            }
            int u = a.charAt(j) - 'a', v = b.charAt(j) - 'a';
            if (!adj[u][v]) {
                adj[u][v] = true;
                indeg[v]++; // cạnh trùng chỉ đếm một lần
            }
        }
        return new Graph(present, adj, indeg);
    }

    static int countPresent(boolean[] p) {
        int n = 0;
        for (boolean x : p) if (x) n++;
        return n;
    }

    // Kahn trên một đồ thị đã dựng: chữ nào không còn chữ nào phải đứng trước (bậc vào 0) thì viết ra.
    static String kahnOrder(Graph g) {
        int[] indeg = g.indeg().clone();
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int c = 0; c < 26; c++) if (g.present()[c] && indeg[c] == 0) queue.add(c);
        StringBuilder out = new StringBuilder();
        while (!queue.isEmpty()) {
            int u = queue.poll();
            out.append((char) ('a' + u));
            for (int v = 0; v < 26; v++) {
                if (g.adj()[u][v] && --indeg[v] == 0) queue.add(v);
            }
        }
        return out.length() == countPresent(g.present()) ? out.toString() : ""; // thiếu chữ nghĩa là có vòng
    }

    // Cách 2: dựng đồ thị rồi chạy Kahn.
    static String alienOrderKahn(String[] words) {
        Graph g = buildGraph(words);
        return g == null ? "" : kahnOrder(g);
    }

    // Bản sai: mỗi bản sửa đúng một chỗ của buildGraph rồi vẫn chạy kahnOrder.
    static Graph buildGraphBuggy(String[] words, String bug) {
        boolean[] present = new boolean[26];
        for (String w : words) for (char ch : w.toCharArray()) present[ch - 'a'] = true;
        boolean[][] adj = new boolean[26][26];
        int[] indeg = new int[26];
        for (int i = 0; i + 1 < words.length; i++) {
            String a = words[i], b = words[i + 1];
            int n = Math.min(a.length(), b.length());
            int j = 0;
            while (j < n && a.charAt(j) == b.charAt(j)) j++;
            if (j == n) {
                if (a.length() > b.length() && !bug.equals("noPrefix")) return null; // noPrefix: quên kiểm tra
                continue;
            }
            for (; j < n; j++) {
                if (a.charAt(j) == b.charAt(j)) continue;
                int u = a.charAt(j) - 'a', v = b.charAt(j) - 'a';
                if (bug.equals("dupIndeg")) indeg[v]++; // dupIndeg: đếm cả cạnh trùng
                if (!adj[u][v]) {
                    adj[u][v] = true;
                    if (!bug.equals("dupIndeg")) indeg[v]++;
                }
                if (!bug.equals("allDiffs")) break; // allDiffs: lấy MỌI chữ khác làm manh mối
            }
        }
        if (bug.equals("edgeLettersOnly")) {
            // edgeLettersOnly: chỉ tính những chữ có mặt trong một cạnh nào đó
            for (int c = 0; c < 26; c++) {
                present[c] = false;
                for (int x = 0; x < 26; x++) if (adj[c][x] || adj[x][c]) present[c] = true;
            }
        }
        return new Graph(present, adj, indeg);
    }

    static String wrongOrder(String[] words, String bug) {
        Graph g = buildGraphBuggy(words, bug);
        return g == null ? "" : kahnOrder(g);
    }

    // Cách 3: DFS ba màu. Trắng = chưa thăm, xám = đang trên đường đi, đen = xong.
    static final int WHITE = 0, GRAY = 1, BLACK = 2;

    static boolean visit(Graph g, int u, int[] color, List<Integer> post) {
        color[u] = GRAY;
        for (int v = 0; v < 26; v++) {
            if (!g.adj()[u][v]) continue;
            if (color[v] == GRAY) return false; // quay về một chữ đang trên đường: có vòng
            if (color[v] == WHITE && !visit(g, v, color, post)) return false;
        }
        color[u] = BLACK;
        post.add(u); // u xong sau mọi chữ phải đứng sau nó
        return true;
    }

    static String alienOrderDfs(String[] words) {
        Graph g = buildGraph(words);
        if (g == null) return "";
        int[] color = new int[26];
        List<Integer> post = new ArrayList<>();
        for (int u = 0; u < 26; u++) {
            if (g.present()[u] && color[u] == WHITE && !visit(g, u, color, post)) return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = post.size() - 1; i >= 0; i--) sb.append((char) ('a' + post.get(i)));
        return sb.toString();
    }

    // Biến thể LintCode 892: nhiều đáp án thì trả chuỗi nhỏ nhất theo a..z.
    // Thay hàng đợi bằng min-heap: mỗi lượt lấy chữ NHỎ NHẤT đang sẵn sàng.
    static String alienOrderSmallest(String[] words) {
        Graph g = buildGraph(words);
        if (g == null) return "";
        int[] indeg = g.indeg().clone();
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int c = 0; c < 26; c++) if (g.present()[c] && indeg[c] == 0) heap.add(c);
        StringBuilder out = new StringBuilder();
        while (!heap.isEmpty()) {
            int u = heap.poll();
            out.append((char) ('a' + u));
            for (int v = 0; v < 26; v++) {
                if (g.adj()[u][v] && --indeg[v] == 0) heap.add(v);
            }
        }
        return out.length() == countPresent(g.present()) ? out.toString() : "";
    }

    // Kiểm tra: danh sách có thật sự xếp đúng theo bảng chữ `rank` không?
    static boolean isSorted(String[] words, int[] rank) {
        for (int i = 0; i + 1 < words.length; i++) {
            String a = words[i], b = words[i + 1];
            int n = Math.min(a.length(), b.length());
            int j = 0;
            while (j < n && a.charAt(j) == b.charAt(j)) j++;
            if (j == n) {
                if (a.length() > b.length()) return false;
                continue;
            }
            if (rank[a.charAt(j) - 'a'] > rank[b.charAt(j) - 'a']) return false;
        }
        return true;
    }

    static String lettersOf(String[] words) {
        boolean[] seen = new boolean[26];
        for (String w : words) for (char ch : w.toCharArray()) seen[ch - 'a'] = true;
        StringBuilder sb = new StringBuilder();
        for (int c = 0; c < 26; c++) if (seen[c]) sb.append((char) ('a' + c));
        return sb.toString();
    }

    // Cách 1: vét cạn. Thử mọi hoán vị theo thứ tự từ điển, dừng ở hoán vị đầu tiên hợp lệ.
    static int tried = 0;

    static boolean tryPerm(String[] words, String letters, boolean[] used, StringBuilder perm, int[] rank) {
        if (perm.length() == letters.length()) {
            tried++;
            for (int i = 0; i < perm.length(); i++) rank[perm.charAt(i) - 'a'] = i;
            return isSorted(words, rank);
        }
        for (int i = 0; i < letters.length(); i++) {
            if (used[i]) continue;
            used[i] = true;
            perm.append(letters.charAt(i));
            if (tryPerm(words, letters, used, perm, rank)) return true;
            used[i] = false;
            perm.setLength(perm.length() - 1);
        }
        return false;
    }

    static String alienOrderBrute(String[] words) {
        String letters = lettersOf(words);
        StringBuilder perm = new StringBuilder();
        boolean found = tryPerm(words, letters, new boolean[letters.length()], perm, new int[26]);
        return found ? perm.toString() : "";
    }

    // Một đáp án đúng khi: danh sách hợp lệ thì chuỗi chứa đủ mỗi chữ một lần và xếp đúng danh sách;
    // danh sách mâu thuẫn thì chuỗi rỗng. LeetCode nhận MỌI thứ tự hợp lệ, nên không so với một chuỗi cố định.
    static boolean isValidAnswer(String[] words, String answer, boolean expectValid) {
        if (!expectValid) return answer.isEmpty();
        char[] sorted = answer.toCharArray();
        Arrays.sort(sorted);
        if (!new String(sorted).equals(lettersOf(words))) return false;
        int[] rank = new int[26];
        for (int i = 0; i < answer.length(); i++) rank[answer.charAt(i) - 'a'] = i;
        return isSorted(words, rank);
    }

    static String show(String s) {
        return s.isEmpty() ? "\"\"" : s;
    }

    static int seed = 2026;

    static int rnd(int n) {
        seed ^= seed << 13;
        seed ^= seed >>> 17;
        seed ^= seed << 5;
        return (int) (Integer.toUnsignedLong(seed) % n);
    }

    static Comparator<String> compareBy(int[] rank) {
        return (a, b) -> {
            int n = Math.min(a.length(), b.length());
            for (int j = 0; j < n; j++) {
                if (a.charAt(j) != b.charAt(j)) return rank[a.charAt(j) - 'a'] - rank[b.charAt(j) - 'a'];
            }
            return a.length() - b.length();
        };
    }

    static String[] randomWords(int count, int maxLen, int k) {
        String[] words = new String[count];
        for (int i = 0; i < count; i++) {
            int len = 1 + rnd(maxLen);
            StringBuilder w = new StringBuilder();
            for (int j = 0; j < len; j++) w.append((char) ('a' + rnd(k)));
            words[i] = w.toString();
        }
        return words;
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {new String[] {"bcae", "bcd", "cb", "cab", "ad"}, true}, // ví dụ trong bài
            {new String[] {"zx"}, true}, // một từ: không có manh mối nào, thứ tự nào cũng được
            {new String[] {"abc", "ab"}, false}, // từ dài đứng trước phần đầu của nó
            {new String[] {"a", "b", "a"}, false}, // a trước b và b trước a: vòng
            {new String[] {"ab", "ab"}, true}, // hai từ giống nhau
            {new String[] {"ab", "abc"}, true}, // phần đầu đứng trước: hợp lệ
            {new String[] {"ac", "ab", "zc", "zb"}, true}, // cạnh c → b xuất hiện hai lần
            {new String[] {"ab", "ba"}, true}, // chỉ chữ khác ĐẦU TIÊN mới là manh mối
        };

        int ok = 0;
        for (int i = 0; i < cases.length; i++) {
            String[] words = (String[]) cases[i][0];
            boolean expectValid = (Boolean) cases[i][1];
            tried = 0;
            String kahn = alienOrderKahn(words);
            String dfs = alienOrderDfs(words);
            String small = alienOrderSmallest(words);
            String brute = alienOrderBrute(words);
            boolean good = small.equals(brute);
            for (String ans : new String[] {kahn, dfs, small, brute}) {
                if (!isValidAnswer(words, ans, expectValid)) good = false;
            }
            if (good) ok++;
            System.out.printf("ca %d [%s]: Kahn %s, DFS %s, nhỏ nhất %s, vét cạn %s (%d hoán vị) %s%n",
                    i + 1, String.join(" ", words), show(kahn), show(dfs), show(small), show(brute), tried,
                    good ? "đúng" : "SAI");
        }
        System.out.printf("%d/%d ca đúng%n", ok, cases.length);

        // Bản sai: chạy bốn bản sai trên cùng 8 ca.
        for (String bug : new String[] {"allDiffs", "noPrefix", "edgeLettersOnly", "dupIndeg"}) {
            int right = 0;
            for (Object[] c : cases) {
                if (isValidAnswer((String[]) c[0], wrongOrder((String[]) c[0], bug), (Boolean) c[1])) right++;
            }
            System.out.printf("bản sai %s: đúng %d/%d ca%n", bug, right, cases.length);
        }

        // Đối chiếu ngẫu nhiên: 2 000 danh sách nhỏ, một nửa xếp theo một bảng chữ ngẫu nhiên.
        int runs = 2000, agree = 0, validCount = 0;
        for (int t = 0; t < runs; t++) {
            int k = 2 + rnd(5);
            int[] order = new int[k];
            for (int i = 0; i < k; i++) order[i] = i;
            for (int i = k - 1; i > 0; i--) {
                int j = rnd(i + 1);
                int tmp = order[i];
                order[i] = order[j];
                order[j] = tmp;
            }
            int[] rank = new int[26];
            for (int i = 0; i < k; i++) rank[order[i]] = i;
            int n = 1 + rnd(6);
            String[] words = randomWords(n, 4, k);
            if (rnd(2) == 0) Arrays.sort(words, compareBy(rank));
            String brute = alienOrderBrute(words);
            boolean valid = !brute.isEmpty();
            if (valid) validCount++;
            String[] answers = {alienOrderKahn(words), alienOrderDfs(words), alienOrderSmallest(words)};
            boolean good = answers[2].equals(brute);
            for (String ans : answers) if (!isValidAnswer(words, ans, valid)) good = false;
            if (good) agree++;
        }
        System.out.printf("đối chiếu %d danh sách ngẫu nhiên (%d hợp lệ): khớp vét cạn %d/%d%n", runs, validCount, agree, runs);

        // Đo: k chữ, 100 từ xếp theo bảng chữ ngược (k-1)..a, tức hoán vị cuối cùng vét cạn gặp.
        for (int k : new int[] {7, 8, 9}) {
            int[] rank = new int[26];
            for (int i = 0; i < k; i++) rank[k - 1 - i] = i;
            String[] words = randomWords(100, 10, k);
            Arrays.sort(words, compareBy(rank));
            tried = 0;
            long t0 = System.nanoTime();
            String brute = alienOrderBrute(words);
            double bruteMs = (System.nanoTime() - t0) / 1e6;
            t0 = System.nanoTime();
            String kahn = "";
            for (int r = 0; r < 1000; r++) kahn = alienOrderKahn(words);
            double kahnUs = (System.nanoTime() - t0) / 1e6; // tổng 1 000 lần (ms) = µs mỗi lần
            System.out.printf("đo %d chữ, 100 từ: vét cạn ra %s sau %d hoán vị, %.1f ms; Kahn ra %s, %.1f µs%n",
                    k, brute, tried, bruteMs, kahn, kahnUs);
        }
    }
}
