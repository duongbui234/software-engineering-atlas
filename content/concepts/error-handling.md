---
title: Error Handling
description: "Lỗi là một phần của hợp đồng API, cần định dạng cố định như response thành công."
tags: [api, http]
type: note
region: Vùng API
---

**Xử lý lỗi** tốt nghĩa là: bắt mọi exception ở một chỗ, không lộ stack trace, log đầy đủ lỗi 500 kèm correlation id, và trả về định dạng cố định có mã lỗi ổn định. RFC 9457 (Problem Details) chuẩn hóa định dạng đó với `application/problem+json`. Trong flash-sale mình tìm ra filter làm rơi `code`, nên frontend chỉ hiện câu mặc định của axios.

Đọc thêm trong bài [[2026-11-18-api-foundations|Nền tảng API]].
