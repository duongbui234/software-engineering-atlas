---
title: "Complement Lookup"
description: "Thay vì tìm cặp, tính giá trị còn thiếu và tra xem đã gặp nó chưa."
tags: ["algorithms", "hashing"]
type: note
region: Vùng Thuật toán
---

**Tra phần bù**: ở phần tử x, giá trị duy nhất ghép được để ra target là `target − x`. Câu hỏi "có cặp nào?" (O(n²)) thành "đã thấy target − x chưa?" (một lần tra map, O(1)). Mẹo này dùng lại cho đếm đoạn con có tổng k (phần bù trên tổng tiền tố), 4Sum II và nhiều bài khác.

Đọc thêm trong bài [[problems/two-sum|Two Sum]].
