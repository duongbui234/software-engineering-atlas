---
title: "Tuyến NeetCode: Quy hoạch động"
description: "1-D và 2-D Dynamic Programming của NeetCode 150 gom thành 7 ga: truy hồi một chiều, palindrome, ba lô, cắt chuỗi, lưới và hai chuỗi, DP có trạng thái, DP khoảng."
series: neetcode-dp
code: DP
region: Vùng Thuật toán
draft: false
stations:
  - name: "Truy hồi một chiều"
  - name: "Palindrome mở từ tâm"
  - name: "Ba lô và đổi tiền"
  - name: "Cắt chuỗi và dãy con tăng"
  - name: "Lưới và hai chuỗi"
  - name: "DP có trạng thái"
  - name: "DP khoảng và khớp mẫu"
---

## Nếu bạn mới bắt đầu

Tuyến này cần đệ quy và hash map. Duyệt cây ở [[series/neetcode-link|tuyến Cấu trúc liên kết]] giúp nhìn ra cây đệ quy của mỗi bài.

## Một ga, nhiều bài

Mỗi **ga** là một *pattern*, tức một kỹ thuật giải lặp lại ở nhiều bài. Post của ga dạy kỹ thuật đó qua một bài neo, rồi chỉ ra từng bài còn lại dùng nó khác đi ở đâu. Mỗi bài LeetCode có **trang riêng** trong [[problems/index|kho bài NeetCode 150]], giải kỹ bằng năm ngôn ngữ (TypeScript, Python, Go, Java, JavaScript), có độ phức tạp, phép đo và bẫy hay gặp.

## Vì sao xếp theo thứ tự này

- **Ga 1–2** dựng thói quen: viết công thức truy hồi, rồi lưu kết quả con thay vì tính lại.
- **Ga 3–4** là các bài chọn hoặc không chọn: ba lô, đổi tiền, cắt chuỗi, dãy con tăng.
- **Ga 5–7** lên hai chiều: bảng theo lưới hoặc theo hai chuỗi, trạng thái mua bán, và DP trên đoạn con.

## Phiên bản và nguồn

Lời giải chạy thật trên **Node.js 24** (chạy thẳng file `.ts`), **Python 3.12**, **Go 1.25** và **Java 21** (`java File.java`, không cần `javac`). Số đo thời gian đổi theo máy và theo lần chạy; tỉ lệ giữa các cách thì ổn định.

Đề bài thuộc về LeetCode; mỗi trang bài chỉ tóm tắt đề bằng lời của mình và dẫn link. Danh sách và nhóm bài lấy từ dữ liệu công khai của [NeetCode 150](https://neetcode.io/practice); cách gom bài thành ga là của mình. Lời giải, phép đo và sơ đồ là của mình.
