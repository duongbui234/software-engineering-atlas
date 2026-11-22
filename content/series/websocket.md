---
title: Tuyến WebSocket và Socket.IO
description: Gỡ chỗ hay nhầm nhất của realtime trên web, rằng Socket.IO là WebSocket, qua 6 ga đi từ "vì sao HTTP không đủ" tới giao thức trên dây, room và kết nối lại, chạy nhiều pod và an toàn khi kết nối sống hàng giờ.
series: websocket
code: WS
region: Vùng Realtime
draft: false
stations:
  - name: Bốn cách để server báo tin
    concepts: [Server Push, Polling, Long Polling, Server-Sent Events, Full-duplex]
  - name: Bên trong giao thức WebSocket
    concepts: [Opening Handshake, WebSocket Frame, Masking, Ping/Pong, Close Code, Subprotocol]
  - name: Socket.IO không phải WebSocket
    concepts: [Engine.IO, Transport Upgrade, Heartbeat, Socket.IO Packet, Acknowledgement]
  - name: Namespace, room và kết nối lại
    concepts: [Namespace, Room, Multiplexing, Auto Reconnect, Delivery Guarantee, Connection State Recovery]
  - name: Chạy trên nhiều pod
    concepts: [Sticky Session, Socket.IO Adapter, Reverse Proxy Upgrade, Idle Timeout, Reconnect Storm, Graceful Shutdown]
  - name: An toàn và vận hành
    concepts: [Cross-Site WebSocket Hijacking, Handshake Authentication, Long-lived Token, Backpressure, Message Size Limit, Realtime Checklist]
---

## Nếu bạn mới bắt đầu

Bạn không cần biết WebSocket hay Socket.IO là gì để đi tuyến này. Ga 1 bắt đầu từ câu hỏi đơn giản nhất: HTTP chỉ cho server trả lời khi được hỏi, vậy làm sao server *báo trước* cho trình duyệt rằng "tới lượt bạn rồi"?

Cả tuyến dùng chung một hình ảnh: **gọi điện cho cửa hàng**. HTTP là gửi thư hỏi rồi chờ thư trả lời. **WebSocket là một đường dây điện thoại**: nhấc máy một lần, hai bên nói lúc nào cũng được, nhưng đường dây chỉ truyền tiếng, không biết "nhóm", "xác nhận đã nghe" hay "gọi lại khi rớt máy" là gì. **Socket.IO là một tổng đài** đặt trên đường dây đó: nó có phòng họp nhóm, ký nhận, tự gọi lại, và khi không có dây điện thoại thì nó chuyển sang gửi thư liên tục. Tổng đài nói bằng **mật mã riêng**, nên một chiếc điện thoại thường gọi vào tổng đài sẽ nghe thấy tiếng nhưng không hiểu gì, và ngược lại.

Câu cuối là chỗ người ta hay nhầm nhất: **client WebSocket thuần không nói chuyện được với server Socket.IO**, và client Socket.IO không nối được server WebSocket thuần. Ga 3 cho bạn nhìn tận mắt vì sao.

Mỗi ga mở đầu bằng **"Hình dung trước"** (khái niệm so với chuyện đời thường, kèm sơ đồ) và một **từ điển nhanh** cho thuật ngữ mới. Đọc hai phần đó trước rồi mới vào phần kỹ thuật.

## Vì sao xếp theo thứ tự này

- **Ga 1–2** là phần chuẩn của web: các cách server báo tin (polling, long polling, SSE, WebSocket) và giao thức WebSocket theo RFC 6455, tới từng byte trên dây. Chưa có thư viện nào.
- **Ga 3–4** là Socket.IO: nó thêm gì lên trên WebSocket (Engine.IO, gói tin riêng, ack), rồi những thứ người dùng hay tưởng là của WebSocket (room, namespace, tự kết nối lại) và giới hạn thật của chúng (tin có thể mất).
- **Ga 5–6** là vận hành: chạy nhiều pod sau load balancer (sticky session, Redis adapter, proxy, deploy), rồi an toàn và sức chịu tải của kết nối sống hàng giờ.

Không thể hiểu vì sao Socket.IO cần sticky session nếu chưa biết Engine.IO bắt đầu bằng long polling; không thể hiểu vì sao tin bị mất khi deploy nếu chưa biết at most once. Mỗi ga chỉ dùng từ vựng của các ga trước.

Tuyến này đào sâu một mục ngắn trong ga [[posts/2026-11-18-api-styles|Năm kiểu API]] của tuyến API, và dùng lại vài từ của [[posts/2026-11-22-caching-distributed|tuyến Caching]] (Redis Pub/Sub) và [[series/rabbitmq|tuyến RabbitMQ]] (at most once, at least once).

## Phiên bản và nguồn

Ví dụ chạy thật trên **Node.js 24** (client `WebSocket` có sẵn), **ws 8.23**, **Socket.IO 4.8.4** và **Redis 8**, kèm lệnh để bạn chạy lại. Mọi giá trị mặc định nhắc trong bài (pingInterval 25 giây, pingTimeout 20 giây, `maxHttpBufferSize` 1 MB, thời gian chờ kết nối lại) đã được đối chiếu với mã nguồn của đúng các phiên bản đó.

Nguồn chính: **RFC 6455** (WebSocket), RFC 8441 (WebSocket trên HTTP/2), chuẩn WHATWG cho Server-Sent Events và WebSocket API; tài liệu chính thức của Socket.IO (giao thức Engine.IO v4 và Socket.IO v5, delivery guarantees, connection state recovery, nhiều node); nghiên cứu của Christian Schneider (2013) về Cross-Site WebSocket Hijacking. Ví dụ ngữ cảnh lấy từ **flash-sale**, trang bán hàng giảm giá giờ vàng mình tự viết, đã rút gọn và đổi tên.
