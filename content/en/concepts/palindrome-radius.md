---
title: "Palindrome Radius"
description: "The number of symmetric steps from a center to the maximal span's edge."
tags: [algorithms, neetcode, palindrome]
type: note
region: "Algorithms Region"
lang: en
---

A radius measures one side of the symmetric window around its center. With virtual gaps, maximal radius r equals the original span length, and its center contributes ⌊(r+1)/2⌋ occurrences. Manacher stores radii to seed a center from its known mirror.

Read more in [[en/posts/2026-11-27-neetcode-palindrome-centers|the station post]].
