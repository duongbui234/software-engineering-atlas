---
title: "Clustering"
description: "Several RabbitMQ nodes share metadata; message contents are replicated only by quorum queues and streams."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **cluster** replicates users, vhosts, permissions, exchanges, queues, bindings and policies to every node; a client connected to any node can use every queue. The contents of a classic queue still live on one node. The nodes need the same Erlang cookie, must reach each other on ports 4369 and 25672, sit on the same LAN, and come in an odd number. Join nodes with `join_cluster` or peer discovery.

Read more in [[en/posts/2026-11-21-rabbitmq-cluster|Clusters and high availability]].
