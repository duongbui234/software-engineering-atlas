---
title: "Federation"
description: "Nối các cụm ở xa: exchange hoặc queue ở cụm này nhận tin từ cụm khác."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Federation** chạy qua WAN, giữa các cụm khác phiên bản. **Federated exchange** nhận bản sao tin được gửi vào exchange cùng tên ở upstream. **Federated queue** kéo tin từ upstream khi nó có consumer mà không có tin. Cấu hình bằng policy, bất đồng bộ. Dùng cho nhiều vùng địa lý thay vì kéo một cụm qua WAN.

Đọc thêm trong bài [[2026-11-21-rabbitmq-cluster|Cụm và sẵn sàng cao]].
