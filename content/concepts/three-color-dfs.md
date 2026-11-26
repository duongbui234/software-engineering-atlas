---
title: "Three-Color DFS"
description: "DFS đánh dấu mỗi đỉnh trắng, xám hoặc đen; gặp lại một đỉnh xám nghĩa là có vòng."
tags: [algorithms, graph, topological-sort]
type: note
region: Vùng Thuật toán
---

**DFS ba màu** gắn cho mỗi đỉnh một trạng thái: trắng (chưa đụng tới), xám (đang trên đường đi hiện tại, chưa xong) và đen (đã đi hết mọi nhánh). Đi theo một cạnh mà gặp đỉnh xám là quay lại chính đường mình đang đi: có vòng. Gặp đỉnh đen thì không sao, nhánh đó đã kiểm tra xong.

Một tập "đã thăm" duy nhất không đủ: nó trộn xám với đen nên báo nhầm vòng khi hai đường gặp nhau ở cùng một đỉnh (hình kim cương). Thứ tự các đỉnh chuyển sang đen, đảo ngược lại, là một [[concepts/topological-sort|thứ tự topo]]. Đệ quy sâu cỡ số đỉnh, nên với chuỗi dài nên viết bằng ngăn xếp tự quản.

Đọc thêm trong bài [[posts/2026-11-26-neetcode-topological-sort|ga 3: Sắp xếp topo]].
