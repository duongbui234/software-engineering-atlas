---
title: "Headers Exchange"
description: "Định tuyến theo headers của tin thay vì routing key."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Headers exchange** bỏ qua routing key, so headers của tin với tham số của binding. `x-match: all` đòi mọi cặp khóa-giá trị đều khớp, `any` chỉ cần một; bản `all-with-x` và `any-with-x` tính cả header bắt đầu bằng `x-`. Hợp khi tiêu chí lọc không xếp được thành chuỗi có thứ tự, nhưng khó đọc hơn topic.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-exchanges|Bốn kiểu exchange chuẩn]].
