---
title: JSON
description: "Định dạng dữ liệu phổ biến nhất của API, chỉ có sáu kiểu và một kiểu số."
tags: [api, http]
type: note
region: Vùng API
---

**JSON** chỉ có string, number, boolean, null, object và array. Không có kiểu ngày, không có decimal, và number thường bị parse thành số thực 64-bit, nên tiền và id lớn nên gửi dạng string, ngày tháng theo ISO 8601.

Đọc thêm trong bài [[2026-11-18-api-foundations|Nền tảng API]].
