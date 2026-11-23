---
title: "Linked List"
description: "Dãy nút rời rạc trong bộ nhớ, mỗi nút giữ một giá trị và một con trỏ tới nút kế; chèn, xóa ở một chỗ đã biết tốn O(1), nhưng tới phần tử thứ i phải đi qua i nút."
tags: ["algorithms", "data-structures"]
type: note
region: Vùng Thuật toán
---

Một **danh sách liên kết đơn** là chuỗi nút, mỗi nút gồm giá trị và con trỏ `next` tới nút kế; nút cuối trỏ `null`. Chương trình chỉ cầm con trỏ tới nút đầu (`head`). Khác mảng, các nút không nằm liền nhau trong bộ nhớ, nên không có phép "nhảy tới ô i": muốn tới nút thứ i phải đi qua i nút, O(i). Đổi lại, khi đã cầm một nút, chèn hay gỡ nút ngay sau nó chỉ là đổi một hai con trỏ, O(1), không phải dời phần còn lại như mảng. Mỗi nút cũng tốn thêm chỗ cho con trỏ và phần đầu đối tượng: đo trong V8, một nút `{val, next}` chiếm khoảng 40 byte, trong khi mảng số nguyên nhỏ chỉ khoảng 10 byte mỗi phần tử. Danh sách **đôi** có thêm con trỏ `prev` để đi ngược.

Đọc thêm trong bài [[posts/2026-11-24-neetcode-linked-list|Con trỏ trên danh sách liên kết]] và [[problems/reverse-linked-list|Reverse Linked List (LC 206)]]. Xem thêm [[concepts/dummy-node|Dummy Node]], [[concepts/pointer-reversal|In-place Pointer Reversal]], [[concepts/fast-slow-pointers|Fast and Slow Pointers]].
