---
title: "Polling"
description: "Client hỏi server theo chu kỳ cố định, phần lớn câu trả lời là \"chưa có gì\"."
tags: ["realtime", "http"]
type: note
region: Vùng Realtime
---

**Polling** (hỏi định kỳ): client gửi request mỗi N giây. Dễ làm, đi qua mọi proxy, nhưng tin luôn trễ trung bình N/2 giây và phần lớn request là vô ích. Trong ví dụ của bài, hỏi mỗi 2 giây cho độ trễ trung bình khoảng 1 giây và còn lỡ sự kiện cuối.

Đọc thêm trong bài [[2026-11-22-websocket-realtime-options|Bốn cách để server báo tin]].
