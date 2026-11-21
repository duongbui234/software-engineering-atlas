---
title: "Consistent Hashing"
description: "Chia key cho các node trên một vòng băm để thêm hoặc bớt node chỉ làm khoảng 1/N key đổi chỗ."
tags: ["caching", "distributed-systems"]
type: note
region: Vùng Cache
---

**Consistent hashing** (Karger và cộng sự, 1997) đặt node và key lên vòng tròn, key thuộc node đầu tiên theo chiều kim đồng hồ; virtual node giúp chia đều. Thêm node thứ 5: `hash % N` làm 80% key đổi node, consistent hashing khoảng 20%.

Đọc thêm trong bài [[2026-11-22-caching-distributed|Nhiều tầng, nhiều máy]].
