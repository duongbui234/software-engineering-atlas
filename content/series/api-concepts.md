---
title: Tuyến API Concepts
description: Những khái niệm API mình cần nắm để thiết kế và gọi API cho đúng, gom thành 6 ga; ga sau dựa trên ga trước.
series: api
code: API
region: Vùng API
draft: true
stations:
  - name: Nền tảng
    concepts: [Endpoint, HTTP method, Status code, Header]
  - name: Kiểu API
    concepts: [REST, GraphQL, gRPC, WebSocket, Webhook]
  - name: Bảo mật
    concepts: [AuthN và AuthZ, API key, OAuth2, JWT, CORS]
  - name: Độ tin cậy
    concepts: [Idempotency, Retry và backoff, Timeout, Rate limit, Circuit breaker]
  - name: Hiệu năng
    concepts: [Pagination, Caching, Compression, Batching]
  - name: Vận hành
    concepts: [Versioning, OpenAPI, API gateway, Observability, Deprecation]
---

## Vì sao xếp theo thứ tự này

Không thể hiểu idempotency nếu chưa rõ HTTP method nào vốn idempotent, và không thể bàn rate limit mà chưa biết request được xác thực ra sao. Mỗi ga dùng lại từ vựng của ga trước, nên mình viết theo đúng thứ tự đó.

Danh sách khái niệm do mình tự tổng hợp từ tài liệu công khai (MDN, RFC, tài liệu API của Stripe và GitHub), không chép theo một bài cụ thể nào.
