# Translating the Atlas into English

The Vietnamese site is the source. The English site is a parallel tree under `content/en/` with the **same file names**, so every page has a counterpart at `en/<same path>`. This file is the contract every translation follows, whether a person or an agent writes it.

## Where files go

| Vietnamese source | English translation |
|---|---|
| `content/index.md` | `content/en/index.md` |
| `content/posts/<file>.md` | `content/en/posts/<file>.md` |
| `content/concepts/<file>.md` | `content/en/concepts/<file>.md` (same file name, even when the name is Vietnamese, e.g. `commit-va-rollback.md`) |
| `content/series/<file>.md` | `content/en/series/<file>.md` |
| `content/problems/<file>.md` (NeetCode problem pages and `index.md`) | `content/en/problems/<file>.md` |
| `content/diagrams/<dir>/<name>.json` + `.html` | `content/diagrams/<dir>/<name>.en.json` + `<name>.en.html` (same folder) |
| `content/code/**` | **not translated**: English posts link to the same files |

Never edit a Vietnamese file while translating.

## Frontmatter

- Keep every key and value as is, **except**:
  - translate `title`, `description` and `headline`;
  - translate each station `name` on a hub;
  - translate `region` (table below).
- Add `lang: en`.
- `date`, `series`, `part`, `code`, `type`, `level`, `tags`, `sources`, `lc` and `draft` stay identical.
- `aliases` (old URLs that redirect) get the `en/` prefix: `aliases: [en/posts/<old file>]`. The theme pairs pages by series and part.
- Quote any `title` or `description` that contains a colon.
- On a hub, the `concepts:` lists must use the English concept titles: the same as Vietnamese for English titles, mapped for the 12 below.

## Links

- **Wikilinks**: the Vietnamese files already use full paths (`[[concepts/acid|ACID]]`). In English, prefix `en/`: `[[en/concepts/acid|ACID]]`, `[[en/posts/2026-11-22-transactions-race|station 2]]`, `[[en/series/caching|the Caching line]]`. Never write a bare `[[acid]]`: two files share that name now, and Quartz would resolve it to a broken link.
- **Relative links** stay exactly as in Vietnamese: `](../code/...)` and `href="../diagrams/..."`. With `markdownLinkResolution: shortest`, Quartz reads `../x` as the site-root path `x` at any depth, so `../../code` from `en/posts/` would point one level above the site. The only exception is `data-archify`, which the theme script resolves against the page URL and therefore needs one more `../` (below).
- **archify embeds** point at the English viewer:
  ```html
  <figure class="figure-map" style="--ar: 3 / 4">
  <div class="frame"><iframe data-archify="../../diagrams/<dir>/<name>.en.html" title="…" loading="lazy"></iframe></div>
  <figcaption><span><b>Figure 1.</b> …</span><a href="../diagrams/<dir>/<name>.en.html" target="_blank" rel="noopener">Open full screen</a></figcaption>
  </figure>
  ```
- **External links** stay as they are.

## Diagrams

1. Copy `<name>.json` to `<name>.en.json`.
2. Translate every `title`, `label`, `sublabel`, `note`, segment `label` and card text. Keep commands, routes, SQL, code and numbers verbatim.
3. Set `meta.output` to `content/diagrams/<dir>/<name>.en.html`.
4. Render with `node ~/.agents/skills/archify/bin/archify.mjs finalize <diagram_type> <name>.en.json <name>.en.html --quality showcase --json`. `<diagram_type>` is the JSON's `diagram_type`; run from the repo root with repo-relative paths.
5. The run must report `"status": "pass"`. On `sequence/note-overlap`, move the later messages (and the segment ends after them) further down and run again. English is often shorter than Vietnamese, so overlaps are rare. Never ship a failed render.
6. Receipt files (`*.finalize.json`, `*.browser-check.json`, `*.delivery.json`, `*.finalize-summary.json`) are gitignored; leave them.

## Mermaid

