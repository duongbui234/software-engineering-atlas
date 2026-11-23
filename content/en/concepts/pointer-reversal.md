---
title: "In-place Pointer Reversal"
description: "Reverse a linked list with three pointers prev, cur, next, flipping one arrow at a time; O(n) time, O(1) memory, no new nodes."
tags: ["algorithms", "data-structures"]
type: note
region: Algorithms Region
lang: en
---

Walk the list once with three pointers: `prev` heads the already reversed segment, `cur` is the node being handled, `next` holds the rest. Each step: `next = cur.next` (save it first, since you are about to cut), `cur.next = prev` (flip the arrow), then `prev = cur; cur = next`. When `cur` becomes `null`, `prev` is the new head. Each node changes exactly one pointer: O(n) time, three extra variables. Skip the step that saves `next` and, after the flip, `cur.next` already points back at `prev`, so the rest of the list is lost. The recursive version is shorter but costs one call frame per node: measured, Node 24 stops at about 15,650 nodes and Python 3.12 at 998, while the loop reverses 10⁶ nodes in about 3 ms. The technique is a step inside many other problems; for example, [[en/problems/reorder-list|Reorder List]] reverses the second half and then weaves it into the first.

Read more in [[en/posts/2026-11-24-neetcode-linked-list|Linked List Pointers]] and [[en/problems/reverse-linked-list|Reverse Linked List (LC 206)]]. See also [[en/concepts/linked-list|Linked List]].
