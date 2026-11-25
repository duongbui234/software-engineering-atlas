---
title: "Bounds Propagation"
description: "Truyền một khoảng (lo, hi) từ gốc xuống: mỗi lần rẽ trái hạ cận trên, mỗi lần rẽ phải nâng cận dưới, để mỗi nút được kiểm với ràng buộc của mọi tổ tiên chỉ bằng một phép so."
tags: ["algorithms", "tree", "binary-search-tree"]
type: note
region: Vùng Thuật toán
---

**Mang khoảng xuống** là cách gom ràng buộc của mọi tổ tiên vào hai con số. Gốc nhận khoảng mở (−∞, +∞). Đi sang con trái của nút giá trị v thì cận trên thành v; sang con phải thì cận dưới thành v. Một nút hợp lệ khi giá trị của nó nằm ngặt trong khoảng nó nhận được.

Đây là cách đúng để kiểm một [[concepts/binary-search-tree|cây nhị phân tìm kiếm]]. Chỉ so nút với cha thì bỏ sót nút nằm sâu vi phạm một tổ tiên xa hơn: trong file của ga, cách đó nhận nhầm 66 trên 238 cây hỏng. Khoảng là thông tin chảy **từ trên xuống**, ngược với chiều cao chảy từ dưới lên trong [[concepts/post-order-traversal|hậu thứ tự]].

Bẫy hay gặp là chọn "vô cực": dùng giá trị nhỏ nhất, lớn nhất của int 32 bit làm cận thì một nút có đúng giá trị đó bị chấm sai. Dùng kiểu rộng hơn (long), số thực vô cực, hoặc null nghĩa là "không có cận".

Đọc thêm trong bài [[posts/2026-11-25-neetcode-binary-search-tree|ga 4: Cây nhị phân tìm kiếm]].
