// LeetCode 355: Design Twitter. Chạy: java design-twitter.java
// postTweet, follow, unfollow, và getNewsFeed: 10 tweet mới nhất của chính mình và người mình theo dõi.
import java.util.*;

class DesignTwitterDemo {
    // Trộn k danh sách bằng PriorityQueue. Mỗi phần tử heap: {time, tweetId, userId, chỉ số}.
    static class Twitter {
        private int time = 0; // đồng hồ toàn cục
        private final Map<Integer, List<int[]>> tweets = new HashMap<>(); // userId → [{time, tweetId}], cũ trước mới sau
        private final Map<Integer, Set<Integer>> follows = new HashMap<>();

        public void postTweet(int userId, int tweetId) {
            tweets.computeIfAbsent(userId, k -> new ArrayList<>()).add(new int[]{time++, tweetId});
        }

        public List<Integer> getNewsFeed(int userId) {
            // max-heap theo time; Integer.compare thay cho b[0] - a[0] để không bao giờ tràn số
            PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(b[0], a[0]));
            Set<Integer> sources = new HashSet<>(follows.getOrDefault(userId, Set.of()));
            sources.add(userId);
            for (int u : sources) {
                List<int[]> lst = tweets.get(u);
                if (lst != null && !lst.isEmpty()) {
                    int i = lst.size() - 1;
                    heap.add(new int[]{lst.get(i)[0], lst.get(i)[1], u, i});
                }
            }
            List<Integer> feed = new ArrayList<>();
            while (!heap.isEmpty() && feed.size() < 10) {
                int[] top = heap.poll();
                feed.add(top[1]);
                if (top[3] > 0) {
                    int[] p = tweets.get(top[2]).get(top[3] - 1);
                    heap.add(new int[]{p[0], p[1], top[2], top[3] - 1});
                }
            }
            return feed;
        }

        public void follow(int followerId, int followeeId) {
            if (followerId != followeeId) follows.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);
        }

        public void unfollow(int followerId, int followeeId) {
            Set<Integer> s = follows.get(followerId);
            if (s != null) s.remove(followeeId);
        }
    }

    record Op(String kind, int a, int b, List<Integer> want) {}
    static Op P(int u, int id) { return new Op("post", u, id, null); }
    static Op F(int a, int b) { return new Op("follow", a, b, null); }
    static Op U(int a, int b) { return new Op("unfollow", a, b, null); }
    static Op G(int u, Integer... want) { return new Op("feed", u, 0, List.of(want)); }

    public static void main(String[] args) {
        Map<String, List<Op>> cases = new LinkedHashMap<>();
        cases.put("ví dụ của đề", List.of(P(1, 5), G(1, 5), F(1, 2), P(2, 6), G(1, 6, 5), U(1, 2), G(1, 5)));
        cases.put("chưa ai đăng gì", List.of(G(7)));
        cases.put("thấy tweet của chính mình", List.of(P(1, 1), P(1, 2), G(1, 2, 1)));
        cases.put("xen kẽ hai người", List.of(F(1, 2), P(1, 10), P(2, 20), P(1, 11), P(2, 21), G(1, 21, 11, 20, 10)));
        List<Op> hon10 = new ArrayList<>(List.of(F(1, 2)));
        for (int i = 0; i < 12; i++) hon10.add(P(1 + i % 2, 100 + i));
        hon10.add(G(1, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102));
        cases.put("hơn 10 tweet", hon10);
        cases.put("tự follow rồi tự unfollow", List.of(P(1, 5), F(1, 1), U(1, 1), G(1, 5)));
        cases.put("unfollow người chưa theo dõi", List.of(P(2, 9), U(1, 2), G(1)));
        cases.put("follow hai lần", List.of(F(1, 2), F(1, 2), P(2, 3), G(1, 3), U(1, 2), G(1)));
        cases.put("tweet đăng trước khi follow vẫn hiện", List.of(P(2, 1), P(2, 2), F(1, 2), G(1, 2, 1)));

        List<String> bad = new ArrayList<>();
        for (var c : cases.entrySet()) {
            Twitter tw = new Twitter();
            boolean ok = true;
            List<String> got = new ArrayList<>();
            for (Op o : c.getValue()) {
                switch (o.kind()) {
                    case "post" -> tw.postTweet(o.a(), o.b());
                    case "follow" -> tw.follow(o.a(), o.b());
                    case "unfollow" -> tw.unfollow(o.a(), o.b());
                    default -> { List<Integer> f = tw.getNewsFeed(o.a()); got.add(f.toString()); ok &= f.equals(o.want()); }
                }
            }
            if (!ok) bad.add(c.getKey() + " → " + String.join(" ", got));
        }
        System.out.println("Twitter  " + (cases.size() - bad.size()) + "/" + cases.size() + " ca đúng" + (bad.isEmpty() ? "" : "; sai ở: " + String.join("; ", bad)));

        // Bẫy: duyệt PriorityQueue bằng for-each (hay in nó) không theo thứ tự ưu tiên. Chỉ poll() mới ra đúng thứ tự.
        PriorityQueue<Integer> pq = new PriorityQueue<>(Comparator.reverseOrder());
        pq.addAll(List.of(3, 9, 1, 7, 5, 8));
        System.out.println("\nduyệt PriorityQueue: " + pq);
        List<Integer> polled = new ArrayList<>();
        while (!pq.isEmpty()) polled.add(pq.poll());
        System.out.println("poll lần lượt:       " + polled);
    }
}
