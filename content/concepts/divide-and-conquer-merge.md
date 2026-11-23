---
title: "Divide-and-Conquer Merge"
description: "Gộp k dãy đã sắp bằng cách trộn từng cặp, mỗi vòng số dãy giảm một nửa: log k vòng, mỗi vòng đi qua mọi phần tử một lần, O(N log k) mà không cần heap."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

Có k dãy đã sắp, tổng N phần tử. Trộn lần lượt vào một kết quả chung tốn O(N · k), vì kết quả dài dần và các phần tử đầu bị đi qua lại k lần. **Trộn chia để trị** trộn theo kiểu vòng đấu loại: vòng 1 trộn dãy 0 với 1, 2 với 3, …; vòng sau trộn các kết quả với nhau, cho tới khi còn một. Có ⌈log₂ k⌉ vòng, mỗi vòng đi qua mọi phần tử đúng một lần, nên tổng O(N log k), bằng cách dùng [[concepts/heap|heap]] trong [[concepts/k-way-merge|trộn k đường]] nhưng chỉ cần hàm trộn hai dãy. Đây cũng là bước "trộn" của merge sort, chạy từ dưới lên.

Dùng ở [[problems/merge-k-sorted-lists|Merge k Sorted Lists]]: với 1 000 danh sách × 100 nút, trộn từng cặp mất 8,3 ms, trộn lần lượt 287,1 ms. Heap hợp hơn khi các dãy đến dần như luồng, hoặc khi chỉ cần vài phần tử nhỏ nhất đầu tiên.

Đọc thêm trong bài [[posts/2026-11-24-neetcode-advanced-linked-list|Danh sách liên kết nâng cao]].
