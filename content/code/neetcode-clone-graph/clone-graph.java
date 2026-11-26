// LC 133 Clone Graph: ba cách đúng (DFS đệ quy, BFS, DFS lặp) và bốn cách sai hay gặp.
// Chạy: java clone-graph.java
import java.util.*;
import java.util.function.*;

public class Main {
  static class Node {
    int val;
    List<Node> neighbors;

    Node(int val) {
      this.val = val;
      this.neighbors = new ArrayList<>();
    }

    Node(int val, List<Node> neighbors) {
      this.val = val;
      this.neighbors = neighbors;
    }
    // Không ghi đè equals/hashCode: HashMap so khóa theo danh tính đối tượng, đúng điều mình cần.
  }

  // ---------- Cách 1: DFS đệ quy với sổ "cũ → mới" ----------
  static Node cloneDfs(Node node) {
    if (node == null) return null;
    return visit(node, new HashMap<>());
  }

  static Node visit(Node old, Map<Node, Node> copies) {
    Node seen = copies.get(old);
    if (seen != null) return seen; // đã sao rồi: dùng lại
    Node copy = new Node(old.val);
    copies.put(old, copy); // ghi sổ TRƯỚC khi đi tiếp
    for (Node nb : old.neighbors) copy.neighbors.add(visit(nb, copies));
    return copy;
  }

  // ---------- Cách 2: BFS với sổ "cũ → mới" ----------
  static Node cloneBfs(Node node) {
    if (node == null) return null;
    Map<Node, Node> copies = new HashMap<>();
    copies.put(node, new Node(node.val));
    ArrayDeque<Node> queue = new ArrayDeque<>();
    queue.offer(node);
    while (!queue.isEmpty()) {
      Node old = queue.poll();
      for (Node nb : old.neighbors) {
        Node c = copies.get(nb);
        if (c == null) {
          c = new Node(nb.val); // tạo bản sao lúc thấy lần đầu, rồi mới xếp hàng
          copies.put(nb, c);
          queue.offer(nb);
        }
        copies.get(old).neighbors.add(c);
      }
    }
    return copies.get(node);
  }

  // ---------- Cách 3: DFS lặp với ngăn xếp ----------
  static Node cloneDfsIterative(Node node) {
    if (node == null) return null;
    Map<Node, Node> copies = new HashMap<>();
    copies.put(node, new Node(node.val));
    ArrayDeque<Node> stack = new ArrayDeque<>();
    stack.push(node);
    while (!stack.isEmpty()) {
      Node old = stack.pop();
      for (Node nb : old.neighbors) {
        Node c = copies.get(nb);
        if (c == null) {
          c = new Node(nb.val);
          copies.put(nb, c);
          stack.push(nb);
        }
        copies.get(old).neighbors.add(c);
      }
    }
    return copies.get(node);
  }

  // ---------- Sai 1: sao nông ----------
  static Node wrongShallow(Node node) {
    if (node == null) return null;
    return new Node(node.val, node.neighbors); // hàng xóm vẫn là nút CŨ
  }

  // ---------- Sai 2: đệ quy không có sổ ----------
  static Node wrongNoMap(Node node) {
    if (node == null) return null;
    Node copy = new Node(node.val);
    for (Node nb : node.neighbors) copy.neighbors.add(wrongNoMap(nb));
    return copy;
  }

  // ---------- Sai 3: ghi sổ SAU khi đi hết hàng xóm ----------
  static Node wrongMapAfterRecurse(Node node) {
    if (node == null) return null;
    return visitLate(node, new HashMap<>());
  }

  static Node visitLate(Node old, Map<Node, Node> copies) {
    Node seen = copies.get(old);
    if (seen != null) return seen;
    Node copy = new Node(old.val);
    for (Node nb : old.neighbors) copy.neighbors.add(visitLate(nb, copies));
    copies.put(old, copy); // quá muộn
    return copy;
  }

  // ---------- Sai 4: chỉ nhớ "đã thăm", không nhớ bản sao ----------
  static Node wrongSetOnly(Node node) {
    if (node == null) return null;
    return visitSet(node, new HashSet<>());
  }

  static Node visitSet(Node old, Set<Node> visited) {
    visited.add(old);
    Node copy = new Node(old.val);
    for (Node nb : old.neighbors) {
      copy.neighbors.add(visited.contains(nb) ? new Node(nb.val) : visitSet(nb, visited));
    }
    return copy;
  }

