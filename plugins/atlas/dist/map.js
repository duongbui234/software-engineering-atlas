// Bản đồ kiến thức (trang chủ): vùng = series/region, địa danh = ghi chú khái niệm, tuyến = series.
import { h } from "preact"
import { fm, rel, hubs, lineState, isConcept, isListed, hash, pageDate, STR } from "./shared.js"

const W = 960
const H = 400

/** Đường cong khép kín đi qua các điểm (Catmull-Rom → Bézier). */
function closedPath(points) {
  const n = points.length
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n]
    const p1 = points[i]
    const p2 = points[(i + 1) % n]
    const p3 = points[(i + 2) % n]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d + "Z"
}

function contour(slot, k, seed) {
  const pts = []
  const N = 18
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    const w = 1 + 0.07 * Math.sin(3 * a + seed * 6.28) + 0.045 * Math.sin(5 * a + seed * 11.3)
    pts.push([slot.cx + slot.rx * k * w * Math.cos(a), slot.cy + slot.ry * k * w * Math.sin(a)])
  }
  return closedPath(pts)
}

// Bản đồ trang chủ là "bản đồ chi tiết" của đúng một tuyến: tuyến vừa đi gần nhất.
// Các tuyến khác nằm ở mục lục mảnh bản đồ (sheetIndex) bên dưới, nên số bài, số tuyến
// tăng bao nhiêu thì khung này vẫn chỉ chứa một tuyến.
const SLOT = { cx: 480, cy: 205, rx: 410, ry: 165 }

/** Các tuyến (hub) kèm trạng thái, tuyến vừa đi gần nhất đứng đầu. */
export function linesByRecency(allFiles) {
  return hubs(allFiles)
    .map((hub) => {
      const state = lineState(allFiles, hub)
      return { hub, state, lastDate: state.latest ? (pageDate(state.latest) || new Date(0)).getTime() : 0 }
    })
    .sort((a, b) => b.lastDate - a.lastDate || b.state.visited - a.state.visited)
}

function currentRegion(allFiles) {
  const line = linesByRecency(allFiles).find((l) => l.state.stations.length)
  if (!line) return null
  const names = new Set(line.state.stations.flatMap((st) => st.concepts.map((c) => String(c).toLowerCase())))
  const concepts = allFiles.filter((f) => isConcept(f) && isListed(f) && names.has(String(fm(f).title || "").toLowerCase()))
  return { name: fm(line.hub).region || fm(line.hub).title, hub: line.hub, state: line.state, concepts }
}

const ZIGZAG = [0.32, -0.18, 0.12, -0.34, 0.26, -0.08, 0.3, -0.24]

// --- Đặt nhãn tránh va chạm -------------------------------------------------
// Bề rộng chữ ước lượng theo số ký tự (Be Vietnam Pro trung bình ~0,55em), đủ để so va chạm.
const textW = (s, fs, bold) => String(s).length * fs * (bold ? 0.6 : 0.56)
const boxOf = (anchor, ax, baseline, w, fs, lines = 1, gap = 0) => {
  const x1 = anchor === "end" ? ax - w : anchor === "middle" ? ax - w / 2 : ax
  return { x1, x2: x1 + w, y1: baseline - fs * 0.82, y2: baseline + fs * 0.25 + (lines - 1) * gap }
}
const PAD = 3
function overlap(a, b) {
  const w = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) + PAD
  const h = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) + PAD
  return w > 0 && h > 0 ? w * h : 0
}
const dotBox = (x, y, r) => ({ x1: x - r, x2: x + r, y1: y - r, y2: y + r })

/**
 * Chọn vị trí nhãn cho từng ga: thử bên "tự nhiên" (phía xa đường tuyến) trước, lùi dần xuống
 * hàng thứ hai/ba (có đường dẫn), rồi mới sang phía đối diện. Lấy vị trí đầu tiên không đè lên
 * nhãn khác, chấm ga hay mép bản đồ; nếu không có, lấy vị trí đè ít nhất.
 */
