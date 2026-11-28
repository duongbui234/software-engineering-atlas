---
title: "Open Count Range"
description: "Thay vì thử mọi cách hiểu ký tự đại diện, mình giữ khoảng [lo, hi] các số ngoặc mở còn chờ đóng có thể xảy ra; vì tập này luôn liền một đoạn, hai con số là đủ."
tags: [algorithms, neetcode, greedy]
type: note
region: Vùng Thuật toán
---

Mỗi `(` cộng 1, mỗi `)` trừ 1, còn `*` có thể là `(`, `)` hoặc rỗng nên cộng, trừ hoặc giữ nguyên. Tập các số ngoặc mở có thể có sau mỗi ký tự luôn là một đoạn liền, nên mình chỉ giữ hai đầu: `lo` (đoán ít ngoặc mở nhất) và `hi` (nhiều nhất). Nếu `hi < 0` thì có quá nhiều `)`, hỏng ngay. `lo` không được âm vì số ngoặc mở không âm, nên mình kẹp về 0. Cuối chuỗi, `lo == 0` nghĩa là có một cách hiểu đóng hết mọi ngoặc.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-greedy-grouping|MISC-04]].
