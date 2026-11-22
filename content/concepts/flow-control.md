---
title: "Flow Control"
description: "Back-pressure bên trong broker làm chậm connection đang gửi quá nhanh."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Khâu nào trong chuỗi xử lý tin (channel, queue, ghi đĩa, chép bản sao) chậm thì áp lực dồn ngược về connection đang gửi; connection hiện trạng thái `flow`, bị chặn và mở nhiều lần mỗi giây. Connection chỉ nhận không bị phanh, nên tách connection gửi và nhận. `flow` kéo dài là dấu hiệu broker đang ở giới hạn.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-operations|Vận hành RabbitMQ trong production]].
