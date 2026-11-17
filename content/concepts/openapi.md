---
title: OpenAPI
description: "Định dạng chuẩn mô tả API mà máy đọc được."
tags: [api, architecture]
type: note
region: Vùng API
---

**OpenAPI** mô tả endpoint, tham số, schema request/response, status code và cách xác thực trong một file YAML/JSON (bản 3.1 dùng JSON Schema). Từ một file đó sinh được tài liệu, client có kiểu, mock server, validator và contract test. Spec phải được sinh từ code hoặc kiểm tra code theo spec trong CI, nếu không sẽ lệch dần.

Đọc thêm trong bài [[2026-11-18-api-architecture|Kiến trúc và vận hành API]].
