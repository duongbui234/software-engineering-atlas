---
title: Timeouts
description: "Hạn chót cho mọi lời gọi ra ngoài."
tags: [api, reliability]
type: note
region: Vùng API
---

**Timeout** ngăn một dependency chậm giữ tài nguyên mãi mãi và kéo cả hệ thống chậm theo. Đặt quanh percentile cao của độ trễ đo được, khác nhau cho từng dependency, và giảm dần từ tầng ngoài vào tầng trong để tầng ngoài không bỏ cuộc trong khi tầng trong vẫn đang làm.

Đọc thêm trong bài [[2026-11-18-api-reliability|Độ tin cậy của API]].
