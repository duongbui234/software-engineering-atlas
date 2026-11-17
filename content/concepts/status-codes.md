---
title: Status Codes
description: "Con số ba chữ số kết luận kết quả của request."
tags: [api, http]
type: note
region: Vùng API
---

**Status code** chia năm nhóm: `2xx` thành công, `3xx` chuyển hướng, `4xx` lỗi phía gọi, `5xx` lỗi server. Phân biệt `401` (không biết bạn là ai) với `403` (biết nhưng không cho phép), `400` (sai hình thức) với `422` (sai nghiệp vụ); `4xx` gần như không nên retry, `5xx` thì có thể.

Đọc thêm trong bài [[2026-11-18-api-foundations|Nền tảng API]].
