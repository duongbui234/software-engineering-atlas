---
title: "Post-order Traversal"
description: "Thăm hai cây con trước, rồi mới xử lý nút: cách duy nhất để một nút dùng được kết quả đã tính xong của các con."
tags: ["algorithms", "tree", "recursion"]
type: note
region: Vùng Thuật toán
---

Có ba thứ tự duyệt theo chiều sâu trên [[concepts/binary-tree|cây nhị phân]], khác nhau ở lúc xử lý nút: trước hai con (pre-order), giữa hai con (in-order), hay **sau hai con (post-order, hậu thứ tự)**. Hậu thứ tự là thứ tự "từ dưới lên": khi tới lượt một nút, chiều cao, tổng hay trạng thái của hai cây con đã có sẵn, nên nút chỉ việc ghép chúng lại.

Mẫu hay gặp là hàm đệ quy **trả về một đại lượng** cho cha (chiều cao) và **ghi một đại lượng khác** vào biến ngoài (đường kính tốt nhất). Khi đại lượng trả về cần mang thêm tin "đã hỏng", một [[concepts/sentinel-value|giá trị canh]] như -1 làm việc đó mà không cần trả hai giá trị.

Không đệ quy thì hậu thứ tự cần một [[concepts/stack|ngăn xếp]] tự quản lý, mỗi nút được đẩy hai lần: lần đầu để đẩy hai con, lần sau (có cờ "đã thăm con") để tính chính nó.

Đọc thêm trong bài [[posts/2026-11-25-neetcode-tree-recursion|ga 3: Đệ quy trên cây]].

Đọc thêm trong bài [[posts/2026-11-26-neetcode-tree-reconstruction|ga 6: Dựng và mã hóa cây]].
