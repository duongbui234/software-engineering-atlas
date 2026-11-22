// NC-04 Group Anagrams (LeetCode 49), JavaScript thuần.
// Chạy: node group-anagrams.js

/** @param {string[]} strs @returns {string[][]} */
function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const count = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) count[s.charCodeAt(i) - 97]++;
    const key = count.join('#'); // mảng không làm khóa Map được: hai mảng khác nhau luôn là hai khóa khác nhau
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return [...groups.values()];
}

console.log(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']));

// Vì sao phải đổi mảng thành chuỗi: Map so khóa object theo danh tính, không theo nội dung.
const m = new Map();
m.set([1, 2], 'x');
console.log('m.get([1, 2]) =', m.get([1, 2]), '| m.get("1,2") =', new Map([['1,2', 'x']]).get('1,2'));
