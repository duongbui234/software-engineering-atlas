---
title: "Two Heaps"
description: "Chia dữ liệu thành nửa nhỏ trong một max-heap và nửa lớn trong một min-heap; hai đỉnh nằm sát ranh giới, nên phần tử ở giữa (trung vị) đọc được trong O(1) và mỗi lần thêm chỉ tốn O(log n)."
tags: ["algorithms", "data-structures"]
type: note
region: Vùng Thuật toán
---

**Hai heap** giữ hai bất biến: (1) mọi số trong nửa nhỏ không lớn hơn mọi số trong nửa lớn, và (2) cỡ hai nửa bằng nhau hoặc nửa nhỏ hơn một phần tử. Nửa nhỏ là **max**-heap nên đỉnh của nó là số lớn nhất bên dưới ranh giới; nửa lớn là **min**-heap nên đỉnh là số nhỏ nhất bên trên. Hai đỉnh đứng sát nhau ở giữa dãy đã sắp, dù hai heap không hề sắp. Thêm một số: đưa vào nửa nhỏ, chuyển đỉnh nửa nhỏ sang nửa lớn (giữ bất biến 1), rồi nếu nửa lớn đông hơn thì chuyển đỉnh nửa lớn về (giữ bất biến 2), tối đa ba thao tác O(log n). Đọc trung vị là đọc một hoặc hai đỉnh, O(1). Lỗi hay gặp là chỉ giữ bất biến 2 (chia luân phiên) hoặc chỉ giữ bất biến 1 (không cân lại): cả hai đều cho trung vị sai.

Đọc thêm trong bài [[posts/2026-11-24-neetcode-two-heaps|Hai heap và lập lịch]] và [[problems/find-median-from-data-stream|Find Median from Data Stream (LC 295)]]. Xem thêm [[concepts/heap|Heap]], [[concepts/running-median|Running Median]].
