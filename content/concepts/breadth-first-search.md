---
title: "Breadth-First Search"
description: "Duyệt theo chiều rộng: thăm mọi nút cách điểm xuất phát một bước, rồi mọi nút cách hai bước, nhờ một hàng đợi vào trước ra trước."
tags: ["algorithms", "tree", "bfs"]
type: note
region: Vùng Thuật toán
---

**Duyệt theo chiều rộng (BFS)** đi từ điểm xuất phát ra ngoài theo từng vòng: hết các nút cách một bước mới tới các nút cách hai bước. Công cụ là một hàng đợi vào trước ra trước: lấy một nút ở đầu, đẩy các nút kề của nó vào cuối. Trên [[concepts/binary-tree|cây nhị phân]], "cách k bước" chính là "ở tầng k", nên BFS cho ra các nút theo thứ tự từng tầng, trái sang phải.

Mỗi nút vào và ra hàng đợi đúng một lần, nên BFS tốn O(n) thời gian. Bộ nhớ thêm là độ dài lớn nhất của hàng đợi, tức **tầng rộng nhất**: trên cây đầy đủ 2²⁰ − 1 nút, hàng đợi chạm 524 288 nút, trong khi duyệt theo chiều sâu chỉ cần nhớ 20 tầng. Ngược lại trên một chuỗi lệch, hàng đợi chỉ có 1 nút còn đệ quy sâu bằng cả chuỗi.

Lấy ra ở đầu phải tốn O(1). `shift()` của mảng JavaScript và `pop(0)` của list Python dịch cả mảng mỗi lần, nên trên cây lớn BFS thành O(n²); dùng chỉ số đầu hàng hoặc `collections.deque`. Muốn tách theo tầng thì cần thêm [[concepts/level-size-snapshot|chụp kích thước tầng]].

Đọc thêm trong bài [[posts/2026-11-25-neetcode-level-order|ga 5: Duyệt theo tầng và mang trạng thái]].
