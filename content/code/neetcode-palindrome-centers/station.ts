type Stats = { start: number; length: number; count: number };

function palindromes(text: string, reuseMirror: boolean): Stats {
  const last = 2 * text.length;
  const radius = reuseMirror ? Array<number>(last + 1).fill(0) : [];
  let center = 0, right = 0;
  const answer: Stats = { start: 0, length: 0, count: 0 };

  for (let i = 0; i <= last; i++) {
    let length = reuseMirror && i < right ? Math.min(radius[2 * center - i], right - i) : 0;
    while (i - length > 0 && i + length < last) {
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

function longestPalindrome(text: string, reuseMirror = false): string {
  const { start, length } = palindromes(text, reuseMirror);
  return text.slice(start, start + length);
}

function countSubstrings(text: string, reuseMirror = false): number {
  return palindromes(text, reuseMirror).count;
}

// EXAMPLE
const text = "xabbaq";
for (const reuseMirror of [false, true]) {
  if (longestPalindrome(text, reuseMirror) !== "abba") throw new Error("Sai đoạn dài nhất");
  if (countSubstrings(text, reuseMirror) !== 8) throw new Error("Sai số đoạn");
}
console.log("2/2 ca đúng");
