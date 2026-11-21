---
title: "Queue Metrics"
description: "Các con số cho biết consumer có theo kịp không: ready, unacked, consumers."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

`messages_ready` tăng đều là consumer không theo kịp hoặc đã chết; `messages_unacked` cao mà không giảm là consumer treo hoặc quên ack; `consumers` bằng 0 trên queue đang nhận tin là báo động. Consumer capacity dưới 100% khi hàng tồn thì cần thêm consumer hoặc tăng prefetch. Theo dõi bằng plugin Prometheus (cổng 15692) và Grafana.

Đọc thêm trong bài [[2026-11-21-rabbitmq-operations|Vận hành RabbitMQ trong production]].
