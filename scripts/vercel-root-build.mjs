import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs"
import { resolve } from "node:path"
import { spawnSync } from "node:child_process"

const repoRoot = process.cwd()
const webAppDir = resolve(repoRoot, "apps/web")
const webNextDir = resolve(webAppDir, ".next")
const rootNextDir = resolve(repoRoot, ".next")

function run(command, args, cwd = repoRoot) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

rmSync(rootNextDir, { recursive: true, force: true })

run("npm", ["run", "build", "--workspace", "@cbideal/web"])

if (!existsSync(webNextDir)) {
  console.error(`Expected Next.js build output at ${webNextDir} but it was not found.`)
  process.exit(1)
}

mkdirSync(rootNextDir, { recursive: true })
cpSync(webNextDir, rootNextDir, { recursive: true })

