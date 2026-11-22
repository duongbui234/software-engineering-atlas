---
title: "Length-prefix Encoding"
description: "Ghi độ dài trước nội dung để bộ giải mã biết cắt ở đâu mà không cần dấu phân cách."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

Mỗi phần thành `<độ dài><dấu kết thúc độ dài><nội dung>`, ví dụ `5#hello`. Bộ giải mã đọc độ dài rồi nhảy qua đúng chừng ấy ký tự, nên nội dung chứa ký tự gì cũng được, không cần [[concepts/escaping|thoát ký tự]]. HTTP `Content-Length` và các giao thức nhị phân dùng cách này. Hai đầu phải đếm cùng đơn vị: byte, code point hay đơn vị UTF-16.

Đọc thêm trong bài [[problems/encode-and-decode-strings|Encode and Decode Strings]].
