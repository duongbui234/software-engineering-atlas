---
title: "Delimiter Collision"
description: "Dấu phân cách hỏng khi dữ liệu chứa chính nó: phần bị tách sai, và danh sách rỗng lẫn với một chuỗi rỗng."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

Nối `["a,b", "c"]` bằng dấu phẩy ra `a,b,c`, và tách lại thành ba phần. Chọn ký tự hiếm hơn chỉ làm lỗi hiếm hơn. Hai cách sửa: [[concepts/escaping|thoát ký tự]] hoặc [[concepts/length-prefix-encoding|tiền tố độ dài]]. Đây cũng là gốc của nhiều lỗi bảo mật kiểu injection, khi dữ liệu người dùng bị đọc thành cấu trúc.

Đọc thêm trong bài [[problems/encode-and-decode-strings|Encode and Decode Strings]].
