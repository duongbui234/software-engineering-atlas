---
title: "PII Redaction"
description: "Che dữ liệu nhận ra được một người (email, số điện thoại, token) trước khi log rời khỏi app."
tags: [logging, security]
type: note
region: Vùng Vận hành
---

Log được giữ lâu, copy nhiều nơi và có nhiều người đọc hơn database, nên email hay token trong log là lộ dữ liệu. Cách thường làm: một danh sách tên trường PII, một bước format duyệt dòng log và thay giá trị (`an.nguyen@…` → `an***@…`). Che theo tên trường bỏ sót PII trong câu message dựng bằng template string và trong `Error.message`. Bộ che phải chịu được vòng tham chiếu (`WeakSet`), đọc được `Error` (thuộc tính không liệt kê được), giữ khóa Symbol của thư viện log, và **không bao giờ ném lỗi**: một bộ che ném lỗi làm hỏng chính request đang được ghi log.

Đọc thêm trong bài [[posts/2026-11-24-flash-sale-logging|Hệ thống log của flash-sale]].
