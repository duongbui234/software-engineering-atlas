---
title: "ETag"
description: "Mã phiên bản của một response, dùng để hỏi lại \"bản tôi có còn đúng không\" và nhận 304 nếu chưa đổi."
tags: ["caching", "http"]
type: note
region: Vùng Cache
---

**ETag** do server đặt; client hỏi lại bằng `If-None-Match`, chưa đổi thì nhận `304 Not Modified` không có body. Strong ETag (mặc định) là giống từng byte, weak (`W/"..."`) là tương đương về nghĩa. Lấy ETag từ cột version của database rẻ hơn băm cả body.

Đọc thêm trong bài [[2026-11-22-caching-http|Cache trên đường HTTP]].
