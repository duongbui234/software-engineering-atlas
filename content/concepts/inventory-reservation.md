---
title: Giữ kho
description: "Giữ tạm một suất hàng trong lúc khách trả tiền, trả xong mới trừ hẳn khỏi sổ kho."
tags: [flash-sale, database]
type: note
region: Vùng Flash sale
---

**Giữ kho** (inventory reservation) chặn bán quá số hàng thật: lúc khách bắt đầu thanh toán, hệ thống giữ một suất trong vài phút; trả tiền thành công thì trừ hẳn khỏi sổ kho (claim), bỏ ngang thì nhả suất ra. Khó nhất là giữ cho thao tác giữ và trừ hẳn nằm trên cùng một nguồn sự thật. Shopify chuyển phần này từ Redis sang MySQL, mỗi suất là một dòng, dùng `SELECT … FOR UPDATE SKIP LOCKED` để nhiều người cùng giữ mà không chờ nhau. Suất bị hủy phải quay về đúng kho mà nó được lấy ra.

Đọc thêm trong bài [[2026-11-21-shopify-flash-sale|Shopify xử lý flash sale thế nào]].
