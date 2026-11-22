---
title: "Idle Timeout"
description: "Proxy hoặc load balancer cắt kết nối im lặng quá N giây; heartbeat phải nhanh hơn N."
tags: ["realtime", "networking"]
type: note
region: Vùng Realtime
---

**Idle timeout**: mọi tầng giữa client và server (nginx `proxy_read_timeout` mặc định 60 giây, load balancer của cloud, NAT) cắt kết nối không có dữ liệu sau một khoảng. Heartbeat phải ngắn hơn khoảng nhỏ nhất trong chuỗi. Tài liệu Socket.IO khuyên timeout của proxy lớn hơn `pingInterval + pingTimeout` (45 giây với mặc định).

Đọc thêm trong bài [[2026-11-22-websocket-scaling|Chạy trên nhiều pod]].
