---
title: "Hash Collision"
description: "Two different keys landing in the same bucket of a hash table."
tags: ["algorithms", "hashing", "security"]
type: note
region: Algorithms Region
lang: en
---

A **hash collision** is normal; every hash table has a way to handle it. Java uses a list in each bucket and turns it into a red-black tree when a bucket holds 8 or more keys; Python probes another slot (open addressing); Go 1.24 uses a Swiss Table. An attacker can deliberately send keys with the same hash (hash flooding): 20,000 keys with the same hashCode that are not Comparable make Java's HashMap take 2.7 seconds. Python randomizes string hashes to defend against it.

Read more in [[en/problems/two-sum|Two Sum]].
