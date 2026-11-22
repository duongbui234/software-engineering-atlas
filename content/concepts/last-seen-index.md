---
title: "Last-seen Index"
description: "Bảng phần tử → vị trí lần cuối gặp nó, để nhảy thẳng tới chỗ cần thay vì dò lại."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

**Sổ vị trí gần nhất** ghi, cho mỗi phần tử, chỉ số lần cuối nó xuất hiện. Trong [[concepts/sliding-window|cửa sổ trượt]], khi gặp lại một ký tự, đầu trái nhảy thẳng tới sau lần gặp trước thay vì bỏ từng ký tự. Vì sổ không bao giờ xóa, nó còn nhớ cả những phần tử đã ra khỏi cửa sổ, nên phải kiểm lần gặp trước còn trong cửa sổ không (`left = max(left, prev + 1)`), nếu không đầu trái lùi lại.

Đọc thêm trong bài [[problems/longest-substring-without-repeating-characters|Longest Substring Without Repeating Characters]].
