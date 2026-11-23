---
title: "Tuyến NeetCode: Tìm kiếm và heap"
description: "Binary Search và Heap của NeetCode 150 gom thành 4 ga: chia đôi trên mảng, chia đôi trên đáp án, heap cho top K, và hai heap cho dòng dữ liệu."
series: neetcode-srch
code: SRCH
region: Vùng Thuật toán
draft: false
stations:
  - name: "Tìm kiếm nhị phân trên mảng"
    concepts: [Binary Search, Loop Invariant, Half-open Interval, Midpoint Overflow, Lower Bound, Rotated Sorted Array]
  - name: "Tìm kiếm nhị phân trên đáp án"
  - name: "Heap và top K"
  - name: "Hai heap và lập lịch"
---

## Nếu bạn mới bắt đầu

Tuyến này cần vòng lặp, mảng và Big-O (xem [[series/neetcode-arr|tuyến Mảng và chuỗi]]). Heap đã xuất hiện một lần ở bài [[problems/top-k-frequent-elements|Top K Frequent Elements]]; ở đây nó có ga riêng.

## Một ga, nhiều bài

Mỗi **ga** là một *pattern*, tức một kỹ thuật giải lặp lại ở nhiều bài. Post của ga dạy kỹ thuật đó qua một bài neo, rồi chỉ ra từng bài còn lại dùng nó khác đi ở đâu. Mỗi bài LeetCode có **trang riêng** trong [[problems/index|kho bài NeetCode 150]], giải kỹ bằng năm ngôn ngữ (TypeScript, Python, Go, Java, JavaScript), có độ phức tạp, phép đo và bẫy hay gặp.

## Vì sao xếp theo thứ tự này

- **Ga 1** là chia đôi cổ điển trên mảng đã sắp xếp, kể cả mảng bị xoay và ma trận.
- **Ga 2** chia đôi trên *không gian đáp án*: đoán một giá trị, kiểm tra được hay không, rồi thu hẹp.
- **Ga 3** chuyển sang heap: giữ k phần tử tốt nhất mà không sắp xếp cả mảng.
- **Ga 4** ghép hai heap và hàng đợi ưu tiên để xử lý dòng dữ liệu và lập lịch.

## Phiên bản và nguồn

Lời giải chạy thật trên **Node.js 24** (chạy thẳng file `.ts`), **Python 3.12**, **Go 1.25** và **Java 21** (`java File.java`, không cần `javac`). Số đo thời gian đổi theo máy và theo lần chạy; tỉ lệ giữa các cách thì ổn định.

Đề bài thuộc về LeetCode; mỗi trang bài chỉ tóm tắt đề bằng lời của mình và dẫn link. Danh sách và nhóm bài lấy từ dữ liệu công khai của [NeetCode 150](https://neetcode.io/practice); cách gom bài thành ga là của mình. Lời giải, phép đo và sơ đồ là của mình.
