function wordBreak(s: string, words: string[]): boolean {
    const reachable = Array(s.length + 1).fill(false)
    reachable[0] = true
    for (let start = 0; start < s.length; start++) {
        if (!reachable[start]) continue
        for (const word of words) {
            if (s.startsWith(word, start)) reachable[start + word.length] = true
        }
    }
    return reachable[s.length]
}

function lisLength(nums: number[]): number {
    const tails: number[] = []
    for (const value of nums) {
        let lo = 0, hi = tails.length
        while (lo < hi) {
            const mid = lo + Math.floor((hi - lo) / 2)
            if (tails[mid] < value) lo = mid + 1
            else hi = mid
        }
        tails[lo] = value
    }
    return tails.length
}

const checks = [
    wordBreak('atlasroute', ['at', 'atlas', 'route']),
    wordBreak('trailtrail', ['trail']),
    !wordBreak('mapz', ['ma', 'map', 'ap']),
    wordBreak('ababa', ['aba', 'ab']),
    !wordBreak('a'.repeat(299) + 'b', Array.from({length: 20}, (_, i) => 'a'.repeat(i + 1))),
    wordBreak('a'.repeat(300), ['a'.repeat(20)]),
    wordBreak('survey', ['survey']),
    !wordBreak('map', ['mapping']),
    lisLength([-5, -3, -1, 0]) === 4,
    lisLength([10, 8, 6, 4]) === 1,
    lisLength([7, 7, 7]) === 1,
    lisLength([3, 5, 6, 2, 4]) === 3,
    lisLength([4, 4, 1, 2, 2, 3]) === 3,
    lisLength([6, 8, 2, 3, 5, 9]) === 4,
    lisLength(Array.from({length: 2500}, (_, i) => i - 1250)) === 2500,
    lisLength(Array(2500).fill(-10000)) === 1,
]
if (!checks.every(Boolean)) throw new Error('Ca kiểm tra sai')
console.log(`${checks.length}/${checks.length} ca đúng`)
