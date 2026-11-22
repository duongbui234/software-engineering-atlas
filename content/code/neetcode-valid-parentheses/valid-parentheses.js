// LeetCode 20, Valid Parentheses: xóa cặp lặp và ngăn xếp bằng mảng.
// Chạy: node valid-parentheses.js

function replacePairs(s) {
  let prev = "";
  while (s !== prev) {
    prev = s;
    s = s.replaceAll("()", "").replaceAll("[]", "").replaceAll("{}", "");
  }
  return s === "";
}

function stack(s) {
  const open = { ")": "(", "]": "[", "}": "{" };
  const st = []; // mảng làm ngăn xếp: push và pop ở cuối là O(1); shift/unshift ở đầu thì O(n)
  for (const ch of s) {
    if (!(ch in open)) st.push(ch);
    else if (st.pop() !== open[ch]) return false;
  }
  return st.length === 0;
}

const cases = [["()", true], ["()[]{}", true], ["(]", false], ["([)]", false], ["{[]}", true],
  ["((", false], ["){", false], ["", true], ["(((([]))))", true]];
for (const fn of [replacePairs, stack]) {
  const ok = cases.filter(([s, want]) => fn(s) === want).length;
  console.log(`${fn.name.padEnd(13)} ${ok}/${cases.length} ca đúng`);
}
