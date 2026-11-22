// LeetCode 125, Valid Palindrome: hai cách và test.
// Chạy: node valid-palindrome.js

const isAlnum = (c) => /[a-zA-Z0-9]/.test(c); // KHÔNG dùng \w: \w gồm cả "_"

function cleanReverse(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean === [...clean].reverse().join("");
}

function twoPointers(s) {
  let i = 0, j = s.length - 1;
  while (i < j) {
    if (!isAlnum(s[i])) i++;
    else if (!isAlnum(s[j])) j--;
    else if (s[i].toLowerCase() !== s[j].toLowerCase()) return false;
    else { i++; j--; }
  }
  return true;
}

const cases = [
  ["A man, a plan, a canal: Panama", true], ["race a car", false], [" ", true], ["", true],
  ["0P", false], ["a_", true], ["No 'x' in Nixon", true], [".,", true],
];
for (const fn of [cleanReverse, twoPointers]) {
  const ok = cases.filter(([s, want]) => fn(s) === want).length;
  console.log(`${fn.name.padEnd(13)} ${ok}/${cases.length} ca đúng`);
}
