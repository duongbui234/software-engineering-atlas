---
title: "Sentinel Value"
description: "Một phần tử giả thêm vào đầu hay cuối dữ liệu để vòng lặp khỏi cần xử lý riêng ca biên."
tags: ["algorithms", "stack"]
type: note
region: Vùng Thuật toán
---

Ở Largest Rectangle in Histogram, thêm một cột cao 0 vào cuối: nó thấp hơn mọi cột, nên dọn sạch [[concepts/monotonic-stack|ngăn xếp đơn điệu]] và tính diện tích những cột còn lại mà không cần vòng lặp riêng. Cùng ý: nút giả ở đầu danh sách liên kết, hay `Infinity` làm giá trị khởi đầu của một phép tìm min. Điều kiện: phần tử canh phải không bao giờ là đáp án hợp lệ, hoặc là đáp án không làm sai kết quả.

Đọc thêm trong bài [[posts/2026-11-23-neetcode-monotonic-stack|ga 7: Ngăn xếp đơn điệu]].