Translate node and edge labels. Keep the shape: `flowchart TB`, `<br/>` breaks, and no label starting with `#`, `1.` or `- `. Keep labels as short as, or shorter than, the Vietnamese.

## Voice and style

- First person singular ("I"), a learner retelling what they figured out: "I used to think X; it turns out Y." Plain, concrete, friendly. Not marketing, not academic.
- Translate meaning, not word order. Rewrite sentences so they read as native technical English.
- Use American spelling.
- Keep every claim, number, measurement and caveat. Add nothing and drop nothing.
- Code blocks: translate **comments** in snippets shown in the post; never change code.
- Output blocks (`text` fences showing a program's run): translate the human labels (`ca đúng` → `cases passed`) and keep every number, identifier and error message exactly. Under the first output block of a post, add one line: `*(Output labels translated; the files themselves print Vietnamese.)*`
- Bối cảnh callouts that say "you need no knowledge of NestJS or the repo" keep that promise in English.

## Fixed section names

| Vietnamese | English |
|---|---|
| `> [!tldr] Đọc nhanh` | `> [!tldr] Quick read` |
| `> [!info] Bối cảnh` | `> [!info] Context` |
| `> [!abstract]- Từ điển nhanh cho bài này (bấm để mở)` | `> [!abstract]- Quick glossary for this post (click to open)` |
| `## Hình dung trước: …` | `## Picture it first: …` |
| table header `Đời thường \| Khái niệm` | `Everyday life \| Concept` |
| `## Vấn đề: …` | `## The problem: …` |
| `## Cơ chế` | `## How it works` |
| `## Ví dụ chạy được` | `## Runnable example` |
| `## Hiểu lầm và bẫy hay gặp` | `## Misconceptions and common traps` |
| `## Câu hỏi tự kiểm tra` | `## Self-check questions` |
| `## Tham khảo` | `## References` |
| `## Nếu bạn mới bắt đầu` (hub) | `## If you are just starting` |
| `## Vì sao xếp theo thứ tự này` (hub) | `## Why this order` |
| `## Phiên bản và nguồn` (hub) | `## Versions and sources` |
| `Hình 1.` | `Figure 1.` |
| `Mở toàn màn hình` | `Open full screen` |
| "Đọc thêm trong bài [[…]]" (concept notes) | "Read more in [[…]]" |

## The map vocabulary

The site is drawn as a map and its series as metro lines. Keep the metaphor in English.

| Vietnamese | English |
|---|---|
| tuyến (a series) | line ("the Caching line") |
| ga (a part of a series) | station ("station 3", "the next station") |
| ga 1, ga 2… | station 1, station 2… |
| bạn đang ở đây | you are here |
| lộ trình | route |
| vùng (map region) | region |
| địa danh (a concept on the map) | place |

## Hub titles

| Vietnamese | English |
|---|---|
| Tuyến API Concepts | The API Concepts Line |
| Tuyến Caching | The Caching Line |
| Tuyến RabbitMQ | The RabbitMQ Line |
| Tuyến WebSocket và Socket.IO | The WebSocket and Socket.IO Line |
| Tuyến Transaction và khóa | The Transactions and Locking Line |
| Tuyến NeetCode: Mảng và chuỗi | The NeetCode Line: Arrays and Strings |
| Tuyến NeetCode: Tìm kiếm và heap | The NeetCode Line: Search and Heaps |
| Tuyến NeetCode: Cấu trúc liên kết | The NeetCode Line: Linked Structures |
| Tuyến NeetCode: Đồ thị | The NeetCode Line: Graphs |
| Tuyến NeetCode: Quy hoạch động | The NeetCode Line: Dynamic Programming |
| Tuyến NeetCode: Kỹ thuật tổng hợp | The NeetCode Line: Mixed Techniques |

NeetCode station names are in the hubs (`content/en/series/neetcode-*.md`); reuse them verbatim when a post names a station.

Mention another line as "the Caching line", "the RabbitMQ line" and so on in running text.

## Regions

| Vietnamese | English |
|---|---|
| Vùng API | API Region |
| Vùng Cache | Cache Region |
| Vùng Messaging | Messaging Region |
| Vùng Realtime | Realtime Region |
| Vùng Database | Database Region |
| Vùng Thuật toán | Algorithms Region |
| Vùng Flash sale | Flash Sale Region |
| Vùng Vận hành | Operations Region |

## Concept titles

A concept note's English `title` equals its Vietnamese `title` when that title is already English (`ACID`, `Cache Stampede`, `Quorum Queue`…). Vietnamese titles map to these, and hubs must list the same strings:

| Vietnamese title | English title |
|---|---|
| Cache Hit và Miss | Cache Hit and Miss |
| Commit và Rollback | Commit and Rollback |
| Ghi hai nơi | Dual Write |
| Filtering và Sorting | Filtering and Sorting |
| Giao thức ngoài AMQP 0-9-1 | Protocols Beyond AMQP 0-9-1 |
| HTTPS và TLS | HTTPS and TLS |
| Giữ kho | Inventory Reservation |
| LRU và LFU | LRU and LFU |
| Producer và Consumer | Producer and Consumer |
| Queue và Log | Queue and Log |
| SCAN và KEYS | SCAN and KEYS |
| Hàng chờ ảo | Virtual Queue |
| Đường đi minimax | Minimax Path |
| Relaxation theo lớp cạnh | Edge-Layer Relaxation |

## Technical terms

Use the term the official documentation uses: PostgreSQL docs, RabbitMQ docs, Redis docs, RFC 6455 and RFC 9111, MDN, the Go spec, the Java and Python docs. Common ones:

| Vietnamese | English |
|---|---|
| bán quá số hàng | oversell, overselling |
| giữ hàng, giữ kho | reserve stock, stock reservation |
| trừ kho | decrement stock |
| suất (flash-sale slot) | unit (e.g. "100 units") |
| đơn, đơn hàng | order |
| người mua | buyer |
| khóa bi quan / lạc quan | pessimistic / optimistic locking |
| khóa dòng | row lock |
| cập nhật có điều kiện | conditional update |
| bù trừ | compensation |
| đối soát | reconciliation |
| phòng thủ nhiều lớp | defense in depth |
| hàng đợi | queue |
| thư, tin (RabbitMQ message) | message |
| thư lỗi | dead letter |
| người gửi / người nhận | producer / consumer |
| biên nhận (publisher confirm) | confirm |
| xác nhận (ack) | ack, acknowledgement |
| bộ nhớ đệm, cache | cache |
| trúng / trượt cache | cache hit / miss |
| hết hạn | expire, expiry |
| làm mất hiệu lực | invalidate, invalidation |
| bản cũ | stale data |
| đường truyền (Engine.IO transport) | transport |
| kết nối lại | reconnect |
| nhịp tim | heartbeat |
| vét cạn | brute force |
| băm, hash | hash |
| va chạm (hash) | collision |
| khấu hao | amortized |
| phần bù | complement |
| khóa chuẩn | canonical key |
| chốt (quickselect) | pivot |
| phân hoạch | partition |
| đóng hộp (Java) | boxing |
| dừng sớm | early exit |
| độ phức tạp | complexity |
| đánh đổi | tradeoff |
| xác thực / phân quyền | authentication / authorization |
| thu hồi / xoay vòng (token) | revoke / rotation |
| điểm chết | single point of failure |
| đường nóng / đường lùi | hot path / fallback |
| thay đổi phá vỡ / thêm vào | breaking / additive (non-breaking) change |
| cầu dao | circuit breaker |
| gom request | request coalescing |
| bão cache hết hạn cùng lúc | cache avalanche |
| tin báo hủy / kênh báo hủy | invalidation message / invalidation channel |
| xóa kép có trễ | delayed double delete |
| lưới an toàn | safety net |
| bia mộ | tombstone |
| nút ảo (consistent hashing) | virtual node |
| hộc thư (analogy) / hàng đợi | mail slot / queue |
| bãi đỗ (parking queue) | parking lot |
| kho ảo, suất ma | phantom stock, phantom unit |
| sổ kho | stock ledger |
| cổng nguyên tử | atomic gate |
| vòng chờ (deadlock) | wait cycle |
| gộp tin | coalesce messages |
| danh sách cho phép | allowlist |
| đồng bộ lại | resynchronize |
| khung (RFC 6455) / gói (Engine.IO, Socket.IO) | frame / packet |
| bộ nhớ phụ | auxiliary space |
| trạng thái DP | DP state |
| công thức truy hồi | recurrence relation |
| mốc cắt | cut boundary |
| đuôi nhỏ nhất | minimum tail |
| tăng nghiêm ngặt | strictly increasing |
| quét tổng giảm dần / tăng dần | descending / ascending sum sweep |
| thời gian giả đa thức | pseudopolynomial time |
| phép cộng bão hòa | saturating addition |
| trạng thái cuộn | rolling state |
| điền bảng từ dưới lên | bottom-up tabulation |
| vun lên / vun xuống (heap) | sift up / sift down |
| phân hoạch ba nhánh | three-way partition |
| dạng dựng sẵn / dạng tách (Unicode) | precomposed / decomposed form |
| bài luyện, trang bài (NeetCode) | problem, problem page |
| kho bài | problem set |
| bài neo (của một ga) | anchor problem |
| khuôn (giải) | template |
| đầu dãy (Longest Consecutive Sequence) | run start |
| xô (bucket sort) | bucket |
| dấu phân cách | delimiter |
| hỏi trước, ghi sau | ask first, write later |
| phân tích gộp | aggregate analysis |
| dãy (số) liên tiếp | consecutive run |
| ô 3×3 (Sudoku) | 3×3 box |
| tiền tố, hậu tố | prefix, suffix |
| tích tiền tố, tích hậu tố | prefix product, suffix product |
| biến chạy | running variable |
| dấu phân cách | delimiter |
| thoát ký tự | escaping |
| tiền tố độ dài | length prefix |
| cắt không gian tìm kiếm | search space pruning |
| bỏ trùng | duplicate skipping |
| giảm k-Sum | k-Sum reduction |
| max tiền tố, max hậu tố | prefix maximum, suffix maximum |
| neo (3Sum) | anchor |
| mực nước | water level |
| ký tự chữ-số | alphanumeric character |
| cửa sổ trượt | sliding window |
| bất biến (của cửa sổ) | (window) invariant |
| sổ vị trí gần nhất | last-seen index |
| giá thấp nhất từ trước tới nay | running minimum |
| cửa sổ cố định, co giãn | fixed-size, variable-size window |
| hàng đợi đơn điệu | monotonic deque |
| đoạn con, dãy con | substring, subsequence |
| cửa sổ không co | non-shrinking window |
| hoán vị | permutation |
| bộ đếm số ô khớp | matching-cell counter |
| cửa sổ đủ | complete window |
| bảng còn thiếu | still-missing table |
| hàng đợi hai đầu | deque (double-ended queue) |
| xóa lười | lazy deletion |
| ngăn xếp | stack |
| đỉnh (ngăn xếp) | top (of the stack) |
| khớp cặp (ngoặc) | bracket matching |
| ngoặc mở, ngoặc đóng | opener, closer |
| ngăn xếp phụ cho min | auxiliary min stack |
| ký pháp Ba Lan ngược | reverse Polish notation |
| quay lui | backtracking |
| cây lựa chọn, chỉ số bắt đầu | choice tree, start index |
| chọn, đi sâu, gỡ lựa chọn | choose, go deeper, undo |
| lấy hoặc bỏ | take or skip |
| tập con, đa tập | subset, multiset |
| bỏ trùng cùng tầng, nhánh anh em | skip same-level duplicates, sibling branch |
| cắt nhánh | pruning |
| bộ đệm, tích Descartes | buffer, cartesian product |
| mảng nền (Go) | backing array |
| làm tròn về 0, làm tròn xuống | truncate toward 0, floor |
| ngăn xếp gọi hàm | call stack |
| số Catalan | Catalan number |
| cây lựa chọn | choice tree |
| sinh hết rồi lọc | generate then filter |
| bộ đệm dùng chung | shared buffer |
| bài thiết kế | design problem |
| lưu hiệu | storing differences |
| tràn số | overflow |
| máy trạng thái, luật chuyển | state machine, transitions |
| đang giữ, vừa bán, tay không | holding, just sold, empty-handed |
| ngày nghỉ (bắt buộc) | rest day (cooldown) |
| bóc lớp (topo) | peel layers (topological peeling) |
| bậc ra | out-degree |
| tràn ngăn xếp, độ sâu đệ quy | stack overflow, recursion depth |
| tập đã thăm, tập "đang thăm" | visited set, "visiting" set |
| DP khoảng, khoảng mở (l, r) | interval DP, open interval (l, r) |
| điểm chia, độ dài khoảng | split point, interval length |
| nổ (bóng), quả nổ cuối cùng | burst, the balloon that bursts last |
| lính canh | sentinel |
| khớp trọn, khớp một đoạn | full match, partial match |
| neo (^, $) | anchor |
| quay lui | backtracking |
| cây lựa chọn, chỉ số bắt đầu | choice tree, start index |
| chọn, đi sâu, gỡ lựa chọn | choose, go deeper, undo |
| lấy hoặc bỏ | take or skip |
| tập con, đa tập | subset, multiset |
| bỏ trùng cùng tầng, nhánh anh em | skip same-level duplicates, sibling branch |
| cắt nhánh | pruning |
| bộ đệm, tích Descartes | buffer, cartesian product |
| mảng nền (Go) | backing array |
| vế trái, vế phải (toán hạng) | left, right operand |
| máy ngăn xếp | stack machine |
| ngăn xếp đơn điệu (tăng, giảm) | monotonic stack (increasing, decreasing) |
| phần tử lớn hơn kế tiếp | next greater element |
| phần tử canh, lính canh | sentinel |
| đoàn xe, nhập đoàn | fleet, join the fleet |
| biểu đồ cột | histogram |
| nhân chéo | cross-multiplication |
| cột thấp hơn gần nhất | nearest smaller bar |
| chia để trị | divide and conquer |
| tìm kiếm nhị phân, chia đôi | binary search |
| bất biến vòng lặp | loop invariant |
| khoảng nửa mở | half-open interval |
| khoảng đóng | closed interval |
| tràn điểm giữa | midpoint overflow |
| cận dưới, cận trên | lower bound, upper bound |
| khoảng còn nghi | suspect range |
| vị trí chèn | insertion point |
| mảng xoay | rotated sorted array |
| chỗ gãy, điểm gãy | break, pivot |
| nửa lành | intact half |
| một lượt, hai lượt | one pass, two passes |
| chỉ số phẳng | flat index |
| đi bậc thang | staircase walk |
| thứ tự theo hàng | row-major order |
| tìm kiếm nhị phân trên đáp án | search on the answer |
| vị từ đơn điệu | monotonic predicate |
| chia làm tròn lên | ceiling division |
| không gian đáp án | answer space |
| phép thử | check |
| kịp, trễ | in time, too slow |
| mốc thời gian | timestamp |
| lịch sử của key | a key's history |
| quét lùi | scan backwards |
| chèn đúng chỗ | in-place insert |
| giá trị từ tương lai | value from the future |
| kho nhiều phiên bản | multi-version store |
| cây đỏ đen | red-black tree |
| trung vị | median |
| vị trí cắt, vết cắt | cut position, cut |
| phần tử thứ k | k-th element |
| loại bỏ (tìm phần tử thứ k) | elimination |
| chia nguyên | integer division |
| chia lấy sàn | floor division |
| cắt về 0 | truncate toward 0 |
| đối chiếu ngẫu nhiên | random cross-check |
| nổi lên, chìm xuống | sift up, sift down |
| đỉnh (heap) | top |
| thay đỉnh | replace the top |
| heap k chỗ | size-k heap |
| ứng viên yếu nhất | weakest candidate |
| dựng heap | build a heap |
| khóa âm, đảo dấu | negative key, negate |
| hàng đợi ưu tiên | priority queue |
| luồng | stream |
| hàm so sánh | comparator |
| chốt | pivot |
| phân hoạch ba phần, cờ Hà Lan | three-way partition, Dutch national flag |
| phân hoạch Lomuto, Hoare | Lomuto, Hoare partition |
| nguyên lý chuồng bồ câu | pigeonhole principle |
| bình phương khoảng cách | squared distance |
| đếm theo cân nặng | counting by weight |
| sắp xếp mỗi lượt | re-sort every round |
| hai heap | two heaps |
| nửa nhỏ, nửa lớn | lower half, upper half |
| trung vị chạy | running median |
| trộn k đường, trộn k danh sách | k-way merge |
| cân lại cỡ | rebalance |
| xóa trễ | lazy deletion |
| chèn mảng đã sắp | sorted insert |
| nhịp | interval |
| nghỉ | idle |
| thời gian nguội | cooldown |
| hàng chờ nguội | cooldown queue |
| khung, công thức khung | frame, frame formula |
| bảng tin | news feed, timeline |
| gom rồi sắp | collect then sort |
| đồng hồ toàn cục | global clock |
| đẩy lúc ghi | fan-out on write |
| đọc lúc cần | fan-out on read |
| sắp ổn định | stable sort |
| danh sách liên kết | linked list |
| nút | node |
| con trỏ next | next pointer |
| nút giả | dummy node |
| con trỏ chậm, nhanh | slow, fast pointer |
| lật con trỏ tại chỗ | in-place pointer reversal |
| đan hai nửa, đan xen | interleave the halves, interleave |
| vòng | cycle |
| đầu vòng | cycle start |
| rùa và thỏ | tortoise and hare |
| danh tính, giá trị | identity, value |
| nửa đầu, nửa sau | first half, second half |
| giữa thứ hai | second middle |
| nối lại | splice, relink |
| bỏ qua một nút | unlink |
| khung gọi hàm | stack frame |
| bộ gom rác | garbage collector |
| khoảng cách n + 1 | a gap of n + 1 |
| danh sách hai chiều | doubly linked list |
| nút canh | sentinel node |
| đẩy ra | evict |
| sức chứa | capacity |
| đan nút, đan bản sao xen kẽ | node interleaving |
| mang số nhớ, số nhớ | carry propagation, carry |
| trộn chia để trị, trộn từng cặp | divide-and-conquer merge, merge in pairs |
| trộn lần lượt | merge one by one |
| lật từng khúc | group reversal |
| khúc cuối | last chunk |
| LRU xấp xỉ | approximated LRU |
| sao chép nông, sâu | shallow, deep copy |
| tràn im lặng | silent overflow |
| chữ số xếp ngược, xuôi | digits stored backwards, forwards |
| số nguyên lớn | big integer |
| đánh dấu âm | mark negative |
| chuỗi tuần tự, rải rác | sequential, scattered chain |
| cây nhị phân | binary tree |
| duyệt hậu thứ tự | post-order traversal |
| giới hạn độ sâu đệ quy | recursion depth limit |
| băm cây | tree hashing |
| cây lệch | skewed tree |
| chiều cao, độ sâu | height, depth |
| đường kính | diameter |
| kỷ lục (biến best) | running best |
| ngăn xếp tự quản lý | explicit stack |
| cây con | subtree |
| lá | leaf |
| mảng theo tầng | level-order array |
| đánh số chuẩn | canonical numbering |
| kiểm vét | exhaustive check |
| log có cấu trúc | structured logging, structured logs |
| mức log, ngưỡng log | log level, threshold |
| mã theo dõi request | correlation id, request id |
| ngữ cảnh request | request context |
| che dữ liệu cá nhân, che PII | PII redaction, PII masking |
| đường gửi log | log shipping |
| kho log | log store |
| vòng tham chiếu | circular reference |
| cây nhị phân tìm kiếm | binary search tree (BST) |
| duyệt trung thứ tự | in-order traversal |
| truyền khoảng, mang khoảng xuống | bounds propagation, pass the bounds down |
| khoảng mở | open interval, open range |
| cận dưới, cận trên | lower bound, upper bound |
| tổ tiên chung thấp nhất | lowest common ancestor |
| tổ tiên, hậu duệ | ancestor, descendant |
| điểm tách | split point |
| đi một đường | walk one path |
| so ngặt, tăng ngặt | strict comparison, strictly increasing |
| chuỗi tăng, chuỗi lệch phải | increasing chain, right chain |
| đệ quy đuôi | tail recursion |
| sợi nối, sợi chỉ (Morris) | thread (Morris) |
| dừng sớm | early stop |
| kích thước cây con | subtree size |
| cây thống kê thứ tự | order-statistic tree |
| cây tự cân bằng | self-balancing tree |
| duyệt theo chiều rộng | breadth-first search (BFS) |
| chụp cỡ tầng, chụp kích thước tầng | level size snapshot |
| tầng, độ sâu | level, depth |
| duyệt tiền thứ tự | pre-order traversal |
| góc nhìn bên phải, bên trái | right side view, left side view |
| cây đầy đủ | complete tree; perfect tree when every level is full |
| cây đầy | full tree |
| lấy đầu hàng đợi | take the front of the queue |
| chỉ số đầu hàng | head index |
| tầng rộng nhất | widest level |
| vạch ngăn tầng | level marker |
| duyệt theo chiều sâu | depth-first search (DFS) |
| mang trạng thái xuống | carry state down |
| danh sách kề | adjacency list |
| bảng bản sao, sổ cũ → mới | clone map, old → new map |
| đi ngược từ đích | reverse reachability, walk backward from the target |
| đồ thị ẩn | implicit graph |
| BFS hai đầu | bidirectional BFS |
| xô theo mẫu | pattern buckets |
| so từng cặp | compare every pair |
| sổ đã thăm | visited log, visited set |
| đồ thị vô hướng | undirected graph |
| đỉnh, cạnh (đồ thị) | vertex, edge |
| sao chép sâu, sao chép nông | deep copy, shallow copy |
| danh tính đối tượng | object identity |
| bị bao kín | surrounded |
| leo dốc, ngược dòng | uphill, against the flow |
| ô bờ, viền, biên | border cell, border |
| gieo bờ | seed the border |
| tập với tới | reached set |
| vùng bị vây | surrounded region |
| sửa tại chỗ | in place |
| nút ảo | virtual node |
| tô từng vùng | region fill, fill one region at a time |
| gạch (một từ) | cross out (a word) |
| từ ứng viên | candidate word |
| từ điển dày, thưa | dense dictionary, sparse dictionary |
| nút tốt | good node |
| trạng thái đường đi | path state |
| kỷ lục của đường đi | path maximum, the path's record |
| khôi phục khi quay về | restore on return |
| chuỗi không giảm, không tăng | non-decreasing chain, non-increasing chain |
| truyền theo giá trị | pass by value |
| dựng lại cây | tree reconstruction |
| khoảng trung thứ tự | inorder interval |
| bảng vị trí, chỉ mục vị trí | position index |
| dấu con trống, dấu rỗng | null marker |
| mã hóa cây | tree serialization |
| chỗ chờ | pending slot |
| bộ mã hóa/giải mã | codec |
| phép thử đi-về | round-trip test |
| tổng nhánh đi xuống, tổng tốt nhất trả lên | downward path gain |
| nút cao nhất trên đường đi | highest node on the path |
| khung ngăn xếp | stack frame |
| tổng đường hoàn chỉnh | complete path score |
| cây tiền tố | trie, prefix tree |
| dấu hết từ, dấu kết thúc từ | terminal marker |
| cạnh theo ký tự | character edge |
| bảng con thưa, map con thưa | sparse child map |
| mảng con cố định | fixed child array |
| ký tự đại diện | wildcard |
| rẽ nhánh tại dấu chấm, phân nhánh theo ký tự đại diện | wildcard branching |
| cắt nhánh theo tiền tố, cắt theo tiền tố | trie prefix pruning |
| nhóm theo độ dài | length bucket |
| đồ thị lưới | grid graph |
| kề bốn hướng | four-way adjacency |
| tô vùng, loang vùng | flood fill |
| mầm, ô bắt đầu | seed, starting cell |
| thành phần liên thông | connected component |
| đánh dấu khi vào hàng đợi, đánh dấu khi xếp hàng | mark on enqueue |
| BFS đa nguồn | multi-source BFS |
| lớp, đợt lan | layer, wave |
| phòng không tới được | unreachable room |
| đồ thị có hướng không chu trình | directed acyclic graph (DAG) |
| thứ tự topo, sắp xếp topo | topological order, topological sort |
| bậc vào | in-degree |
| môn tiên quyết | prerequisite |
| chu trình, vòng | cycle |
| DFS ba màu (trắng, xám, đen) | three-color DFS (white, gray, black) |
| thứ tự hoàn thành đảo ngược | reverse postorder |
| ràng buộc thứ tự | precedence constraint |
| cạnh có hướng | directed edge |
| quét lại | rescan |
| lượt quét | pass |
| lần nhìn cạnh | edge looks |
| DFS tự giữ ngăn xếp | DFS with an explicit stack |
| quét lặp | repeated scan |
| ngăn xếp tự quản | hand-managed stack |
| chuỗi xuôi, chuỗi ngược | forward chain, backward chain |
| mở khóa (môn học) | unlock (a course) |
| thứ tự từ điển | lexicographic order |
| manh mối | clue |
| danh bạ | phone book |
| ô trên, ô trái, ô chéo | cell above, cell to the left, diagonal cell |
| tiền tố rỗng | empty prefix |
| lần ngược (bảng) | trace back |
| phép sửa, kịch bản sửa | edit operation, edit script |
| giữ, thay, xóa, chèn (ký tự) | keep, replace, delete, insert |
| dãy con, chuỗi con | subsequence, substring |
| đan xen | interleave |
| trần (mức chặn) | ceiling (clamp) |
| tràn số | overflow |
| máy trạng thái, luật chuyển | state machine, transitions |
| đang giữ, vừa bán, tay không | holding, just sold, empty-handed |
| ngày nghỉ (bắt buộc) | rest day (cooldown) |
| bóc lớp (topo) | peel layers (topological peeling) |
| bậc ra | out-degree |
| tràn ngăn xếp, độ sâu đệ quy | stack overflow, recursion depth |
| tập đã thăm, tập "đang thăm" | visited set, "visiting" set |
| DP khoảng, khoảng mở (l, r) | interval DP, open interval (l, r) |
| điểm chia, độ dài khoảng | split point, interval length |
| nổ (bóng), quả nổ cuối cùng | burst, the balloon that bursts last |
| lính canh | sentinel |
| khớp trọn, khớp một đoạn | full match, partial match |
| neo (^, $) | anchor |
| quay lui | backtracking |
| cây lựa chọn, chỉ số bắt đầu | choice tree, start index |
| chọn, đi sâu, gỡ lựa chọn | choose, go deeper, undo |
| lấy hoặc bỏ | take or skip |
| tập con, đa tập | subset, multiset |
| bỏ trùng cùng tầng, nhánh anh em | skip same-level duplicates, sibling branch |
| cắt nhánh | pruning |
| bộ đệm, tích Descartes | buffer, cartesian product |
| mảng nền (Go) | backing array |

Program strings and printed output stay in Vietnamese (code is never changed); where the prose first mentions such a string, give its meaning in parentheses: `'Hết hàng'` ("sold out").

When a Vietnamese post writes a plain-language role first and the class second, keep both: "bảo vệ (JwtAuthGuard)" → "the guard (JwtAuthGuard)".
