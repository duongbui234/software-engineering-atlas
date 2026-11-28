---
title: "Bên trong bưu điện: mô hình AMQP với connection, channel, exchange, queue, binding và routing key"
description: Người gửi không bao giờ bỏ thư thẳng vào hộc; ga này mở từng bộ phận của RabbitMQ theo mô hình AMQP 0-9-1 để thấy một tin nhắn đi từ producer tới consumer qua những đâu.
date: 2026-11-21
tags: [rabbitmq, messaging]
type: learn
level: beginner
series: rabbitmq
part: 2
draft: false
sources:
  - https://www.rabbitmq.com/tutorials/amqp-concepts
  - https://www.rabbitmq.com/docs/connections
  - https://www.rabbitmq.com/docs/channels
  - https://www.rabbitmq.com/docs/vhosts
  - https://www.rabbitmq.com/docs/queues
  - https://www.rabbitmq.com/docs/publishers
  - https://www.rabbitmq.com/docs/heartbeats
---

> [!tldr] Đọc nhanh
> - Producer **không bao giờ** gửi thẳng vào queue. Nó gửi cho một [[concepts/exchange|exchange]] kèm một nhãn gọi là [[concepts/routing-key|routing key]]; exchange dựa vào các [[concepts/binding|binding]] để chép tin vào đúng [[concepts/queue|queue]].
> - [[concepts/connection|Connection]] là một kết nối TCP sống lâu; [[concepts/channel|channel]] là các "làn" nhẹ bên trong nó. Mở connection mỗi request là lỗi kinh điển.
> - [[concepts/virtual-host|Virtual host]] chia một broker thành nhiều "chi nhánh" tách biệt tên, quyền và chính sách, nhưng dùng chung RAM, CPU.
> - Một tin nhắn gồm **properties** (thuộc tính chuẩn như `message_id`, `persistent`), **headers** (bảng tùy ý) và **body** (mảng byte broker không đọc). Xem [[concepts/message-properties|Message properties]].
> - `sendToQueue` chỉ là đường tắt: gửi vào **default exchange** với routing key bằng tên queue.

> [!info] Bối cảnh
> Ga 2 của **tuyến RabbitMQ**. Ở [[posts/2026-11-21-rabbitmq-why-queues|ga 1]], mình coi RabbitMQ là một bưu điện đứng giữa các dịch vụ của **flash-sale** (trang bán hàng giảm giá giờ vàng mình tự viết). Ga này mở cửa bưu điện, xem bên trong có những bộ phận nào. Bạn không cần biết code dự án; mọi ví dụ chạy trên một RabbitMQ thật trong Docker.

> [!abstract]- Từ điển nhanh cho bài này (bấm để mở)
> - **Giao thức (protocol)**: bộ quy tắc hai chương trình dùng để nói chuyện qua mạng, như HTTP cho web.
> - **AMQP 0-9-1**: giao thức RabbitMQ dùng từ đầu. Tên đọc là "A-M-Q-P không chín một". Xem [[concepts/amqp|AMQP]].
> - **TCP**: tầng kết nối mạng bên dưới; mở một kết nối TCP tốn vài vòng hỏi-đáp và tài nguyên ở cả hai đầu.
> - **TLS**: lớp mã hóa đặt trên TCP, cùng thứ làm nên HTTPS.
> - **Thread (luồng)**: một mạch chạy song song trong chương trình.
> - **Client library**: thư viện trong ứng dụng để nói chuyện với RabbitMQ. Bài này dùng `amqplib` cho Node.js.
> - **Durable**: "bền", tồn tại qua lần broker khởi động lại.
> - **Management UI**: trang web quản trị đi kèm RabbitMQ, mặc định ở cổng 15672.

## Hình dung trước: một bưu điện có bàn phân loại

Ở ga 1, bưu điện là một cái hộp đen. Giờ mở nó ra. Điều làm mình bất ngờ nhất: **người gửi không được tự bỏ thư vào hộc**. Thư luôn đi qua bàn phân loại.

