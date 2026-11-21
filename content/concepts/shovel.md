---
title: "Shovel"
description: "Ống bơm một chiều chuyển tin từ một nguồn sang một đích."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Shovel** đọc từ một queue hoặc exchange nguồn, gửi tới một đích, có ack và confirm ở hai đầu, nói được AMQP 0-9-1 và 1.0, chạy được giữa các cụm. Dynamic shovel khai báo lúc chạy là cách hiện đại; từ 4.2 có local shovel trong cùng cụm. Hay dùng để chuyển tin khi đổi loại queue, khi nâng cấp blue-green, hoặc xả hộc thư lỗi.

Đọc thêm trong bài [[2026-11-21-rabbitmq-cluster|Cụm và sẵn sàng cao]].
