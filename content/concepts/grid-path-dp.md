---
title: "Grid Path DP"
description: "Đếm hoặc tối ưu đường đi trên lưới bằng cách tính mỗi ô từ những ô có thể bước vào nó."
tags: [algorithms, neetcode, dynamic-programming]
type: note
region: Vùng Thuật toán
---

Mình coi mỗi ô là một trạng thái: số cách hoặc chi phí tốt nhất để đi từ ô xuất phát tới đó. Khi chỉ được bước sang phải hoặc xuống dưới, ô (i, j) chỉ nhận từ ô bên trên và ô bên trái, nên quét từng hàng từ trái sang phải luôn có sẵn hai giá trị cần đọc. Hàng và cột đầu tiên là trường hợp cơ sở vì chỉ có một hướng đi vào.

Đọc thêm trong bài [[posts/2026-11-27-neetcode-grid-two-strings|DP-05]] và trang [[problems/unique-paths|Unique Paths]].
