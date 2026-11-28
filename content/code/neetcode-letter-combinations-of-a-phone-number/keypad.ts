// Letter Combinations of a Phone Number (LeetCode 17): ba cách cho cùng một bài.
// Chạy: node keypad.ts

const KEYS: Record<string, string> = {
    "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
    "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
}

let calls = 0

// Cách 1: quay lui với một bộ đệm ký tự, thêm rồi gỡ ở mỗi tầng.
function combineBacktrack(digits: string): string[] {
    const result: string[] = []
    if (digits.length === 0) return result // chuỗi rỗng cho [], không phải [""]
    const buffer: string[] = []
    function walk(index: number): void {
        calls++
        if (index === digits.length) {
            result.push(buffer.join(""))
            return
        }
        for (const letter of KEYS[digits[index]]) {
            buffer.push(letter)
            walk(index + 1)
            buffer.pop()
        }
    }
    walk(0)
    return result
}

// Cách 2: dựng dần theo từng chữ số, nối mỗi tiền tố với mọi chữ cái của phím kế tiếp.
function combineIterative(digits: string): string[] {
    if (digits.length === 0) return []
    let layer = [""]
    for (const digit of digits) {
        const next: string[] = []
        for (const prefix of layer) {
            for (const letter of KEYS[digit]) next.push(prefix + letter)
        }
        layer = next
    }
    return layer
}

// Cách 3: bộ đếm hỗn cơ số, mỗi vị trí đếm từ 0 tới số chữ cái của phím đó.
function combineCounter(digits: string): string[] {
    if (digits.length === 0) return []
    const sizes = [...digits].map((d) => KEYS[d].length)
    const odometer = sizes.map(() => 0)
    const result: string[] = []
    while (true) {
        result.push(odometer.map((v, i) => KEYS[digits[i]][v]).join(""))
        let pos = digits.length - 1
        while (pos >= 0 && odometer[pos] === sizes[pos] - 1) {
            odometer[pos] = 0
            pos--
        }
        if (pos < 0) return result
        odometer[pos]++
    }
}

type Case = [string, number, string, string, string | null]
const CASES: Case[] = [
    ["23", 9, "ad", "cf", "ad,ae,af,bd,be,bf,cd,ce,cf"],
    ["", 0, "", "", ""],
    ["2", 3, "a", "c", "a,b,c"],
    ["7", 4, "p", "s", "p,q,r,s"],
    ["9", 4, "w", "z", "w,x,y,z"],
    ["22", 9, "aa", "cc", "aa,ab,ac,ba,bb,bc,ca,cb,cc"],
    ["79", 16, "pw", "sz", null],
    ["56", 9, "jm", "lo", null],
    ["234", 27, "adg", "cfi", null],
    ["2345", 81, "adgj", "cfil", null],
    ["7999", 256, "pwww", "szzz", null],
]

function fits(got: string[], c: Case): boolean {
    const [, count, first, last, full] = c
    if (got.length !== count) return false
    if (count > 0 && (got[0] !== first || got[count - 1] !== last)) return false
    if (full !== null && got.join(",") !== full) return false
    return new Set(got).size === got.length
}

let ok = 0
for (const c of CASES) {
    const d = c[0]
    if ([combineBacktrack, combineIterative, combineCounter].every((f) => fits(f(d), c))) ok++
    else console.log("sai ở", JSON.stringify(d))
}
console.log(`${ok}/${CASES.length} ca đúng`)

// Đối chiếu: mọi chuỗi chữ số 2–9 dài 0–4, so với cách dựng lặp.
let total = 0, same = 0
const digitSet = "23456789"
function each(prefix: string): void {
    total++
    const want = combineIterative(prefix).join(",")
    if (combineBacktrack(prefix).join(",") === want && combineCounter(prefix).join(",") === want) same++
    if (prefix.length < 4) for (const d of digitSet) each(prefix + d)
}
each("")
console.log(`${same}/${total} ca đúng (đối chiếu tích Descartes lặp)`)

calls = 0
const sample = combineBacktrack("7999")
console.log(`7999: ${sample.length} tổ hợp, ${calls} lượt gọi quay lui`)
