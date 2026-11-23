---
title: "Lower Bound"
description: "Vị trí đầu tiên có giá trị >= target trong một mảng đã sắp (bisect_left, std::lower_bound, sort.Search); cũng là chỗ chèn target để mảng vẫn sắp."
tags: ["algorithms", "binary-search"]
type: note
region: Vùng Thuật toán
---

[[concepts/binary-search|Tìm kiếm nhị phân]] không dừng sớm: trên [[concepts/half-open-interval|khoảng nửa mở]] `[lo, hi)`, gặp `nums[mid] < target` thì `lo = mid + 1`, ngược lại `hi = mid` (giữ `mid` vì nó có thể là đáp án). Bất biến: mọi ô trước `lo` nhỏ hơn `target`, mọi ô từ `hi` trở đi lớn hơn hoặc bằng. Khi `lo == hi` đó là ranh giới, có thể bằng `n`. Cận trên (`bisect_right`, `upper_bound`) là vị trí đầu tiên `> target`; hiệu hai cận là số lần `target` xuất hiện. Java `Arrays.binarySearch` trả `-(vị trí chèn) − 1` khi không thấy, và không bảo đảm trả ô đầu khi có trùng.

Đọc thêm trong bài [[problems/binary-search|Binary Search (LC 704)]] và [[posts/2026-11-23-neetcode-binary-search|ga 1: Tìm kiếm nhị phân trên mảng]].
