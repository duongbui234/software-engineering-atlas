---
title: "Rotated Sorted Array"
description: "Mảng tăng dần bị cắt ở một chỗ và đảo hai đoạn: hai đoạn tăng dần nối nhau, chia đôi vẫn dùng được."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

**Mảng xoay** là mảng tăng dần bị cắt ở một chỉ số k, rồi đoạn `[0, k)` chuyển ra sau: `[0, 1, 2, 4, 5, 6, 7]` xoay ở k = 4 thành `[4, 5, 6, 7, 0, 1, 2]`. Nó gồm hai đoạn tăng dần nối nhau, với đúng **một** chỗ tụt xuống, và chỗ tụt đó là phần tử nhỏ nhất. Hai hệ quả làm [[concepts/binary-search|chia đôi]] vẫn chạy trong O(log n): câu hỏi "`nums[i] <= nums[n − 1]`?" đổi từ "không" sang "có" đúng một lần (ở chỗ tụt), và cắt bất kỳ đoạn nào ở giữa thì ít nhất một nửa tăng dần trọn vẹn. Khi có số trùng, cả hai hệ quả gãy ở ca ba ô bằng nhau, và ca tệ nhất rơi về O(n).

Đọc thêm trong bài [[problems/find-minimum-in-rotated-sorted-array|Find Minimum in Rotated Sorted Array]] và [[problems/search-in-rotated-sorted-array|Search in Rotated Sorted Array]].
