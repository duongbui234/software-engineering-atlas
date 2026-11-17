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

export function KnowledgeMap({ slug, allFiles }) {
  const regions = collectRegions(allFiles)
  if (regions.length === 0) return null
  const slots = slotsFor(regions.length)
  const layers = { contours: [], links: [], routes: [], towns: [], labels: [] }
  const townPos = new Map()
  const descParts = []
  let focusX = 220

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
    layers.labels.push(
      h("text", { class: "region", x: slot.cx - slot.rx * 0.72, y: slot.cy - slot.ry * 0.86 }, region.name),
    )

    // Tuyến series trong vùng
    const reserved = []
    let pts = []
    if (region.state && region.state.stations.length) {
      const st = region.state.stations
      const n = st.length
      pts = st.map((s, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1)
        return [slot.cx - slot.rx * 0.7 + t * slot.rx * 1.4, slot.cy + ZIGZAG[i % ZIGZAG.length] * slot.ry]
      })
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
      st.forEach((s, i) => {
        const [x, y] = pts[i]
        const below = ZIGZAG[i % ZIGZAG.length] > 0
        const ly = below ? y + 24 : y - 14
        const href = s.post ? rel(slug, s.post.slug) : undefined
        if (s.state === "now") focusX = x
        const dot =
          s.state === "now"
            ? [
                h("circle", { class: "here-ring", cx: x, cy: y, r: 9 }),
                h("circle", { class: "here", cx: x, cy: y, r: 7 }),
                h("text", { class: "here-label", x: x + 13, y: y - 6 }, s.name),
                h("text", { class: "here-label sub", x: x + 13, y: y + 10 }, "bạn đang ở đây"),
              ]
            : [
                h("circle", { class: s.state === "done" ? "town done" : "town", cx: x, cy: y, r: s.state === "done" ? 7 : 6 }),
                h("text", { class: s.state === "done" ? "town-label" : "town-label future", x: x - 22, y: ly }, s.name),
              ]
        layers.towns.push(href ? h("a", { href, class: "internal" }, dot) : h("g", null, dot))
      })
      const here = st.find((s) => s.state === "now")
      descParts.push(
        `Tuyến ${fm(region.hub).title} đã đi ${region.state.visited} trên ${n} ga${here ? `, đang ở ga ${here.name}` : ""}.`,
      )
    }

    // Khái niệm thuộc một ga: "làng" nhỏ tụ quanh ga đó, phía không có nhãn ga.
    // Tên hiện khi rê chuột (title) để bản đồ không ngập chữ khi tuyến có hàng chục khái niệm.
    const stationOf = new Map()
    if (region.state) {
      region.state.stations.forEach((s, si) =>
        s.concepts.forEach((name) => stationOf.set(String(name).toLowerCase(), si)),
      )
    }
    const villages = new Map()
    for (const c of region.concepts) {
      const si = stationOf.get(String(fm(c).title || "").toLowerCase())
      if (si === undefined || !pts[si]) continue
      if (!villages.has(si)) villages.set(si, [])
      villages.get(si).push(c)
    }
    for (const [si, list] of villages) {
      const [sx, sy] = pts[si]
      const station = region.state.stations[si]
      // nhãn ga nằm dưới (ZIGZAG > 0) thì làng ở trên và ngược lại; ga "đang ở đây" có nhãn bên phải nên làng ở bên trái
      const [a0, a1] =
        station.state === "now" ? [100, 260] : ZIGZAG[si % ZIGZAG.length] > 0 ? [200, 340] : [20, 160]
      list.forEach((c, i) => {
        const t = list.length === 1 ? 0.5 : i / (list.length - 1)
        const a = ((a0 + t * (a1 - a0)) * Math.PI) / 180
        const r = 21 + (i % 2) * 7
        const x = sx + r * Math.cos(a)
        const y = sy + r * Math.sin(a)
        townPos.set(c.slug, [x, y])
        layers.towns.push(
          h("a", { href: rel(slug, c.slug), class: "internal", "aria-label": fm(c).title }, [
            h("title", null, fm(c).title),
            h("circle", { class: "village", cx: x, cy: y, r: 3.2 }),
          ]),
        )
      })
    }

    // Địa danh còn lại: ghi chú khái niệm không thuộc ga nào, đặt trên vòng ngoài
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

  const children = [
    ...layers.contours,
    ...layers.labels,
    ...layers.links,
    ...layers.routes,
    ...layers.towns,
  ]
  // Bản rộng cho desktop; bản hẹp cho điện thoại, căn quanh vị trí "bạn đang ở đây"
  const narrowW = 440
  const narrowX = Math.max(0, Math.min(W - narrowW, focusX - narrowW / 2))
  const svg = (cls, viewBox, id) =>
    h("svg", { class: cls, viewBox, role: "img", "aria-labelledby": `${id}-t ${id}-d` }, [
      h("title", { id: `${id}-t` }, "Bản đồ kiến thức"),
      h("desc", { id: `${id}-d` }, descParts.join(" ")),
      ...children,
    ])
  return [svg("map-wide", `0 0 ${W} ${H}`, "atlas-map-w"), svg("map-narrow", `${narrowX.toFixed(0)} 0 ${narrowW} ${H}`, "atlas-map-n")]
}
