---
title: GraphQL
description: "Ngôn ngữ truy vấn cho API: client tự chọn field cần lấy qua một endpoint."
tags: [api, architecture]
type: note
region: Vùng API
---

**GraphQL** cho client gửi một query mô tả đúng hình dạng dữ liệu cần, dựa trên schema có kiểu do server công bố. Nó giải quyết over-fetching và under-fetching khi có nhiều loại client, đổi lại cache HTTP khó dùng, dễ N+1 ở resolver (cần DataLoader) và phải giới hạn độ sâu query.

Đọc thêm trong bài [[2026-11-18-api-styles|Năm kiểu API]].
