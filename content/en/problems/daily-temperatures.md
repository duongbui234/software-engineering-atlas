---
title: "Daily Temperatures: a stack of waiting days, and why a while inside a for is still O(n)"
description: "For each day, how many days until a warmer one: brute force O(n²) takes 309 ms on 40 000 decreasing days, a monotonic stack takes under 1 ms; this page counts the pops to prove O(n), shows the >= instead of > trap, and a jump-along-answers approach with no stack at all."
date: 2026-11-23T20:00:00+07:00
tags: [algorithms, neetcode, stack]
type: problem
lc: 739
level: intermediate
draft: false
lang: en
sources:
  - https://leetcode.com/problems/daily-temperatures/
  - https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayDeque.html
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at
---

> [!tldr] Quick read
> - The problem: given each day's temperature, return for each day how many days until the first **warmer** day; 0 if there is none. This is the original "[[en/concepts/next-greater-element|next greater element]]" problem.
> - Brute force: each day searches forward. O(n²) when temperatures decrease: 309 ms at n = 40 000.
> - [[en/concepts/monotonic-stack|Monotonic stack]]: keep the indices of the days **still waiting**, temperatures decreasing from bottom to top. A new day warmer than the top pops it and records its answer. Each index goes in once and comes out at most once: O(n) even with a `while` inside a `for`.
> - Trap: `>=` instead of `>` treats a day of **equal** temperature as warmer: `[70, 70, 71]` gives `[1, 1, 0]` instead of `[2, 1, 0]`.
> - A third approach: walk from the right and **jump along answers** already computed, with no stack.

> [!info] Context
> LeetCode problem 739, the anchor problem of [[en/posts/2026-11-23-neetcode-monotonic-stack|station 7: Monotonic Stack]] on **the NeetCode line: Arrays and Strings**. It uses the [[en/concepts/stack|stack]] of [[en/posts/2026-11-23-neetcode-stack|station 6]] with one extra rule: the elements on the stack are always ordered in one direction. The solutions come in TypeScript, Python, Go, Java and JavaScript. All you need to know is loops, arrays and stacks.

> [!abstract]- Quick glossary for this post (click to open)
> - **Stack**: add and remove only at the top, last in first out. See [[en/concepts/stack|Stack]].
> - **Monotonic**: always decreasing (or always increasing) in one direction. A "monotonically decreasing stack" means that, reading from bottom to top, values never increase.
> - **Next greater element**: for each position, the first element to its right that is larger. See [[en/concepts/next-greater-element|Next Greater Element]].
> - **Aggregate analysis**: counting the total steps of the whole algorithm instead of multiplying loop counts. See [[en/concepts/aggregate-analysis|Aggregate Analysis]].

## Picture it first: a line of people waiting for the sun

Every morning one person goes out to the yard holding a card with that day's temperature. Each waits for a day **warmer** than their own, then goes home. Whoever arrives later stands **in front of** whoever came before, so only the outermost person sees the new day.

| Everyday life | Concept |
|---|---|
| The line of waiting people, the newest one outermost | the stack of days without an answer yet |
| The outermost person's card is always colder than or equal to the one behind | a monotonically decreasing stack |
| This morning beats the outermost card: that person goes home, writing "waited k days" | `pop` and record `out[j] = i − j` |
| The next person is revealed; if this morning still beats them, they leave too | the `while` loop |
| This morning doesn't beat the outermost person: then it beats nobody behind them either, so today joins the line | stop the `while`, `push` today |
| At season's end, whoever is still waiting never got a warmer day | answer 0 |

```mermaid
flowchart TB
  A["day i, temperature t[i]"] --> B["stack empty?"]
  B -->|"empty"| E["push i"]
  B -->|"no"| C["t[i] > t[top]?"]
  C -->|"yes"| D["j = pop<br/>out[j] = i − j"]
  D --> B
  C -->|"no: equal<br/>or colder"| E
  E --> F["move to day i + 1"]
```

## The problem

