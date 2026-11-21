---
title: "Poison Message"
description: "Tin làm consumer lỗi mỗi lần xử lý; retry chỉ phí tài nguyên."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Tin độc** là tin hỏng dữ liệu hoặc tham chiếu tới thứ không còn tồn tại. Phòng thủ bằng cách phân loại lỗi trong consumer (lỗi dữ liệu thì đưa thẳng bãi đỗ), đếm số lần thử bằng `x-death`, và dùng delivery limit của quorum queue. Classic queue không có cơ chế tự động nào cho tin độc.

Đọc thêm trong bài [[2026-11-21-rabbitmq-dlx-retry|Thư lỗi và thư hẹn giờ]].
