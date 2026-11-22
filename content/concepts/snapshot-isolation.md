---
title: "Snapshot Isolation"
description: "Cả transaction đọc một ảnh duy nhất; ai ghi dòng đã bị sửa sau ảnh đó thì bị hủy."
tags: ["database", "isolation", "postgres"]
type: note
region: Vùng Database
---

**Snapshot Isolation** là thứ Postgres cài cho mức Repeatable Read: snapshot được chụp ở câu đầu tiên và dùng cho cả transaction. Muốn sửa hoặc khóa một dòng đã đổi sau snapshot thì transaction bị hủy với `40001 could not serialize access due to concurrent update`. Nó chặn lost update và phantom, nhưng không chặn write skew vì chỉ phát hiện xung đột trên cùng một dòng.

Đọc thêm trong bài [[posts/2026-11-22-transactions-isolation|Các mức isolation trong Postgres]].
