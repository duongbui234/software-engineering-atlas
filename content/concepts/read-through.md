---
title: "Read-Through"
description: "Ứng dụng chỉ hỏi cache; cache được cấu hình sẵn hàm nạp và tự đi lấy từ nguồn khi trượt."
tags: ["caching", "patterns"]
type: note
region: Vùng Cache
---

**Read-through** giống cache-aside khi nhìn từ database, chỉ khác ai giữ code nạp dữ liệu. Code đọc gọn và đồng nhất, cache có thể tự gom các lần trượt cùng key. Không tự giải quyết invalidation.

Đọc thêm trong bài [[2026-11-22-caching-patterns|Mẫu đọc và ghi]].
