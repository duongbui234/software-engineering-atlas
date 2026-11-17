---
name: learn
description: Học một chủ đề kỹ thuật cùng Claude ngay trong chat (tra nguồn, giải thích, ví dụ chạy được) và ghi nhật ký học để /publish viết thành bài.
disable-model-invocation: true
argument-hint: "[chủ đề] [--repo <đường dẫn dự án>]"
---

# /learn

A **lesson** in chat: the owner learns one topic from you, in Vietnamese, the way a good senior engineer teaches. Everything the owner asks, gets wrong, or finally gets goes into the **learning log**, which `/publish` turns into a post. The post is only as honest as the log, so record the owner's own words, not your summary of them.

## 1. Pick the topic

- If an argument names a topic, use it.
- If not, read `backlog.md` and the series hubs in `content/series/`. Propose 3 candidates and let the owner choose. Rank higher a candidate that connects to existing `content/concepts/` notes, or that is the next unvisited station on a hub.
- With `--repo <path>`, the lesson is about the owner's own code: the topic is a flow in that project, and the post type will be `code`.

Done when one topic is agreed. Derive `<slug>` (kebab-case, ASCII, no date).

## 2. Open the learning log

Create `.learn/<slug>.md` (gitignored) from this skeleton, or resume it if it exists:

```markdown
# <topic>
started: <YYYY-MM-DD>   type: learn|code|note   series: <id>/<part> or none

## Sources
## Owner's starting point
## Questions asked (verbatim)
## Misconceptions → corrections
## Examples run (path, command, real output)
## Diagram idea
## Concepts touched
## Check questions (and whether the owner got them)
```

Ask one calibration question: what the owner already knows or uses, and why they want this topic now. Log the answer under "Owner's starting point".

## 3. Research

Read primary sources first: official docs, RFCs, MDN, engineering blogs of the companies that run the thing. With `--repo`, read the actual code paths, and log file paths plus the flow you traced.

Log every URL under Sources. A paywalled or paid source is a reference only: learn from it, but build your own structure and wording (see Writing conventions in `CLAUDE.md`).

Done when you can explain the mechanism without hedging and every claim you will make has a source or a run behind it.

## 4. Teach in rounds

Each round is one idea, in this arc across the lesson: **intuition** (why the problem exists, a concrete failure) → **mechanism** (how it works, step by step; sketch the flow you will later draw with archify) → **runnable example** → **trade-offs and traps**.

- Keep each message short enough to read in a minute. End each round with one check question or an invitation to ask, then wait.
- Write examples in TypeScript unless the topic needs another language. Put them in the scratchpad, **run them**, and show the real output. Log path, command and output.
- When the owner asks something, log it verbatim. When the owner holds a wrong model ("mình tưởng…"), log it under Misconceptions with the correction. These become the post's voice and its traps section.
- When the owner's question opens a side topic, answer it briefly and add it to `backlog.md` rather than derailing the lesson.

## 5. Close the lesson

The lesson is done when the owner answers the final check questions correctly in their own words, or says they have what they need. Log the result.

Then finish the log:
- **Diagram idea:** which archify diagram type fits and the participants or steps it would show.
- **Concepts touched:** each concept in the lesson that deserves its own `concepts/` note.

Tell the owner the log path and that `/publish <slug>` turns it into a post.
