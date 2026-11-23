---
title: "Linked List"
description: "A chain of nodes scattered in memory, each holding a value and a pointer to the next node; inserting or removing at a known spot costs O(1), but reaching element i means walking past i nodes."
tags: ["algorithms", "data-structures"]
type: note
region: Algorithms Region
lang: en
---

A **singly linked list** is a chain of nodes, each holding a value and a `next` pointer to the following node; the last node points to `null`. The program holds only a pointer to the first node (`head`). Unlike an array, the nodes are not contiguous in memory, so there is no "jump to slot i": reaching node i means walking past i nodes, O(i). In exchange, once you hold a node, inserting or unlinking the node right after it is just one or two pointer changes, O(1), with no shifting of the rest as in an array. Each node also pays for the pointer and the object header: measured in V8, a `{val, next}` node takes about 40 bytes, while an array of small integers takes about 10 bytes per element. A **doubly** linked list adds a `prev` pointer to walk backwards.

Read more in [[en/posts/2026-11-24-neetcode-linked-list|Linked List Pointers]] and [[en/problems/reverse-linked-list|Reverse Linked List (LC 206)]]. See also [[en/concepts/dummy-node|Dummy Node]], [[en/concepts/pointer-reversal|In-place Pointer Reversal]], [[en/concepts/fast-slow-pointers|Fast and Slow Pointers]].
