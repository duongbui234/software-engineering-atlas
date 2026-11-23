// Ga ARR-07: ngăn xếp đơn điệu. Giải 739, 853 và 84, tự chạy test.
// Chạy: node monotonic-stack-station.ts

// 739: ngăn xếp chỉ số, nhiệt độ giảm dần; ngày ấm hơn đến thì pop và ghi khoảng cách.
function dailyTemperatures(t: number[]): number[] {
  const out = new Array(t.length).fill(0);
  const stack: number[] = [];
  for (let i = 0; i < t.length; i++) {
    while (stack.length > 0 && t[i] > t[stack[stack.length - 1]]) {
      const j = stack.pop()!;
      out[j] = i - j;
    }
    stack.push(i);
  }
  return out;
}

// 853: xếp xe từ gần đích nhất; ngăn xếp giữ thời gian tới đích của từng đoàn, tăng dần từ đáy lên đỉnh.
function carFleet(target: number, position: number[], speed: number[]): number {
  const cars = position.map((p, i) => [p, (target - p) / speed[i]]).sort((a, b) => b[0] - a[0]);
  const fleets: number[] = [];
  for (const [, time] of cars) {
    if (fleets.length === 0 || time > fleets[fleets.length - 1]) fleets.push(time); // chậm hơn đoàn phía trước: đoàn mới
    // nhanh hơn hoặc bằng: đuổi kịp và nhập vào đoàn phía trước, không push
  }
  return fleets.length;
}

// 84: ngăn xếp chỉ số, chiều cao tăng dần; cột thấp hơn đến thì pop và tính hình chữ nhật của cột bị pop.
function largestRectangleArea(h: number[]): number {
  const stack: number[] = [];
  let best = 0;
  for (let i = 0; i <= h.length; i++) {
    const cur = i === h.length ? 0 : h[i]; // cột 0 ảo ở cuối: dọn sạch ngăn xếp
    while (stack.length > 0 && cur < h[stack[stack.length - 1]]) {
      const height = h[stack.pop()!];
      const left = stack.length > 0 ? stack[stack.length - 1] : -1; // cột thấp hơn gần nhất bên trái
      best = Math.max(best, height * (i - left - 1));
    }
    stack.push(i);
  }
  return best;
}

const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const tests = [
  eq(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]), [1, 1, 4, 2, 1, 1, 0, 0]),
  eq(dailyTemperatures([70, 70, 71]), [2, 1, 0]),
  carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]) === 3,
  carFleet(10, [3], [3]) === 1,
  carFleet(100, [0, 2, 4], [4, 2, 1]) === 1,
  largestRectangleArea([2, 1, 5, 6, 2, 3]) === 10,
  largestRectangleArea([2, 4]) === 4,
  largestRectangleArea([2, 2, 2]) === 6,
  largestRectangleArea([6, 2, 5, 4, 5, 1, 6]) === 12,
];
console.log(`${tests.filter(Boolean).length}/${tests.length} ca đúng`);
