---
title: "Reconciliation"
description: "So hai nguồn dữ liệu với một nguồn sự thật đã chọn và sửa phần lệch."
tags: ["reliability", "flash-sale"]
type: note
region: Vùng Database
---

**Đối soát** bắt những lệch mà bù trừ không bắt được, như pod chết giữa lúc Redis trừ và lúc Postgres commit. flash-sale đối soát lúc chiến dịch kết thúc: dừng worker, đếm **đơn thật chưa hủy** trong Postgres, sửa bộ đếm, trả suất chưa bán về kho thường. Làm lúc kết thúc vì khi đó không còn request nào đang nằm giữa hai hệ thống.

Đọc thêm trong bài [[2026-11-22-transactions-flash-sale|Flash sale không bán quá số hàng]].
