// Loads TypeScript modules from src/ (with the @/ alias) through Vite's SSR loader,
// so build scripts can read the same static data the site renders.
import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url))

export async function withDataLoader(run) {
  const server = await createServer({
    root: projectRoot,
    configFile: false,
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    // Scripts only SSR-load data modules; skip the browser dependency pre-scan.
    optimizeDeps: { noDiscovery: true, include: [] },
    resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
  })
  try {
    return await run((path) => server.ssrLoadModule(path))
  } finally {
    await server.close()
  }
}
