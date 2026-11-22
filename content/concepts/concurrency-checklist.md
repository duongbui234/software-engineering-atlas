---
title: "Concurrency Checklist"
description: "Mười hai điều cần kiểm tra ở bất kỳ chỗ nào nhiều request cùng ghi."
tags: ["database", "concurrency"]
type: note
region: Vùng Database
---

Tóm tắt của tuyến Transaction và khóa: một transaction cho mỗi thao tác nhiều bước; không read-modify-write; biết mức isolation; điều kiện nằm trong `WHERE` và luôn kiểm tra số dòng; luật nhiều dòng có `UNIQUE` hoặc Serializable; `CHECK` cho bất biến; chọn khóa có chủ đích; khóa theo thứ tự; không gọi API ngoài trong transaction; retry có jitter chỉ là lưới; chặn bớt trước dòng nóng; bù trừ và đối soát khi có hai nguồn dữ liệu.

Đọc thêm trong bài [[posts/2026-11-22-transactions-flash-sale|Flash sale không bán quá số hàng]].
