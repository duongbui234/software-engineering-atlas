---
title: "Versioned Key"
description: "Dùng số phiên bản để cache từ chối giá trị cũ, hoặc để xóa cả nhóm key bằng cách đổi phiên bản."
tags: ["caching", "consistency", "design"]
type: note
region: Vùng Cache
---

**Version trong giá trị**: cache chỉ nhận giá trị có version mới hơn cái đang giữ, người ghi để lại tombstone thay vì xóa trắng. **Version trong khóa**: key mang số thế hệ (`search:g17:...`), tăng số thế hệ là vô hiệu cả nhóm mà không phải tìm key. Mã băm trong tên file tĩnh cũng là một dạng.

Đọc thêm trong bài [[2026-11-22-caching-invalidation|Invalidation]].
