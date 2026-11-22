---
title: "Exchange-to-Exchange Binding"
description: "Bind một exchange vào exchange khác thay vì vào queue."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Exchange-to-exchange binding** là phần mở rộng của RabbitMQ cho phép tin đi qua một chuỗi exchange, mỗi cái theo luật của nó. Broker gộp các đường đi trước khi chép, nên mỗi queue chỉ nhận một bản dù có nhiều đường dẫn tới, và vòng lặp bị phát hiện. Hợp khi mỗi đội muốn tự quản exchange của mình dưới một exchange chung.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-exchanges|Bốn kiểu exchange chuẩn]].
