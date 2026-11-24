---
title: "Log Levels"
description: "Mức nghiêm trọng của mỗi dòng log, và ngưỡng quyết định dòng nào được ghi."
tags: [logging, observability]
type: note
region: Vùng Vận hành
---

Mỗi dòng log mang một mức. Winston dùng bảng của npm: `error` 0, `warn` 1, `info` 2, `http` 3, `verbose` 4, `debug` 5, `silly` 6; syslog (RFC 5424) có 8 mức riêng. Logger có một ngưỡng: dòng có số lớn hơn ngưỡng bị bỏ trước khi format hay ghi. Mặc định của winston là `info`. Lỗi phía người gọi (4xx) hợp với `warn`, lỗi server (5xx) với `error`. Ngưỡng phải đổi được lúc chạy (biến môi trường, cờ), vì ngày có sự cố là ngày cần `debug`, còn giờ cao điểm thì log tốn tiền theo dung lượng.

Đọc thêm trong bài [[posts/2026-11-24-flash-sale-logging|Hệ thống log của flash-sale]].
