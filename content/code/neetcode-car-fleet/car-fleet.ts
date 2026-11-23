// LeetCode 853, Car Fleet: các cách giải, các bản sai, test và đo.
// Chạy: node car-fleet.ts

// Vét cạn O(n²): xe i dẫn đầu một đoàn khi nó tới đích MUỘN hơn mọi xe đứng trước nó.
function bruteForce(target: number, position: number[], speed: number[]): number {
  let fleets = 0;
  for (let i = 0; i < position.length; i++) {
    const ti = (target - position[i]) / speed[i];
    let leads = true;
    for (let j = 0; j < position.length; j++)
      if (position[j] > position[i] && (target - position[j]) / speed[j] >= ti) { leads = false; break; }
    if (leads) fleets++;
  }
  return fleets;
}

// Sắp xếp theo vị trí giảm dần, rồi ngăn xếp thời gian tới đích của các đầu đoàn.
function sortStack(target: number, position: number[], speed: number[]): number {
  const cars = position.map((p, i) => [p, speed[i]]).sort((a, b) => b[0] - a[0]); // gần đích trước
  const stack: number[] = [];
  for (const [p, s] of cars) {
    const t = (target - p) / s;
    if (stack.length === 0 || t > stack[stack.length - 1]) stack.push(t); // tới muộn hơn đoàn trước: đoàn mới
    // ngược lại: đuổi kịp đoàn trước ở trước đích, nhập đoàn, không đẩy gì
  }
  return stack.length;
}

// Chỉ cần nhớ đỉnh: một biến thay cho cả ngăn xếp. So bằng nhân chéo số nguyên, không chia.
function sortCrossMultiply(target: number, position: number[], speed: number[]): number {
  const idx = position.map((_, i) => i).sort((a, b) => position[b] - position[a]);
  let fleets = 0, leadDist = 0, leadSpeed = 1; // thời gian đầu đoàn = leadDist / leadSpeed
  for (const i of idx) {
    const d = target - position[i];
    // d / speed[i] > leadDist / leadSpeed  ⇔  d·leadSpeed > leadDist·speed[i] (mẫu dương)
    if (fleets === 0 || d * leadSpeed > leadDist * speed[i]) { fleets++; leadDist = d; leadSpeed = speed[i]; }
  }
  return fleets;
}

// Không sắp xếp: vị trí khác nhau và < target, nên dùng mảng đánh chỉ số theo vị trí. O(n + target).
function bucketByPosition(target: number, position: number[], speed: number[]): number {
  const timeAt = new Float64Array(target).fill(-1);
  for (let i = 0; i < position.length; i++) timeAt[position[i]] = (target - position[i]) / speed[i];
  let fleets = 0, lead = -1;
  for (let p = target - 1; p >= 0; p--) {
    const t = timeAt[p];
    if (t >= 0 && t > lead) { fleets++; lead = t; }
  }
  return fleets;
}

// SAI 1: quên hàm so sánh. sort() so CHUỖI: [10, 8, 0, 5, 3] thành [0, 10, 3, 5, 8].
function noComparator(target: number, position: number[], speed: number[]): number {
  const cars = position.map((p, i) => [p, speed[i]]).sort().reverse();
  let fleets = 0, lead = -1;
  for (const [p, s] of cars) { const t = (target - p) / s; if (t > lead) { fleets++; lead = t; } }
  return fleets;
}

// SAI 2: tính thời gian bằng target/s − p/s. Đúng về toán, nhưng hai phép chia làm tròn riêng rồi trừ.
function subtractFormula(target: number, position: number[], speed: number[]): number {
  const idx = position.map((_, i) => i).sort((a, b) => position[b] - position[a]);
  let fleets = 0, lead = -1;
  for (const i of idx) { const t = target / speed[i] - position[i] / speed[i]; if (t > lead) { fleets++; lead = t; } }
  return fleets;
}

const cases: [number, number[], number[], number][] = [
  [12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3], 3],
  [10, [3], [3], 1],
  [100, [0, 2, 4], [4, 2, 1], 1],
  [10, [6, 8], [3, 2], 2],
  [10, [0, 4, 2], [2, 1, 3], 1],
  [4, [3, 1], [3, 9], 1], // hai xe tới đích cùng lúc (1/3): một đoàn
  [20, [6, 2, 17], [3, 9, 2], 2],
];
const fns = { bruteForce, sortStack, sortCrossMultiply, bucketByPosition, noComparator, subtractFormula };
for (const [name, fn] of Object.entries(fns)) {
  const bad = cases.filter(([t, p, s, want]) => fn(t, p, s) !== want).map(([t, p]) => `t=${t} ${JSON.stringify(p)}`);
  console.log(`${name.padEnd(18)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở " + bad.join(" ") : ""}`);
}
console.log(`\n(4 − 3) / 3 = ${(4 - 3) / 3}, (4 − 1) / 9 = ${(4 - 1) / 9}`);
console.log(`4/3 − 3/3 = ${4 / 3 - 3 / 3}, 4/9 − 1/9 = ${4 / 9 - 1 / 9}`);

// Kiểm ngẫu nhiên: phép chia một lần có bao giờ lệch so với nhân chéo không?
let seed = 12345; // mulberry32: số giả ngẫu nhiên có hạt giống, để chạy lại ra cùng kết quả
const rand = () => { seed = (seed + 0x6d2b79f5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x ^= x + Math.imul(x ^ (x >>> 7), 61 | x); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
const rnd = (m: number) => Math.floor(rand() * m);
let mismatch = 0;
for (let k = 0; k < 20000; k++) {
  const target = 1 + rnd(1_000_000), n = 1 + rnd(8);
  const ps = new Set<number>(); while (ps.size < Math.min(n, target)) ps.add(rnd(target));
  const position = [...ps], speed = position.map(() => 1 + rnd(1_000_000));
  if (sortStack(target, position, speed) !== sortCrossMultiply(target, position, speed)) mismatch++;
}
console.log(`20 000 bộ ngẫu nhiên (target, speed ≤ 10⁶): chia một lần lệch nhân chéo ${mismatch} lần`);

// Đo
const median = (xs: number[]) => xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const time = (f: () => void, runs: number) => { const ts: number[] = []; for (let r = 0; r < runs; r++) { const t = performance.now(); f(); ts.push(performance.now() - t); } return median(ts); };
// Ca tệ cho vét cạn: cùng tốc độ, nên xe càng xa càng tới muộn: mỗi xe một đoàn, không vòng nào dừng sớm.
const make = (n: number, target: number) => {
  const ps = new Set<number>(); while (ps.size < n) ps.add(rnd(target));
  const position = [...ps]; return [position, position.map(() => 7)];
};
console.log("\nn          vét cạn   sắp xếp + ngăn xếp   mảng theo vị trí   (ms, trung vị)");
for (const n of [2_000, 4_000, 8_000, 16_000]) {
  const [p, s] = make(n, 1_000_000);
  console.log(`${String(n).padEnd(10)} ${time(() => bruteForce(1_000_000, p, s), 3).toFixed(1).padStart(7)} ${time(() => sortStack(1_000_000, p, s), 5).toFixed(2).padStart(20)} ${time(() => bucketByPosition(1_000_000, p, s), 5).toFixed(2).padStart(18)}`);
}
for (const n of [100_000, 1_000_000]) {
  const [p, s] = make(n, 2_000_000);
  console.log(`${String(n).padEnd(10)} ${"—".padStart(7)} ${time(() => sortStack(2_000_000, p, s), 5).toFixed(2).padStart(20)} ${time(() => bucketByPosition(2_000_000, p, s), 5).toFixed(2).padStart(18)}`);
}
