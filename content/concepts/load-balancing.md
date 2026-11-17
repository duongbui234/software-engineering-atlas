---
title: Load Balancing
description: "Chia request cho nhiều bản sao của một service."
tags: [api, performance]
type: note
region: Vùng API
---

**Load balancing** cho phép chạy nhiều pod sau một địa chỉ. Nó chỉ hoạt động trơn tru khi pod stateless, có health check để rút pod hỏng ra, và có thời gian chờ khi tắt pod. Round robin đủ khi request đồng đều; khi nặng nhẹ khác nhau thì least connections hoặc EWMA chia đều hơn.

Đọc thêm trong bài [[2026-11-18-api-performance|Hiệu năng API]].
