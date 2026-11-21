---
title: "Working Set"
description: "Nhóm dữ liệu đang được đọc trong một khoảng thời gian; cache chỉ cần chứa vừa nhóm này."
tags: ["caching", "performance"]
type: note
region: Vùng Cache
---

**Working set** (Denning, 1968) là tập dữ liệu một hệ thống đang thực sự dùng trong một cửa sổ thời gian. Lúc flash sale, đó là vài chục sản phẩm đang giảm giá chứ không phải cả catalog. Cache nhỏ hơn working set thì trượt liên tục; to hơn nhiều thì lãng phí RAM.

Đọc thêm trong bài [[2026-11-22-caching-why|Vì sao cần cache]].
