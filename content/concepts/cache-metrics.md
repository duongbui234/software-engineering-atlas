---
title: "Cache Metrics"
description: "Số liệu cho biết cache có trúng không, có thiếu chỗ không, và có giảm tải cho nguồn không."
tags: ["caching", "observability"]
type: note
region: Vùng Cache
---

**Cache metrics**: hit ratio theo từng cache (đếm ở ứng dụng, vì `keyspace_hits` của Redis gộp mọi key), `evicted_keys`, `expired_keys`, bộ nhớ so với `maxmemory`, độ trễ lệnh, thời gian nạp khi trượt và tải mà database nhận.

Đọc thêm trong bài [[2026-11-22-caching-operations|Vận hành và an toàn]].
