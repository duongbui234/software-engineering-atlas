# Design System: Software Engineering Atlas

> Nguồn sự thật cho mọi giao diện của blog. Khi dựng trang cụ thể, kiểm tra
> `design-system/software-engineering-atlas/pages/<trang>.md` trước; nếu có, quy tắc ở đó ghi đè file này.
> Bản mẫu tham chiếu: `prototype/` (index, post, series).

## Hướng thiết kế: Cartographic Atlas

Blog là một tấm bản đồ kiến thức. Ngôn ngữ hình ảnh lấy từ **bản đồ địa hình** (topographic map), không phải tạp chí:
mỗi bài là một địa danh có tọa độ, series là một tuyến metro, khái niệm là các điểm nối nhau thành graph.

**Sự táo bạo chỉ dồn vào một chỗ:** khung neatline có vạch chia độ bao quanh mỗi trang + bản đồ (trang chủ) / tuyến metro (hub series).
Mọi thứ khác yên tĩnh, kỷ luật.

## Token màu

| Token | Sáng ("giấy bản đồ") | Tối ("bản đồ đêm") | Dùng cho |
|---|---|---|---|
| `--paper` | `#F1F1EA` | `#0F1B23` | nền trong neatline |
| `--paper-2` | `#E5E7DC` | `#0A141A` | lề ngoài neatline, nền iframe |
| `--ink` | `#1B2228` | `#E4E6DF` | chữ chính, neatline, đường kẻ chính |
| `--ink-2` | `#4A5560` | `#A3AFB8` | chữ phụ, ga chưa đi |
| `--water` | `#1F5F8B` | `#7DB7DE` | link, ký hiệu bài `learn` |
| `--contour` | `#9A6B3F` | `#B98E62` | đường đồng mức, tên vùng, viền code, ký hiệu bài `code` |
| `--survey` | `#C62D1F` | `#FF6B5B` | "bạn đang ở đây", tiến độ, focus ring. **Chỉ dùng cho vị trí/tiến độ** |
| `--grid` | `#D3D5C8` | `#22333F` | vạch mảnh, phân cách hàng |
| `--code-bg` | `#E8EAE0` | `#152530` | nền code |

- Không dùng hex trực tiếp trong component; luôn qua token.
- Mọi cặp chữ/nền đạt ≥ 4.5:1 ở cả hai theme. Kiểm tra lại khi thêm màu.
- Dark mode: `@media (prefers-color-scheme: dark)` với `:root:not([data-theme="light"])` + `:root[data-theme="dark"]`.

## Typography

| Vai trò | Font | Ghi chú |
|---|---|---|
| Tiêu đề, tên brand, tiêu đề bài trong danh mục | **Fraunces** (variable: `opsz`, `SOFT`) | H1 `opsz 144, SOFT 30`; tên vùng trên bản đồ: italic, giãn chữ `.08em` (quy ước bản đồ) |
| Thân bài, UI | **Be Vietnam Pro** 400/500/600 | 17px desktop, 16px mobile, line-height 1.7 |
| Mã tọa độ, code, số liệu đo | **JetBrains Mono** 400/500 | `font-variant-ligatures: none` trong code (tránh `===` thành `≡`) |

- Cả 3 font có subset tiếng Việt. Tải bằng một link Google Fonts duy nhất, `display=swap`.
- Độ dài dòng thân bài: `--measure: 40rem` (~70 ký tự).
- Không viết HOA toàn bộ cho nhãn; không tô màu riêng một từ trong tiêu đề; không ghép meta bằng dấu `·` thành chuỗi trang trí (dùng danh sách `<dl>` hoặc câu tự nhiên).

## Hệ ký hiệu (legend)

| Loại bài (`type`) | Ký hiệu | Màu |
|---|---|---|
| `learn` | ● tròn | `--water` |
| `code` | ■ vuông | `--contour` |
| `note` | ▲ tam giác | `--ink-2` |

Ký hiệu luôn đi kèm nhãn chữ hoặc `aria-label` (không truyền nghĩa chỉ bằng màu/hình).

