---
title: "Trie Prefix Pruning"
description: "Dừng một đường tìm kiếm khi từ điển thiếu cạnh cho ký tự tiếp theo."
tags: [algorithms, tree, trie]
type: note
region: Vùng Thuật toán
---

**Cắt nhánh theo tiền tố** dùng nút [[concepts/trie|trie]] hiện tại để ghi phần đường đã khớp. Khi ký tự mới thiếu cạnh tương ứng, mọi phần nối dài đều có cùng tiền tố vắng mặt, nên mình có thể bỏ cả nhánh. Trên bảng chữ, mình vẫn cần [[concepts/backtracking|quay lui]] để bảo đảm mỗi ô chỉ xuất hiện một lần trên đường đang thử.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-trie|ga 7: Trie]].
