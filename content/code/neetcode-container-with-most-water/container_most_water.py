# LeetCode 11, Container With Most Water: hai cách và test.
# Chạy: python3 container_most_water.py


def brute_force(h: list[int]) -> int:
    return max((j - i) * min(h[i], h[j]) for i in range(len(h)) for j in range(i + 1, len(h)))


def two_pointers(h: list[int]) -> int:
    i, j, best = 0, len(h) - 1, 0
    while i < j:
        best = max(best, (j - i) * min(h[i], h[j]))
        if h[i] < h[j]:  # cột thấp giới hạn mực nước: bỏ nó
            i += 1
        else:
            j -= 1
    return best


cases = [([1, 8, 6, 2, 5, 4, 8, 3, 7], 49), ([1, 1], 1), ([4, 3, 2, 1, 4], 16), ([1, 2, 1], 2),
         ([2, 3, 4, 5, 18, 17, 6], 17), ([0, 0, 0], 0), ([1, 3, 2, 5, 25, 24, 5], 24)]
for fn in (brute_force, two_pointers):
    ok = sum(fn(h) == w for h, w in cases)
    print(f"{fn.__name__:12} {ok}/{len(cases)} ca đúng")
