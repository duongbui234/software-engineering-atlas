---
title: "Reverse Polish Notation"
description: "Viết toán tử sau các toán hạng, như 3 4 +; tính bằng một ngăn xếp và không cần ngoặc."
tags: ["algorithms", "stack"]
type: note
region: Vùng Thuật toán
---

Đọc từ trái sang phải: số thì đẩy vào [[concepts/stack|ngăn xếp]], toán tử thì lấy hai số trên đỉnh (số lấy ra trước là vế phải), tính, đẩy kết quả lại. `2 1 + 3 *` là `(2 + 1) · 3`. Thứ tự toán tử đã nằm sẵn trong thứ tự viết, nên không cần ngoặc hay độ ưu tiên. Máy tính HP, ngôn ngữ Forth và máy ảo JVM đều tính theo kiểu này.

Đọc thêm trong bài [[posts/2026-11-23-neetcode-stack|ga 6: Ngăn xếp]].
