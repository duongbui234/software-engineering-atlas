---
title: "Bucket Sort"
description: "Xếp phần tử vào các ô theo chính giá trị của chúng, không dùng phép so sánh."
tags: ["algorithms", "sorting"]
type: note
region: Vùng Thuật toán
---

Trong Top K Frequent, tần suất luôn từ 1 tới n, nên tạo n+1 ô và bỏ mỗi giá trị vào ô `buckets[tần suất]`: O(n), vượt giới hạn O(n log n) của sắp xếp so sánh. Nhưng **bucket sort** cấp phát đủ n+1 ô bất kể có bao nhiêu giá trị khác nhau; với một triệu số và chỉ 1 000 giá trị khác nhau, nó là cách chậm nhất trong phép đo.

Đọc thêm trong bài [[2026-11-22-neetcode-top-k-frequent|Top K Frequent Elements]].
