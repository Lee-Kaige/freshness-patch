import { copyFileSync, mkdirSync } from 'node:fs'

for (const id of ['paris', 'athens', 'teamlab']) {
  const route = new URL(`../dist/post/${id}/`, import.meta.url)
  mkdirSync(route, { recursive: true })
  copyFileSync(new URL('../dist/index.html', import.meta.url), new URL('index.html', route))
}
