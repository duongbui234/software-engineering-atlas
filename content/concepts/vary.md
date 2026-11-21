---
title: "Vary"
description: "Header nói với cache đưa thêm header của request vào khóa cache."
tags: ["caching", "http"]
type: note
region: Vùng Cache
---

**Vary** dùng khi cùng URL có nhiều phiên bản (ví dụ `Vary: Accept-Language`). Chọn header nhiều giá trị (`User-Agent`, `Cookie`) làm vỡ cache thành hàng nghìn mảnh; thiếu Vary khi nội dung phụ thuộc header thì cache trả nhầm phiên bản cho người khác.

Đọc thêm trong bài [[2026-11-22-caching-http|Cache trên đường HTTP]].
