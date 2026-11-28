---
title: "Visit-and-Restore"
description: "Đánh dấu ô đang đi qua ngay trên dữ liệu, rồi ghi lại giá trị cũ khi quay lui, thay cho một bảng visited riêng."
tags: [algorithms, neetcode, backtracking, grid]
type: note
region: Vùng Thuật toán
---

Trong tìm đường trên lưới, một ô không được dùng hai lần trên cùng một đường, nhưng đường khác vẫn được đi qua nó. Mình ghi đè ô bằng một ký tự đánh dấu như `#` trước khi gọi đệ quy và ghi lại chữ cũ ngay khi gọi xong. Cách này không tốn thêm bộ nhớ, nhưng quên bước ghi lại thì các lần tìm sau sẽ thấy một lưới đã hỏng.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-permutations-search|MISC-02]] và trang [[problems/word-search|Word Search]].
