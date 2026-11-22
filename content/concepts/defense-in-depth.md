---
title: "Defense in Depth"
description: "Nhiều lớp chặn độc lập, mỗi lớp không giả định các lớp khác đúng."
tags: ["reliability", "database"]
type: note
region: Vùng Database
---

**Phòng thủ nhiều lớp** chống bán quá trong flash-sale: script Lua trong Redis, UPDATE có điều kiện trong transaction Postgres, và `CHECK (sold_count <= allocated_stock)`. Lớp cuối nằm trong database vì đó là chỗ duy nhất mọi đường ghi đều phải đi qua. Một bug ở lớp trên trở thành một lỗi rõ ràng thay vì một đơn hàng không có hàng để giao.

Đọc thêm trong bài [[2026-11-22-transactions-flash-sale|Flash sale không bán quá số hàng]].
