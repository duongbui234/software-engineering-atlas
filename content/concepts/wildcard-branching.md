---
title: "Wildcard Branching"
description: "Thử nhiều cạnh con của trie khi một ký tự trong mẫu có nhiều cách khớp."
tags: [algorithms, tree, trie]
type: note
region: Vùng Thuật toán
---

Trong truy vấn với dấu `.` khớp một ký tự, mình thử từng cạnh đang có trong [[concepts/trie|trie]], mỗi lần tăng chỉ số mẫu đúng một. Điều kiện dừng thành công là hết mẫu ở nút có [[concepts/terminal-marker|dấu hết từ]]. Lượng công việc phụ thuộc số cạnh thật sự đã thử, nhất là khi một dấu chấm xuất hiện gần gốc.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-trie|ga 7: Trie]].