| Đời thường | Khái niệm |
|---|---|
| Xe chở thư từ công ty bạn tới bưu điện, chạy cả ngày | [[concepts/connection\|Connection]] (kết nối TCP) |
| Các làn riêng trong xe, mỗi nhân viên một làn | [[concepts/channel\|Channel]] |
| Mỗi chi nhánh bưu điện có sổ sách riêng, nhân viên riêng | [[concepts/virtual-host\|Virtual host]] |
| Bàn phân loại: nhận thư, xem nhãn, quyết định bỏ hộc nào | [[concepts/exchange\|Exchange]] |
| Hộc thư: thư nằm chờ theo thứ tự tới khi có người lấy | [[concepts/queue\|Queue]] |
| Quy tắc dán trên bàn: "thư nhãn `order.cancelled` bỏ hộc kho" | [[concepts/binding\|Binding]] |
| Nhãn dán trên phong bì | [[concepts/routing-key\|Routing key]] |
| Phong bì (thông tin chuẩn) + giấy ghi chú kẹp kèm + lá thư bên trong | [[concepts/message-properties\|Properties, headers, body]] |
| Bộ quy tắc chung của ngành bưu chính | [[concepts/amqp\|AMQP 0-9-1]] |

```mermaid
flowchart TB
    P["Người gửi<br/>(producer)"] -->|"thư + nhãn order.cancelled"| X["Bàn phân loại<br/>(exchange)"]
    X -->|"quy tắc: order.cancelled"| Q1["Hộc thư kho<br/>(queue stock.q)"]
    X -->|"quy tắc: order.*"| Q2["Hộc thư email<br/>(queue email.q)"]
    Q1 --> C1["Nhân viên kho<br/>(consumer)"]
    Q2 --> C2["Nhân viên email<br/>(consumer)"]
```

Một thư `order.cancelled` khớp cả hai quy tắc nên được **chép thành hai bản**, mỗi hộc một bản. Người gửi không biết, và không cần biết, có bao nhiêu hộc.

## Vấn đề: "producer bỏ tin vào queue" là mô hình sai

Mình bắt đầu với hình ảnh mà phần lớn bài giới thiệu vẽ ra: *producer → queue → consumer*. Hình đó đủ để chạy thử "hello world", nhưng nó làm mình vấp ba lần sau đó:

- Muốn hai dịch vụ cùng nhận một sự kiện, mình gửi tin hai lần vào hai queue. Producer giờ phải biết danh sách người nhận, đúng thứ ở ga 1 mình muốn bỏ.
- Gửi một tin với routing key gõ sai. Không có lỗi nào, tin cũng không tới đâu cả.
- Mỗi request HTTP mình mở một kết nối RabbitMQ mới cho "sạch sẽ". Chạy thử tải là broker kêu cạn tài nguyên.

Cả ba lỗi đều tới từ việc không biết bên trong bưu điện có gì. Phần dưới đi qua từng bộ phận theo đúng đường đi của một tin.

## Cơ chế

<figure class="figure-map" style="--ar: 1 / 1">
<div class="frame"><iframe data-archify="../diagrams/rabbitmq-amqp-model/amqp-model.html" title="Sơ đồ kiến trúc: các bộ phận của RabbitMQ theo mô hình AMQP 0-9-1" loading="lazy"></iframe></div>
<figcaption><span><b>Hình 1.</b> Producer chỉ nói chuyện với exchange; binding quyết định thư được chép vào hộc nào, consumer chỉ đọc từ hộc của mình.</span><a href="../diagrams/rabbitmq-amqp-model/amqp-model.html" target="_blank" rel="noopener">Mở toàn màn hình</a></figcaption>
</figure>

### AMQP 0-9-1: luật chung của bưu điện

[[concepts/amqp|AMQP]] (Advanced Message Queuing Protocol) bản 0-9-1 là giao thức RabbitMQ dùng từ những ngày đầu. Nó quy định cả *cách nói chuyện* (các lệnh như `basic.publish`, `queue.declare`, `basic.ack`) lẫn *mô hình* bên trong broker: exchange, queue, binding. Nhờ giao thức chung, ứng dụng Node.js, Java hay Go đều nói chuyện được với RabbitMQ bằng thư viện của ngôn ngữ mình.

Một điểm khác HTTP: trong AMQP, **ứng dụng tự khai báo** cấu trúc bưu điện. Producer hay consumer gọi `assertExchange`, `assertQueue`, `bindQueue` lúc khởi động; nếu đã có rồi thì lệnh khai báo không làm gì. Bưu điện được "lắp" bởi chính những người dùng nó. Từ RabbitMQ 4.0, broker nói thêm được **AMQP 1.0**, một giao thức khác hẳn dù trùng tên; [[posts/2026-11-21-rabbitmq-operations|ga 9]] so sánh hai bản.

### Connection: xe chở thư sống lâu

