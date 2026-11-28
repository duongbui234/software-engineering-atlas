---
title: "Safe Candidate Filter"
description: "Loại mọi ứng viên vượt mục tiêu ở bất kỳ thành phần nào, vì dùng nó là hỏng ngay; trong các ứng viên còn lại, gộp tất cả chỉ có lợi chứ không bao giờ hại."
tags: [algorithms, neetcode, greedy]
type: note
region: Vùng Thuật toán
---

Phép gộp lấy max theo từng thành phần nên giá trị chỉ tăng chứ không giảm. Một ứng viên có thành phần lớn hơn mục tiêu thì gộp vào là vượt mục tiêu vĩnh viễn, nên mình bỏ nó. Những ứng viên còn lại không thể đẩy thành phần nào vượt mục tiêu, nên gộp hết chúng là cách tốt nhất: nếu tập an toàn đạt được mục tiêu ở cả ba thành phần thì đáp án là có, ngược lại không tổ hợp nào làm được.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-greedy-grouping|MISC-04]].
