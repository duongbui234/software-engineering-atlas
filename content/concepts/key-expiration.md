---
title: "Key Expiration"
description: "Cách Redis xóa key hết hạn: khi có người đọc tới, và bằng vòng quét nền lấy mẫu."
tags: ["caching", "redis"]
type: note
region: Vùng Cache
---

**Key expiration** trong Redis là thụ động (đọc tới key hết hạn thì xóa) cộng chủ động (vòng quét theo `hz`, lấy mẫu key có TTL, tinh chỉnh bằng `active-expire-effort`). Từ Redis 7.4 từng field của hash có TTL riêng (`HEXPIRE`, `HTTL`).

Đọc thêm trong bài [[2026-11-22-caching-redis|Redis làm cache]].
