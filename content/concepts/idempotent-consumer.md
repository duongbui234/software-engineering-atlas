---
title: "Idempotent Consumer"
description: "Consumer nhận một tin hai lần vẫn cho kết quả như nhận một lần."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Consumer idempotent** ghi mã sự kiện vào một bảng "đã xử lý" (khóa chính là cặp mã sự kiện và tên consumer) **trong cùng transaction** với việc nghiệp vụ; gặp lại mã cũ thì bỏ qua và vẫn ack. Ghi sổ ở transaction riêng thì chết giữa chừng sẽ mất hoặc trùng việc. Mã sự kiện phải do người tạo sự kiện sinh ra. Xem thêm [[concepts/idempotency|Idempotency]].

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-delivery-guarantees|Không mất, không trùng]].
