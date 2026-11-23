---
title: "In-place Pointer Reversal"
description: "Đảo chiều một danh sách liên kết bằng ba con trỏ prev, cur, next, đổi từng mũi tên một; O(n) thời gian, O(1) bộ nhớ, không tạo nút mới."
tags: ["algorithms", "data-structures"]
type: note
region: Vùng Thuật toán
---

Đi một lượt từ đầu danh sách với ba con trỏ: `prev` là đầu của khúc đã lật, `cur` là nút đang xử lý, `next` giữ phần còn lại. Mỗi bước: `next = cur.next` (giữ trước, vì sắp cắt), `cur.next = prev` (lật mũi tên), rồi `prev = cur; cur = next`. Khi `cur` thành `null`, `prev` là đầu mới. Mỗi nút đổi đúng một con trỏ: O(n) thời gian, ba biến phụ. Bỏ bước giữ `next` thì sau khi lật, `cur.next` đã trỏ ngược về `prev` và phần còn lại bị mất. Bản đệ quy ngắn hơn nhưng tốn một khung gọi hàm mỗi nút: đo được Node 24 dừng ở khoảng 15 650 nút, Python 3.12 ở 998, trong khi bản lặp chạy 10⁶ nút trong khoảng 3 ms. Kỹ thuật này là một bước trong nhiều bài khác, ví dụ [[problems/reorder-list|Reorder List]] lật nửa sau rồi đan vào nửa đầu.

Đọc thêm trong bài [[posts/2026-11-24-neetcode-linked-list|Con trỏ trên danh sách liên kết]] và [[problems/reverse-linked-list|Reverse Linked List (LC 206)]]. Xem thêm [[concepts/linked-list|Linked List]].
