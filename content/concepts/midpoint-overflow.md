---
title: "Midpoint Overflow"
description: "(lo + hi) / 2 tràn số nguyên 32 bit khi tổng vượt 2³¹ − 1 và ra chỉ số âm; viết lo + (hi − lo) / 2 hoặc (lo + hi) >>> 1."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

Với `int` 32 bit, `lo = 1 500 000 000` và `hi = 2 000 000 000` cho `(lo + hi) / 2 = −397 483 648`. Năm 2006 Joshua Bloch chỉ ra lỗi này trong `java.util.Arrays.binarySearch` của JDK, nằm im khoảng 9 năm vì chỉ lộ ra với mảng từ khoảng 2³⁰ phần tử. Hai cách sửa: `lo + (hi − lo) / 2` (hiệu không vượt `hi`), hoặc `(lo + hi) >>> 1` trong Java và JavaScript (dịch không dấu đọc tổng tràn như số dương). Go viết `int(uint(i+j) >> 1)` trong `sort.Search`. Python không bị vì `int` không giới hạn; JavaScript không tràn ở phép cộng nhưng `>> 1` ép về int32 có dấu và gặp đúng lỗi này. Xem [[concepts/binary-search|Binary Search]].

Đọc thêm trong bài [[problems/binary-search|Binary Search (LC 704)]] và [[posts/2026-11-23-neetcode-binary-search|ga 1: Tìm kiếm nhị phân trên mảng]].
