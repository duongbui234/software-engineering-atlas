---
title: "Lost Update"
description: "Hai transaction cùng đọc một giá trị rồi cùng ghi, lần ghi sau đè lên lần ghi trước."
tags: ["concurrency", "database"]
type: note
region: Vùng Database
---

**Lost update** (hiện tượng P4): hai transaction cùng đọc 37, cùng ghi 36, kho chỉ giảm 1 dù bán 2. Read Committed của Postgres không chặn nó, vì request sau áp thao tác "đặt stock = 36" (hằng số app tính từ dữ liệu cũ) lên phiên bản mới nhất. Trong ví dụ của tuyến: 300 đơn cho 100 suất, tồn kho cuối vẫn còn 86. `stock = stock - 1` chữa được lost update nhưng không chữa được oversell.

Đọc thêm trong bài [[posts/2026-11-22-transactions-race|Race condition: tái hiện bán quá số hàng]].
