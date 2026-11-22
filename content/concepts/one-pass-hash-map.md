---
title: "One-pass Hash Map"
description: "Duyệt một lượt, mỗi bước tra map trước rồi mới ghi phần tử hiện tại vào."
tags: ["algorithms", "hashing"]
type: note
region: Vùng Thuật toán
---

Trong **hash map một lượt**, map chỉ chứa các phần tử đứng trước vị trí hiện tại. Hỏi trước, ghi sau thì không bao giờ ghép một phần tử với chính nó: `[3, 3]` với target 6 cho `[0, 1]`. Đảo thứ tự (ghi trước rồi hỏi) làm `[3, 2, 4]` với target 6 trả về `[0, 0]`.

Đọc thêm trong bài [[problems/two-sum|Two Sum]].
