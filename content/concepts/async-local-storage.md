---
title: "AsyncLocalStorage"
description: "API của Node.js gắn một store vào mọi việc bất đồng bộ sinh ra từ một lần gọi, để code sâu bên trong đọc được ngữ cảnh request."
tags: [nodejs, logging]
type: note
region: Vùng Vận hành
---

`als.run(store, fn)` chạy `fn` và gắn `store` vào mọi `await`, `setTimeout`, callback Promise sinh ra từ đó; ở đâu trong chuỗi ấy `als.getStore()` cũng trả về đúng store. Hai request xen kẽ trên một luồng vẫn mỗi bên thấy store của mình. Ngữ cảnh đi theo nơi một việc được **tạo ra**: một timer tạo lúc khởi động chạy mãi với store rỗng, kể cả khi xử lý dữ liệu do request đẩy vào hàng đợi. Muốn giữ ngữ cảnh qua hàng đợi thì lưu nó cùng dữ liệu. Chi phí đo được trên Node 24: khoảng 0,15 µs mỗi request.

Đọc thêm trong bài [[posts/2026-11-24-flash-sale-logging|Hệ thống log của flash-sale]].
