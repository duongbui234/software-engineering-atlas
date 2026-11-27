---
title: "Memoized DFS"
description: "Để đệ quy tự tìm thứ tự tính các trạng thái, và lưu đáp án của từng đỉnh khi đồ thị không có chu trình."
tags: [algorithms, neetcode, dynamic-programming, graph]
type: note
region: Vùng Thuật toán
---

Khi các trạng thái không xếp được thành một vòng quét đơn giản, mình gọi DFS từ một đỉnh và để nó hỏi các đỉnh kề trước. Nếu cạnh luôn đi theo một chiều tăng nghiêm ngặt, đồ thị không có chu trình, nên không cần tập đã thăm: lần đầu tính xong một đỉnh thì lưu lại, lần sau chỉ đọc. Thứ tự kết thúc của DFS chính là một thứ tự topo, và cách lột lớp theo bậc là bản lặp thay cho đệ quy sâu.

Đọc thêm trong bài [[posts/2026-11-27-neetcode-state-machine-dp|DP-06]] và trang [[problems/longest-increasing-path-in-a-matrix|Longest Increasing Path in a Matrix]].
