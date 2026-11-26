// LC 127 Word Ladder: BFS trên đồ thị ẩn, cùng bộ ca với bản TypeScript.
// Chạy: java word-ladder.java
import java.util.*;

public class Main {
    static int expanded = 0; // số từ đã lấy ra để tìm hàng xóm, dùng cho phép đo

    interface Solver { int solve(String begin, String end, List<String> wordList); }

    static boolean differByOne(String a, String b) {
        int diff = 0;
        for (int i = 0; i < a.length(); i++) {
            if (a.charAt(i) != b.charAt(i) && ++diff > 1) return false;
        }
        return diff == 1;
    }

    // Cách 1: BFS, so với từng từ trong danh sách. O(n²·L).
    static int ladderPairwise(String begin, String end, List<String> wordList) {
        if (!wordList.contains(end)) return 0;
        Set<String> seen = new HashSet<>(List.of(begin));
        List<String> level = new ArrayList<>(List.of(begin));
        for (int words = 1; !level.isEmpty(); words++) {
            List<String> next = new ArrayList<>();
            for (String word : level) {
                expanded++;
                if (word.equals(end)) return words;
                for (String candidate : wordList) {
                    if (!seen.contains(candidate) && differByOne(word, candidate)) {
                        seen.add(candidate); // đánh dấu lúc đưa vào
                        next.add(candidate);
                    }
                }
            }
            level = next;
        }
        return 0;
    }

