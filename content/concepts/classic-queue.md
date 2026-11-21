---
title: "Classic Queue"
description: "Loại queue mặc định, tin nằm trên một node, không có bản sao."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Classic queue** giữ tin trên một node. Mirrored queue (`ha-mode`) đã bị gỡ ở 4.0; lazy mode bị bỏ qua từ 3.12. Classic hỗ trợ exclusive, auto-delete, TTL, giới hạn độ dài, priority, DLX, nhưng không chịu được node hỏng và không có delivery limit. Hợp cho queue tạm, queue riêng của một consumer, RPC và dữ liệu mất được.

Đọc thêm trong bài [[2026-11-21-rabbitmq-queue-types|Classic, quorum hay stream]].
