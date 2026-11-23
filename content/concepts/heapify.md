---
title: "Heapify"
description: "Dựng heap từ n phần tử có sẵn trong O(n) bằng cách cho chìm từ cha cuối cùng ngược về gốc (Floyd, 1964), thay vì n lần thêm tốn O(n log n)."
tags: ["algorithms", "data-structures"]
type: note
region: Vùng Thuật toán
---

Thêm lần lượt n phần tử vào heap rỗng tốn O(n log n): ở ca xấu nhất (dãy giảm dần, với min-heap) phần tử nào cũng nổi lên tận gốc. **Heapify** của Floyd làm ngược lại: coi cả mảng là một cây, rồi cho chìm từng ô từ cha cuối cùng `n/2 − 1` về ô 0. Một nửa số ô là lá, không phải chìm; một phần tư chìm tối đa 1 tầng, một phần tám tối đa 2 tầng… Số ô ở độ cao h không quá n/2ʰ⁺¹, nên tổng số lần đổi chỗ không vượt Σ h · n/2ʰ⁺¹ = n: O(n). Đo với 10⁶ số giảm dần: thêm lần lượt mất 17 951 445 lần đổi chỗ, heapify mất 999 988. Python có `heapq.heapify`, Go có `heap.Init`, Java có constructor `PriorityQueue(Collection)`.

Đọc thêm trong bài [[posts/2026-11-23-neetcode-heap-top-k|Heap và top K]].
