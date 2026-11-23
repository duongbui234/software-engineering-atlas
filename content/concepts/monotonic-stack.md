---
title: "Monotonic Stack"
description: "Ngăn xếp luôn tăng hoặc luôn giảm từ đáy lên đỉnh; phần tử mới phá thứ tự thì lấy đỉnh ra, và nó chính là câu trả lời đỉnh đang chờ."
tags: ["algorithms", "stack"]
type: note
region: Vùng Thuật toán
---

Giữ **chỉ số** các phần tử còn chờ câu trả lời. Với mỗi phần tử mới, chừng nào nó phá thứ tự với đỉnh thì `pop` đỉnh và ghi câu trả lời cho đỉnh, rồi `push` phần tử mới. Mỗi chỉ số vào một lần, ra tối đa một lần, nên tổng O(n) dù có `while` trong `for` ([[concepts/aggregate-analysis|Aggregate Analysis]]). Ngăn xếp giảm tìm [[concepts/next-greater-element|phần tử lớn hơn kế tiếp]]; ngăn xếp tăng tìm phần tử nhỏ hơn. Khi cần lấy cả ở đầu kia (cửa sổ trượt), dùng [[concepts/monotonic-deque|Monotonic Deque]].

Đọc thêm trong bài [[posts/2026-11-23-neetcode-monotonic-stack|ga 7: Ngăn xếp đơn điệu]].
