---
title: "Tuyến NeetCode 150: Arrays & Hashing"
description: "Giải kỹ từng bài trong nhóm đầu tiên của NeetCode 150 bằng năm ngôn ngữ (TypeScript, JavaScript, Python, Go, Java): không chỉ lời giải tối ưu, mà vì sao nó nhanh, đo thật xem nó nhanh tới đâu, và mỗi ngôn ngữ giấu bẫy gì bên dưới hash table và hàm sort."
series: neetcode-arrays-hashing
code: NC
region: Vùng Thuật toán
draft: false
stations:
  - name: Contains Duplicate
    concepts: [Big-O Notation, Brute Force, Hash Set, Sort Then Scan, Space-Time Tradeoff]
  - name: Valid Anagram
    concepts: [Frequency Counting, Counting Array, Hash Map, Unicode Normalization]
  - name: Two Sum
    concepts: [Complement Lookup, One-pass Hash Map, Two Pointers, Hash Collision, Amortized O(1)]
  - name: Group Anagrams
    concepts: [Canonical Key, Count Key, Key Serialization, Group By]
  - name: Top K Frequent Elements
    concepts: [Heap, Bucket Sort, Quickselect, Sorting Lower Bound]
  - name: Product of Array Except Self
  - name: Valid Sudoku
  - name: Encode and Decode Strings
  - name: Longest Consecutive Sequence
---

## Nếu bạn mới bắt đầu

[NeetCode 150](https://neetcode.io/practice) là danh sách 150 bài LeetCode được chọn và xếp theo **mẫu giải** (pattern), không theo độ khó. Nhóm đầu tiên, **Arrays & Hashing**, có 9 bài, và cả 9 bài xoay quanh cùng một câu hỏi: *làm sao biết nhanh "mình đã gặp cái này chưa?"*. Câu trả lời gần như luôn là một hash table, tức `Set` hay `Map` mà ngôn ngữ nào cũng có sẵn.

Bạn chỉ cần biết viết vòng lặp `for` và hàm trong một ngôn ngữ bất kỳ. Mỗi ga mở đầu bằng **"Hình dung trước"**, đặt bài toán vào một chuyện đời thường (soát vé, xếp chữ, tìm người ghép đôi, chia thư vào ngăn, đếm phiếu bầu), kèm một **từ điển nhanh** cho các thuật ngữ mới.

## Mỗi ga có gì

- **Đề bài viết lại bằng lời của mình**, kèm giới hạn input (vì chính giới hạn quyết định lời giải nào được chấp nhận).
- **Mọi cách giải**, từ vét cạn tới tối ưu, mỗi cách có độ phức tạp thời gian và bộ nhớ.
- **Lời giải chạy được bằng năm ngôn ngữ**: TypeScript, JavaScript, Python, Go, Java. Mỗi file tự chạy test của nó.
- **Một phép đo thật** trên máy, vì Big-O chỉ nói về hình dạng của đường cong, không nói về hằng số. Có những ga mà cách "O(n)" lại chậm hơn cách "O(n log n)".
- **Bên dưới mỗi ngôn ngữ**: `Set` của V8, `dict` của Python, `map` của Go, `HashMap` của Java khác nhau ở đâu, và bẫy nào chỉ một ngôn ngữ có.

## Vì sao xếp theo thứ tự này

Đây là đúng thứ tự của NeetCode, và nó dựng dần từng lớp:

- **Ga 1** dạy cách đo (Big-O) và công cụ cơ bản nhất: một tập hợp các thứ đã thấy.
- **Ga 2** chuyển từ "đã thấy chưa" sang "thấy bao nhiêu lần": đếm.
- **Ga 3** lưu thêm *vị trí* bên cạnh giá trị, và hỏi về một thứ *chưa* thấy (số còn thiếu). Ga này cũng mở hash table ra xem bên trong: va chạm, nới bảng.
- **Ga 4** dùng chính bảng đếm của ga 2 làm *khóa* để gom nhóm.
- **Ga 5** đếm xong còn phải xếp hạng: heap, bucket sort, quickselect.

Bốn ga sau (từ Product of Array Except Self) sẽ được viết tiếp.

## Phiên bản và nguồn

Ví dụ chạy thật trên **Node.js 24** (chạy thẳng file `.ts`), **Python 3.12**, **Go 1.25** và **Java 21** (`java File.java`, không cần `javac`). Các con số thời gian đổi theo máy và theo lần chạy; tỉ lệ giữa các cách thì ổn định.

Đề bài thuộc về LeetCode; mỗi ga chỉ tóm tắt đề bằng lời của mình và dẫn link. Thứ tự bài lấy từ dữ liệu công khai của NeetCode. Lời giải, phép đo và sơ đồ là của mình. Chi tiết về hash table và sort lấy từ đặc tả ECMAScript, mã nguồn OpenJDK, đặc tả và release notes của Go, tài liệu CPython.
