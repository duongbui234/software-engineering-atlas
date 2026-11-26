use std::collections::HashMap;

struct Entry {
    key: i32,
    value: i32,
    previous: usize,
    next: usize,
}

struct LruCache {
    slots: Vec<Entry>,
    entries: HashMap<i32, usize>,
    capacity: usize,
}

impl LruCache {
    const HEAD: usize = 0;
    const TAIL: usize = 1;

    fn new(capacity: usize) -> Self {
        let head = Entry {
            key: 0,
            value: 0,
            previous: Self::HEAD,
            next: Self::TAIL,
        };
        let tail = Entry {
            key: 0,
            value: 0,
            previous: Self::HEAD,
            next: Self::TAIL,
        };
        Self {
            slots: vec![head, tail],
            entries: HashMap::new(),
            capacity,
        }
    }

    fn get(&mut self, key: i32) -> i32 {
        let Some(&index) = self.entries.get(&key) else {
            return -1;
        };
        self.detach(index);
        self.add_first(index);
        self.slots[index].value
    }

    fn put(&mut self, key: i32, value: i32) {
        let index = if let Some(&index) = self.entries.get(&key) {
            self.detach(index);
            self.slots[index].value = value;
            index
        } else {
            let entry = Entry {
                key,
                value,
                previous: Self::HEAD,
                next: Self::TAIL,
            };
            let index = if self.entries.len() == self.capacity {
                let oldest = self.slots[Self::TAIL].previous;
                self.detach(oldest);
                self.entries.remove(&self.slots[oldest].key);
                self.slots[oldest] = entry;
                oldest
            } else {
                let free = self.slots.len();
                self.slots.push(entry);
                free
            };
            self.entries.insert(key, index);
            index
        };
        self.add_first(index);
    }

    fn detach(&mut self, index: usize) {
        let Entry { previous, next, .. } = self.slots[index];
        self.slots[previous].next = next;
        self.slots[next].previous = previous;
    }

    fn add_first(&mut self, index: usize) {
        let first = self.slots[Self::HEAD].next;
        self.slots[index].previous = Self::HEAD;
        self.slots[index].next = first;
        self.slots[first].previous = index;
        self.slots[Self::HEAD].next = index;
    }
}

fn main() {
    let mut cache = LruCache::new(2);
    assert_eq!(cache.get(1), -1);
    cache.put(1, 10);
    cache.put(2, 20);
    assert_eq!(cache.get(1), 10);
    cache.put(3, 30);
    assert_eq!(cache.get(2), -1);
    cache.put(1, 11);
    cache.put(4, 40);
    assert_eq!((cache.get(3), cache.get(1)), (-1, 11));
    cache.put(2, 0);
    assert_eq!((cache.get(4), cache.get(2)), (-1, 0));

    let mut single = LruCache::new(1);
    single.put(1, 10);
    single.put(1, 20);
    assert_eq!(single.get(1), 20);
    single.put(2, 30);
    assert_eq!((single.get(1), single.get(2)), (-1, 30));
    assert_eq!(cache.slots.len(), 4);
    assert_eq!(single.slots.len(), 3);
    println!("9/9 ca đúng");
}
