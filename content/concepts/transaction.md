---
title: "Transaction"
description: "Một khối câu lệnh có hiệu lực cùng nhau hoặc không câu nào có hiệu lực."
tags: ["database", "transaction"]
type: note
region: Vùng Database
---

Một **transaction** gom nhiều câu lệnh giữa `BEGIN` và `COMMIT` thành một khối: lỗi, mất kết nối hay pod chết giữa chừng thì cả khối bị bỏ. Không có `BEGIN`, mỗi câu tự commit riêng và trạng thái dở dang là trạng thái thật. Transaction lo chuyện "tất cả hoặc không gì cả", nhưng không tự chống hai request cùng đọc một con số cũ; đó là chuyện của isolation và khóa.

Đọc thêm trong bài [[2026-11-22-transactions-acid|Transaction là gì]].
