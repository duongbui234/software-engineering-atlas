---
title: "Sift Up and Sift Down"
description: "Hai thao tác giữ tính chất heap: phần tử mới nổi lên bằng cách đổi với cha, đỉnh mới chìm xuống bằng cách đổi với con nhỏ hơn; mỗi thao tác đi tối đa một đường từ lá tới gốc, O(log n)."
tags: ["algorithms", "data-structures"]
type: note
region: Vùng Thuật toán
---

Trong một min-heap lưu trên mảng, cha của ô i là ô `(i − 1) >> 1`, hai con là `2i + 1` và `2i + 2`. **Nổi lên (sift up)** dùng khi thêm: đặt phần tử mới ở cuối mảng, rồi còn nhỏ hơn cha thì đổi chỗ với cha. **Chìm xuống (sift down)** dùng khi lấy đỉnh: đưa phần tử cuối lên ô 0, rồi còn lớn hơn con nhỏ hơn thì đổi chỗ với con đó. Phải chọn con **nhỏ hơn**: đổi với con lớn hơn sẽ đặt con lớn lên trên con nhỏ, phá tính chất heap. Cả hai thao tác đi tối đa chiều cao cây, ⌊log₂ n⌋ bước. Thay đỉnh bằng một số mới rồi cho chìm một lần (`heapq.heapreplace` trong Python, `heap.Fix(h, 0)` trong Go) rẻ hơn lấy đỉnh rồi thêm, vì chỉ đi một đường.

Đọc thêm trong bài [[posts/2026-11-23-neetcode-heap-top-k|Heap và top K]] và [[problems/kth-largest-element-in-a-stream|Kth Largest Element in a Stream (LC 703)]].
