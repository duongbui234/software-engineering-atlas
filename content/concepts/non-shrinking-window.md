---
title: "Non-shrinking Window"
description: "Cửa sổ trượt mà mỗi bước chỉ dài thêm hoặc trượt nguyên khối: độ dài không bao giờ giảm, nên độ dài cuối cùng chính là đáp án."
tags: ["algorithms", "sliding-window"]
type: note
region: Vùng Thuật toán
---

Khi đề hỏi đoạn **dài nhất** thỏa một điều kiện, không cần giữ cửa sổ luôn hợp lệ. Mỗi bước thêm một phần tử bên phải; nếu cửa sổ hỏng, chỉ bỏ **một** phần tử bên trái (`if` thay cho `while`), nên cửa sổ trượt mà không co. Độ dài chỉ tăng khi tìm được đoạn dài hơn thật, nên đáp án là độ dài cuối cùng `n − left`. Nhờ vậy thông tin như tần suất lớn nhất chỉ cần là **kỷ lục**, không cần đúng cho cửa sổ hiện tại. Một biến thể của [[concepts/sliding-window|Sliding Window]] với [[concepts/window-invariant|bất biến]] được nới lỏng.

Đọc thêm trong bài [[problems/longest-repeating-character-replacement|Longest Repeating Character Replacement]].
