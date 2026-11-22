---
title: "Client-side Caching"
description: "Redis 6+ tự nhớ client đã đọc key nào và gửi tin báo hủy khi key đó đổi."
tags: ["caching", "redis"]
type: note
region: Vùng Cache
---

**Client-side caching** (`CLIENT TRACKING`) có chế độ mặc định (nhớ từng key, tốn bộ nhớ server) và broadcast (theo tiền tố, không tốn). RESP2 cần `REDIRECT` tới kết nối subscribe `__redis__:invalidate`; có `OPTIN`, `OPTOUT`, `NOLOOP`. Mất kết nối thì nên xóa sạch cache cục bộ.

Đọc thêm trong bài [[posts/2026-11-22-caching-distributed|Nhiều tầng, nhiều máy]].
