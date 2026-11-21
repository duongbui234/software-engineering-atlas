---
title: Tuyến RabbitMQ
description: Toàn bộ RabbitMQ cho người mới, từ "vì sao cần hàng đợi" tới vận hành cụm trong production, gom thành 9 ga; ga sau dựa trên ga trước.
series: rabbitmq
code: MQ
region: Vùng Messaging
draft: false
stations:
  - name: Vì sao cần hàng đợi
    concepts: [Message Broker, Asynchronous Messaging, Decoupling, Load Leveling, Producer và Consumer, Queue và Log]
  - name: Mô hình AMQP
    concepts: [AMQP, Connection, Channel, Virtual Host, Exchange, Queue, Binding, Routing Key, Message Properties]
  - name: Các kiểu exchange
    concepts: [Default Exchange, Direct Exchange, Fanout Exchange, Topic Exchange, Headers Exchange, Exchange-to-Exchange Binding, Alternate Exchange, Unroutable Message]
  - name: Ack, prefetch, confirm
    concepts: [Work Queue, Consumer Acknowledgement, Auto-ack, Prefetch, Redelivery, Publisher Confirms, Message Persistence]
  - name: Không mất, không trùng
    concepts: [At-least-once Delivery, Exactly-once Delivery, Idempotent Consumer, Transactional Outbox, Message Ordering, Request-Reply]
  - name: Thư lỗi và thư hẹn giờ
    concepts: [Dead Letter Exchange, Message TTL, Queue Length Limit, Delayed Retry, Poison Message, Delayed Message, Priority Queue]
  - name: Classic, quorum, stream
    concepts: [Classic Queue, Quorum Queue, Raft, Delivery Limit, Stream, Stream Offset, Single Active Consumer]
  - name: Cụm và sẵn sàng cao
    concepts: [Clustering, Khepri, Network Partition, Federation, Shovel, Feature Flags]
  - name: Vận hành production
    concepts: [Resource Alarm, Flow Control, Queue Metrics, Access Control, Policy, Giao thức ngoài AMQP 0-9-1, Production Checklist]
---

## Nếu bạn mới bắt đầu

Bạn không cần biết RabbitMQ là gì để đi tuyến này. Ga 1 bắt đầu từ câu hỏi đơn giản nhất: vì sao một hệ thống lại cần một "bưu điện" đứng giữa các dịch vụ, thay vì để chúng gọi thẳng nhau. Cả tuyến dùng chung một hình ảnh: **RabbitMQ là một bưu điện**. Người gửi thư, bàn phân loại, hộc thư, người đưa thư, giấy biên nhận, hộc thư lỗi… mỗi ga mở thêm một góc của bưu điện đó.

Mỗi ga mở đầu bằng **"Hình dung trước"** (khái niệm so với chuyện đời thường, kèm sơ đồ) và một **từ điển nhanh** cho thuật ngữ mới. Đọc hai phần đó trước rồi mới vào phần kỹ thuật.

## Vì sao xếp theo thứ tự này

- **Ga 1–3** dựng từ vựng: vì sao cần broker, các thành phần của mô hình AMQP (connection, channel, exchange, queue, binding), và cách exchange quyết định thư đi đâu.
- **Ga 4–6** là chuyện "giao nhận chắc tay": ack và prefetch phía người nhận, confirm phía người gửi, vì sao chỉ có "ít nhất một lần" chứ không có "đúng một lần", và làm gì với thư lỗi, thư cần thử lại, thư hẹn giờ.
- **Ga 7–9** đi vào hạ tầng: ba loại queue và cách chúng sống sót khi node chết, cụm nhiều node, rồi vận hành thật (giám sát, giới hạn tài nguyên, bảo mật, checklist).

Không thể hiểu dead-letter nếu chưa biết ack và requeue; không thể chọn quorum queue nếu chưa biết vì sao tin có thể mất. Mỗi ga chỉ dùng từ vựng của các ga trước.

## Phiên bản và nguồn

Tuyến viết theo **RabbitMQ 4.4** (bản mới nhất lúc viết, tháng 11/2026), có ghi chú khi hành vi khác ở bản cũ. Nhiều bài hướng dẫn trên mạng đã lỗi thời: mirrored queue bị gỡ ở 4.0, queue `durable: false` không độc quyền bị chặn từ 4.3, plugin delayed message đã ngừng bảo trì. Mọi ví dụ trong tuyến chạy thật trên RabbitMQ 4.4.1 với thư viện `amqplib`, kèm lệnh Docker để bạn chạy lại.

Nguồn chính là tài liệu chính thức tại [rabbitmq.com/docs](https://www.rabbitmq.com/docs), release notes của RabbitMQ và tài liệu `amqplib`. Ví dụ ngữ cảnh lấy cảm hứng từ **flash-sale**, trang bán hàng giảm giá giờ vàng mình tự viết, đã rút gọn và đổi tên.
