---
title: "Long-running Transaction"
description: "Transaction mở lâu hơn cần thiết, thường vì làm việc không liên quan tới database bên trong nó."
tags: ["database", "postgres", "reliability"]
type: note
region: Vùng Database
---

Một **transaction dài** (gọi cổng thanh toán, gửi email, chờ service chậm khi đang mở transaction) giữ khóa dòng, giữ một kết nối trong pool, và giữ phiên bản dòng cũ mà MVCC chưa dọn được. Trong ví dụ của tuyến, giữ khóa SKU 3 giây thì mọi người mua SKU đó chờ 3 giây. Gọi API ngoài trước hoặc sau transaction, dùng outbox, và đặt `idle_in_transaction_session_timeout`.

Đọc thêm trong bài [[posts/2026-11-22-transactions-deadlock|Deadlock và transaction dài]].