function placeStationLabels(stations, pts, fs, bounds, obstacles, S) {
  const placed = []
  const result = new Array(stations.length)
  const dots = pts.map(([x, y]) => dotBox(x, y, 9))
  const cost = (box, self) => {
    let c = 0
    if (box.x1 < bounds.x1) c += (bounds.x1 - box.x1) * 40
    if (box.x2 > bounds.x2) c += (box.x2 - bounds.x2) * 40
    if (box.y1 < bounds.y1) c += (bounds.y1 - box.y1) * 40
    if (box.y2 > bounds.y2) c += (box.y2 - bounds.y2) * 40
    for (const b of placed) c += overlap(box, b) * 4
    for (const b of obstacles) c += overlap(box, b) * 2
    dots.forEach((d, j) => j !== self && (c += overlap(box, d) * 6))
    return c
  }
  // ga "đang ở đây" đặt trước vì nhãn của nó hai dòng và quan trọng nhất
  const order = stations.map((_, i) => i).sort((a, b) => (stations[b].state === "now") - (stations[a].state === "now"))
  for (const i of order) {
    const s = stations[i]
    const [x, y] = pts[i]
    const now = s.state === "now"
    const lh = fs + 4
    const cands = []
    if (now) {
      const w = Math.max(textW(s.name, fs, true), textW(S.youAreHereLower, fs))
      const two = (anchor, ax, base, side) => ({ anchor, ax, base, side, rows: 0, box: boxOf(anchor, ax, base, w, fs, 2, fs + 4) })
      cands.push(two("start", x + 13, y - 6, "right"), two("end", x - 13, y - 6, "left"))
      for (const k of [0, 1]) {
        cands.push(two("middle", x, y + 14 + fs * 0.8 + k * lh, "below"))
        cands.push(two("middle", x, y - 14 - fs * 1.1 - k * lh, "above"))
      }
    } else {
      const w = textW(s.name, fs)
      const natural = ZIGZAG[i % ZIGZAG.length] > 0 ? 1 : -1
      for (const side of [natural, -natural]) {
        for (let k = 0; k < 4; k++) {
          const base = side > 0 ? y + 12 + fs * 0.82 + k * lh : y - 11 - k * lh
          for (const [anchor, ax] of [["start", x - 22], ["middle", x], ["start", x - 6], ["end", x + 22], ["end", x + 6]]) {
            cands.push({ anchor, ax, base, side: side > 0 ? "below" : "above", rows: k, box: boxOf(anchor, ax, base, w, fs) })
          }
        }
      }
    }
    let best
    let bestCost = Infinity
    for (const c of cands) {
      const v = cost(c.box, i)
      if (v === 0) { best = c; break }
      if (v < bestCost) { bestCost = v; best = c }
    }
    placed.push(best.box)
    result[i] = best
  }
  return result
}

