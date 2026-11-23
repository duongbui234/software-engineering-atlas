// LeetCode 853, Car Fleet: các cách giải và test.
// Chạy: node car-fleet.js

function sortStack(target, position, speed) {
  const cars = position.map((p, i) => [p, speed[i]]).sort((a, b) => b[0] - a[0]); // PHẢI có hàm so sánh
  const stack = [];
  for (const [p, s] of cars) {
    const t = (target - p) / s;
    if (stack.length === 0 || t > stack[stack.length - 1]) stack.push(t);
  }
  return stack.length;
}

function sortCrossMultiply(target, position, speed) {
  const idx = position.map((_, i) => i).sort((a, b) => position[b] - position[a]);
  let fleets = 0, leadDist = 0, leadSpeed = 1;
  for (const i of idx) {
    const d = target - position[i];
    if (fleets === 0 || d * leadSpeed > leadDist * speed[i]) { fleets++; leadDist = d; leadSpeed = speed[i]; } // ≤ 10¹² < 2⁵³: vẫn chính xác
  }
  return fleets;
}

function bucketByPosition(target, position, speed) {
  const timeAt = new Float64Array(target).fill(-1);
  for (let i = 0; i < position.length; i++) timeAt[position[i]] = (target - position[i]) / speed[i];
  let fleets = 0, lead = -1;
  for (let p = target - 1; p >= 0; p--) {
    const t = timeAt[p];
    if (t >= 0 && t > lead) { fleets++; lead = t; }
  }
  return fleets;
}

const cases = [
  [12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3], 3], [10, [3], [3], 1], [100, [0, 2, 4], [4, 2, 1], 1],
  [10, [6, 8], [3, 2], 2], [10, [0, 4, 2], [2, 1, 3], 1], [4, [3, 1], [3, 9], 1], [20, [6, 2, 17], [3, 9, 2], 2],
];
for (const fn of [sortStack, sortCrossMultiply, bucketByPosition]) {
  const ok = cases.filter(([t, p, s, want]) => fn(t, p, s) === want).length;
  console.log(`${fn.name.padEnd(18)} ${ok}/${cases.length} ca đúng`);
}
