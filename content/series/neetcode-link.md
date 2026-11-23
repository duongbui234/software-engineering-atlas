---
title: "Tuyến NeetCode: Cấu trúc liên kết"
description: "Linked List, Trees và Tries của NeetCode 150 gom thành 7 ga: thao tác con trỏ, danh sách nâng cao, đệ quy trên cây, cây tìm kiếm, duyệt theo tầng, dựng cây và trie."
series: neetcode-link
code: LINK
region: Vùng Thuật toán
draft: false
stations:
  - name: "Con trỏ trên danh sách liên kết"
    concepts: [Linked List, Dummy Node, Fast and Slow Pointers, In-place Pointer Reversal]
  - name: "Danh sách liên kết nâng cao"
  - name: "Đệ quy trên cây"
  - name: "Cây nhị phân tìm kiếm"
  - name: "Duyệt theo tầng và mang trạng thái"
  - name: "Dựng và mã hóa cây"
  - name: "Trie"
---

## Nếu bạn mới bắt đầu

Tuyến này cần hash map và heap từ hai tuyến trước ([[series/neetcode-arr|Mảng và chuỗi]], [[series/neetcode-srch|Tìm kiếm và heap]]) và quen với đệ quy.

## Một ga, nhiều bài

Mỗi **ga** là một *pattern*, tức một kỹ thuật giải lặp lại ở nhiều bài. Post của ga dạy kỹ thuật đó qua một bài neo, rồi chỉ ra từng bài còn lại dùng nó khác đi ở đâu. Mỗi bài LeetCode có **trang riêng** trong [[problems/index|kho bài NeetCode 150]], giải kỹ bằng năm ngôn ngữ (TypeScript, Python, Go, Java, JavaScript), có độ phức tạp, phép đo và bẫy hay gặp.

## Vì sao xếp theo thứ tự này

- **Ga 1–2** là danh sách liên kết: đảo, gộp, con trỏ nhanh và chậm, rồi ghép với hash map (LRU Cache) và heap (gộp k danh sách).
- **Ga 3–6** là cây nhị phân: đệ quy trả kết quả từ dưới lên, tính chất của cây tìm kiếm, duyệt theo tầng bằng hàng đợi, và dựng hoặc mã hóa cả cây.
- **Ga 7** là trie, cây theo tiền tố của chuỗi.

## Phiên bản và nguồn

Lời giải chạy thật trên **Node.js 24** (chạy thẳng file `.ts`), **Python 3.12**, **Go 1.25** và **Java 21** (`java File.java`, không cần `javac`). Số đo thời gian đổi theo máy và theo lần chạy; tỉ lệ giữa các cách thì ổn định.

Đề bài thuộc về LeetCode; mỗi trang bài chỉ tóm tắt đề bằng lời của mình và dẫn link. Danh sách và nhóm bài lấy từ dữ liệu công khai của [NeetCode 150](https://neetcode.io/practice); cách gom bài thành ga là của mình. Lời giải, phép đo và sơ đồ là của mình.
