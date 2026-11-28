// Tham lam theo nhóm (NeetCode MISC-04): bốn bài, mỗi bài một luật cục bộ bị ép buộc.

// Hand of Straights: lá nhỏ nhất còn lại chỉ có thể mở một nhóm, nên mở nhóm ở đó.
function isNStraightHand(hand: number[], groupSize: number): boolean {
    if (hand.length % groupSize !== 0) return false
    const count = new Map<number, number>()
    for (const x of hand) count.set(x, (count.get(x) ?? 0) + 1)
    const keys = [...count.keys()].sort((a, b) => a - b) // so sánh số, không phải chuỗi
    for (const x of keys) {
        const c = count.get(x)! // c lá x còn lại: cả c lá đều phải mở nhóm
        if (c === 0) continue
        for (let v = x; v < x + groupSize; v++) {
            const have = count.get(v) ?? 0
            if (have < c) return false // thiếu lá v: có nhóm không đi tiếp được
            count.set(v, have - c)
        }
    }
    return true
}

// Merge Triplets: bỏ bộ ba nào vượt target ở bất kỳ vị trí nào; các bộ còn lại gộp hết cũng không hại.
function mergeTriplets(triplets: number[][], target: number[]): boolean {
    const good = [false, false, false] // vị trí i đã có bộ an toàn chạm đúng target[i] chưa
    for (const t of triplets) {
        if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue // dùng là hỏng vĩnh viễn
        for (let i = 0; i < 3; i++) if (t[i] === target[i]) good[i] = true
    }
    return good[0] && good[1] && good[2]
}

// Partition Labels: phần phải kéo tới lần xuất hiện cuối của mọi chữ trong nó.
function partitionLabels(s: string): number[] {
    const last = new Map<string, number>()
    for (let i = 0; i < s.length; i++) last.set(s[i], i)
    const sizes: number[] = []
    let start = 0
    let end = 0 // mốc xa nhất mà phần hiện tại buộc phải chạm
    for (let i = 0; i < s.length; i++) {
        end = Math.max(end, last.get(s[i])!)
        if (i === end) { // không chữ nào của phần này còn ở phía sau: cắt
            sizes.push(end - start + 1)
            start = i + 1
        }
    }
    return sizes
}

// Valid Parenthesis String: giữ khoảng [lo, hi] số ngoặc mở chưa đóng có thể có.
function checkValidString(s: string): boolean {
    let lo = 0 // ít nhất (mọi '*' nghiêng về ')')
    let hi = 0 // nhiều nhất (mọi '*' nghiêng về '(')
    for (const c of s) {
        if (c === '(') { lo++; hi++ }
        else if (c === ')') { lo--; hi-- }
        else { lo--; hi++ }
        if (hi < 0) return false // kể cả khi mọi '*' là '(' vẫn thừa ')'
        lo = Math.max(lo, 0) // số ngoặc mở không âm: bỏ các cách đọc vô nghĩa
    }
    return lo === 0
}

// Đáp án mong đợi tính trước bằng vét cạn độc lập (thử mọi cách chia, mọi tập con, mọi cách đọc '*').
const cases: [string, () => unknown, unknown][] = [
    ["hand thiếu lá 7", () => isNStraightHand([3, 1, 5, 8, 2, 6, 4, 5, 3], 3), false],
    ["hand ba nhóm", () => isNStraightHand([1, 2, 2, 3, 3, 4, 4, 5, 6], 3), true],
    ["hand không chia hết", () => isNStraightHand([1, 2, 3, 4, 5], 4), false],
    ["hand nhóm cỡ 1", () => isNStraightHand([7], 1), true],
    ["hand chưa sắp", () => isNStraightHand([2, 1], 2), true],
    ["hand hai nhóm giống nhau", () => isNStraightHand([1, 1, 2, 2, 3, 3], 3), true],
    ["hand hở ở 3", () => isNStraightHand([1, 2, 4, 5, 6, 7], 3), false],
    ["triplets bỏ bộ vượt", () => mergeTriplets([[1, 4, 2], [3, 1, 5], [2, 6, 9], [3, 4, 1]], [3, 4, 5]), true],
    ["triplets thiếu vị trí 3", () => mergeTriplets([[4, 1, 1], [1, 4, 1]], [4, 4, 4]), false],
    ["triplets một bộ đúng", () => mergeTriplets([[5, 5, 5]], [5, 5, 5]), true],
    ["triplets bộ duy nhất chạm bị vượt", () => mergeTriplets([[2, 9, 1], [1, 1, 3]], [2, 2, 3]), false],
    ["triplets không chạm", () => mergeTriplets([[1, 2, 3], [1, 2, 3]], [1, 2, 4]), false],
    ["labels hai phần", () => partitionLabels("abacdcbe").join(","), "7,1"],
    ["labels từng chữ", () => partitionLabels("xyz").join(","), "1,1,1"],
    ["labels một chữ", () => partitionLabels("aaaa").join(","), "4"],
    ["labels nối dài", () => partitionLabels("abcab").join(","), "5"],
    ["labels năm phần", () => partitionLabels("ccbbaddx").join(","), "2,2,1,2,1"],
    ["paren sao ở giữa", () => checkValidString("(*)"), true],
    ["paren sao làm (", () => checkValidString("(*))"), true],
    ["paren mở ở cuối", () => checkValidString("*)("), false],
    ["paren đóng trước", () => checkValidString(")*"), false],
    ["paren thừa mở", () => checkValidString("(((*"), false],
    ["paren một sao", () => checkValidString("*"), true],
    ["paren hai sao", () => checkValidString("((*)*)"), true],
    ["paren sao làm )", () => checkValidString("(*(*)"), true],
    ["paren sao không cứu", () => checkValidString("**(("), false],
]

let ok = 0
for (const [name, run, want] of cases) {
    const got = run()
    if (got === want) ok++
    else console.log(`SAI ${name}: được ${got}, cần ${want}`)
}
console.log(`${ok}/${cases.length} ca đúng`)
