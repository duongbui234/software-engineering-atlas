---
title: "Loop Invariant"
description: "Một câu luôn đúng trước và sau mỗi vòng lặp; viết nó ra trước thì điều kiện lặp, cách cập nhật biến và ý nghĩa lúc thoát đều suy ra được."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

Bất biến được dùng theo ba bước: nó đúng lúc khởi tạo, mỗi vòng giữ nó đúng, và khi vòng lặp dừng thì nó cộng với điều kiện dừng cho ra kết quả cần chứng minh. Với [[concepts/binary-search|tìm kiếm nhị phân]], bất biến là "nếu `target` có mặt thì nó nằm trong `[lo, hi]`": khởi tạo `lo = 0, hi = n − 1` làm nó đúng; `lo = mid + 1` giữ nó vì mọi ô đã bỏ đều nhỏ hơn `target`; thoát với khoảng rỗng nghĩa là `target` không có mặt. Viết code bằng cách đổi `<` thành `<=` cho tới khi qua test là dấu hiệu chưa có bất biến. Cùng ý đã có ở [[concepts/window-invariant|bất biến cửa sổ]] của cửa sổ trượt.

Đọc thêm trong bài [[posts/2026-11-23-neetcode-binary-search|ga 1: Tìm kiếm nhị phân trên mảng]].
