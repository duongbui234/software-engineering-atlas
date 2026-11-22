---
title: "Fixed-size Window"
description: "Cửa sổ trượt có độ dài k cố định: mỗi bước thêm một phần tử bên phải và bỏ một phần tử bên trái."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

**Cửa sổ cố định** dài k không co giãn mà chỉ trượt: thêm `a[right]` và bỏ `a[right − k]` cùng một bước, không cần vòng `while`. Trạng thái của cửa sổ (bảng đếm, tổng, hàng đợi) cập nhật hai lần mỗi bước thay vì tính lại từ đầu, nên tổng là O(n) thay vì O(n·k). Permutation in String và Sliding Window Maximum dùng kiểu cửa sổ này.

Đọc thêm trong bài [[posts/2026-11-23-neetcode-sliding-window|Cửa sổ trượt]].
