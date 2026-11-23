# Ga ARR-07: ngăn xếp đơn điệu. Giải 739, 853 và 84, tự chạy test.
# Chạy: python3 monotonic_stack_station.py


def daily_temperatures(t: list[int]) -> list[int]:  # 739
    out = [0] * len(t)
    stack: list[int] = []
    for i, x in enumerate(t):
        while stack and x > t[stack[-1]]:
            j = stack.pop()
            out[j] = i - j
        stack.append(i)
    return out


def car_fleet(target: int, position: list[int], speed: list[int]) -> int:  # 853
    cars = sorted(zip(position, speed), reverse=True)  # gần đích nhất trước
    fleets: list[float] = []
    for p, s in cars:
        time = (target - p) / s  # / ra float; // sẽ làm tròn xuống và gộp nhầm hai đoàn
        if not fleets or time > fleets[-1]:
            fleets.append(time)
    return len(fleets)


def largest_rectangle_area(h: list[int]) -> int:  # 84
    stack: list[int] = []
    best = 0
    for i in range(len(h) + 1):
        cur = h[i] if i < len(h) else 0
        while stack and cur < h[stack[-1]]:
            height = h[stack.pop()]
            left = stack[-1] if stack else -1
            best = max(best, height * (i - left - 1))
        stack.append(i)
    return best


tests = [
    daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0],
    daily_temperatures([70, 70, 71]) == [2, 1, 0],
    car_fleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]) == 3, car_fleet(10, [3], [3]) == 1, car_fleet(100, [0, 2, 4], [4, 2, 1]) == 1,
    largest_rectangle_area([2, 1, 5, 6, 2, 3]) == 10, largest_rectangle_area([2, 4]) == 4,
    largest_rectangle_area([2, 2, 2]) == 6, largest_rectangle_area([6, 2, 5, 4, 5, 1, 6]) == 12,
]
print(f"{sum(tests)}/{len(tests)} ca đúng")