/** Dựng các lớp của bản đồ với cỡ chữ `fs` trong vùng nhìn `view` (bản rộng và bản hẹp có cỡ chữ khác nhau). */
function buildLayers({ slug, allFiles, regions, slots, fs, view, S }) {
  const layers = { contours: [], routes: [], towns: [], labels: [] }
  const descParts = []
  const bounds = { x1: view.x + 4, x2: view.x + view.w - 4, y1: 4, y2: H - 4 }

  regions.forEach((region, ri) => {
    const slot = slots[ri]
    const seed = hash(region.name)
    for (const [k, cls] of [
      [1, "contour major"],
      [0.8, "contour"],
      [0.6, "contour"],
    ]) {
      layers.contours.push(h("path", { class: cls, d: contour(slot, k, seed) }))
    }
    const rx = slot.cx - slot.rx * 0.72
    const ry = slot.cy - slot.ry * 0.86
    layers.labels.push(h("text", { class: "region", x: rx, y: ry }, region.name))
    const regionBox = boxOf("start", rx, ry, region.name.length * 17 * 0.62, 17)

    // Tuyến series trong vùng
    let pts = []
    const labelBoxes = []
    if (region.state && region.state.stations.length) {
      const st = region.state.stations
      const n = st.length
      pts = stationPoints(slot, n)
      const visitedIdx = region.state.reached - 1
      const line = (from, to, cls) =>
        to > from &&
        layers.routes.push(
          h("path", {
            class: cls,
            d: pts.slice(from, to + 1).map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" "),
          }),
        )
      if (visitedIdx >= 0) line(0, visitedIdx, "route")
      line(Math.max(visitedIdx, 0), n - 1, "route ahead")

      const labels = placeStationLabels(st, pts, fs, bounds, [regionBox], S)
      st.forEach((s, i) => {
        const [x, y] = pts[i]
        const L = labels[i]
        labelBoxes.push(L.box)
        const href = s.post ? rel(slug, s.post.slug) : undefined
        const parts = []
        // nhãn bị đẩy ra xa: kẻ đường dẫn mảnh từ ga tới nhãn
        if (L.rows > 0) {
          const ty = L.side === "below" ? L.box.y1 - 1 : L.box.y2 + 1
          const tx = Math.max(L.box.x1 + 4, Math.min(L.box.x2 - 4, x))
          parts.push(h("path", { class: "leader", d: `M${x.toFixed(1)} ${(y + (L.side === "below" ? 8 : -8)).toFixed(1)} L${tx.toFixed(1)} ${ty.toFixed(1)}` }))
        }
        if (s.state === "now") {
          parts.push(
            h("circle", { class: "here-ring", cx: x, cy: y, r: 9 }),
            h("circle", { class: "here", cx: x, cy: y, r: 7 }),
            h("text", { class: "here-label", x: L.ax, y: L.base, "text-anchor": L.anchor }, s.name),
            h("text", { class: "here-label sub", x: L.ax, y: L.base + fs + 4, "text-anchor": L.anchor }, S.youAreHereLower),
          )
        } else {
          parts.push(
            h("circle", { class: s.state === "done" ? "town done" : "town", cx: x, cy: y, r: s.state === "done" ? 7 : 6 }),
            h(
              "text",
              { class: s.state === "done" ? "town-label" : "town-label future", x: L.ax, y: L.base, "text-anchor": L.anchor },
              s.name,
            ),
          )
        }
        layers.towns.push(href ? h("a", { href, class: "internal" }, parts) : h("g", null, parts))
      })
      const here = st.find((s) => s.state === "now")
      descParts.push(
        S.mapLine(S.lineTitleShort(fm(region.hub).title), region.state.visited, n, here && here.name),
      )

      // Khái niệm thuộc một ga: "làng" nhỏ tụ quanh ga đó, phía đối diện nhãn ga.
      // Tên hiện khi rê chuột (title) để bản đồ không ngập chữ khi tuyến có hàng chục khái niệm.
      const stationOf = new Map()
      st.forEach((s, si) => s.concepts.forEach((name) => stationOf.set(String(name).toLowerCase(), si)))
      region.stationOf = stationOf
      const villages = new Map()
      for (const c of region.concepts) {
        const si = stationOf.get(String(fm(c).title || "").toLowerCase())
        if (si === undefined) continue
        if (!villages.has(si)) villages.set(si, [])
        villages.get(si).push(c)
      }
      const hitsLabel = (x, y) => labelBoxes.some((b) => overlap(dotBox(x, y, 3), b) > 0)
      for (const [si, list] of villages) {
        const [sx, sy] = pts[si]
        const side = labels[si].side
        const [a0, a1] = { below: [200, 340], above: [20, 160], right: [100, 260], left: [-80, 80] }[side]
        list.forEach((c, i) => {
          const t = list.length === 1 ? 0.5 : i / (list.length - 1)
          const a = ((a0 + t * (a1 - a0)) * Math.PI) / 180
          // thử vòng gần trước, đè lên nhãn thì đẩy ra vòng xa hơn
          let x, y
          for (const r of [21 + (i % 2) * 7, 28 - (i % 2) * 7, 35, 42]) {
            x = sx + r * Math.cos(a)
            y = sy + r * Math.sin(a)
            if (!hitsLabel(x, y)) break
          }
          layers.towns.push(
            h("a", { href: rel(slug, c.slug), class: "internal", "aria-label": fm(c).title }, [
              h("title", null, fm(c).title),
              h("circle", { class: "village", cx: x, cy: y, r: 3.2 }),
            ]),
          )
        })
      }
    }

    if (region.concepts.length)
      descParts.push(`${region.name}: ${region.concepts.map((c) => fm(c).title).join(", ")}.`)
  })

  return {
    children: [...layers.contours, ...layers.labels, ...layers.routes, ...layers.towns],
    desc: descParts.join(" "),
  }
}

function stationPoints(slot, n) {
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1)
    return [slot.cx - slot.rx * 0.7 + t * slot.rx * 1.4, slot.cy + ZIGZAG[i % ZIGZAG.length] * slot.ry]
  })
}

export function KnowledgeMap({ slug, allFiles, S = STR.vi }) {
  const region = currentRegion(allFiles)
  if (!region) return null
  const regions = [region]
  const slots = [SLOT]

  // Bản hẹp (điện thoại) căn quanh "bạn đang ở đây" của vùng mới nhất (vùng đầu tiên),
  // lệch sang phải để thấy các ga đã đi phía sau.
  let focusX = 220
  const r0 = regions[0]
  if (r0.state && r0.state.stations.length) {
    const i = r0.state.stations.findIndex((s) => s.state === "now")
    if (i >= 0) focusX = stationPoints(slots[0], r0.state.stations.length)[i][0]
  }
  const narrowW = 440
  const narrowX = Math.max(0, Math.min(W - narrowW, focusX - narrowW * 0.62))

  const svg = (cls, view, fs, id) => {
    const { children, desc } = buildLayers({ slug, allFiles, regions, slots, fs, view, S })
    return h("svg", { class: cls, viewBox: `${view.x.toFixed(0)} 0 ${view.w} ${H}`, role: "img", "aria-labelledby": `${id}-t ${id}-d` }, [
      h("title", { id: `${id}-t` }, S.mapTitle),
      h("desc", { id: `${id}-d` }, desc),
      ...children,
    ])
  }
  // cỡ chữ khớp CSS: 12.5px ở bản rộng, 17px ở bản hẹp
  return [svg("map-wide", { x: 0, w: W }, 12.5, "atlas-map-w"), svg("map-narrow", { x: narrowX, w: narrowW }, 17, "atlas-map-n")]
}

