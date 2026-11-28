// Tham lam theo nhóm (NeetCode MISC-04): bốn bài, mỗi bài một luật cục bộ bị ép buộc.
import java.util.*;
import java.util.function.Supplier;

class Grouping {
    // Hand of Straights: lá nhỏ nhất còn lại chỉ có thể mở một nhóm, nên mở nhóm ở đó.
    static boolean isNStraightHand(int[] hand, int groupSize) {
        if (hand.length % groupSize != 0) return false;
        TreeMap<Integer, Integer> count = new TreeMap<>(); // khóa luôn được giữ theo thứ tự tăng
        for (int x : hand) count.merge(x, 1, Integer::sum);
        for (int x : count.keySet()) {
            int c = count.get(x); // c lá x còn lại: cả c lá đều phải mở nhóm
            if (c == 0) continue;
            for (int v = x; v < x + groupSize; v++) {
                int have = count.getOrDefault(v, 0);
                if (have < c) return false; // thiếu lá v: có nhóm không đi tiếp được
                count.put(v, have - c);
            }
        }
        return true;
    }

    // Merge Triplets: bỏ bộ ba nào vượt target ở bất kỳ vị trí nào; các bộ còn lại gộp hết cũng không hại.
    static boolean mergeTriplets(int[][] triplets, int[] target) {
        boolean[] good = new boolean[3]; // vị trí i đã có bộ an toàn chạm đúng target[i] chưa
        for (int[] t : triplets) {
            if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue; // dùng là hỏng vĩnh viễn
            for (int i = 0; i < 3; i++) if (t[i] == target[i]) good[i] = true;
        }
        return good[0] && good[1] && good[2];
    }

    // Partition Labels: phần phải kéo tới lần xuất hiện cuối của mọi chữ trong nó.
    static List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
        List<Integer> sizes = new ArrayList<>();
        int start = 0, end = 0; // end: mốc xa nhất mà phần hiện tại buộc phải chạm
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) { // không chữ nào của phần này còn ở phía sau: cắt
                sizes.add(end - start + 1);
                start = i + 1;
            }
        }
        return sizes;
    }

    // Valid Parenthesis String: giữ khoảng [lo, hi] số ngoặc mở chưa đóng có thể có.
    static boolean checkValidString(String s) {
        int lo = 0, hi = 0; // lo: mọi '*' nghiêng về ')'; hi: mọi '*' nghiêng về '('
        for (char c : s.toCharArray()) {
            if (c == '(') { lo++; hi++; }
            else if (c == ')') { lo--; hi--; }
            else { lo--; hi++; }
            if (hi < 0) return false; // kể cả khi mọi '*' là '(' vẫn thừa ')'
            lo = Math.max(lo, 0); // số ngoặc mở không âm: bỏ các cách đọc vô nghĩa
        }
        return lo == 0;
    }

    record Case(String name, Supplier<Object> run, Object want) {}

    public static void main(String[] args) {
        // Đáp án mong đợi tính trước bằng vét cạn độc lập (thử mọi cách chia, mọi tập con, mọi cách đọc '*').
        List<Case> cases = List.of(
            new Case("hand thiếu lá 7", () -> isNStraightHand(new int[]{3, 1, 5, 8, 2, 6, 4, 5, 3}, 3), false),
            new Case("hand ba nhóm", () -> isNStraightHand(new int[]{1, 2, 2, 3, 3, 4, 4, 5, 6}, 3), true),
            new Case("hand không chia hết", () -> isNStraightHand(new int[]{1, 2, 3, 4, 5}, 4), false),
            new Case("hand nhóm cỡ 1", () -> isNStraightHand(new int[]{7}, 1), true),
            new Case("hand chưa sắp", () -> isNStraightHand(new int[]{2, 1}, 2), true),
            new Case("hand hai nhóm giống nhau", () -> isNStraightHand(new int[]{1, 1, 2, 2, 3, 3}, 3), true),
            new Case("hand hở ở 3", () -> isNStraightHand(new int[]{1, 2, 4, 5, 6, 7}, 3), false),
            new Case("triplets bỏ bộ vượt", () -> mergeTriplets(new int[][]{{1, 4, 2}, {3, 1, 5}, {2, 6, 9}, {3, 4, 1}}, new int[]{3, 4, 5}), true),
            new Case("triplets thiếu vị trí 3", () -> mergeTriplets(new int[][]{{4, 1, 1}, {1, 4, 1}}, new int[]{4, 4, 4}), false),
            new Case("triplets một bộ đúng", () -> mergeTriplets(new int[][]{{5, 5, 5}}, new int[]{5, 5, 5}), true),
            new Case("triplets bộ duy nhất chạm bị vượt", () -> mergeTriplets(new int[][]{{2, 9, 1}, {1, 1, 3}}, new int[]{2, 2, 3}), false),
            new Case("triplets không chạm", () -> mergeTriplets(new int[][]{{1, 2, 3}, {1, 2, 3}}, new int[]{1, 2, 4}), false),
            new Case("labels hai phần", () -> partitionLabels("abacdcbe"), List.of(7, 1)),
            new Case("labels từng chữ", () -> partitionLabels("xyz"), List.of(1, 1, 1)),
            new Case("labels một chữ", () -> partitionLabels("aaaa"), List.of(4)),
            new Case("labels nối dài", () -> partitionLabels("abcab"), List.of(5)),
            new Case("labels năm phần", () -> partitionLabels("ccbbaddx"), List.of(2, 2, 1, 2, 1)),
            new Case("paren sao ở giữa", () -> checkValidString("(*)"), true),
            new Case("paren sao làm (", () -> checkValidString("(*))"), true),
            new Case("paren mở ở cuối", () -> checkValidString("*)("), false),
            new Case("paren đóng trước", () -> checkValidString(")*"), false),
            new Case("paren thừa mở", () -> checkValidString("(((*"), false),
            new Case("paren một sao", () -> checkValidString("*"), true),
            new Case("paren hai sao", () -> checkValidString("((*)*)"), true),
            new Case("paren sao làm )", () -> checkValidString("(*(*)"), true),
            new Case("paren sao không cứu", () -> checkValidString("**(("), false)
        );
        int ok = 0;
        for (Case c : cases) {
            Object got = c.run().get();
            if (got.equals(c.want())) ok++;
            else System.out.println("SAI " + c.name() + ": được " + got + ", cần " + c.want());
        }
        System.out.println(ok + "/" + cases.size() + " ca đúng");
    }
}
