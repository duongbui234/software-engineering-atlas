fn car_fleet(target: i32, position: &[i32], speed: &[i32]) -> usize {
    let mut cars: Vec<_> = position
        .iter()
        .copied()
        .zip(speed.iter().copied())
        .collect();
    cars.sort_unstable_by_key(|&(start, _)| std::cmp::Reverse(start));
    let mut fleets = 0;
    let (mut last_distance, mut last_speed) = (0_i64, 1_i64);
    for (start, velocity) in cars {
        let (distance, velocity) = (i64::from(target - start), i64::from(velocity));
        if distance * last_speed > last_distance * velocity {
            fleets += 1;
            (last_distance, last_speed) = (distance, velocity);
        }
    }
    fleets
}

fn main() {
    let cases: &[(i32, &[i32], &[i32], usize)] = &[
        (12, &[10, 8, 0, 5, 3], &[2, 4, 1, 1, 3], 3),
        (10, &[3], &[3], 1),
        (100, &[0, 2, 4], &[4, 2, 1], 1),
        (10, &[6, 8], &[2, 1], 1),
        (1000000, &[0, 1], &[999999, 1000000], 2),
    ];
    for &(target, position, speed, expected) in cases {
        assert_eq!(car_fleet(target, position, speed), expected);
    }
    println!("{0}/{0} ca đúng", cases.len());
}
