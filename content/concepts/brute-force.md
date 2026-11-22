---
title: "Brute Force"
description: "Thử mọi khả năng; thường đúng và dễ viết nhưng chậm."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

**Vét cạn** thử mọi khả năng, ví dụ so mọi cặp phần tử với nhau (n(n−1)/2 cặp, O(n²)). Nó là điểm xuất phát tốt: chứng minh bạn hiểu đề, cho một bản đúng để đối chiếu khi test cách nhanh hơn. Ở Contains Duplicate, vét cạn với 10 000 số mất 38 ms, còn 100 000 số sẽ mất vài giây.

Đọc thêm trong bài [[posts/2026-11-22-neetcode-contains-duplicate|Contains Duplicate]].
