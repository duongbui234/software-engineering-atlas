def search_word_break(s, words, memo):
    cache = {} if memo else None

    def search(i):
        if i == len(s):
            return True
        if cache is not None and i in cache:
            return cache[i]
        found = any(s.startswith(word, i) and search(i + len(word)) for word in words)
        if cache is not None:
            cache[i] = found
        return found

    return search(0)


def word_break_dp(s, words):
    reachable = [True] + [False] * len(s)
    for i in range(len(s)):
        if not reachable[i]:
            continue
        for word in words:
            if s.startswith(word, i):
                reachable[i + len(word)] = True
    return reachable[-1]


max_word = 'abcdefghijklmnopqrst'
cases = [
    ('cabin', ['cab', 'ca', 'bin'], True),
    ('cabin', ['cab', 'bin'], False),
    ('cabin', ['c', 'ca', 'bin'], True),
    ('mintminttea', ['mint', 'tea'], True),
    ('teas', ['teashop', 'tea', 's'], True),
    ('s', ['ss'], False),
    ('bot', ['bot'], True),
    ('ababab', ['ab', 'aba'], True),
    ('a' * 18 + 'b', ['a', 'aa'], False),
    (max_word * 15, [max_word], True),
    ('a' * 299 + 'b', ['a', 'aa'], False),
]
for s, words, expected in cases:
    assert word_break_dp(s, words) == expected
    assert search_word_break(s, words, True) == expected
    if len(s) <= 20:
        assert search_word_break(s, words, False) == expected
print(f'{len(cases)}/{len(cases)} ca đúng')
