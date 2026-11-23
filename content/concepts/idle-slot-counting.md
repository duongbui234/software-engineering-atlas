---
title: "Idle Slot Counting"
description: "Đếm số nhịp nghỉ tối thiểu khi mỗi việc phải nguội n nhịp: việc nhiều nhất f lần dựng f − 1 khung dài n + 1, cộng k việc cùng đạt f; đáp án là max(số việc, (f − 1)(n + 1) + k)."
tags: ["algorithms", "greedy"]
type: note
region: Vùng Thuật toán
---

Khi hai lần chạy cùng một việc phải cách nhau ít nhất n + 1 nhịp, việc xuất hiện nhiều nhất (f lần) quyết định khung xương của lịch: nó cần f − 1 **khung** dài n + 1 rồi thêm một lần cuối. Có k việc cùng đạt f thì khung cuối có k ô. Các việc khác lấp vào chỗ trống trong khung; chỗ nào không lấp được thành nhịp nghỉ. Vì thế đáp án là `max(số việc, (f − 1)(n + 1) + k)`: vế phải là cận dưới do việc nhiều nhất áp đặt, vế trái là khi việc nhiều tới mức lấp kín mọi khung và không còn nhịp nghỉ. Muốn in lịch thật thì rải các việc còn lại theo cột qua các khung, theo số lần **giảm dần**; rải tăng dần có thể đặt hai lần cùng một việc quá gần nhau. Ý này dùng lại được ở các bài "sắp xếp sao cho hai phần tử giống nhau cách nhau ít nhất k".

Đọc thêm trong bài [[problems/task-scheduler|Task Scheduler (LC 621)]].
