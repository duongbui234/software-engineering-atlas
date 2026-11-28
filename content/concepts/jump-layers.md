---
title: "Jump Layers"
description: "Chia mảng thành các đoạn liên tiếp, mỗi đoạn là những ô tới được với đúng k lần nhảy; đếm số đoạn là đếm tầng BFS mà không cần hàng đợi."
tags: [algorithms, neetcode, greedy]
type: note
region: Vùng Thuật toán
---

Các ô tới được bằng 0 lần nhảy là `[0, 0]`, bằng 1 lần là đoạn ngay sau đó tới `farthest` của tầng trước, và cứ thế. Đây chính là [[concepts/breadth-first-search|BFS]] theo tầng, chỉ khác là mỗi tầng là một đoạn liền nên mình giữ hai số `end` và `farthest` thay cho hàng đợi. Khi `i` chạm `end` thì tầng hiện tại hết, mình cộng một lần nhảy và đặt `end = farthest`.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-greedy-array|MISC-03]].
