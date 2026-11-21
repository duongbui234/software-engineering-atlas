---
title: "Big Key"
description: "Key có giá trị rất lớn hoặc collection rất nhiều phần tử, làm Redis chậm khi đọc, xóa hay hết hạn."
tags: ["caching", "redis"]
type: note
region: Vùng Cache
---

**Big key** gây hại vì Redis chạy lệnh trên một luồng: `DEL` một hash 1 triệu field chặn mọi client khoảng 51 ms trong ví dụ. Dùng `UNLINK` (giải phóng ở luồng nền), chia nhỏ key, bật `lazyfree-*` nếu cần; tìm bằng `--bigkeys`, `--memkeys`, `MEMORY USAGE`.

Đọc thêm trong bài [[2026-11-22-caching-redis|Redis làm cache]].
