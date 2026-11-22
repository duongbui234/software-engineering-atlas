// LeetCode 271, Encode and Decode Strings: ba cách mã hóa và test.
// Chạy: java encode-decode.java
import java.util.*;
import java.util.function.Function;

class EncodeDecode {
    static String joinEncode(List<String> strs) { return String.join(",", strs); } // SAI: [] và [""] cùng ra ""

    static List<String> joinDecode(String s) {
        // split(",") còn bỏ các chuỗi rỗng ở CUỐI: "a,," thành [a], trừ khi truyền limit -1
        return s.isEmpty() ? new ArrayList<>() : Arrays.asList(s.split(",", -1));
    }

    static String escapeEncode(List<String> strs) {
        StringBuilder b = new StringBuilder();
        for (String s : strs) b.append(s.replace("/", "//").replace(",", "/,")).append(',');
        return b.toString();
    }

    static List<String> escapeDecode(String s) {
        List<String> out = new ArrayList<>();
        StringBuilder cur = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (ch == '/') cur.append(s.charAt(++i));
            else if (ch == ',') { out.add(cur.toString()); cur.setLength(0); }
            else cur.append(ch);
        }
        return out;
    }

    static String lengthEncode(List<String> strs) {
        StringBuilder b = new StringBuilder();
        for (String s : strs) b.append(s.length()).append('#').append(s); // length() đếm đơn vị UTF-16, như JS
        return b.toString();
    }

    static List<String> lengthDecode(String s) {
        List<String> out = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int h = s.indexOf('#', i);
            int n = Integer.parseInt(s.substring(i, h));
            out.add(s.substring(h + 1, h + 1 + n));
            i = h + 1 + n;
        }
        return out;
    }

    public static void main(String[] args) {
        List<List<String>> cases = List.of(List.of("neet", "code", "love", "you"), List.of("we", "say", ":", "yes"), List.of(), List.of(""),
            List.of("", ""), List.of("a,b", "c"), List.of("12#ab", "#"), List.of("a/", "/,"), List.of("😀é", "x"));
        Object[][] variants = {
            {"join(\",\")", (Function<List<String>, String>) EncodeDecode::joinEncode, (Function<String, List<String>>) EncodeDecode::joinDecode},
            {"thoát ký tự", (Function<List<String>, String>) EncodeDecode::escapeEncode, (Function<String, List<String>>) EncodeDecode::escapeDecode},
            {"tiền tố độ dài", (Function<List<String>, String>) EncodeDecode::lengthEncode, (Function<String, List<String>>) EncodeDecode::lengthDecode},
        };
        for (Object[] v : variants) {
            @SuppressWarnings("unchecked") var enc = (Function<List<String>, String>) v[1];
            @SuppressWarnings("unchecked") var dec = (Function<String, List<String>>) v[2];
            long ok = cases.stream().filter(c -> dec.apply(enc.apply(c)).equals(c)).count();
            System.out.printf("%-15s %d/%d ca đúng%n", v[0], ok, cases.size());
        }
        System.out.printf("%n\"😀\".length() = %d, codePointCount = %d%n", "😀".length(), "😀".codePointCount(0, "😀".length()));
    }
}
