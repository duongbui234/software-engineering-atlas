const INF: i32 = i32::MAX;
const DIRECTIONS: [(i32, i32); 4] = [(-1, 0), (1, 0), (0, -1), (0, 1)];

fn from_room(rooms: &[Vec<i32>], start: usize) -> (i32, usize) {
    let (rows, cols) = (rooms.len(), rooms[0].len());
    let mut queue = vec![start];
    let mut distance = vec![-1; rows * cols];
    distance[start] = 0;

    let mut head = 0;
    while head < queue.len() {
        let cell = queue[head];
        head += 1;
        let (r, c) = (cell / cols, cell % cols);
        if rooms[r][c] == 0 {
            return (distance[cell], head);
        }
        for (dr, dc) in DIRECTIONS {
            let (nr, nc) = (r as i32 + dr, c as i32 + dc);
            if nr < 0 || nr >= rows as i32 || nc < 0 || nc >= cols as i32 {
                continue;
            }
            let (nr, nc) = (nr as usize, nc as usize);
            let next = nr * cols + nc;
            if rooms[nr][nc] == -1 || distance[next] != -1 {
                continue;
            }
            distance[next] = distance[cell] + 1;
            queue.push(next);
        }
    }
    (INF, queue.len())
}

fn per_room(rooms: &mut [Vec<i32>]) -> usize {
    let mut popped = 0;
    let cols = rooms[0].len();
    for r in 0..rooms.len() {
        for c in 0..cols {
            if rooms[r][c] != INF {
                continue;
            }
            let (distance, visits) = from_room(rooms, r * cols + c);
            rooms[r][c] = distance;
            popped += visits;
        }
    }
    popped
}

fn from_all_gates(rooms: &mut [Vec<i32>]) -> usize {
    let (rows, cols) = (rooms.len(), rooms[0].len());
    let mut queue = Vec::new();
    for r in 0..rows {
        for c in 0..cols {
            if rooms[r][c] == 0 {
                queue.push(r * cols + c);
            }
        }
    }

    let mut head = 0;
    while head < queue.len() {
        let cell = queue[head];
        head += 1;
        let (r, c) = (cell / cols, cell % cols);
        for (dr, dc) in DIRECTIONS {
            let (nr, nc) = (r as i32 + dr, c as i32 + dc);
            if nr < 0 || nr >= rows as i32 || nc < 0 || nc >= cols as i32 {
                continue;
            }
            let (nr, nc) = (nr as usize, nc as usize);
            if rooms[nr][nc] != INF {
                continue;
            }
            rooms[nr][nc] = rooms[r][c] + 1;
            queue.push(nr * cols + nc);
        }
    }
    queue.len()
}

fn check(before: &[Vec<i32>], expected: &[Vec<i32>]) {
    let fills: [(&str, fn(&mut [Vec<i32>]) -> usize); 2] = [("per_room", per_room), ("from_all_gates", from_all_gates)];
    for (name, fill) in fills {
        let mut work = before.to_vec();
        fill(&mut work);
        if work != expected {
            panic!("{}", name);
        }
    }
}

fn main() {
    let cases: Vec<(Vec<Vec<i32>>, Vec<Vec<i32>>)> = vec![
        (
            vec![vec![0, -1, INF, INF, 0], vec![INF, INF, INF, -1, INF], vec![INF, -1, INF, -1, -1], vec![INF, INF, INF, -1, INF]],
            vec![vec![0, -1, 2, 1, 0], vec![1, 2, 3, -1, 1], vec![2, -1, 4, -1, -1], vec![3, 4, 5, -1, INF]],
        ),
        (vec![vec![INF, 0, INF, INF, 0, INF]], vec![vec![1, 0, 1, 1, 0, 1]]),
        (vec![vec![0, -1, INF]], vec![vec![0, -1, INF]]),
        (vec![vec![INF, INF], vec![INF, -1]], vec![vec![INF, INF], vec![INF, -1]]),
        (vec![vec![0]], vec![vec![0]]),
        (vec![vec![-1], vec![INF], vec![0], vec![INF]], vec![vec![-1], vec![1], vec![0], vec![1]]),
        (vec![vec![0, -1, INF], vec![INF, INF, INF]], vec![vec![0, -1, 4], vec![1, 2, 3]]),
    ];
    for (before, expected) in &cases {
        check(before, expected);
    }
    println!("{}/{} ca đúng", cases.len(), cases.len());

    let mut room_by_room = vec![vec![INF; 24]; 24];
    room_by_room[0][0] = 0;
    let mut in_one_pass = room_by_room.clone();
    let repeated_pops = per_room(&mut room_by_room);
    let shared_pops = from_all_gates(&mut in_one_pass);
    if room_by_room != in_one_pass {
        panic!("24 × 24");
    }
    println!("Số lượt lấy ô khỏi hàng đợi: {} / {}", repeated_pops, shared_pops);
}
