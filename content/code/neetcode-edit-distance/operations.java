import java.util.*;

class operations {
    record Op(String kind, String from, String to) {}

    // Vét cạn: solve(i, j) = số bước ít nhất để biến a[i:] thành b[j:]
    static int bruteSolve(String a, String b, int i, int j, long[] calls) {
        calls[0]++;
        if (i == a.length()) return b.length() - j; // chèn hết phần còn lại của b
        if (j == b.length()) return a.length() - i; // xóa hết phần còn lại của a
        if (a.charAt(i) == b.charAt(j)) return bruteSolve(a, b, i + 1, j + 1, calls);
        return 1 + Math.min(bruteSolve(a, b, i, j + 1, calls),
                Math.min(bruteSolve(a, b, i + 1, j, calls), bruteSolve(a, b, i + 1, j + 1, calls)));
    }

    static int editDistanceBrute(String a, String b, long[] calls) {
        return bruteSolve(a, b, 0, 0, calls);
    }

    // Ghi nhớ: cùng công thức, mỗi cặp (i, j) chỉ tính một lần
    static int memoSolve(String a, String b, int i, int j, int[][] memo, long[] calls) {
        calls[0]++;
        if (i == a.length()) return b.length() - j;
        if (j == b.length()) return a.length() - i;
        if (memo[i][j] != -1) return memo[i][j];
        int result = a.charAt(i) == b.charAt(j)
                ? memoSolve(a, b, i + 1, j + 1, memo, calls)
                : 1 + Math.min(memoSolve(a, b, i, j + 1, memo, calls),
                        Math.min(memoSolve(a, b, i + 1, j, memo, calls), memoSolve(a, b, i + 1, j + 1, memo, calls)));
        memo[i][j] = result;
        return result;
    }

    static int editDistanceMemo(String a, String b, long[] calls) {
        int[][] memo = new int[a.length() + 1][b.length() + 1];
        for (int[] row : memo) Arrays.fill(row, -1);
        return memoSolve(a, b, 0, 0, memo, calls);
    }

