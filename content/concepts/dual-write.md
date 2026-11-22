---
title: Ghi hai nơi
description: "Một thao tác phải cập nhật hai hệ thống lưu trữ mà không có transaction chung."
tags: [flash-sale, database]
type: note
region: Vùng Flash sale
---

**Ghi hai nơi** (dual write) xảy ra khi một thao tác phải sửa cả hai hệ thống, ví dụ trừ kho trong Redis rồi tạo đơn trong Postgres. Không có transaction nào bao trùm cả hai, nên tiến trình chết giữa chừng là hai nơi lệch nhau, và khối bù trừ trong `catch` không kịp chạy. Cách xử lý: bỏ hẳn một nơi (Shopify bỏ Redis cho phần giữ kho), ghi dấu để dọn sau, hoặc đối soát theo nguồn đáng tin hơn. Đối soát theo bộ đếm tạm thời là biến lỗi thành dữ liệu chính thức.

Đọc thêm trong bài [[posts/2026-11-21-shopify-flash-sale|Shopify xử lý flash sale thế nào]].
