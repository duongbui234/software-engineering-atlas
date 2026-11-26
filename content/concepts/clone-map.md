---
title: "Clone Map"
description: "Bảng từ nút cũ sang bản sao của nó, vừa làm sổ đã thăm vừa cho biết nối cạnh vào đâu khi sao chép đồ thị."
tags: [algorithms, graph, bfs]
type: note
region: Vùng Thuật toán
---

Khi sao chép sâu một đồ thị, mình giữ một **bảng bản sao** `cũ → mới`. Lần đầu gặp một nút cũ, mình tạo bản sao, ghi vào bảng rồi mới đi tiếp từ nút đó. Mỗi lần đọc cạnh `u – v`, mình nối `copy[u]` với `copy[v]`.

Bảng làm hai việc cùng lúc. Nó là sổ đã thăm, nên trên đồ thị có vòng mình không đi lòng vòng mãi và không tạo hai bản sao cho một nút. Nó cũng trả lời "bản sao của v là nút nào", điều một tập đã thăm thông thường không làm được. Khóa của bảng phải là chính đối tượng nút, không phải giá trị của nó.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-graph-bfs|ga 2: Duyệt đồ thị và BFS]].
