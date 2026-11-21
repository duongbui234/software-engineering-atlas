---
title: "Priority Queue"
description: "Tin ưu tiên cao được giao trước tin thường đang chờ trong cùng queue."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Classic queue cần khai báo `x-max-priority` (khuyên dưới 10 mức, không đặt bằng policy được). Quorum queue từ 4.3 có sẵn 32 mức, ưu tiên tuyệt đối, tin không đặt priority là mức 4. Priority chỉ có tác dụng khi hàng đang tồn, và prefetch lớn làm nó kém hiệu quả. Khác với consumer priority, nơi consumer có thứ hạng.

Đọc thêm trong bài [[2026-11-21-rabbitmq-dlx-retry|Thư lỗi và thư hẹn giờ]].
