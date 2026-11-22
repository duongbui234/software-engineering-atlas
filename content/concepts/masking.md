---
title: "Masking"
description: "Mọi frame client gửi lên phải XOR với 4 byte ngẫu nhiên, để proxy cũ không bị lừa đầu độc cache."
tags: ["realtime", "websocket", "security"]
type: note
region: Vùng Realtime
---

**Masking**: client bắt buộc phải che payload bằng một mask key 4 byte ngẫu nhiên (XOR từng byte), server thì không được che. Đây không phải mã hóa (mask key nằm ngay trong frame); mục đích là để kẻ tấn công không thể chọn trước các byte đi trên dây và lừa một proxy trung gian hiểu nhầm thành request HTTP rồi đầu độc cache của nó (RFC 6455, mục 10.3).

Đọc thêm trong bài [[2026-11-22-websocket-protocol|Bên trong giao thức WebSocket]].
