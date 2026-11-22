---
title: "Graceful Shutdown"
description: "Khi pod sắp tắt: ngừng nhận kết nối mới, đóng kết nối realtime có chủ đích và rải dần, rồi mới thoát."
tags: ["realtime", "reliability", "kubernetes"]
type: note
region: Vùng Realtime
---

**Graceful shutdown** cho kết nối realtime: khi nhận SIGTERM, pod đánh dấu chưa sẵn sàng để load balancer ngừng gửi kết nối mới, rồi đóng các kết nối sống (tốt nhất là rải dần) để client tự nối sang pod khác, trước khi tiến trình thoát. Lưu ý đóng bằng `socket.disconnect()` thì client Socket.IO **không** tự nối lại; đóng tầng vận chuyển (`io.close()`) thì có.

Đọc thêm trong bài [[posts/2026-11-22-websocket-scaling|Chạy trên nhiều pod]].
