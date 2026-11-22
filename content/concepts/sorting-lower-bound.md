---
title: "Sorting Lower Bound"
description: "Mọi thuật toán sắp xếp chỉ dựa trên phép so sánh cần Ω(n log n) phép so sánh trong trường hợp tệ nhất."
tags: ["algorithms", "sorting", "complexity"]
type: note
region: Vùng Thuật toán
---

Có n! thứ tự có thể của n phần tử, mỗi phép so sánh chỉ chia đôi số khả năng, nên cần ít nhất log₂(n!) ≈ n log n phép. Đó là **giới hạn dưới của sắp xếp so sánh**. Thuật toán không so sánh, như bucket sort hay counting sort, thoát được giới hạn này khi khóa là số nguyên trong một khoảng nhỏ đã biết.

Đọc thêm trong bài [[posts/2026-11-22-neetcode-top-k-frequent|Top K Frequent Elements]].
