---
title: "Message Size Limit"
description: "Giới hạn kích thước một tin: Socket.IO mặc định 1 MB, ws mặc định 100 MiB."
tags: ["realtime", "security"]
type: note
region: Vùng Realtime
---

**Giới hạn kích thước tin**: bên nhận phải đệm trọn một tin trước khi xử lý, nên không giới hạn là mời người khác gửi tin vài trăm MB để làm cạn RAM. Socket.IO mặc định `maxHttpBufferSize` 1 MB (vượt thì cắt kết nối), thư viện `ws` mặc định `maxPayload` 100 MiB, nên dùng `ws` trực tiếp thì nên hạ xuống.

Đọc thêm trong bài [[posts/2026-11-22-websocket-security|An toàn và vận hành]].
