---
title: "Doubly Linked List"
description: "Danh sách liên kết mà mỗi nút có cả prev lẫn next, nên đang cầm một nút là gỡ được chính nó trong O(1); thêm hai nút canh ở hai đầu thì không còn trường hợp biên."
tags: ["algorithms", "data-structures"]
type: note
region: Vùng Thuật toán
---

Trong [[concepts/linked-list|danh sách một chiều]], mỗi nút chỉ biết nút sau nó. Muốn gỡ một nút phải sửa `next` của nút **đứng trước**, mà tìm nút đó phải đi từ đầu: O(n). **Danh sách hai chiều** cho mỗi nút thêm con trỏ `prev`. Đang cầm nút `n` thì `n.prev.next = n.next; n.next.prev = n.prev` gỡ nó ra trong O(1), và chèn một nút cạnh bất kỳ nút nào cũng O(1). Giá phải trả là thêm một con trỏ mỗi nút và gấp đôi số chỗ phải sửa khi nối lại.

Cách dựng hay gặp đặt hai [[concepts/dummy-node|nút giả]] `head` và `tail` ở hai đầu: danh sách không bao giờ rỗng thật, mọi nút thật luôn có nút trước và nút sau, nên `unlink` và `pushFront` không cần `if` nào. Ghép với [[concepts/hash-map|hash map]] trỏ key → nút, nó cho [[problems/lru-cache|LRU Cache]] với `get` và `put` O(1). Các thư viện có sẵn: `container/list` của Go, `LinkedList` và `LinkedHashMap` của Java, `OrderedDict` của Python (bên trong dùng danh sách hai chiều).

Đọc thêm trong bài [[posts/2026-11-24-neetcode-advanced-linked-list|Danh sách liên kết nâng cao]]. Xem thêm [[concepts/lru-va-lfu|LRU và LFU]].
