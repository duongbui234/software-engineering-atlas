---
title: "Node Interleaving"
description: "Chèn bản sao của mỗi nút ngay sau nút gốc, để \"bản sao của X\" luôn là X.next; nhờ vậy chép được các con trỏ phụ mà không cần bảng băm, rồi tách hai danh sách ra."
tags: ["algorithms", "data-structures"]
type: note
region: Vùng Thuật toán
---

Khi chép một [[concepts/linked-list|danh sách liên kết]] mà mỗi nút còn có con trỏ phụ (như `random` trỏ tới một nút bất kỳ), khó khăn là tìm "bản sao của nút X" khi X chưa được chép hoặc nằm ở đâu đó xa. Cách thẳng là một [[concepts/hash-map|hash map]] nút gốc → bản sao, tốn O(n) bộ nhớ. **Đan xen** mượn chính danh sách làm bảng tra: lượt 1 chèn `X'` ngay sau mỗi `X` (`A → A' → B → B' → …`); lượt 2 gán `X'.random = X.random.next`, vì bản sao của mọi nút đứng ngay sau nó; lượt 3 tách hai danh sách và trả `next` của các nút gốc về như cũ. Ba lượt O(n), O(1) bộ nhớ ngoài các nút mới.

Dùng ở [[problems/copy-list-with-random-pointer|Copy List with Random Pointer]]. Bước tách hay bị làm dở: phải sửa `next` của cả nút gốc lẫn bản sao, nếu không danh sách gốc vẫn dính vào bản sao.

Đọc thêm trong bài [[posts/2026-11-24-neetcode-advanced-linked-list|Danh sách liên kết nâng cao]].
