---
title: "Structured Logging"
description: "Mỗi dòng log là một object có trường cố định, để kho log lọc và tính được."
tags: [logging, observability]
type: note
region: Vùng Vận hành
---

Thay vì một câu văn như `Order 42 failed after 12ms`, mỗi dòng log là một object (thường in ra JSON trên một dòng): `{"level":"error","orderId":42,"durationMs":12}`. Kho log hiểu từng trường, nên lọc `statusCode >= 500` hay tính p95 theo `url` là một câu truy vấn. JSON mới chỉ là định dạng; có cấu trúc nghĩa là cùng một ý luôn nằm ở cùng một trường, cùng một kiểu. Ghi `"12ms"` (chuỗi) thì không tính được phân vị, và sắp xếp theo chữ đặt `"100ms"` trước `"20ms"`. Đặt đơn vị vào tên trường: `durationMs`.

Đọc thêm trong bài [[posts/2026-11-24-flash-sale-logging|Hệ thống log của flash-sale]].
