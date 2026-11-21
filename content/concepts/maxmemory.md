---
title: "Maxmemory"
description: "Trần bộ nhớ cho dữ liệu của Redis; mặc định 0 là không giới hạn."
tags: ["caching", "redis"]
type: note
region: Vùng Cache
---

**maxmemory** kích hoạt việc đẩy key theo `maxmemory-policy` khi lệnh ghi làm vượt trần. Chừa chỗ cho bộ đệm client, replica và fork khi ghi snapshot; trong container phải nhỏ hơn giới hạn của container. Không đặt thì Redis lớn tới khi bị hệ điều hành giết.

Đọc thêm trong bài [[2026-11-22-caching-redis|Redis làm cache]].
