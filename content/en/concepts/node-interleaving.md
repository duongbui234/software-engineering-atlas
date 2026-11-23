---
title: "Node Interleaving"
description: "Insert each node's copy right after the original, so \"the copy of X\" is always X.next; that copies extra pointers without a hash map, and then the two lists are split apart."
tags: ["algorithms", "data-structures"]
type: note
region: Algorithms Region
lang: en
---

When copying a [[en/concepts/linked-list|linked list]] whose nodes carry an extra pointer (like `random`, pointing at any node), the hard part is finding "the copy of node X" when X has not been copied yet or sits far away. The direct way is a [[en/concepts/hash-map|hash map]] from original to copy, at O(n) memory. **Interleaving** uses the list itself as the lookup table: pass 1 inserts `X'` right after each `X` (`A → A' → B → B' → …`); pass 2 sets `X'.random = X.random.next`, because every node's copy sits right after it; pass 3 splits the two lists and restores the originals' `next`. Three O(n) passes, O(1) memory beyond the new nodes.

Used in [[en/problems/copy-list-with-random-pointer|Copy List with Random Pointer]]. The split is where it goes wrong: you must fix `next` on both the originals and the copies, or the original list stays tangled with the copy.

Read more in [[en/posts/2026-11-24-neetcode-advanced-linked-list|Advanced Linked Lists]].
