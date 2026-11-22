---
title: "Aggregate Analysis"
description: "Đếm tổng số bước của cả thuật toán thay vì nhân số vòng lặp với số bước tệ nhất của mỗi vòng."
tags: ["algorithms", "complexity"]
type: note
region: Vùng Thuật toán
---

**Phân tích gộp** hỏi "cả thuật toán làm tổng cộng bao nhiêu bước?" thay vì "vòng ngoài n lần, mỗi lần vòng trong tệ nhất n bước". Khi mỗi phần tử chỉ có thể bị xử lý một số lần cố định trên **toàn bộ** thuật toán, tổng công là O(n) dù code có vòng lặp lồng nhau. Đây cũng là cách chứng minh [[concepts/amortized-o1|Amortized O(1)]]: tổng chi phí của n thao tác chia cho n.

Đọc thêm trong bài [[problems/longest-consecutive-sequence|Longest Consecutive Sequence]].
