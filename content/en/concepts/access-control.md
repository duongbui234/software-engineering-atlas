---
title: "Access Control"
description: "Authentication and the three permissions configure, write and read, per vhost."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

Authentication uses a password, an x.509 certificate or a JWT through the OAuth 2 plugin. Authorization works per vhost with three regexes: **configure** (create and delete resources), **write** (publish, bind) and **read** (consume); topic permissions add rules on the routing key. `guest` can only log in from localhost; in production you should delete it, disable ANONYMOUS, give each application its own user and turn on TLS.

Read more in [[en/posts/2026-11-21-rabbitmq-operations|Running RabbitMQ in production]].
