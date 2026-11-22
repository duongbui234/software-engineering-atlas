---
title: "Search Space Pruning"
description: "Loại cả một nhóm ứng viên bằng một phép so, vì chứng minh được không ứng viên nào trong nhóm là đáp án."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

Thay vì thử từng ứng viên (mọi cặp `(i, j)` là n²/2 lần), **cắt không gian tìm kiếm** chứng minh rằng cả một nhóm không thể chứa đáp án rồi bỏ cả nhóm. Với [[concepts/two-pointers|hai con trỏ]], mỗi bước gạch một hàng của bảng n × n mọi cặp, nên tổng chỉ n − 1 bước. Lý do để cắt phải là một chứng minh, không phải trực giác: Container With Most Water dời cột cao "trông hợp lý" nhưng sai.

Đọc thêm trong bài [[problems/two-sum-ii-input-array-is-sorted|Two Sum II]] và [[problems/container-with-most-water|Container With Most Water]].
