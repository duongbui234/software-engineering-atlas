---
title: "Alternate Exchange"
description: "Exchange dự phòng nhận các tin không khớp binding nào."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Alternate exchange** (AE) được gắn cho một exchange; tin không khớp binding nào sẽ chuyển sang AE thay vì bị bỏ. Thường AE là fanout bind tới một queue "thư thất lạc" để xem lại. Nên đặt bằng policy; cũng đặt được bằng tham số `alternate-exchange`. Tin đi sang AE được coi là đã định tuyến, nên `mandatory` không sinh `basic.return`.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-exchanges|Bốn kiểu exchange chuẩn]].
