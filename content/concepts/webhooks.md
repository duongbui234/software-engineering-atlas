---
title: Webhooks
description: "Hệ thống bên ngoài gọi HTTP ngược vào mình khi có sự kiện."
tags: [api, integration]
type: note
region: Vùng API
---

**Webhook** là API chiều ngược: mình đăng ký URL, bên kia gửi request khi có sự kiện (cổng thanh toán gọi là IPN). Nguyên tắc: xác thực chữ ký, xử lý idempotent vì bên gửi sẽ gửi lại, trả `2xx` nhanh, việc nặng đẩy vào queue, và không tin return URL đi qua trình duyệt.

Đọc thêm trong bài [[2026-11-18-api-styles|Năm kiểu API]].
