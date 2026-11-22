---
title: "Single Active Consumer"
description: "Nhiều consumer đăng ký nhưng chỉ một nhận tin tại một thời điểm, tự chuyển khi người đó rời đi."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Bật bằng `x-single-active-consumer: true` khi khai báo queue (classic, quorum; stream qua stream protocol). Giữ đúng thứ tự xử lý mà vẫn có consumer dự phòng. Cái giá là không xử lý song song trên queue đó. Khác exclusive consumer (chỉ classic): người đăng ký sau bị từ chối thay vì xếp hàng dự phòng.

Đọc thêm trong bài [[posts/2026-11-21-rabbitmq-queue-types|Classic, quorum hay stream]].
