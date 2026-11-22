---
title: "Read-Modify-Write"
description: "Đọc giá trị lên app, tính giá trị mới, ghi xuống: khe hở giữa đọc và ghi gây ra race condition."
tags: ["concurrency", "database"]
type: note
region: Vùng Database
---

**Read-modify-write** là mẫu code đọc một giá trị từ database, tính trong app, rồi ghi kết quả xuống. Giữa đọc và ghi, con số chỉ sống trong biến của app nên request khác vẫn đọc được cùng con số đó. Biến thể check-then-act để database tự trừ (`stock = stock - 1`) nhưng vẫn quyết định dựa trên con số đã đọc trước. Cách sửa là đưa điều kiện vào chính câu ghi, hoặc khóa dòng trước khi đọc.

Đọc thêm trong bài [[posts/2026-11-22-transactions-race|Race condition: tái hiện bán quá số hàng]].