    // Bảng đầy đủ: dp[i][j] = khoảng cách giữa tiền tố a[0:i] và b[0:j]
    static int[][] editDistanceTable(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 0; i <= a.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= b.length(); j++) dp[0][j] = j;
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                        ? dp[i - 1][j - 1]
                        : 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
            }
        }
        return dp;
    }

    // Một hàng và một biến chéo: bản nộp LeetCode
    static int minDistance(String a, String b) {
        if (b.length() > a.length()) { String t = a; a = b; b = t; } // hàng dài theo chuỗi ngắn hơn
        int[] row = new int[b.length() + 1];
        for (int j = 0; j <= b.length(); j++) row[j] = j;
        for (int i = 1; i <= a.length(); i++) {
            int diagonal = row[0]; // dp[i-1][j-1]
            row[0] = i;
            for (int j = 1; j <= b.length(); j++) {
                int above = row[j]; // dp[i-1][j], sắp bị ghi đè
                row[j] = a.charAt(i - 1) == b.charAt(j - 1)
                        ? diagonal
                        : 1 + Math.min(above, Math.min(row[j - 1], diagonal));
                diagonal = above;
            }
        }
        return row[b.length()];
    }

    // Lần ngược bảng đầy đủ để in kịch bản sửa
    static List<Op> editScript(String a, String b) {
        int[][] dp = editDistanceTable(a, b);
        List<Op> ops = new ArrayList<>();
        int i = a.length(), j = b.length();
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && a.charAt(i - 1) == b.charAt(j - 1) && dp[i][j] == dp[i - 1][j - 1]) {
                ops.add(new Op("giữ", a.substring(i - 1, i), b.substring(j - 1, j))); i--; j--;
            } else if (i > 0 && j > 0 && dp[i][j] == dp[i - 1][j - 1] + 1) {
                ops.add(new Op("thay", a.substring(i - 1, i), b.substring(j - 1, j))); i--; j--;
            } else if (i > 0 && dp[i][j] == dp[i - 1][j] + 1) {
                ops.add(new Op("xóa", a.substring(i - 1, i), "")); i--;
            } else {
                ops.add(new Op("chèn", "", b.substring(j - 1, j))); j--;
            }
        }
        Collections.reverse(ops);
        return ops;
    }

    static boolean scriptWorks(String a, String b, List<Op> ops, int distance) {
        StringBuilder consumed = new StringBuilder(), produced = new StringBuilder();
        int cost = 0;
        for (Op op : ops) {
            consumed.append(op.from());
            produced.append(op.to());
            if (!op.kind().equals("giữ")) cost++;
        }
        return consumed.toString().equals(a) && produced.toString().equals(b) && cost == distance;
    }

    static String describe(List<Op> ops) {
        List<String> parts = new ArrayList<>();
        for (Op op : ops) {
            parts.add(switch (op.kind()) {
                case "giữ" -> "giữ " + op.from();
                case "thay" -> "thay " + op.from() + "→" + op.to();
                case "xóa" -> "xóa " + op.from();
                default -> "chèn " + op.to();
            });
        }
        return String.join(", ", parts);
    }

    // BFS trên chính các chuỗi, độc lập với công thức DP
    static int bfsDistance(String a, String b) {
        int limit = Math.max(a.length(), b.length());
        Map<String, Integer> seen = new HashMap<>(Map.of(a, 0));
        List<String> queue = new ArrayList<>(List.of(a));
        for (int head = 0; head < queue.size(); head++) {
            String s = queue.get(head);
            int d = seen.get(s);
            if (s.equals(b)) return d;
            List<String> next = new ArrayList<>();
            for (int p = 0; p < s.length(); p++) {
                next.add(s.substring(0, p) + s.substring(p + 1));
                next.add(s.substring(0, p) + (s.charAt(p) == 'a' ? "b" : "a") + s.substring(p + 1));
            }
            if (s.length() < limit) {
                for (int p = 0; p <= s.length(); p++) {
                    next.add(s.substring(0, p) + "a" + s.substring(p));
                    next.add(s.substring(0, p) + "b" + s.substring(p));
                }
            }
            for (String t : next) {
                if (!seen.containsKey(t)) { seen.put(t, d + 1); queue.add(t); }
            }
        }
        return -1;
    }

    static boolean allEqual(List<Integer> results, int expected) {
        for (int r : results) if (r != expected) return false;
        return true;
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {"", "", 0},
            {"", "abc", 3},
            {"abc", "", 3},
            {"abc", "abc", 0},
            {"cat", "cut", 1},
            {"table", "tables", 1},
            {"ab", "ba", 2},
            {"kitten", "sitting", 3},
            {"flaw", "lawn", 2},
            {"sunday", "saturday", 3},
            {"pqrst", "qrstu", 2},
            {"ab".repeat(250), "ba".repeat(250), 2},
            {"a".repeat(500), "b".repeat(500), 500},
        };
        long[] calls = {0};
        int ok = 0;
        for (Object[] c : cases) {
            String a = (String) c[0], b = (String) c[1];
            int expected = (int) c[2];
            List<Integer> results = new ArrayList<>(List.of(minDistance(a, b), editDistanceMemo(a, b, calls),
                    editDistanceTable(a, b)[a.length()][b.length()]));
            if (a.length() + b.length() <= 16) results.add(editDistanceBrute(a, b, calls));
            if (allEqual(results, expected) && scriptWorks(a, b, editScript(a, b), expected)) ok++;
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        List<String> words = new ArrayList<>(List.of(""));
        for (int k = 0; k < words.size(); k++) {
            if (words.get(k).length() < 4) { words.add(words.get(k) + "a"); words.add(words.get(k) + "b"); }
        }
        int exhaustiveOk = 0, total = 0;
        for (String a : words) {
            for (String b : words) {
                total++;
                int expected = bfsDistance(a, b);
                List<Integer> results = List.of(editDistanceBrute(a, b, calls), editDistanceMemo(a, b, calls),
                        minDistance(a, b), editDistanceTable(a, b)[a.length()][b.length()]);
                if (allEqual(results, expected) && scriptWorks(a, b, editScript(a, b), expected)) exhaustiveOk++;
            }
        }
        System.out.println(exhaustiveOk + "/" + total + " ca đúng (đối chiếu BFS)");

        long[] brute = {0}, memo = {0};
        editDistanceBrute("a".repeat(8), "b".repeat(8), brute);
        editDistanceMemo("a".repeat(8), "b".repeat(8), memo);
        System.out.println("Vét cạn: " + brute[0] + " lượt gọi, memo: " + memo[0] + " lượt gọi");
        System.out.println("kitten → sitting: " + describe(editScript("kitten", "sitting")));
    }
}
