---
title: "Connected Component"
description: "Tập đỉnh tối đa trong đồ thị vô hướng mà mọi cặp đỉnh nối được bằng một đường."
tags: [algorithms, graph, bfs]
type: note
region: Vùng Thuật toán
---

Một **thành phần liên thông** gồm tất cả đỉnh tới được từ bất kỳ mầm nào trong đó. Sau một lượt [[concepts/flood-fill|tô vùng]], mọi ô đã thăm thuộc cùng thành phần. Giữ các dấu khi quét tiếp để mầm chưa thăm luôn mở một thành phần mới.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-grid-traversal|ga 1: Duyệt lưới]].
