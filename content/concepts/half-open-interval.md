---
title: "Half-open Interval"
description: "Khoảng [lo, hi) gồm lo nhưng không gồm hi: độ dài là hi − lo, rỗng khi lo == hi, và kết quả có thể là n mà không cần ca riêng."
tags: ["algorithms"]
type: note
region: Vùng Thuật toán
---

Thư viện chuẩn của nhiều ngôn ngữ dùng khoảng nửa mở: `range(lo, hi)` và `bisect` của Python, slice `s[lo:hi]` của Go, `std::lower_bound` của C++. Trong [[concepts/binary-search|tìm kiếm nhị phân]], đổi từ khoảng đóng `[lo, hi]` sang `[lo, hi)` đổi đúng ba chỗ: `hi` khởi tạo bằng `n` thay vì `n − 1`, lặp khi `lo < hi` thay vì `lo <= hi`, và bỏ nửa phải bằng `hi = mid` thay vì `hi = mid − 1`. Không quy ước nào đúng hơn; lỗi đến từ trộn hai quy ước, ví dụ khởi tạo `hi = n − 1` rồi lặp với `lo < hi`, bỏ sót ô cuối. Edsger Dijkstra lập luận cho quy ước này trong ghi chú EWD831 "Why numbering should start at zero".

Đọc thêm trong bài [[posts/2026-11-23-neetcode-binary-search|ga 1: Tìm kiếm nhị phân trên mảng]].
