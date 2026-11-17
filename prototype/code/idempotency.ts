// Chạy: node idempotency.ts   (Node >= 22.18 tự bỏ type annotation)
type Saved = { status: "processing" } | { status: "done"; body: string; response: unknown };

const store = new Map<string, Saved>(); // thực tế: Redis với TTL
let charges = 0;

async function chargeCard(amount: number) {
  charges++;
  return { id: `ch_${charges}`, amount };
}

async function createPayment(key: string, body: { amount: number }) {
  const raw = JSON.stringify(body);
  const saved = store.get(key);

  if (saved?.status === "processing") return { code: 409, data: "đang xử lý, thử lại sau" };
  if (saved?.status === "done") {
    if (saved.body !== raw) return { code: 422, data: "key đã dùng cho request khác" };
    return { code: 201, data: saved.response }; // trả lại kết quả cũ
  }

  store.set(key, { status: "processing" }); // Redis: SET key processing NX EX 86400
  const response = await chargeCard(body.amount);
  store.set(key, { status: "done", body: raw, response });
  return { code: 201, data: response };
}

const first = await createPayment("k1", { amount: 100_000 });
const retry = await createPayment("k1", { amount: 100_000 }); // client retry vì mất phản hồi
const misuse = await createPayment("k1", { amount: 999_000 });

console.log(first, retry, misuse, `số lần trừ tiền: ${charges}`);
