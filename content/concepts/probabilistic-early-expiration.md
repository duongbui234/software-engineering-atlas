---
title: "Probabilistic Early Expiration"
description: "Mỗi request tự tung đồng xu để làm mới sớm, xác suất tăng dần khi gần hạn (XFetch)."
tags: ["caching", "reliability", "performance"]
type: note
region: Vùng Cache
---

**XFetch** (Vattani và cộng sự, VLDB 2015) tính lại khi `now − delta × beta × ln(rand()) ≥ expiry`, với `delta` là thời gian tính lại và `beta = 1` mặc định. Không cần khóa hay phối hợp giữa các máy. Trong ví dụ giảm số query từ 127 xuống 50; thêm singleflight ở nền còn 6.

Đọc thêm trong bài [[posts/2026-11-22-caching-under-load|Cache dưới tải cao]].
