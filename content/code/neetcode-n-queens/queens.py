# N-Queens (LeetCode 51): vét mọi hoán vị, quay lui với ba tập xung đột, đếm bằng bitmask
# Chạy: python3 queens.py

counter = {"calls": 0}


# Đổi danh sách cột (cols[r] là cột của hậu ở hàng r) thành bàn cờ dạng chuỗi
def to_board(cols):
    n = len(cols)
    return ["." * c + "Q" + "." * (n - c - 1) for c in cols]


# Cách 1: mỗi hàng một hậu, mỗi cột một hậu, tức một hoán vị cột; dựng xong mới xét hai đường chéo
def solve_brute(n):
    result, cols, used = [], [], [False] * n

    def walk():
        counter["calls"] += 1
        if len(cols) == n:
            if diagonals_ok(cols):
                result.append(to_board(cols))
            return
        for c in range(n):
            if used[c]:
                continue
            used[c] = True
            cols.append(c)
            walk()
            cols.pop()
            used[c] = False

    walk()
    return result


def diagonals_ok(cols):
    for a in range(len(cols)):
        for b in range(a + 1, len(cols)):
            if abs(cols[a] - cols[b]) == b - a:
                return False
    return True


# Cách 2: đặt từng hàng; ba mảng đánh dấu cột, chéo chính (r - c + n - 1) và chéo phụ (r + c)
def solve_n_queens(n):
    result, cols = [], []
    col_used = [False] * n
    diag = [False] * (2 * n - 1)
    anti = [False] * (2 * n - 1)

    def place(r):
        counter["calls"] += 1
        if r == n:
            result.append(to_board(cols))  # chỉ dựng chuỗi ở lá
            return
        for c in range(n):
            d, a = r - c + n - 1, r + c
            if col_used[c] or diag[d] or anti[a]:
                continue
            col_used[c] = diag[d] = anti[a] = True
            cols.append(c)
            place(r + 1)
            cols.pop()
            col_used[c] = diag[d] = anti[a] = False  # gỡ cả ba dấu

    place(0)
    return result


# Cách 3: chỉ đếm; ba tập là ba số nguyên, bit 1 là cột bị chiếu ở hàng đang xét
def count_bits(n):
    full = (1 << n) - 1

    def go(cols, left, right):
        counter["calls"] += 1
        if cols == full:
            return 1
        count = 0
        free = full & ~(cols | left | right)
        while free:
            bit = free & -free  # bit 1 thấp nhất: một cột còn trống
            free -= bit
            # chéo dịch một cột sang trái hoặc phải khi xuống hàng sau
            count += go(cols | bit, ((left | bit) << 1) & full, (right | bit) >> 1)
        return count

    return go(0, 0, 0)


# Bản sai: quên gỡ dấu chéo phụ khi quay lui
def count_forget_anti(n):
    col_used = [False] * n
    diag = [False] * (2 * n - 1)
    anti = [False] * (2 * n - 1)

    def place(r):
        if r == n:
            return 1
        count = 0
        for c in range(n):
            d, a = r - c + n - 1, r + c
            if col_used[c] or diag[d] or anti[a]:
                continue
            col_used[c] = diag[d] = anti[a] = True
            count += place(r + 1)
            col_used[c] = diag[d] = False
        return count

    return place(0)


# Kiểm tra độc lập: đọc lại bàn cờ từ chuỗi
def valid_board(board, n):
    if len(board) != n:
        return False
    cols, diags, antis = set(), set(), set()
    for r, row in enumerate(board):
        if len(row) != n or row.count("Q") != 1 or set(row) - {"Q", "."}:
            return False
        c = row.index("Q")
        cols.add(c)
        diags.add(r - c)
        antis.add(r + c)
    return len(cols) == len(diags) == len(antis) == n


def key(boards):
    return sorted("/".join(b) for b in boards)


KNOWN = [1, 0, 0, 2, 10, 4, 40, 92, 352]
ok = total = 0


def check(cond, name):
    global ok, total
    total += 1
    if cond:
        ok += 1
    else:
        print("sai ở", name)


for n in range(1, 10):
    check(len(solve_n_queens(n)) == KNOWN[n - 1] and count_bits(n) == KNOWN[n - 1], f"n = {n}")
check(any("/".join(b) == "Q..../..Q../....Q/.Q.../...Q." for b in solve_n_queens(5)), "n = 5 có bàn mẫu")
six = solve_n_queens(6)
check(all(valid_board(b, 6) for b in six), "n = 6 mọi bàn hợp lệ")
check(len({"/".join(b) for b in six}) == len(six), "n = 6 không trùng")
print(f"{ok}/{total} ca đúng")

cross_ok = sum(1 for n in range(1, 8) if key(solve_brute(n)) == key(solve_n_queens(n)))
print(f"{cross_ok}/7 ca đúng (đối chiếu vét mọi hoán vị)")

counter["calls"] = 0
solve_brute(8)
brute = counter["calls"]
counter["calls"] = 0
solve_n_queens(8)
sets = counter["calls"]
counter["calls"] = 0
count_bits(8)
bits = counter["calls"]
print(f"n = 8: vét hoán vị {brute} lượt gọi, ba tập {sets} lượt gọi, bitmask {bits} lượt gọi")
print(f"Quên gỡ chéo phụ: n = 8 ra {count_forget_anti(8)} bàn, đúng là 92")
