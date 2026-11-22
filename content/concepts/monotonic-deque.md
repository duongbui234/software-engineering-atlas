---
title: "Monotonic Deque"
description: "Hàng đợi hai đầu giữ chỉ số theo giá trị giảm dần, để biết max của cửa sổ trượt trong O(1)."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

**Hàng đợi đơn điệu** giữ chỉ số các phần tử theo giá trị giảm dần. Phần tử mới đẩy bỏ mọi phần tử nhỏ hơn hoặc bằng nó ở cuối hàng, vì chúng không bao giờ còn là max khi phần tử mới còn trong cửa sổ; đầu hàng bị bỏ khi trượt ra ngoài. Đầu hàng luôn là max của cửa sổ, và mỗi chỉ số vào, ra một lần nên tổng O(n). Cần thêm, bớt hai đầu O(1): `deque` trong Python, `ArrayDeque` trong Java; `shift()` của mảng JS là O(n).

Đọc thêm trong bài [[posts/2026-11-23-neetcode-sliding-window|Cửa sổ trượt]].
