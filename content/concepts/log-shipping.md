---
title: "Log Shipping"
description: "Đưa log từ nhiều bản sao của app về một kho tập trung để tra cứu một chỗ."
tags: [logging, observability, kubernetes]
type: note
region: Vùng Vận hành
---

Có hai cách. App tự gửi (một transport đẩy thẳng vào Elasticsearch): đơn giản, nhưng bộ đệm nằm trong RAM của app, và kho log chết thì app gánh. Cách Twelve-Factor App và Kubernetes giả định: app chỉ ghi stdout, một agent trên mỗi node (Filebeat, Fluent Bit, Vector) đọc log container, đệm trên đĩa, gửi lại khi kho sống lại. File log trong container mất khi pod khởi động lại nếu không có volume. Đích ghi và nơi đọc (Kibana, Grafana) phải trỏ cùng một index hay data stream.

Đọc thêm trong bài [[posts/2026-11-24-flash-sale-logging|Hệ thống log của flash-sale]].
