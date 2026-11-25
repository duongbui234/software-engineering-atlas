---
title: "Path State"
description: "Một giá trị tóm tắt cả đường đi từ gốc tới nút hiện tại, như giá trị lớn nhất đã gặp, được mang xuống cùng nút thay vì giữ lại cả đường."
tags: ["algorithms", "tree", "recursion"]
type: note
region: Vùng Thuật toán
---

Nhiều câu hỏi trên cây là câu hỏi về **đường từ gốc tới nút**: nút này có lớn hơn hoặc bằng mọi tổ tiên không, tổng trên đường là bao nhiêu, đường đã đi qua giá trị nào. Cách thẳng là giữ cả đường và quét lại ở mỗi nút, tốn O(n·h). **Trạng thái đường đi** là một giá trị đủ để trả lời câu hỏi đó, được cập nhật ở mỗi bước xuống: với Count Good Nodes là giá trị lớn nhất đã gặp, nên một phép so là đủ và tổng chi phí còn O(n).

Trạng thái đi cùng nút. Trong đệ quy [[concepts/pre-order-traversal|tiền thứ tự]] nó là tham số; trong vòng lặp nó là phần tử thứ hai của cặp (nút, trạng thái) trên ngăn xếp hay trong hàng đợi. Vì mỗi lời gọi có bản riêng, nhánh trái cập nhật trạng thái không làm hỏng nhánh phải.

Bẫy hay gặp là chỉ so với cha, tức lấy trạng thái chỉ dài một bước: trên 300 cây ngẫu nhiên của ga, cách đó đếm sai 255 cây. [[concepts/bounds-propagation|Bounds Propagation]] là một trạng thái đường đi khác, gồm hai số.

Đọc thêm trong bài [[posts/2026-11-25-neetcode-level-order|ga 5: Duyệt theo tầng và mang trạng thái]].
