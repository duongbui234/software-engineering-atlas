---
title: "Message Properties"
description: "Tin AMQP gồm properties chuẩn, bảng headers tùy ý và body mà broker không đọc."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Một tin có **body** (mảng byte, broker không đọc), **properties** chuẩn như `delivery_mode` (2 = persistent), `content_type`, `message_id`, `correlation_id`, `reply_to`, `expiration`, `priority`, `timestamp`, và **headers** là bảng khóa-giá trị tùy ý. Từ 4.0, kích thước tin tối đa mặc định là 16 MiB; dữ liệu nặng nên để ở kho file và chỉ gửi đường dẫn.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-amqp-model|Bên trong bưu điện: mô hình AMQP]].
