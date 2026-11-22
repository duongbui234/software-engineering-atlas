---
title: "Read-Modify-Write"
description: "Read a value into the app, compute the new value, write it back: the gap between read and write causes race conditions."
tags: ["concurrency", "database"]
type: note
region: Database Region
lang: en
---

**Read-modify-write** is the code pattern that reads a value from the database, computes in the app, then writes the result back. Between the read and the write, the number lives only in an app variable, so other requests can still read that same number. The check-then-act variant lets the database do the decrement (`stock = stock - 1`) but still decides based on the number read earlier. The fix is to put the condition into the write itself, or to lock the row before reading.

Read more in [[en/posts/2026-11-22-transactions-race|Race conditions: reproducing overselling]].
