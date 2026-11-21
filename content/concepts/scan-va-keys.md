---
title: "SCAN và KEYS"
description: "KEYS duyệt cả keyspace trong một lệnh và chặn Redis; SCAN duyệt từng đợt bằng con trỏ."
tags: ["caching", "redis"]
type: note
region: Vùng Cache
---

**KEYS** là O(N) trên toàn bộ key, tài liệu Redis cấm dùng trong code ứng dụng. **SCAN** trả từng đợt kèm con trỏ, không chặn client khác; có thể trả trùng và không chắc thấy key thêm hoặc xóa giữa chừng. Để xóa một nhóm key, tốt hơn là thiết kế version trong khóa.

Đọc thêm trong bài [[2026-11-22-caching-redis|Redis làm cache]].
