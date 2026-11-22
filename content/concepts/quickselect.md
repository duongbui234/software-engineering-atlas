---
title: "Quickselect"
description: "Phân hoạch như quicksort nhưng chỉ đi tiếp vào một phía, để tìm phần tử thứ k trong O(n) trung bình."
tags: ["algorithms", "sorting"]
type: note
region: Vùng Thuật toán
---

**Quickselect** chọn chốt ngẫu nhiên, phân hoạch, rồi chỉ tiếp tục ở phía chứa vị trí k: trung bình m + m/2 + … ≈ 2m bước. Tệ nhất là O(m²). Khi rất nhiều giá trị bằng nhau, phân hoạch hai phần với `<` suy biến: phép đo cho 798 ms so với 228 ms của sắp xếp. Phân hoạch ba phần (nhỏ hơn, bằng, lớn hơn chốt) sửa được.

Đọc thêm trong bài [[posts/2026-11-22-neetcode-top-k-frequent|Top K Frequent Elements]].
