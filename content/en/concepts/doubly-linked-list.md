---
title: "Doubly Linked List"
description: "A linked list whose nodes have both prev and next, so holding a node is enough to unlink it in O(1); with two sentinels at the ends there are no edge cases left."
tags: ["algorithms", "data-structures"]
type: note
region: Algorithms Region
lang: en
---

In a [[en/concepts/linked-list|singly linked list]], each node only knows the node after it. To unlink a node you must edit the `next` of the node **before** it, and finding that node means walking from the head: O(n). A **doubly linked list** gives each node a `prev` pointer as well. Holding node `n`, `n.prev.next = n.next; n.next.prev = n.prev` unlinks it in O(1), and inserting a node next to any node is O(1) too. The price is one extra pointer per node and twice as many pointers to fix when relinking.

A common setup puts two [[en/concepts/dummy-node|dummy nodes]] `head` and `tail` at the ends: the list is never truly empty, every real node always has a node before and after it, so `unlink` and `pushFront` need no `if` at all. Paired with a [[en/concepts/hash-map|hash map]] from key to node, it gives [[en/problems/lru-cache|LRU Cache]] with O(1) `get` and `put`. Ready-made versions: Go's `container/list`, Java's `LinkedList` and `LinkedHashMap`, Python's `OrderedDict` (a doubly linked list inside).

Read more in [[en/posts/2026-11-24-neetcode-advanced-linked-list|Advanced Linked Lists]]. See also [[en/concepts/lru-va-lfu|LRU and LFU]].
