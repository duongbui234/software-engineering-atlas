---
title: "Edit Operations"
description: "Chèn, xóa và thay một ký tự, ba bước tạo nên khoảng cách Levenshtein giữa hai chuỗi."
tags: [algorithms, neetcode, dynamic-programming, string]
type: note
region: Vùng Thuật toán
---

Mỗi phép sửa ứng với một hướng trong bảng hai chuỗi: xóa đọc ô trên, chèn đọc ô trái, thay đọc ô chéo. Khi hai ký tự cuối đã khớp, đi chéo không tốn gì. Hàng 0 và cột 0 bằng số ký tự phải chèn hoặc xóa để biến tiền tố rỗng thành tiền tố kia.

Đọc thêm trong bài [[posts/2026-11-27-neetcode-grid-two-strings|DP-05]] và trang [[problems/edit-distance|Edit Distance]].
