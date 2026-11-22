---
title: "Khepri"
description: "Kho siêu dữ liệu dùng Raft, thay Mnesia; là kho duy nhất từ RabbitMQ 4.3."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Khepri** lưu siêu dữ liệu của cụm bằng Raft: thử nghiệm ở 3.13, chính thức ở 4.0, mặc định cho cụm mới ở 4.2, và từ 4.3 Mnesia bị gỡ hẳn. Hệ quả: cụm cần đa số node sống để khởi động và để đổi siêu dữ liệu. Trên Kubernetes nên cho các pod RabbitMQ khởi động song song.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-cluster|Cụm và sẵn sàng cao]].
