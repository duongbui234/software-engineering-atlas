---
title: "Hash Map"
description: "Bảng khóa → giá trị dùng hash để tra cứu trong O(1) trung bình."
tags: ["algorithms", "hashing"]
type: note
region: Vùng Thuật toán
---

Một **hash map** là hash set có thêm một giá trị đi kèm mỗi khóa: số lần đếm, vị trí, danh sách. JS/TS có `Map` (giữ kiểu khóa, khác object thuần), Python có `dict`, Go có `map`, Java có `HashMap`. Khóa phải "băm được" và so sánh được theo nội dung; mảng trong JS và Java bị so theo danh tính, list trong Python không băm được.

Đọc thêm trong bài [[posts/2026-11-22-neetcode-valid-anagram|Valid Anagram]].
