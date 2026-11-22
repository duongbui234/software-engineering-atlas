---
title: "Hot Row"
description: "Một dòng mà rất nhiều transaction cùng muốn ghi trong cùng một lúc."
tags: ["database", "locking", "flash-sale"]
type: note
region: Vùng Database
---

Một **dòng nóng** (tồn kho sản phẩm flash sale, bộ đếm voucher toàn sàn) giới hạn thông lượng ở mức xấp xỉ 1 chia cho thời gian giữ khóa, vì chỉ một transaction được ghi tại một thời điểm. Mọi chiến lược khóa đều chịu giới hạn đó. Chỉ có hai lối ra: giữ khóa ngắn hơn, hoặc chặn bớt request trước khi chúng tới dòng đó (như cổng Redis của flash-sale).

Đọc thêm trong bài [[2026-11-22-transactions-locking|Khóa bi quan và khóa lạc quan]].
