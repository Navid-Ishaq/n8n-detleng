import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'dist')
const source = await readFile(join(root, 'src', 'data', 'curriculum.ts'), 'utf8')
const lessonSlugs = [...source.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1])

if (lessonSlugs.length !== 20) throw new Error(`Expected 20 lesson slugs, found ${lessonSlugs.length}`)

const routes = ['login', 'signup', 'dashboard', ...lessonSlugs.map((slug) => `lessons/${slug}`)]
for (const route of routes) {
  const routeDirectory = join(dist, ...route.split('/'))
  await mkdir(routeDirectory, { recursive: true })
  await copyFile(join(dist, 'index.html'), join(routeDirectory, 'index.html'))
}

await copyFile(join(dist, 'index.html'), join(dist, '404.html'))
console.log(`Generated ${routes.length} static routes and a GitHub Pages fallback.`)
