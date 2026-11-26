---
title: "Implicit Graph"
description: "Đồ thị không được ghi sẵn: hàng xóm của một đỉnh được sinh ra theo một luật khi cần."
tags: [algorithms, graph, bfs]
type: note
region: Vùng Thuật toán
---

Một **đồ thị ẩn** không có [[concepts/adjacency-list|danh sách kề]] nào được đưa sẵn. Mình chỉ biết luật: trong Word Ladder, hai từ là hàng xóm nếu khác nhau đúng một chữ và từ mới có trong danh sách. BFS vẫn chạy như thường, chỉ có hàm "hàng xóm của x" phải tự sinh kết quả.

Cách sinh quyết định chi phí. So x với mọi từ tốn N phép so cho mỗi đỉnh. Gom từ vào các xô theo mẫu (`c*rd`) hoặc thử thay từng chữ rồi tra trong một tập thì nhanh hơn nhiều khi danh sách lớn. Bàn cờ, ổ khóa số và trạng thái của một trò chơi cũng là đồ thị ẩn.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-graph-bfs|ga 2: Duyệt đồ thị và BFS]].
