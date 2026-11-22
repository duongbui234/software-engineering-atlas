---
title: "Re-check After Lock"
description: "Ở Read Committed, UPDATE phải chờ khóa sẽ chạy lại WHERE trên phiên bản dòng mới nhất."
tags: ["database", "postgres", "isolation"]
type: note
region: Vùng Database
---

Khi `UPDATE` ở Read Committed gặp dòng đang bị sửa, nó chờ; nếu bên kia commit, Postgres lấy phiên bản mới nhất và **chạy lại điều kiện `WHERE`** (trong mã nguồn gọi là EvalPlanQual). Còn khớp thì áp thao tác lên bản mới, không khớp thì bỏ qua dòng. Nhờ vậy, còn 1 suất mà hai người cùng trừ thì người sau nhận 0 dòng thay vì trừ xuống -1. Ở Repeatable Read, cùng tình huống lại là lỗi `40001`.

Đọc thêm trong bài [[posts/2026-11-22-transactions-atomic-update|Trừ kho bằng một câu UPDATE]].