    // Cách 2: BFS, đổi từng chữ thành a..z. O(n·L·26).
    // Sửa một chữ trong char[], rồi new String(chars) chép cả mảng thành chuỗi mới.
    static int ladderLetters(String begin, String end, List<String> wordList) {
        Set<String> unseen = new HashSet<>(wordList);
        if (!unseen.contains(end)) return 0;
        unseen.remove(begin);
        ArrayDeque<String> queue = new ArrayDeque<>(List.of(begin));
        Map<String, Integer> dist = new HashMap<>(Map.of(begin, 1));
        while (!queue.isEmpty()) {
            String word = queue.pollFirst();
            expanded++;
            int d = dist.get(word);
            if (word.equals(end)) return d;
            char[] chars = word.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                char original = chars[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    chars[i] = c;
                    String candidate = new String(chars);
                    if (unseen.remove(candidate)) { // remove trả true nếu từ có trong tập
                        dist.put(candidate, d + 1);
                        queue.addLast(candidate);
                    }
                }
                chars[i] = original;
            }
        }
        return 0;
    }

    // Cách 3: gom từ theo mẫu có dấu *, ví dụ "c*ld".
    static int ladderBuckets(String begin, String end, List<String> wordList) {
        if (!wordList.contains(end)) return 0;
        Map<String, List<String>> buckets = new HashMap<>();
        for (String word : wordList) {
            for (int i = 0; i < word.length(); i++) {
                String key = word.substring(0, i) + "*" + word.substring(i + 1);
                buckets.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
            }
        }
        Set<String> seen = new HashSet<>(List.of(begin));
        List<String> level = new ArrayList<>(List.of(begin));
        for (int words = 1; !level.isEmpty(); words++) {
            List<String> next = new ArrayList<>();
            for (String word : level) {
                expanded++;
                if (word.equals(end)) return words;
                for (int i = 0; i < word.length(); i++) {
                    String key = word.substring(0, i) + "*" + word.substring(i + 1);
                    List<String> bucket = buckets.remove(key); // một xô chỉ mở một lần
                    if (bucket == null) continue;
                    for (String candidate : bucket) {
                        if (seen.add(candidate)) next.add(candidate);
                    }
                }
            }
            level = next;
        }
        return 0;
    }

    // Cách 4: BFS hai đầu, luôn nới bên có tầng nhỏ hơn.
    static int ladderBidirectional(String begin, String end, List<String> wordList) {
        Set<String> unseen = new HashSet<>(wordList);
        if (!unseen.contains(end)) return 0;
        unseen.remove(begin);
        unseen.remove(end);
        List<String> front = new ArrayList<>(List.of(begin)), back = new ArrayList<>(List.of(end));
        Set<String> frontSet = new HashSet<>(front), backSet = new HashSet<>(back);
        for (int words = 2; !front.isEmpty() && !back.isEmpty(); words++) {
            if (front.size() > back.size()) {
                List<String> t = front; front = back; back = t;
                Set<String> ts = frontSet; frontSet = backSet; backSet = ts;
            }
            List<String> next = new ArrayList<>();
            for (String word : front) {
                expanded++;
                char[] chars = word.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char original = chars[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        chars[i] = c;
                        String candidate = new String(chars);
                        if (backSet.contains(candidate)) return words; // hai phía gặp nhau
                        if (unseen.remove(candidate)) next.add(candidate);
                    }
                    chars[i] = original;
                }
            }
            front = next;
            frontSet = new HashSet<>(next);
        }
        return 0;
    }

    // SAI: DFS trả độ dài đường đầu tiên tìm thấy.
    static int wrongDfsFirstPath(String begin, String end, List<String> wordList) {
        Set<String> unseen = new HashSet<>(wordList);
        if (!unseen.contains(end)) return 0;
        unseen.remove(begin);
        return dfs(begin, end, 1, unseen);
    }

    static int dfs(String word, String end, int words, Set<String> unseen) {
        if (word.equals(end)) return words;
        char[] chars = word.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            char original = chars[i];
            for (char c = 'a'; c <= 'z'; c++) {
                chars[i] = c;
                String candidate = new String(chars);
                if (unseen.remove(candidate)) {
                    int found = dfs(candidate, end, words + 1, unseen);
                    if (found != 0) return found;
                }
            }
            chars[i] = original;
        }
        return 0;
    }

    // SAI: đếm số bước (cạnh) thay vì số từ.
    static int wrongCountEdges(String begin, String end, List<String> wordList) {
        int words = ladderLetters(begin, end, wordList);
        return words == 0 ? 0 : words - 1;
    }

    // SAI: thấy endWord cách một chữ là trả về, quên kiểm endWord có trong danh sách.
    static int wrongSkipEndCheck(String begin, String end, List<String> wordList) {
        Set<String> seen = new HashSet<>(List.of(begin));
        List<String> level = new ArrayList<>(List.of(begin));
        for (int words = 1; !level.isEmpty(); words++) {
            List<String> next = new ArrayList<>();
            for (String word : level) {
                if (differByOne(word, end)) return words + 1;
                for (String candidate : wordList) {
                    if (!seen.contains(candidate) && differByOne(word, candidate)) {
                        seen.add(candidate);
                        next.add(candidate);
                    }
                }
            }
            level = next;
        }
        return 0;
    }

    record Case(String name, String begin, String end, List<String> list, int want) {}

    static long seed = 42;

    static int rand(int n) {
        seed = seed * 48271 % 2147483647; // Park–Miller
        return (int) (seed % n);
    }

    static String randomWord(int length, int alphabet) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) sb.append((char) ('a' + rand(alphabet)));
        return sb.toString();
    }

    // Hai từ điển 5000 từ dài 6: "dày" (chữ a..e ngẫu nhiên) và "thưa" (mỗi từ mới đổi một chữ của từ có sẵn).
    static List<String> makeDict(String kind) {
        seed = 7;
        Set<String> seen = new HashSet<>();
        List<String> words = new ArrayList<>();
        if (kind.equals("dày")) {
            while (words.size() < 5000) {
                String w = randomWord(6, 5);
                if (seen.add(w)) words.add(w);
            }
            return words;
        }
        words.add(randomWord(6, 26));
        seen.add(words.get(0));
        while (words.size() < 5000) {
            char[] chars = words.get(rand(words.size())).toCharArray();
            int pos = rand(6);
            chars[pos] = (char) ('a' + rand(26));
            String w = new String(chars);
            if (seen.add(w)) words.add(w);
        }
        return words;
    }

    static String farthest(List<String> words) {
        Set<String> unseen = new HashSet<>(words);
        unseen.remove(words.get(0));
        List<String> level = new ArrayList<>(List.of(words.get(0)));
        String last = words.get(0);
        while (!level.isEmpty()) {
            last = level.get(level.size() - 1);
            List<String> next = new ArrayList<>();
            for (String w : level) {
                char[] chars = w.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char original = chars[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        chars[i] = c;
                        String candidate = new String(chars);
                        if (unseen.remove(candidate)) next.add(candidate);
                    }
                    chars[i] = original;
                }
            }
            level = next;
        }
        return last;
    }

    static int[] pushesMarkOnDequeue(String begin, String end, List<String> wordList) {
        Set<String> dict = new HashSet<>(wordList);
        Set<String> visited = new HashSet<>();
        ArrayDeque<String> words = new ArrayDeque<>(List.of(begin));
        ArrayDeque<Integer> dists = new ArrayDeque<>(List.of(1));
        int pushes = 1;
        while (!words.isEmpty()) {
            String word = words.pollFirst();
            int d = dists.pollFirst();
            if (!visited.add(word)) continue; // đánh dấu muộn: lúc lấy ra
            if (word.equals(end)) return new int[]{d, pushes};
            char[] chars = word.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                char original = chars[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    chars[i] = c;
                    String candidate = new String(chars);
                    if (dict.contains(candidate) && !visited.contains(candidate)) {
                        words.addLast(candidate);
                        dists.addLast(d + 1);
                        pushes++;
                    }
                }
                chars[i] = original;
            }
        }
        return new int[]{0, pushes};
    }

    public static void main(String[] args) {
        List<Case> cases = List.of(
            new Case("cold → warm", "cold", "warm", List.of("cord", "card", "ward", "warm", "corm", "worm", "word"), 5),
            new Case("cat → dog", "cat", "dog", List.of("cot", "cog", "dog", "bat"), 4),
            new Case("đích không có trong danh sách", "cat", "dog", List.of("cot", "cog"), 0),
            new Case("không có đường", "aaa", "bbb", List.of("bbb", "abc"), 0),
            new Case("một bước", "ab", "cb", List.of("cb"), 2),
            new Case("từ đầu nằm trong danh sách", "pen", "pin", List.of("pen", "pin"), 2),
            new Case("từ một chữ", "a", "c", List.of("a", "b", "c"), 2),
            new Case("DFS đi vòng", "aa", "bb", List.of("ca", "cb", "bb", "ab"), 3)
        );
        LinkedHashMap<String, Solver> solvers = new LinkedHashMap<>();
        solvers.put("ladderPairwise", Main::ladderPairwise);
        solvers.put("ladderLetters", Main::ladderLetters);
        solvers.put("ladderBuckets", Main::ladderBuckets);
        solvers.put("ladderBidirectional", Main::ladderBidirectional);
        solvers.put("wrongDfsFirstPath", Main::wrongDfsFirstPath);
        solvers.put("wrongCountEdges", Main::wrongCountEdges);
        solvers.put("wrongSkipEndCheck", Main::wrongSkipEndCheck);

        for (var entry : solvers.entrySet()) {
            List<String> wrong = new ArrayList<>();
            for (Case c : cases) {
                int got = entry.getValue().solve(c.begin(), c.end(), new ArrayList<>(c.list()));
                if (got != c.want()) wrong.add(c.name() + " → " + got);
            }
            String tail = wrong.isEmpty() ? "" : "; sai ở " + String.join(", ", wrong);
            System.out.printf("%-20s %d/%d ca đúng%s%n", entry.getKey(), cases.size() - wrong.size(), cases.size(), tail);
        }

        List<Solver> correct = List.of(Main::ladderPairwise, Main::ladderLetters, Main::ladderBuckets, Main::ladderBidirectional);
        int agree = 0, trials = 2000;
        for (int t = 0; t < trials; t++) {
            int length = 2 + rand(3);
            int size = 1 + rand(Math.min(30, (int) Math.pow(3, length)));
            Set<String> seen = new HashSet<>();
            List<String> words = new ArrayList<>();
            while (words.size() < size) {
                String w = randomWord(length, 3);
                if (seen.add(w)) words.add(w);
            }
            String begin = randomWord(length, 3);
            String end = words.get(rand(words.size()));
            if (begin.equals(end)) { agree++; continue; }
            int first = correct.get(0).solve(begin, end, words);
            boolean same = true;
            for (Solver s : correct) if (s.solve(begin, end, words) != first) same = false;
            if (same) agree++;
        }
        System.out.printf("ngẫu nhiên: %d/%d bộ từ điển, bốn cách khớp nhau%n", agree, trials);

        for (String kind : List.of("dày", "thưa")) {
            List<String> words = makeDict(kind);
            String begin = words.get(0), end = farthest(words);
            System.out.printf("từ điển %s, 5000 từ: %s → %s%n", kind, begin, end);
            int k = 0;
            for (var entry : solvers.entrySet()) {
                if (k++ == 4) break;
                expanded = 0;
                long t0 = System.nanoTime();
                int ans = entry.getValue().solve(begin, end, words);
                double ms = (System.nanoTime() - t0) / 1e6;
                System.out.printf("  %-20s đáp án %d, lấy ra %d từ, %.1f ms%n", entry.getKey(), ans, expanded, ms);
            }
        }

        List<String> words = makeDict("dày");
        String end = farthest(words);
        int[] r = pushesMarkOnDequeue(words.get(0), end, words);
        int good = ladderLetters(words.get(0), end, words);
        System.out.printf("từ điển dày, đánh dấu lúc lấy ra: đáp án %d, %d lượt đưa vào hàng đợi; đánh dấu lúc đưa vào: đáp án %d, tối đa 5000 lượt%n", r[0], r[1], good);
    }
}
