---
title: "Direct Exchange"
description: "Chép tin vào queue có binding key trùng khớp hoàn toàn routing key."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Direct exchange** chỉ chép tin khi binding key giống hệt routing key: binding `payment.paid` nhận đúng `payment.paid`. Nhiều queue cùng bind một khóa thì mỗi queue một bản. Hợp khi khóa là một tập cố định như loại lệnh hay mức log. Có sẵn exchange `amq.direct`.

Đọc thêm trong bài [[2026-11-21-rabbitmq-exchanges|Bốn kiểu exchange chuẩn]].
