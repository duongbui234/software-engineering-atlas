---
title: "Tuyến NeetCode: Kỹ thuật tổng hợp"
description: "Backtracking, Greedy, Intervals, Math & Geometry và Bit Manipulation của NeetCode 150 gom thành 8 ga."
series: neetcode-misc
code: MISC
region: Vùng Thuật toán
draft: false
stations:
  - name: "Quay lui: tập con và tổ hợp"
    concepts: ["Backtracking", "Choice Tree", "Start Index", "Duplicate Skipping"]
  - name: "Quay lui: hoán vị và tìm kiếm"
    concepts: ["Used Marker", "Visit-and-Restore", "Conflict Sets"]
  - name: "Tham lam trên mảng"
  - name: "Tham lam theo nhóm"
  - name: "Khoảng"
  - name: "Ma trận"
  - name: "Số học"
  - name: "Thao tác bit"
---

## Nếu bạn mới bắt đầu

Các ga trong tuyến này khá độc lập với nhau; quay lui dùng đệ quy, khoảng dùng sắp xếp.

## Một ga, nhiều bài

Mỗi **ga** là một *pattern*, tức một kỹ thuật giải lặp lại ở nhiều bài. Post của ga dạy kỹ thuật đó qua một bài neo, rồi chỉ ra từng bài còn lại dùng nó khác đi ở đâu. Mỗi bài LeetCode có **trang riêng** trong [[problems/index|kho bài NeetCode 150]], giải kỹ bằng bảy ngôn ngữ (TypeScript, Python, Go, Java, JavaScript, PHP, Rust), có độ phức tạp, phép đo và bẫy hay gặp.

## Vì sao xếp theo thứ tự này

- **Ga 1–2** là quay lui: thử, đi sâu, rồi gỡ lựa chọn.
- **Ga 3–5** là tham lam và khoảng: chứng minh vì sao chọn cục bộ vẫn ra tối ưu, sắp xếp theo điểm đầu hoặc điểm cuối.
- **Ga 6–8** là các mẹo nhỏ: duyệt ma trận, số học không tràn số, và thao tác trên từng bit.

## Phiên bản và nguồn

Lời giải chạy thật trên **Node.js 24** (chạy thẳng file `.ts`), **Python 3.12**, **Go 1.25**, **Java 21** (`java File.java`, không cần `javac`), **PHP 8.2** và **Rust 1.99** (`rustc -O`, chỉ thư viện chuẩn). Vài bài LeetCode không mở Rust (bài dựa vào danh tính nút, như Clone Graph) nên trang bài đó có sáu ngôn ngữ. Số đo thời gian đổi theo máy và theo lần chạy; tỉ lệ giữa các cách thì ổn định.

Đề bài thuộc về LeetCode; mỗi trang bài chỉ tóm tắt đề bằng lời của mình và dẫn link. Danh sách và nhóm bài lấy từ dữ liệu công khai của [NeetCode 150](https://neetcode.io/practice); cách gom bài thành ga là của mình. Lời giải, phép đo và sơ đồ là của mình.
