---
title: "Unicode Normalization"
description: "Đưa các cách mã hóa khác nhau của cùng một chữ về một dạng chuẩn (NFC, NFD)."
tags: ["unicode", "strings"]
type: note
region: Vùng Thuật toán
---

Chữ `é` có thể là một code point (U+00E9) hoặc `e` cộng dấu sắc kết hợp (U+0301): hiển thị giống hệt nhưng so sánh khác nhau. **Chuẩn hóa** về NFC đưa cả hai về dạng dựng sẵn. JS có `s.normalize('NFC')`, Python có `unicodedata.normalize`, Java có `Normalizer`, Go cần gói `golang.org/x/text/unicode/norm`. Ngoài ra, JS và Java lưu chuỗi bằng UTF-16 nên `length` và `split('')` đếm code unit, làm vỡ emoji.

Đọc thêm trong bài [[2026-11-22-neetcode-valid-anagram|Valid Anagram]].
