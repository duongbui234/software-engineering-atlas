---
title: "Virtual Host"
description: "An isolated space for names, permissions and policies inside one broker."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A **virtual host** (vhost) splits one broker into several branches, each with its own exchanges, queues, bindings, permissions and policies; the default vhost is `/`. Users are granted permissions per vhost, and each vhost can limit its number of connections and queues. Vhosts are only a logical separation: all vhosts share the broker's RAM, CPU and disk.

Read more in [[en/posts/2026-11-21-rabbitmq-amqp-model|Inside the post office: the AMQP model]].
