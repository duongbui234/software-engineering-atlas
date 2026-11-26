---
title: "Sparse Trie Children"
description: "Dùng bảng ánh xạ theo ký tự để lưu những cạnh con thực sự tồn tại."
tags: [algorithms, tree, trie]
type: note
region: Vùng Thuật toán
---

Khi phần lớn nút [[concepts/trie|trie]] chỉ có vài con, mình có thể dùng map và cấp chỗ cho cạnh lúc chèn. Mảng cố định dành một ô cho mọi ký tự ở mỗi nút và cho phép tra chỉ số trực tiếp. Chi phí map và cách runtime cấp bộ nhớ quyết định lựa chọn nào gọn hơn với dữ liệu thật.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-trie|ga 7: Trie]].
