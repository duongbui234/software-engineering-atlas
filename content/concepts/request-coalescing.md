---
title: "Request Coalescing"
description: "Nhiều request cùng trượt một key thì chỉ một request đi lấy, những request khác chờ chung kết quả."
tags: ["caching", "reliability", "concurrency"]
type: note
region: Vùng Cache
---

**Request coalescing** trong một tiến trình là singleflight (bảng key → promise đang chạy); giữa nhiều máy là khóa Redis `SET NX EX` với token và nhả khóa bằng Lua so token, người thua chờ có giới hạn rồi đọc lại cache. nginx có `proxy_cache_lock`.

Đọc thêm trong bài [[posts/2026-11-22-caching-under-load|Cache dưới tải cao]].
