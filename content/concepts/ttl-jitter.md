---
title: "TTL Jitter"
description: "Cộng trừ ngẫu nhiên vào TTL để nhiều key nạp cùng lúc không hết hạn cùng lúc."
tags: ["caching", "reliability"]
type: note
region: Vùng Cache
---

**TTL jitter** (ví dụ 60 giây ± 20%) trải các lần hết hạn ra, tránh "tuyết lở" sau khi nạp hàng loạt, khởi động lại hay làm nóng cache. Tổng số query không đổi, chỉ đỉnh giảm: 2.000 xuống 526 query mỗi 100 ms trong ví dụ.

Đọc thêm trong bài [[2026-11-22-caching-under-load|Cache dưới tải cao]].
