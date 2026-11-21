---
title: "Fail-open"
description: "Cache lỗi thì coi như trượt và đọc thẳng nguồn, thay vì làm request lỗi."
tags: ["caching", "reliability"]
type: note
region: Vùng Cache
---

**Fail-open** đúng với cache thật (mọi thứ nạp lại được), nhưng cần timeout ngắn, tắt hàng chờ offline của client (ioredis mặc định treo request), cầu dao, và database chịu được khi hit ratio về 0. Dữ liệu lưu chính (session, khóa) thì fail-closed.

Đọc thêm trong bài [[2026-11-22-caching-operations|Vận hành và an toàn]].
