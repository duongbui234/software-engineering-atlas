---
title: "Escaping"
description: "Marking a special character as ordinary by putting an escape character before it."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

JSON writes `\"` for a double quote inside a string and `\\` for the backslash itself. The mandatory rule: escape the escape character **too**, or `a\` followed by a special character gets misread. The decoder must read every character to know which were escaped, slower than a [[en/concepts/length-prefix-encoding|length prefix]] but human-readable. See [[en/concepts/delimiter-collision|Delimiter Collision]].

Read more in [[en/problems/encode-and-decode-strings|Encode and Decode Strings]].
