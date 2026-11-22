---
title: "Sliding Window"
description: "Một đoạn liên tiếp [left, right] mà hai đầu chỉ tiến, để tìm đoạn tốt nhất trong O(n) thay vì thử O(n²) đoạn."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

**Cửa sổ trượt** giữ một đoạn liên tiếp `[left, right]`. Đầu phải thêm từng phần tử; đầu trái tiến khi cửa sổ phá [[concepts/window-invariant|bất biến]]. Vì không đầu nào lùi, mỗi phần tử vào và ra cửa sổ tối đa một lần: O(n). Khuôn này chỉ đúng khi bài có tính đơn điệu: đoạn hỏng thì mọi đoạn dài hơn chứa nó cũng hỏng. Tìm đoạn có tổng bằng k trên mảng có số âm thì không dùng được.

Đọc thêm trong bài [[posts/2026-11-23-neetcode-sliding-window|Cửa sổ trượt]].
