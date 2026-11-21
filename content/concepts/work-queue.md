---
title: "Work Queue"
description: "Nhiều consumer cùng đọc một queue, broker chia tin cho họ."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Work queue** (competing consumers) là một queue với nhiều consumer giống nhau; mỗi tin chỉ một consumer nhận. Mặc định broker chia round-robin bất kể ai đang bận; ack thủ công cộng prefetch nhỏ mới chia theo ai rảnh. Muốn xử lý nhanh hơn thì thêm consumer. Đây là cách san tải thành hiện thực.

Đọc thêm trong bài [[2026-11-21-rabbitmq-ack-confirm|Giao nhận chắc tay: ack, prefetch, confirm]].
