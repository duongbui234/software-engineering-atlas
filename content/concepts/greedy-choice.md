---
title: "Greedy Choice"
description: "Ở mỗi bước chọn phương án tốt nhất trước mắt và không bao giờ quay lại, chỉ đúng khi có lập luận chứng minh lựa chọn đó không làm mất đáp án tối ưu."
tags: [algorithms, neetcode, greedy]
type: note
region: Vùng Thuật toán
---

Tham lam nghĩa là ở mỗi bước mình chọn cái tốt nhất trước mắt rồi đi tiếp, không thử lại lựa chọn cũ như [[concepts/backtracking|quay lui]]. Nó chạy nhanh vì chỉ đi một lượt, nhưng chỉ đúng khi có lập luận rằng lựa chọn cục bộ không bao giờ loại mất đáp án tốt nhất. Ví dụ đổi tiền với mệnh giá {1, 3, 4} cho 6 đồng: tham lam lấy 4 + 1 + 1 (ba đồng), trong khi 3 + 3 chỉ cần hai, nên bài [[problems/coin-change|Coin Change]] phải dùng DP.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-greedy-array|MISC-03]].
