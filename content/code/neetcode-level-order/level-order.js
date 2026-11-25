// Ga LINK-05: duyệt theo tầng và mang trạng thái. Giải 102, 199, 1448.
// Chạy: node level-order.js

class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val; this.left = left; this.right = right;
  }
}

// Dựng cây từ mảng theo tầng kiểu LeetCode: [1, null, 2] là gốc 1, con phải 2.
function fromLevel(a) {
  if (a.length === 0 || a[0] === null) return null;
  const root = new TreeNode(a[0]);
  const queue = [root];
  let i = 1;
  for (let q = 0; q < queue.length && i < a.length; q++) {
    const node = queue[q];
    if (i < a.length && a[i] !== null) { node.left = new TreeNode(a[i]); queue.push(node.left); }
    i++;
    if (i < a.length && a[i] !== null) { node.right = new TreeNode(a[i]); queue.push(node.right); }
    i++;
  }
  return root;
}

// 102: BFS bằng hàng đợi. Đầu mỗi vòng, CHỤP số nút đang chờ: đó đúng là số nút của tầng này.
// Con của chúng được đẩy vào sau, nên vòng for chỉ lấy đúng `size` nút rồi dừng.
// Hàng đợi là mảng + chỉ số đầu `head`: lấy ra là head++, O(1), không dịch mảng.
function levelOrder(root) {
  const res = [];
  if (!root) return res;
  const queue = [root];
  let head = 0;
  while (head < queue.length) {
    const size = queue.length - head; // chụp kích thước tầng
    const level = [];
    for (let i = 0; i < size; i++) {
      const node = queue[head++];
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}

// 102 cách hai: DFS tiền thứ tự mang theo độ sâu. Nút ở độ sâu d vào res[d]; trái đi trước nên thứ tự trong tầng vẫn đúng.
function levelOrderDfs(root) {
  const res = [];
  const go = (node, depth) => {
    if (!node) return;
    if (res.length === depth) res.push([]);
    res[depth].push(node.val);
    go(node.left, depth + 1);
    go(node.right, depth + 1);
  };
  go(root, 0);
  return res;
}

// 199: nhìn từ bên phải thấy nút CUỐI của mỗi tầng. Cùng khuôn BFS, chỉ giữ nút i = size - 1.
function rightSideView(root) {
  const res = [];
  if (!root) return res;
  const queue = [root];
  let head = 0;
  while (head < queue.length) {
    const size = queue.length - head;
    for (let i = 0; i < size; i++) {
      const node = queue[head++];
      if (i === size - 1) res.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return res;
}

// 199 cách hai: DFS đi PHẢI trước, mang độ sâu. Lần đầu chạm một độ sâu mới thì nút đó là nút phải nhất của tầng.
function rightSideViewDfs(root) {
  const res = [];
  const go = (node, depth) => {
    if (!node) return;
    if (res.length === depth) res.push(node.val);
    go(node.right, depth + 1);
    go(node.left, depth + 1);
  };
  go(root, 0);
  return res;
}

// 1448: tiền thứ tự, MANG XUỐNG giá trị lớn nhất trên đường từ gốc tới nút. Nút tốt khi val >= max đó.
function goodNodes(root) {
  const go = (node, maxSoFar) => {
    if (!node) return 0;
    const good = node.val >= maxSoFar ? 1 : 0;
    const m = Math.max(maxSoFar, node.val);
    return good + go(node.left, m) + go(node.right, m);
  };
  return go(root, -Infinity);
}

// 1448 cách hai: ngăn xếp tự quản lý, mỗi phần tử là cặp (nút, max trên đường tới nó). Không đệ quy.
function goodNodesIter(root) {
  if (!root) return 0;
  let count = 0;
  const stack = [[root, -Infinity]];
  while (stack.length) {
    const [node, maxSoFar] = stack.pop();
    if (node.val >= maxSoFar) count++;
    const m = Math.max(maxSoFar, node.val);
    if (node.right) stack.push([node.right, m]);
    if (node.left) stack.push([node.left, m]);
  }
  return count;
}

// 1448 cách ba: BFS cũng mang được trạng thái, miễn là trạng thái đi CÙNG nút trong hàng đợi.
function goodNodesBfs(root) {
  if (!root) return 0;
  let count = 0, head = 0;
  const queue = [[root, -Infinity]];
  while (head < queue.length) {
    const [node, maxSoFar] = queue[head++];
    if (node.val >= maxSoFar) count++;
    const m = Math.max(maxSoFar, node.val);
    if (node.left) queue.push([node.left, m]);
    if (node.right) queue.push([node.right, m]);
  }
  return count;
}

// ---- Các bản SAI, giữ lại để đo ----

// BẪY 102: không chụp kích thước, dùng queue.length ngay trong điều kiện vòng for.
// queue.length tăng khi đẩy con vào, nên vòng for nuốt luôn tầng sau: mọi nút dồn vào một tầng.
function levelOrderNoSnapshot(root) {
  const res = [];
  if (!root) return res;
  const queue = [root];
  let head = 0;
  while (head < queue.length) {
    const level = [];
    for (let i = head; i < queue.length; i++) {
      const node = queue[head++];
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}

// BẪY 199: chỉ đi theo con phải. Sai khi cây con trái sâu hơn: nút ở tầng dưới nhìn thấy được từ bên phải.
function rightSideViewOnlyRight(root) {
  const res = [];
  for (let node = root; node; node = node.right ?? null) res.push(node.val);
  return res;
}

// BẪY 1448: chỉ so với cha, không với mọi tổ tiên.
function goodNodesParentOnly(root) {
  const go = (node, parent) => {
    if (!node) return 0;
    return (node.val >= parent ? 1 : 0) + go(node.left, node.val) + go(node.right, node.val);
  };
  return go(root, -Infinity);
}

// Vét cạn cho 1448: giữ cả đường đi, quét lại từ đầu ở mỗi nút. O(n·h), chỉ để đối chiếu.
function goodNodesBrute(root) {
  const path = [];
  const go = (node) => {
    if (!node) return 0;
    const good = path.every((v) => v <= node.val) ? 1 : 0;
    path.push(node.val);
    const r = good + go(node.left) + go(node.right);
    path.pop();
    return r;
  };
  return go(root);
}

// ---- Dữ liệu thử ----

// Bộ sinh ngẫu nhiên mulberry32 (cùng thuật toán ở cả năm ngôn ngữ, nên cùng hạt giống ra cùng dãy).
function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Cây ngẫu nhiên n nút: giá trị trong [-5, 5] (có trùng, để thử "lớn hơn hoặc bằng"), cây con trái lấy ngẫu nhiên 0..n-1 nút.
function randomTree(n, rand) {
  if (n === 0) return null;
  const node = new TreeNode(Math.floor(rand() * 11) - 5);
  const leftSize = Math.floor(rand() * n);
  node.left = randomTree(leftSize, rand);
  node.right = randomTree(n - 1 - leftSize, rand);
  return node;
}

// Chuỗi lệch phải n nút, giá trị 1, 2, …, n: mọi nút đều "tốt", mỗi tầng một nút.
function rightChain(n) {
  const root = new TreeNode(1);
  let cur = root;
  for (let v = 2; v <= n; v++) { cur.right = new TreeNode(v); cur = cur.right; }
  return root;
}

// Cây đầy đủ 2^d - 1 nút, giá trị theo số thứ tự kiểu heap.
function perfectTree(d, i = 1) {
  if (d === 0) return null;
  return new TreeNode(i, perfectTree(d - 1, 2 * i), perfectTree(d - 1, 2 * i + 1));
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const fixed = [
  ["102 cây rỗng", () => same(levelOrder(null), [])],
  ["102 một nút", () => same(levelOrder(fromLevel([1])), [[1]])],
  ["102 bốn tầng", () => same(levelOrder(fromLevel([1, 2, 3, 4, null, 5, 6, null, 7])), [[1], [2, 3], [4, 5, 6], [7]])],
  ["102 chỉ nhánh trái", () => same(levelOrder(fromLevel([1, 2, null, 3])), [[1], [2], [3]])],
  ["199 cây rỗng", () => same(rightSideView(null), [])],
  ["199 nhánh trái sâu hơn", () => same(rightSideView(fromLevel([1, 2, 3, 4])), [1, 3, 4])],
  ["199 chỉ nhánh trái", () => same(rightSideView(fromLevel([5, 4, null, 3])), [5, 4, 3])],
  ["199 bốn tầng", () => same(rightSideView(fromLevel([1, 2, 3, 4, null, 5, 6, null, 7])), [1, 3, 6, 7])],
  ["1448 cây bảy nút", () => goodNodes(fromLevel([2, 1, 5, null, 3, 4, 6])) === 4],
  ["1448 cháu nhỏ hơn ông", () => goodNodes(fromLevel([5, 1, null, 3])) === 1],
  ["1448 giá trị bằng nhau", () => goodNodes(fromLevel([2, 2, 2])) === 3],
  ["1448 gốc âm", () => goodNodes(fromLevel([-1])) === 1],
];

let parentOnlyWrong = 0, onlyRightWrong = 0, noSnapshotWrong = 0;
const randomCase = () => {
  const rand = mulberry32(42);
  let ok = true;
  for (let t = 0; t < 300; t++) {
    const root = randomTree(1 + Math.floor(rand() * 40), rand);
    const lo = levelOrder(root);
    const rv = rightSideView(root);
    const g = goodNodesBrute(root);
    if (!same(lo, levelOrderDfs(root))) ok = false;
    if (!same(rv, rightSideViewDfs(root)) || !same(rv, lo.map((l) => l[l.length - 1]))) ok = false;
    if (goodNodes(root) !== g || goodNodesIter(root) !== g || goodNodesBfs(root) !== g) ok = false;
    if (!same(levelOrderNoSnapshot(root), lo)) noSnapshotWrong++;
    if (!same(rightSideViewOnlyRight(root), rv)) onlyRightWrong++;
    if (goodNodesParentOnly(root) !== g) parentOnlyWrong++;
  }
  return ok;
};

const N = 100_000;
const chainCase = () => {
  const chain = rightChain(N);
  return goodNodesIter(chain) === N && levelOrder(chain).length === N && rightSideView(chain).length === N;
};

const cases = [
  ...fixed,
  ["300 cây ngẫu nhiên: mọi cách khớp nhau và khớp vét cạn", randomCase],
  ["chuỗi lệch 10^5 nút: 1448 bản ngăn xếp, 102 và 199", chainCase],
];

let pass = 0;
for (const [name, fn] of cases) {
  let ok = false;
  try { ok = fn(); } catch (e) { console.log(`  lỗi ở "${name}": ${e.name}`); }
  if (ok) pass++; else console.log(`  sai: ${name}`);
}
console.log(`level-order ${pass}/${cases.length} ca đúng`);
console.log(`bẫy trên 300 cây ngẫu nhiên: không chụp kích thước tầng sai ${noSnapshotWrong} cây, chỉ đi con phải sai ${onlyRightWrong} cây, chỉ so với cha sai ${parentOnlyWrong} cây`);

// ---- Phép đo ----

// (1) Bề rộng của BFS và độ sâu của DFS: bộ nhớ thêm tối đa của mỗi cách.
function peakQueue(root) {
  if (!root) return 0;
  const queue = [root];
  let head = 0, peak = 1;
  while (head < queue.length) {
    const node = queue[head++];
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
    peak = Math.max(peak, queue.length - head);
  }
  return peak;
}
// DFS đệ quy sâu nhất bao nhiêu tầng = chiều cao cây. Tính bằng vòng lặp để chính phép đo không vỡ stack.
function height(root) {
  if (!root) return 0;
  const stack = [[root, 1]];
  let h = 0;
  while (stack.length) {
    const [node, d] = stack.pop();
    h = Math.max(h, d);
    if (node.left) stack.push([node.left, d + 1]);
    if (node.right) stack.push([node.right, d + 1]);
  }
  return h;
}
const perfect = perfectTree(20);
const chain = rightChain(N);
console.log(`cây đầy đủ 2^20 - 1 nút: hàng đợi BFS dài nhất ${peakQueue(perfect)}, DFS đệ quy sâu nhất ${height(perfect)} tầng`);
console.log(`chuỗi lệch 10^5 nút: hàng đợi BFS dài nhất ${peakQueue(chain)}, DFS đệ quy sâu nhất ${height(chain)} tầng`);

// (2) Đệ quy trên chuỗi lệch 10^5 nút (đề 1448 cho tới 10^5 nút).
try { goodNodes(chain); console.log("1448 đệ quy trên chuỗi 10^5 nút: chạy được"); }
catch (e) { console.log(`1448 đệ quy trên chuỗi 10^5 nút: ${e.name}; bản ngăn xếp: ${goodNodesIter(chain)}`); }

// (3) queue.shift() so với chỉ số head.
function levelOrderShift(root) {
  const res = [];
  if (!root) return res;
  const queue = [root];
  while (queue.length) {
    const size = queue.length;
    const level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}
function median(fn, runs = 5) {
  const ts = [];
  for (let r = 0; r < runs; r++) { const t0 = performance.now(); fn(); ts.push(performance.now() - t0); }
  ts.sort((a, b) => a - b);
  return ts[runs >> 1];
}
for (const d of [15, 16, 17]) {
  const t = perfectTree(d);
  const tHead = median(() => levelOrder(t));
  const tShift = median(() => levelOrderShift(t), 3);
  console.log(`102 trên cây đầy đủ 2^${d} - 1 nút: chỉ số head ${tHead.toFixed(1)} ms, queue.shift() ${tShift.toFixed(1)} ms`);
}