[[concepts/connection|Connection]] là một kết nối TCP (có thể bọc TLS) từ ứng dụng tới broker, có đăng nhập bằng user/password. Mở một connection tốn nhiều vòng hỏi-đáp, và mỗi connection chiếm bộ nhớ cùng một file handle ở broker.

Vì vậy connection phải **sống lâu**: mở một lần khi ứng dụng khởi động, dùng tới khi tắt. Tài liệu RabbitMQ coi hơn khoảng 100 connection mở mới mỗi giây là dấu hiệu quản lý kết nối sai (connection churn). Nên đặt tên cho connection (`connection_name`) để thấy ngay trong management UI nó thuộc ứng dụng nào.

**Heartbeat** là nhịp tim của connection: hai bên gửi nhau một gói nhỏ định kỳ, mất hai nhịp liên tiếp thì coi như kết nối đã chết, thay vì chờ hệ điều hành phát hiện sau nhiều phút. Broker đề nghị 60 giây; tài liệu khuyên đặt 5–20 giây, và đừng tắt.

### Channel: các làn trong xe

[[concepts/channel|Channel]] là "kết nối nhẹ" chạy chung một connection. Mọi thao tác (gửi tin, khai báo queue, ack) đều diễn ra trên một channel cụ thể. Mở channel rẻ hơn mở connection rất nhiều, nhưng vẫn không miễn phí.

Quy tắc dùng:

- **Một channel cho mỗi luồng xử lý**, không dùng chung một channel giữa nhiều luồng chạy song song. Với Node.js (một luồng), thường tách một channel để gửi, một channel cho mỗi nhóm consumer.
- Vài channel mỗi connection là đủ cho đa số ứng dụng. Mở channel liên tục mà không đóng (channel leak) cũng làm broker cạn tài nguyên.
- Lỗi "mềm" (soft error) chỉ đóng **channel**, không đóng connection. Ví dụ gửi vào exchange không tồn tại (lỗi 404) hay khai báo lại queue với thuộc tính khác (lỗi 406). Code phải xử lý sự kiện channel bị đóng, nếu không các lệnh sau trên channel đó sẽ lỗi âm thầm.

### Virtual host: chi nhánh bưu điện

[[concepts/virtual-host|Virtual host]] (vhost) chia một broker thành nhiều không gian tách biệt. Mỗi vhost có exchange, queue, binding, quyền và chính sách riêng; queue `orders` ở vhost `/shop` và queue `orders` ở vhost `/test` là hai queue khác nhau. Vhost mặc định tên là `/`.

User được cấp quyền theo từng vhost, và mỗi vhost đặt được giới hạn số connection, số queue. Nhưng vhost **chỉ tách về logic**: mọi vhost vẫn dùng chung RAM, CPU, đĩa của broker. Một vhost làm đầy RAM thì cả broker cùng chịu.

### Exchange: bàn phân loại

[[concepts/exchange|Exchange]] nhận tin từ producer và quyết định chép tin vào queue nào. Exchange **không lưu tin**: nếu không queue nào khớp, tin bị bỏ ngay (trừ khi có cấu hình khác, [[posts/2026-11-21-rabbitmq-exchanges|ga 3]]).

Mỗi exchange có tên, **kiểu** (direct, fanout, topic, headers; ga 3 đi qua từng kiểu), cờ `durable` (còn tồn tại sau khi broker khởi động lại) và cờ `auto-delete` (tự xóa khi không còn binding nào). Mỗi broker có sẵn vài exchange tên bắt đầu bằng `amq.` và một exchange đặc biệt không tên, **default exchange**, nói ở phần cuối.

### Queue: hộc thư

[[concepts/queue|Queue]] là nơi tin thật sự nằm chờ, theo thứ tự tới trước ra trước (FIFO). Một queue có:

- **Tên**: tối đa 255 byte. Tên bắt đầu bằng `amq.` dành riêng cho broker. Khai báo tên rỗng thì broker tự đặt tên dạng `amq.gen-…`, hay dùng cho queue tạm của một consumer.
- **`durable`**: queue được khôi phục khi broker khởi động lại. Queue không durable bị xóa khi khởi động lại.
- **`exclusive`**: chỉ connection đã khai báo nó được dùng, và queue bị xóa khi connection đóng. Hợp cho queue tạm.
- **`auto-delete`**: bị xóa khi consumer cuối cùng rời đi (sau khi đã từng có ít nhất một consumer).
- **Arguments**: các tùy chọn mở rộng bắt đầu bằng `x-`, như loại queue (`x-queue-type`), thời hạn tin, độ dài tối đa. Ga 6 và ga 7 dùng chúng rất nhiều.

