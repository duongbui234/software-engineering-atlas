---
title: "Hash Set"
description: "Tập hợp dùng hash để trả lời \"có x chưa?\" trong thời gian O(1) trung bình."
tags: ["algorithms", "hashing"]
type: note
region: Vùng Thuật toán
---

Một **hash set** tính hash của phần tử để biết nó phải nằm ở ô nào, rồi chỉ nhìn ô đó, nên tra và thêm mất O(1) trung bình. JS/TS có `Set` (so khóa bằng SameValueZero), Python có `set`, Java có `HashSet` (bên trong là một `HashMap`), còn Go dùng `map[T]struct{}`. Viết vòng lặp có `has` rồi `add` để dừng ngay khi gặp phần tử trùng.

Đọc thêm trong bài [[posts/2026-11-22-neetcode-contains-duplicate|Contains Duplicate]].
