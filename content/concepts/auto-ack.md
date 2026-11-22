---
title: "Auto-ack"
description: "Tin bị coi là xong ngay khi gửi đi; consumer chết là mất tin."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Auto-ack** (`noAck: true`) bảo broker xóa tin ngay khi vừa gửi xuống mạng. Nhanh hơn, nhưng consumer chết giữa chừng là mất tin, và prefetch không còn tác dụng nên consumer có thể bị ngập. Tài liệu RabbitMQ coi chế độ này là không an toàn. `amqplib` mặc định ack thủ công, còn NestJS `Transport.RMQ` mặc định `noAck: true`.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-ack-confirm|Giao nhận chắc tay: ack, prefetch, confirm]].
