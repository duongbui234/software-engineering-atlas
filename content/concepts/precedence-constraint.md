---
title: "Precedence Constraint"
description: 'Một luật "x phải đứng trước y", rút ra từ dữ liệu rồi biến thành một cạnh có hướng.'
tags: [algorithms, graph, topological-sort]
type: note
region: Vùng Thuật toán
---

Một **ràng buộc thứ tự** nói `x` phải đứng trước `y`. Có bài cho sẵn (môn tiên quyết), có bài phải tự rút ra: trong Alien Dictionary, hai từ kề nhau trong danh sách đã sắp xếp chỉ cho đúng một ràng buộc, ở chữ cái khác nhau đầu tiên. Chữ phía sau không nói gì thêm.

Mỗi ràng buộc là một cạnh `x → y`; gom hết lại rồi chạy [[concepts/topological-sort|sắp xếp topo]]. Hai bẫy: từ dài đứng trước chính tiền tố của nó (`abc` trước `ab`) là dữ liệu mâu thuẫn, và chữ không xuất hiện trong ràng buộc nào vẫn phải có mặt trong kết quả.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-topological-sort|ga 3: Sắp xếp topo]].
