---
title: "Duplicate Skipping"
description: "Trên mảng đã sắp xếp, các giá trị bằng nhau đứng cạnh nhau, nên bỏ trùng chỉ cần so với phần tử trước."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

Khi đề đòi kết quả không lặp, cách nhanh nhất không phải Set mà là **thứ tự**: sau khi sắp xếp, mọi bản trùng nằm liền nhau. Bỏ qua phần tử bằng phần tử **trước** nó (`a[i] == a[i − 1]`), không phải phần tử sau, để vẫn giữ lần xuất hiện đầu tiên. Sau khi tìm thấy một đáp án, nhảy con trỏ qua cả nhóm giá trị bằng nhau. Không cần khóa chuỗi, không cần [[concepts/hash-set|Hash Set]].

Đọc thêm trong bài [[problems/3sum|3Sum]].
