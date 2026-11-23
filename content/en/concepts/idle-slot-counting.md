---
title: "Idle Slot Counting"
description: "Count the fewest idle intervals when every task must cool down for n intervals: the most frequent task (f runs) sets up f − 1 frames of length n + 1, plus the k tasks that reach f; the answer is max(task count, (f − 1)(n + 1) + k)."
tags: ["algorithms", "greedy"]
type: note
region: Algorithms Region
lang: en
---

When two runs of the same task must be at least n + 1 intervals apart, the most frequent task (f runs) sets the skeleton of the schedule: it needs f − 1 **frames** of length n + 1 and then one last run. If k tasks share the count f, the last frame has k slots. The other tasks fill the free slots in the frames; any slot left unfilled becomes an idle interval. So the answer is `max(task count, (f − 1)(n + 1) + k)`: the right side is the lower bound forced by the most frequent task, the left side covers the case where there are so many tasks that every frame is full and no interval idles. To print a real schedule, spread the remaining tasks by column across the frames in **descending** order of count; ascending order can put two runs of the same task too close together. The idea carries over to the "arrange so that equal elements are at least k apart" problems.

Read more in [[en/problems/task-scheduler|Task Scheduler (LC 621)]].
