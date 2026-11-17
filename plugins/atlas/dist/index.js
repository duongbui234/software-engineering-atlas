// Entry của plugin Atlas.
// - Frame "atlas" (frames.js) được Quartz nạp qua manifest `quartz.frames`.
// - Emitter mặc định: copy nguyên vẹn content/diagrams/** và content/code/** ra public/.
//   Asset emitter của Quartz bỏ đuôi .html và đổi tên file trùng tên thư mục thành index,
//   nên sơ đồ archify (.html) và file code ví dụ phải đi đường riêng. Hai thư mục này
//   nằm trong configuration.ignorePatterns để Quartz không copy lần nữa.
import fs from "node:fs"
import path from "node:path"

export * from "./components.js"
export { AtlasFrame } from "./frames.js"

const VERBATIM_DIRS = ["diagrams", "code"]
// receipt của archify là bằng chứng build, không phải nội dung
const SKIP = /\.(finalize|finalize-summary|browser-check|delivery)\.json$/

function* walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (entry.isFile() && !SKIP.test(entry.name)) yield full
  }
}

async function* copyVerbatim(ctx) {
  const contentDir = ctx.argv.directory
  for (const sub of VERBATIM_DIRS) {
    const root = path.join(contentDir, sub)
    for (const src of walk(root)) {
      const dest = path.join(ctx.argv.output, path.relative(contentDir, src))
      await fs.promises.mkdir(path.dirname(dest), { recursive: true })
      await fs.promises.copyFile(src, dest)
      yield dest
    }
  }
}

export default function AtlasVerbatimAssets() {
  return {
    name: "AtlasVerbatimAssets",
    async *emit(ctx) {
      yield* copyVerbatim(ctx)
    },
    async *partialEmit(ctx) {
      yield* copyVerbatim(ctx)
    },
  }
}
