---
title: "Publisher Confirms"
description: "Biên nhận broker gửi cho producer khi đã nhận trách nhiệm với tin."
tags: [rabbitmq, messaging]
type: note
region: Vùng Messaging
---

Bật **confirm mode** trên channel thì broker gửi `basic.ack` cho mỗi tin khi đã nhận trách nhiệm: tin persistent vào queue durable thì sau khi ghi đĩa, quorum queue thì khi đa số bản sao đã có, tin unroutable thì ngay khi biết không có queue. `basic.nack` khi broker không nhận được tin. Chờ theo lô nhanh hơn chờ từng tin nhiều lần; transaction chậm hơn tới khoảng 250 lần.

Đọc thêm trong bài [[2026-11-21-rabbitmq-ack-confirm|Giao nhận chắc tay: ack, prefetch, confirm]].
