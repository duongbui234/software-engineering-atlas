// Bản đồ kiến thức (trang chủ): vùng = series/region, địa danh = ghi chú khái niệm, tuyến = series.
import { h } from "preact"
import { fm, rel, hubs, lineState, isConcept, isListed, hash, pageDate } from "./shared.js"

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

function slotsFor(count) {
  if (count <= 1) return [{ cx: 480, cy: 205, rx: 410, ry: 165 }]
  const slots = [{ cx: 300, cy: 205, rx: 262, ry: 160 }]
  const k = Math.min(count - 1, 3)
  const band = 360 / k
  for (let i = 0; i < k; i++) {
    slots.push({ cx: 770, cy: 22 + band * (i + 0.5), rx: 165, ry: Math.min(80, band / 2 - 12) })
  }
  return slots
}

function collectRegions(allFiles) {
  const regions = new Map()
  const get = (name) => {
    if (!regions.has(name)) regions.set(name, { name, concepts: [], hub: undefined, lastDate: 0 })
    return regions.get(name)
  }
  const conceptToRegion = new Map()
  for (const hub of hubs(allFiles)) {
    const r = get(fm(hub).region || fm(hub).title)
    r.hub = hub
    const state = lineState(allFiles, hub)
    r.state = state
    r.lastDate = state.latest ? (pageDate(state.latest) || new Date(0)).getTime() : 0
    for (const st of state.stations) for (const c of st.concepts) conceptToRegion.set(String(c).toLowerCase(), r.name)
  }
  for (const f of allFiles) {
    if (!isConcept(f) || !isListed(f)) continue
    const m = fm(f)
    const title = String(m.title || "").toLowerCase()
    const name =
      m.region ||
      conceptToRegion.get(title) ||
      (Array.isArray(m.tags) && m.tags[0] ? `Vùng ${m.tags[0]}` : "Vùng khác")
    get(name).concepts.push(f)
  }
  return [...regions.values()]
    .filter((r) => r.hub || r.concepts.length)
    .sort((a, b) => b.lastDate - a.lastDate || b.concepts.length - a.concepts.length)
    .slice(0, 4)
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
function placeStationLabels(stations, pts, fs, bounds, obstacles) {
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
      const w = Math.max(textW(s.name, fs, true), textW("bạn đang ở đây", fs))
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
function buildLayers({ slug, allFiles, regions, slots, fs, view }) {
  const layers = { contours: [], links: [], routes: [], towns: [], labels: [] }
  const townPos = new Map()
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
      if (ri > 0 && k === 0.6) continue
      layers.contours.push(h("path", { class: cls, d: contour(slot, k, seed) }))
    }
    const rx = slot.cx - slot.rx * 0.72
    const ry = slot.cy - slot.ry * 0.86
    layers.labels.push(h("text", { class: "region", x: rx, y: ry }, region.name))
    const regionBox = boxOf("start", rx, ry, region.name.length * 17 * 0.62, 17)

    // Tuyến series trong vùng
    const reserved = []
    let pts = []
    const labelBoxes = []
    if (region.state && region.state.stations.length) {
      const st = region.state.stations
      const n = st.length
      pts = stationPoints(slot, n)
      reserved.push(...pts)
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

      const labels = placeStationLabels(st, pts, fs, bounds, [regionBox])
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
            h("text", { class: "here-label sub", x: L.ax, y: L.base + fs + 4, "text-anchor": L.anchor }, "bạn đang ở đây"),
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
        `Tuyến ${fm(region.hub).title} đã đi ${region.state.visited} trên ${n} ga${here ? `, đang ở ga ${here.name}` : ""}.`,
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
          townPos.set(c.slug, [x, y])
          layers.towns.push(
            h("a", { href: rel(slug, c.slug), class: "internal", "aria-label": fm(c).title }, [
              h("title", null, fm(c).title),
              h("circle", { class: "village", cx: x, cy: y, r: 3.2 }),
            ]),
          )
        })
      }
    }

    // Địa danh còn lại: ghi chú khái niệm không thuộc ga nào, đặt trên vòng ngoài
    const stationOf = region.stationOf || new Map()
    const cs = region.concepts.filter((c) => stationOf.get(String(fm(c).title || "").toLowerCase()) === undefined || !pts.length)
    cs.forEach((c, i) => {
      const golden = 2.399963
      const a = -Math.PI / 2 + i * golden + seed
      const r = region.state ? 0.86 : 0.25 + 0.6 * Math.sqrt((i + 0.5) / cs.length)
      let x = slot.cx + slot.rx * 0.82 * r * Math.cos(a)
      let y = slot.cy + slot.ry * 0.8 * r * Math.sin(a)
      // tránh đè lên ga
      for (const [px, py] of reserved) {
        if (Math.hypot(px - x, py - y) < 26) y += y < py ? -18 : 18
      }
      townPos.set(c.slug, [x, y])
      const right = x > slot.cx + slot.rx * 0.45
      layers.towns.push(
        h("a", { href: rel(slug, c.slug), class: "internal" }, [
          h("circle", { class: "town done", cx: x, cy: y, r: 6 }),
          h(
            "text",
            { class: "town-label", x: right ? x - 10 : x + 10, y: y + 4, "text-anchor": right ? "end" : "start" },
            fm(c).title,
          ),
        ]),
      )
    })
    if (region.concepts.length)
      descParts.push(`${region.name}: ${region.concepts.map((c) => fm(c).title).join(", ")}.`)
  })

  // Liên kết giữa các khái niệm (wikilink)
  const seen = new Set()
  for (const [from, [x1, y1]] of townPos) {
    const f = allFiles.find((x) => x.slug === from)
    for (const link of (f && f.links) || []) {
      const to = [...townPos.keys()].find((s) => s === link || s.endsWith(`/${String(link).split("/").pop()}`))
      if (!to || to === from) continue
      const key = [from, to].sort().join("|")
      if (seen.has(key)) continue
      seen.add(key)
      const [x2, y2] = townPos.get(to)
      const mx = (x1 + x2) / 2
      const my = (y1 + y2) / 2 - 30
      layers.links.push(h("path", { class: "link", d: `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}` }))
    }
  }

  return {
    children: [...layers.contours, ...layers.labels, ...layers.links, ...layers.routes, ...layers.towns],
    desc: descParts.join(" "),
  }
}

function stationPoints(slot, n) {
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1)
    return [slot.cx - slot.rx * 0.7 + t * slot.rx * 1.4, slot.cy + ZIGZAG[i % ZIGZAG.length] * slot.ry]
  })
}

export function KnowledgeMap({ slug, allFiles }) {
  const regions = collectRegions(allFiles)
  if (regions.length === 0) return null
  const slots = slotsFor(regions.length)

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
    const { children, desc } = buildLayers({ slug, allFiles, regions, slots, fs, view })
    return h("svg", { class: cls, viewBox: `${view.x.toFixed(0)} 0 ${view.w} ${H}`, role: "img", "aria-labelledby": `${id}-t ${id}-d` }, [
      h("title", { id: `${id}-t` }, "Bản đồ kiến thức"),
      h("desc", { id: `${id}-d` }, desc),
      ...children,
    ])
  }
  // cỡ chữ khớp CSS: 12.5px ở bản rộng, 17px ở bản hẹp
  return [svg("map-wide", { x: 0, w: W }, 12.5, "atlas-map-w"), svg("map-narrow", { x: narrowX, w: narrowW }, 17, "atlas-map-n")]
}
