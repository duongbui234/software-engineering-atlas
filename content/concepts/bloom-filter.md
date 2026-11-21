---
title: "Bloom Filter"
description: "Mảng bit nhỏ trả lời \"chắc chắn không có\" hoặc \"có thể có\" cho một phần tử."
tags: ["caching", "data-structures"]
type: note
region: Vùng Cache
---

**Bloom filter** (1970) dùng `m` bit và `k` hàm băm; không có âm tính giả, dương tính giả xấp xỉ `(1 − e^(−kn/m))^k`. 1% cần khoảng 9,6 bit mỗi phần tử: 10.000 id tốn khoảng 12 KB. Không xóa được phần tử (dùng counting Bloom hoặc cuckoo filter). Redis 8 có sẵn `BF.ADD`, `BF.EXISTS`.

Đọc thêm trong bài [[2026-11-22-caching-under-load|Cache dưới tải cao]].
