---
title: "Last Occurrence Boundary"
description: "Một phần của chuỗi phải kéo dài tới lần xuất hiện cuối của mọi chữ nằm trong nó; khi vị trí đang xét chạm mốc xa nhất đó, mình cắt được ngay."
tags: [algorithms, neetcode, greedy]
type: note
region: Vùng Thuật toán
---

Mình ghi trước vị trí xuất hiện cuối cùng của từng chữ. Đi từ trái sang phải, mỗi chữ gặp được đẩy mốc `end = max(end, last[c])`, vì phần hiện tại phải chứa hết chữ đó. Khi `i == end` thì không chữ nào trong phần này còn xuất hiện về sau, nên cắt ở đây là hợp lệ, và cắt sớm nhất có thể thì số phần là nhiều nhất. Cách nghĩ này giống [[concepts/farthest-reach|chỗ xa nhất]] ở ga trước: một con số thay cho cả tập ràng buộc.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-greedy-grouping|MISC-04]].
