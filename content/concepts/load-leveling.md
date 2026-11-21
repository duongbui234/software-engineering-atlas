---
title: "Load Leveling"
description: "Hàng đợi giữ phần việc dư khi việc tới nhanh hơn sức xử lý."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**San tải** là dùng hàng đợi làm cái đệm: 10.000 đơn tới trong 10 giây thì hàng giữ phần dư, consumer xử lý đều theo tốc độ của mình. Muốn nhanh hơn thì thêm consumer. Hàng đợi không phải túi không đáy: hàng phình mãi sẽ chạm cảnh báo tài nguyên và RabbitMQ chặn mọi bên gửi, nên cần giới hạn độ dài.

Đọc thêm trong bài [[2026-11-21-rabbitmq-why-queues|Vì sao cần hàng đợi tin nhắn]].
