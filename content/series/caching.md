---
title: Tuyến Caching
description: Toàn bộ caching cho người mới, từ "vì sao cache nhỏ mà trúng nhiều" tới cache nhiều tầng, nhiều máy và các lỗ hổng do cache gây ra, gom thành 8 ga; ga sau dựa trên ga trước.
series: caching
code: CACHE
region: Vùng Cache
draft: false
stations:
  - name: Vì sao cần cache
    concepts: [Caching, Cache Hit và Miss, Hit Ratio, Locality, Working Set, Cache Key, Staleness]
  - name: Cache trên đường HTTP
    concepts: [Browser Cache, CDN, Cache-Control, ETag, Vary, Stale-While-Revalidate]
  - name: Mẫu đọc và ghi
    concepts: [Cache-Aside, Read-Through, Write-Through, Write-Behind, Write-Around, Refresh-Ahead]
  - name: Invalidation
    concepts: [TTL, Cache Invalidation, Stale Set Race, Cache Lease, Versioned Key, Negative Caching]
  - name: Cache dưới tải cao
    concepts: [Cache Stampede, Request Coalescing, Probabilistic Early Expiration, TTL Jitter, Cache Penetration, Bloom Filter, Hot Key]
  - name: Redis làm cache
    concepts: [Maxmemory, Eviction Policy, LRU và LFU, Key Expiration, Big Key, SCAN và KEYS]
  - name: Nhiều tầng, nhiều máy
    concepts: [In-process Cache, Two-tier Cache, Pub/Sub Invalidation, Client-side Caching, Consistent Hashing, Hash Slot, Cache Warming]
  - name: Vận hành và an toàn
    concepts: [Cache Metrics, Fail-open, Cache Poisoning, Web Cache Deception, Cache Checklist]
---

## Nếu bạn mới bắt đầu

Bạn không cần biết Redis hay CDN là gì để đi tuyến này. Ga 1 bắt đầu từ câu hỏi đơn giản nhất: vì sao giữ lại một bản sao nhỏ của dữ liệu lại làm cả hệ thống nhanh lên, và cái giá phải trả là gì. Cả tuyến dùng chung một hình ảnh: **cache là giá sách ở phòng đọc của một thư viện**. Kho sách ở tầng hầm (database) có đủ mọi thứ nhưng đi lấy mất thời gian; giá sách gần bàn đọc chỉ có vài trăm cuốn hay được mượn nhất. Phiếu hẹn trả, bản in mới thay bản cũ, cất bớt sách khi giá đầy, mỗi bàn một chồng sách riêng… mỗi ga mở thêm một góc của thư viện đó.

Mỗi ga mở đầu bằng **"Hình dung trước"** (khái niệm so với chuyện đời thường, kèm sơ đồ) và một **từ điển nhanh** cho thuật ngữ mới. Đọc hai phần đó trước rồi mới vào phần kỹ thuật.

## Vì sao xếp theo thứ tự này

- **Ga 1–2** dựng từ vựng: trúng, trượt, tỉ lệ trúng, khóa cache, dữ liệu cũ; rồi tầng cache gần người dùng nhất là trình duyệt và CDN, nơi HTTP đã có sẵn cả bộ luật (`Cache-Control`, `ETag`, `Vary`).
- **Ga 3–5** là phần cache trong ứng dụng: phối hợp cache với database khi đọc và ghi, làm sao để cache không nói dối sau khi dữ liệu đổi, và cache "thủng" thế nào khi hàng nghìn request cùng tới.
- **Ga 6–8** đi vào hạ tầng: Redis khi hết bộ nhớ, cache trải trên nhiều pod và nhiều node, rồi vận hành thật: đo, chịu được lúc cache sập, và hai lỗ hổng bảo mật sinh ra từ chính cache.

Không thể hiểu cache stampede nếu chưa biết TTL và cache-aside; không thể chọn eviction policy nếu chưa biết hit ratio phụ thuộc vào cái gì. Mỗi ga chỉ dùng từ vựng của các ga trước.

Tuyến này nối tiếp ga [[posts/2026-11-18-api-performance|Hiệu năng API]] của tuyến API (nơi cache xuất hiện lần đầu, cùng ví dụ khóa chống stampede) và dùng lại vài từ của [[series/rabbitmq|tuyến RabbitMQ]].

## Phiên bản và nguồn

Ví dụ chạy thật trên **Redis 8** (8.10.3), **nginx 1.27** và **Node.js 24**, kèm lệnh Docker để bạn chạy lại. Nhiều bài trên mạng đã cũ: Redis có TTL cho từng field của hash từ 7.4 (`HEXPIRE`), thêm chính sách đẩy `LRM` ở 8.6, và RFC 9111 (2022) đã thay RFC 7234.

Nguồn chính: RFC 9111, RFC 9110 và RFC 5861 cho HTTP; tài liệu chính thức của Redis và nginx; bài **Scaling Memcache at Facebook** (NSDI 2013) cho lease và invalidation; bài **Optimal Probabilistic Cache Stampede Prevention** (VLDB 2015) cho XFetch; nghiên cứu của Omer Gil (2017) và James Kettle (2018) về lỗ hổng cache. Ví dụ ngữ cảnh lấy từ **flash-sale**, trang bán hàng giảm giá giờ vàng mình tự viết, đã rút gọn và đổi tên.
