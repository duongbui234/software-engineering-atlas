// Partition Labels (LeetCode 763): vét cạn từng vết cắt, gộp khoảng [đầu, cuối], tham lam một lượt
// Chạy: java labels.java
import java.util.*;

public class labels {
    static long steps = 0; // long: n = 10^5 cho vét cạn 10^10 bước, tràn int

    // Vét cạn: vết cắt sau vị trí i an toàn khi không chữ nào nằm ở cả hai bên
    static List<Integer> partitionBrute(String s) {
        int n = s.length();
        List<Integer> sizes = new ArrayList<>();
        int prev = -1; // vết cắt an toàn gần nhất
        for (int i = 0; i < n; i++) {
            boolean[] left = new boolean[26];
            boolean[] right = new boolean[26];
            for (int j = 0; j <= i; j++) left[s.charAt(j) - 'a'] = true;
            for (int j = i + 1; j < n; j++) right[s.charAt(j) - 'a'] = true;
            steps += n;
            boolean safe = true;
            for (int c = 0; c < 26; c++) if (left[c] && right[c]) safe = false;
            if (safe) {
                sizes.add(i - prev); // cắt ở mọi chỗ an toàn
                prev = i;
            }
        }
        return sizes;
    }

    // Gộp khoảng: mỗi chữ là một khoảng [lần đầu, lần cuối]; khoảng chồng nhau phải chung một phần
    static List<Integer> partitionIntervals(String s) {
        int[] first = new int[26];
        int[] last = new int[26];
        Arrays.fill(first, -1);
        for (int i = 0; i < s.length(); i++) {
            int c = s.charAt(i) - 'a';
            if (first[c] == -1) first[c] = i;
            last[c] = i;
        }
        List<int[]> spans = new ArrayList<>();
        for (int c = 0; c < 26; c++) if (first[c] != -1) spans.add(new int[] {first[c], last[c]});
        spans.sort((a, b) -> Integer.compare(a[0], b[0]));
        List<Integer> sizes = new ArrayList<>();
        int lo = spans.get(0)[0], hi = spans.get(0)[1];
        for (int k = 1; k < spans.size(); k++) {
            int[] sp = spans.get(k);
            if (sp[0] > hi) {
                sizes.add(hi - lo + 1); // khoảng mới không chạm khoảng đang gộp: chốt một phần
                lo = sp[0];
                hi = sp[1];
            } else hi = Math.max(hi, sp[1]);
        }
        sizes.add(hi - lo + 1);
        return sizes;
    }

    // Cách chính: bảng lần xuất hiện cuối, kéo end tới lần cuối xa nhất, cắt khi i chạm end
    static List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) {
            last[s.charAt(i) - 'a'] = i;
            steps++;
        }
        List<Integer> sizes = new ArrayList<>();
        int start = 0;
        int end = 0; // phần hiện tại phải kéo ít nhất tới đây
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            steps++;
            if (i == end) {
                sizes.add(end - start + 1); // mọi chữ trong phần đã hết: cắt sớm nhất có thể
                start = i + 1;
            }
        }
        return sizes;
    }

    // Bản sai: cắt khi chữ hiện tại hết, quên các chữ khác trong phần
    static List<Integer> partitionNoMax(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
        List<Integer> sizes = new ArrayList<>();
        int start = 0;
        for (int i = 0; i < s.length(); i++) {
            if (last[s.charAt(i) - 'a'] == i) {
                sizes.add(i - start + 1);
                start = i + 1;
            }
        }
        return sizes;
    }

    static int total = 0, good = 0, wrong = 0;

    // Đối chiếu: mọi chuỗi dài 1–7 trên bảng chữ {a, b, c}
    static void walk(String s) {
        if (!s.isEmpty()) {
            total++;
            List<Integer> b = partitionBrute(s);
            if (b.equals(partitionIntervals(s)) && b.equals(partitionLabels(s))) good++;
            if (!b.equals(partitionNoMax(s))) wrong++;
        }
        if (s.length() == 7) return;
        for (char ch : "abc".toCharArray()) walk(s + ch);
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {"a", List.of(1)},
            {"abc", List.of(1, 1, 1)},
            {"aaaa", List.of(4)},
            {"abca", List.of(4)},
            {"abbacdc", List.of(4, 3)},
            {"xyzzyxw", List.of(6, 1)},
            {"aabbccab", List.of(8)},
            {"qwqeer", List.of(3, 2, 1)},
        };
        int ok = 0;
        for (Object[] c : cases) {
            String s = (String) c[0];
            Object want = c[1]; // List.equals so từng phần tử, không so tham chiếu
            List<Integer> b = partitionBrute(s), iv = partitionIntervals(s), g = partitionLabels(s);
            if (b.equals(want) && iv.equals(want) && g.equals(want)) ok++;
            else System.out.println("sai ở " + s + " " + b + " " + iv + " " + g);
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");

        walk("");
        System.out.println(good + "/" + total + " ca đúng (đối chiếu vét cạn)");
        System.out.println("Cắt khi chữ hiện tại hết (bỏ max): sai " + wrong + "/" + total + " ca");

        // Đo: n = 10000, 5 khối 2000 ký tự, khối k chỉ dùng 5 chữ của riêng nó
        int n = 10000;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) sb.append((char) ('a' + 5 * (i / 2000) + (i * 3) % 5));
        String big = sb.toString();
        steps = 0;
        long t0 = System.nanoTime();
        List<Integer> b = partitionBrute(big);
        double bruteMs = (System.nanoTime() - t0) / 1e6;
        long bs = steps;
        steps = 0;
        t0 = System.nanoTime();
        List<Integer> g = partitionLabels(big);
        double greedyMs = (System.nanoTime() - t0) / 1e6;
        System.out.printf(Locale.ROOT, "n = %d, %d phần (%s): vét cạn %d bước (%.1f ms), tham lam %d bước (%.2f ms)%n",
            n, g.size(), b.equals(g) ? "khớp" : "lệch", bs, bruteMs, steps, greedyMs);
    }
}
