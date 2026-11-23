---
title: "Fan-out on Write"
description: "When someone posts, copy the post into the ready-made feed of every follower; reading a feed only takes its first few elements, at the price of a write that costs in proportion to the number of followers."
tags: ["caching", "patterns"]
type: note
region: Cache Region
lang: en
---

**Fan-out on write** builds each user's feed ahead of time, like a cache: when an account posts, the post is copied into the feed of each of its followers. Reads become cheap (take the first 10 elements), while writes get more expensive with the number of followers: an in-memory measurement gives 0.011 ms for 100 followers and 73 ms for 10⁶. The opposite is **fan-out on read**: every time the feed is opened, merge the post lists of the people you follow, so writes are cheap and reads are expensive. Real systems usually mix the two: fan-out on write for most accounts, while posts from accounts with very many followers are fetched separately and merged in at read time (Kleppmann, *Designing Data-Intensive Applications*, chapter 1).

Read more in [[en/problems/design-twitter|Design Twitter (LC 355)]].
