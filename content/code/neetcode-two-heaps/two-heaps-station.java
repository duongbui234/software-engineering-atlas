// Ga SRCH-04, hai heap và lập lịch: giải 621, 355 và 295 bằng PriorityQueue.
// Chạy: java two-heaps-station.java
import java.util.*;

class TwoHeapsStation {
    // 621: max-heap số lần còn lại; việc vừa chạy nghỉ trong hàng chờ tới thời điểm được chạy lại.
    static int leastInterval(char[] tasks, int n) {
        int[] count = new int[26];
        for (char t : tasks) count[t - 'A']++;
        PriorityQueue<Integer> ready = new PriorityQueue<>(Collections.reverseOrder());
        for (int c : count) if (c > 0) ready.offer(c);
        ArrayDeque<int[]> cooling = new ArrayDeque<>(); // {số lần còn lại, thời điểm được chạy lại}
        int time = 0;
        while (!ready.isEmpty() || !cooling.isEmpty()) {
            time++;
            if (!ready.isEmpty()) {
                int left = ready.poll() - 1;
                if (left > 0) cooling.add(new int[]{left, time + n});
            }
            if (!cooling.isEmpty() && cooling.peek()[1] == time) ready.offer(cooling.poll()[0]);
        }
        return time;
    }

    // 355: bảng tin là trộn k danh sách tweet (k-way merge) bằng max-heap theo thời điểm.
    static class Twitter {
        int clock = 0;
        Map<Integer, List<int[]>> tweets = new HashMap<>(); // user → [{thời điểm, tweetId}, …] tăng dần
        Map<Integer, Set<Integer>> follows = new HashMap<>();

        void postTweet(int user, int id) { tweets.computeIfAbsent(user, k -> new ArrayList<>()).add(new int[]{clock++, id}); }

        List<Integer> getNewsFeed(int user) {
            PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(b[0], a[0])); // {thời điểm, user, chỉ số}
            Set<Integer> users = new HashSet<>(follows.getOrDefault(user, Set.of()));
            users.add(user);
            for (int u : users) {
                List<int[]> l = tweets.get(u);
                if (l != null && !l.isEmpty()) heap.offer(new int[]{l.get(l.size() - 1)[0], u, l.size() - 1});
            }
            List<Integer> feed = new ArrayList<>();
            while (!heap.isEmpty() && feed.size() < 10) {
                int[] c = heap.poll();
                List<int[]> l = tweets.get(c[1]);
                feed.add(l.get(c[2])[1]);
                if (c[2] > 0) heap.offer(new int[]{l.get(c[2] - 1)[0], c[1], c[2] - 1});
            }
            return feed;
        }

        void follow(int a, int b) { follows.computeIfAbsent(a, k -> new HashSet<>()).add(b); }

        void unfollow(int a, int b) { follows.getOrDefault(a, new HashSet<>()).remove(b); }
    }

    // 295: lower là max-heap giữ nửa nhỏ, upper là min-heap giữ nửa lớn.
    static class MedianFinder {
        PriorityQueue<Integer> lower = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Integer> upper = new PriorityQueue<>();

        void addNum(int x) {
            lower.offer(x);
            upper.offer(lower.poll());
            if (upper.size() > lower.size()) lower.offer(upper.poll());
        }

        double findMedian() {
            if (lower.size() > upper.size()) return lower.peek();
            return ((long) lower.peek() + upper.peek()) / 2.0;
        }
    }

    static List<Double> medians(int... xs) {
        MedianFinder m = new MedianFinder();
        List<Double> out = new ArrayList<>();
        for (int x : xs) { m.addNum(x); out.add(m.findMedian()); }
        return out;
    }

    public static void main(String[] args) {
        List<Object[]> checks = new ArrayList<>();
        checks.add(new Object[]{"621 ví dụ 1", leastInterval("AAABBB".toCharArray(), 2), 8});
        checks.add(new Object[]{"621 ví dụ 2", leastInterval("ACABDB".toCharArray(), 1), 6});
        checks.add(new Object[]{"621 ví dụ 3", leastInterval("AAABBB".toCharArray(), 3), 10});
        checks.add(new Object[]{"621 nhiều loại việc", leastInterval("AAAAAABCDEFG".toCharArray(), 2), 16});
        checks.add(new Object[]{"621 n = 0", leastInterval("AAB".toCharArray(), 0), 3});
        Twitter t = new Twitter();
        List<List<Integer>> ex = new ArrayList<>();
        t.postTweet(1, 5); ex.add(t.getNewsFeed(1));
        t.follow(1, 2); t.postTweet(2, 6); ex.add(t.getNewsFeed(1));
        t.unfollow(1, 2); ex.add(t.getNewsFeed(1));
        checks.add(new Object[]{"355 ví dụ của đề", ex, List.of(List.of(5), List.of(6, 5), List.of(5))});
        Twitter ten = new Twitter();
        for (int i = 1; i <= 11; i++) ten.postTweet(1, i);
        checks.add(new Object[]{"355 chỉ 10 tweet mới nhất", ten.getNewsFeed(1), List.of(11, 10, 9, 8, 7, 6, 5, 4, 3, 2)});
        Twitter self = new Twitter();
        self.postTweet(1, 7); self.follow(1, 1);
        checks.add(new Object[]{"355 tự theo dõi mình", self.getNewsFeed(1), List.of(7)});
        Twitter three = new Twitter();
        three.postTweet(1, 1); three.postTweet(2, 2); three.postTweet(3, 3); three.postTweet(1, 4);
        three.follow(1, 2); three.follow(1, 3);
        checks.add(new Object[]{"355 xen kẽ ba người", three.getNewsFeed(1), List.of(4, 3, 2, 1)});
        checks.add(new Object[]{"295 ví dụ của đề", medians(1, 2, 3).subList(1, 3), List.of(1.5, 2.0)});
        checks.add(new Object[]{"295 giảm dần", medians(5, 4, 3, 2, 1), List.of(5.0, 4.5, 4.0, 3.5, 3.0)});
        checks.add(new Object[]{"295 số âm", medians(-1, -2, -3, -4), List.of(-1.0, -1.5, -2.0, -2.5)});
        checks.add(new Object[]{"295 trùng nhau", medians(7, 7, 7, 7).get(3), 7.0});
        checks.add(new Object[]{"295 xen kẽ", medians(6, 10, 2, 6, 5, 0), List.of(6.0, 8.0, 6.0, 6.0, 6.0, 5.5)});
        List<String> bad = new ArrayList<>();
        for (Object[] c : checks) if (!c[1].equals(c[2])) bad.add(c[0] + " → " + c[1]);
        System.out.println("two-heaps-station " + (checks.size() - bad.size()) + "/" + checks.size() + " ca đúng"
            + (bad.isEmpty() ? "" : "; sai ở: " + String.join("; ", bad)));
    }
}
