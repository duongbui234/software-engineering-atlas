// Partition Labels (LeetCode 763): vét cạn từng vết cắt, gộp khoảng [đầu, cuối], tham lam một lượt
// Chạy: node labels.ts

// Vét cạn: vết cắt sau vị trí i an toàn khi không chữ nào nằm ở cả hai bên
function partitionBrute(s: string, counter = { steps: 0 }): number[] {
    const n = s.length
    const sizes: number[] = []
    let prev = -1 // vết cắt an toàn gần nhất
    for (let i = 0; i < n; i++) {
        const left = new Array(26).fill(false)
        const right = new Array(26).fill(false)
        for (let j = 0; j <= i; j++) left[s.charCodeAt(j) - 97] = true
        for (let j = i + 1; j < n; j++) right[s.charCodeAt(j) - 97] = true
        counter.steps += n
        let safe = true
        for (let c = 0; c < 26; c++) if (left[c] && right[c]) safe = false
        if (safe) {
            sizes.push(i - prev) // cắt ở mọi chỗ an toàn
            prev = i
        }
    }
    return sizes
}

// Gộp khoảng: mỗi chữ là một khoảng [lần đầu, lần cuối]; khoảng chồng nhau phải chung một phần
function partitionIntervals(s: string): number[] {
    const first = new Array(26).fill(-1)
    const last = new Array(26).fill(-1)
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i) - 97
        if (first[c] === -1) first[c] = i
        last[c] = i
    }
    const spans: [number, number][] = []
    for (let c = 0; c < 26; c++) if (first[c] !== -1) spans.push([first[c], last[c]])
    spans.sort((a, b) => a[0] - b[0])
    const sizes: number[] = []
    let [lo, hi] = spans[0]
    for (const [a, b] of spans.slice(1)) {
        if (a > hi) {
            sizes.push(hi - lo + 1) // khoảng mới không chạm khoảng đang gộp: chốt một phần
            ;[lo, hi] = [a, b]
        } else hi = Math.max(hi, b)
    }
    sizes.push(hi - lo + 1)
    return sizes
}

// Cách chính: bảng lần xuất hiện cuối, kéo end tới lần cuối xa nhất, cắt khi i chạm end
function partitionLabels(s: string, counter = { steps: 0 }): number[] {
    const last = new Array(26).fill(0)
    for (let i = 0; i < s.length; i++) {
        last[s.charCodeAt(i) - 97] = i
        counter.steps++
    }
    const sizes: number[] = []
    let start = 0
    let end = 0 // phần hiện tại phải kéo ít nhất tới đây
    for (let i = 0; i < s.length; i++) {
        end = Math.max(end, last[s.charCodeAt(i) - 97])
        counter.steps++
        if (i === end) {
            sizes.push(end - start + 1) // mọi chữ trong phần đã hết: cắt sớm nhất có thể
            start = i + 1
        }
    }
    return sizes
}

// Bản sai: cắt khi chữ hiện tại hết, quên các chữ khác trong phần
function partitionNoMax(s: string): number[] {
    const last = new Array(26).fill(0)
    for (let i = 0; i < s.length; i++) last[s.charCodeAt(i) - 97] = i
    const sizes: number[] = []
    let start = 0
    for (let i = 0; i < s.length; i++) {
        if (last[s.charCodeAt(i) - 97] === i) {
            sizes.push(i - start + 1)
            start = i + 1
        }
    }
    return sizes
}

const same = (a: number[], b: number[]) => a.length === b.length && a.every((x, i) => x === b[i])

const cases: [string, number[]][] = [
    ['a', [1]],
    ['abc', [1, 1, 1]],
    ['aaaa', [4]],
    ['abca', [4]],
    ['abbacdc', [4, 3]],
    ['xyzzyxw', [6, 1]],
    ['aabbccab', [8]],
    ['qwqeer', [3, 2, 1]],
]
let ok = 0
for (const [s, want] of cases) {
    const got = [partitionBrute(s), partitionIntervals(s), partitionLabels(s)]
    if (got.every((x) => same(x, want))) ok++
    else console.log('sai ở', s, JSON.stringify(got))
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu: mọi chuỗi dài 1–7 trên bảng chữ {a, b, c}
let total = 0
let good = 0
let wrong = 0
const walk = (s: string) => {
    if (s.length > 0) {
        total++
        const b = partitionBrute(s)
        if (same(b, partitionIntervals(s)) && same(b, partitionLabels(s))) good++
        if (!same(b, partitionNoMax(s))) wrong++
    }
    if (s.length === 7) return
    for (const ch of 'abc') walk(s + ch)
}
walk('')
console.log(`${good}/${total} ca đúng (đối chiếu vét cạn)`)
console.log(`Cắt khi chữ hiện tại hết (bỏ max): sai ${wrong}/${total} ca`)

// Đo: n = 10000, 5 khối 2000 ký tự, khối k chỉ dùng 5 chữ của riêng nó
const n = 10000
let big = ''
for (let i = 0; i < n; i++) big += String.fromCharCode(97 + 5 * Math.floor(i / 2000) + ((i * 3) % 5))
const bc = { steps: 0 }
let t0 = performance.now()
const b = partitionBrute(big, bc)
const bruteMs = performance.now() - t0
const gc = { steps: 0 }
t0 = performance.now()
const g = partitionLabels(big, gc)
const greedyMs = performance.now() - t0
console.log(`n = ${n}, ${g.length} phần (${same(b, g) ? 'khớp' : 'lệch'}): vét cạn ${bc.steps} bước (${bruteMs.toFixed(1)} ms), tham lam ${gc.steps} bước (${greedyMs.toFixed(2)} ms)`)
