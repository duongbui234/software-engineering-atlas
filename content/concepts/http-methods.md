---
title: HTTP Methods
description: "Động từ của HTTP, mỗi cái kèm cam kết safe và idempotent."
tags: [api, http]
type: note
region: Vùng API
---

**HTTP method** nói lên ý định của request. RFC 9110 gắn cho mỗi method hai tính chất: *safe* (không đổi trạng thái: `GET`, `HEAD`, `OPTIONS`) và *idempotent* (gọi N lần như một lần: thêm `PUT`, `DELETE`). `POST` không có cả hai, nên endpoint tạo đơn cần `Idempotency-Key` để retry an toàn.

Đọc thêm trong bài [[2026-11-18-api-foundations|Nền tảng API]].
