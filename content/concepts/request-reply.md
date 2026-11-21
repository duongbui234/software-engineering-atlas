---
title: "Request-Reply"
description: "Hỏi qua broker và chờ trả lời bằng `reply_to` và `correlation_id`."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Request-reply** (RPC qua broker): tin hỏi mang `reply_to` (queue nhận câu trả lời) và `correlation_id` (mã câu hỏi); bên trả lời gửi kết quả vào default exchange với routing key bằng `reply_to`. **Direct Reply-to** dùng pseudo-queue `amq.rabbitmq.reply-to`, bắt buộc `noAck`, cùng channel, và là at-most-once. Luôn đặt timeout phía bên hỏi.

Đọc thêm trong bài [[2026-11-21-rabbitmq-delivery-guarantees|Không mất, không trùng]].
