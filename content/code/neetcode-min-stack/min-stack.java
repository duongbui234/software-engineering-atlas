// LeetCode 155, Min Stack: ba cách, hai bản sai (Integer ==, tràn int), test.
// Chạy: java min-stack.java   (Java 21, không cần javac)
import java.util.*;
import java.util.function.Supplier;

class MinStackDemo {
    interface MinStackLike { void push(int x); void pop(); int top(); int getMin(); }

    // Mỗi tầng là một mảng int[2] {giá trị, min tới tầng này}: không đóng hộp từng số.
    static class PairMinStack implements MinStackLike {
        private final ArrayDeque<int[]> a = new ArrayDeque<>();
        public void push(int x) { a.push(new int[] {x, a.isEmpty() ? x : Math.min(x, a.peek()[1])}); }
        public void pop() { a.pop(); }
        public int top() { return a.peek()[0]; }
        public int getMin() { return a.peek()[1]; }
    }

    static class TwoStackMinStack implements MinStackLike {
        private final ArrayDeque<Integer> a = new ArrayDeque<>(), mins = new ArrayDeque<>();
        public void push(int x) {
            a.push(x);
            if (mins.isEmpty() || x <= mins.peek()) mins.push(x); // x là int, nên <= mở hộp mins.peek() và so giá trị
        }
        public void pop() {
            if (a.pop().equals(mins.peek())) mins.pop(); // equals so GIÁ TRỊ
        }
        public int top() { return a.peek(); }
        public int getMin() { return mins.peek(); }
    }

    // Lưu hiệu x − min cũ bằng long: hiệu của hai int có thể cần 33 bit.
    static class DiffMinStack implements MinStackLike {
        private final ArrayDeque<Long> d = new ArrayDeque<>();
        private long min;
        public void push(int x) {
            if (d.isEmpty()) { d.push(0L); min = x; return; }
            d.push(x - min);
            if (x < min) min = x;
        }
        public void pop() { long diff = d.pop(); if (diff < 0) min -= diff; }
        public int top() { long diff = d.peek(); return (int) (diff < 0 ? min : min + diff); }
        public int getMin() { return (int) min; }
    }

    // SAI: so hai Integer bằng ==, tức so THAM CHIẾU. Đúng với −128..127 (Integer dùng chung object), sai với 500.
    static class IntegerEqMinStack extends TwoStackMinStack {
        private final ArrayDeque<Integer> a = new ArrayDeque<>(), mins = new ArrayDeque<>();
        @Override public void push(int x) { a.push(x); if (mins.isEmpty() || x <= mins.peek()) mins.push(x); }
        @Override public void pop() { if (a.pop() == mins.peek()) mins.pop(); }
        @Override public int top() { return a.peek(); }
        @Override public int getMin() { return mins.peek(); }
    }

    // SAI: cùng cách lưu hiệu nhưng bằng int. -2147483648 − 2147483647 tràn và quay vòng, không báo lỗi.
    static class IntDiffMinStack implements MinStackLike {
        private final ArrayDeque<Integer> d = new ArrayDeque<>();
        private int min;
        public void push(int x) {
            if (d.isEmpty()) { d.push(0); min = x; return; }
            d.push(x - min);
            if (x < min) min = x;
        }
        public void pop() { int diff = d.pop(); if (diff < 0) min -= diff; }
        public int top() { int diff = d.peek(); return diff < 0 ? min : min + diff; }
        public int getMin() { return min; }
    }

    record Case(String name, Object[][] ops, int[] want) {}

    public static void main(String[] args) {
        Object[] pop = {"pop"}, top = {"top"}, gm = {"getMin"};
        List<Case> cases = List.of(
            new Case("ví dụ của đề", new Object[][] {{"push", -2}, {"push", 0}, {"push", -3}, gm, pop, top, gm}, new int[] {-3, 0, -2}),
            new Case("min lặp lại", new Object[][] {{"push", 0}, {"push", 1}, {"push", 0}, gm, pop, gm}, new int[] {0, 0}),
            new Case("tăng dần", new Object[][] {{"push", 1}, {"push", 2}, {"push", 3}, gm, pop, pop, gm}, new int[] {1, 1}),
            new Case("giảm dần", new Object[][] {{"push", 3}, {"push", 2}, {"push", 1}, gm, pop, gm, pop, gm}, new int[] {1, 2, 3}),
            new Case("biên 32 bit", new Object[][] {{"push", Integer.MAX_VALUE}, {"push", Integer.MIN_VALUE}, gm, top, pop, gm, top},
                new int[] {Integer.MIN_VALUE, Integer.MIN_VALUE, Integer.MAX_VALUE, Integer.MAX_VALUE}),
            new Case("số lớn hơn 127", new Object[][] {{"push", 500}, pop, {"push", 700}, gm}, new int[] {700}));
        Map<String, Supplier<MinStackLike>> impls = new LinkedHashMap<>();
        impls.put("PairMinStack", PairMinStack::new);
        impls.put("TwoStackMinStack", TwoStackMinStack::new);
        impls.put("DiffMinStack", DiffMinStack::new);
        impls.put("IntegerEqMinStack", IntegerEqMinStack::new);
        impls.put("IntDiffMinStack", IntDiffMinStack::new);
        for (var e : impls.entrySet()) {
            List<String> bad = new ArrayList<>();
            for (Case c : cases) {
                MinStackLike s = e.getValue().get();
                List<Integer> out = new ArrayList<>();
                for (Object[] op : c.ops()) {
                    switch ((String) op[0]) {
                        case "push" -> s.push((Integer) op[1]);
                        case "pop" -> s.pop();
                        case "top" -> out.add(s.top());
                        default -> out.add(s.getMin());
                    }
                }
                if (!out.equals(Arrays.stream(c.want()).boxed().toList())) bad.add(c.name() + " → " + out);
            }
            System.out.printf("%-18s %d/%d ca đúng%s%n", e.getKey(), cases.size() - bad.size(), cases.size(), bad.isEmpty() ? "" : "; sai ở: " + String.join(", ", bad));
        }
    }
}
