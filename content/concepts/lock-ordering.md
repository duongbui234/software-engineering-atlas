---
title: "Lock Ordering"
description: "Mọi đoạn code khóa nhiều dòng theo cùng một thứ tự toàn cục để không thể có vòng chờ."
tags: ["database", "locking"]
type: note
region: Vùng Database
---

**Khóa theo thứ tự**: nếu ai cũng khóa A trước B, người tới sau chờ ngay ở khóa đầu tiên mà chưa giữ gì, nên không có vòng chờ. flash-sale sắp xếp `skuId` tăng dần trước khi giữ hàng cho cả giỏ và cả khi nhả hàng. Thứ tự phải nhất quán giữa mọi đường chạm vào cùng các dòng (checkout, nhả hàng, job admin), và nên lấy khóa mạnh nhất cần dùng ngay từ đầu.

Đọc thêm trong bài [[2026-11-22-transactions-deadlock|Deadlock và transaction dài]].
