---
title: "Isolation Level"
description: "Mức quy định một transaction thấy gì khi transaction khác đang ghi cùng lúc."
tags: ["database", "isolation"]
type: note
region: Vùng Database
---

**Isolation level** quyết định những bất thường nào có thể xảy ra giữa các transaction đồng thời. Postgres có ba mức thật: Read Committed (mặc định), Repeatable Read (thực chất là Snapshot Isolation) và Serializable. Bảng chuẩn SQL chỉ nói về dirty read, non-repeatable read và phantom; nó không nhắc tới lost update hay write skew, hai lỗi flash sale thật sự gặp.

Đọc thêm trong bài [[posts/2026-11-22-transactions-isolation|Các mức isolation trong Postgres]].
