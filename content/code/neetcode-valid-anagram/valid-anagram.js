// NC-02 Valid Anagram (LeetCode 242), JavaScript thuần.
// Chạy: node valid-anagram.js

/** Đề gốc: chỉ chữ thường a–z. @param {string} s @param {string} t */
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Int32Array(26); // mảng số nguyên cố định, khởi tạo bằng 0
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every((c) => c === 0);
}

/** Câu hỏi mở rộng: chữ Unicode bất kỳ. */
function isAnagramUnicode(s, t) {
  const count = new Map();
  for (const ch of s.normalize('NFC')) count.set(ch, (count.get(ch) || 0) + 1);
  for (const ch of t.normalize('NFC')) {
    if (!count.get(ch)) return false;
    count.set(ch, count.get(ch) - 1);
  }
  for (const c of count.values()) if (c !== 0) return false;
  return true;
}

console.log(isAnagram('anagram', 'nagaram'), isAnagram('rat', 'car')); // true false
console.log(isAnagramUnicode('tiếng việt', 'việt tiếng'), isAnagramUnicode('café', 'éfac')); // true true
