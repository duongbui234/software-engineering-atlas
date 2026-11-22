---
title: "Inside the post office: the AMQP model with connections, channels, exchanges, queues, bindings and routing keys"
description: The sender never drops a letter straight into a mailbox; this station opens each part of RabbitMQ along the AMQP 0-9-1 model to see where a message travels on its way from producer to consumer.
date: 2026-11-21
tags: [rabbitmq, messaging]
type: learn
level: beginner
series: rabbitmq
part: 2
draft: false
lang: en
sources:
  - https://www.rabbitmq.com/tutorials/amqp-concepts
  - https://www.rabbitmq.com/docs/connections
  - https://www.rabbitmq.com/docs/channels
  - https://www.rabbitmq.com/docs/vhosts
  - https://www.rabbitmq.com/docs/queues
  - https://www.rabbitmq.com/docs/publishers
  - https://www.rabbitmq.com/docs/heartbeats
---

> [!tldr] Quick read
> - A producer **never** publishes straight into a queue. It publishes to an [[en/concepts/exchange|exchange]] with a label called a [[en/concepts/routing-key|routing key]]; the exchange uses its [[en/concepts/binding|bindings]] to copy the message into the right [[en/concepts/queue|queue]].
> - A [[en/concepts/connection|connection]] is a long-lived TCP connection; [[en/concepts/channel|channels]] are lightweight "lanes" inside it. Opening a connection per request is the classic mistake.
> - A [[en/concepts/virtual-host|virtual host]] splits one broker into several "branches" with separate names, permissions and policies, but they share the same RAM and CPU.
> - A message consists of **properties** (standard fields such as `message_id`, `persistent`), **headers** (an arbitrary table) and the **body** (a byte array the broker doesn't read). See [[en/concepts/message-properties|Message properties]].
> - `sendToQueue` is only a shortcut: it publishes to the **default exchange** with a routing key equal to the queue name.

> [!info] Context
> Station 2 of **the RabbitMQ line**. At [[en/posts/2026-11-21-rabbitmq-why-queues|station 1]], I treated RabbitMQ as a post office standing between the services of **flash-sale** (a time-limited flash-sale shop I wrote myself). This station opens the post office door to see which departments are inside. You don't need to know the project's code; every example runs on a real RabbitMQ in Docker.

> [!abstract]- Quick glossary for this post (click to open)
> - **Protocol**: the set of rules two programs use to talk over the network, like HTTP for the web.
> - **AMQP 0-9-1**: the protocol RabbitMQ has used from the start. Read it as "A-M-Q-P zero nine one". See [[en/concepts/amqp|AMQP]].
> - **TCP**: the network connection layer underneath; opening a TCP connection takes several round trips and resources on both ends.
> - **TLS**: the encryption layer on top of TCP, the same thing that makes HTTPS.
> - **Thread**: a line of execution running in parallel inside a program.
> - **Client library**: the library inside the application that talks to RabbitMQ. This post uses `amqplib` for Node.js.
> - **Durable**: survives a broker restart.
> - **Management UI**: the admin web page that ships with RabbitMQ, on port 15672 by default.

## Picture it first: a post office with a sorting desk

At station 1, the post office was a black box. Now let's open it. What surprised me most: **the sender isn't allowed to drop letters into a mailbox themselves**. Letters always go through the sorting desk.

| Everyday life | Concept |
|---|---|
| The mail truck from your company to the post office, running all day | [[en/concepts/connection\|Connection]] (a TCP connection) |
| Separate lanes in the truck, one per clerk | [[en/concepts/channel\|Channel]] |
| Each post office branch has its own books and its own staff | [[en/concepts/virtual-host\|Virtual host]] |
| Sorting desk: takes letters, reads the label, decides which mailbox they go into | [[en/concepts/exchange\|Exchange]] |
| Mailbox: letters wait in order until someone takes them | [[en/concepts/queue\|Queue]] |
| A rule taped to the desk: "letters labeled `order.cancelled` go to the stock mailbox" | [[en/concepts/binding\|Binding]] |
| The label stuck on the envelope | [[en/concepts/routing-key\|Routing key]] |
| The envelope (standard info) + a note clipped to it + the letter inside | [[en/concepts/message-properties\|Properties, headers, body]] |
| The shared rulebook of the postal industry | [[en/concepts/amqp\|AMQP 0-9-1]] |

```mermaid
flowchart TB
    P["Sender<br/>(producer)"] -->|"letter + label order.cancelled"| X["Sorting desk<br/>(exchange)"]
    X -->|"rule: order.cancelled"| Q1["Stock mailbox<br/>(queue stock.q)"]
    X -->|"rule: order.*"| Q2["Email mailbox<br/>(queue email.q)"]
    Q1 --> C1["Stock clerk<br/>(consumer)"]
    Q2 --> C2["Email clerk<br/>(consumer)"]
```

An `order.cancelled` letter matches both rules, so it is **copied twice**, one copy per mailbox. The sender doesn't know, and doesn't need to know, how many mailboxes there are.

## The problem: "the producer drops messages into a queue" is the wrong model

I started from the picture most introductions draw: *producer → queue → consumer*. That picture is enough to run a "hello world", but it tripped me up three times afterwards:

- I wanted two services to receive the same event, so I published the message twice into two queues. Now the producer had to know the list of receivers, exactly what I wanted to get rid of at station 1.
- I published a message with a mistyped routing key. No error, and the message went nowhere.
- I opened a new RabbitMQ connection for every HTTP request to keep things "clean". Under a load test, the broker complained about running out of resources.

All three mistakes came from not knowing what was inside the post office. Below, I walk through each department along the exact path a message takes.

## How it works

<figure class="figure-map" style="--ar: 1 / 1">
<div class="frame"><iframe data-archify="../../diagrams/rabbitmq-amqp-model/amqp-model.en.html" title="Architecture diagram: the parts of RabbitMQ in the AMQP 0-9-1 model" loading="lazy"></iframe></div>
<figcaption><span><b>Figure 1.</b> The producer only talks to the exchange; bindings decide which mailbox a letter is copied into, and each consumer only reads from its own mailbox.</span><a href="../diagrams/rabbitmq-amqp-model/amqp-model.en.html" target="_blank" rel="noopener">Open full screen</a></figcaption>
</figure>

### AMQP 0-9-1: the shared rules of the post office

[[en/concepts/amqp|AMQP]] (Advanced Message Queuing Protocol) version 0-9-1 is the protocol RabbitMQ has used since its early days. It defines both *how to talk* (methods such as `basic.publish`, `queue.declare`, `basic.ack`) and the *model* inside the broker: exchanges, queues, bindings. Thanks to the shared protocol, a Node.js, Java or Go application can all talk to RabbitMQ through a library in their own language.

One difference from HTTP: in AMQP, **the applications declare** the structure of the post office themselves. A producer or consumer calls `assertExchange`, `assertQueue`, `bindQueue` at startup; if the thing already exists, the declaration does nothing. The post office is "assembled" by the very people who use it. Since RabbitMQ 4.0, the broker also speaks **AMQP 1.0**, an entirely different protocol despite the shared name; [[en/posts/2026-11-21-rabbitmq-operations|station 9]] compares the two.

### Connection: a long-lived mail truck

A [[en/concepts/connection|connection]] is a TCP connection (optionally wrapped in TLS) from the application to the broker, authenticated with a username and password. Opening a connection takes many round trips, and each connection uses memory and a file handle on the broker.

So a connection should be **long-lived**: open it once when the application starts, and use it until shutdown. The RabbitMQ docs treat more than about 100 newly opened connections per second as a sign of poor connection management (connection churn). Give each connection a name (`connection_name`) so you can see right away in the management UI which application it belongs to.

**Heartbeats** are the connection's pulse: both sides send each other a small frame periodically, and after two missed beats in a row the connection is considered dead, instead of waiting many minutes for the operating system to notice. The broker suggests 60 seconds; the docs recommend 5–20 seconds, and advise against disabling them.

### Channel: the lanes in the truck

A [[en/concepts/channel|channel]] is a "lightweight connection" sharing one connection. Every operation (publishing, declaring a queue, acking) happens on a specific channel. Opening a channel is much cheaper than opening a connection, but still not free.

Rules of use:

- **One channel per thread of work**; don't share one channel among several threads running concurrently. With Node.js (single-threaded), you usually keep one channel for publishing and one channel per group of consumers.
- A few channels per connection is enough for most applications. Opening channels constantly without closing them (channel leak) also exhausts the broker's resources.
- A "soft" error closes only the **channel**, not the connection. For example, publishing to an exchange that doesn't exist (error 404) or redeclaring a queue with different properties (error 406). Your code has to handle the channel-closed event; otherwise later operations on that channel fail silently.

### Virtual host: a post office branch

A [[en/concepts/virtual-host|virtual host]] (vhost) splits one broker into several separate spaces. Each vhost has its own exchanges, queues, bindings, permissions and policies; the queue `orders` in vhost `/shop` and the queue `orders` in vhost `/test` are two different queues. The default vhost is named `/`.

Users are granted permissions per vhost, and each vhost can set limits on the number of connections and queues. But a vhost separates **only logically**: every vhost still shares the broker's RAM, CPU and disk. If one vhost fills up the RAM, the whole broker suffers.

### Exchange: the sorting desk

An [[en/concepts/exchange|exchange]] receives messages from producers and decides which queues to copy each message into. An exchange **doesn't store messages**: if no queue matches, the message is dropped immediately (unless configured otherwise, [[en/posts/2026-11-21-rabbitmq-exchanges|station 3]]).

Each exchange has a name, a **type** (direct, fanout, topic, headers; station 3 goes through each one), a `durable` flag (it still exists after a broker restart) and an `auto-delete` flag (it deletes itself when it has no bindings left). Every broker comes with a few exchanges whose names start with `amq.` and a special nameless exchange, the **default exchange**, covered at the end.

### Queue: the mailbox

A [[en/concepts/queue|queue]] is where messages actually wait, in first-in, first-out (FIFO) order. A queue has:

- **A name**: up to 255 bytes. Names starting with `amq.` are reserved for the broker. If you declare an empty name, the broker generates one of the form `amq.gen-…`, often used for a consumer's temporary queue.
- **`durable`**: the queue is restored when the broker restarts. A non-durable queue is deleted on restart.
- **`exclusive`**: only the connection that declared it may use it, and the queue is deleted when that connection closes. Good for temporary queues.
- **`auto-delete`**: deleted when the last consumer leaves (after there has been at least one consumer).
- **Arguments**: extension options starting with `x-`, such as the queue type (`x-queue-type`), message TTL, maximum length. Station 6 and station 7 use them a lot.

> [!warning] RabbitMQ 4.3+: a non-durable queue must be exclusive
> Since 4.3, declaring a queue with `durable: false` without `exclusive` is **rejected**, and the connection closes with the error `541 INTERNAL_ERROR - Feature transient_nonexcl_queues is deprecated`. Many old tutorials (including old versions of the official tutorial) use `durable: false`. Every example on this line uses durable queues.

Redeclaring an existing queue with different properties (for example adding `x-max-length`) makes the broker return `406 PRECONDITION_FAILED` and close the channel. To change the configuration of a running queue, use a **policy** ([[en/posts/2026-11-21-rabbitmq-operations|station 9]]).

### Binding and routing key: the rule and the label

A [[en/concepts/binding|binding]] is a rule linking an exchange to a queue: *"exchange E copies messages into queue Q when the label matches pattern K"*. The pattern K is called the **binding key**.

A [[en/concepts/routing-key|routing key]] is the label the producer puts on **each message** when publishing. The exchange compares the message's routing key with the binding key of each binding to decide.

The two are often confused because their names are so similar:

| | Routing key | Binding key |
|---|---|---|
| Where it lives | on the message | on the binding |
| Who sets it | the producer, when publishing | whoever declares the binding (usually the consumer) |
| Example | `order.cancelled` | `order.*` |

A queue can have many bindings (listening to many kinds of message), and an exchange can bind to many queues (one message copied many times). That is how station 1's decoupling becomes real: adding a listener only takes one more queue and one more binding.

### The message: envelope, note and letter

An AMQP message has three parts. See also [[en/concepts/message-properties|Message properties]].

- **Body**: a byte array. The broker **doesn't read** the body; JSON or Protobuf is up to the two ends.
- **Properties**: standard fields, like the information preprinted on an envelope.
  - `delivery_mode`: 1 = non-persistent, 2 = persistent (written to disk). In `amqplib` it is `{ persistent: true }`.
  - `content_type`, `content_encoding`: what the body is and how it is encoded.
  - `message_id`: the message's identifier, used to prevent duplicate processing ([[en/posts/2026-11-21-rabbitmq-delivery-guarantees|station 5]]).
  - `correlation_id`, `reply_to`: used for the request-reply pattern (station 5).
  - `expiration`: the message's time to live, in milliseconds, as a string (station 6).
  - `priority`: the priority (station 6).
  - `timestamp`, `type`, `app_id`; for `user_id`, the broker checks that it matches the logged-in user.
- **Headers**: an arbitrary key-value table, like a note clipped to the envelope. Often used to carry an event ID, a trace ID, or the number of attempts so far.

Since RabbitMQ 4.0, the default maximum message size is **16 MiB** (it was 128 MiB before). Large messages cost RAM and network; put heavy data in file storage (such as S3) and send only the path.

### Default exchange: why `sendToQueue` "publishes straight into a queue"

There is a direct exchange **with no name** (the empty string `""`). Every queue is automatically bound to it with a binding key equal to **the queue's own name**, and nobody can bind or unbind it manually. That's why:

```ts
ch.sendToQueue("email.q", body)
// is really
ch.publish("", "email.q", body)  // exchange "" + routing key = queue name
```

The picture of "the producer publishes straight into a queue" comes from here. It's handy for small examples, but it loses all routing power: the producer has to know the queue name, which means knowing the receiver. For events with several listeners, publish to a named exchange.

### The full journey of a message

```mermaid
sequenceDiagram
    participant P as Producer
    participant X as Exchange
    participant Q as Queue
    participant C as Consumer
    P->>X: basic.publish<br/>(routing key,<br/>properties, body)
    X->>Q: match bindings,<br/>copy into matching queue
    Note over Q: message waits (ready)
    Q->>C: basic.deliver<br/>(pushed to consumer)
    Note over C: done processing
    C->>Q: basic.ack,<br/>message deleted
```

A consumer receives messages by **push**: it subscribes once with `basic.consume`, and the broker pushes messages to it as they arrive. There is also **pull** (`basic.get`, asking for one message at a time), but the RabbitMQ docs advise against it because it is very expensive: each ask is a network round trip, even when the queue is empty. The final `ack` step is the topic of [[en/posts/2026-11-21-rabbitmq-ack-confirm|station 4]].

## Runnable example

The file `model.ts` builds a miniature of Figure 1 and tests four things: routing through a binding, `sendToQueue` actually going through the default exchange, a soft error closing only the channel, and redeclaring a queue with different properties. Run it with the Docker broker from station 1:

```bash
docker run -d --rm --name atlas-rabbit -p 5673:5672 -p 15673:15672 rabbitmq:4-management
npm i amqplib && node model.ts
```

The main part (full version: [model.ts](../code/rabbitmq-amqp-model/model.ts)):

```ts
const conn = await amqp.connect('amqp://guest:guest@localhost:5673', {
  clientProperties: { connection_name: 'atlas-demo' },
});
const ch = await conn.createChannel(); // channel: a logical "lane" inside the connection

await ch.assertExchange(EX, 'direct', { durable: true });
await ch.assertQueue(Q, { durable: true });
await ch.bindQueue(Q, EX, 'thu.hcm'); // binding key
ch.publish(EX, 'thu.hcm', Buffer.from('thư gửi HCM'), {
  persistent: true, contentType: 'text/plain', messageId: 'thu-001',
  headers: { 'nguoi-gui': 'Hà Nội' },
}); // routing key
ch.publish(EX, 'thu.danang', Buffer.from('thư gửi Đà Nẵng')); // no binding matches

ch.sendToQueue(Q, Buffer.from('gửi thẳng tên hộc'));
ch.publish('', Q, Buffer.from('publish vào exchange "" với key = tên queue'));
```

```text
$ node model.ts
1) HCM mailbox received: thư gửi HCM | routingKey = thu.hcm | exchange = demo.buu-dien | messageId = thu-001 | header nguoi-gui = Hà Nội
   HCM mailbox has left: 0 messages (the Da Nang letter went nowhere)
2) received: "gửi thẳng tên hộc" via exchange = "", routingKey = demo.hoc-thu-hcm
2) received: "publish vào exchange "" với key = tên queue" via exchange = "", routingKey = demo.hoc-thu-hcm
3) channel 2 closed: no exchange 'khong-co-exchange-nay' in vhost '/'"
   connection still alive? channel 1 still usable: true
4) channel 3 closed: inequivalent arg 'x-max-length' for queue 'demo.hoc-thu-hcm' in vhost '/': recei
```

*(Output labels translated; the files themselves print Vietnamese.)*

Four things worth noticing in the output:

1. The Da Nang letter vanished, and `publish` reported no error. The exchange found no matching binding, so it dropped the message.
2. Both ways of sending give the same result: `exchange = ""`, with the queue name as the routing key.
3. Publishing to an exchange that doesn't exist only kills channel 2; channel 1 on the same connection keeps running.
4. Redeclaring the queue with `x-max-length` is rejected (`inequivalent arg`), and again only the channel is lost.

While it runs, open `http://localhost:15673` → the **Connections** tab shows the connection named `atlas-demo` with its channels.

## Misconceptions and common traps

### "The producer publishes messages into a queue"

Always through an exchange. `sendToQueue` is a shortcut through the default exchange. If you design around a named exchange, adding a listener doesn't require changing the producer.

### Opening a connection per request

Every connection is an authenticated TCP connection that costs RAM and a file handle on the broker. Open one connection when the application starts and reuse it for the application's whole lifetime. Libraries such as `amqp-connection-manager` also take care of reconnecting automatically.

### Sharing one channel among several threads

Operations on the same channel can interleave and cause protocol errors. One more trap: delivery tags are tied to a channel, so acking on a different channel makes the broker report "unknown delivery tag" and close the channel.

### Not listening for the channel-closed event

A soft error closes the channel asynchronously. If you don't catch the `error`/`close` events, later operations on that channel fail without anyone knowing. That is exactly why the example above catches `ch2.on('error', …)`.

### Confusing the routing key with the binding key

The routing key lives on the message, the binding key on the rule. Mistype either one and the message goes astray with no error.

### Treating a vhost as a way to split resources

A vhost separates names and permissions, not RAM or CPU. To truly isolate resources for a group of applications, you need a separate broker (or cluster).

### Copying old examples with `durable: false`

On RabbitMQ 4.3+, such an example brings the connection down with error 541. Use `durable: true`, or `exclusive: true` for temporary queues.

## Self-check questions

> [!question]- Can a producer publish straight into a queue?
> No. Every message goes through an exchange. `sendToQueue` uses the default exchange (the empty name), where every queue is automatically bound with a binding key equal to its own name.

> [!question]- How do a connection and a channel differ? How many should you open?
> A connection is a long-lived, expensive TCP connection; a channel is a lightweight logical lane inside it. A few connections per application (usually one for publishing, one for consuming) and one channel per thread.

> [!question]- Where do the routing key and the binding key live?
> The routing key lives on the message and is set by the producer. The binding key lives on the binding between an exchange and a queue.

> [!question]- What happens when you publish a message that matches no binding?
> By default the message is silently dropped, and `publish` reports no error. Station 3 has two ways to catch these messages: the `mandatory` flag and the alternate exchange.

> [!question]- Does a vhost keep one RAM-hungry application from affecting the others?
> No. A vhost only separates names, permissions and policies. All vhosts share the broker's resources.

> [!question]- Why doesn't a 404 error on publish bring down the whole connection?
> It is a soft error, scoped to one channel. The broker closes that channel and reports back; the other channels on the same connection keep running.

## References

- [RabbitMQ: AMQP 0-9-1 Model Explained](https://www.rabbitmq.com/tutorials/amqp-concepts)
- [RabbitMQ: Connections](https://www.rabbitmq.com/docs/connections), [Channels](https://www.rabbitmq.com/docs/channels), [Heartbeats](https://www.rabbitmq.com/docs/heartbeats)
- [RabbitMQ: Virtual Hosts](https://www.rabbitmq.com/docs/vhosts)
- [RabbitMQ: Queues](https://www.rabbitmq.com/docs/queues)
- [RabbitMQ: Publishers](https://www.rabbitmq.com/docs/publishers)
- [RabbitMQ 4.0 release notes](https://github.com/rabbitmq/rabbitmq-server/blob/main/release-notes/4.0.1.md) and [4.3](https://github.com/rabbitmq/rabbitmq-server/blob/main/release-notes/4.3.0.md)
- [amqplib: Channel API](https://amqp-node.github.io/amqplib/channel_api.html)
