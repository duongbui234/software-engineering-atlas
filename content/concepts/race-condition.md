---
title: "Race Condition"
description: "Kết quả phụ thuộc vào thứ tự ngẫu nhiên mà các thao tác đồng thời chen vào nhau."
tags: ["concurrency", "database"]
type: note
region: Vùng Database
---

Một **race condition** xảy ra khi có ít nhất một thứ tự chen nhau của các request đồng thời cho kết quả sai. Nó không hiện ra khi test tuần tự, mỗi lần chạy ra một con số khác, và thường chỉ xuất hiện lúc tải cao nhất. Flash sale là điều kiện lý tưởng cho nó: hàng nghìn request cùng một sản phẩm trong cùng một giây.

Đọc thêm trong bài [[posts/2026-11-22-transactions-race|Race condition: tái hiện bán quá số hàng]].