## Mã tọa độ

`<SERIES>-<NN>` cho bài thuộc series (vd `API-04`), `NOTE-<NNN>` cho ghi chú, `PRJ-<NN>` cho bài đọc code dự án.
Hiện ở cột lề trái bài viết, đầu mỗi hàng trong danh mục, và góc neatline.

## Component

- **Neatline (`.sheet`)**: viền đôi (border + outline lệch 5px), vạch chia độ mỗi 48px ở 4 cạnh. Chú thích lề (`.corner`) nằm **ngoài** khung, chữ mono 11px.
- **Bản đồ kiến thức (trang chủ)**: SVG; vùng = đường đồng mức `--contour`; khái niệm = địa danh (tròn: learn, vuông: code); tuyến series = đường `--survey` (đặc: đã đi, chấm: chưa đi); vị trí hiện tại có vòng "ping" (tắt khi reduced-motion). Nhãn có halo `paint-order: stroke` màu `--paper`. Mobile: `preserveAspectRatio="xMinYMid slice"`, cao 19rem, nhãn to hơn.
- **Thước tỉ lệ**: bar đen/trắng xen kẽ + vạch `--survey` tại số bài đã viết.
- **Danh mục bài (gazetteer)**: lưới `mã | ký hiệu | tiêu đề + mô tả | ngày`; hover tô nền `--water` 6%.
- **Dải tuyến mini (đầu bài series)**: 6 ga, đã đi = chấm đặc `--survey`, ga hiện tại = vòng dày, chưa đi = vòng rỗng + ray chấm.
- **Metro hub series**: ga 2.2rem có số; ray đã đi vẽ dần một lần khi tải trang (duy nhất một chuyển động có chủ đích); khái niệm treo dưới ga. Mobile chuyển sang dọc.
- **Bài viết**: lưới 3 cột `lề 9.5rem | thân | rail 14rem`. Lề = `<dl>` tọa độ/loại/ngày/thời gian đọc/mức/thẻ. Rail = mục lục, "Lân cận trên bản đồ" (graph cục bộ), backlinks. ≤ 68rem: rail xuống dưới; ≤ 44rem: một cột, lề thành dải 3 cột.
- **Khung archify (`.figure-map`)**: viền `--ink`, nền `--paper-2`, iframe `data-archify="<path>"`, JS gắn `src = path + "?embed=1&theme=<light|dark>"` và cập nhật khi đổi theme. Chiều cao theo `--ar` (tỉ lệ của sơ đồ, mặc định 4/3; mobile 3/4). Luôn có caption "Hình N." + link "Mở toàn màn hình".
- **TL;DR ("Đọc nhanh")**: khung viền `--ink`, không nền màu.
- **Tự kiểm tra**: `<details>` với dấu `+`/`–` màu `--survey`.
- **Code**: nền `--code-bg`, viền trái 3px `--contour`.

## Chuyển động

- Không dùng GSAP hay thư viện animation.
- Chỉ: hover/focus 150ms; ray metro vẽ dần 1 lần; vòng ping vị trí hiện tại.
- `prefers-reduced-motion: reduce` tắt toàn bộ animation/transition.

## Khả năng tiếp cận

- Focus ring 2px `--survey`, offset 3px.
- Có skip link "Bỏ qua, tới nội dung".
- Nút/link điều hướng cao tối thiểu 2.5rem.
- SVG bản đồ có `<title>` + `<desc>` mô tả trạng thái tuyến.
- Theme toggle có `aria-pressed`; nhãn đổi giữa "Bản đồ đêm" / "Bản đồ ngày".

## Cấm

- Thẻ card bo góc đổ bóng xếp lưới; gradient trang trí; emoji làm icon.
- Nền ngà + accent terracotta (cliché); `--survey` dùng cho thứ không phải vị trí/tiến độ.
- Hiệu ứng fade/slide khi cuộn cho từng section.
- Sơ đồ archify không có caption hoặc không có link mở toàn màn hình.
