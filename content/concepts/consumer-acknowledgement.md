---
title: "Consumer Acknowledgement"
description: "Consumer báo \"xử lý xong\" thì broker mới xóa tin."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Với **ack thủ công**, tin đã giao ở trạng thái unacked cho tới khi consumer gửi `basic.ack`. Channel đóng khi còn tin unacked thì tin quay lại queue. `basic.reject` và `basic.nack` từ chối tin, với `requeue` true thì trả về hàng, false thì bỏ hoặc dead-letter. Requeue không phải retry: tin được giao lại gần như ngay. Ack là việc cuối cùng của handler.

Đọc thêm trong bài [[2026-11-21-rabbitmq-ack-confirm|Giao nhận chắc tay: ack, prefetch, confirm]].
