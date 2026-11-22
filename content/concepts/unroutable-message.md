---
title: "Unroutable Message"
description: "Tin không khớp binding nào: mặc định bị bỏ im lặng."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Một tin **unroutable** có ba số phận: bị bỏ im lặng (mặc định), bị trả về producer qua `basic.return` mã 312 nếu gửi với `mandatory: true`, hoặc chuyển sang alternate exchange. Publisher confirm vẫn báo thành công cho tin bị bỏ, vì broker đã xử lý xong trách nhiệm của nó. Theo dõi bộ đếm `messages_unroutable_dropped` để phát hiện.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-exchanges|Bốn kiểu exchange chuẩn]].
