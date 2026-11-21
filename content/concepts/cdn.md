---
title: "CDN"
description: "Mạng máy chủ đặt gần người dùng, giữ bản sao dùng chung của nội dung và chắn tải cho origin."
tags: ["caching", "http", "infrastructure"]
type: note
region: Vùng Cache
---

**CDN** (Content Delivery Network) là shared cache: một bản phục vụ nhiều người, nên không được giữ dữ liệu riêng (`private`, `no-store`). Ngoài giảm độ trễ, CDN chắn tải: origin chỉ thấy lần trượt. Điều khiển riêng bằng `s-maxage` hoặc `CDN-Cache-Control` (RFC 9213).

Đọc thêm trong bài [[2026-11-22-caching-http|Cache trên đường HTTP]].
