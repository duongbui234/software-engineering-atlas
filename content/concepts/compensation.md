---
title: "Compensation"
description: "Thao tác hoàn tác ở hệ thống thứ nhất khi bước ở hệ thống thứ hai thất bại."
tags: ["reliability", "flash-sale"]
type: note
region: Vùng Database
---

**Bù trừ**: Redis đã trừ suất, transaction Postgres lỗi, thì một script Lua thứ hai cộng lại suất và trừ lại quota của người đó trong cùng một lần chạy. Gộp vào một script để không có trường hợp trả suất mà quên trả quota. Bù trừ là phiên bản nhỏ của mẫu saga, và chỉ chạy được khi process còn sống để chạy nó.

Đọc thêm trong bài [[2026-11-22-transactions-flash-sale|Flash sale không bán quá số hàng]].
