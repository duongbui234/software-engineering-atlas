---
title: "K-way Merge"
description: "Trộn k danh sách đã sắp thành một: giữ trong heap đúng một phần tử đầu (chưa lấy) của mỗi danh sách, lấy đỉnh rồi đẩy phần tử kế tiếp của cùng danh sách; O(N log k) cho N phần tử, và dừng sớm được khi chỉ cần m phần tử đầu."
tags: ["algorithms", "data-structures"]
type: note
region: Vùng Thuật toán
---

**Trộn k đường** (k-way merge) mở rộng bước trộn hai mảng của merge sort lên k danh sách. Thay vì so k đầu danh sách mỗi bước (O(k)), giữ chúng trong một heap cỡ k: lấy đỉnh (phần tử nhỏ nhất, hoặc mới nhất), rồi đẩy vào heap phần tử kế tiếp của **cùng** danh sách, mỗi bước O(log k). Heap không bao giờ quá k phần tử, nên tổng là O(N log k) và bộ nhớ thêm O(k). Lợi thế lớn khi chỉ cần m phần tử đầu: dừng sau m lần lấy, O(k + m log k), không cần đụng tới phần còn lại. Bảng tin của [[problems/design-twitter|Design Twitter (LC 355)]] là đúng ca này: k người được theo dõi, mỗi người một danh sách tweet theo thời gian, cần 10 tweet mới nhất. Ga 2 của [[series/neetcode-link|tuyến Cấu trúc liên kết]] dùng lại nó cho bài gộp k danh sách liên kết.

Đọc thêm trong bài [[posts/2026-11-24-neetcode-two-heaps|Hai heap và lập lịch]]. Xem thêm [[concepts/heap|Heap]].
