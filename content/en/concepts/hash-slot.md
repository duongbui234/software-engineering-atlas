---
title: "Hash Slot"
description: "Redis Cluster splits keys into 16384 slots with CRC16(key) mod 16384; each node holds a range of slots."
tags: ["caching", "redis", "distributed-systems"]
type: note
region: Cache Region
lang: en
---

**Hash slots** allow moving slot by slot when adding a node, and clients are redirected with `MOVED`/`ASK`. Multi-key commands, transactions and Lua only run when all keys are in the same slot (otherwise `CROSSSLOT`); a hash tag `{...}` forces keys into the same slot.

Read more in [[en/posts/2026-11-22-caching-distributed|Many tiers, many machines]].