// --- Mục lục mảnh bản đồ ------------------------------------------------------
// Mỗi tuyến là một "mảnh" (sheet) như trong một cuốn atlas thật: mã, tên vùng, tên tuyến,
// một đường tiến độ thu nhỏ. Ghi chú khái niệm không thuộc tuyến nào gom theo vùng thành
// "mảnh lẻ". Hiện SHEETS_SHOWN mảnh mới nhất, còn lại gập trong <details>.
const SHEETS_SHOWN = 6
const LOOSE_SHOWN = 5

function miniLine(state) {
  const n = state.stations.length
  return h("span", { class: "ml", style: `--n:${n};--reached:${n > 1 ? Math.max(state.reached - 1, 0) / (n - 1) : 0}`, "aria-hidden": "true" }, [
    h("span", { class: "ml-done" }),
    ...state.stations.map((s) => h("i", { class: s.state })),
  ])
}

export function sheetIndex({ slug, allFiles, fmtDay, S = STR.vi }) {
  const lines = linesByRecency(allFiles)
  const inLine = new Set(lines.flatMap((l) => l.state.stations.flatMap((st) => st.concepts.map((c) => String(c).toLowerCase()))))
  const loose = new Map()
  for (const f of allFiles) {
    if (!isConcept(f) || !isListed(f)) continue
    if (inLine.has(String(fm(f).title || "").toLowerCase())) continue
    const m = fm(f)
    const name = m.region || (Array.isArray(m.tags) && m.tags[0] ? S.regionFromTag(m.tags[0]) : S.otherRegion)
    if (!loose.has(name)) loose.set(name, [])
    loose.get(name).push(f)
  }

  const sheets = [
    ...lines.map(({ hub, state, lastDate }) => {
      const m = fm(hub)
      const here = state.stations.find((s) => s.state === "now")
      const done = state.visited === state.stations.length
      return {
        lastDate,
        node: h("li", { class: "sheet" }, [
          h("a", { class: "internal sheet-link", href: rel(slug, hub.slug) }, [
            h("span", { class: "sheet-head" }, [h("span", { class: "sheet-code" }, state.code), h("span", { class: "sheet-region" }, m.region || "")]),
            h("span", { class: "sheet-t" }, S.lineTitleShort(m.title)),
            miniLine(state),
            h("span", { class: "sheet-meta" }, [
              S.sheetStations(state.visited, state.stations.length),
              done ? S.sheetDone : here ? S.sheetHere(here.n) : "",
              lastDate ? ` · ${fmtDay(new Date(lastDate))}` : "",
            ]),
          ]),
        ]),
      }
    }),
    ...[...loose].map(([name, list]) => {
      list.sort((a, b) => (pageDate(b) || 0) - (pageDate(a) || 0))
      const lastDate = list.length ? (pageDate(list[0]) || new Date(0)).getTime() : 0
      return {
        lastDate: lastDate - 1, // mảnh lẻ xếp sau tuyến cùng ngày
        node: h("li", { class: "sheet loose" }, [
          h("span", { class: "sheet-head" }, [h("span", { class: "sheet-code" }, S.looseCode), h("span", { class: "sheet-region" }, name)]),
          h("span", { class: "sheet-t" }, S.looseCount(list.length)),
          h(
            "span",
            { class: "sheet-towns" },
            list.slice(0, LOOSE_SHOWN).flatMap((c, i) => [i ? " · " : "", h("a", { class: "internal", href: rel(slug, c.slug) }, fm(c).title)]),
          ),
          list.length > LOOSE_SHOWN && h("span", { class: "sheet-meta" }, S.looseMore(list.length - LOOSE_SHOWN)),
        ]),
      }
    }),
  ].sort((a, b) => b.lastDate - a.lastDate)

  if (!sheets.length) return null
  const shown = sheets.slice(0, SHEETS_SHOWN).map((s) => s.node)
  const rest = sheets.slice(SHEETS_SHOWN).map((s) => s.node)
  return h("section", { class: "sheets", "aria-labelledby": "sh-h" }, [
    h("h2", { id: "sh-h" }, S.sheetsTitle),
    h("p", { class: "sheets-lede" }, S.sheetsLede(lines.length)),
    h("ol", { class: "sheet-grid" }, shown),
    rest.length > 0 &&
      h("details", { class: "sheets-more" }, [
        h("summary", null, S.sheetsAll(sheets.length)),
        h("ol", { class: "sheet-grid" }, rest),
      ]),
  ])
}
