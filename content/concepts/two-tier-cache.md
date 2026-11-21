---
title: "Two-tier Cache"
description: "L1 trong RAM từng pod, L2 dùng chung (Redis), rồi mới tới nguồn."
tags: ["caching", "architecture"]
type: note
region: Vùng Cache
---

**Two-tier cache** đọc từ trên xuống, trượt tầng nào thì nạp lại tầng đó. Phần khó là báo mọi pod bỏ L1 khi dữ liệu đổi; L1 luôn cần TTL làm lưới an toàn vì tin báo hủy có thể bị lỡ.

Đọc thêm trong bài [[2026-11-22-caching-distributed|Nhiều tầng, nhiều máy]].
