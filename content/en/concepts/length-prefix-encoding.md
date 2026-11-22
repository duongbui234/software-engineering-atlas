---
title: "Length-prefix Encoding"
description: "Writing the length before the content so the decoder knows where to cut without a delimiter."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

Each part becomes `<length><length terminator><content>`, for example `5#hello`. The decoder reads the length and jumps over exactly that many characters, so the content can hold any character without [[en/concepts/escaping|escaping]]. HTTP `Content-Length` and binary protocols work this way. Both ends must count in the same unit: bytes, code points or UTF-16 units.

Read more in [[en/problems/encode-and-decode-strings|Encode and Decode Strings]].
