from bisect import bisect_left


def word_break(s, words):
    reachable = [True] + [False] * len(s)
    for start in range(len(s)):
        if not reachable[start]:
            continue
        for word in words:
            if s.startswith(word, start):
                reachable[start + len(word)] = True
    return reachable[len(s)]


def lis_length(nums):
    tails = []
    for value in nums:
        i = bisect_left(tails, value)
        if i == len(tails):
            tails.append(value)
        else:
            tails[i] = value
    return len(tails)


checks = [
    word_break('atlasroute', ['at', 'atlas', 'route']),
    word_break('trailtrail', ['trail']),
    not word_break('mapz', ['ma', 'map', 'ap']),
    word_break('ababa', ['aba', 'ab']),
    not word_break('a' * 299 + 'b', ['a' * i for i in range(1, 21)]),
    word_break('a' * 300, ['a' * 20]),
    word_break('survey', ['survey']),
    not word_break('map', ['mapping']),
    lis_length([-5, -3, -1, 0]) == 4,
    lis_length([10, 8, 6, 4]) == 1,
    lis_length([7, 7, 7]) == 1,
    lis_length([3, 5, 6, 2, 4]) == 3,
    lis_length([4, 4, 1, 2, 2, 3]) == 3,
    lis_length([6, 8, 2, 3, 5, 9]) == 4,
    lis_length(range(-1250, 1250)) == 2500,
    lis_length([-10000] * 2500) == 1,
]
if not all(checks):
    raise AssertionError('Ca kiểm tra sai')
print(f"{len(checks)}/{len(checks)} ca đúng")
