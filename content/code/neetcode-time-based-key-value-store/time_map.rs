// LeetCode 981: Time Based Key-Value Store. Chạy: rustc --edition 2021 -O time_map.rs && ./time_map
// get(key, t) trả giá trị của lần set có timestamp lớn nhất ≤ t, không có thì "".
use std::collections::HashMap;

trait TimeMapLike {
    fn set(&mut self, key: String, value: String, timestamp: i32);
    fn get(&self, key: &str, timestamp: i32) -> Option<String>; // None dành cho bản sai trả null
}

// Lịch sử của mỗi key: các cặp (timestamp, value), tăng dần theo timestamp vì đề hứa set theo thứ tự tăng.
type Store = HashMap<String, Vec<(i32, String)>>;

fn push(store: &mut Store, key: String, value: String, timestamp: i32) {
    store.entry(key).or_default().push((timestamp, value)); // entry: một lần tra băm cho cả "tạo nếu chưa có"
}

// Cách 1, quét lùi. O(k) mỗi lần get.
#[derive(Default)]
struct LinearTimeMap {
    store: Store,
}

impl TimeMapLike for LinearTimeMap {
    fn set(&mut self, key: String, value: String, timestamp: i32) {
        push(&mut self.store, key, value, timestamp);
    }
    fn get(&self, key: &str, timestamp: i32) -> Option<String> {
        let h = self.store.get(key).map(|v| v.as_slice()).unwrap_or(&[]);
        let hit = h.iter().rev().find(|(t, _)| *t <= timestamp);
        Some(hit.map(|(_, v)| v.clone()).unwrap_or_default())
    }
}

// Cách 2, chia đôi: partition_point đếm số mốc ≤ t, mốc cần tìm là ô ngay trước. O(log k) mỗi lần get.
#[derive(Default)]
struct TimeMap {
    store: HashMap<String, Vec<(i32, String)>>,
}

impl TimeMap {
    fn set(&mut self, key: String, value: String, timestamp: i32) {
        // entry: một lần tra băm cho cả "tạo nếu chưa có" lẫn "thêm vào"
        self.store.entry(key).or_default().push((timestamp, value));
    }

    fn get(&self, key: &str, timestamp: i32) -> String {
        let Some(h) = self.store.get(key) else { return String::new() }; // key chưa từng set
        let n = h.partition_point(|(t, _)| *t <= timestamp); // số mốc ≤ timestamp
        if n == 0 { String::new() } else { h[n - 1].1.clone() } // n − 1 là mốc cuối cùng ≤ timestamp
    }
}

impl TimeMapLike for TimeMap {
    fn set(&mut self, key: String, value: String, timestamp: i32) {
        TimeMap::set(self, key, value, timestamp);
    }
    fn get(&self, key: &str, timestamp: i32) -> Option<String> {
        Some(TimeMap::get(self, key, timestamp))
    }
}

// SAI: dùng cận dưới (mốc đầu tiên ≥ t): khi t nằm giữa hai mốc thì trả giá trị "từ tương lai".
#[derive(Default)]
struct LowerBoundTimeMap {
    store: Store,
}

impl TimeMapLike for LowerBoundTimeMap {
    fn set(&mut self, key: String, value: String, timestamp: i32) {
        push(&mut self.store, key, value, timestamp);
    }
    fn get(&self, key: &str, timestamp: i32) -> Option<String> {
        let h = self.store.get(key).map(|v| v.as_slice()).unwrap_or(&[]);
        let i = h.partition_point(|(t, _)| *t < timestamp);
        Some(h.get(i).map(|(_, v)| v.clone()).unwrap_or_default())
    }
}

// SAI: trả None (null) khi không có thay vì chuỗi rỗng "".
#[derive(Default)]
struct NullTimeMap {
    inner: TimeMap,
}

impl TimeMapLike for NullTimeMap {
    fn set(&mut self, key: String, value: String, timestamp: i32) {
        self.inner.set(key, value, timestamp);
    }
    fn get(&self, key: &str, timestamp: i32) -> Option<String> {
        Some(self.inner.get(key, timestamp)).filter(|v| !v.is_empty())
    }
}

enum Op {
    Set(&'static str, &'static str, i32),
    Get(&'static str, i32, &'static str),
}

fn main() {
    use Op::{Get, Set};
    let cases: Vec<(&str, Vec<Op>)> = vec![
        ("ví dụ của đề", vec![Set("foo", "bar", 1), Get("foo", 1, "bar"), Get("foo", 3, "bar"), Set("foo", "bar2", 4), Get("foo", 4, "bar2"), Get("foo", 5, "bar2")]),
        ("key chưa từng set", vec![Get("x", 10, "")]),
        ("t nhỏ hơn mốc đầu", vec![Set("a", "v", 5), Get("a", 4, ""), Get("a", 5, "v")]),
        ("t nằm giữa hai mốc", vec![Set("a", "v1", 10), Set("a", "v2", 20), Get("a", 15, "v1")]),
        ("t lớn hơn mốc cuối", vec![Set("a", "v1", 10), Set("a", "v2", 20), Get("a", 99, "v2")]),
        ("hai key xen kẽ", vec![Set("a", "a1", 1), Set("b", "b1", 2), Set("a", "a2", 3), Get("b", 3, "b1"), Get("a", 2, "a1"), Get("b", 1, "")]),
        ("trùng mốc ở giữa", vec![Set("k", "1", 1), Set("k", "2", 2), Set("k", "3", 3), Get("k", 2, "2")]),
        ("timestamp 10⁷", vec![Set("k", "lo", 1), Set("k", "hi", 10_000_000), Get("k", 9_999_999, "lo"), Get("k", 10_000_000, "hi")]),
    ];
    let impls: [(&str, fn() -> Box<dyn TimeMapLike>); 4] = [
        ("LinearTimeMap", || Box::new(LinearTimeMap::default())),
        ("TimeMap", || Box::new(TimeMap::default())),
        ("LowerBoundTimeMap", || Box::new(LowerBoundTimeMap::default())),
        ("NullTimeMap", || Box::new(NullTimeMap::default())),
    ];
    for (name, make) in impls {
        let mut bad = vec![];
        for (label, ops) in &cases {
            let mut m = make();
            let (mut got, mut ok) = (vec![], true);
            for op in ops {
                match op {
                    Set(k, v, t) => m.set(k.to_string(), v.to_string(), *t),
                    Get(k, t, want) => {
                        let r = m.get(k, *t);
                        got.push(match &r { Some(s) => format!("{:?}", s), None => "null".to_string() });
                        if r.as_deref() != Some(*want) {
                            ok = false;
                        }
                    }
                }
            }
            if !ok {
                bad.push(format!("{} → [{}]", label, got.join(", ")));
            }
        }
        let extra = if bad.is_empty() { String::new() } else { format!("; sai ở: {}", bad.join("; ")) };
        println!("{:<18} {}/{} ca đúng{}", name, cases.len() - bad.len(), cases.len(), extra);
    }
}
