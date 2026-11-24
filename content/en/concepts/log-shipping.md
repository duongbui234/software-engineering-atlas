---
title: "Log Shipping"
description: "Moving logs from many copies of an app into one central store so they can be searched in one place."
tags: [logging, observability, kubernetes]
type: note
region: Operations Region
lang: en
---

There are two ways. The app ships its own logs (a transport pushes straight into Elasticsearch): simple, but the buffer lives in the app's RAM, and when the log store dies the app pays for it. The way the Twelve-Factor App and Kubernetes assume: the app only writes to stdout, and an agent on each node (Filebeat, Fluent Bit, Vector) reads container logs, buffers on disk and resends when the store comes back. A log file inside a container is lost when the pod restarts unless it has a volume. The write target and the reader (Kibana, Grafana) must point at the same index or data stream.

Read more in [[en/posts/2026-11-24-flash-sale-logging|The flash-sale logging system]].
