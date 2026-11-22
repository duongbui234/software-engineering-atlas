---
title: "Fanout Exchange"
description: "Chép tin vào mọi queue đã bind, bỏ qua routing key."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Fanout exchange** là kiểu "phát loa": mọi queue bind vào nó nhận mọi tin, routing key bị bỏ qua. Đây là mẫu pub/sub cơ bản, thường mỗi subscriber một queue riêng. Đơn giản và nhanh, nhưng không lọc được; khi người nghe chỉ cần một phần sự kiện thì chuyển sang topic. Có sẵn `amq.fanout`.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-exchanges|Bốn kiểu exchange chuẩn]].
