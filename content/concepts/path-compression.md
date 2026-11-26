---
title: "Path Compression"
description: "Rút ngắn đường tìm gốc trong cây đại diện của DSU."
tags: [algorithms, neetcode, graph, union-find]
type: note
region: Vùng Thuật toán
---

Khi đi tìm gốc DSU, mình đổi con trỏ trên đường đi để lần sau tra nhanh hơn. Bản halving của ga nối nút hiện tại tới ông của nó rồi bước lên ông. Các nút vẫn dẫn đến cùng gốc, nên nhóm không đổi.

Đọc thêm trong bài [[posts/2026-11-27-neetcode-union-find|Union-Find]].
