---
title: "At-least-once Delivery"
description: "Không mất tin, nhưng có thể nhận trùng."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**At-least-once** cần ack thủ công, publisher confirm, queue bền và tin persistent. Đổi lại, tin có thể tới hai lần: consumer chết sau khi làm xong nhưng trước khi ack, producer gửi lại vì không thấy biên nhận, hoặc quorum queue đổi leader. Ngược lại, at-most-once (auto-ack, không confirm) có thể mất nhưng không trùng.

Đọc thêm trong bài [[2026-11-21-rabbitmq-delivery-guarantees|Không mất, không trùng]].
