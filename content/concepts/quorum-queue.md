---
title: "Quorum Queue"
description: "Queue được chép ra nhiều node theo Raft; dùng cho dữ liệu quan trọng."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Quorum queue** có một leader và các follower trên các node khác nhau (mặc định 3 bản sao). Lệnh ghi có hiệu lực khi đa số đã chép; confirm gửi lúc đó. Leader chết thì đa số còn lại bầu leader mới; mất đa số thì queue đứng. Luôn durable, không exclusive, không global QoS; có delivery limit, at-least-once dead-lettering, delayed retry (4.3) và hẹn giờ giao (4.4).

Đọc thêm trong bài [[2026-11-21-rabbitmq-queue-types|Classic, quorum hay stream]].
