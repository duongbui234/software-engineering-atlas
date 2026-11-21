---
title: "Feature Flags"
description: "Tính năng mới chỉ bật khi mọi node đã hỗ trợ, để nâng cấp lần lượt an toàn."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

**Feature flags** cho phép node khác phiên bản chạy chung trong lúc rolling upgrade. Nâng hết node rồi chạy `rabbitmqctl enable_feature_flag all`; bật rồi không tắt được, và có flag bắt buộc phải bật trước khi nâng tiếp. Đi kèm là vòng đời tính năng bị bỏ: permitted, denied, disconnected, removed. Từ 3.13/4.0/4.1 phải lên 4.2 trước khi lên 4.3+.

Đọc thêm trong bài [[2026-11-21-rabbitmq-cluster|Cụm và sẵn sàng cao]].
