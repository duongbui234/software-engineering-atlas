---
title: "Bracket Matching"
description: "Ghép mỗi ngoặc đóng với ngoặc mở gần nhất chưa đóng; cần ngăn xếp vì đếm không nhớ được thứ tự."
tags: ["algorithms", "stack"]
type: note
region: Vùng Thuật toán
---

Với một loại ngoặc, một bộ đếm là đủ. Với nhiều loại, bộ đếm hỏng: ba bộ đếm riêng vẫn cho `"([)]"` qua. [[concepts/stack|Ngăn xếp]] giữ các ngoặc mở theo thứ tự, nên ngoặc đóng chỉ cần so với đỉnh. Cùng ý dùng cho thẻ HTML lồng nhau, khối `begin`/`end`, và trình phân tích cú pháp.

Đọc thêm trong bài [[problems/valid-parentheses|Valid Parentheses]].
