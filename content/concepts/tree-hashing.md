---
title: "Tree Hashing"
description: "Gán cho mỗi cây con một mã tính từ giá trị gốc và mã hai con, để hai cây con giống hệt nhau có cùng mã và so được trong O(1)."
tags: ["algorithms", "tree", "hashing"]
type: note
region: Vùng Thuật toán
---

So hai [[concepts/binary-tree|cây]] bằng cách đi song song tốn O(kích thước). Nếu phải so nhiều lần, như ở [[problems/subtree-of-another-tree|Subtree of Another Tree]] (thử mọi nút của cây lớn làm gốc), chi phí lên O(m · n). **Băm cây** tính một mã cho mỗi cây con theo [[concepts/post-order-traversal|hậu thứ tự]]: `mã(nút) = H(giá trị, mã(trái), mã(phải))`, cây rỗng có một mã cố định. Hai cây con giống hệt nhau thì có cùng mã, nên kiểm "cây con có xuất hiện không" chỉ còn là tra mã của cây nhỏ trong tập mã của cây lớn: O(m + n). Đây cũng là ý của cây Merkle mà Git dùng cho thư mục.

Hai cách chọn `H`: một hàm băm số (nhanh, nhưng hai cây khác nhau có thể trùng mã, nên phải so lại bằng cách đi song song khi mã khớp), hoặc **đánh số chuẩn**: dùng một [[concepts/hash-map|hash map]] từ bộ `(giá trị, số của trái, số của phải)` sang một số nguyên mới. Cách đánh số không bao giờ trùng, vì hai bộ khác nhau luôn nhận hai số khác nhau.

Đọc thêm trong bài [[posts/2026-11-25-neetcode-tree-recursion|ga 3: Đệ quy trên cây]].
