---
title: "Binary Search"
description: "Tìm trong một khoảng có thứ tự bằng cách nhìn phần tử giữa và bỏ hẳn một nửa sau mỗi lần nhìn; n phần tử chỉ cần khoảng log₂ n lần nhìn."
tags: ["algorithms", "binary-search"]
type: note
region: Vùng Thuật toán
---

Giữ một khoảng còn nghi `[lo, hi]`. Mỗi vòng nhìn `mid`, hỏi một câu có/không, và bỏ nửa chắc chắn không chứa đáp án. Sau k vòng khoảng còn khoảng n / 2ᵏ ô, nên tổng là O(log n): 20 lần nhìn cho 10⁶ phần tử. Điều kiện cần không hẳn là "mảng đã sắp" mà là câu hỏi có đáp án đổi chiều đúng một lần dọc theo khoảng; nhờ vậy nó chạy được trên mảng xoay. Viết đúng nhờ một [[concepts/loop-invariant|bất biến vòng lặp]] và một [[concepts/half-open-interval|quy ước khoảng]] giữ nhất quán; tính `mid` cẩn thận để tránh [[concepts/midpoint-overflow|tràn điểm giữa]]. Biến thể không dừng sớm là [[concepts/lower-bound|cận dưới]]. Đây là dạng mạnh nhất của [[concepts/search-space-pruning|cắt tỉa không gian tìm kiếm]].

Đọc thêm trong bài [[posts/2026-11-23-neetcode-binary-search|ga 1: Tìm kiếm nhị phân trên mảng]].