  // ---------- Dựng đồ thị và kiểm tra ----------
  static Node build(int[][] adj) {
    if (adj.length == 0) return null;
    Node[] nodes = new Node[adj.length];
    for (int i = 0; i < adj.length; i++) nodes[i] = new Node(i + 1);
    for (int i = 0; i < adj.length; i++) for (int v : adj[i]) nodes[i].neighbors.add(nodes[v - 1]);
    return nodes[0];
  }

  static List<Node> collect(Node start) {
    List<Node> order = new ArrayList<>();
    if (start == null) return order;
    Set<Node> seen = Collections.newSetFromMap(new IdentityHashMap<>());
    seen.add(start);
    order.add(start);
    for (int h = 0; h < order.size(); h++) {
      for (Node nb : order.get(h).neighbors) {
        if (seen.add(nb)) order.add(nb);
      }
    }
    return order;
  }

  static String vals(List<Node> ns) {
    StringJoiner j = new StringJoiner(",");
    for (Node n : ns) j.add(String.valueOf(n.val));
    return j.toString();
  }

  static String row(int[] r) {
    StringJoiner j = new StringJoiner(",");
    for (int v : r) j.add(String.valueOf(v));
    return j.toString();
  }

  static String check(int[][] adj, Node original, Node copy) {
    if (adj.length == 0) return copy == null ? null : "đồ thị rỗng nhưng không trả null";
    if (copy == null) return "trả null";
    Set<Node> old = Collections.newSetFromMap(new IdentityHashMap<>());
    old.addAll(collect(original));
    List<Node> nodes = collect(copy);
    Map<Integer, Node> byVal = new HashMap<>();
    for (Node n : nodes) {
      if (old.contains(n)) return "dùng chung nút với bản gốc";
      if (byVal.containsKey(n.val)) {
        long cnt = nodes.stream().filter(x -> x.val == n.val).count();
        return "nút " + n.val + " bị sao " + cnt + " lần";
      }
      byVal.put(n.val, n);
    }
    if (nodes.size() != adj.length) return "có " + nodes.size() + " nút, cần " + adj.length;
    for (int i = 0; i < adj.length; i++) {
      String got = vals(byVal.get(i + 1).neighbors);
      if (!got.equals(row(adj[i]))) return "hàng xóm của " + (i + 1) + " là [" + got + "], cần [" + row(adj[i]) + "]";
    }
    Map<Integer, Node> orig = new HashMap<>();
    for (Node n : collect(original)) orig.put(n.val, n);
    for (int i = 0; i < adj.length; i++) {
      if (!vals(orig.get(i + 1).neighbors).equals(row(adj[i]))) return "làm hỏng đồ thị gốc";
    }
    return null;
  }

  static DoubleSupplier mulberry32(int seed) {
    int[] a = {seed};
    return () -> {
      a[0] += 0x6d2b79f5;
      int t = a[0];
      t = (t ^ (t >>> 15)) * (t | 1);
      t ^= t + (t ^ (t >>> 7)) * (t | 61);
      return Integer.toUnsignedLong(t ^ (t >>> 14)) / 4294967296.0;
    };
  }

