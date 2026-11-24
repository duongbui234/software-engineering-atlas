---
title: "PII Redaction"
description: "Masking data that identifies a person (email, phone number, tokens) before a log leaves the app."
tags: [logging, security]
type: note
region: Operations Region
lang: en
---

Logs are kept long, copied to many places and read by more people than the database, so an email or token in a log is a data leak. The usual approach: a list of PII field names and a format step that walks the log line and replaces their values (`an.nguyen@…` → `an***@…`). Masking by field name misses PII in messages built with template strings and in `Error.message`. The masker must survive circular references (`WeakSet`), read `Error` objects (non-enumerable properties), keep the logging library's Symbol keys, and **never throw**: a masker that throws breaks the very request being logged.

Read more in [[en/posts/2026-11-24-flash-sale-logging|The flash-sale logging system]].
