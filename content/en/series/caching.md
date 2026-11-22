---
title: The Caching Line
description: "All of caching for beginners, from \"why a small cache gets so many hits\" to multi-tier, multi-machine caches and the vulnerabilities caches create, in 8 stations; each station builds on the previous one."
series: caching
code: CACHE
region: Cache Region
draft: false
lang: en
stations:
  - name: Why we need a cache
    concepts: [Caching, Cache Hit and Miss, Hit Ratio, Locality, Working Set, Cache Key, Staleness]
  - name: Caching along the HTTP path
    concepts: [Browser Cache, CDN, Cache-Control, ETag, Vary, Stale-While-Revalidate]
  - name: Read and write patterns
    concepts: [Cache-Aside, Read-Through, Write-Through, Write-Behind, Write-Around, Refresh-Ahead]
  - name: Invalidation
    concepts: [TTL, Cache Invalidation, Stale Set Race, Cache Lease, Versioned Key, Negative Caching]
  - name: Caching under high load
    concepts: [Cache Stampede, Request Coalescing, Probabilistic Early Expiration, TTL Jitter, Cache Penetration, Bloom Filter, Hot Key]
  - name: Redis as a cache
    concepts: [Maxmemory, Eviction Policy, LRU and LFU, Key Expiration, Big Key, SCAN and KEYS]
  - name: Many tiers, many machines
    concepts: [In-process Cache, Two-tier Cache, Pub/Sub Invalidation, Client-side Caching, Consistent Hashing, Hash Slot, Cache Warming]
  - name: Operations and security
    concepts: [Cache Metrics, Fail-open, Cache Poisoning, Web Cache Deception, Cache Checklist]
---

## If you are just starting

You don't need to know what Redis or a CDN is to ride this line. Station 1 starts from the simplest question: why does keeping a small copy of the data make the whole system faster, and what does it cost? The whole line shares one picture: **a cache is the shelf in a library's reading room**. The stacks in the basement (the database) hold everything, but fetching from them takes time; the shelf next to the reading tables holds only a few hundred of the most borrowed books. Due-date slips, a new printing replacing the old one, putting books away when the shelf is full, a separate pile on every table… each station opens up one more corner of that library.

Every station opens with **"Picture it first"** (the concepts compared with everyday life, plus a diagram) and a **quick glossary** for new terms. Read those two parts first, then move on to the technical part.

## Why this order

- **Stations 1–2** build the vocabulary: hit, miss, hit ratio, cache key, stale data; then the cache tier closest to the user, the browser and the CDN, where HTTP already has a full rulebook (`Cache-Control`, `ETag`, `Vary`).
- **Stations 3–5** cover caching inside the application: coordinating the cache with the database on reads and writes, keeping the cache from lying after the data changes, and how the cache "springs a leak" when thousands of requests arrive at once.
- **Stations 6–8** go into infrastructure: Redis when it runs out of memory, caches spread across many pods and nodes, then real operations: measuring, surviving a cache outage, and two security vulnerabilities born from the cache itself.

You can't understand cache stampede without knowing TTL and cache-aside; you can't pick an eviction policy without knowing what hit ratio depends on. Each station uses only the vocabulary of the stations before it.

This line continues from the [[en/posts/2026-11-18-api-performance|API Performance]] station of the API line (where caching first appears, along with the stampede lock example) and reuses a few words from [[en/series/rabbitmq|the RabbitMQ line]].

## Versions and sources

The examples run for real on **Redis 8** (8.10.3), **nginx 1.27** and **Node.js 24**, with Docker commands so you can rerun them. Many articles online are out of date: Redis has had per-field TTL on hashes since 7.4 (`HEXPIRE`), added the `LRM` eviction policy in 8.6, and RFC 9111 (2022) replaced RFC 7234.

Main sources: RFC 9111, RFC 9110 and RFC 5861 for HTTP; the official Redis and nginx documentation; the paper **Scaling Memcache at Facebook** (NSDI 2013) for leases and invalidation; the paper **Optimal Probabilistic Cache Stampede Prevention** (VLDB 2015) for XFetch; the research of Omer Gil (2017) and James Kettle (2018) on cache vulnerabilities. The context examples come from **flash-sale**, a time-limited discount shop I wrote myself, trimmed and renamed.
