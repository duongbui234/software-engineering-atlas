---
title: "Binary Tree"
description: "Cấu trúc mà mỗi nút có tối đa hai con, trái và phải; bài toán trên cả cây thường tách thành cùng bài toán trên hai cây con."
tags: ["algorithms", "tree"]
type: note
region: Vùng Thuật toán
---

**Cây nhị phân** là một nút gốc, mỗi nút giữ một giá trị và hai con trỏ `left`, `right`, mỗi con trỏ hoặc trỏ tới một cây nhị phân nhỏ hơn hoặc rỗng (`null`). Nút không có con nào là **lá**. **Chiều cao** là số nút trên đường dài nhất từ gốc xuống một lá: cây rỗng cao 0, một nút cao 1. Có hai trường hợp đặc biệt: cây **cân bằng**, cao khoảng log₂ n, và cây **lệch** (mỗi nút chỉ có một con), thực chất là một [[concepts/linked-list|danh sách liên kết]] cao n.

Chính định nghĩa đã đệ quy: một cây là gốc cộng hai cây con. Vì vậy hầu hết bài trên cây có dạng "giải cho cây con trái, giải cho cây con phải, ghép lại ở gốc", tức [[concepts/post-order-traversal|duyệt hậu thứ tự]]. Độ sâu đệ quy bằng chiều cao, nên cây lệch là chỗ đệ quy dễ vỡ nhất. Xem [[concepts/recursion-depth-limit|Recursion Depth Limit]].

LeetCode ghi cây bằng mảng theo tầng: `[1, null, 2]` là gốc 1, không có con trái, con phải là 2.

Đọc thêm trong bài [[posts/2026-11-25-neetcode-tree-recursion|ga 3: Đệ quy trên cây]].
