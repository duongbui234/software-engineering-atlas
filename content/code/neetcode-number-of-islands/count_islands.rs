const DIRECTIONS: [(i32, i32); 4] = [(-1, 0), (1, 0), (0, -1), (0, 1)];

fn flood_bfs(grid: &[Vec<u8>]) -> usize {
    let (rows, cols) = (grid.len(), grid[0].len());
    let mut seen = vec![false; rows * cols];
    let mut result = 0;

    for start in 0..rows * cols {
        if grid[start / cols][start % cols] != 1 || seen[start] {
            continue;
        }

        result += 1;
        let mut queue = vec![start];
        seen[start] = true;
        let mut head = 0;
        while head < queue.len() {
            let cell = queue[head];
            head += 1;
            let (row, col) = ((cell / cols) as i32, (cell % cols) as i32);
            for (dr, dc) in DIRECTIONS {
                let (r, c) = (row + dr, col + dc);
                if r < 0 || r >= rows as i32 || c < 0 || c >= cols as i32 {
                    continue;
                }
                let (r, c) = (r as usize, c as usize);
                let next = r * cols + c;
                if grid[r][c] != 1 || seen[next] {
                    continue;
                }
                seen[next] = true;
                queue.push(next);
            }
        }
    }
    result
}

fn flood_dfs_in_place(grid: &mut [Vec<u8>]) -> usize {
    let (rows, cols) = (grid.len(), grid[0].len());
    let mut result = 0;

    for start in 0..rows * cols {
        let (row, col) = (start / cols, start % cols);
        if grid[row][col] != 1 {
            continue;
        }

        result += 1;
        let mut stack = vec![start];
        grid[row][col] = 0;
        while let Some(cell) = stack.pop() {
            let (cr, cc) = ((cell / cols) as i32, (cell % cols) as i32);
            for (dr, dc) in DIRECTIONS {
                let (r, c) = (cr + dr, cc + dc);
                if r < 0 || r >= rows as i32 || c < 0 || c >= cols as i32 {
                    continue;
                }
                let (r, c) = (r as usize, c as usize);
                if grid[r][c] != 1 {
                    continue;
                }
                grid[r][c] = 0;
                stack.push(r * cols + c);
            }
        }
    }
    result
}

fn main() {
    let big = vec!["1".repeat(300); 300];
    let mut cases: Vec<(Vec<String>, usize)> = vec![
        (vec!["10011", "00011", "01010", "11000"].into_iter().map(String::from).collect(), 3),
        (vec!["100", "010", "001"].into_iter().map(String::from).collect(), 3),
        (vec!["000", "000"].into_iter().map(String::from).collect(), 0),
        (vec!["11111".to_string()], 1),
        (vec!["11".to_string(), "11".to_string()], 1),
    ];
    cases.push((big, 1));

    for (rows, want) in &cases {
        let mut cells: Vec<Vec<u8>> = rows.iter().map(|row| row.bytes().map(|b| b - b'0').collect()).collect();
        let before = cells.clone();
        if flood_bfs(&cells) != *want || cells != before {
            panic!("BFS sai");
        }
        if flood_dfs_in_place(&mut cells) != *want || cells.iter().flatten().any(|&v| v != 0) {
            panic!("DFS sai");
        }
    }
    println!("{}/{} ca đúng", cases.len(), cases.len());
}