> [!warning] RabbitMQ 4.3+: queue không durable phải là exclusive
> Từ 4.3, khai báo queue `durable: false` mà không `exclusive` bị **từ chối**, connection đóng với lỗi `541 INTERNAL_ERROR - Feature transient_nonexcl_queues is deprecated`. Rất nhiều bài hướng dẫn cũ (kể cả bản cũ của tutorial chính thức) dùng `durable: false`. Mọi ví dụ trong tuyến này đều dùng queue durable.

Khai báo lại một queue đã có với thuộc tính khác (ví dụ thêm `x-max-length`) thì broker trả lỗi `406 PRECONDITION_FAILED` và đóng channel. Muốn đổi cấu hình queue đang chạy thì dùng **policy** ([[posts/2026-11-21-rabbitmq-operations|ga 9]]).

### Binding và routing key: quy tắc và nhãn

[[concepts/binding|Binding]] là một quy tắc nối exchange với queue: *"exchange E chép tin vào queue Q khi nhãn khớp mẫu K"*. Mẫu K gọi là **binding key**.

[[concepts/routing-key|Routing key]] là nhãn producer dán lên **từng tin** lúc gửi. Exchange so routing key của tin với binding key của từng binding để quyết định.

Hai thứ hay bị nhầm vì tên gần giống:

| | Routing key | Binding key |
|---|---|---|
| Nằm ở đâu | trên tin nhắn | trên binding |
| Ai đặt | producer, lúc gửi | ai đó khai báo binding (thường là consumer) |
| Ví dụ | `order.cancelled` | `order.*` |

Một queue có thể có nhiều binding (nghe nhiều loại tin), một exchange có thể bind tới nhiều queue (một tin chép ra nhiều bản). Đó là cách tách rời ở ga 1 thành hiện thực: thêm người nghe chỉ cần thêm một queue và một binding.

### Tin nhắn: phong bì, ghi chú và lá thư

Một tin AMQP gồm ba phần. Xem thêm [[concepts/message-properties|Message properties]].

- **Body**: mảng byte. Broker **không đọc** body; JSON hay Protobuf là chuyện của hai đầu.
- **Properties**: các trường chuẩn, giống thông tin in sẵn trên phong bì.
  - `delivery_mode`: 1 = không bền, 2 = bền (persistent, ghi xuống đĩa). Trong `amqplib` là `{ persistent: true }`.
  - `content_type`, `content_encoding`: body là gì, mã hóa thế nào.
  - `message_id`: mã định danh tin, dùng để chống xử lý trùng ([[posts/2026-11-21-rabbitmq-delivery-guarantees|ga 5]]).
  - `correlation_id`, `reply_to`: dùng cho kiểu hỏi-đáp (ga 5).
  - `expiration`: thời hạn sống của tin, tính bằng mili giây, kiểu chuỗi (ga 6).
  - `priority`: độ ưu tiên (ga 6).
  - `timestamp`, `type`, `app_id`; `user_id` thì broker kiểm tra phải trùng user đang đăng nhập.
- **Headers**: một bảng khóa-giá trị tùy ý, như tờ ghi chú kẹp kèm. Hay dùng để mang mã sự kiện, trace id, số lần đã thử.

Từ RabbitMQ 4.0, kích thước tin tối đa mặc định là **16 MiB** (trước đó 128 MiB). Tin lớn tốn RAM và mạng; dữ liệu nặng nên để ở kho file (như S3) và chỉ gửi đường dẫn.

### Default exchange: vì sao `sendToQueue` "gửi thẳng vào queue"

Có một exchange kiểu direct **không có tên** (chuỗi rỗng `""`). Mọi queue được tự động bind vào nó với binding key bằng **chính tên queue**, và không ai bind hay gỡ bind thủ công được. Vì vậy:

```ts
ch.sendToQueue("email.q", body)
// thực chất là
ch.publish("", "email.q", body)  // exchange "" + routing key = tên queue
```

Hình ảnh "producer gửi thẳng vào queue" ra đời từ đây. Nó tiện cho ví dụ nhỏ, nhưng mất hết sức mạnh định tuyến: producer phải biết tên queue, tức biết người nhận. Với sự kiện có nhiều bên nghe, hãy gửi vào một exchange có tên.

