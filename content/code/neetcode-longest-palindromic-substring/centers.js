function palindromes(text, reuseMirror) {
    const last = 2 * text.length;
    const radius = reuseMirror ? Array(last + 1).fill(0) : [];
    let center = 0, right = 0;
    const answer = {
        start: 0,
        length: 0,
        count: 0
    };
    for(let i = 0; i <= last; i++){
        let length = reuseMirror && i < right ? Math.min(radius[2 * center - i], right - i) : 0;
        while(i - length > 0 && i + length < last){
            const left = i - length - 1;
            const next = i + length + 1;
            if (left % 2 && text[(left - 1) / 2] !== text[(next - 1) / 2]) break;
            length++;
        }
        if (reuseMirror) {
            radius[i] = length;
            if (i + length > right) {
                center = i;
                right = i + length;
            }
        }
        if (length > answer.length) {
            answer.start = (i - length) / 2;
            answer.length = length;
        }
        answer.count += Math.floor((length + 1) / 2);
    }
    return answer;
}
function longestPalindrome(text, reuseMirror = false) {
    const { start, length } = palindromes(text, reuseMirror);
    return text.slice(start, start + length);
}
const cases = [
    [
        "",
        ""
    ],
    [
        "c",
        "c"
    ],
    [
        "xabbaq",
        "abba"
    ],
    [
        "tacocatx",
        "tacocat"
    ],
    [
        "abab",
        "aba"
    ],
    [
        "zzzz",
        "zzzz"
    ],
    [
        "xyz",
        "x"
    ],
    [
        "a".repeat(1000),
        "a".repeat(1000)
    ]
];
for (const [text, expected] of cases){
    if (longestPalindrome(text) !== expected || longestPalindrome(text, true) !== expected) {
        throw new Error("Sai đoạn đối xứng");
    }
}
console.log(`${cases.length}/${cases.length} ca đúng`);
