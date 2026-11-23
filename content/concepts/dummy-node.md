---
title: "Dummy Node"
description: "Một nút giả đặt trước nút đầu danh sách, để thao tác trên nút đầu giống hệt mọi nút khác; kết quả là dummy.next."
tags: ["algorithms", "data-structures"]
type: note
region: Vùng Thuật toán
---

Nhiều thao tác trên danh sách liên kết cần "nút đứng trước": muốn gỡ một nút, phải sửa `next` của nút trước nó; muốn nối thêm vào kết quả, phải có nút cuối của kết quả. Nút đầu không có nút đứng trước, nên code thường thêm một nhánh `if` riêng cho nó, và đó là chỗ hay sai. **Nút giả** (dummy, sentinel) là một nút không mang dữ liệu, tạo ra với `dummy.next = head`. Từ đó nút đầu thật cũng có nút đứng trước, mọi nút được xử lý cùng một cách, và đầu mới của danh sách là `dummy.next` (có thể đã đổi, ví dụ khi chính nút đầu bị xóa). Dùng ở [[problems/merge-two-sorted-lists|Merge Two Sorted Lists]] (đuôi kết quả bắt đầu ở nút giả) và [[problems/remove-nth-node-from-end-of-list|Remove Nth Node From End of List]] (xóa được cả nút đầu). Đây là một dạng [[concepts/sentinel-value|phần tử canh]].

Đọc thêm trong bài [[posts/2026-11-24-neetcode-linked-list|Con trỏ trên danh sách liên kết]]. Xem thêm [[concepts/linked-list|Linked List]].
