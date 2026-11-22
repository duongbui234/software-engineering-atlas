---
title: "Production Checklist"
description: "What must be in place before RabbitMQ goes to production."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A cluster of 3 or 5 nodes on the same LAN; each node with at least 4 CPUs, 4 GiB of RAM and an SSD; RAM and disk thresholds set; file descriptors at 50,000 or more. Delete `guest`, one user per application, TLS. Important data in quorum queues; every queue gets a length limit and a DLX through policy. Confirms, persistent messages, manual acks, bounded prefetch, idempotent consumers. Long-lived connections, publishing and consuming separated. Prometheus and alerts.

Read more in [[en/posts/2026-11-21-rabbitmq-operations|Running RabbitMQ in production]].
