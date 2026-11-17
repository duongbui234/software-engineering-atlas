---
title: Tuyến API Concepts
description: 33 khái niệm API mà kỹ sư phần mềm cần nắm khi xây API, gom thành 6 ga; ga sau dựa trên ga trước.
series: api
code: API
region: Vùng API
draft: false
stations:
  - name: Nền tảng
    concepts: [Endpoint, Request-Response, HTTP Methods, Headers, JSON, Status Codes, Error Handling]
  - name: Kiểu API
    concepts: [REST, GraphQL, gRPC, WebSockets, Webhooks]
  - name: Bảo mật
    concepts: [Authentication, Authorization, API Keys, OAuth 2.0, JSON Web Token, HTTPS và TLS, CORS]
  - name: Độ tin cậy
    concepts: [Idempotency, Timeouts, Retries with Backoff, Circuit Breaker, Rate Limiting, Throttling]
  - name: Hiệu năng
    concepts: [Caching, Pagination, Filtering và Sorting, Load Balancing]
  - name: Kiến trúc và vận hành
    concepts: [API Gateway, API Versioning, OpenAPI, Microservices]
---

## Vì sao xếp theo thứ tự này

Không thể hiểu idempotency nếu chưa rõ HTTP method nào vốn idempotent, và không thể bàn rate limit mà chưa biết request được xác thực ra sao. Mỗi ga dùng lại từ vựng của ga trước, nên mình học và viết theo đúng thứ tự đó: nền tảng của một request, các kiểu API, bảo mật, rồi tới những thứ giữ cho API chạy ổn (độ tin cậy, hiệu năng) và cách tổ chức nhiều API trong một hệ thống.

## Nguồn của danh sách

Danh sách 33 khái niệm lấy theo loạt bài *API Concepts Every Software Engineer Should Know* của The System Design Newsletter (Neo Kim), [phần 1](https://newsletter.systemdesign.one/p/api-concepts-every-software-engineer-should-know) và [phần 2](https://newsletter.systemdesign.one/p/api-concepts-for-software-engineers). Cách chia ga, giải thích, ví dụ và sơ đồ ở đây là mình tự viết từ tài liệu công khai (MDN, RFC, tài liệu API của Stripe và GitHub) và từ code mình chạy thử.
