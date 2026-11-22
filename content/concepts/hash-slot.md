---
title: "Hash Slot"
description: "Redis Cluster chia key vào 16384 slot bằng CRC16(key) mod 16384; mỗi node giữ một dải slot."
tags: ["caching", "redis", "distributed-systems"]
type: note
region: Vùng Cache
---

**Hash slot** cho phép chuyển từng slot khi thêm node, client được chuyển hướng bằng `MOVED`/`ASK`. Lệnh nhiều key, transaction và Lua chỉ chạy khi mọi key cùng slot (không thì `CROSSSLOT`); hash tag `{...}` ép key về cùng slot.

Đọc thêm trong bài [[posts/2026-11-22-caching-distributed|Nhiều tầng, nhiều máy]].
