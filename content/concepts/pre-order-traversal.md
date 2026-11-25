---
title: "Pre-order Traversal"
description: "Xử lý nút trước, rồi mới đi xuống hai cây con: thứ tự để cha trao thông tin cho con trước khi con được thăm."
tags: ["algorithms", "tree", "recursion"]
type: note
region: Vùng Thuật toán
---

**Tiền thứ tự (pre-order)** xử lý nút trước hai con: nút, cây con trái, cây con phải. Nó là chiều ngược của [[concepts/post-order-traversal|hậu thứ tự]]: hậu thứ tự để con trả kết quả **lên** cha, còn tiền thứ tự để cha trao thông tin **xuống** con, qua tham số của lời gọi đệ quy. Khoảng (lo, hi) của [[concepts/bounds-propagation|Bounds Propagation]] và giá trị lớn nhất trên đường đi của [[concepts/path-state|Path State]] đều đi xuống theo cách này.

Kèm thêm độ sâu làm tham số, tiền thứ tự cũng dựng lại được từng tầng như [[concepts/breadth-first-search|BFS]]: nút ở độ sâu d vào danh sách thứ d, và vì trái đi trước phải nên thứ tự trong tầng vẫn đúng. Đi phải trước thì nút đầu tiên chạm mỗi độ sâu là nút phải nhất của tầng đó.

Không đệ quy, tiền thứ tự dùng một [[concepts/stack|ngăn xếp]]: lấy nút ra, xử lý, đẩy con phải rồi con trái (để con trái ra trước). Thông tin mang xuống được đẩy kèm nút thành một cặp. Bản này chịu được cây lệch sâu mà đệ quy không chịu nổi (xem [[concepts/recursion-depth-limit|Recursion Depth Limit]]).

Đọc thêm trong bài [[posts/2026-11-25-neetcode-level-order|ga 5: Duyệt theo tầng và mang trạng thái]].
