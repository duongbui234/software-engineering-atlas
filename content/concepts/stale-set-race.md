---
title: "Stale Set Race"
description: "Người đọc trượt cache, đọc DB cũ, bị chậm, rồi ghi giá trị cũ vào cache sau khi người ghi đã xóa."
tags: ["caching", "consistency", "concurrency"]
type: note
region: Vùng Cache
---

**Stale set** là khe hở của cache-aside: lần xóa của người ghi xảy ra trước lần ghi cache muộn của người đọc, nên cache sai tới hết TTL. Dễ xảy ra hơn khi đọc từ replica. Chữa bằng lease hoặc version; delayed double delete chỉ thu hẹp cửa sổ.

Đọc thêm trong bài [[posts/2026-11-22-caching-invalidation|Invalidation]].
