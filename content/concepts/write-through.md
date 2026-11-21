---
title: "Write-Through"
description: "Mỗi lần ghi, ghi cả database lẫn cache rồi mới trả lời."
tags: ["caching", "patterns"]
type: note
region: Vùng Cache
---

**Write-through** cho đọc ngay sau khi ghi luôn trúng, đổi lại mỗi lần ghi chậm hơn và cache có thể đầy thứ không ai đọc (cần TTL). Vì là ghi giá trị mới, hai lần ghi đồng thời vẫn có thể để lại giá trị sai.

Đọc thêm trong bài [[2026-11-22-caching-patterns|Mẫu đọc và ghi]].
