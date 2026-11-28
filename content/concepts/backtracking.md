---
title: "Backtracking"
description: "Thử một lựa chọn, đi tiếp, rồi gỡ nó ra để thử lựa chọn khác; cắt sớm nhánh không thể thành đáp án."
tags: ["algorithms", "stack"]
type: note
region: Vùng Thuật toán
---

Lời giải đang dựng là một [[concepts/stack|ngăn xếp]] các lựa chọn: thêm một lựa chọn (`push`), gọi đệ quy, rồi bỏ nó ra (`pop`). Sức mạnh nằm ở điều kiện cắt nhánh: Generate Parentheses chỉ thêm `)` khi số `)` ít hơn số `(`, nên không bao giờ dựng chuỗi sai rồi mới lọc. Quên bước gỡ lựa chọn là lỗi hay gặp nhất.

Đọc thêm trong bài [[posts/2026-11-23-neetcode-stack|ga 6: Ngăn xếp]].

Đọc thêm trong bài [[posts/2026-11-26-neetcode-trie|ga 7: Trie]], nơi một cạnh trie bị thiếu cho phép dừng sớm đường đang dò.

Ga [[posts/2026-11-28-neetcode-subsets-combinations|MISC-01: Quay lui: tập con và tổ hợp]] gom các bài tập con và tổ hợp về cùng một khuôn: chọn, đi tiếp, gỡ ra. Các bài chỉ khác nhau ở chỗ ghi đáp án, chỉ số bắt đầu của lượt sau và cách bỏ bản trùng.
