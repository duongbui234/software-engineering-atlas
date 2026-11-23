// Đo độ sâu đệ quy tối đa trong Java 21 (ba lần đo: lần đầu chưa JIT).
// Chạy: java recursion-depth.java
import java.util.*;
class Depth {
    static String[] tok; static int i;
    static int go() { String t = tok[i--]; if (!t.equals("+")) return Integer.parseInt(t); int b = go(), a = go(); return a + b; }
    static boolean ok(int n) { tok = new String[2 * n + 1]; tok[0] = "1"; for (int k = 0; k < n; k++) { tok[2*k+1] = "1"; tok[2*k+2] = "+"; } i = tok.length - 1; try { go(); return true; } catch (StackOverflowError e) { return false; } }
    public static void main(String[] a) { for (int r = 0; r < 3; r++) { int lo = 1, hi = 100000; while (lo < hi) { int m = (lo + hi + 1) >>> 1; if (ok(m)) lo = m; else hi = m - 1; } System.out.println("Java max depth " + lo); } }
}
