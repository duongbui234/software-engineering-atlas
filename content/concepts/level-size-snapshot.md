---
title: "Level Size Snapshot"
description: "Đầu mỗi vòng BFS, ghi lại hàng đợi đang có bao nhiêu nút: đúng bấy nhiêu nút là một tầng, con của chúng đi vào tầng sau."
tags: ["algorithms", "tree", "bfs"]
type: note
region: Vùng Thuật toán
---

Trong [[concepts/breadth-first-search|BFS]] trên cây, con của một tầng được đẩy vào cùng hàng đợi, ngay sau những nút còn chờ của tầng đó. Không có gì trong hàng đợi đánh dấu chỗ hết tầng. **Chụp kích thước tầng** là cách tạo ranh giới: đầu mỗi vòng, đọc `size` bằng độ dài hàng đợi, rồi lấy ra đúng `size` nút. Những nút đó là trọn một tầng; mọi thứ đẩy vào trong lúc lấy thuộc tầng sau.

Bẫy là để điều kiện vòng lặp đọc lại độ dài hàng đợi mỗi lần (`i < queue.length` trong JavaScript, Java hay Go). Độ dài tăng khi đẩy con vào, nên vòng lặp lấy luôn tầng sau và mọi nút dồn vào một tầng: trên 300 cây ngẫu nhiên của ga, bản không chụp sai 294 cây. Python `for _ in range(len(q))` tự chụp, vì `range` được tính một lần.

Có `size` trong tay thì biết nút nào đứng đầu tầng (i = 0) và nút nào đứng cuối (i = size − 1). Nút cuối mỗi tầng là cái nhìn từ bên phải của cây.

Đọc thêm trong bài [[posts/2026-11-25-neetcode-level-order|ga 5: Duyệt theo tầng và mang trạng thái]].
