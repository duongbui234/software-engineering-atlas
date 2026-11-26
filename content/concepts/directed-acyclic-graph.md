---
title: "Directed Acyclic Graph"
description: "Đồ thị có hướng không có vòng: đi theo chiều mũi tên thì không bao giờ quay lại chỗ cũ."
tags: [algorithms, graph, topological-sort]
type: note
region: Vùng Thuật toán
---

Một **DAG** (directed acyclic graph) là đồ thị mà mỗi cạnh có chiều, `u → v` đọc là "u phải xong trước v", và không có vòng nào. Môn tiên quyết, các bước build và thứ tự mặc đồ buổi sáng đều là DAG.

Không có vòng đúng là điều kiện để xếp được mọi đỉnh thành một hàng sao cho mọi mũi tên đều chỉ về phía sau, tức một [[concepts/topological-sort|thứ tự topo]]. Chỉ cần một vòng `a → b → a` là không xếp được nữa.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-topological-sort|ga 3: Sắp xếp topo]].
