---
title: "Next Greater Element"
description: "Với mỗi vị trí, phần tử đầu tiên bên phải lớn hơn nó; tìm cho mọi vị trí trong O(n) bằng ngăn xếp đơn điệu giảm."
tags: ["algorithms", "stack"]
type: note
region: Vùng Thuật toán
---

Cách thẳng là mỗi vị trí đi sang phải tìm: O(n²) khi mảng giảm dần. Lật câu hỏi lại: mỗi phần tử mới lấy khỏi [[concepts/monotonic-stack|ngăn xếp đơn điệu]] mọi phần tử nhỏ hơn nó, và chính nó là phần tử lớn hơn kế tiếp của chúng. Những gì còn lại trên ngăn xếp không có câu trả lời. Biến thể: nhỏ hơn kế tiếp (ngăn xếp tăng), lớn hơn ở bên trái (đọc đỉnh còn lại sau khi pop), hay mảng vòng (đi hai lượt).

Đọc thêm trong bài [[problems/daily-temperatures|Daily Temperatures]].
