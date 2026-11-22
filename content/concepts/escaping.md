---
title: "Escaping"
description: "Đánh dấu một ký tự đặc biệt là chữ thường bằng một ký tự thoát đặt trước nó."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

JSON viết `\"` cho dấu ngoặc kép trong chuỗi và `\\` cho chính dấu gạch ngược. Quy tắc bắt buộc: phải thoát **cả** ký tự thoát, nếu không `a\` theo sau là ký tự đặc biệt sẽ bị đọc nhầm. Bộ giải mã phải đọc từng ký tự để biết ký tự nào đã bị thoát, chậm hơn [[concepts/length-prefix-encoding|tiền tố độ dài]] nhưng giữ được dạng đọc được bằng mắt. Xem [[concepts/delimiter-collision|Delimiter Collision]].

Đọc thêm trong bài [[problems/encode-and-decode-strings|Encode and Decode Strings]].
