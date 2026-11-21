---
title: Hàng chờ ảo
description: "Xếp người mua theo giờ đến rồi cho vào từng lượt, để đường ghi không bị dồn cùng lúc."
tags: [flash-sale, scalability]
type: note
region: Vùng Flash sale
---

**Hàng chờ ảo** (virtual queue, waiting room) ghi lại giờ đến của từng người rồi cho vào theo lượt, mỗi lượt một số người cố định hoặc theo sức chịu của hệ thống. Nó vừa bảo vệ đường ghi (checkout, giữ kho) vừa giữ công bằng: ai đến trước được vào trước. Shopify ghi giờ đến vào cookie có chữ ký và để từng load balancer tự tính ngưỡng; flash-sale của mình ghi vào một ZSET trong Redis. Hàng chờ tốt còn phải biết kho: hết hàng thì báo ngay cho người đang chờ.

Đọc thêm trong bài [[2026-11-21-shopify-flash-sale|Shopify xử lý flash sale thế nào]].
