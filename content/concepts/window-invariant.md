---
title: "Window Invariant"
description: "Điều cửa sổ trượt luôn thỏa sau mỗi bước; đầu trái tiến khi nó bị phá."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

**Bất biến của cửa sổ** là điều luôn đúng ở cuối mỗi bước: "không ký tự nào lặp", "số chữ phải thay ≤ k", "chứa đủ chữ của t". Chọn đúng bất biến là phần khó của mỗi bài [[concepts/sliding-window|cửa sổ trượt]]; phần còn lại là khuôn chung. Tìm dài nhất thì co cho tới khi bất biến đúng lại rồi cập nhật đáp án; tìm ngắn nhất thì co chừng nào bất biến còn đúng và cập nhật trong lúc co.

Đọc thêm trong bài [[problems/longest-substring-without-repeating-characters|Longest Substring Without Repeating Characters]].
