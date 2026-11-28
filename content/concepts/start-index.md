---
title: "Start Index"
description: "Chỉ cho lượt sau chọn từ vị trí start trở đi, để mỗi tổ hợp chỉ được dựng theo một thứ tự duy nhất."
tags: [algorithms, neetcode, backtracking]
type: note
region: Vùng Thuật toán
---

Tổ hợp `[1, 2]` và `[2, 1]` là một. Để không dựng nó hai lần, mình chỉ cho lượt sau chọn các phần tử đứng sau phần tử vừa chọn. Truyền `i + 1` khi mỗi phần tử chỉ được dùng một lần, truyền `i` khi được dùng lại (Combination Sum). Hoán vị thì ngược lại: không dùng start, mà đánh dấu phần tử đã dùng.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-subsets-combinations|MISC-01]] và trang [[problems/combination-sum|Combination Sum]].
