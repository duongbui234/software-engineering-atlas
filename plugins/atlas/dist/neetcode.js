// Danh mục NeetCode 150: nguồn duy nhất cho trang kho problems/, mã LC-xxxx, bảng "Các bài trong ga này"
// và việc xếp mỗi bài vào một ga (pattern) của 6 tuyến NeetCode.
// Một bài "đã viết" khi có trang content/problems/<slug>.md với `lc: <số>` trùng số ở đây.
//
// Mỗi dòng: [số LeetCode, slug LeetCode, tên bài, độ khó (E/M/H), nhóm NeetCode, tuyến, ga]
// Tuyến là `series` của hub (content/series/<tuyến>.md); ga là `part` của post pattern.

export const LINES = ["neetcode-arr", "neetcode-srch", "neetcode-link", "neetcode-grph", "neetcode-dp", "neetcode-misc"]

const A = "neetcode-arr"
const S = "neetcode-srch"
const L = "neetcode-link"
const G = "neetcode-grph"
const D = "neetcode-dp"
const M = "neetcode-misc"

const ROWS = [
  // ── Arrays & Hashing ──
  [217, "contains-duplicate", "Contains Duplicate", "E", "Arrays & Hashing", A, 1],
  [242, "valid-anagram", "Valid Anagram", "E", "Arrays & Hashing", A, 2],
  [1, "two-sum", "Two Sum", "E", "Arrays & Hashing", A, 1],
  [49, "group-anagrams", "Group Anagrams", "M", "Arrays & Hashing", A, 2],
  [347, "top-k-frequent-elements", "Top K Frequent Elements", "M", "Arrays & Hashing", A, 2],
  [271, "encode-and-decode-strings", "Encode and Decode Strings", "M", "Arrays & Hashing", A, 3],
  [238, "product-of-array-except-self", "Product of Array Except Self", "M", "Arrays & Hashing", A, 3],
  [36, "valid-sudoku", "Valid Sudoku", "M", "Arrays & Hashing", A, 2],
  [128, "longest-consecutive-sequence", "Longest Consecutive Sequence", "M", "Arrays & Hashing", A, 1],
  // ── Two Pointers ──
  [125, "valid-palindrome", "Valid Palindrome", "E", "Two Pointers", A, 4],
  [167, "two-sum-ii-input-array-is-sorted", "Two Sum II - Input Array Is Sorted", "M", "Two Pointers", A, 4],
  [15, "3sum", "3Sum", "M", "Two Pointers", A, 4],
  [11, "container-with-most-water", "Container With Most Water", "M", "Two Pointers", A, 4],
  [42, "trapping-rain-water", "Trapping Rain Water", "H", "Two Pointers", A, 4],
  // ── Sliding Window ──
  [121, "best-time-to-buy-and-sell-stock", "Best Time to Buy and Sell Stock", "E", "Sliding Window", A, 5],
  [3, "longest-substring-without-repeating-characters", "Longest Substring Without Repeating Characters", "M", "Sliding Window", A, 5],
  [424, "longest-repeating-character-replacement", "Longest Repeating Character Replacement", "M", "Sliding Window", A, 5],
  [567, "permutation-in-string", "Permutation in String", "M", "Sliding Window", A, 5],
  [76, "minimum-window-substring", "Minimum Window Substring", "H", "Sliding Window", A, 5],
  [239, "sliding-window-maximum", "Sliding Window Maximum", "H", "Sliding Window", A, 5],
  // ── Stack ──
  [20, "valid-parentheses", "Valid Parentheses", "E", "Stack", A, 6],
  [155, "min-stack", "Min Stack", "M", "Stack", A, 6],
  [150, "evaluate-reverse-polish-notation", "Evaluate Reverse Polish Notation", "M", "Stack", A, 6],
  [22, "generate-parentheses", "Generate Parentheses", "M", "Stack", A, 6],
  [739, "daily-temperatures", "Daily Temperatures", "M", "Stack", A, 7],
  [853, "car-fleet", "Car Fleet", "M", "Stack", A, 7],
  [84, "largest-rectangle-in-histogram", "Largest Rectangle in Histogram", "H", "Stack", A, 7],
  // ── Binary Search ──
  [704, "binary-search", "Binary Search", "E", "Binary Search", S, 1],
  [74, "search-a-2d-matrix", "Search a 2D Matrix", "M", "Binary Search", S, 1],
  [875, "koko-eating-bananas", "Koko Eating Bananas", "M", "Binary Search", S, 2],
  [153, "find-minimum-in-rotated-sorted-array", "Find Minimum in Rotated Sorted Array", "M", "Binary Search", S, 1],
  [33, "search-in-rotated-sorted-array", "Search in Rotated Sorted Array", "M", "Binary Search", S, 1],
  [981, "time-based-key-value-store", "Time Based Key-Value Store", "M", "Binary Search", S, 2],
  [4, "median-of-two-sorted-arrays", "Median of Two Sorted Arrays", "H", "Binary Search", S, 2],
  // ── Linked List ──
  [206, "reverse-linked-list", "Reverse Linked List", "E", "Linked List", L, 1],
  [21, "merge-two-sorted-lists", "Merge Two Sorted Lists", "E", "Linked List", L, 1],
  [141, "linked-list-cycle", "Linked List Cycle", "E", "Linked List", L, 1],
  [143, "reorder-list", "Reorder List", "M", "Linked List", L, 1],
  [19, "remove-nth-node-from-end-of-list", "Remove Nth Node From End of List", "M", "Linked List", L, 1],
  [138, "copy-list-with-random-pointer", "Copy List with Random Pointer", "M", "Linked List", L, 2],
  [2, "add-two-numbers", "Add Two Numbers", "M", "Linked List", L, 2],
  [287, "find-the-duplicate-number", "Find the Duplicate Number", "M", "Linked List", L, 2],
  [146, "lru-cache", "LRU Cache", "M", "Linked List", L, 2],
  [23, "merge-k-sorted-lists", "Merge k Sorted Lists", "H", "Linked List", L, 2],
  [25, "reverse-nodes-in-k-group", "Reverse Nodes in k-Group", "H", "Linked List", L, 2],
  // ── Trees ──
  [226, "invert-binary-tree", "Invert Binary Tree", "E", "Trees", L, 3],
  [104, "maximum-depth-of-binary-tree", "Maximum Depth of Binary Tree", "E", "Trees", L, 3],
  [543, "diameter-of-binary-tree", "Diameter of Binary Tree", "E", "Trees", L, 3],
  [110, "balanced-binary-tree", "Balanced Binary Tree", "E", "Trees", L, 3],
  [100, "same-tree", "Same Tree", "E", "Trees", L, 3],
  [572, "subtree-of-another-tree", "Subtree of Another Tree", "E", "Trees", L, 3],
  [235, "lowest-common-ancestor-of-a-binary-search-tree", "Lowest Common Ancestor of a Binary Search Tree", "M", "Trees", L, 4],
  [102, "binary-tree-level-order-traversal", "Binary Tree Level Order Traversal", "M", "Trees", L, 5],
  [199, "binary-tree-right-side-view", "Binary Tree Right Side View", "M", "Trees", L, 5],
  [1448, "count-good-nodes-in-binary-tree", "Count Good Nodes in Binary Tree", "M", "Trees", L, 5],
  [98, "validate-binary-search-tree", "Validate Binary Search Tree", "M", "Trees", L, 4],
  [230, "kth-smallest-element-in-a-bst", "Kth Smallest Element in a BST", "M", "Trees", L, 4],
  [105, "construct-binary-tree-from-preorder-and-inorder-traversal", "Construct Binary Tree from Preorder and Inorder Traversal", "M", "Trees", L, 6],
  [124, "binary-tree-maximum-path-sum", "Binary Tree Maximum Path Sum", "H", "Trees", L, 6],
  [297, "serialize-and-deserialize-binary-tree", "Serialize and Deserialize Binary Tree", "H", "Trees", L, 6],
  // ── Tries ──
  [208, "implement-trie-prefix-tree", "Implement Trie (Prefix Tree)", "M", "Tries", L, 7],
  [211, "design-add-and-search-words-data-structure", "Design Add and Search Words Data Structure", "M", "Tries", L, 7],
  [212, "word-search-ii", "Word Search II", "H", "Tries", L, 7],
  // ── Heap / Priority Queue ──
  [703, "kth-largest-element-in-a-stream", "Kth Largest Element in a Stream", "E", "Heap / Priority Queue", S, 3],
  [1046, "last-stone-weight", "Last Stone Weight", "E", "Heap / Priority Queue", S, 3],
  [973, "k-closest-points-to-origin", "K Closest Points to Origin", "M", "Heap / Priority Queue", S, 3],
  [215, "kth-largest-element-in-an-array", "Kth Largest Element in an Array", "M", "Heap / Priority Queue", S, 3],
  [621, "task-scheduler", "Task Scheduler", "M", "Heap / Priority Queue", S, 4],
  [355, "design-twitter", "Design Twitter", "M", "Heap / Priority Queue", S, 4],
  [295, "find-median-from-data-stream", "Find Median from Data Stream", "H", "Heap / Priority Queue", S, 4],
  // ── Backtracking ──
  [78, "subsets", "Subsets", "M", "Backtracking", M, 1],
  [39, "combination-sum", "Combination Sum", "M", "Backtracking", M, 1],
  [46, "permutations", "Permutations", "M", "Backtracking", M, 2],
  [90, "subsets-ii", "Subsets II", "M", "Backtracking", M, 1],
  [40, "combination-sum-ii", "Combination Sum II", "M", "Backtracking", M, 1],
  [79, "word-search", "Word Search", "M", "Backtracking", M, 2],
  [131, "palindrome-partitioning", "Palindrome Partitioning", "M", "Backtracking", M, 2],
  [17, "letter-combinations-of-a-phone-number", "Letter Combinations of a Phone Number", "M", "Backtracking", M, 1],
  [51, "n-queens", "N-Queens", "H", "Backtracking", M, 2],
  // ── Graphs ──
  [200, "number-of-islands", "Number of Islands", "M", "Graphs", G, 1],
  [133, "clone-graph", "Clone Graph", "M", "Graphs", G, 2],
  [695, "max-area-of-island", "Max Area of Island", "M", "Graphs", G, 1],
  [417, "pacific-atlantic-water-flow", "Pacific Atlantic Water Flow", "M", "Graphs", G, 2],
  [130, "surrounded-regions", "Surrounded Regions", "M", "Graphs", G, 2],
  [994, "rotting-oranges", "Rotting Oranges", "M", "Graphs", G, 1],
  [286, "walls-and-gates", "Walls and Gates", "M", "Graphs", G, 1],
  [207, "course-schedule", "Course Schedule", "M", "Graphs", G, 3],
  [210, "course-schedule-ii", "Course Schedule II", "M", "Graphs", G, 3],
  [684, "redundant-connection", "Redundant Connection", "M", "Graphs", G, 4],
  [323, "number-of-connected-components-in-an-undirected-graph", "Number of Connected Components in an Undirected Graph", "M", "Graphs", G, 4],
  [261, "graph-valid-tree", "Graph Valid Tree", "M", "Graphs", G, 4],
  [127, "word-ladder", "Word Ladder", "H", "Graphs", G, 2],
  // ── Advanced Graphs ──
  [332, "reconstruct-itinerary", "Reconstruct Itinerary", "H", "Advanced Graphs", G, 6],
  [1584, "min-cost-to-connect-all-points", "Min Cost to Connect All Points", "M", "Advanced Graphs", G, 6],
  [743, "network-delay-time", "Network Delay Time", "M", "Advanced Graphs", G, 5],
  [778, "swim-in-rising-water", "Swim in Rising Water", "H", "Advanced Graphs", G, 5],
  [269, "alien-dictionary", "Alien Dictionary", "H", "Advanced Graphs", G, 3],
  [787, "cheapest-flights-within-k-stops", "Cheapest Flights Within K Stops", "M", "Advanced Graphs", G, 5],
  // ── 1-D Dynamic Programming ──
  [70, "climbing-stairs", "Climbing Stairs", "E", "1-D Dynamic Programming", D, 1],
  [746, "min-cost-climbing-stairs", "Min Cost Climbing Stairs", "E", "1-D Dynamic Programming", D, 1],
  [198, "house-robber", "House Robber", "M", "1-D Dynamic Programming", D, 1],
  [213, "house-robber-ii", "House Robber II", "M", "1-D Dynamic Programming", D, 1],
  [5, "longest-palindromic-substring", "Longest Palindromic Substring", "M", "1-D Dynamic Programming", D, 2],
  [647, "palindromic-substrings", "Palindromic Substrings", "M", "1-D Dynamic Programming", D, 2],
  [91, "decode-ways", "Decode Ways", "M", "1-D Dynamic Programming", D, 1],
  [322, "coin-change", "Coin Change", "M", "1-D Dynamic Programming", D, 3],
  [152, "maximum-product-subarray", "Maximum Product Subarray", "M", "1-D Dynamic Programming", D, 1],
  [139, "word-break", "Word Break", "M", "1-D Dynamic Programming", D, 4],
  [300, "longest-increasing-subsequence", "Longest Increasing Subsequence", "M", "1-D Dynamic Programming", D, 4],
  [416, "partition-equal-subset-sum", "Partition Equal Subset Sum", "M", "1-D Dynamic Programming", D, 3],
  // ── 2-D Dynamic Programming ──
  [62, "unique-paths", "Unique Paths", "M", "2-D Dynamic Programming", D, 5],
  [1143, "longest-common-subsequence", "Longest Common Subsequence", "M", "2-D Dynamic Programming", D, 5],
  [309, "best-time-to-buy-and-sell-stock-with-cooldown", "Best Time to Buy and Sell Stock with Cooldown", "M", "2-D Dynamic Programming", D, 6],
  [518, "coin-change-ii", "Coin Change II", "M", "2-D Dynamic Programming", D, 3],
  [494, "target-sum", "Target Sum", "M", "2-D Dynamic Programming", D, 3],
  [97, "interleaving-string", "Interleaving String", "M", "2-D Dynamic Programming", D, 5],
  [329, "longest-increasing-path-in-a-matrix", "Longest Increasing Path in a Matrix", "H", "2-D Dynamic Programming", D, 6],
  [115, "distinct-subsequences", "Distinct Subsequences", "H", "2-D Dynamic Programming", D, 5],
  [72, "edit-distance", "Edit Distance", "M", "2-D Dynamic Programming", D, 5],
  [312, "burst-balloons", "Burst Balloons", "H", "2-D Dynamic Programming", D, 7],
  [10, "regular-expression-matching", "Regular Expression Matching", "H", "2-D Dynamic Programming", D, 7],
  // ── Greedy ──
  [53, "maximum-subarray", "Maximum Subarray", "M", "Greedy", M, 3],
  [55, "jump-game", "Jump Game", "M", "Greedy", M, 3],
  [45, "jump-game-ii", "Jump Game II", "M", "Greedy", M, 3],
  [134, "gas-station", "Gas Station", "M", "Greedy", M, 3],
  [846, "hand-of-straights", "Hand of Straights", "M", "Greedy", M, 4],
  [1899, "merge-triplets-to-form-target-triplet", "Merge Triplets to Form Target Triplet", "M", "Greedy", M, 4],
  [763, "partition-labels", "Partition Labels", "M", "Greedy", M, 4],
  [678, "valid-parenthesis-string", "Valid Parenthesis String", "M", "Greedy", M, 4],
  // ── Intervals ──
  [57, "insert-interval", "Insert Interval", "M", "Intervals", M, 5],
  [56, "merge-intervals", "Merge Intervals", "M", "Intervals", M, 5],
  [435, "non-overlapping-intervals", "Non-overlapping Intervals", "M", "Intervals", M, 5],
  [252, "meeting-rooms", "Meeting Rooms", "E", "Intervals", M, 5],
  [253, "meeting-rooms-ii", "Meeting Rooms II", "M", "Intervals", M, 5],
  [1851, "minimum-interval-to-include-each-query", "Minimum Interval to Include Each Query", "H", "Intervals", M, 5],
  // ── Math & Geometry ──
  [48, "rotate-image", "Rotate Image", "M", "Math & Geometry", M, 6],
  [54, "spiral-matrix", "Spiral Matrix", "M", "Math & Geometry", M, 6],
  [73, "set-matrix-zeroes", "Set Matrix Zeroes", "M", "Math & Geometry", M, 6],
  [202, "happy-number", "Happy Number", "E", "Math & Geometry", M, 7],
  [66, "plus-one", "Plus One", "E", "Math & Geometry", M, 7],
  [50, "powx-n", "Pow(x, n)", "M", "Math & Geometry", M, 7],
  [43, "multiply-strings", "Multiply Strings", "M", "Math & Geometry", M, 7],
  [2013, "detect-squares", "Detect Squares", "M", "Math & Geometry", M, 6],
  // ── Bit Manipulation ──
  [136, "single-number", "Single Number", "E", "Bit Manipulation", M, 8],
  [191, "number-of-1-bits", "Number of 1 Bits", "E", "Bit Manipulation", M, 8],
  [338, "counting-bits", "Counting Bits", "E", "Bit Manipulation", M, 8],
  [190, "reverse-bits", "Reverse Bits", "E", "Bit Manipulation", M, 8],
  [268, "missing-number", "Missing Number", "E", "Bit Manipulation", M, 8],
  [371, "sum-of-two-integers", "Sum of Two Integers", "M", "Bit Manipulation", M, 8],
  [7, "reverse-integer", "Reverse Integer", "M", "Bit Manipulation", M, 7],
]

const DIFF = { E: "easy", M: "medium", H: "hard" }

/** 150 bài theo thứ tự NeetCode: { lc, slug, title, difficulty, group, line, station, order, url }. */
export const CATALOG = ROWS.map(([lc, slug, title, d, group, line, station], i) => ({
  lc,
  slug,
  title,
  difficulty: DIFF[d],
  group,
  line,
  station,
  order: i + 1,
  url: `https://leetcode.com/problems/${slug}/`,
}))

const byLc = new Map(CATALOG.map((p) => [p.lc, p]))
export const catalogEntry = (lc) => byLc.get(Number(lc))
export const lcCode = (lc) => `LC-${String(lc).padStart(4, "0")}`
