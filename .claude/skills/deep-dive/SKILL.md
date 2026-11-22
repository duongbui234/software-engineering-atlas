---
name: deep-dive
description: Tự nghiên cứu trọn một chủ đề kỹ thuật, viết thành bài (hoặc cả series) thật chi tiết, rồi tự mở PR, chờ CI xanh, tự merge và xóa nhánh.
disable-model-invocation: true
argument-hint: "<chủ đề> [--repo <đường dẫn dự án>]"
---

# /deep-dive

An **end-to-end run**: you research one topic exhaustively, write it up for the Atlas, and ship it to `main` yourself. The owner is not in the loop: no calibration questions, no review. Every post ships in Vietnamese and English. The gates are mechanical instead (examples run, English edition passes `i18n/check-translation.py`, build passes, render check passes, screenshots look right, privacy scan clean, CI green), and a failed gate stops the run before merge.

Content rules live in `CLAUDE.md` (content model, writing conventions, archify contract). Apply them in full.

## 1. Scope the topic

- The argument names the topic. With `--repo <path>`, the topic is a flow in the owner's own code and posts get `type: code`.
- Derive `<slug>` (kebab-case, ASCII, no date).
- Check `content/series/`, `content/posts/` and `content/concepts/` for overlap. Link to what exists; write only what is new.

Done when you know the slug and what already exists on the topic.

## 2. Research

Build a **concept inventory**: every concept a working engineer needs to really own this topic, from first principles to production traps. Read primary sources first (specs, RFCs, official docs, source code, well-known engineering blogs), and cross-check every claim that will become a sentence in a post against at least one of them.

Write the research into `.learn/<slug>.md`, using the log skeleton from `/learn` step 2 (`.claude/skills/learn/SKILL.md`). Where the owner's sections have no owner input, fill them from research:
- *Owner's starting point* → the naive mental model a learner usually starts with.
- *Misconceptions* → the common wrong beliefs and the evidence against each.
- *Questions asked* → the questions a newcomer would ask, which decide what the body explains at length.

Run every example you plan to publish (TypeScript by default, `node file.ts`) and log the real output.

Done when the inventory has no concept you would have to hand-wave, every concept has a source, and every planned example has run.

## 3. Shape the output

- **Fits one post** (about 4–6 concepts): one post, `NOTE-<NNN>` code, or a station on an existing hub.
- **Bigger**: a new series hub `content/series/<id>.md` with ~6–8 stations of 4–6 concepts each, ordered so each station uses only the vocabulary of earlier ones. Write **every** station in this run.

Done when each concept in the inventory belongs to exactly one post.

## 4. Write

Create the branch from an up-to-date `main`:

```bash
git switch main && git pull --ff-only && git switch -c post/<slug>
```

For each post, follow `/publish` steps 3–7 (`.claude/skills/publish/SKILL.md`): post body, code, one archify diagram, concept notes, and the English edition (post, notes, hub if any, `.en` diagram) per `i18n/TRANSLATING.md`. Go deep: each concept gets mechanism, a run example or diagram, its traps and a self-check question. Set `draft: false`.

With `--repo`, publish only diagrams and trimmed, renamed snippets.

Done when every concept in the inventory is explained in a post and has a `content/concepts/` note, and each of those files has its `content/en/` counterpart.

## 5. Verify

Run `/publish` step 8 for every post, starting with `python3 i18n/check-translation.py` over the whole `content/en` tree before the build; its render check (`node scripts/check-render.mjs`) covers the whole site in one run, so run it once after the last post is written. Then run the **privacy scan** over the diff (`git diff main --stat` and the full text): no company or customer names, internal hosts or endpoints, keys, tokens, emails, or absolute home paths.

Every check must pass. Fix and repeat. A check you cannot make pass is a **stop**: go to step 7.

## 6. Ship

```bash
git add -A && git commit        # message names the posts and their coordinate codes
git push -u origin post/<slug>
gh pr create -R duongbui234/software-engineering-atlas --base main --fill-first   # body: posts, concepts, diagrams, sources
gh pr checks <n> -R duongbui234/software-engineering-atlas --watch
```

`gh` defaults to the upstream Quartz repo here, so always pass `-R duongbui234/software-engineering-atlas`.

When the checks are green, merge and clean up:

```bash
gh pr merge <n> -R duongbui234/software-engineering-atlas --squash --delete-branch
git switch main && git pull --ff-only
git branch -D post/<slug> 2>/dev/null; git fetch --prune
```

Then watch the deploy on `main` (`gh run list -R duongbui234/software-engineering-atlas --branch main --limit 1`, then `gh run watch <id> --exit-status`) and open the live post URLs `https://duongbui234.github.io/software-engineering-atlas/posts/<file-slug>` and `…/en/posts/<file-slug>` to confirm both serve.

Done when the deploy run is green, both post URLs load, and neither the local nor the remote `post/<slug>` branch exists. Move the log to `.learn/published/<slug>.md`.

## 7. Report

Tell the owner: the live URLs (Vietnamese and English), the concept notes added, the sources, and anything shallow or uncertain worth a follow-up.

On a **stop** (a failed gate in step 5, a red CI check, a merge conflict): leave the PR open and unmerged, keep the branch, and report the failing gate with its output.
