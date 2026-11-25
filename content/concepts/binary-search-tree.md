---
title: "Binary Search Tree"
description: "Cây nhị phân mà mọi giá trị trong cây con trái nhỏ hơn nút, mọi giá trị trong cây con phải lớn hơn nút; mỗi lần so là bỏ hẳn một nhánh."
tags: ["algorithms", "tree", "binary-search-tree"]
type: note
region: Vùng Thuật toán
---

**Cây nhị phân tìm kiếm** (BST) là một [[concepts/binary-tree|cây nhị phân]] giữ một bất biến ở **mọi** nút: mọi giá trị trong cả cây con trái nhỏ hơn giá trị nút, mọi giá trị trong cả cây con phải lớn hơn. Chữ "cả cây con" là chỗ hay bị đọc sót: so nút với hai con trực tiếp là chưa đủ.

Nhờ bất biến đó, mỗi lần so ở một nút là bỏ hẳn một nhánh, giống [[concepts/binary-search|tìm kiếm nhị phân]] trên mảng đã sắp. Tìm, chèn, tìm [[concepts/lowest-common-ancestor|tổ tiên chung thấp nhất]] đều chỉ đi **một đường** từ gốc xuống, tốn O(h) với h là chiều cao. Cây cân bằng thì h ≈ log₂ n; cây chèn theo thứ tự tăng dần thì lệch thành một chuỗi, h = n. Thư viện chuẩn (TreeMap của Java, std::map của C++) dùng cây tự cân bằng như cây đỏ đen để giữ h ở mức log n.

Hệ quả thứ hai: [[concepts/in-order-traversal|duyệt trung thứ tự]] một BST cho ra các giá trị theo thứ tự tăng dần. Kiểm một cây có phải BST không thì dùng [[concepts/bounds-propagation|mang khoảng xuống]] hoặc kiểm dãy trung thứ tự tăng ngặt.

Đọc thêm trong bài [[posts/2026-11-25-neetcode-binary-search-tree|ga 4: Cây nhị phân tìm kiếm]].
