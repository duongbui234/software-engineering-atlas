---
title: "Hash Collision"
description: "Hai khóa khác nhau rơi vào cùng một ô của hash table."
tags: ["algorithms", "hashing", "security"]
type: note
region: Vùng Thuật toán
---

**Va chạm hash** là chuyện bình thường; mọi hash table đều có cách xử lý. Java dùng danh sách trong mỗi ô và đổi thành cây đỏ-đen khi ô có từ 8 khóa; Python dò ô khác (địa chỉ mở); Go 1.24 dùng Swiss Table. Kẻ tấn công có thể cố ý gửi khóa cùng hash (hash flooding): 20 000 khóa cùng hashCode, không Comparable, làm HashMap của Java mất 2,7 giây. Python ngẫu nhiên hóa hash chuỗi để chống lại.

Đọc thêm trong bài [[posts/2026-11-22-neetcode-two-sum|Two Sum]].
