---
title: "Pessimistic Locking"
description: "Khóa dòng trước khi đọc bằng SELECT FOR UPDATE; ai tới sau xếp hàng chờ."
tags: ["database", "locking"]
type: note
region: Vùng Database
---

**Khóa bi quan** giả định xung đột sẽ xảy ra: `SELECT … FOR UPDATE` khóa dòng ngay lúc đọc, request khác chờ và (ở Read Committed) nhận phiên bản mới nhất khi được nhả ra. Đúng, không retry, hợp khi tranh chấp cao. Cái giá là khóa giữ suốt từ lúc đọc tới COMMIT; đừng gọi API ngoài hay chờ người dùng trong khoảng đó.

Đọc thêm trong bài [[posts/2026-11-22-transactions-locking|Khóa bi quan và khóa lạc quan]].
