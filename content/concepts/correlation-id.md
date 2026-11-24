---
title: "Correlation ID"
description: "Một mã gắn cho request từ cửa vào, có trong mọi dòng log của request đó và được trả lại cho người gọi."
tags: [logging, observability, api]
type: note
region: Vùng Vận hành
---

Middleware đầu tiên lấy mã từ header (ví dụ `X-Correlation-ID`) nếu phía trước đã có, không thì sinh mới, rồi trả mã trong header phản hồi và body lỗi. Người dùng gửi ảnh lỗi là có sẵn chìa khóa tra log. Mã từ ngoài vào phải được kiểm (độ dài, ký tự) trước khi ghi. Mã nằm trong ngữ cảnh request (thường là [[concepts/async-local-storage|AsyncLocalStorage]]), không tự nằm trong log: chỉ logger nào đọc ngữ cảnh mới ghi được nó. Correlation id khác trace id của W3C Trace Context (`traceparent`); log nên ghi cả hai để nhảy từ log sang trace.

Đọc thêm trong bài [[posts/2026-11-24-flash-sale-logging|Hệ thống log của flash-sale]].
