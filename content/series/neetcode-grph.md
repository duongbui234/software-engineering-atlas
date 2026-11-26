---
title: "Tuyến NeetCode: Đồ thị"
description: "Graphs và Advanced Graphs của NeetCode 150 gom thành 6 ga: duyệt lưới, duyệt đồ thị và BFS, sắp xếp topo, Union-Find, đường đi ngắn nhất, cây khung."
series: neetcode-grph
code: GRPH
region: Vùng Thuật toán
draft: false
stations:
  - name: "Duyệt lưới"
    concepts: [Grid Graph, Flood Fill, Connected Component, Multi-source BFS, Mark on Enqueue]
  - name: "Duyệt đồ thị và BFS"
  - name: "Sắp xếp topo"
  - name: "Union-Find"
  - name: "Đường đi ngắn nhất"
  - name: "Cây khung và hành trình"
---

## Nếu bạn mới bắt đầu

Tuyến này cần hàng đợi, ngăn xếp, đệ quy và heap từ các tuyến trước.

## Một ga, nhiều bài

Mỗi **ga** là một *pattern*, tức một kỹ thuật giải lặp lại ở nhiều bài. Post của ga dạy kỹ thuật đó qua một bài neo, rồi chỉ ra từng bài còn lại dùng nó khác đi ở đâu. Mỗi bài LeetCode có **trang riêng** trong [[problems/index|kho bài NeetCode 150]], giải kỹ bằng năm ngôn ngữ (TypeScript, Python, Go, Java, JavaScript), có độ phức tạp, phép đo và bẫy hay gặp.

## Vì sao xếp theo thứ tự này

- **Ga 1–2** là DFS và BFS, trước trên lưới (mỗi ô là một đỉnh), rồi trên đồ thị tổng quát.
- **Ga 3–4** là hai công cụ cấu trúc: thứ tự topo cho đồ thị có hướng, Union-Find cho các thành phần liên thông.
- **Ga 5–6** thêm trọng số: Dijkstra, Bellman-Ford có giới hạn bước, cây khung nhỏ nhất và hành trình Euler.

## Phiên bản và nguồn

Lời giải chạy thật trên **Node.js 24** (chạy thẳng file `.ts`), **Python 3.12**, **Go 1.25** và **Java 21** (`java File.java`, không cần `javac`). Số đo thời gian đổi theo máy và theo lần chạy; tỉ lệ giữa các cách thì ổn định.

Đề bài thuộc về LeetCode; mỗi trang bài chỉ tóm tắt đề bằng lời của mình và dẫn link. Danh sách và nhóm bài lấy từ dữ liệu công khai của [NeetCode 150](https://neetcode.io/practice); cách gom bài thành ga là của mình. Lời giải, phép đo và sơ đồ là của mình.
