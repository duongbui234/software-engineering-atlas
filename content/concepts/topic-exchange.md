---
title: "Topic Exchange"
description: "Khớp routing key dạng các từ nối bằng dấu chấm; `*` là đúng một từ, `#` là không hoặc nhiều từ."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Topic exchange** so routing key như `order.vn.hcm.placed` với binding key có ký tự đại diện: `*` khớp đúng một từ, `#` khớp không, một hoặc nhiều từ. Vì vậy `order.vn.#` khớp cả `order.vn`, còn `*.cancelled` không khớp `order.vn.cancelled`. Binding chỉ có `#` biến nó thành fanout. Từ 4.4, một binding key tối đa hai `#`.

Đọc thêm trong bài [[2026-11-21-rabbitmq-exchanges|Bốn kiểu exchange chuẩn]].