### Đường đi trọn vẹn của một tin

```mermaid
%%{init: {"sequence": {"width": 60, "actorMargin": 6, "diagramMarginX": 4}}}%%
sequenceDiagram
    participant P as Producer
    participant X as Exchange
    participant Q as Queue
    participant C as Consumer
    P->>X: basic.<br/>publish<br/>(routing<br/>key,<br/>properties,<br/>body)
    X->>Q: so binding,<br/>chép vào<br/>queue<br/>khớp
    Note over Q: tin nằm<br/>chờ (ready)
    Q->>C: basic.<br/>deliver<br/>(đẩy tới<br/>consumer)
    Note over C: xử lý xong
    C->>Q: basic.ack,<br/>tin bị xóa
```

Consumer nhận tin theo kiểu **đẩy** (push): nó đăng ký một lần bằng `basic.consume`, broker tự đẩy tin tới khi có. Cũng có kiểu **kéo** (`basic.get`, hỏi từng tin một), nhưng tài liệu RabbitMQ khuyên tránh vì rất tốn: mỗi lần hỏi là một vòng mạng, kể cả khi hàng trống. Bước `ack` cuối cùng là chủ đề của [[posts/2026-11-21-rabbitmq-ack-confirm|ga 4]].

## Ví dụ chạy được

File `model.ts` dựng đúng hình 1 thu nhỏ rồi thử bốn điều: định tuyến qua binding, `sendToQueue` thật ra đi qua default exchange, lỗi mềm chỉ đóng channel, và khai báo lại queue khác thuộc tính. Chạy cùng broker Docker ở ga 1:

```bash
docker run -d --rm --name atlas-rabbit -p 5673:5672 -p 15673:15672 rabbitmq:4-management
npm i amqplib && node model.ts
```

Phần chính (bản đầy đủ: [model.ts](../code/rabbitmq-amqp-model/model.ts)):

```ts
const conn = await amqp.connect('amqp://guest:guest@localhost:5673', {
  clientProperties: { connection_name: 'atlas-demo' },
});
const ch = await conn.createChannel(); // channel: "làn" logic bên trong connection

await ch.assertExchange(EX, 'direct', { durable: true });
await ch.assertQueue(Q, { durable: true });
await ch.bindQueue(Q, EX, 'thu.hcm'); // binding key
ch.publish(EX, 'thu.hcm', Buffer.from('thư gửi HCM'), {
  persistent: true, contentType: 'text/plain', messageId: 'thu-001',
  headers: { 'nguoi-gui': 'Hà Nội' },
}); // routing key
ch.publish(EX, 'thu.danang', Buffer.from('thư gửi Đà Nẵng')); // không binding nào khớp

ch.sendToQueue(Q, Buffer.from('gửi thẳng tên hộc'));
ch.publish('', Q, Buffer.from('publish vào exchange "" với key = tên queue'));
```

```text
$ node model.ts
1) hộc thư HCM nhận: thư gửi HCM | routingKey = thu.hcm | exchange = demo.buu-dien | messageId = thu-001 | header nguoi-gui = Hà Nội
   hộc thư HCM còn lại: 0 tin (thư Đà Nẵng không vào đâu cả)
2) nhận: "gửi thẳng tên hộc" qua exchange = "", routingKey = demo.hoc-thu-hcm
2) nhận: "publish vào exchange "" với key = tên queue" qua exchange = "", routingKey = demo.hoc-thu-hcm
3) channel 2 bị đóng: no exchange 'khong-co-exchange-nay' in vhost '/'"
   connection vẫn sống? channel 1 vẫn dùng được: true
4) channel 3 bị đóng: inequivalent arg 'x-max-length' for queue 'demo.hoc-thu-hcm' in vhost '/': recei
```

Bốn điều đáng để ý trong output:

1. Thư Đà Nẵng biến mất mà `publish` không báo lỗi gì. Exchange không tìm được binding khớp nên bỏ tin.
2. Hai cách gửi cho cùng một kết quả: `exchange = ""`, routing key là tên queue.
3. Gửi vào exchange không tồn tại chỉ giết channel 2; channel 1 trên cùng connection vẫn chạy.
4. Khai báo lại queue với `x-max-length` bị từ chối (`inequivalent arg`), cũng chỉ mất channel.

Trong lúc chạy, mở `http://localhost:15673` → tab **Connections** sẽ thấy connection tên `atlas-demo` với các channel của nó.

