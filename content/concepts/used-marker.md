---
title: "Used Marker"
description: "Một mảng cờ ghi phần tử nào đang nằm trên đường đi, để mỗi tầng được chọn lại từ đầu mà không lấy trùng."
tags: [algorithms, neetcode, backtracking]
type: note
region: Vùng Thuật toán
---

Với hoán vị, thứ tự có ý nghĩa nên không dùng được [[concepts/start-index|chỉ số bắt đầu]]: tầng nào cũng phải xét lại mọi phần tử. Mình giữ một mảng `used`: bật cờ trước khi đi sâu, tắt cờ khi quay lên. Cờ chỉ nói phần tử đang nằm trong `path` hay không, nên một lần bật luôn đi kèm đúng một lần tắt.

Đọc thêm trong bài [[posts/2026-11-28-neetcode-permutations-search|MISC-02]] và trang [[problems/permutations|Permutations]].
