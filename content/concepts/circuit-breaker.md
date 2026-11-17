---
title: Circuit Breaker
description: "Cầu dao cho lời gọi từ xa: lỗi nhiều thì ngừng gọi một lúc rồi thử lại."
tags: [api, reliability]
type: note
region: Vùng API
---

**Circuit breaker** có ba trạng thái: CLOSED (gọi bình thường, đếm lỗi), OPEN (trả lỗi ngay, không gọi), HALF_OPEN (cho một request đi thử). Nó cho dependency thời gian hồi phục và giúp request của mình fail fast thay vì chờ timeout. Flash-sale lồng retry bên trong breaker: `CB(Retry(action))`.

Đọc thêm trong bài [[2026-11-18-api-reliability|Độ tin cậy của API]].
