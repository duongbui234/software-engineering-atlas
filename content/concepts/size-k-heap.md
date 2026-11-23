---
title: "Size-K Heap"
description: "Để giữ k phần tử lớn nhất của một luồng, dùng min-heap không quá k chỗ: đỉnh là ứng viên yếu nhất và cũng là số lớn thứ k; mỗi phần tử tốn O(log k), bộ nhớ O(k)."
tags: ["algorithms", "data-structures"]
type: note
region: Vùng Thuật toán
---

Muốn k số **lớn** nhất thì dùng heap **nhỏ** (min-heap), nghe ngược nhưng đúng: heap giữ k ứng viên tốt nhất đã thấy, và câu hỏi duy nhất mỗi khi có số mới là "nó có mạnh hơn ứng viên **yếu nhất** không?". Ứng viên yếu nhất phải nằm ở đỉnh để so trong O(1), nên là min-heap. Mạnh hơn thì thay đỉnh và cho chìm, O(log k); yếu hơn thì bỏ. Bộ nhớ chỉ k ô dù luồng dài bao nhiêu, và đỉnh lúc nào cũng là số lớn thứ k. Muốn k phần tử **nhỏ** nhất (k điểm gần gốc nhất) thì đảo lại: max-heap k chỗ, đỉnh là ứng viên xa nhất. Lỗi hay gặp là chọn nhầm chiều heap, khi đó heap giữ k số nhỏ nhất, hoặc quên bỏ bớt khi heap quá k, khi đó đỉnh là số nhỏ nhất của cả luồng.

Đọc thêm trong bài [[posts/2026-11-23-neetcode-heap-top-k|Heap và top K]], [[problems/kth-largest-element-in-a-stream|Kth Largest Element in a Stream (LC 703)]] và [[problems/kth-largest-element-in-an-array|Kth Largest Element in an Array (LC 215)]].
