---
title: "Auxiliary Min Stack"
description: "Mỗi tầng ngăn xếp lưu kèm giá trị nhỏ nhất tính tới tầng đó, để getMin là O(1) cả sau khi pop."
tags: ["algorithms", "stack"]
type: note
region: Vùng Thuật toán
---

Một biến `min` duy nhất hỏng khi `pop` đúng phần tử nhỏ nhất: không biết min mới. Lưu cặp (giá trị, min tới tầng này), hoặc một ngăn xếp phụ chạy song song, thì sau mỗi `pop` tầng bên dưới đã có sẵn đáp án. Đổi gấp đôi bộ nhớ lấy O(1) cho mọi thao tác. Cùng ý áp dụng cho max, hay bất kỳ phép kết hợp nào. Xem [[concepts/stack|Stack]].

Đọc thêm trong bài [[posts/2026-11-23-neetcode-stack|ga 6: Ngăn xếp]].
