---
title: "Last-seen Index"
description: "A table from element → the position where it was last seen, to jump straight to the right place instead of searching again."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

A **last-seen index** records, for each element, the index where it last appeared. In a [[en/concepts/sliding-window|sliding window]], when a character shows up again, the left end jumps straight past its previous sighting instead of dropping characters one by one. Since the table never deletes, it also remembers elements that have already left the window, so you must check that the previous sighting is still inside the window (`left = max(left, prev + 1)`), or the left end moves back.

Read more in [[en/problems/longest-substring-without-repeating-characters|Longest Substring Without Repeating Characters]].
