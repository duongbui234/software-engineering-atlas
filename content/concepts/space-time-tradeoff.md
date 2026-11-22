---
title: "Space-Time Tradeoff"
description: "Dùng thêm bộ nhớ để giảm thời gian chạy, hoặc ngược lại."
tags: ["algorithms", "complexity"]
type: note
region: Vùng Thuật toán
---

**Đánh đổi bộ nhớ lấy thời gian**: hash set biến Contains Duplicate từ O(n log n) thành O(n), đổi lại tốn O(n) bộ nhớ cho các phần tử đã thấy. Khi bộ nhớ là ràng buộc chặt (dữ liệu lớn, máy ít RAM), cách chậm hơn nhưng làm tại chỗ có thể là lựa chọn đúng. Hầu hết các tối ưu trong nhóm Arrays & Hashing là một phép đổi như vậy.

Đọc thêm trong bài [[2026-11-22-neetcode-contains-duplicate|Contains Duplicate]].