## Hiểu lầm và bẫy hay gặp

### "Producer gửi tin vào queue"

Luôn qua exchange. `sendToQueue` là đường tắt qua default exchange. Thiết kế quanh exchange có tên thì thêm người nghe không cần sửa producer.

### Mở connection cho mỗi request

Mỗi connection là một kết nối TCP có đăng nhập, tốn RAM và file handle ở broker. Mở một connection khi ứng dụng khởi động, dùng lại suốt đời ứng dụng. Thư viện như `amqp-connection-manager` lo cả việc tự kết nối lại.

### Dùng chung một channel cho nhiều luồng

Các lệnh trên cùng channel có thể chen nhau, sinh lỗi giao thức. Thêm một cái bẫy: mã giao tin (delivery tag) gắn với channel, nên ack trên channel khác sẽ bị broker báo "unknown delivery tag" và đóng channel.

### Không lắng nghe sự kiện channel bị đóng

Lỗi mềm đóng channel một cách bất đồng bộ. Không bắt sự kiện `error`/`close` thì các lệnh sau trên channel đó thất bại mà không ai biết. Ví dụ ở trên bắt `ch2.on('error', …)` chính vì vậy.

### Nhầm routing key với binding key

Routing key nằm trên tin, binding key nằm trên quy tắc. Gõ sai một trong hai là tin đi lạc mà không có lỗi nào.

### Coi vhost là cách chia tài nguyên

Vhost tách tên và quyền, không tách RAM hay CPU. Muốn cô lập tài nguyên thật cho một nhóm ứng dụng thì cần broker (hoặc cụm) riêng.

### Copy ví dụ cũ có `durable: false`

Trên RabbitMQ 4.3+ ví dụ đó làm sập connection với lỗi 541. Dùng `durable: true`, hoặc `exclusive: true` cho queue tạm.

## Câu hỏi tự kiểm tra

> [!question]- Producer có gửi thẳng vào queue được không?
> Không. Mọi tin đều đi qua một exchange. `sendToQueue` dùng default exchange (tên rỗng), nơi mọi queue tự bind với binding key bằng tên của chính nó.

> [!question]- Connection và channel khác nhau thế nào? Nên mở bao nhiêu?
> Connection là kết nối TCP sống lâu, tốn kém; channel là làn logic nhẹ bên trong. Vài connection cho mỗi ứng dụng (thường tách một cho gửi, một cho nhận) và mỗi luồng một channel.

> [!question]- Routing key và binding key nằm ở đâu?
> Routing key nằm trên tin nhắn, do producer đặt. Binding key nằm trên binding giữa exchange và queue.

> [!question]- Gửi một tin mà không binding nào khớp thì chuyện gì xảy ra?
> Mặc định tin bị bỏ im lặng, `publish` không báo lỗi. Ga 3 có hai cách bắt các tin này: cờ `mandatory` và alternate exchange.

> [!question]- Vhost có giúp một ứng dụng ngốn RAM không ảnh hưởng ứng dụng khác không?
> Không. Vhost chỉ tách tên, quyền và chính sách. Mọi vhost dùng chung tài nguyên của broker.

> [!question]- Vì sao lỗi 404 khi publish không làm sập cả connection?
> Đó là lỗi mềm (soft error), phạm vi một channel. Broker đóng channel đó và báo về; các channel khác trên cùng connection vẫn chạy.

## Tham khảo

- [RabbitMQ: AMQP 0-9-1 Model Explained](https://www.rabbitmq.com/tutorials/amqp-concepts)
- [RabbitMQ: Connections](https://www.rabbitmq.com/docs/connections), [Channels](https://www.rabbitmq.com/docs/channels), [Heartbeats](https://www.rabbitmq.com/docs/heartbeats)
- [RabbitMQ: Virtual Hosts](https://www.rabbitmq.com/docs/vhosts)
- [RabbitMQ: Queues](https://www.rabbitmq.com/docs/queues)
- [RabbitMQ: Publishers](https://www.rabbitmq.com/docs/publishers)
- [Release notes RabbitMQ 4.0](https://github.com/rabbitmq/rabbitmq-server/blob/main/release-notes/4.0.1.md) và [4.3](https://github.com/rabbitmq/rabbitmq-server/blob/main/release-notes/4.3.0.md)
- [amqplib: Channel API](https://amqp-node.github.io/amqplib/channel_api.html)
