---
title: "Exchange"
description: "Bàn phân loại: nhận tin từ producer và quyết định chép vào queue nào."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Exchange** nhận tin từ producer và dựa vào kiểu của nó (direct, fanout, topic, headers) cùng các binding để chép tin vào các queue khớp. Exchange không lưu tin: không queue nào khớp thì tin bị bỏ, trừ khi có `mandatory` hoặc alternate exchange. Exchange có tên, kiểu, cờ `durable` và `auto-delete`.

Đọc thêm trong bài [[2026-11-21-rabbitmq-amqp-model|Bên trong bưu điện: mô hình AMQP]].
