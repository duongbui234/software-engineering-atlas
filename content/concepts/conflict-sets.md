---
title: "Conflict Sets"
description: "Các tập ghi cột và đường chéo đã bị chiếm, để kiểm tra một ô có xung đột hay không trong O(1)."
tags: [algorithms, neetcode, backtracking]
type: note
region: Vùng Thuật toán
---

Khi đặt quân theo từng hàng, mình chỉ cần biết cột và hai đường chéo của ô định đặt đã có quân chưa. Mọi ô trên cùng một chéo chính có chung `r − c`, trên cùng một chéo phụ có chung `r + c`, nên ba tập (hoặc ba bitmask) trả lời ngay. Đặt quân thì thêm vào cả ba tập, quay lui thì gỡ khỏi cả ba.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-permutations-search|MISC-02]] và trang [[problems/n-queens|N-Queens]].
