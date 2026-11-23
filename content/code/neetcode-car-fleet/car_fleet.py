# LeetCode 853, Car Fleet: các cách giải và test.
# Chạy: python3 car_fleet.py


def sort_stack(target: int, position: list[int], speed: list[int]) -> int:
    stack: list[float] = []
    for p, s in sorted(zip(position, speed), reverse=True):  # reverse=True: xe gần đích trước
        t = (target - p) / s  # "/" luôn ra float trong Python 3
        if not stack or t > stack[-1]:
            stack.append(t)
    return len(stack)


def sort_cross_multiply(target: int, position: list[int], speed: list[int]) -> int:
    fleets, lead_d, lead_s = 0, 0, 1
    for p, s in sorted(zip(position, speed), reverse=True):
        d = target - p
        if fleets == 0 or d * lead_s > lead_d * s:  # int Python không tràn, nhân chéo luôn đúng
            fleets, lead_d, lead_s = fleets + 1, d, s
    return fleets


def bucket_by_position(target: int, position: list[int], speed: list[int]) -> int:
    time_at = [-1.0] * target
    for p, s in zip(position, speed):
        time_at[p] = (target - p) / s
    fleets, lead = 0, -1.0
    for t in reversed(time_at):
        if t >= 0 and t > lead:
            fleets, lead = fleets + 1, t
    return fleets


def sort_ascending(target: int, position: list[int], speed: list[int]) -> int:  # SAI: quên reverse=True
    fleets, lead = 0, -1.0
    for p, s in sorted(zip(position, speed)):
        t = (target - p) / s
        if t > lead:
            fleets, lead = fleets + 1, t
    return fleets


cases = [
    (12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3], 3), (10, [3], [3], 1), (100, [0, 2, 4], [4, 2, 1], 1),
    (10, [6, 8], [3, 2], 2), (10, [0, 4, 2], [2, 1, 3], 1), (4, [3, 1], [3, 9], 1), (20, [6, 2, 17], [3, 9, 2], 2),
]
for fn in (sort_stack, sort_cross_multiply, bucket_by_position, sort_ascending):
    bad = [f"t={t} {p}" for t, p, s, want in cases if fn(t, p, s) != want]
    print(f"{fn.__name__:20} {len(cases) - len(bad)}/{len(cases)} ca đúng" + (f"; sai ở {' '.join(bad)}" if bad else ""))
