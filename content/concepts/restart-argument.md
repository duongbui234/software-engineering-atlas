---
title: "Restart Argument"
description: "Lập luận rằng khi một đoạn chạy từ start thất bại tại i, mọi điểm xuất phát giữa start và i cũng thất bại, nên có thể nhảy thẳng tới i + 1."
tags: [algorithms, neetcode, greedy]
type: note
region: Vùng Thuật toán
---

Đi từ `start`, mình cộng dồn và tổng bị âm lần đầu tại `i`. Mọi điểm `k` nằm giữa `start` và `i` đều có phần tiền tố `[start, k)` không âm, vì trước `i` tổng chưa từng âm. Bỏ phần không âm đó đi thì tổng từ `k` tới `i` chỉ có thể nhỏ hơn hoặc bằng, nên cũng âm. Vì vậy mình bỏ qua cả đoạn và bắt đầu lại ở `i + 1`. Đây là lý do [[concepts/kadane-algorithm|Kadane]] và bài [[problems/gas-station|Gas Station]] chỉ cần một lượt.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-greedy-array|MISC-03]].
