// Ga ARR-01, tra cứu bằng hash: ba bài, cùng một khuôn "hỏi bảng, rồi ghi vào bảng".
// Chạy: java hash-lookup.java   (Java 21, không cần javac)
import java.util.*;

class HashLookup {
    // 217: add trả về false khi phần tử đã có, nên "hỏi" và "ghi" gộp thành một lệnh.
    static boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) if (!seen.add(x)) return true;
        return false;
    }

    // 1: Map giá trị → chỉ số; get trả null khi chưa có.
    static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer j = seen.get(target - nums[i]);
            if (j != null) return new int[] {j, i};
            seen.put(nums[i], i);
        }
        return null;
    }

    // 128: ghi hết vào set trước, rồi chỉ đếm từ đầu dãy.
    static int longestConsecutive(int[] nums) {
        Set<Integer> all = new HashSet<>();
        for (int x : nums) all.add(x);
        int best = 0;
        for (int x : all) { // duyệt set, không duyệt nums
            if (all.contains(x - 1)) continue;
            int len = 1;
            while (all.contains(x + len)) len++;
            best = Math.max(best, len);
        }
        return best;
    }

    public static void main(String[] args) {
        Object[][] cases = {
            {"containsDuplicate [1,2,3,1]", containsDuplicate(new int[] {1, 2, 3, 1}), true},
            {"containsDuplicate [1,2,3,4]", containsDuplicate(new int[] {1, 2, 3, 4}), false},
            {"containsDuplicate []", containsDuplicate(new int[] {}), false},
            {"twoSum [2,7,11,15] 9", Arrays.toString(twoSum(new int[] {2, 7, 11, 15}, 9)), "[0, 1]"},
            {"twoSum [3,2,4] 6", Arrays.toString(twoSum(new int[] {3, 2, 4}, 6)), "[1, 2]"},
            {"twoSum [3,3] 6", Arrays.toString(twoSum(new int[] {3, 3}, 6)), "[0, 1]"},
            {"longestConsecutive [100,4,200,1,3,2]", longestConsecutive(new int[] {100, 4, 200, 1, 3, 2}), 4},
            {"longestConsecutive [0,3,7,2,5,8,4,6,0,1]", longestConsecutive(new int[] {0, 3, 7, 2, 5, 8, 4, 6, 0, 1}), 9},
            {"longestConsecutive []", longestConsecutive(new int[] {}), 0},
        };
        int ok = 0;
        for (Object[] c : cases) {
            if (Objects.equals(c[1], c[2])) ok++;
            else System.out.println("SAI " + c[0] + " " + c[1] + " " + c[2]);
        }
        System.out.println(ok + "/" + cases.length + " ca đúng");
    }
}
