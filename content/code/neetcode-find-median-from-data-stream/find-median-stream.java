// LC 295 Find Median from Data Stream: hai PriorityQueue, và ba bẫy của Java (comparator trừ, int cộng tràn, chia nguyên).
// Chạy: java find-median-stream.java
import java.util.*;

class FindMedianStream {
    // lower: max-heap (nửa nhỏ), upper: min-heap (nửa lớn); lower có thể hơn một phần tử.
    static class MedianFinder {
        PriorityQueue<Integer> lower = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Integer> upper = new PriorityQueue<>();

        void addNum(int x) {
            lower.offer(x);
            upper.offer(lower.poll()); // số lớn nhất nửa nhỏ sang nửa lớn
            if (upper.size() > lower.size()) lower.offer(upper.poll());
        }

        double findMedian() {
            if (lower.size() > upper.size()) return lower.peek();
            return ((long) lower.peek() + upper.peek()) / 2.0; // cộng trong long: không tràn
        }
    }

    // SAI: max-heap bằng comparator (a, b) -> b - a. Với số ở hai đầu miền int, phép trừ tràn và đổi dấu.
    static class SubtractFinder extends MedianFinder {
        SubtractFinder() { lower = new PriorityQueue<>((a, b) -> b - a); }
    }

    // SAI: (a + b) / 2 trong int: mất .5 và tràn khi a + b vượt 2³¹ − 1.
    static class IntDivFinder extends MedianFinder {
        @Override double findMedian() {
            if (lower.size() > upper.size()) return lower.peek();
            return (lower.peek() + upper.peek()) / 2;
        }
    }

    static double medianOf(int[] xs, int len) {
        int[] a = Arrays.copyOf(xs, len);
        Arrays.sort(a);
        return len % 2 == 1 ? a[len / 2] : ((long) a[len / 2 - 1] + a[len / 2]) / 2.0;
    }

    record Case(String label, int[] xs) {}

    public static void main(String[] args) {
        Case[] cases = {
            new Case("ví dụ của đề", new int[]{1, 2, 3}),
            new Case("một số", new int[]{5}),
            new Case("giảm dần", new int[]{5, 4, 3, 2, 1}),
            new Case("tăng dần", new int[]{1, 2, 3, 4, 5, 6}),
            new Case("trùng nhau", new int[]{7, 7, 7, 7}),
            new Case("số âm", new int[]{-1, -2, -3, -4, -5}),
            new Case("xen kẽ", new int[]{6, 10, 2, 6, 5, 0, 6, 3, 1, 0, 0}),
            new Case("biên đề", new int[]{-100000, 100000, -100000, 100000}),
            new Case("biên int (ngoài đề)", new int[]{Integer.MAX_VALUE, Integer.MIN_VALUE, Integer.MAX_VALUE, Integer.MAX_VALUE}),
        };
        Map<String, java.util.function.Supplier<MedianFinder>> finders = new LinkedHashMap<>();
        finders.put("MedianFinder", MedianFinder::new);
        finders.put("SubtractFinder", SubtractFinder::new);
        finders.put("IntDivFinder", IntDivFinder::new);
        for (var e : finders.entrySet()) {
            List<String> bad = new ArrayList<>();
            for (Case c : cases) {
                MedianFinder f = e.getValue().get();
                List<String> got = new ArrayList<>();
                boolean ok = true;
                for (int i = 0; i < c.xs().length; i++) {
                    f.addNum(c.xs()[i]);
                    double v = f.findMedian();
                    got.add(String.valueOf(v));
                    if (v != medianOf(c.xs(), i + 1)) ok = false;
                }
                if (!ok) bad.add(c.label() + " → " + got);
            }
            System.out.printf("%-15s %d/%d ca đúng%s%n", e.getKey(), cases.length - bad.size(), cases.length,
                bad.isEmpty() ? "" : "; sai ở: " + String.join("; ", bad));
        }
        System.out.println("Integer.MAX_VALUE + Integer.MAX_VALUE = " + (Integer.MAX_VALUE + Integer.MAX_VALUE)
            + "; (a, b) -> b - a với a = MIN_VALUE, b = 1: " + (1 - Integer.MIN_VALUE));

        // Đo: 10⁶ lần addNum + findMedian, số trong [-10⁵, 10⁵].
        Random rnd = new Random(295);
        int[] xs = new int[1_000_000];
        for (int i = 0; i < xs.length; i++) xs[i] = rnd.nextInt(200_001) - 100_000;
        double[] ts = new double[3];
        for (int r = 0; r < 3; r++) {
            long t0 = System.nanoTime();
            MedianFinder f = new MedianFinder();
            double sum = 0;
            for (int x : xs) { f.addNum(x); sum += f.findMedian(); }
            ts[r] = (System.nanoTime() - t0) / 1e6;
            if (Double.isNaN(sum)) System.out.println("NaN");
        }
        Arrays.sort(ts);
        System.out.printf("10⁶ lần addNum + findMedian: %.1f ms (trung vị 3 lần; Integer đóng hộp)%n", ts[1]);
    }
}
