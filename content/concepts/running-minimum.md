---
title: "Running Minimum"
description: "Một biến giữ giá trị nhỏ nhất trong các phần tử đã đi qua, cập nhật O(1) mỗi bước."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

**Giá trị nhỏ nhất từ trước tới nay** là một biến: mỗi bước, `min = min(min, x)`. Khi câu trả lời cho vị trí j chỉ cần một con số về quá khứ (như giá mua rẻ nhất trước ngày bán j), biến này thay cho cả một vòng lặp lồng, đưa O(n²) về O(n) với O(1) bộ nhớ. Thứ tự quan trọng: dùng giá trị cũ để tính đáp án trước, rồi mới cập nhật.

Đọc thêm trong bài [[problems/best-time-to-buy-and-sell-stock|Best Time to Buy and Sell Stock]].
