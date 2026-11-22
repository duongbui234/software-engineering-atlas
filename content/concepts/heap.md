---
title: "Heap"
description: "Cây nhị phân lưu trong mảng, phần tử nhỏ nhất (hoặc lớn nhất) luôn ở đỉnh; thêm và lấy đỉnh O(log n)."
tags: ["algorithms", "data-structures"]
type: note
region: Vùng Thuật toán
---

Một **heap** lưu cha ở vị trí i và hai con ở 2i+1, 2i+2. Thêm thì nổi lên, lấy đỉnh thì chìm xuống, mỗi thao tác O(log n). Để lấy top k lớn nhất, giữ một min-heap k chỗ: đỉnh là ứng viên yếu nhất, bị đẩy ra khi có ứng viên mạnh hơn. Python có `heapq`, Go có `container/heap`, Java có `PriorityQueue`; JS không có sẵn.

Đọc thêm trong bài [[posts/2026-11-22-neetcode-top-k-frequent|Top K Frequent Elements]].
