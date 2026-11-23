# LeetCode 355: Design Twitter. Chạy: python3 design_twitter.py
# postTweet, follow, unfollow, và getNewsFeed: 10 tweet mới nhất của chính mình và người mình theo dõi.
import heapq
from collections import defaultdict
from itertools import islice


class Twitter:
    """Trộn k danh sách bằng heap. heapq là min-heap, nên khóa là -time."""

    def __init__(self):
        self.time = 0                       # đồng hồ toàn cục: không bao giờ trùng
        self.tweets = defaultdict(list)     # userId → [(time, tweetId), …], cũ trước mới sau
        self.follows = defaultdict(set)     # followerId → tập followeeId, không chứa chính mình

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweets[userId].append((self.time, tweetId))
        self.time += 1

    def getNewsFeed(self, userId: int) -> list[int]:
        heap = []
        for u in self.follows.get(userId, set()) | {userId}:
            lst = self.tweets.get(u)  # .get: đọc defaultdict bằng [] sẽ tạo key rỗng
            if lst:
                t, tid = lst[-1]
                heap.append((-t, tid, u, len(lst) - 1))
        heapq.heapify(heap)
        feed = []
        while heap and len(feed) < 10:
            _, tid, u, i = heapq.heappop(heap)
            feed.append(tid)
            if i > 0:
                t, prev = self.tweets[u][i - 1]
                heapq.heappush(heap, (-t, prev, u, i - 1))
        return feed

    def follow(self, followerId: int, followeeId: int) -> None:
        if followerId != followeeId:  # tự theo dõi mình: bỏ qua
            self.follows[followerId].add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.follows[followerId].discard(followeeId)  # discard: không có thì thôi, remove sẽ ném KeyError


class MergeTwitter(Twitter):
    """heapq.merge trộn sẵn các dãy đã sắp; reverse=True vì mỗi dãy đi từ mới tới cũ."""

    def getNewsFeed(self, userId: int) -> list[int]:
        sources = self.follows.get(userId, set()) | {userId}
        streams = [reversed(self.tweets[u]) for u in sources if u in self.tweets]
        merged = heapq.merge(*streams, key=lambda p: p[0], reverse=True)
        return [tid for _, tid in islice(merged, 10)]


CASES = [
    ("ví dụ của đề", [("post", 1, 5), ("feed", 1, [5]), ("follow", 1, 2), ("post", 2, 6), ("feed", 1, [6, 5]), ("unfollow", 1, 2), ("feed", 1, [5])]),
    ("chưa ai đăng gì", [("feed", 7, [])]),
    ("thấy tweet của chính mình", [("post", 1, 1), ("post", 1, 2), ("feed", 1, [2, 1])]),
    ("xen kẽ hai người", [("follow", 1, 2), ("post", 1, 10), ("post", 2, 20), ("post", 1, 11), ("post", 2, 21), ("feed", 1, [21, 11, 20, 10])]),
    ("hơn 10 tweet", [("follow", 1, 2)] + [("post", 1 + i % 2, 100 + i) for i in range(12)] + [("feed", 1, list(range(111, 101, -1)))]),
    ("tự follow rồi tự unfollow", [("post", 1, 5), ("follow", 1, 1), ("unfollow", 1, 1), ("feed", 1, [5])]),
    ("unfollow người chưa theo dõi", [("post", 2, 9), ("unfollow", 1, 2), ("feed", 1, [])]),
    ("follow hai lần", [("follow", 1, 2), ("follow", 1, 2), ("post", 2, 3), ("feed", 1, [3]), ("unfollow", 1, 2), ("feed", 1, [])]),
    ("tweet đăng trước khi follow vẫn hiện", [("post", 2, 1), ("post", 2, 2), ("follow", 1, 2), ("feed", 1, [2, 1])]),
]


def check(cls):
    bad = []
    for label, ops in CASES:
        tw, ok, got = cls(), True, []
        for op in ops:
            if op[0] == "post": tw.postTweet(op[1], op[2])
            elif op[0] == "follow": tw.follow(op[1], op[2])
            elif op[0] == "unfollow": tw.unfollow(op[1], op[2])
            else:
                f = tw.getNewsFeed(op[1]); got.append(f)
                ok &= f == op[2]
        if not ok: bad.append(f"{label} → {got}")
    print(f"{cls.__name__:13} {len(CASES) - len(bad)}/{len(CASES)} ca đúng" + ("; sai ở: " + "; ".join(bad) if bad else ""))


check(Twitter)
check(MergeTwitter)


# Bẫy: heapq so tuple từng phần tử. Hai tweet cùng thời gian (giờ hệ thống) thì Python so tiếp phần tử thứ hai;
# nếu đó là một object không định nghĩa <, heappush ném TypeError.
class Tweet:
    def __init__(self, tweet_id): self.id = tweet_id

heap = []
heapq.heappush(heap, (-1700000000, Tweet(1)))
try:
    heapq.heappush(heap, (-1700000000, Tweet(2)))
    print("\nhai tweet cùng thời gian: không lỗi")
except TypeError as e:
    print(f"\nhai tweet cùng thời gian, phần tử thứ hai là object: TypeError: {e}")
