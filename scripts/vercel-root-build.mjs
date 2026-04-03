import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs"
import { resolve } from "node:path"
import { spawnSync } from "node:child_process"

const repoRoot = process.cwd()
const rootNextDir = resolve(repoRoot, ".next")
const targets = {
  web: {
    workspace: "@cbideal/web",
    nextDir: resolve(repoRoot, "apps/web/.next"),
  },
  app: {
    workspace: "@cbideal/app",
    nextDir: resolve(repoRoot, "apps/app/.next"),
  },
}

const appProjectHints = [
  "cbideal-app.vercel.app",
  "cbideal-app",
  "app.cbideal.nl",
  "-app-",
]

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

function buildWorkspace(target) {
  const config = targets[target]

  if (!config) {
    console.error(`Unknown build target "${target}". Expected "web" or "app".`)
    process.exit(1)
  }

  rmSync(rootNextDir, { recursive: true, force: true })
  run("npm", ["run", "build", "--workspace", config.workspace])

  if (!existsSync(config.nextDir)) {
    console.error(`Expected Next.js build output at ${config.nextDir} but it was not found.`)
    process.exit(1)
  }

  mkdirSync(rootNextDir, { recursive: true })
  cpSync(config.nextDir, rootNextDir, { recursive: true })
}

function inferVercelTarget() {
  const explicitTarget = process.env.CBIDEAL_BUILD_TARGET

  if (explicitTarget) {
    return explicitTarget
  }

  const projectHints = [
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    process.env.PROJECT_DOMAIN,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  if (appProjectHints.some((hint) => projectHints.includes(hint))) {
    return "app"
  }

  return "web"
}

if (process.env.VERCEL) {
  buildWorkspace(inferVercelTarget())
} else {
  run("npm", ["run", "build:all"])
}
