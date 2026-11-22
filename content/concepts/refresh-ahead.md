---
title: "Refresh-Ahead"
description: "Mục được đọc khi sắp hết hạn thì làm mới ở nền, người đọc không phải chờ nguồn."
tags: ["caching", "patterns"]
type: note
region: Vùng Cache
---

**Refresh-ahead** giữ cho mục hot không bao giờ hết hạn thật, mục ít đọc thì cứ để hết hạn. Cái giá là một ít query thừa. Cùng họ với stale-while-revalidate (làm mới sau hạn) và XFetch (làm mới sớm theo xác suất).

Đọc thêm trong bài [[posts/2026-11-22-caching-patterns|Mẫu đọc và ghi]].
