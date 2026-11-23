---
title: "Fast and Slow Pointers"
description: "Hai con trỏ cùng đi trên một danh sách, một con mỗi lần một bước, con kia hai bước; dùng để phát hiện vòng (thuật toán Floyd) và tìm nút giữa trong một lượt, bộ nhớ O(1)."
tags: ["algorithms", "data-structures"]
type: note
region: Vùng Thuật toán
---

**Con trỏ chậm** đi một bước mỗi vòng, **con trỏ nhanh** đi hai bước. Hai việc dùng ngay được:

- **Phát hiện vòng** (thuật toán của Floyd, còn gọi "rùa và thỏ"): không có vòng thì con nhanh chạm `null`; có vòng thì khi cả hai đã vào vòng, khoảng cách giữa chúng giảm đúng 1 mỗi vòng lặp, nên con nhanh đuổi kịp con chậm sau không quá một vòng. Chỉ cần hai biến, trong khi cách ghi nhớ các nút đã gặp vào một tập hợp cần O(n) bộ nhớ.
- **Tìm nút giữa**: khi con nhanh tới cuối, con chậm đứng ở giữa, vì nó mới đi được nửa quãng.

Phải so **cùng một nút** (`===`, `is`, `==` trên con trỏ), không so giá trị: hai nút khác nhau có thể cùng giá trị.

Đọc thêm trong bài [[posts/2026-11-24-neetcode-linked-list|Con trỏ trên danh sách liên kết]], [[problems/linked-list-cycle|Linked List Cycle]] và [[problems/reorder-list|Reorder List]]. Xem thêm [[concepts/two-pointers|Two Pointers]].
