# Ga SRCH-04, hai heap và lập lịch: giải 621, 355 và 295 bằng heapq.
# Chạy: python3 two_heaps_station.py
import heapq
from collections import Counter, deque


def least_interval(tasks, n):
    # 621: max-heap số lần còn lại (heapq trên số âm); việc vừa chạy nghỉ trong hàng chờ tới thời điểm được chạy lại.
    ready = [-c for c in Counter(tasks).values()]
    heapq.heapify(ready)
    cooling = deque()  # (số lần còn lại, thời điểm được chạy lại)
    time = 0
    while ready or cooling:
        time += 1
        if ready:
            left = -heapq.heappop(ready) - 1
            if left:
                cooling.append((left, time + n))
        if cooling and cooling[0][1] == time:
            heapq.heappush(ready, -cooling.popleft()[0])
    return time


class Twitter:
    # 355: bảng tin là trộn k danh sách tweet (k-way merge) bằng max-heap theo thời điểm (số âm).
    def __init__(self):
        self.clock = 0
        self.tweets = {}  # user → [(thời điểm, tweetId), …] tăng dần
        self.follows = {}

    def postTweet(self, user, tweet):
        self.tweets.setdefault(user, []).append((self.clock, tweet))
        self.clock += 1

    def getNewsFeed(self, user):
        heap = []
        for u in {user} | self.follows.get(user, set()):
            lst = self.tweets.get(u)
            if lst:
                heap.append((-lst[-1][0], u, len(lst) - 1))
        heapq.heapify(heap)
        feed = []
        while heap and len(feed) < 10:
            _, u, i = heapq.heappop(heap)
            lst = self.tweets[u]
            feed.append(lst[i][1])
            if i > 0:
                heapq.heappush(heap, (-lst[i - 1][0], u, i - 1))
        return feed

    def follow(self, a, b):
        self.follows.setdefault(a, set()).add(b)

    def unfollow(self, a, b):
        self.follows.get(a, set()).discard(b)


class MedianFinder:
    # 295: lower là max-heap (số âm) giữ nửa nhỏ, upper là min-heap giữ nửa lớn.
    def __init__(self):
        self.lower, self.upper = [], []

    def addNum(self, x):
        heapq.heappush(self.lower, -x)
        heapq.heappush(self.upper, -heapq.heappop(self.lower))
        if len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def findMedian(self):
        if len(self.lower) > len(self.upper):
            return -self.lower[0]
        return (-self.lower[0] + self.upper[0]) / 2


def feed_example():
    t, out = Twitter(), []
    t.postTweet(1, 5); out.append(t.getNewsFeed(1))
    t.follow(1, 2); t.postTweet(2, 6); out.append(t.getNewsFeed(1))
    t.unfollow(1, 2); out.append(t.getNewsFeed(1))
    return out


def feed_ten():
    t = Twitter()
    for i in range(1, 12):
        t.postTweet(1, i)
    return t.getNewsFeed(1)


def feed_self():
    t = Twitter()
    t.postTweet(1, 7); t.follow(1, 1)
    return t.getNewsFeed(1)


def feed_three():
    t = Twitter()
    t.postTweet(1, 1); t.postTweet(2, 2); t.postTweet(3, 3); t.postTweet(1, 4)
    t.follow(1, 2); t.follow(1, 3)
    return t.getNewsFeed(1)


def medians(xs):
    m, out = MedianFinder(), []
    for x in xs:
        m.addNum(x)
        out.append(m.findMedian())
    return out


checks = [
    ("621 ví dụ 1", lambda: least_interval("AAABBB", 2), 8),
    ("621 ví dụ 2", lambda: least_interval("ACABDB", 1), 6),
    ("621 ví dụ 3", lambda: least_interval("AAABBB", 3), 10),
    ("621 nhiều loại việc", lambda: least_interval("AAAAAABCDEFG", 2), 16),
    ("621 n = 0", lambda: least_interval("AAB", 0), 3),
    ("355 ví dụ của đề", feed_example, [[5], [6, 5], [5]]),
    ("355 chỉ 10 tweet mới nhất", feed_ten, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]),
    ("355 tự theo dõi mình", feed_self, [7]),
    ("355 xen kẽ ba người", feed_three, [4, 3, 2, 1]),
    ("295 ví dụ của đề", lambda: medians([1, 2, 3])[1:], [1.5, 2]),
    ("295 giảm dần", lambda: medians([5, 4, 3, 2, 1]), [5, 4.5, 4, 3.5, 3]),
    ("295 số âm", lambda: medians([-1, -2, -3, -4]), [-1, -1.5, -2, -2.5]),
    ("295 trùng nhau", lambda: medians([7, 7, 7, 7])[-1], 7),
    ("295 xen kẽ", lambda: medians([6, 10, 2, 6, 5, 0]), [6, 8, 6, 6, 6, 5.5]),
]
bad = [f"{label} → {f()}" for label, f, want in checks if f() != want]
print(f"two_heaps_station {len(checks) - len(bad)}/{len(checks)} ca đúng" + ("; sai ở: " + "; ".join(bad) if bad else ""))
