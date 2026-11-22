---
title: "Write Skew"
description: "Hai transaction đọc cùng dữ liệu rồi ghi vào hai dòng khác nhau, cùng vi phạm một luật trải nhiều dòng."
tags: ["database", "isolation"]
type: note
region: Vùng Database
---

**Write skew**: user đã có 1 đơn, giới hạn 2; hai tab cùng đếm thấy 1, cùng `INSERT` một đơn mới, user có 3 đơn. Không ai ghi đè ai, nên Snapshot Isolation (Repeatable Read của Postgres) không thấy xung đột. Chỉ Serializable, một ràng buộc `UNIQUE`, hoặc khóa trên cả nhóm dữ liệu mới chặn được. Ví dụ kinh điển: hai bác sĩ cùng xin nghỉ khi thấy người kia còn trực.

Đọc thêm trong bài [[posts/2026-11-22-transactions-isolation|Các mức isolation trong Postgres]].
