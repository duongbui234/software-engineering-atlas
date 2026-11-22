---
title: "Stack"
description: "Danh sách chỉ thêm và lấy ở một đầu: vào sau thì ra trước (LIFO), push và pop đều O(1)."
tags: ["algorithms", "stack"]
type: note
region: Vùng Thuật toán
---

**Ngăn xếp** trả lời câu hỏi "việc dở dang gần nhất là gì?" trong O(1): đỉnh luôn là phần tử vào sau cùng. Trong hầu hết ngôn ngữ, một mảng động chỉ thêm và bớt ở **cuối** là đủ: mảng JS, `list` Python, slice Go, `ArrayDeque` Java. Thêm hay bớt ở **đầu** mảng thì O(n). Lấy từ ngăn xếp rỗng là lỗi hay gặp nhất, và mỗi ngôn ngữ phản ứng khác nhau. Xem [[concepts/bracket-matching|Bracket Matching]].

Đọc thêm trong bài [[posts/2026-11-23-neetcode-stack|ga 6: Ngăn xếp]].
