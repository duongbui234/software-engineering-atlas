---
title: "TTL"
description: "Thời gian sống của một mục cache; giới hạn thời gian tối đa cache được sai."
tags: ["caching", "redis"]
type: note
region: Vùng Cache
---

**TTL** là lưới an toàn cho mọi kiểu invalidation: quên xóa hay race thì mục sai cũng tự biến mất. Trong Redis: `SET ... EX`, `EXPIRE`, `TTL` (−1 không hạn, −2 không tồn tại). `SET` không kèm `EX`/`KEEPTTL` xóa TTL cũ; `GET` không gia hạn, muốn gia hạn khi đọc thì dùng `GETEX`.

Đọc thêm trong bài [[posts/2026-11-22-caching-invalidation|Invalidation]].
