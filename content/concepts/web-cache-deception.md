---
title: "Web Cache Deception"
description: "Lừa nạn nhân làm cache dùng chung lưu trang riêng tư của họ, rồi kẻ tấn công đọc từ cache."
tags: ["caching", "security", "http"]
type: note
region: Vùng Cache
---

**Web cache deception** (Omer Gil, 2017): cache coi `/account/avatar.css` là file tĩnh theo đuôi, origin lại trả trang tài khoản. Chặn: tôn trọng `Cache-Control` của origin, trả 404 cho đường dẫn không tồn tại, cache file tĩnh theo thư mục chứ không theo đuôi.

Đọc thêm trong bài [[posts/2026-11-22-caching-operations|Vận hành và an toàn]].
