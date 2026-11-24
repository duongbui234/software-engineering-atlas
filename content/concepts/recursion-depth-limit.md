---
title: "Recursion Depth Limit"
description: "Số tầng lời gọi lồng nhau tối đa trước khi chương trình báo tràn stack; mỗi ngôn ngữ đặt nó khác nhau, và cây lệch chạm nó trước."
tags: ["algorithms", "recursion"]
type: note
region: Vùng Thuật toán
---

Mỗi lời gọi hàm chưa trả về chiếm một khung trên **call stack**. Đệ quy trên [[concepts/binary-tree|cây]] sâu bằng chiều cao cây, nên cây cân bằng 10⁶ nút chỉ cần khoảng 20 tầng, còn cây lệch 10⁶ nút cần 10⁶ tầng. Đo trên máy mình với hàm `maxDepth` trên một chuỗi lệch:

| Ngôn ngữ | Giới hạn mặc định | Đo được | Vượt giới hạn thì |
|---|---|---|---|
| Python 3.12 | `sys.getrecursionlimit()` = 1000 tầng | 997 nút | `RecursionError`, bắt được |
| Node.js 24 | stack V8 984 KB (`--stack-size`) | 7 000 tới 15 600 nút, tùy hàm đã được JIT tối ưu chưa | `RangeError`, bắt được |
| Java 21 | `-Xss` 1 MB cho luồng main | khoảng 39 000 nút | `StackOverflowError`, bắt được |
| Go 1.25 | stack goroutine tự lớn tới 1 GB | 10⁶ nút chạy trong 62,8 ms | `fatal error: stack overflow`, không `recover` được |

Hai cách thoát: nâng giới hạn (`sys.setrecursionlimit`, `node --stack-size`, `new Thread(null, r, name, stackSize)` trong Java), hoặc viết lại bằng [[concepts/stack|ngăn xếp]] tự quản lý trên heap. Bản lặp không bao giờ tràn call stack, nhưng không miễn phí: trên một cây ngẫu nhiên cao 25 tầng, bản lặp của Diameter of Binary Tree (cần một bảng băm nút → chiều cao) chậm hơn bản đệ quy khoảng 8 tới 10 lần ở Node, Go và Java, và 1,7 lần ở Python.

Đọc thêm trong bài [[posts/2026-11-25-neetcode-tree-recursion|ga 3: Đệ quy trên cây]].
