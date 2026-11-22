---
title: "Message Ordering"
description: "Thứ tự chỉ giữ trong một queue với một consumer; nhiều thứ làm nó đảo."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Tin từ một producer trên một channel vào một queue được giao đúng thứ tự gửi. Thứ tự bị đảo khi có nhiều consumer, khi requeue, khi dùng priority, hoặc có nhiều producer. Muốn giữ thứ tự: một consumer hay single active consumer, chia theo khóa bằng consistent hash, hoặc làm consumer bỏ qua sự kiện cũ hơn trạng thái hiện tại.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-delivery-guarantees|Không mất, không trùng]].
