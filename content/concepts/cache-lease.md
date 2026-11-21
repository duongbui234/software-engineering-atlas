---
title: "Cache Lease"
description: "Token cấp cho người trượt cache; chỉ người giữ token còn hiệu lực mới được ghi vào cache."
tags: ["caching", "consistency", "concurrency"]
type: note
region: Vùng Cache
---

**Lease** (memcache của Facebook, NSDI 2013) là token 64-bit gắn với một key; xóa key thì token bị hủy, nên lần ghi muộn mang token cũ bị từ chối. Phát token có giới hạn (một lần mỗi 10 giây mỗi key) còn chống thundering herd. Trong Redis dựng bằng key phụ và Lua script.

Đọc thêm trong bài [[2026-11-22-caching-invalidation|Invalidation]].
