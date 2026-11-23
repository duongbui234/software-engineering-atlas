---
title: "Fan-out on Write"
description: "Khi ai đó đăng bài, chép bài vào bảng tin dựng sẵn của từng người theo dõi; đọc bảng tin chỉ còn lấy vài phần tử đầu, đổi lại một lần ghi tốn tỉ lệ với số người theo dõi."
tags: ["caching", "patterns"]
type: note
region: Vùng Cache
---

**Fan-out on write** (đẩy lúc ghi) dựng sẵn bảng tin của mỗi người như một bộ nhớ đệm: khi một tài khoản đăng bài, bài được chép vào bảng tin của từng người theo dõi nó. Đọc trở nên rẻ (lấy 10 phần tử đầu), còn ghi đắt dần theo số người theo dõi: một phép đo trong bộ nhớ cho 0,011 ms với 100 người theo dõi và 73 ms với 10⁶. Cách ngược lại là **fan-out on read** (đọc lúc cần): mỗi lần mở bảng tin thì trộn danh sách bài của những người mình theo dõi, ghi rẻ mà đọc đắt. Hệ thống thật thường lai: đẩy lúc ghi cho phần lớn tài khoản, còn bài của tài khoản có rất nhiều người theo dõi thì lấy riêng và trộn vào lúc đọc (Kleppmann, *Designing Data-Intensive Applications*, chương 1).

Đọc thêm trong bài [[problems/design-twitter|Design Twitter (LC 355)]].
