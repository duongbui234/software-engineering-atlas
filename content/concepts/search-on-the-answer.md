---
title: "Search on the Answer"
description: "Tìm kiếm nhị phân không trên mảng mà trên khoảng các đáp án có thể có, nhờ một câu hỏi có/không đổi chiều đúng một lần: tốc độ nhỏ nhất, sức chứa nhỏ nhất, thời điểm sớm nhất."
tags: ["algorithms", "binary-search"]
type: note
region: Vùng Thuật toán
---

Khi đề hỏi "giá trị **nhỏ nhất** (hay lớn nhất) sao cho còn làm được việc X", đáp án là một số trong khoảng `[lo, hi]` biết trước, và thường không có mảng nào để tìm. Nếu kiểm tra "với giá trị k, có làm được X không?" dễ hơn tìm thẳng k, và câu trả lời là một [[concepts/monotonic-predicate|vị từ đơn điệu]] (sai, sai, …, đúng, đúng), thì [[concepts/binary-search|tìm kiếm nhị phân]] trên chính khoảng đáp án tìm ra ranh giới sau khoảng log₂(hi − lo) lần kiểm tra. Khuôn là [[concepts/lower-bound|cận dưới]]: kịp thì `hi = mid` (giữ `mid`), không kịp thì `lo = mid + 1`. Chi phí là log₂(hi − lo) nhân chi phí một lần kiểm tra, thường O(n log max).

Đọc thêm trong bài [[problems/koko-eating-bananas|Koko Eating Bananas (LC 875)]] và [[posts/2026-11-23-neetcode-binary-search-answer|ga 2: Tìm kiếm nhị phân trên đáp án]].