  static int[][] randomGraph(int n, int extra, DoubleSupplier rnd) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    Set<Long> has = new HashSet<>();
    BiConsumer<Integer, Integer> add = (a, b) -> {
      if (a.equals(b) || has.contains((long) a * 1000 + b)) return;
      has.add((long) a * 1000 + b);
      has.add((long) b * 1000 + a);
      adj.get(a).add(b + 1);
      adj.get(b).add(a + 1);
    };
    for (int i = 1; i < n; i++) add.accept(i, (int) (rnd.getAsDouble() * i));
    for (int k = 0; k < extra; k++) {
      int a = (int) (rnd.getAsDouble() * n);
      int b = (int) (rnd.getAsDouble() * n);
      add.accept(a, b);
    }
    int[][] out = new int[n][];
    for (int i = 0; i < n; i++) out[i] = adj.get(i).stream().mapToInt(Integer::intValue).toArray();
    return out;
  }

  static int[][] chain(int n) {
    int[][] adj = new int[n][];
    for (int i = 0; i < n; i++) {
      List<Integer> r = new ArrayList<>();
      if (i > 0) r.add(i);
      if (i < n - 1) r.add(i + 2);
      adj[i] = r.stream().mapToInt(Integer::intValue).toArray();
    }
    return adj;
  }

  static int[][] complete(int n) {
    int[][] adj = new int[n][n - 1];
    for (int i = 0; i < n; i++) {
      int k = 0;
      for (int j = 0; j < n; j++) if (j != i) adj[i][k++] = j + 1;
    }
    return adj;
  }

  // Bẫy riêng của Java: record tự sinh hashCode từ mọi trường, kể cả danh sách hàng xóm.
  record RNode(int val, List<RNode> neighbors) {}

  public static void main(String[] args) {
    Object[][] cases = {
      {"đồ thị rỗng", new int[][] {}},
      {"một nút, không cạnh", new int[][] {{}}},
      {"hai nút nối nhau", new int[][] {{2}, {1}}},
      {"tam giác 1-2-3", new int[][] {{2, 3}, {1, 3}, {1, 2}}},
      {"vuông 1-2-3-4 có đường chéo 1-3", new int[][] {{2, 3, 4}, {1, 3}, {1, 2, 4}, {1, 3}}},
      {"ngôi sao: 1 nối 2..6", new int[][] {{2, 3, 4, 5, 6}, {1}, {1}, {1}, {1}, {1}}},
      {"đường thẳng 5 nút", chain(5)},
      {"đồ thị đầy đủ 6 nút", complete(6)},
      {"đường thẳng 100 nút", chain(100)},
      {"ngẫu nhiên 100 nút, seed 42", randomGraph(100, 200, mulberry32(42))},
    };
    String[] names = {
      "cloneDfs", "cloneBfs", "cloneDfsIterative", "wrongShallow", "wrongNoMap", "wrongMapAfterRecurse", "wrongSetOnly"
    };
    List<UnaryOperator<Node>> fns = List.of(
        Main::cloneDfs, Main::cloneBfs, Main::cloneDfsIterative, Main::wrongShallow,
        Main::wrongNoMap, Main::wrongMapAfterRecurse, Main::wrongSetOnly);
    boolean allOk = true;
    for (int f = 0; f < fns.size(); f++) {
      int ok = 0;
      List<String> fails = new ArrayList<>();
      for (Object[] c : cases) {
        int[][] adj = (int[][]) c[1];
        Node g = build(adj);
        String err;
        try {
          err = check(adj, g, fns.get(f).apply(g));
        } catch (StackOverflowError e) {
          err = "ném StackOverflowError";
        }
        if (err == null) ok++;
        else fails.add(c[0] + " → " + err);
      }
      if (!names[f].startsWith("wrong") && ok != cases.length) allOk = false;
      String line = String.format("%-21s%d/%d ca đúng", names[f], ok, cases.length);
      if (!fails.isEmpty()) {
        String shown = String.join(", ", fails.subList(0, Math.min(2, fails.size())));
        if (fails.size() > 2) shown += " và " + (fails.size() - 2) + " ca khác";
        line += "; sai ở " + shown;
      }
      System.out.println(line);
    }

    DoubleSupplier rnd = mulberry32(7);
    int agree = 0;
    for (int t = 0; t < 500; t++) {
      int n = 1 + (int) (rnd.getAsDouble() * 100);
      int[][] adj = randomGraph(n, (int) (rnd.getAsDouble() * 3 * n), rnd);
      Node g = build(adj);
      if (check(adj, g, cloneDfs(g)) == null && check(adj, g, cloneBfs(g)) == null
          && check(adj, g, cloneDfsIterative(g)) == null) agree++;
    }
    System.out.println("500 đồ thị ngẫu nhiên: cả ba cách đúng qua " + agree + "/500");

    RNode a = new RNode(1, new ArrayList<>());
    RNode b = new RNode(2, new ArrayList<>());
    a.neighbors().add(b);
    b.neighbors().add(a);
    try {
      new HashMap<RNode, RNode>().put(a, a);
      System.out.println("record làm khóa HashMap trên đồ thị có vòng: chạy được");
    } catch (StackOverflowError e) {
      System.out.println("record làm khóa HashMap trên đồ thị có vòng: StackOverflowError khi tính hashCode");
    }

    int[][] adj = chain(100_000);
    Node g = build(adj);
    for (int f = 0; f < 3; f++) {
      String msg;
      try {
        long t0 = System.nanoTime();
        Node c = fns.get(f).apply(g);
        double ms = (System.nanoTime() - t0) / 1e6;
        msg = (check(adj, g, c) == null ? "đúng" : "sai") + String.format(", %.1f ms", ms);
      } catch (StackOverflowError e) {
        msg = "ném StackOverflowError";
      }
      System.out.println("đường thẳng 100 000 nút, " + names[f] + ": " + msg);
    }
    System.out.println(allOk ? "clone-graph: các cách đúng đều qua" : "clone-graph: CÓ CÁCH ĐÚNG BỊ SAI");
  }
}
