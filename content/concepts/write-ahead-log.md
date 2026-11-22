---
title: "Write-Ahead Log"
description: "Nhật ký thay đổi được ghi xuống đĩa trước khi COMMIT trả lời, để đã commit là không mất."
tags: ["database", "postgres"]
type: note
region: Vùng Database
---

**Write-Ahead Log (WAL)** là nhật ký nối đuôi của mọi thay đổi. Khi COMMIT, Postgres chỉ cần fsync nhật ký (ghi tuần tự, nhanh) rồi trả lời; trang bảng thật được ghi dần lúc checkpoint. Máy sập thì Postgres phát lại WAL từ checkpoint gần nhất. Với `synchronous_commit = on` (mặc định), COMMIT chỉ trả lời sau khi WAL đã xuống đĩa. WAL cũng là thứ được gửi sang bản sao.

Đọc thêm trong bài [[2026-11-22-transactions-acid|Transaction là gì]].
