---
title: "Smallest-First Grouping"
description: "Khi phải chia các lá bài thành những nhóm số liên tiếp, lá nhỏ nhất còn lại chỉ có thể là lá mở đầu một nhóm, nên mình mở nhóm ở đó mà không cần thử cách khác."
tags: [algorithms, neetcode, greedy]
type: note
region: Vùng Thuật toán
---

Lá nhỏ nhất còn lại không có lá nào nhỏ hơn đứng trước nó, nên nó không thể nằm giữa hay cuối một nhóm liên tiếp: nó buộc phải mở một nhóm `x, x + 1, …, x + k − 1`. Lựa chọn bị ép như vậy thì không cần thử lại, đó là lý do một [[concepts/greedy-choice|lựa chọn tham lam]] ở đây luôn an toàn. Mình sắp xếp các giá trị, đếm số lá của mỗi giá trị, rồi lặp lại: lấy giá trị nhỏ nhất còn lá, trừ đi một nhóm, và thất bại ngay khi thiếu một giá trị ở giữa.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-greedy-grouping|MISC-04]].
