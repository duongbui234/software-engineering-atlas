---
title: Tuyến Transaction và khóa
description: Vì sao bọc code trong transaction vẫn bán quá số hàng, và cách Postgres thật sự giữ cho 3000 người giành 100 suất không ai mua được suất ma, qua 7 ga đi từ ACID tới isolation, UPDATE có điều kiện, khóa, deadlock và kiến trúc flash sale.
series: transactions
code: TX
region: Vùng Database
draft: false
stations:
  - name: Transaction là gì
    concepts: [Transaction, ACID, Commit và Rollback, Write-Ahead Log, MVCC]
  - name: Race condition và bán quá số hàng
    concepts: [Race Condition, Read-Modify-Write, Lost Update, Oversell]
  - name: Các mức isolation
    concepts: [Isolation Level, Read Committed, Snapshot Isolation, Write Skew, Serializable, Serialization Failure]
  - name: Trừ kho bằng một câu UPDATE
    concepts: [Conditional Update, Row Lock, Re-check After Lock, Check Constraint]
  - name: Khóa bi quan và khóa lạc quan
    concepts: [Pessimistic Locking, Optimistic Locking, SKIP LOCKED, Advisory Lock, Hot Row]
  - name: Deadlock và transaction dài
    concepts: [Deadlock, Lock Ordering, Lock Timeout, Long-running Transaction, Transaction Retry]
  - name: Flash sale không bán quá số hàng
    concepts: [Atomic Gate, Compensation, Reconciliation, Defense in Depth, Concurrency Checklist]
---

## Nếu bạn mới bắt đầu

Bạn không cần biết Postgres hay SQL nâng cao để đi tuyến này. Ga 1 bắt đầu từ câu hỏi đơn giản nhất: đặt một đơn hàng là ba câu lệnh (giữ hàng, tạo đơn, ghi sổ kho), vậy nếu máy chết sau câu thứ hai thì sao?

Cả tuyến dùng chung một hình ảnh: **quầy bán vé có một cuốn sổ chung**. Mỗi nhân viên bán vé là một request. Transaction là một **phiếu giao dịch**: ghi nháp mọi bước lên phiếu, xong hết mới đóng dấu vào sổ, hỏng giữa chừng thì xé phiếu. Isolation là chuyện **mỗi nhân viên nhìn thấy cuốn sổ ra sao** trong lúc người khác đang ghi. Khóa là **đặt tay lên một dòng của sổ** để người khác phải chờ.

Câu hỏi xuyên suốt: hai nhân viên cùng nhìn thấy "còn 1 vé", cùng bán, rồi cùng gạch số. Ga 2 cho bạn nhìn tận mắt chuyện đó xảy ra trên Postgres thật: **300 người, 100 suất, 300 đơn**, dù mọi thứ đã nằm trong transaction.

Mỗi ga mở đầu bằng **"Hình dung trước"** (khái niệm so với chuyện đời thường, kèm sơ đồ) và một **từ điển nhanh** cho thuật ngữ mới. Đọc hai phần đó trước rồi mới vào phần kỹ thuật.

## Vì sao xếp theo thứ tự này

- **Ga 1–2** là nền: transaction cho bạn "tất cả hoặc không gì cả", nhưng **không** tự chống hai request chen nhau. Ga 2 tái hiện lỗi bán quá số hàng để có một bài toán thật cho các ga sau.
- **Ga 3–4** là hai cách sửa: nâng mức isolation (Postgres tự phát hiện và hủy, app phải thử lại), hoặc viết lại thao tác thành **một câu UPDATE có điều kiện** để không còn khe hở nào. flash-sale chọn cách thứ hai.
- **Ga 5–6** là khóa: khi nào khóa trước (bi quan), khi nào kiểm tra lúc ghi (lạc quan), cách không chờ (`NOWAIT`, `SKIP LOCKED`), và cái giá của khóa: deadlock, transaction dài, thử lại.
- **Ga 7** ghép lại kiến trúc flash sale: Redis chặn trước để Postgres không phải chịu 3000 người cùng lúc, Postgres giữ sự thật, bù trừ và đối soát khi hai bên lệch nhau.

Không thể hiểu vì sao `UPDATE … WHERE stock >= 1` đúng nếu chưa biết Read Committed đọc lại dòng sau khi chờ khóa; không thể hiểu vì sao cần sắp xếp SKU nếu chưa biết mỗi `UPDATE` giữ khóa dòng tới khi commit. Mỗi ga chỉ dùng từ vựng của các ga trước.

Tuyến này dùng lại vài từ của [[series/caching|tuyến Caching]] (Redis, hot key), [[series/rabbitmq|tuyến RabbitMQ]] (transactional outbox, idempotent consumer) và ga [[posts/2026-11-18-api-reliability|Độ tin cậy của API]] (idempotency, retry có jitter). Ga [[posts/2026-11-21-shopify-flash-sale|Shopify xử lý flash sale thế nào]] là một cách làm khác cho cùng bài toán.

## Phiên bản và nguồn

Ví dụ chạy thật trên **PostgreSQL 16**, **Redis 7**, **Node.js 24** và thư viện `pg` 8, kèm lệnh để bạn tự dựng database bằng Docker và chạy lại. Các con số thời gian và số lần thử lại đổi chút ít mỗi lần chạy; số đơn, tồn kho và mã lỗi thì không.

Nguồn chính: tài liệu chính thức của PostgreSQL 16 (Transaction Isolation, Explicit Locking, mệnh đề khóa của `SELECT`, WAL, các tham số `deadlock_timeout`, `lock_timeout`), tài liệu transaction của Prisma, bài báo *A Critique of ANSI SQL Isolation Levels* (Berenson và cộng sự, 1995) và bộ kiểm thử **Hermitage** của Martin Kleppmann. Ví dụ ngữ cảnh lấy từ **flash-sale**, trang bán hàng giảm giá giờ vàng mình tự viết, đã rút gọn và đổi tên.
