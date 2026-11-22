---
name: publish
description: Biến nhật ký học (.learn/<slug>.md) thành bài blog kèm sơ đồ archify, ghi chú khái niệm và code đã chạy, rồi mở PR để duyệt.
disable-model-invocation: true
argument-hint: "[slug]"
---

# /publish

Turn a **learning log** into a post on a `post/<slug>` branch and open a PR. Merging the PR publishes the post, so the PR must be review-ready: built, previewed, every example re-run. This skill never merges.

The rules for content live in `CLAUDE.md` and are not repeated here. Apply them in full:
- **Content model:** paths, frontmatter, series hubs, coordinate codes.
- **Writing conventions:** voice, the `learn` skeleton, sources, private code.
- **archify embedding contract:** file layout, embed snippet, size budget.

`content/posts/2026-11-18-api-reliability.md` is the reference post. Match its shape and tone.

## 1. Load the log

Use `.learn/<slug>.md`. With no argument, use the most recently modified log. If no log exists but this conversation holds the lesson, write the log first from the conversation (see `/learn` step 2), then continue.

Done when you know the topic, type, series and part (if any), sources, the owner's questions and misconceptions, the examples that ran, the diagram idea, and the concepts touched.

## 2. Place the post

- **Date:** today.
- **Path:** `content/posts/<YYYY-MM-DD>-<slug>.md`.
- **Series:** if the topic belongs to a hub in `content/series/`, set `series` and `part` to that station's number.
  - If the station does not exist yet, propose the hub change to the owner before editing the hub.
  - A brand-new series gets a new hub. Propose its stations to the owner first.
- **Non-series posts:** pick the next free `NOTE-<NNN>` or `PRJ-<NN>` code by scanning existing frontmatter.
- **`level`:** from how deep the lesson went.

Create the branch from an up-to-date `main`:

```bash
git switch main && git pull --ff-only && git switch -c post/<slug>
```

## 3. Write the post

Shape the post from the log, not from a generic outline:
- The "Vấn đề" section opens from the owner's starting point.
- "Hiểu lầm và bẫy" uses the logged misconceptions first.
- The self-check questions reuse the logged check questions.
- The owner's verbatim questions decide what the body explains at length.

Then write the three opening blocks from `CLAUDE.md` for a reader who has never seen the owner's code:
- **Bối cảnh**: what the example project is, in 2–4 sentences.
- **Từ điển nhanh**: every tool or term the post uses without explaining. Scan the finished draft for one more pass; a term you missed is a term a newcomer stops at.
- **Hình dung trước**: pick one everyday analogy that covers *every* concept of the post, write the `Đời thường | Khái niệm` table and a Mermaid diagram. Done when each concept in the post's tldr has a row.

Write every Mermaid block by the Mermaid rules in `CLAUDE.md` (tall not wide, stacked subgraphs, no label starting with `#` or `1.`, wrapped sequence messages).

In the body, lead with the plain role and put the class name second.

`description` is one sentence that names the problem the post solves; it shows under the title, on the home page and in RSS. Wikilink each concept on first mention (`[[idempotency]]`). Set `draft: false`: the PR is the review gate.

## 4. Code

Copy each logged example into `content/code/<slug>/`, using a file name different from the folder name. **Re-run it from there.** Paste the real output into the post.

- A shortened snippet in the post must still match the file.
- Anything that cannot run standalone carries `// minh họa, không chạy trực tiếp`.

## 5. Diagram

Invoke the `archify` skill with the logged diagram idea. Write the candidate to `content/diagrams/<slug>/<name>.json`, with `meta.output` set to the sibling `.html`, and run `finalize` until it passes.

Label it as the archify contract in `CLAUDE.md` says: plain-Vietnamese roles in `label`, class and tool names in `sublabel`, commands and routes in message `note`s.

Embed it with the snippet from the archify contract. Set `--ar` close to the diagram's shape (`1 / 1` for architecture, `3 / 4` for tall sequence diagrams); it is only the placeholder size, since `ARCHIFY_SCRIPT` resizes the frame to the rendered diagram. Write a caption sentence that states what the diagram proves.

Use at most one archify diagram per post. Any secondary flow becomes a Mermaid block.

## 6. Concept notes

For every concept touched, create or update `content/concepts/<term>.md`. Each note has:
- frontmatter `title`, `description`, `tags`, `type: note`, and `region` (the hub's region for series topics);
- a short body: a 2–4 sentence definition in the owner's voice, plus a wikilink back to this post.

For an existing note, add the backlink and sharpen the definition. Keep what is already there.

## 7. Verify

Every check below must pass:

1. `CI=true npx quartz build` finishes with no error. CI mode fails on broken plugins.
2. The **render check** passes on that build: `npm i --no-save playwright-core@1.49.1 && node scripts/check-render.mjs`. It opens every page at 390px and 1440px and fails on horizontal page scroll, a broken Mermaid block, an "Unsupported markdown" label, or a diagram shrunk below 75%. CI runs the same check, so a red local run means a red PR. Each failure names the page and, for overflow, the element that starts it. Fix the post (or the theme) and rerun until it prints `✓`.
3. Preview with `npx quartz build --serve`. Screenshot the post at 1440px and 390px, in both light and dark, plus the home page (see Commands in `CLAUDE.md`). Look at each screenshot and confirm:
   - the post appears in "Bài mới" with the right coordinate code;
   - the margin and standfirst render;
   - the series mini-line marks this station;
   - the archify iframe loads in the right theme and is not cut off;
   - every Mermaid block reads well: the render check proves it renders and is not shrunk, the screenshot proves the layout makes sense;
   - the code block matches the file;
   - concept notes link both ways.
4. `public/diagrams/<slug>/` and `public/code/<slug>/` contain the files with their real names and extensions.

Fix and repeat until every check passes. A failure you can't resolve goes into the PR body, marked as an open issue.

## 8. Open the PR

Commit with a message naming the post and its coordinate code, push the branch, and open a PR with `gh pr create`. The PR body lists:
- the post title, code and one-line summary;
- new or updated concept notes;
- the diagram, the examples and their run commands;
- any hub change;
- a review checklist for the owner: accuracy, voice, nothing private leaked.

Done when the PR is open and its CI build is green (`gh pr checks --watch`). Give the owner the PR link and the local preview command. Then move the log to `.learn/published/<slug>.md`.
