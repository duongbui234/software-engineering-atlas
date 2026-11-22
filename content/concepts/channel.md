---
title: "Channel"
description: "Làn logic nhẹ chạy chung một connection; mọi thao tác diễn ra trên một channel."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Channel** là "kết nối nhẹ" bên trong một connection. Gửi tin, khai báo queue, ack đều diễn ra trên một channel cụ thể. Mỗi luồng xử lý một channel, không dùng chung. Lỗi mềm (404, 406) chỉ đóng channel, không đóng connection. Delivery tag đánh số theo channel, nên ack phải gửi trên đúng channel đã nhận tin.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-amqp-model|Bên trong bưu điện: mô hình AMQP]].
