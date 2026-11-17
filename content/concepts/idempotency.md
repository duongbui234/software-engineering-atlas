---
title: Idempotency
description: Thao tác chạy 1 lần hay N lần thì kết quả cuối vẫn như nhau.
tags: [api, reliability]
type: note
---

Một thao tác **idempotent** chạy một lần hay nhiều lần thì trạng thái cuối cùng vẫn như nhau. Trong HTTP, `GET`, `PUT` và `DELETE` vốn idempotent; `POST` thì không, nên các API thanh toán thêm header `Idempotency-Key` để retry an toàn.
