---
title: "Dummy Node"
description: "A fake node placed before the head of a list, so the head is handled exactly like every other node; the result is dummy.next."
tags: ["algorithms", "data-structures"]
type: note
region: Algorithms Region
lang: en
---

Many linked list operations need "the node before": to unlink a node you edit the `next` of the node before it; to append to a result you need the result's last node. The head has no node before it, so code often grows a separate `if` for it, and that is where bugs live. A **dummy node** (sentinel) carries no data and is created with `dummy.next = head`. Now the real head also has a node before it, every node is handled the same way, and the new head of the list is `dummy.next` (which may have changed, for example when the head itself is removed). Used in [[en/problems/merge-two-sorted-lists|Merge Two Sorted Lists]] (the result's tail starts at the dummy) and [[en/problems/remove-nth-node-from-end-of-list|Remove Nth Node From End of List]] (the head can be removed too). It is a kind of [[en/concepts/sentinel-value|sentinel]].

Read more in [[en/posts/2026-11-24-neetcode-linked-list|Linked List Pointers]]. See also [[en/concepts/linked-list|Linked List]].
