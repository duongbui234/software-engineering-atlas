---
title: "Running Median"
description: "Trung vị của một luồng số được hỏi lại sau mỗi số mới; sắp lại hay chèn vào mảng đã sắp tốn O(n) mỗi lần, hai heap chỉ O(log n), và khi giá trị nằm trong một miền nhỏ thì một mảng đếm còn rẻ hơn."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

**Trung vị chạy** (running median) là bài toán trả trung vị sau mỗi lần thêm một số. Khác với trung vị của một mảng có sẵn (một lần quickselect O(n), hay chia đôi vị trí cắt khi có hai mảng đã sắp như [[problems/median-of-two-sorted-arrays|Median of Two Sorted Arrays]]), ở đây dữ liệu đến dần và câu hỏi lặp lại. Giữ một mảng đã sắp thì tìm chỗ chèn bằng chia đôi O(log n), nhưng chèn phải dời phần sau, O(n): đo ở [[problems/find-median-from-data-stream|LC 295]], 2·10⁵ số mất khoảng 1,4 giây trong TypeScript. [[concepts/two-heaps|Hai heap]] cho O(log n) mỗi lần thêm và O(1) mỗi lần hỏi. Nếu mọi giá trị nằm trong miền nhỏ (ví dụ [0, 100]) thì đếm số lần xuất hiện và đi qua mảng đếm, O(1) thêm và O(miền) hỏi. Có xóa phần tử cũ (cửa sổ trượt, LC 480) thì hai heap cần xóa trễ: đánh dấu số cần bỏ và chỉ bỏ khi nó lên đỉnh.

Đọc thêm trong bài [[posts/2026-11-24-neetcode-two-heaps|Hai heap và lập lịch]].
