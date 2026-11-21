---
title: "Asynchronous Messaging"
description: "Bên gửi giao tin cho broker rồi đi tiếp, không chờ bên nhận xử lý xong."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Gửi bất đồng bộ** nghĩa là bên gửi chỉ chờ broker xác nhận "đã nhận giữ tin" (vài mili giây), không chờ bên nhận làm xong việc. Request của người dùng nhanh hơn vì việc phụ được dời ra sau, nhưng tổng khối lượng việc không giảm và kết quả không có ngay. Việc mà người dùng cần biết kết quả tức thì vẫn nên gọi đồng bộ.

Đọc thêm trong bài [[2026-11-21-rabbitmq-why-queues|Vì sao cần hàng đợi tin nhắn]].
