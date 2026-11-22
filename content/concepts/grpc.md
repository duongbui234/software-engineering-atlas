---
title: gRPC
description: "Gọi hàm từ xa qua HTTP/2 với hợp đồng Protocol Buffers."
tags: [api, architecture]
type: note
region: Vùng API
---

**gRPC** dùng file `.proto` làm hợp đồng, sinh code client/server cho từng ngôn ngữ, gửi dữ liệu nhị phân qua HTTP/2, hỗ trợ streaming hai chiều và deadline. Hợp cho gọi nội bộ giữa các service; trình duyệt không gọi trực tiếp được nếu không qua gRPC-Web.

Đọc thêm trong bài [[posts/2026-11-18-api-styles|Năm kiểu API]].
