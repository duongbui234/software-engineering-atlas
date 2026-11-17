---
title: Idempotency
description: "Thao tác chạy 1 lần hay N lần thì kết quả cuối vẫn như nhau."
tags: [api, reliability]
type: note
region: Vùng API
---

Một thao tác **idempotent** chạy một lần hay nhiều lần thì trạng thái cuối cùng vẫn như nhau. Trong HTTP, `GET`, `PUT` và `DELETE` vốn idempotent; `POST` thì không, nên các API thanh toán thêm header `Idempotency-Key` để retry an toàn. Server giành key bằng thao tác nguyên tử *trước* khi làm việc có tác dụng phụ, lưu response, và trả lại response đó khi gặp lại key; cùng key mà khác body thì từ chối.

Đọc thêm trong bài [[2026-11-18-api-reliability|Độ tin cậy của API]].
