---
title: "Tuyến NeetCode: Mảng và chuỗi"
description: "Bốn nhóm đầu của NeetCode 150 (Arrays & Hashing, Two Pointers, Sliding Window, Stack) gom thành 7 ga theo kỹ thuật giải: tra cứu bằng hash, khóa chuẩn, hai con trỏ, cửa sổ trượt và ngăn xếp."
series: neetcode-arr
code: ARR
region: Vùng Thuật toán
draft: false
aliases: [series/neetcode-arrays-hashing]
stations:
  - name: "Tra cứu bằng hash"
    concepts: [Big-O Notation, Brute Force, Hash Set, Sort Then Scan, Space-Time Tradeoff, Complement Lookup, One-pass Hash Map, Two Pointers, Hash Collision, Amortized O(1), Aggregate Analysis]
  - name: "Khóa chuẩn và đếm tần suất"
    concepts: [Frequency Counting, Counting Array, Hash Map, Unicode Normalization, Canonical Key, Count Key, Key Serialization, Group By, Heap, Bucket Sort, Quickselect, Sorting Lower Bound, Bitmask]
  - name: "Tiền tố, hậu tố và mã hóa"
    concepts: [Prefix Sum, Prefix and Suffix Products, Length-prefix Encoding, Delimiter Collision, Escaping]
  - name: "Hai con trỏ"
    concepts: [Search Space Pruning, k-Sum Reduction, Duplicate Skipping, Prefix Maximum]
  - name: "Cửa sổ trượt"
    concepts: [Sliding Window, Window Invariant, Last-seen Index, Running Minimum, Fixed-size Window, Monotonic Deque, Non-shrinking Window]
  - name: "Ngăn xếp"
    concepts: [Stack, Bracket Matching, Auxiliary Min Stack, Reverse Polish Notation, Backtracking, Catalan Number]
  - name: "Ngăn xếp đơn điệu"
    concepts: [Monotonic Stack, Next Greater Element, Sentinel Value]
---

## Nếu bạn mới bắt đầu

[NeetCode 150](https://neetcode.io/practice) là danh sách 150 bài LeetCode được chọn và xếp theo **mẫu giải** (pattern), không theo độ khó. Tuyến này gom 27 bài đầu tiên. Cả tuyến xoay quanh mảng và chuỗi, và câu hỏi lặp lại nhiều nhất là *làm sao biết nhanh "mình đã gặp cái này chưa?"*.

Bạn chỉ cần biết viết vòng lặp `for` và hàm trong một ngôn ngữ bất kỳ. Mỗi post mở đầu bằng **"Hình dung trước"**, đặt kỹ thuật vào một chuyện đời thường, kèm một **từ điển nhanh** cho các thuật ngữ mới.

## Một ga, nhiều bài

Mỗi **ga** là một *pattern*, tức một kỹ thuật giải lặp lại ở nhiều bài. Post của ga dạy kỹ thuật đó qua một bài neo, rồi chỉ ra từng bài còn lại dùng nó khác đi ở đâu. Mỗi bài LeetCode có **trang riêng** trong [[problems/index|kho bài NeetCode 150]], giải kỹ bằng năm ngôn ngữ (TypeScript, Python, Go, Java, JavaScript), có độ phức tạp, phép đo và bẫy hay gặp.

## Vì sao xếp theo thứ tự này

- **Ga 1–2** dựng công cụ nền: hash set và hash map trả lời "đã gặp chưa?" và "gặp bao nhiêu lần?" trong O(1) trung bình, rồi biến bảng đếm thành *khóa* để gom nhóm.
- **Ga 3** thay hash bằng mảng phụ: tích lũy từ trái và từ phải (tiền tố, hậu tố), và cách mã hóa một danh sách chuỗi thành một chuỗi.
- **Ga 4–5** khai thác thứ tự: hai con trỏ đi từ hai đầu, rồi cửa sổ trượt co giãn một đoạn liên tiếp, thường dùng lại bảng đếm của ga 2.
- **Ga 6–7** thêm ngăn xếp: khớp ngoặc, tính biểu thức, rồi ngăn xếp đơn điệu tìm "phần tử lớn hơn kế tiếp" trong O(n).

## Phiên bản và nguồn

Lời giải chạy thật trên **Node.js 24** (chạy thẳng file `.ts`), **Python 3.12**, **Go 1.25** và **Java 21** (`java File.java`, không cần `javac`). Số đo thời gian đổi theo máy và theo lần chạy; tỉ lệ giữa các cách thì ổn định.

Đề bài thuộc về LeetCode; mỗi trang bài chỉ tóm tắt đề bằng lời của mình và dẫn link. Danh sách và nhóm bài lấy từ dữ liệu công khai của [NeetCode 150](https://neetcode.io/practice); cách gom bài thành ga là của mình. Lời giải, phép đo và sơ đồ là của mình.
