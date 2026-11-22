---
title: "Message Properties"
description: "An AMQP message has standard properties, a free-form headers table and a body the broker does not read."
tags: [rabbitmq, messaging]
type: note
region: Messaging Region
lang: en
---

A message has a **body** (a byte array the broker does not read), standard **properties** such as `delivery_mode` (2 = persistent), `content_type`, `message_id`, `correlation_id`, `reply_to`, `expiration`, `priority`, `timestamp`, and **headers**, a free-form key-value table. Since 4.0, the default maximum message size is 16 MiB; heavy data belongs in file storage, with only its path in the message.

Read more in [[en/posts/2026-11-21-rabbitmq-amqp-model|Inside the post office: the AMQP model]].
