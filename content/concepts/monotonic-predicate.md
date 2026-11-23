---
title: "Monotonic Predicate"
description: "Một câu hỏi có/không p(k) mà đã đúng ở k thì đúng ở mọi giá trị lớn hơn: dọc theo khoảng, đáp án đổi từ sai sang đúng đúng một lần, nên tìm nhị phân được ranh giới."
tags: ["algorithms", "binary-search"]
type: note
region: Vùng Thuật toán
---

Vị từ (predicate) là một hàm trả đúng hoặc sai. Nó **đơn điệu** khi p(k) đúng kéo theo p(k + 1) đúng: dãy p(lo), p(lo + 1), …, p(hi) có dạng sai…sai đúng…đúng. Đây là điều kiện thật sự của [[concepts/binary-search|tìm kiếm nhị phân]], rộng hơn "mảng đã sắp": mảng tăng dần cho vị từ `nums[i] >= target`, mảng xoay cho `nums[i] <= nums[n − 1]`, bài Koko cho "tốc độ k ăn kịp trong h giờ". Thư viện chuẩn nhận thẳng vị từ: Go `sort.Search(n, f)`, Python `bisect_left(range, True, key=f)` (3.10+), C++ `std::partition_point`, Rust `partition_point`. Nếu vị từ đổi chiều hơn một lần, tìm nhị phân vẫn chạy và trả **một** ranh giới, không báo lỗi, nên phải chứng minh tính đơn điệu trước.

Đọc thêm trong bài [[problems/koko-eating-bananas|Koko Eating Bananas (LC 875)]] và [[posts/2026-11-23-neetcode-binary-search-answer|ga 2: Tìm kiếm nhị phân trên đáp án]].