**The problem (in my own words):** given an array `temperatures` (1 ≤ n ≤ 10⁵, each value 30..100), return an array `answer` where `answer[i]` is the number of days after day i until a **strictly** warmer day; 0 if there is no such day. Original: [LeetCode 739](https://leetcode.com/problems/daily-temperatures/).

| Input | Output |
|---|---|
| `[73, 74, 75, 71, 69, 72, 76, 73]` | `[1, 1, 4, 2, 1, 1, 0, 0]` |
| `[30, 40, 50, 60]` | `[1, 1, 1, 0]` |
| `[90, 80, 70]` | `[0, 0, 0]` |
| `[70, 70, 71]` | `[2, 1, 0]` |

I used to think each day had to "look ahead". It turns out flipping the question is neater: instead of each day searching the future, let **each new day resolve the old days** waiting for it.

## How it works

<figure class="figure-map" style="--ar: 3 / 4">
<div class="frame"><iframe data-archify="../../diagrams/neetcode-daily-temperatures/worked-example.en.html" title="A warmer day resolves waiting days" loading="lazy"></iframe></div>
<figcaption><span><b>Figure 1.</b> A warmer day resolves waiting days.</span><a href="../diagrams/neetcode-daily-temperatures/worked-example.en.html" target="_blank" rel="noopener">Open full screen</a></figcaption>
</figure>

<details>
<summary>Read the steps</summary>
<ol>
<li>Days 0 and 1 still await a warmer day. <code>[72, 68, 74, 73]</code></li>
<li>Day 2 resolves day 1. <code>74 &gt; 68, wait = 1</code></li>
<li>Day 2 also resolves day 0. <code>74 &gt; 72, wait = 2</code></li>
<li>The last two days retain zero. <code>[2, 1, 0, 0]</code></li>
</ol>
</details>

### Approach 1, brute force: O(n²) in the worst case

For each i, walk `j = i + 1, i + 2, …` until `t[j] > t[i]`. On random data you usually hit one early, so it's fast. On **decreasing** data no day ever finds one, and each day scans to the end: n²/2 comparisons.

### Approach 2, monotonic stack

Keep a stack of the **indices** of days without an answer yet. Walk each day i:
1. while the stack is non-empty and `t[i] > t[top]`: pop the top j and record `out[j] = i − j`, because day i is the **first** warmer day after j (every day between j and i already failed to resolve j);
2. push i.

After step 1, `t[i]` is not greater than the top, so pushing i keeps the decreasing (non-increasing) order from bottom to top. That order is why step 1 stops at the right moment: if day i is not warmer than the top, it is not warmer than any day below it.

Store **indices**, not temperatures: the answer is a distance, and the temperature can be looked up from the index.

### Why a `while` inside a `for` is still O(n)

Count with [[en/concepts/aggregate-analysis|aggregate analysis]]: each index is pushed exactly once and popped at most once. The total number of pops across **all** iterations of the `while` loop is at most n, so the total work is O(n). The TypeScript file counts it: on 10⁶ random days, 986 082 pops plus 13 918 indices left on the stack add up to exactly 10⁶.

### Approach 3, walk from the right and jump along answers

Walk i from right to left. To find the day warmer than i, start at `j = i + 1`. If `t[j] ≤ t[i]`, every day from j up to j's warmer day is not warmer than j, so not warmer than i either: jump straight `j += out[j]`. If `out[j] = 0`, j has no warmer day, so neither does i. No stack: O(1) extra space, and still O(n) by the same aggregate argument.

### Measured

TypeScript, median:

| n | data | brute force | stack | jump from right |
|---|---|---|---|---|
| 10 000 | decreasing | 21.0 ms | 0.15 ms | 0.04 ms |
| 20 000 | decreasing | 85.0 ms | 0.34 ms | 0.13 ms |
| 40 000 | decreasing | 317.4 ms | 0.67 ms | 0.19 ms |
| 40 000 | random 30..100 | 4.8 ms | 0.62 ms | 0.52 ms |
| 10⁶ | decreasing | (not run) | 19.84 ms | 5.20 ms |
| 10⁶ | random | (not run) | 16.70 ms | 13.12 ms |

Brute force on decreasing data follows the n² shape exactly (double n, about 4 times the time). On random data with only 71 values, a warmer day is usually very close, so brute force is only about 8 times slower: random tests don't catch the worst case. At 10⁶ decreasing days, the stack has to hold all 10⁶ indices, while the jump approach allocates nothing and is almost 4 times faster.

### Under the hood of the five languages

| | The stack | Language-specific trap |
|---|---|---|
| TypeScript / JavaScript | an array: `push`, `pop`, `stack[stack.length - 1]` or `stack.at(-1)` | `stack[-1]` is `undefined`, not the last element; `t[undefined]` is `undefined` too and `x > undefined` is `false`, so the bug never blows up |
| Python | a `list`: `append`, `pop`, `stack[-1]` | `stack[-1]` on an empty list raises `IndexError`; write `while stack and …` |
| Go | a slice: `append`, `stack[:len(stack)-1]` | preallocate capacity with `make([]int, 0, n)` so `append` never reallocates |
| Java | `ArrayDeque<Integer>`: `push`, `pop`, `peek` | boxes every index; a stack in an `int[]` with a top pointer is about 12 times faster in the measurement below. Avoid `java.util.Stack` (legacy, synchronized) |

## Runnable example

[TypeScript](../code/neetcode-daily-temperatures/daily-temperatures.ts) · [Python](../code/neetcode-daily-temperatures/daily_temperatures.py) · [Go](../code/neetcode-daily-temperatures/daily_temperatures.go) · [Java](../code/neetcode-daily-temperatures/daily-temperatures.java) · [JavaScript](../code/neetcode-daily-temperatures/daily-temperatures.js) · [PHP](../code/neetcode-daily-temperatures/daily-temperatures.php) · [Rust](../code/neetcode-daily-temperatures/daily_temperatures.rs)

Each of the original five files has the brute force, the stack and the jump-from-right approach, and runs 7 cases. Below are the stack and the jump approaches.

```ts
// Approach 2, monotonic stack: keep the INDICES of days still without a warmer day, temperatures decreasing from bottom to top.
function monotonicStack(t: number[]): number[] {
  const out = new Array(t.length).fill(0);
  const stack: number[] = [];
  for (let i = 0; i < t.length; i++) {
    while (stack.length > 0 && t[i] > t[stack[stack.length - 1]]) {
      const j = stack.pop()!; // day j has just met its first warmer day: day i
      out[j] = i - j;
    }
    stack.push(i);
  }
  return out; // days left on the stack have no warmer day: keep 0
}

// Approach 3, walk from the right and jump along answers: no stack, O(1) extra space.
function jumpFromRight(t: number[]): number[] {
  const n = t.length;
  const out = new Array(n).fill(0);
  for (let i = n - 2; i >= 0; i--) {
    let j = i + 1;
    while (j < n && t[j] <= t[i]) {
      if (out[j] === 0) { j = n; break; } // j has no warmer day, so neither does i
      j += out[j]; // jump straight to the day warmer than j
    }
    if (j < n) out[i] = j - i;
  }
  return out;
}
```

```python
def monotonic_stack(t: list[int]) -> list[int]:
    out = [0] * len(t)
    stack: list[int] = []  # indices, temperatures decreasing from bottom to top
    for i, x in enumerate(t):
        while stack and x > t[stack[-1]]:  # an empty stack is falsy: check before reading stack[-1]
            j = stack.pop()
            out[j] = i - j
        stack.append(i)
    return out

def jump_from_right(t: list[int]) -> list[int]:
    n = len(t)
    out = [0] * n
    for i in range(n - 2, -1, -1):
        j = i + 1
        while j < n and t[j] <= t[i]:
            if out[j] == 0:
                j = n
                break
            j += out[j]
        if j < n:
            out[i] = j - i
    return out
```

```go
func monotonicStack(t []int) []int {
	out := make([]int, len(t))
	stack := make([]int, 0, len(t)) // preallocate capacity: append never has to reallocate
	for i, x := range t {
		for len(stack) > 0 && x > t[stack[len(stack)-1]] {
			j := stack[len(stack)-1]
			stack = stack[:len(stack)-1] // pop by reslicing
			out[j] = i - j
		}
		stack = append(stack, i)
	}
	return out
}

func jumpFromRight(t []int) []int {
	n := len(t)
	out := make([]int, n)
	for i := n - 2; i >= 0; i-- {
		j := i + 1
		for j < n && t[j] <= t[i] {
			if out[j] == 0 {
				j = n
				break
			}
			j += out[j]
		}
		if j < n {
			out[i] = j - i
		}
	}
	return out
}
```

```java
static int[] intArrayStack(int[] t) {
    int[] out = new int[t.length], stack = new int[t.length]; // a stack in an int array: no Integer boxing
    int top = 0;
    for (int i = 0; i < t.length; i++) {
        while (top > 0 && t[i] > t[stack[top - 1]]) {
            int j = stack[--top];
            out[j] = i - j;
        }
        stack[top++] = i;
    }
    return out;
}

static int[] jumpFromRight(int[] t) {
    int n = t.length;
    int[] out = new int[n];
    for (int i = n - 2; i >= 0; i--) {
        int j = i + 1;
        while (j < n && t[j] <= t[i]) {
            if (out[j] == 0) { j = n; break; }
            j += out[j];
        }
        if (j < n) out[i] = j - i;
    }
    return out;
}
```

```js
function monotonicStack(t) {
  const out = new Array(t.length).fill(0);
  const stack = [];
  for (let i = 0; i < t.length; i++) {
    while (stack.length > 0 && t[i] > t[stack.at(-1)]) { // at(-1): the last element; stack[-1] is undefined
      const j = stack.pop();
      out[j] = i - j;
    }
    stack.push(i);
  }
  return out;
}

function jumpFromRight(t) {
  const n = t.length;
  const out = new Array(n).fill(0);
  for (let i = n - 2; i >= 0; i--) {
    let j = i + 1;
    while (j < n && t[j] <= t[i]) {
      if (out[j] === 0) { j = n; break; }
      j += out[j];
    }
    if (j < n) out[i] = j - i;
  }
  return out;
}
```

```php
<?php
// LeetCode 739, Daily Temperatures: ba cách, một bản sai, test và đo.
// Chạy: php daily-temperatures.php
declare(strict_types=1);

function bruteForce(array $t): array {
    $n = count($t);
    $out = array_fill(0, $n, 0);
    for ($i = 0; $i < $n; $i++) {
        for ($j = $i + 1; $j < $n; $j++) {
            if ($t[$j] > $t[$i]) {
                $out[$i] = $j - $i;
                break;
            }
        }
    }
    return $out;
}

// Cách 2, ngăn xếp đơn điệu: mảng PHP dùng làm ngăn xếp, giữ CHỈ SỐ, nhiệt độ giảm dần từ đáy lên đỉnh.
function monotonicStack(array $t): array {
    $out = array_fill(0, count($t), 0);
    $stack = [];
    foreach ($t as $i => $x) {
        while ($stack && $x > $t[$stack[count($stack) - 1]]) { // mảng rỗng là falsy: kiểm trước khi đọc đỉnh
            $j = array_pop($stack);
            $out[$j] = $i - $j;
        }
        $stack[] = $i;
    }
    return $out;
}

// Cùng thuật toán với SplStack (danh sách liên kết kép bên trong).
function splStack(array $t): array {
    $out = array_fill(0, count($t), 0);
    $stack = new SplStack();
    foreach ($t as $i => $x) {
        while (!$stack->isEmpty() && $x > $t[$stack->top()]) {
            $j = $stack->pop();
            $out[$j] = $i - $j;
        }
        $stack->push($i);
    }
    return $out;
}

// Cách 3, đi từ phải và nhảy theo đáp án: không cần ngăn xếp.
function jumpFromRight(array $t): array {
    $n = count($t);
    $out = array_fill(0, $n, 0);
    for ($i = $n - 2; $i >= 0; $i--) {
        $j = $i + 1;
        while ($j < $n && $t[$j] <= $t[$i]) {
            if ($out[$j] === 0) { $j = $n; break; } // j không có ngày ấm hơn, nên i cũng không
            $j += $out[$j]; // nhảy thẳng tới ngày ấm hơn j
        }
        if ($j < $n) $out[$i] = $j - $i;
    }
    return $out;
}

// SAI: lấy ra cả khi bằng nhiệt độ (>=).
function popOnEqual(array $t): array {
    $out = array_fill(0, count($t), 0);
    $stack = [];
    foreach ($t as $i => $x) {
        while ($stack && $x >= $t[$stack[count($stack) - 1]]) {
            $j = array_pop($stack);
            $out[$j] = $i - $j;
        }
        $stack[] = $i;
    }
    return $out;
}

$cases = [
    [[73, 74, 75, 71, 69, 72, 76, 73], [1, 1, 4, 2, 1, 1, 0, 0]], [[30, 40, 50, 60], [1, 1, 1, 0]], [[30, 60, 90], [1, 1, 0]],
    [[90, 80, 70], [0, 0, 0]], [[70, 70, 71], [2, 1, 0]], [[50], [0]],
    [[55, 38, 53, 81, 61, 93, 97, 32, 43, 78], [3, 1, 1, 2, 1, 1, 0, 1, 1, 0]],
];
foreach (['bruteForce', 'monotonicStack', 'splStack', 'jumpFromRight', 'popOnEqual'] as $fn) {
    $bad = [];
    foreach ($cases as [$t, $want]) {
        $got = $fn($t);
        if ($got !== $want) $bad[] = json_encode($t) . ' → ' . json_encode($got);
    }
    printf("%-15s %d/%d ca đúng%s\n", $fn, count($cases) - count($bad), count($cases), $bad ? '; sai ở ' . implode(', ', $bad) : '');
}

// Đo ở n = 10^5 (giới hạn của đề), dữ liệu giảm dần: ngăn xếp dài nhất.
$t = [];
for ($i = 0; $i < 100000; $i++) $t[] = 100 - intdiv(70 * $i, 100000);
echo "\nn = 100000 giảm dần (ms, trung vị 3 lần):";
foreach (['monotonicStack', 'splStack', 'jumpFromRight'] as $fn) {
    $ms = [];
    for ($r = 0; $r < 3; $r++) {
        $s = hrtime(true);
        $fn($t);
        $ms[] = (hrtime(true) - $s) / 1e6;
    }
    sort($ms);
    printf(" %s %.1f", $fn, $ms[1]);
}
echo "\n";
```

```rust
// LeetCode 739, Daily Temperatures: ba cách, một bản sai, test và đo.
// Chạy: rustc --edition 2021 -O daily_temperatures.rs -o daily_temperatures && ./daily_temperatures
use std::time::Instant;

fn brute_force(t: &[i32]) -> Vec<i32> {
    let mut out = vec![0; t.len()];
    for i in 0..t.len() {
        for j in i + 1..t.len() {
            if t[j] > t[i] {
                out[i] = (j - i) as i32;
                break;
            }
        }
    }
    out
}

// Cách 2, ngăn xếp đơn điệu: Vec<usize> giữ CHỈ SỐ, nhiệt độ giảm dần từ đáy lên đỉnh.
fn monotonic_stack(t: &[i32]) -> Vec<i32> {
    let mut out = vec![0; t.len()];
    let mut stack: Vec<usize> = Vec::with_capacity(t.len());
    for (i, &x) in t.iter().enumerate() {
        while let Some(&j) = stack.last() {
            // last() trả Option: ngăn xếp rỗng là None, không có chỉ số âm để đọc nhầm
            if x <= t[j] {
                break;
            }
            stack.pop();
            out[j] = (i - j) as i32;
        }
        stack.push(i);
    }
    out
}

// Cách 3, đi từ phải và nhảy theo đáp án: không cần ngăn xếp.
fn jump_from_right(t: &[i32]) -> Vec<i32> {
    let n = t.len();
    let mut out = vec![0; n];
    // n - 2 trên usize tràn khi n = 1; saturating_sub(1) cho khoảng rỗng thay vì panic.
    for i in (0..n.saturating_sub(1)).rev() {
        let mut j = i + 1;
        while j < n && t[j] <= t[i] {
            if out[j] == 0 {
                j = n; // j không có ngày ấm hơn, nên i cũng không
                break;
            }
            j += out[j] as usize; // nhảy thẳng tới ngày ấm hơn j
        }
        if j < n {
            out[i] = (j - i) as i32;
        }
    }
    out
}

// SAI: lấy ra cả khi bằng nhiệt độ (>=).
fn pop_on_equal(t: &[i32]) -> Vec<i32> {
    let mut out = vec![0; t.len()];
    let mut stack: Vec<usize> = Vec::new();
    for (i, &x) in t.iter().enumerate() {
        while let Some(&j) = stack.last() {
            if x < t[j] {
                break;
            }
            stack.pop();
            out[j] = (i - j) as i32;
        }
        stack.push(i);
    }
    out
}

fn main() {
    let cases: Vec<(Vec<i32>, Vec<i32>)> = vec![
        (vec![73, 74, 75, 71, 69, 72, 76, 73], vec![1, 1, 4, 2, 1, 1, 0, 0]),
        (vec![30, 40, 50, 60], vec![1, 1, 1, 0]),
        (vec![30, 60, 90], vec![1, 1, 0]),
        (vec![90, 80, 70], vec![0, 0, 0]),
        (vec![70, 70, 71], vec![2, 1, 0]),
        (vec![50], vec![0]),
        (vec![55, 38, 53, 81, 61, 93, 97, 32, 43, 78], vec![3, 1, 1, 2, 1, 1, 0, 1, 1, 0]),
    ];
    let fns: [(&str, fn(&[i32]) -> Vec<i32>); 4] = [
        ("brute_force", brute_force),
        ("monotonic_stack", monotonic_stack),
        ("jump_from_right", jump_from_right),
        ("pop_on_equal", pop_on_equal),
    ];
    for (name, f) in fns {
        let bad: Vec<String> = cases
            .iter()
            .filter_map(|(t, want)| {
                let got = f(t);
                (got != *want).then(|| format!("{:?} → {:?}", t, got))
            })
            .collect();
        let tail = if bad.is_empty() { String::new() } else { format!("; sai ở {}", bad.join(", ")) };
        println!("{:<16} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), tail);
    }

    // Đo ở n = 10^6, dữ liệu giảm dần: ngăn xếp dài nhất.
    let n = 1_000_000usize;
    let t: Vec<i32> = (0..n).map(|i| 100 - (70 * i / n) as i32).collect();
    print!("\nn = 1000000 giảm dần (ms, trung vị 3 lần):");
    let timed: [(&str, fn(&[i32]) -> Vec<i32>); 2] = [("monotonic_stack", monotonic_stack), ("jump_from_right", jump_from_right)];
    for (name, f) in timed {
        let mut ms: Vec<f64> = (0..3)
            .map(|_| {
                let s = Instant::now();
                std::hint::black_box(f(&t));
                s.elapsed().as_secs_f64() * 1000.0
            })
            .collect();
        ms.sort_by(|a, b| a.partial_cmp(b).unwrap());
        print!(" {} {:.2}", name, ms[1]);
    }
    println!();
}
```


```text
$ node daily-temperatures.ts
bruteForce      7/7 cases passed
monotonicStack  7/7 cases passed
jumpFromRight   7/7 cases passed
popOnEqual      6/7 cases passed; wrong on [70,70,71] → [1,1,0]

n        data         brute     stack      jump from right   (ms, median)
10000    decreasing      21.0       0.15           0.04
10000    random           0.4       0.14           0.11
20000    decreasing      85.0       0.34           0.13
20000    random           1.7       0.30           0.26
40000    decreasing     317.4       0.67           0.19
40000    random           4.8       0.62           0.52
1000000  decreasing         —      19.84           5.20
1000000  random             —      16.70          13.12

n = 1000000 random: 986082 pops, 13918 indices left on the stack (sum = n)
```

*(Output labels translated; the files themselves print Vietnamese.)*

The `popOnEqual` version uses `>=`: day 0 (70°) is popped by day 1 (also 70°) with answer 1, while the real warmer day is day 2. The other six cases have no two equal days in a row, so the wrong version passes them.

The Java file adds a stack in an `int[]` and measures both (one run after 3 JIT warm-up rounds; read it as an order of magnitude only):

```text
$ java daily-temperatures.java
bruteForce      7/7 cases passed
monotonicStack  7/7 cases passed
intArrayStack   7/7 cases passed
jumpFromRight   7/7 cases passed

n = 1000000 decreasing: ArrayDeque<Integer> 13.1 ms, int[] 1.1 ms
```

Python, Go and JavaScript print `7/7 ca đúng` ("7/7 cases passed") for all three approaches. The Python file also measures at n = 10⁵ (the problem's limit), decreasing data: stack 4.8 ms, jump 4.5 ms.

Both added files run brute force, the monotonic stack, and right-to-left jumps. PHP `bruteForce      7/7 ca đúng` · Rust `brute_force      7/7 ca đúng`.

## Misconceptions and common traps

- **"A `while` inside a `for` is O(n²)."** Count the total pops: at most n. See the count above.
- **Using `>=` instead of `>`.** The problem asks for **strictly** warmer. A day of equal temperature must stay on the stack.
- **Storing temperatures instead of indices.** Then the distance `i − j` can't be computed. Store indices and look temperatures up with `t[j]`.
- **Forgetting that days left on the stack have answer 0.** Initialize the answer array with 0 and there is nothing more to do.
- **Testing with random data.** Brute force is only 10 times slower on random data but 400 times slower on decreasing data. The worst case has to be built on purpose.
- **JS: `stack[-1]`.** JS arrays have no negative indices; `stack[-1]` is `undefined` and every comparison with it is `false`, so the `while` loop never runs and every answer is 0. Use `stack.at(-1)`.

## Self-check questions

> [!question]- Run the stack on `[50, 40, 45, 60]`, writing down the stack after each day.
> Day 0: `[0]`. Day 1 (40 ≤ 50): `[0, 1]`. Day 2 (45 > 40): pop 1, `out[1] = 1`; 45 ≤ 50, stack `[0, 2]`. Day 3 (60): pop 2, `out[2] = 1`; pop 0, `out[0] = 3`; stack `[3]`. Answer `[3, 1, 1, 0]`.

> [!question]- Why, when day i is not warmer than the top, can we stop without looking at the days below?
> The stack decreases from bottom to top, so every day below is warmer than or equal to the top. Not warmer than the top means not warmer than anyone below.

> [!question]- Change the problem: find the next **colder** day. What changes?
> Flip the comparison to `t[i] < t[top]`; the stack becomes monotonically **increasing** from bottom to top.

> [!question]- In the jump-from-right approach, why does `out[j] = 0` mean i has no warmer day either?
> We only reach j when `t[j] ≤ t[i]` or while jumping over days not warmer than i. j having no warmer day means every day after j is ≤ `t[j]` ≤ `t[i]`.

## References

- [LeetCode 739: Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) (the original problem)
- [Java 21 `ArrayDeque`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayDeque.html) (recommended over `Stack` when you need a stack)
- [MDN: `Array.prototype.at`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) (negative indices count from the end)
- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, chapter "Amortized Analysis" (the stack with `MULTIPOP`, the same aggregate argument)
