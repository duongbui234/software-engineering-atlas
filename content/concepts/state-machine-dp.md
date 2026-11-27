---
title: "State Machine DP"
description: "Thêm vào chỉ số một trạng thái nhỏ như đang giữ, vừa bán, đang nghỉ, rồi viết các bước chuyển giữa chúng."
tags: [algorithms, neetcode, dynamic-programming]
type: note
region: Vùng Thuật toán
---

Khi chỉ biết mình đang ở ngày i thì chưa đủ để quyết định, mình hỏi thêm: lúc này mình đang ở tình trạng nào? Mỗi tình trạng là một ô của máy trạng thái, mỗi hành động (mua, bán, nghỉ) là một mũi tên sang tình trạng của ngày sau. Giá trị tốt nhất của ngày i + 1 chỉ đọc các tình trạng của ngày i, nên giữ vài biến là đủ.

Đọc thêm trong bài [[posts/2026-11-27-neetcode-state-machine-dp|DP-06]] và trang [[problems/best-time-to-buy-and-sell-stock-with-cooldown|Best Time to Buy and Sell Stock with Cooldown]].
