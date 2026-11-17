---
title: 'Idempotency: vì sao bấm "Thanh toán" hai lần không bị trừ tiền hai lần'
description: Mạng rớt đúng lúc server đã trừ tiền, client không biết nên gửi lại. Cách Idempotency-Key giải quyết chuyện đó, kèm đoạn code chạy được.
date: 2026-11-18
tags: [api, reliability]
type: learn
level: intermediate
series: api
part: 4
draft: true
sources:
  - https://docs.stripe.com/api/idempotent_requests
  - https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/
  - https://developer.mozilla.org/en-US/docs/Glossary/Idempotent
---

> [!tldr] Đọc nhanh
> - Một thao tác *idempotent* chạy 1 lần hay N lần thì kết quả cuối vẫn như nhau ([[idempotency]]).
> - `GET`, `PUT`, `DELETE` vốn idempotent; `POST` thì không, nên cần thêm `Idempotency-Key`.
> - Server ghi key **trước** khi làm việc có tác dụng phụ, lưu response, và trả lại response đó khi gặp lại key.
> - Ba bẫy: retry khi đang xử lý, cùng key khác body, TTL quá ngắn.

## Vấn đề: client không phân biệt được "chưa làm" với "làm rồi nhưng mất tin"

Khi một request thanh toán bị timeout, client chỉ biết là không nhận được phản hồi. Có hai khả năng: request chưa tới server, hoặc server đã trừ tiền xong nhưng phản hồi rơi giữa đường. Gửi lại thì sợ trừ hai lần, không gửi thì sợ đơn hàng treo.

Mình từng nghĩ chỉ cần client "cẩn thận đừng bấm hai lần". Hóa ra lỗi nằm ở mạng, không ở người bấm, nên phía server phải tự nhận ra request lặp.

## Cơ chế: một chìa khóa cho mỗi ý định

Client sinh một chuỗi ngẫu nhiên cho *mỗi ý định thanh toán* và gửi kèm header `Idempotency-Key`. Mọi lần retry của cùng ý định đó dùng lại đúng chuỗi này. Sơ đồ dưới đây đi qua đúng tình huống mất phản hồi rồi retry; bạn có thể kéo, phóng to, bấm vào từng mũi tên để xem chi tiết.

<figure class="figure-map" style="--ar: 1 / 1">
<div class="frame"><iframe data-archify="../diagrams/idempotency/retry.html" title="Sơ đồ tuần tự: retry an toàn với Idempotency-Key" loading="lazy"></iframe></div>
<figcaption><span><b>Hình 1.</b> Lần gọi đầu đã trừ tiền nhưng phản hồi bị mất; lần retry chỉ đọc lại kết quả.</span><a href="../diagrams/idempotency/retry.html" target="_blank" rel="noopener">Mở toàn màn hình</a></figcaption>
</figure>

## Ví dụ chạy được

Bản rút gọn dùng `Map` thay cho Redis để chạy ngay bằng `node example.ts`. Mình đã chạy thử, kết quả in ở cuối.

```ts
async function createPayment(key: string, body: { amount: number }) {
  const raw = JSON.stringify(body)
  const saved = store.get(key)

  if (saved?.status === "processing") return { code: 409, data: "đang xử lý, thử lại sau" }
  if (saved?.status === "done") {
    if (saved.body !== raw) return { code: 422, data: "key đã dùng cho request khác" }
    return { code: 201, data: saved.response } // trả lại kết quả cũ
  }

  store.set(key, { status: "processing" }) // Redis: SET key processing NX EX 86400
  const response = await chargeCard(body.amount)
  store.set(key, { status: "done", body: raw, response })
  return { code: 201, data: response }
}
```

```text
$ node example.ts
{ code: 201, data: { id: 'ch_1', amount: 100000 } }
{ code: 201, data: { id: 'ch_1', amount: 100000 } }
{ code: 422, data: 'key đã dùng cho request khác' }
số lần trừ tiền: 1
```

Toàn bộ file: <a href="../code/idempotency/example.ts">code/idempotency/example.ts</a>.

## Hiểu lầm và bẫy hay gặp

### Ghi key sau khi trừ tiền

Nếu hai request cùng key tới gần như cùng lúc, cả hai đều thấy "chưa có key" và cùng trừ tiền. Phải ghi trạng thái `processing` bằng thao tác nguyên tử (`SET … NX`) trước.

### Cùng key, khác nội dung

Client lỗi có thể dùng lại key cũ cho một khoản tiền khác. Server nên so dấu vân tay của body và trả `422` thay vì lặng lẽ trả kết quả cũ.

### TTL quá ngắn

Key hết hạn trước khi client retry thì request lặp lại được coi là mới. TTL cần dài hơn khoảng thời gian retry tối đa của client, thường là 24 giờ.

## Câu hỏi tự kiểm tra

> [!question]- `PUT /users/42` có cần Idempotency-Key không?
> Thường là không. `PUT` ghi đè toàn bộ tài nguyên nên gửi lại cùng nội dung cho cùng kết quả.

> [!question]- Retry tới khi request đầu còn đang `processing` thì trả gì?
> `409 Conflict` kèm gợi ý thử lại sau, để không chạy hai lần song song.

> [!question]- Ai sinh Idempotency-Key, client hay server?
> Client, vì chỉ client biết hai request là cùng một ý định.

## Tham khảo

- [Stripe API: Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [IETF draft: The Idempotency-Key HTTP Header Field](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/)
- [MDN: Idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)
