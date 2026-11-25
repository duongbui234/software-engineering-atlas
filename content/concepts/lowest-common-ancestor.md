---
title: "Lowest Common Ancestor"
description: "Nút sâu nhất có cả hai nút cho trước trong cây con của nó (một nút được tính là tổ tiên của chính nó); trên cây tìm kiếm, đó là chỗ hai đường đi từ gốc tách nhau."
tags: ["algorithms", "tree", "binary-search-tree"]
type: note
region: Vùng Thuật toán
---

**Tổ tiên chung thấp nhất** (LCA) của hai nút p và q là nút **sâu nhất** mà cả p lẫn q đều nằm trong cây con của nó. Một nút được tính là tổ tiên của chính nó, nên nếu p nằm trong cây con của q thì đáp án là q.

Trên một [[concepts/binary-tree|cây nhị phân]] bất kỳ, tìm LCA phải hỏi cả hai cây con ở mọi nút (theo kiểu [[concepts/post-order-traversal|hậu thứ tự]]), O(n). Trên [[concepts/binary-search-tree|cây nhị phân tìm kiếm]] chỉ cần đi một đường từ gốc: cả p và q nhỏ hơn nút thì sang trái, cả hai lớn hơn thì sang phải, còn lại thì hai đường đã tách nhau (hoặc nút chính là p hay q), và đó là đáp án. Chi phí là O(h).

Ngoài LeetCode, LCA là câu hỏi "hai thứ này gặp nhau ở cấp nào": thư mục chung gần nhất của hai đường dẫn, quản lý chung của hai nhân viên, commit chung gần nhất của hai nhánh git (merge base).

Đọc thêm trong bài [[posts/2026-11-25-neetcode-binary-search-tree|ga 4: Cây nhị phân tìm kiếm]].
