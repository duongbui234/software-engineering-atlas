---
title: "Downward Path Gain"
description: "Tổng tốt nhất của đường bắt đầu ngay tại một nút và chỉ đi xuống một nhánh."
tags: [algorithms, tree, neetcode]
type: note
region: Vùng Thuật toán
---

**Tổng nhánh đi xuống** là thông tin mình có thể gửi từ một nút lên cha để nối dài đường đi. Với tổng trọng số, nút luôn tính giá trị của chính nó, rồi cộng tối đa một nhánh con có tổng dương. Trong [[concepts/post-order-traversal|hậu thứ tự]], mình lấy các tổng từ con để thử một đường qua cả hai nhánh, nhưng chỉ trả nhánh nối được lên cha.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-tree-reconstruction|ga 6: Dựng và mã hóa cây]].
